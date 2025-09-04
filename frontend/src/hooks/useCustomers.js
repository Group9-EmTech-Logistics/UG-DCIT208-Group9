// src/hooks/useCustomers.js
import { useState, useEffect } from "react";
import mockApi from "../api/mockApi";

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all customers
  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await customerApi.getAllCustomers();
      setCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  // Create customer
  const createCustomer = async (data) => {
    try {
      const res = await customerApi.createCustomer(data);
      setCustomers((prev) => [...prev, res.data]); // Optimistic add
      return { success: true };
    } catch (err) {
      console.error("Error creating customer:", err);
      return { success: false, message: "Failed to create customer" };
    }
  };

  // Update customer
  const updateCustomer = async (id, data) => {
    try {
      await customerApi.updateCustomer(id, data);
      setCustomers((prev) =>
        prev.map((c) => (c.id === id || c._id === id ? { ...c, ...data } : c))
      );
      return { success: true };
    } catch (err) {
      console.error("Error updating customer:", err);
      return { success: false, message: "Failed to update customer" };
    }
  };

  // Delete customer
  const deleteCustomer = async (id) => {
    const prevCustomers = [...customers];
    setCustomers((prev) => prev.filter((c) => c.id !== id && c._id !== id)); // Optimistic delete
    try {
      await customerApi.deleteCustomer(id);
      return { success: true };
    } catch (err) {
      console.error("Error deleting customer:", err);
      setCustomers(prevCustomers); // Rollback
      return { success: false, message: "Failed to delete customer" };
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
};
