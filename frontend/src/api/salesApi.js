// src/api/salesApi.js
import axiosInstance from "./axiosInstance";

const salesApi = {
  getAllSales: () => axiosInstance.get("/sales"),
  getSaleById: (id) => axiosInstance.get(`/sales/${id}`),
  createSale: (data) => axiosInstance.post("/sales", data),
  updateSale: (id, data) => axiosInstance.put(`/sales/${id}`, data),
  deleteSale: (id) => axiosInstance.delete(`/sales/${id}`),
};

export default salesApi;
