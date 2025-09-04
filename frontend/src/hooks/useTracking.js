// src/hooks/useTracking.js
import { useState, useEffect } from "react";
import mockApi from "../api/mockApi";


export const useTracking = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const res = await trackingApi.getAllShipments();
      setShipments(res.data);
    } catch (error) {
      console.error("Error fetching shipments:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateShipmentStatus = async (id, status) => {
    await trackingApi.updateShipmentStatus(id, status);
    await fetchShipments();
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  return { shipments, loading, fetchShipments, updateShipmentStatus };
};
