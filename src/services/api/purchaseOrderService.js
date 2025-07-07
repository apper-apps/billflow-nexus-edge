import mockData from '@/services/mockData/purchaseOrders.json';

let purchaseOrders = [...mockData];
let lastId = Math.max(...purchaseOrders.map(po => po.Id), 0);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const purchaseOrderService = {
  // Get all purchase orders
  async getAll() {
    await delay(200);
    return [...purchaseOrders];
  },

  // Get purchase order by ID
  async getById(id) {
    await delay(200);
    const poId = parseInt(id);
    if (isNaN(poId)) {
      throw new Error('Invalid purchase order ID');
    }
    
    const purchaseOrder = purchaseOrders.find(po => po.Id === poId);
    if (!purchaseOrder) {
      throw new Error('Purchase order not found');
    }
    
    return { ...purchaseOrder };
  },

  // Create new purchase order
  async create(poData) {
    await delay(300);
    
    const newId = ++lastId;
    const newPO = {
      ...poData,
      Id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    purchaseOrders.push(newPO);
    return { ...newPO };
  },

  // Update purchase order
  async update(id, poData) {
    await delay(300);
    
    const poId = parseInt(id);
    if (isNaN(poId)) {
      throw new Error('Invalid purchase order ID');
    }
    
    const index = purchaseOrders.findIndex(po => po.Id === poId);
    if (index === -1) {
      throw new Error('Purchase order not found');
    }
    
    const updatedPO = {
      ...purchaseOrders[index],
      ...poData,
      Id: poId, // Ensure ID cannot be changed
      updatedAt: new Date().toISOString()
    };
    
    purchaseOrders[index] = updatedPO;
    return { ...updatedPO };
  },

  // Delete purchase order
  async delete(id) {
    await delay(250);
    
    const poId = parseInt(id);
    if (isNaN(poId)) {
      throw new Error('Invalid purchase order ID');
    }
    
    const index = purchaseOrders.findIndex(po => po.Id === poId);
    if (index === -1) {
      throw new Error('Purchase order not found');
    }
    
    purchaseOrders.splice(index, 1);
    return true;
  },

  // Get purchase orders by status
  async getByStatus(status) {
    await delay(200);
    return [...purchaseOrders.filter(po => po.status === status)];
  },

  // Get purchase orders by supplier
  async getBySupplier(supplier) {
    await delay(200);
    return [...purchaseOrders.filter(po => 
      po.supplier.toLowerCase().includes(supplier.toLowerCase())
    )];
  }
};