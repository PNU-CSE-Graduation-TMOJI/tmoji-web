import { useApi } from ".";

const BASE_URL: string = import.meta.env.VITE_API_URL;

const { api, loading, error, abortAll } = useApi({
  baseURL: BASE_URL,
  // getToken: () => localStorage.getItem("access_token"),
  // refresh: async () => {
  //   // 예시: 리프레시 토큰으로 새 액세스 토큰 발급 후 반환
  //   const res = await fetch("/auth/refresh", { method: "POST", credentials: "include" });
  //   if (!res.ok) return null;
  //   const { accessToken } = await res.json();
  //   localStorage.setItem("access_token", accessToken);
  //   return accessToken;
  // },
  timeoutMs: 10000,
});

export default api;
