
import { useEffect, useState } from "react";
import API from "../../api/api";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "" });
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch inventory from backend
  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await API.get("/inventory"); // GET /api/inventory
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching inventory", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // ➕ Add Item
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.quantity) return;

    try {
      const res = await API.post("/inventory", newItem);
      setItems([...items, res.data]); // update state
      setNewItem({ name: "", quantity: "" }); // reset form
    } catch (err) {
      console.error("Error adding item", err);
    }
  };

  // 🗑️ Delete Item
  const handleDelete = async (id) => {
    try {
      await API.delete(`/inventory/${id}`);
      setItems(items.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error deleting item", err);
    }
  };

  // ✏️ Update Quantity (quick inline update)
  const handleUpdate = async (id, quantity) => {
    try {
      const res = await API.put(`/inventory/${id}`, { quantity });
      setItems(
        items.map((item) => (item._id === id ? res.data : item))
      );
    } catch (err) {
      console.error("Error updating item", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Inventory</h2>

      {/* Add New Item Form */}
      <form
        onSubmit={handleAddItem}
        className="bg-white shadow-md rounded-lg p-4 mb-6 flex gap-4"
      >
        <input
          type="text"
          placeholder="Item name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="border p-2 rounded w-1/3"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) =>
            setNewItem({ ...newItem, quantity: Number(e.target.value) })
          }
          className="border p-2 rounded w-1/3"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          Add Item
        </button>
      </form>

      {/* Inventory Table */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        {loading ? (
          <p className="p-4 text-gray-600">Loading inventory...</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Quantity</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="p-3 border">{item.name}</td>
                    <td className="p-3 border">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdate(item._id, Number(e.target.value))
                        }
                        className="border rounded px-2 w-20"
                      />
                    </td>
                    <td className="p-3 border flex gap-2">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500">
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Inventory;
