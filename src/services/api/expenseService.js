import expensesData from '@/services/mockData/expenses.json';

// In-memory storage for expenses
let expenses = [...expensesData];
let nextId = Math.max(...expenses.map(expense => expense.Id)) + 1;

// Auto-categorization rules
const categorizationRules = {
  keywords: {
    office_supplies: ['stationery', 'paper', 'pen', 'pencil', 'laptop', 'computer', 'mouse', 'keyboard', 'printer', 'ink', 'toner', 'software', 'license', 'microsoft', 'adobe', 'chair', 'desk', 'furniture'],
    travel: ['flight', 'hotel', 'taxi', 'uber', 'ola', 'train', 'bus', 'accommodation', 'boarding', 'lodging', 'fuel', 'petrol', 'diesel', 'parking', 'toll'],
    utilities: ['electricity', 'water', 'internet', 'wifi', 'phone', 'mobile', 'broadband', 'gas', 'maintenance'],
    marketing: ['advertising', 'ad', 'promotion', 'marketing', 'social media', 'facebook', 'google ads', 'seo', 'website', 'design', 'branding'],
    meals: ['restaurant', 'food', 'lunch', 'dinner', 'breakfast', 'coffee', 'tea', 'catering', 'meal', 'snacks', 'beverage'],
    professional: ['legal', 'lawyer', 'consultant', 'consulting', 'training', 'course', 'certification', 'seminar', 'workshop', 'conference'],
    maintenance: ['repair', 'service', 'cleaning', 'security', 'insurance', 'maintenance', 'fix'],
    miscellaneous: ['bank', 'charge', 'fee', 'tax', 'misc', 'other', 'petty cash']
  },
  vendors: {
    office_supplies: ['staples', 'office depot', 'amazon', 'flipkart', 'reliance digital', 'croma'],
    travel: ['makemytrip', 'cleartrip', 'goibibo', 'yatra', 'booking.com', 'agoda', 'oyo', 'treebo'],
    utilities: ['bsnl', 'airtel', 'jio', 'vodafone', 'tata sky', 'dish tv'],
    marketing: ['google', 'facebook', 'instagram', 'linkedin', 'twitter'],
    meals: ['zomato', 'swiggy', 'uber eats', 'dominos', 'pizza hut', 'mcdonalds', 'kfc', 'subway'],
    professional: ['udemy', 'coursera', 'skillshare', 'linkedin learning'],
    maintenance: ['urban company', 'housejoy', 'justdial']
  }
};

const suggestCategory = (description, vendor) => {
  const text = `${description} ${vendor}`.toLowerCase();
  
  // Check vendor patterns first (more specific)
  for (const [category, vendors] of Object.entries(categorizationRules.vendors)) {
    if (vendors.some(v => text.includes(v))) {
      return category;
    }
  }
  
  // Check keyword patterns
  for (const [category, keywords] of Object.entries(categorizationRules.keywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }
  
  return null;
};

const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 300));

export const expenseService = {
  async getAll() {
    await simulateDelay();
    return [...expenses];
  },

  async getById(id) {
    await simulateDelay();
    const expense = expenses.find(expense => expense.Id === parseInt(id));
    return expense ? { ...expense } : null;
  },

  async create(expenseData) {
    await simulateDelay();
    
    const newExpense = {
      ...expenseData,
      Id: nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    expenses.push(newExpense);
    return { ...newExpense };
  },

  async update(id, expenseData) {
    await simulateDelay();
    
    const index = expenses.findIndex(expense => expense.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Expense not found');
    }
    
    const updatedExpense = {
      ...expenses[index],
      ...expenseData,
      Id: parseInt(id), // Prevent ID modification
      updatedAt: new Date().toISOString()
    };
    
    expenses[index] = updatedExpense;
    return { ...updatedExpense };
  },

  async delete(id) {
    await simulateDelay();
    
    const index = expenses.findIndex(expense => expense.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Expense not found');
    }
    
    expenses.splice(index, 1);
    return true;
  },

  // Auto-categorization helper
  suggestCategory,

  // Analytics methods
  async getExpensesByCategory() {
    await simulateDelay();
    const categories = {};
    
    expenses.forEach(expense => {
      const category = expense.category || 'uncategorized';
      if (!categories[category]) {
        categories[category] = { total: 0, count: 0 };
      }
      categories[category].total += expense.amount;
      categories[category].count += 1;
    });
    
    return categories;
  },

  async getExpensesByDateRange(startDate, endDate) {
    await simulateDelay();
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
    });
  },

  async getReimbursableExpenses() {
    await simulateDelay();
    return expenses.filter(expense => expense.isReimbursable);
  }
};