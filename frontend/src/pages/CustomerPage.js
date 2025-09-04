// src/pages/CustomerPage.js
import React, { useState } from "react";
import "../styles/main.css";
import { useCustomers } from "../hooks/useCustomers";
import customerApi from "../api/customerApi";

function CustomerPage() {
  const { customers = [], fetchCustomers, loading } = useCustomers();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const startEdit = (c) => {
    setEditingId(c.id ?? c._id ?? null);
    setForm({ name: c.name ?? "", email: c.email ?? "", phone: c.phone ?? "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", email: "", phone: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return alert("Name required");
    setSaving(true);
    try {
      if (editingId) {
        await customerApi.updateCustomer(editingId, form);
      } else {
        await customerApi.createCustomer(form);
      }
      await fetchCustomers();
      cancelEdit();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete customer?")) return;
    try {
      await customerApi.deleteCustomer(id);
      await fetchCustomers();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Customers</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} style={{ marginRight: 8 }} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} style={{ marginRight: 8 }} />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} style={{ marginRight: 8 }} />
        <button type="submit" disabled={saving}>{saving ? "Saving..." : (editingId ? "Update" : "Create")}</button>
        {editingId && <button type="button" onClick={cancelEdit} style={{ marginLeft: 8 }}>Cancel</button>}
      </form>

      {loading ? (
        <p>Loading customers...</p>
      ) : (
        <ul>
          {customers.map((c) => {
            const id = c.id ?? c._id ?? JSON.stringify(c);
            return (
              <li key={id}>
                <strong>{c.name}</strong> — {c.email ?? "no email"} — {c.phone ?? "no phone"}
                <button onClick={() => startEdit(c)} style={{ marginLeft: 8 }}>Edit</button>
                <button onClick={() => handleDelete(id)} style={{ marginLeft: 8 }}>Delete</button>
              </li>
            );
          })}
          {customers.length === 0 && <li>No customers found.</li>}
        </ul>
      )}
    </div>
  );
}

export default CustomerPage;
