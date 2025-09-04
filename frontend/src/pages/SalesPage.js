// src/pages/SalesPage.js
import React, { useState } from "react";
import "../styles/main.css";
import { useSales } from "../hooks/useSales";
import salesApi from "../api/salesApi";

function SalesPage() {
  const { sales = [], fetchSales, loading } = useSales();
  const [form, setForm] = useState({ total: "", date: "" });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.total) return alert("Total is required");
    setSaving(true);
    try {
      await salesApi.createSale({ total: Number(form.total), date: form.date || new Date().toISOString() });
      setForm({ total: "", date: "" });
      await fetchSales();
    } catch (err) {
      console.error(err);
      alert("Failed to create sale");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete sale record?")) return;
    try {
      await salesApi.deleteSale(id);
      await fetchSales();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Sales</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <input
          name="total"
          placeholder="Total"
          value={form.total}
          onChange={handleChange}
          style={{ marginRight: 8 }}
        />
        <input name="date" type="date" value={form.date} onChange={handleChange} style={{ marginRight: 8 }} />
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Add Sale"}
        </button>
      </form>

      {loading ? (
        <p>Loading sales...</p>
      ) : (
        <ul>
          {sales.map((s) => {
            const id = s.id ?? s._id ?? JSON.stringify(s);
            return (
              <li key={id}>
                <strong>{s.total ?? "N/A"}</strong> — {s.date ? new Date(s.date).toLocaleString() : "No date"}{" "}
                <button onClick={() => handleDelete(id)} style={{ marginLeft: 8 }}>
                  Delete
                </button>
              </li>
            );
          })}
          {sales.length === 0 && <li>No sales found.</li>}
        </ul>
      )}
    </div>
  );
}

export default SalesPage;
