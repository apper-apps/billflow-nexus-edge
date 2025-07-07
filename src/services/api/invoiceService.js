import invoiceData from '@/services/mockData/invoices.json';

let invoices = [...invoiceData];

export const invoiceService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...invoices];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const invoice = invoices.find(inv => inv.Id === parseInt(id));
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    return { ...invoice };
  },

  create: async (invoiceData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newInvoice = {
      ...invoiceData,
      Id: Math.max(...invoices.map(inv => inv.Id)) + 1,
      createdAt: new Date().toISOString(),
    };
    invoices.push(newInvoice);
    return { ...newInvoice };
  },

  update: async (id, invoiceData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = invoices.findIndex(inv => inv.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Invoice not found');
    }
    invoices[index] = { ...invoices[index], ...invoiceData };
    return { ...invoices[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = invoices.findIndex(inv => inv.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Invoice not found');
    }
    invoices.splice(index, 1);
    return true;
  },
};