// apiClient.ts
export type Query = Record<string, unknown> | URLSearchParams | undefined;

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

export interface ApiClientOptions {
  baseURL?: string;
  headers?: HeadersInit;
  /** 매 요청 직전 토큰을 읽어 Authorization 헤더에 주입 */
  getToken?: () => string | null;
  /** 401 발생 시 새 토큰을 받아와 한 번만 재시도 */
  refresh?: () => Promise<string | null>;
  /** 전역 에러 콜백 */
  onError?: (err: ApiError) => void;
  /** 요청 타임아웃(ms) */
  timeoutMs?: number; // default 15000
}

/* -------------------- 내부 유틸 -------------------- */
function toSearchParams(input?: Query): URLSearchParams | undefined {
  if (!input) return undefined;
  if (input instanceof URLSearchParams) return input;

  const sp = new URLSearchParams();
  Object.entries(input).forEach(([k, v]) => {
    if (v == null) return;
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

  if (ct?.includes("application/json")) return (await res.json()) as T;
  if (ct?.startsWith("text/") || ct === "application/xml") {
    return (await res.text()) as unknown as T;
  }
  return (await res.blob()) as unknown as T;
}

function isBodyLike(v: unknown): v is BodyInit {
  return v instanceof FormData || v instanceof Blob || v instanceof ArrayBuffer;
}

/* -------------------- 본체 -------------------- */
export class ApiClient {
  private cfg: ApiClientOptions;

  constructor(options?: ApiClientOptions) {
    this.cfg = {
      baseURL: options?.baseURL,
      headers: options?.headers ?? {},
      getToken: options?.getToken,
      refresh: options?.refresh,
      onError: options?.onError,
      timeoutMs: options?.timeoutMs ?? 15000,
    };
  }

  async request<T>(
    method: string,
    url: string,
    paramsOrBody?: unknown,
    init?: RequestInit,
    isRetry = false,
  ): Promise<T> {
    const controller = new AbortController();
    const isQuery =
      method.toUpperCase() === "GET" || method.toUpperCase() === "DELETE";

    const finalUrl = (() => {
      const full = joinURL(this.cfg.baseURL, url);
      if (!isQuery) return full;
      const sp = toSearchParams(paramsOrBody as Query);
      if (!sp) return full;
      const hasQ = full.includes("?");
      return `${full}${hasQ ? "&" : "?"}${sp.toString()}`;
    })();

    const headers = new Headers(this.cfg.headers);
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

    // 토큰 주입
    if (this.cfg.getToken) {
      const token = this.cfg.getToken();
      if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    const reqInit: RequestInit = {
      ...init,
      method,
      headers,
      body,
      signal: controller.signal,
    };

    const timeoutId = setTimeout(() => controller.abort(), this.cfg.timeoutMs);

    try {
      const res = await fetch(finalUrl, reqInit);
      const data = (await parseResponse<T>(res)) as T;

      if (!res.ok) {
        if (res.status === 401 && !isRetry && this.cfg.refresh) {
          try {
            const newToken = await this.cfg.refresh();
            if (newToken) {
              headers.set("Authorization", `Bearer ${newToken}`);
              return this.request<T>(
                method,
                url,
                paramsOrBody,
                { ...init, headers },
                true,
              );
            }
          } catch {}
        }

        const err = new ApiError(
          `Request failed with status ${res.status}`,
          res.status,
          finalUrl,
          data,
        );
        this.cfg.onError && this.cfg.onError(err);
        throw err;
      }

      return data;
    } catch (e) {
      const err =
        e instanceof ApiError
          ? e
          : new ApiError(
              controller.signal.aborted
                ? "Request aborted"
                : (e as Error).message,
              controller.signal.aborted ? 499 : 0,
              finalUrl,
            );
      this.cfg.onError && this.cfg.onError(err);
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  get<T = unknown, TPP extends Query = Query>(
    url: string,
    params?: TPP,
    init?: RequestInit,
  ) {
    return this.request<T>("GET", url, params, init);
  }
  delete<T = unknown, TPP extends Query = Query>(
    url: string,
    params?: TPP,
    init?: RequestInit,
  ) {
    return this.request<T>("DELETE", url, params, init);
  }
  post<T = unknown, TBB = unknown>(
    url: string,
    body?: TBB,
    init?: RequestInit,
  ) {
    return this.request<T>("POST", url, body, init);
  }
  put<T = unknown, TBB = unknown>(url: string, body?: TBB, init?: RequestInit) {
    return this.request<T>("PUT", url, body, init);
  }
  patch<T = unknown, TBB = unknown>(
    url: string,
    body?: TBB,
    init?: RequestInit,
  ) {
    return this.request<T>("PATCH", url, body, init);
  }
}
