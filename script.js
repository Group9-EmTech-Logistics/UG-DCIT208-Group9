// EmTech Logistic System JavaScript
// Main application state
let appState = {
    currentTab: 'dashboard',
    inventory: [
        {
            id: 1,
            name: 'Samsung Galaxy S24',
            sku: 'SGS24-001',
            category: 'Electronics',
            quantity: 15,
            purchasePrice: 2000,
            sellingPrice: 2400,
            expiryDate: null,
            status: 'low'
        },
        {
            id: 2,
            name: 'Rice - 50kg Bag',
            sku: 'RC50-002',
            category: 'Food',
            quantity: 85,
            purchasePrice: 200,
            sellingPrice: 240,
            expiryDate: '2025-12-15',
            status: 'normal'
        },
        {
            id: 3,
            name: 'Cooking Oil - 5L',
            sku: 'CO5L-003',
            category: 'Food',
            quantity: 32,
            purchasePrice: 45,
            sellingPrice: 55,
            expiryDate: '2025-09-30',
            status: 'expiring'
        }
    ],
    customers: [
        {
            id: 1,
            name: 'Kwame Electronics Ltd',
            type: 'Wholesale',
            phone: '+233 20 123 4567',
            email: 'info@kwameelectronics.com',
            totalOrders: 15,
            lastOrder: '2025-08-10'
        },
        {
            id: 2,
            name: 'Abena Grocery',
            type: 'Retail',
            phone: '+233 24 567 8901',
            email: 'abena@grocery.com',
            totalOrders: 32,
            lastOrder: '2025-08-09'
        }
    ],
    sales: [
        {
            id: 'TXN-001',
            customer: 'Kwame Electronics Ltd',
            items: 'Samsung Galaxy S24 x2',
            total: 4800,
            type: 'Wholesale',
            date: '2025-08-10',
            profit: 800
        },
        {
            id: 'TXN-002',
            customer: 'Abena Grocery',
            items: 'Rice 50kg x5',
            total: 1200,
            type: 'Wholesale',
            date: '2025-08-10',
            profit: 200
        }
    ],
    aiAssistantActive: false
};

// Tab Management
function switchTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all nav tabs
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected tab content
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked nav tab
    const clickedTab = event?.target || document.querySelector(`[onclick="switchTab('${tabName}')"]`);
    if (clickedTab) {
        clickedTab.classList.add('active');
    }
    
    appState.currentTab = tabName;
    
    // Update tab-specific content
    switch(tabName) {
        case 'inventory':
            refreshInventoryTable();
            break;
        case 'sales':
            refreshSalesTable();
            updateSalesDashboard();
            break;
        case 'customers':
            refreshCustomersTable();
            break;
        case 'dashboard':
            updateDashboardMetrics();
            break;
    }
}

// Modal Management
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        // Add animation class if needed
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Inventory Management
function addItem(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const newItem = {
        id: appState.inventory.length + 1,
        name: form.querySelector('input[type="text"]').value,
        sku: form.querySelectorAll('input[type="text"]')[1].value,
        category: form.querySelector('select').value,
        quantity: parseInt(form.querySelector('input[type="number"]').value),
        purchasePrice: parseFloat(form.querySelectorAll('input[type="number"]')[1].value),
        sellingPrice: parseFloat(form.querySelectorAll('input[type="number"]')[2].value),
        expiryDate: null,
        status: 'normal'
    };
    
    // Determine status based on quantity
    if (newItem.quantity < 20) {
        newItem.status = 'low';
    }
    
    appState.inventory.push(newItem);
    
    // Close modal and refresh table
    closeModal('addItem');
    refreshInventoryTable();
    updateDashboardMetrics();
    
    // Reset form
    form.reset();
    
    // Show success message
    showNotification('Item added successfully!', 'success');
}

