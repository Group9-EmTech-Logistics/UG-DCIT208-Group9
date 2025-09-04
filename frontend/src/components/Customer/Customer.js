// src/pages/Customer/Customer.js
import React, { useState } from "react";
import { useCustomers } from "../../hooks/useCustomers";

const Customer = () => {
  const {
    customers = [],
    loading,
    error,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  } = useCustomers();

  const [newCustomer, setNewCustomer] = useState({ name: "", email: "" });
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("");

  const handleAdd = async () => {
    if (!newCustomer.name) return alert("Name required");
    const res = await createCustomer(newCustomer);
    if (!res.success) alert(res.message);
    setNewCustomer({ name: "", email: "" });
  };

  const handleUpdate = async (id) => {
    const customer = customers.find((c) => c.id === id || c._id === id);
    if (!customer) return;
    const res = await updateCustomer(id, {
      name: customer.name,
      email: customer.email,
    });
    if (!res.success) alert(res.message);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      const res = await deleteCustomer(id);
      if (!res.success) alert(res.message);
    }
  };

  // Filter customers
  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ padding: 16 }}>
      <h2>Customers</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? (
        <p>Loading customers...</p>
      ) : (
        <>
          {/* Filter/Search */}
          <input
            placeholder="Search by name"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ marginBottom: 12 }}
          />

          {/* Customer List */}
          <ul>
            {filteredCustomers.map((c) => (
              <li key={c.id ?? c._id}>
                {editingId === (c.id ?? c._id) ? (
                  <>
                    <input
                      value={c.name}
                      onChange={(e) =>
                        updateCustomer(c.id ?? c._id, {
                          ...c,
                          name: e.target.value,
                        })
                      }
                    />
                    <input
                      value={c.email}
                      onChange={(e) =>
                        updateCustomer(c.id ?? c._id, {
                          ...c,
                          email: e.target.value,
                        })
                      }
                      style={{ marginLeft: 8 }}
                    />
                    <button
                      style={{ marginLeft: 8 }}
                      onClick={() => handleUpdate(c.id ?? c._id)}
                    >
                      Save
                    </button>
                    <button
                      style={{ marginLeft: 4 }}
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {c.name} — {c.email}
                    <button
                      style={{ marginLeft: 8 }}
                      onClick={() => setEditingId(c.id ?? c._id)}
                    >
                      Edit
                    </button>
                    <button
                      style={{ marginLeft: 8 }}
                      onClick={() => handleDelete(c.id ?? c._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
            {filteredCustomers.length === 0 && <li>No customers found.</li>}
          </ul>

          {/* Add New Customer */}
          <div style={{ marginTop: 12 }}>
            <input
              placeholder="Name"
              value={newCustomer.name}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, name: e.target.value })
              }
            />
            <input
              placeholder="Email"
              value={newCustomer.email}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, email: e.target.value })
              }
              style={{ marginLeft: 8 }}
            />
            <button onClick={handleAdd} style={{ marginLeft: 8 }}>
              Add
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Customer;
