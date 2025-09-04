import { useState, useEffect } from "react";

export const useAnalytics = () => {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/analytics"); // ✅ your backend endpoint
        if (!res.ok) throw new Error("Failed to fetch analytics");

        const json = await res.json();

        // Expect backend response like:
        // {
        //   summary: { totalSales: 1200, totalCustomers: 300, totalShipments: 150 },
        //   trends: [ { date: "2025-08-01", sales: 100, customers: 10, days: 1 }, ... ],
        //   shipments: [ { id: 1, status: "Delivered" }, { id: 2, status: "In-Transit" } ]
        // }

        setSummary(json.summary ?? {});
        setTrends(json.trends ?? []);
        setShipments(json.shipments ?? []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return { summary, trends, shipments, loading, error };
};
