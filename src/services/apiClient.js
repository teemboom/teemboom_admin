import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://api-admin.teemboom.com",
    headers: {
        "Content-Type": "application/json",
    },
});

// Flag to track ongoing token refresh process
let isRefreshing = false;
let refreshSubscribers = [];

const onTokenRefreshed = (newToken) => {
    refreshSubscribers.forEach((callback) => callback(newToken));
    refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
    refreshSubscribers.push(callback);
};

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If token expired (401) and refresh token exists, attempt refresh
        if ((error.response?.status === 401 || error.response?.status === 422) && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("refreshToken");

            if (!refreshToken) {
                console.error("No refresh token available");
                return Promise.reject(error);
            }

            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    const { data } = await axios.post(
                        "http://api-admin.teemboom.com/user/refresh",
                        {},
                        {
                          headers: { Authorization: `Bearer ${refreshToken}` },
                        }
                      );
                    const newAccessToken = data.access_token;
                    localStorage.setItem("accessToken", newAccessToken);

                    onTokenRefreshed(newAccessToken);
                    isRefreshing = false;

                    return apiClient(originalRequest);
                } catch (refreshError) {
                    console.error("Refresh failed", refreshError);
                    isRefreshing = false;
                    return Promise.reject(refreshError);
                }
            }

            return new Promise((resolve) => {
                addRefreshSubscriber((newToken) => {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    resolve(apiClient(originalRequest));
                });
            });
        }

        return Promise.reject(error);
    }
);

export default apiClient;
