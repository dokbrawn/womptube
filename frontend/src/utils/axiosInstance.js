import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/",
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // если access истёк
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === "token_not_valid" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem("refresh");
        const res = await axios.post("http://localhost:8000/api/auth/refresh/", {
          refresh,
        });

        localStorage.setItem("access", res.data.access);
        originalRequest.headers["Authorization"] = `Bearer ${res.data.access}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token expired");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("username");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
