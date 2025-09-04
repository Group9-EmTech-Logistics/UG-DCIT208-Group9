import { useEffect, useState } from "react";
import API from "../../api/api";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [editSale, setEditSale] = useState(null);

  // Fetch sales
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await API.get("/sales");
        setSales(res.data);
        setFilteredSales(res.data);
      } catch (err) {
        console.error("Error fetching sales", err);
      }
    };
    fetchSales();
  }, []);

  // Search + Filter
  useEffect(() => {
    let result = sales.filter((sale) =>
      sale.product.toLowerCase().includes(search.toLowerCase())
    );

    if (dateFilter !== "all") {
      const now = new Date();
      result = result.filter((sale) => {
        const saleDate = new Date(sale.date);
        if (dateFilter === "today") {
          return (
            saleDate.toDateString() === now.toDateString()
          );
        }
        if (dateFilter === "last7") {
          const last7 = new Date();
          last7.setDate(now.getDate() - 7);
          return saleDate >= last7 && saleDate <= now;
        }
        return true;
      });
    }

    setFilteredSales(result);
  }, [search, dateFilter, sales]);

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;
    try {
      await API.delete(`/sales/${id}`);
      setSales(sales.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Error deleting sale", err);
    }
  };

  // Edit
  const handleEdit = (sale) => {
    setEditSale(sale);
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/sales/${editSale._id}`, editSale);
      setSales(
        sales.map((s) => (s._id === editSale._id ? editSale : s))
      );
      setEditSale(null);
    } catch (err) {
      console.error("Error updating sale", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Sales Records</h2>

      {/* Search + Filters */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by product..."
          className="p-2 border rounded w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="last7">Last 7 Days</option>
        </select>
      </div>

      {/* Sales List */}
      <div className="grid gap-3">
        {filteredSales.map((sale) => (
          <div
            key={sale._id}
            className="flex justify-between items-center p-4 bg-white rounded shadow"
          >
            <div>
              <p className="font-semibold">{sale.product}</p>
              <p className="text-sm text-gray-500">
                Amount: ${sale.amount} | Date:{" "}
                {new Date(sale.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded"
                onClick={() => handleEdit(sale)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => handleDelete(sale._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h3 className="text-lg font-bold mb-4">Edit Sale</h3>
            <input
              type="text"
              className="w-full p-2 border mb-2 rounded"
              value={editSale.product}
              onChange={(e) =>
                setEditSale({ ...editSale, product: e.target.value })
              }
            />
            <input
              type="number"
              className="w-full p-2 border mb-2 rounded"
              value={editSale.amount}
              onChange={(e) =>
                setEditSale({ ...editSale, amount: e.target.value })
              }
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-400 text-white px-3 py-1 rounded"
                onClick={() => setEditSale(null)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={handleUpdate}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
