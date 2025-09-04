import { useState, useEffect } from "react";
import API from "../api/axios";

export const useDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get("/analytics/dashboard");
        setMetrics(res.data);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { metrics, loading };
};

export default useDashboard;
