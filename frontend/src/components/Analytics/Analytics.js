// src/pages/Analytics/Analytics.js
import React, { useState } from "react";
import { useAnalytics } from "../../hooks/useAnalytics";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Analytics = () => {
  const { summary, trends, loading, error } = useAnalytics();
  const [filter, setFilter] = useState("30d"); // default: last 30 days

  if (loading) return <p>Loading analytics...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  // Filter trends data by date range
  const filteredTrends = (() => {
    if (!trends || trends.length === 0) return [];

    const now = new Date();
    let cutoff;

    if (filter === "7d") {
      cutoff = new Date(now.setDate(now.getDate() - 7));
    } else if (filter === "30d") {
      cutoff = new Date(now.setDate(now.getDate() - 30));
    } else {
      return trends; // all time
    }

    return trends.filter((t) => new Date(t.date) >= cutoff);
  })();

  return (
    <div style={{ padding: 16 }}>
      <h2>Analytics</h2>

      {/* Filter Controls */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ marginRight: 8 }}>Show:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Summary Section */}
      <section style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        {summary ? (
          Object.entries(summary).map(([key, value]) => (
            <div
              key={key}
              style={{
                flex: 1,
                background: "#f9f9f9",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <h4 style={{ margin: "0 0 8px" }}>{key}</h4>
              <p style={{ fontSize: "18px", fontWeight: "bold" }}>{value}</p>
            </div>
          ))
        ) : (
          <p>No summary data available.</p>
        )}
      </section>

      {/* Trends Section */}
      <section>
        <h3>Trends</h3>
        {filteredTrends && filteredTrends.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={filteredTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {/* Example lines – adjust based on your data keys */}
              <Line type="monotone" dataKey="sales" stroke="#8884d8" />
              <Line type="monotone" dataKey="customers" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>No trend data available.</p>
        )}
      </section>
    </div>
  );
};

export default Analytics;
