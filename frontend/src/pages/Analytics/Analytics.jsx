import React, { useState } from "react";
import { useAnalytics } from "../../hooks/useAnalytics"; // ✅ fixed import
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Analytics = () => {
  const { summary, trends = [], shipments = [], loading, error } = useAnalytics();
  const [filter, setFilter] = useState("all");

  if (loading) return <p>Loading analytics...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  // Apply filter (last 7 days, last 30 days, or all)
  const filteredTrends = trends.filter((t) => {
    if (filter === "7d") return t.days <= 7;
    if (filter === "30d") return t.days <= 30;
    return true;
  });

  // Prepare shipment status data for Pie Chart
  const shipmentStatusData = [
    { name: "Delivered", value: shipments.filter((s) => s.status === "Delivered").length },
    { name: "In-Transit", value: shipments.filter((s) => s.status === "In-Transit").length },
    { name: "Pending", value: shipments.filter((s) => s.status === "Pending").length },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <div style={{ padding: 20 }}>
      <h2>📊 Analytics Dashboard</h2>

      {/* Summary Section */}
      <section style={{ marginBottom: 24 }}>
        <h3>Summary</h3>
        <ul>
          <li>Total Sales: {summary?.totalSales ?? 0}</li>
          <li>Total Customers: {summary?.totalCustomers ?? 0}</li>
          <li>Total Shipments: {summary?.totalShipments ?? 0}</li>
        </ul>
      </section>

      {/* Filter Controls */}
      <section style={{ marginBottom: 16 }}>
        <label>Filter Trends: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </section>

      {/* Line Chart (Sales Trends) */}
      <section style={{ marginBottom: 32 }}>
        <h3>Sales Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Bar Chart (Customer Growth) */}
      <section style={{ marginBottom: 32 }}>
        <h3>Customer Growth</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="customers" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Pie Chart (Shipment Status) */}
      <section>
        <h3>Shipment Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={shipmentStatusData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {shipmentStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default Analytics;
