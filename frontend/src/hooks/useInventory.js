// src/hooks/useInventory.js
import { useState, useEffect } from "react";
import mockApi from "../api/mockApi";


export const useInventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await inventoryApi.getAllItems();
      setItems(res.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (data) => {
    await inventoryApi.createItem(data);
    await fetchInventory();
  };

  const updateItem = async (id, data) => {
    await inventoryApi.updateItem(id, data);
    await fetchInventory();
  };

  const deleteItem = async (id) => {
    await inventoryApi.deleteItem(id);
    await fetchInventory();
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return { items, loading, fetchInventory, createItem, updateItem, deleteItem };
};
