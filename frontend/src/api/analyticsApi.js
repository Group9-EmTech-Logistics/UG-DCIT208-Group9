// src/api/analyticsApi.js
import axiosInstance from "./axiosInstance";

const analyticsApi = {
  getReports: () => axiosInstance.get("/analytics/reports"),
  getDashboardData: () => axiosInstance.get("/analytics/dashboard"),
  getSalesTrends: () => axiosInstance.get("/analytics/sales-trends"),
};

export default analyticsApi;
