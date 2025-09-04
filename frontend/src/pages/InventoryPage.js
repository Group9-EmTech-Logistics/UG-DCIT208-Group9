import React, { useState } from "react";
import "../styles/main.css";
import { useInventory } from "../hooks/useInventory";

function InventoryPage() {
  const { items, loading, createItem, deleteItem } = useInventory();
  const [form, setForm] = useState({ name: "", quantity: 0 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: name === "quantity" ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createItem(form);
    setForm({ name: "", quantity: 0 });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Inventory</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Item name" />
        <input name="quantity" type="number" value={form.quantity} onChange={handleChange} placeholder="Quantity" />
        <button type="submit">Add</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.name} — {item.quantity}
              <button onClick={() => deleteItem(item.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default InventoryPage;
