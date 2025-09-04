

// js/api.js
class EmTechAPI {
    constructor() {
        this.baseURL = 'http://localhost:8080/api';
        this.token = localStorage.getItem('authToken');
    }

    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` })
            }
        };

        try {
            const response = await fetch(url, { ...defaultOptions, ...options });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Dashboard APIs
    async getDashboardMetrics() {
        return this.makeRequest('/dashboard/metrics');
    }

    async getAIInsights() {
        return this.makeRequest('/dashboard/insights');
    }

    // Inventory APIs
    async getInventory() {
        return this.makeRequest('/inventory');
    }

    async getInventoryById(id) {
        return this.makeRequest(`/inventory/${id}`);
    }

    async createInventory(inventoryData) {
        return this.makeRequest('/inventory', {
            method: 'POST',
            body: JSON.stringify(inventoryData)
        });
    }

    async updateInventory(id, inventoryData) {
        return this.makeRequest(`/inventory/${id}`, {
            method: 'PUT',
            body: JSON.stringify(inventoryData)
        });
    }

    async getLowStockItems() {
        return this.makeRequest('/inventory/low-stock');
    }

    // Sales APIs
    async getSales() {
        return this.makeRequest('/sales');
    }

    async createSale(saleData) {
        return this.makeRequest('/sales', {
            method: 'POST',
            body: JSON.stringify(saleData)
        });
    }

    // Customer APIs
    async getCustomers() {
        return this.makeRequest('/customers');
    }

    async createCustomer(customerData) {
        return this.makeRequest('/customers', {
            method: 'POST',
            body: JSON.stringify(customerData)
        });
    }
}

// Initialize API client
const api = new EmTechAPI();

// Load dashboard data
async function loadDashboardData() {
    try {
        const [metrics, insights] = await Promise.all([
            api.getDashboardMetrics(),
            api.getAIInsights()
        ]);

        updateDashboardMetrics(metrics);
        updateAIInsights(insights);
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
    }
}

function updateDashboardMetrics(metrics) {
    document.querySelector('.metric-card:nth-child(1) .metric-value').textContent = metrics.totalStock || '0';
    document.querySelector('.metric-card:nth-child(2) .metric-value').textContent = `₵${(metrics.todayRevenue || 0).toLocaleString()}`;
    document.querySelector('.metric-card:nth-child(3) .metric-value').textContent = metrics.activeCustomers || '0';
    document.querySelector('.metric-card:nth-child(4) .metric-value').textContent = metrics.lowStockAlerts || '0';
}

function updateAIInsights(insights) {
    const insightsContainer = document.querySelector('.ai-suggestions');
    const insightsList = insightsContainer.querySelector('.ai-suggestion-item').parentNode;
    
    // Clear existing insights except the header
    const existingInsights = insightsList.querySelectorAll('.ai-suggestion-item');
    existingInsights.forEach(item => item.remove());
    
    // Add new insights
    insights.forEach(insight => {
        const insightElement = document.createElement('div');
        insightElement.className = 'ai-suggestion-item';
        insightElement.innerHTML = `
            <span>${insight.icon}</span>
            <div>
                <strong>${insight.title}:</strong> ${insight.message}
            </div>
        `;
        insightsList.appendChild(insightElement);
    });
}