function refreshInventoryTable() {
    const tbody = document.querySelector('#inventory table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    appState.inventory.forEach(item => {
        const statusClass = item.status === 'low' ? 'status-low' : 
                           item.status === 'expiring' ? 'status-warning' : 'status-normal';
        const statusText = item.status === 'low' ? 'Low Stock' :
                          item.status === 'expiring' ? 'Expiring Soon' : 'Normal';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.sku}</td>
            <td>${item.category}</td>
            <td>${item.quantity}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>${item.expiryDate || 'N/A'}</td>
            <td>
                <button class="btn btn-primary" style="padding: 6px 12px;" onclick="editItem(${item.id})">Edit</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editItem(itemId) {
    const item = appState.inventory.find(i => i.id === itemId);
    if (item) {
        // For now, show an alert - in a real app, this would open an edit modal
        alert(`Editing ${item.name}. This feature would open an edit modal in a complete implementation.`);
    }
}

// Sales Management
function addSale(event) {
    event.preventDefault();
    const form = event.target;
    
    const customer = form.querySelector('select').value;
    const item = form.querySelectorAll('select')[1].value;
    const quantity = parseInt(form.querySelector('input[type="number"]').value);
    const saleType = form.querySelectorAll('select')[2].value;
    
    // Find the item in inventory
    const inventoryItem = appState.inventory.find(i => i.name === item);
    if (!inventoryItem) {
        showNotification('Item not found!', 'error');
        return;
    }
    
    if (inventoryItem.quantity < quantity) {
        showNotification('Insufficient stock!', 'error');
        return;
    }
    
    // Calculate total and profit
    const unitPrice = saleType === 'Wholesale' ? inventoryItem.sellingPrice * 0.9 : inventoryItem.sellingPrice;
    const total = unitPrice * quantity;
    const profit = (unitPrice - inventoryItem.purchasePrice) * quantity;
    
    // Create new sale record
    const newSale = {
        id: `TXN-${String(appState.sales.length + 1).padStart(3, '0')}`,
        customer: customer,
        items: `${item} x${quantity}`,
        total: total,
        type: saleType,
        date: new Date().toISOString().split('T')[0],
        profit: profit
    };
    
    // Update inventory
    inventoryItem.quantity -= quantity;
    if (inventoryItem.quantity < 20) {
        inventoryItem.status = 'low';
    }
    
    // Add sale to records
    appState.sales.push(newSale);
    
    // Close modal and refresh
    closeModal('addSale');
    refreshSalesTable();
    refreshInventoryTable();
    updateDashboardMetrics();
    updateSalesDashboard();
    
    // Reset form
    form.reset();
    
    showNotification('Sale recorded successfully!', 'success');
}

function refreshSalesTable() {
    const tbody = document.querySelector('#sales table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    appState.sales.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${sale.id}</td>
            <td>${sale.customer}</td>
            <td>${sale.items}</td>
            <td>₵${sale.total.toLocaleString()}</td>
            <td>${sale.type}</td>
            <td>${sale.date}</td>
            <td>
                <button class="btn btn-primary" style="padding: 6px 12px;" onclick="printReceipt('${sale.id}')">Receipt</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateSalesDashboard() {
    const today = new Date().toISOString().split('T')[0];
    const todaySales = appState.sales.filter(sale => sale.date === today);
    
    const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    const todayProfit = todaySales.reduce((sum, sale) => sum + sale.profit, 0);
    const todayTransactions = todaySales.length;
    
    // Update metrics in sales tab
    const salesMetrics = document.querySelectorAll('#sales .metric-value');
    if (salesMetrics.length >= 3) {
        salesMetrics[0].textContent = `₵${todayRevenue.toLocaleString()}`;
        salesMetrics[1].textContent = todayTransactions;
        salesMetrics[2].textContent = `₵${todayProfit.toLocaleString()}`;
    }
}

function printReceipt(saleId) {
    const sale = appState.sales.find(s => s.id === saleId);
    if (sale) {
        // In a real application, this would generate and print a receipt
        alert(`Receipt for transaction ${saleId}:\n\nCustomer: ${sale.customer}\nItems: ${sale.items}\nTotal: ₵${sale.total}\nDate: ${sale.date}`);
    }
}

// Customer Management
function addCustomer(event) {
    event.preventDefault();
    const form = event.target;
    
    const newCustomer = {
        id: appState.customers.length + 1,
        name: form.querySelector('input[type="text"]').value,
        type: form.querySelector('select').value,
        phone: form.querySelector('input[type="tel"]').value,
        email: form.querySelector('input[type="email"]').value,
        totalOrders: 0,
        lastOrder: 'Never'
    };
    
    appState.customers.push(newCustomer);
    
    // Close modal and refresh
    closeModal('addCustomer');
    refreshCustomersTable();
    updateDashboardMetrics();
    
    // Reset form
    form.reset();
    
    showNotification('Customer added successfully!', 'success');
}

function refreshCustomersTable() {
    const tbody = document.querySelector('#customers table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    appState.customers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.type}</td>
            <td>${customer.phone}</td>
            <td>${customer.totalOrders}</td>
            <td>${customer.lastOrder}</td>
            <td>
                <button class="btn btn-primary" style="padding: 6px 12px;" onclick="viewCustomer(${customer.id})">View</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function viewCustomer(customerId) {
    const customer = appState.customers.find(c => c.id === customerId);
    if (customer) {
        alert(`Customer Details:\n\nName: ${customer.name}\nType: ${customer.type}\nPhone: ${customer.phone}\nEmail: ${customer.email}\nTotal Orders: ${customer.totalOrders}\nLast Order: ${customer.lastOrder}`);
    }
}

// Dashboard Functions
function updateDashboardMetrics() {
    const totalItems = appState.inventory.reduce((sum, item) => sum + item.quantity, 0);
    const monthlyRevenue = appState.sales.reduce((sum, sale) => sum + sale.total, 0);
    const activeCustomers = appState.customers.length;
    const lowStockItems = appState.inventory.filter(item => item.status === 'low').length;
    
    // Update dashboard metrics
    const dashboardMetrics = document.querySelectorAll('#dashboard .metric-value');
    if (dashboardMetrics.length >= 4) {
        dashboardMetrics[0].textContent = totalItems.toLocaleString();
        dashboardMetrics[1].textContent = `₵${monthlyRevenue.toLocaleString()}`;
        dashboardMetrics[2].textContent = activeCustomers;
        dashboardMetrics[3].textContent = lowStockItems;
    }
}

// AI Assistant Functions
function toggleAIAssistant() {
    appState.aiAssistantActive = !appState.aiAssistantActive;
    
    if (appState.aiAssistantActive) {
        showNotification('AI Assistant activated! Getting insights...', 'info');
        // Simulate AI processing
        setTimeout(() => {
            updateAIInsights();
        }, 1000);
    } else {
        showNotification('AI Assistant deactivated', 'info');
    }
}

function updateAIInsights() {
    // Generate dynamic AI insights based on current data
    const lowStockItems = appState.inventory.filter(item => item.status === 'low');
    const expiringItems = appState.inventory.filter(item => item.status === 'expiring');
    const recentSales = appState.sales.slice(-5);
    
    const aiSuggestions = document.querySelector('.ai-suggestions');
    if (aiSuggestions) {
        let insights = '<h3 style="color: var(--accent-color); margin-bottom: 16px;">🤖 AI Insights & Recommendations</h3>';
        
        if (lowStockItems.length > 0) {
            insights += `
                <div class="ai-suggestion-item">
                    <span>💡</span>
                    <div>
                        <strong>Stock Alert:</strong> ${lowStockItems.length} items running low: ${lowStockItems.map(i => i.name).join(', ')}
                    </div>
                </div>
            `;
        }
        
        if (expiringItems.length > 0) {
            insights += `
                <div class="ai-suggestion-item">
                    <span>⚠️</span>
                    <div>
                        <strong>Expiry Alert:</strong> ${expiringItems.length} items expiring soon. Consider promotions.
                    </div>
                </div>
            `;
        }
        
        const todayRevenue = recentSales.reduce((sum, sale) => sum + sale.total, 0);
        insights += `
            <div class="ai-suggestion-item">
                <span>📈</span>
                <div>
                    <strong>Sales Trend:</strong> Recent revenue: ₵${todayRevenue.toLocaleString()}. Performance is ${todayRevenue > 5000 ? 'strong' : 'moderate'}.
                </div>
            </div>
        `;
        
        const topCustomer = appState.customers.reduce((prev, current) => 
            (prev.totalOrders > current.totalOrders) ? prev : current
        );
        insights += `
            <div class="ai-suggestion-item">
                <span>🎯</span>
                <div>
                    <strong>Customer Insight:</strong> Top customer ${topCustomer.name} has ${topCustomer.totalOrders} orders. Consider loyalty rewards.
                </div>
            </div>
        `;
        
        aiSuggestions.innerHTML = insights;
    }
}

// Report Generation
function generateReport() {
    showNotification('Generating comprehensive report...', 'info');
    
    setTimeout(() => {
        const report = {
            totalInventoryValue: appState.inventory.reduce((sum, item) => sum + (item.quantity * item.purchasePrice), 0),
            totalRevenue: appState.sales.reduce((sum, sale) => sum + sale.total, 0),
            totalProfit: appState.sales.reduce((sum, sale) => sum + sale.profit, 0),
            lowStockItems: appState.inventory.filter(item => item.status === 'low').length,
            totalCustomers: appState.customers.length,
            totalTransactions: appState.sales.length
        };
        
        alert(`Business Report Generated:\n\n` +
              `Total Inventory Value: ₵${report.totalInventoryValue.toLocaleString()}\n` +
              `Total Revenue: ₵${report.totalRevenue.toLocaleString()}\n` +
              `Total Profit: ₵${report.totalProfit.toLocaleString()}\n` +
              `Low Stock Items: ${report.lowStockItems}\n` +
              `Total Customers: ${report.totalCustomers}\n` +
              `Total Transactions: ${report.totalTransactions}`);
        
        showNotification('Report generated successfully!', 'success');
    }, 2000);
}

function generateAuditReport() {
    showNotification('Generating audit report...', 'info');
    
    setTimeout(() => {
        const auditData = {
            inventoryDiscrepancies: Math.floor(Math.random() * 3),
            systemIntegrity: 98.5,
            lastAuditDate: new Date().toISOString().split('T')[0],
            recommendations: [
                'Regular stock counting recommended',
                'Update expiry dates for food items',
                'Review pricing strategy for low-performing items'
            ]
        };
        
        alert(`Audit Report:\n\n` +
              `Inventory Discrepancies: ${auditData.inventoryDiscrepancies}\n` +
              `System Integrity: ${auditData.systemIntegrity}%\n` +
              `Last Audit: ${auditData.lastAuditDate}\n\n` +
              `Recommendations:\n${auditData.recommendations.join('\n')}`);
        
        showNotification('Audit report completed!', 'success');
    }, 2000);
}

// Authentication
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logging out...', 'info');
        setTimeout(() => {
            alert('Logout successful! In a real application, you would be redirected to the login page.');
        }, 1000);
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#10b981';
            break;
        case 'error':
            notification.style.backgroundColor = '#ef4444';
            break;
        case 'warning':
            notification.style.backgroundColor = '#f59e0b';
            break;
        default:
            notification.style.backgroundColor = '#2563eb';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    updateDashboardMetrics();
    updateSalesDashboard();
    refreshInventoryTable();
    refreshSalesTable();
    refreshCustomersTable();
    
    // Initialize AI insights
    updateAIInsights();
    
    // Add click handlers for modal backgrounds
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // ESC key to close modals
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                if (modal.style.display === 'block') {
                    closeModal(modal.id);
                }
            });
        }
        
        // Ctrl+N for new item (when on inventory tab)
        if (e.ctrlKey && e.key === 'n' && appState.currentTab === 'inventory') {
            e.preventDefault();
            openModal('addItem');
        }
        
        // Ctrl+S for new sale (when on sales tab)
        if (e.ctrlKey && e.key === 's' && appState.currentTab === 'sales') {
            e.preventDefault();
            openModal('addSale');
        }
    });
    
    console.log('EmTech Logistic System initialized successfully!');
});

// Search functionality (for inventory search)
function setupSearch() {
    const searchInput = document.querySelector('#inventory input[placeholder="Search inventory..."]');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#inventory tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
}

// Call search setup after DOM is loaded
document.addEventListener('DOMContentLoaded', setupSearch);