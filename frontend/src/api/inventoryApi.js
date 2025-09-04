// src/api/inventoryApi.js
import axiosInstance from "./axiosInstance";

export const getAllInventory = (params) =>
  axiosInstance.get("/inventory", { params });

export const getInventoryById = (id) =>
  axiosInstance.get(`/inventory/${id}`);

export const createInventory = (inventoryDTO) =>
  axiosInstance.post("/inventory", inventoryDTO);

export const updateInventory = (id, inventoryDTO) =>
  axiosInstance.put(`/inventory/${id}`, inventoryDTO);

export const deleteInventory = (id) =>
  axiosInstance.delete(`/inventory/${id}`);
