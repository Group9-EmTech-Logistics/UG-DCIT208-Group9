// src/hooks/useSales.js
import { useState, useEffect } from "react";
import mockApi from "../api/mockApi";


export const useSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await salesApi.getAllSales();
      setSales(res.data);
    } catch (error) {
      console.error("Error fetching sales:", error);
    } finally {
      setLoading(false);
    }
  };

  const createSale = async (data) => {
    await salesApi.createSale(data);
    await fetchSales();
  };

  const updateSale = async (id, data) => {
    await salesApi.updateSale(id, data);
    await fetchSales();
  };

  const deleteSale = async (id) => {
    await salesApi.deleteSale(id);
    await fetchSales();
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return { sales, loading, fetchSales, createSale, updateSale, deleteSale };
};
