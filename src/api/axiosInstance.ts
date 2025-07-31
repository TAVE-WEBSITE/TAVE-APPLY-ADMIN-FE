import axios from "axios";

const SERVER_URL = import.meta.env.VITE_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: `${SERVER_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("access_token");
      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (error.response.data.message === "토큰 재발급이 필요합니다.") {
        const originalRequest = error.config;
        try {
          const token = sessionStorage.getItem("access_token");
          const email = sessionStorage.getItem("email");
          
          if (!token || !email) {
            console.error("토큰 또는 이메일이 없습니다.");
            return Promise.reject(error);
          }

          const tokenResponse = await fetch(
            "http://3.34.188.27:8080/v1/auth/refresh",
            {
              method: "POST",
              body: JSON.stringify({ email }),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
          if (tokenResponse.status === 200) {
            const newAccessTokenData = await tokenResponse.json();
            const newAccessToken = newAccessTokenData.result.accessToken;
            sessionStorage.setItem("access_token", newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          console.error("토큰 갱신 실패:", refreshError);
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);
