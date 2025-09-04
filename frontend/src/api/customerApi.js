// src/api/customerApi.js
import axiosInstance from "./axiosInstance";

const customerApi = {
  getAllCustomers: () => axiosInstance.get("/customers"),
  getCustomerById: (id) => axiosInstance.get(`/customers/${id}`),
  createCustomer: (data) => axiosInstance.post("/customers", data),
  updateCustomer: (id, data) => axiosInstance.put(`/customers/${id}`, data),
  deleteCustomer: (id) => axiosInstance.delete(`/customers/${id}`),
};

export default customerApi;
