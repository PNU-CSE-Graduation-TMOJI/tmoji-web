// useApi.ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Query = Record<string, unknown> | URLSearchParams | undefined;

export class ApiError<T = unknown> extends Error {
  status: number;
  data?: T;
  url: string;
  constructor(message: string, status: number, url: string, data?: T) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.url = url;
    this.data = data;
  }
}

export interface UseApiOptions {
  baseURL?: string;
  headers?: HeadersInit;
  /** 매 요청 직전 토큰을 읽어 Authorization 헤더에 주입 */
  getToken?: () => string | null;
  /** 401 발생 시 새 토큰을 받아와 한 번만 재시도 (새 토큰 문자열을 반환) */
  refresh?: () => Promise<string | null>;
  /** 전역 에러 콜백 */
  onError?: (err: ApiError) => void;
  /** 요청 타임아웃(ms) */
  timeoutMs?: number; // default 15000
}

export interface UseApiReturn {
  api: {
    get: <T = unknown, TPP extends Query = Query>(
      url: string,
      params?: TPP,
      init?: RequestInit,
    ) => Promise<T>;
    delete: <T = unknown, TPP extends Query = Query>(
      url: string,
      params?: TPP,
      init?: RequestInit,
    ) => Promise<T>;
    post: <T = unknown, TBB = unknown>(
      url: string,
      body?: TBB,
      init?: RequestInit,
    ) => Promise<T>;
    put: <T = unknown, TBB = unknown>(
      url: string,
      body?: TBB,
      init?: RequestInit,
    ) => Promise<T>;
    patch: <T = unknown, TBB = unknown>(
      url: string,
      body?: TBB,
      init?: RequestInit,
    ) => Promise<T>;
    /** 필요 시 임의 메서드 */
    request: <T = unknown>(
      method: string,
      url: string,
      paramsOrBody?: unknown,
      init?: RequestInit,
    ) => Promise<T>;
  };
  loading: boolean;
  error: ApiError | null;
  lastResponse: unknown;
  abortAll: () => void;
}

/* -------------------- 내부 유틸 -------------------- */
function toSearchParams(input?: Query): URLSearchParams | undefined {
  if (!input) return undefined;
  if (input instanceof URLSearchParams) return input;

  const sp = new URLSearchParams();
  Object.entries(input).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) {
      v.forEach((item) => sp.append(k, serialize(item)));
    } else {
      sp.append(k, serialize(v));
    }
  });
  return sp;

  function serialize(v: unknown): string {
    if (v instanceof Date) return v.toISOString();
    if (typeof v === "object") return JSON.stringify(v);
    return String(v);
  }
}

