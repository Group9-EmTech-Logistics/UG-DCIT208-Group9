// src/pages/Tracking/Tracking.js
import React, { useState } from "react";
import { useTracking } from "../../hooks/useTracking";

const Tracking = () => {
  const { shipments, loading, error, updateShipment, deleteShipment } = useTracking();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  if (loading) return <p>Loading shipments...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  // Filter + Search logic
  const filteredShipments = shipments.filter((s) => {
    const matchesSearch =
      s.trackingId.toLowerCase().includes(search.toLowerCase()) ||
      s.origin.toLowerCase().includes(search.toLowerCase()) ||
      s.destination.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || s.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: 16 }}>
      <h2>Shipments</h2>

      {/* Search + Filter Controls */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Search by Tracking ID, Origin, Destination..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        >
          <option value="all">All Status</option>
          <option value="In Transit">In Transit</option>
          <option value="Delivered">Delivered</option>
          <option value="Pending">Pending</option>
          <option value="Delayed">Delayed</option>
        </select>
      </div>

      {/* Shipments Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <thead style={{ background: "#f4f4f4" }}>
          <tr>
            <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Tracking ID</th>
            <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Origin</th>
            <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Destination</th>
            <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Status</th>
            <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Progress</th>
            <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredShipments.length > 0 ? (
            filteredShipments.map((s) => (
              <tr key={s.id}>
                <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{s.trackingId}</td>
                <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{s.origin}</td>
                <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{s.destination}</td>
                <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{s.status}</td>
                <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                  <div
                    style={{
                      background: "#f0f0f0",
                      borderRadius: "6px",
                      overflow: "hidden",
                      height: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: `${s.progress}%`,
                        background:
                          s.progress === 100 ? "#4caf50" : s.status === "Delayed" ? "#ff9800" : "#2196f3",
                        height: "100%",
                      }}
                    />
                  </div>
                  <small>{s.progress}%</small>
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                  <button
                    onClick={() => {
                      const newStatus = prompt(
                        "Enter new status (In Transit, Delivered, Pending, Delayed):",
                        s.status
                      );
                      if (newStatus) updateShipment(s.id, { status: newStatus });
                    }}
                    style={{
                      marginRight: "8px",
                      padding: "6px 10px",
                      background: "#2196f3",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this shipment?")) {
                        deleteShipment(s.id);
                      }
                    }}
                    style={{
                      padding: "6px 10px",
                      background: "#f44336",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                No shipments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Tracking;
