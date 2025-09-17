/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { localStorageKey, useAuth } from "./auth-provider";
import useApiUrl from "@/hooks/use-ApiUrl";

let isRefreshing = false;
let failedQueue: any[] = [];

// Process queued requests after refresh
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom: any) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

export default function useAxiosInstance() {
  const { ProductionUrl, ProductionRootUrl } = useApiUrl();
  const auth = useAuth();

  // Create Axios instance
  const axiosInstance = axios.create({
    baseURL: ProductionUrl,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  /**
   * ------------------------
   * REQUEST INTERCEPTOR
   * ------------------------
   * Automatically attach the latest access token
   */
  axiosInstance.interceptors.request.use(
    (request) => {
      const accessToken = auth?.accessToken || localStorage.getItem(localStorageKey.accessTokenKey);
      if (accessToken) {
        request.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return request;
    },
    (error) => Promise.reject(error)
  );

  /**
   * ------------------------
   * RESPONSE INTERCEPTOR
   * ------------------------
   * Refresh the access token if expired
   */
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If unauthorized & we haven’t retried yet
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // If refresh is already in progress → queue this request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        isRefreshing = true;

        try {
          // Call refresh token API
          const response = await axios.post(
            `${ProductionRootUrl}/api/Auth/refresh`,
            {},
            { withCredentials: true }
          );

          const { token: accessToken } = response.data;

          // Save new access token
          auth?.setNewAccessToken(accessToken);
          localStorage.setItem(localStorageKey.accessTokenKey, accessToken);

          // Process queued requests with new token
          processQueue(null, accessToken);

          // Update default axios headers for future requests
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

          // **Forcefully replace the token for retry request**
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${accessToken}`,
          };

          console.log("✅ New Access Token Set:", accessToken);
          console.log("✅ Retrying Request With Headers:", originalRequest.headers);

          // Retry the original request with new token
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // If refresh fails → logout user
          processQueue(refreshError, null);
          console.error("🔻 Token refresh failed:", refreshError);

          await auth?.removeAccessToken();
          localStorage.removeItem(localStorageKey.accessTokenKey);

          // Optional: redirect to login
          // window.location.href = "/sign-in";

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // If not 401 or token refresh failed → reject request
      return Promise.reject(error);
    }
  );

  return axiosInstance;
}
