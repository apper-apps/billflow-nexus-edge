import paymentData from '@/services/mockData/payments.json';

let payments = [...paymentData];

export const paymentService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...payments];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const payment = payments.find(pay => pay.Id === parseInt(id));
    if (!payment) {
      throw new Error('Payment not found');
    }
    return { ...payment };
  },

  create: async (paymentData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newPayment = {
      ...paymentData,
      Id: Math.max(...payments.map(pay => pay.Id)) + 1,
      createdAt: new Date().toISOString(),
    };
    payments.push(newPayment);
    return { ...newPayment };
  },

  update: async (id, paymentData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = payments.findIndex(pay => pay.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Payment not found');
    }
    payments[index] = { ...payments[index], ...paymentData };
    return { ...payments[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = payments.findIndex(pay => pay.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Payment not found');
    }
    payments.splice(index, 1);
    return true;
  },
};