import { ApiClient } from "@/api/core";

const BASE_URL: string = import.meta.env.VITE_API_URL;

const client = new ApiClient({
  baseURL: BASE_URL,
  getToken: () => localStorage.getItem("access_token"),
  refresh: async () => {
    // refresh 요청 → 새 토큰 저장
    const res = await fetch("/refresh");
    const { token } = await res.json();
    localStorage.setItem("access_token", token);
    return token;
  },
  onError: (err) => console.error("API Error:", err),
});

export default client;
