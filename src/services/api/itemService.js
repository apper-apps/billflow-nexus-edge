import itemData from '@/services/mockData/items.json';

let items = [...itemData];

export const itemService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...items];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const item = items.find(item => item.Id === parseInt(id));
    if (!item) {
      throw new Error('Item not found');
    }
    return { ...item };
  },

  create: async (itemData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newItem = {
      ...itemData,
      Id: Math.max(...items.map(item => item.Id)) + 1,
      createdAt: new Date().toISOString(),
    };
    items.push(newItem);
    return { ...newItem };
  },

  update: async (id, itemData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = items.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Item not found');
    }
    items[index] = { ...items[index], ...itemData };
    return { ...items[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = items.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Item not found');
    }
    items.splice(index, 1);
    return true;
  },
};