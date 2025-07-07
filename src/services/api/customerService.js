import customerData from '@/services/mockData/customers.json';

let customers = [...customerData];

export const customerService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...customers];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const customer = customers.find(cust => cust.Id === parseInt(id));
    if (!customer) {
      throw new Error('Customer not found');
    }
    return { ...customer };
  },

  create: async (customerData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newCustomer = {
      ...customerData,
      Id: Math.max(...customers.map(cust => cust.Id)) + 1,
      createdAt: new Date().toISOString(),
    };
    customers.push(newCustomer);
    return { ...newCustomer };
  },

  update: async (id, customerData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = customers.findIndex(cust => cust.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Customer not found');
    }
    customers[index] = { ...customers[index], ...customerData };
    return { ...customers[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = customers.findIndex(cust => cust.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Customer not found');
    }
    customers.splice(index, 1);
    return true;
  },
};