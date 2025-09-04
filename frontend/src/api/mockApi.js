// src/api/mockApi.js

// Simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data
let customers = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "123456789" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "987654321" },
];

let shipments = [
  { id: 1, trackingId: "TRK001", origin: "Accra", destination: "Kumasi", status: "In Transit", progress: 60 },
  { id: 2, trackingId: "TRK002", origin: "Tema", destination: "Takoradi", status: "Delivered", progress: 100 },
];

let sales = [
  { id: 1, product: "Laptop", amount: 2500, customer: "John Doe", date: "2025-09-01" },
  { id: 2, product: "Phone", amount: 1200, customer: "Jane Smith", date: "2025-09-02" },
];

let inventory = [
  { id: 1, item: "Laptop", stock: 20, category: "Electronics" },
  { id: 2, item: "Phone", stock: 50, category: "Electronics" },
];

let analytics = {
  summary: { totalSales: 3700, totalCustomers: 2, totalShipments: 2 },
  trends: [
    { date: "2025-09-01", sales: 2500 },
    { date: "2025-09-02", sales: 1200 },
  ],
};

// Mock API endpoints
export default {
  // Customers
  async getAllCustomers() {
    await delay(300);
    return { data: customers };
  },
  async createCustomer(data) {
    await delay(200);
    const newCustomer = { id: Date.now(), ...data };
    customers.push(newCustomer);
    return { data: newCustomer };
  },
  async updateCustomer(id, data) {
    await delay(200);
    customers = customers.map((c) => (c.id === id ? { ...c, ...data } : c));
    return { data };
  },
  async deleteCustomer(id) {
    await delay(200);
    customers = customers.filter((c) => c.id !== id);
    return { data: true };
  },

  // Tracking
  async getShipments() {
    await delay(300);
    return { data: shipments };
  },

  // Sales
  async getSales() {
    await delay(300);
    return { data: sales };
  },

  // Inventory
  async getInventory() {
    await delay(300);
    return { data: inventory };
  },

  // Analytics
  async getAnalytics() {
    await delay(300);
    return { data: analytics };
  },
};