function joinURL(baseURL: string | undefined, url: string): string {
  if (!baseURL) return url;
  if (/^https?:\/\//i.test(url)) return url;
  return `${baseURL.replace(/\/+$/, "")}/${url.replace(/^\/+/, "")}`;
}

async function parseResponse<T>(res: Response): Promise<T | undefined> {
  if (res.status === 204) return undefined;
  const ct = res.headers
    .get("Content-Type")
    ?.split(";")[0]
    .trim()
    .toLowerCase();

  if (ct?.includes("application/json")) {
    return (await res.json()) as T;
  }
  if (ct?.startsWith("text/") || ct === "application/xml") {
    return (await res.text()) as unknown as T;
  }
  // 그 외는 Blob으로 처리 (파일 다운로드 등)
  return (await res.blob()) as unknown as T;
}

function isBodyLike(v: unknown): v is BodyInit {
  return v instanceof FormData || v instanceof Blob || v instanceof ArrayBuffer;
}

/* -------------------- 훅 본체 -------------------- */
export function useApi(options?: UseApiOptions): UseApiReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [lastResponse, setLastResponse] = useState<unknown>(null);
  const controllers = useRef<Set<AbortController>>(new Set());

  const cfg = useMemo(
    () => ({
      baseURL: options?.baseURL,
      headers: options?.headers,
      getToken: options?.getToken,
      refresh: options?.refresh,
      onError: options?.onError,
      timeoutMs: options?.timeoutMs ?? 15000,
    }),
    [options],
  );

  const abortAll = useCallback(() => {
    controllers.current.forEach((c) => c.abort());
    controllers.current.clear();
  }, []);

  useEffect(() => abortAll, [abortAll]); // 언마운트 시 전체 취소

  const coreRequest = useCallback(
    async <T>(
      method: string,
      url: string,
      paramsOrBody?: unknown,
      init?: RequestInit,
      isRetry = false,
    ): Promise<T> => {
      const controller = new AbortController();
      controllers.current.add(controller);
      setLoading(true);
      setError(null);

      // 외부 signal과 결합
      if (init?.signal) {
        if (init.signal.aborted) controller.abort();
        else
          init.signal.addEventListener("abort", () => controller.abort(), {
            once: true,
          });
      }

      const isQuery =
        method.toUpperCase() === "GET" || method.toUpperCase() === "DELETE";
      const finalUrl = (() => {
        const full = joinURL(cfg.baseURL, url);
        if (!isQuery) return full;
        const sp = toSearchParams(paramsOrBody as Query);
        if (!sp) return full;
        const hasQ = full.includes("?");
        return `${full}${hasQ ? "&" : "?"}${sp.toString()}`;
      })();

      // 헤더 구성 (기본 + 사용자 지정 + 토큰)
      const headers = new Headers(cfg.headers || {});
      // body가 JSON이면 Content-Type 자동 설정
      let body: BodyInit | undefined;
      if (!isQuery && paramsOrBody !== undefined) {
        if (isBodyLike(paramsOrBody)) {
          body = paramsOrBody;
        } else {
          if (!headers.has("Content-Type"))
            headers.set("Content-Type", "application/json");
          body = JSON.stringify(paramsOrBody);
        }
      }
      // Authorization
      const token = cfg.getToken?.();
      if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      const reqInit: RequestInit = {
        ...init,
        method,
        headers,
        body,
        signal: controller.signal,
      };

      // 타임아웃
      const timeoutId = setTimeout(() => controller.abort(), cfg.timeoutMs);

      try {
        const res = await fetch(finalUrl, reqInit);
        const data = (await parseResponse<T>(res)) as T;

        if (!res.ok) {
          // 401 + refresh 전략
          if (res.status === 401 && cfg.refresh && !isRetry) {
            try {
              const newToken = await cfg.refresh();
              if (newToken) {
                // 새 토큰으로 재시도
                headers.set("Authorization", `Bearer ${newToken}`);
                const retry = await coreRequest<T>(
                  method,
                  url,
                  paramsOrBody,
                  { ...init, headers },
                  true,
                );
                setLastResponse(retry as unknown);
                return retry;
              }
            } catch {
              // refresh 실패 시 아래 에러 처리로
            }
          }

          const err = new ApiError(
            `Request failed with status ${res.status}`,
            res.status,
            finalUrl,
            data,
          );
          setError(err);
          cfg.onError?.(err);
          throw err;
        }

        setLastResponse(data as unknown);
        return data;
      } catch (e) {
        // fetch 자체 에러(네트워크/타임아웃/abort)
        const aborted = controller.signal.aborted;
        const err =
          e instanceof ApiError
            ? e
            : new ApiError(
                aborted
                  ? "Request aborted"
                  : (e as Error).message || "Network error",
                aborted ? 499 : 0,
                finalUrl,
              );
        setError(err);
        cfg.onError?.(err);
        throw err;
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
        controllers.current.delete(controller);
      }
    },
    [cfg],
  );

  const get = useCallback(
    <T = unknown, TPP extends Query = Query>(
      url: string,
      params?: TPP,
      init?: RequestInit,
    ) => coreRequest<T>("GET", url, params, init),
    [coreRequest],
  );
  const del = useCallback(
    <T = unknown, TPP extends Query = Query>(
      url: string,
      params?: TPP,
      init?: RequestInit,
    ) => coreRequest<T>("DELETE", url, params, init),
    [coreRequest],
  );
  const post = useCallback(
    <T = unknown, TBB = unknown>(url: string, body?: TBB, init?: RequestInit) =>
      coreRequest<T>("POST", url, body, init),
    [coreRequest],
  );
  const put = useCallback(
    <T = unknown, TBB = unknown>(url: string, body?: TBB, init?: RequestInit) =>
      coreRequest<T>("PUT", url, body, init),
    [coreRequest],
  );
  const patch = useCallback(
    <T = unknown, TBB = unknown>(url: string, body?: TBB, init?: RequestInit) =>
      coreRequest<T>("PATCH", url, body, init),
    [coreRequest],
  );

  return {
    api: { get, delete: del, post, put, patch, request: coreRequest },
    loading,
    error,
    lastResponse,
    abortAll,
  };
}
