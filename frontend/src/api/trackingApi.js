// src/api/trackingApi.js
import axiosInstance from "./axiosInstance";

const trackingApi = {
  getAllShipments: () => axiosInstance.get("/tracking"),
  getShipmentById: (id) => axiosInstance.get(`/tracking/${id}`),
  updateShipmentStatus: (id, status) =>
    axiosInstance.put(`/tracking/${id}/status`, { status }),
};

export default trackingApi;
