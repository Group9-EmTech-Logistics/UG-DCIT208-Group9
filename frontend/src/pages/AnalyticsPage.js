// src/pages/AnalyticsPage.js
import React, { useState } from "react";
import "../styles/main.css"; // Adjust the path if necessary
import Analytics from "./Analytics/Analytics"; // Adjust the path as necessary
import { useAnalytics } from "../hooks/useAnalytics"; // Ensure you have this hook

function AnalyticsPage() {
    const { summary, trends, loading, error } = useAnalytics();
    const [filter, setFilter] = useState("30d"); // Default: last 30 days

    if (loading) return <p>Loading analytics...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <div style={{ padding: 20 }}>
            <h2>Analytics Dashboard</h2>

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

            {/* Include the Analytics Component */}
            <Analytics filter={filter} />
        </div>
    );
}

export default AnalyticsPage;