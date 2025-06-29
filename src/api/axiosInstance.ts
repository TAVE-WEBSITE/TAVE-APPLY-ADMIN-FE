import axios from "axios";

const SERVER_URL = import.meta.env.VITE_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: `${SERVER_URL}/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("access_token");
      config.headers.set("Authorization", `Bearer ${token}`);
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
          const tokenResponse = await fetch(
            "https://test.api.tave-wave.com/v1/auth/refresh",
            {
              method: "POST",
              body: JSON.stringify({ email: sessionStorage.getItem("email") }),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem(
                  "access_token"
                )}`,
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
          if (axios.isAxiosError(refreshError)) {
            //alert("로그인이 필요합니다.");
            //window.location.replace("/");
          }
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);
