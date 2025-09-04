// frontend/src/api/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // important so browser sends httpOnly refresh cookie to refresh endpoint
});

// request: attach access token from localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// response: if 401 -> try refresh once and retry original request
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // if no response or not 401, reject
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // prevent infinite loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // queue requests until refresh done
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return API(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // call refresh endpoint; server reads httpOnly cookie and returns new access token
      const res = await axios.post(
        "http://localhost:5000/api/auth/refresh",
        {},
        { withCredentials: true } // send cookie
      );

      const newToken = res.data.token;
      // store new token
      localStorage.setItem("token", newToken);
      // set header for original request and retry
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      processQueue(null, newToken);
      return API(originalRequest);
    } catch (err) {
      processQueue(err, null);
      // if refresh fails: logout locally
      localStorage.removeItem("token");
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default API;

