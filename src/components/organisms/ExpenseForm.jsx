import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { expenseService } from '@/services/api/expenseService';

const ExpenseForm = ({ expense, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    subcategory: '',
    vendor: '',
    paymentMethod: 'cash',
    isReimbursable: false,
    receipt: null,
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [suggestedCategory, setSuggestedCategory] = useState(null);

  const categories = {
    'office_supplies': ['Stationery', 'Computer Equipment', 'Furniture', 'Software'],
    'travel': ['Transportation', 'Accommodation', 'Meals', 'Fuel'],
    'utilities': ['Electricity', 'Internet', 'Phone', 'Water'],
    'marketing': ['Advertising', 'Promotional Materials', 'Events', 'Digital Marketing'],
    'meals': ['Business Meals', 'Team Lunch', 'Client Entertainment', 'Catering'],
    'professional': ['Legal', 'Consulting', 'Training', 'Certification'],
    'maintenance': ['Repairs', 'Cleaning', 'Security', 'Insurance'],
    'miscellaneous': ['Other', 'Petty Cash', 'Bank Charges', 'Taxes']
  };

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'debit_card', label: 'Debit Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'digital_wallet', label: 'Digital Wallet' }
  ];

  useEffect(() => {
    if (expense) {
      setFormData({
        description: expense.description || '',
        amount: expense.amount?.toString() || '',
        date: expense.date || new Date().toISOString().split('T')[0],
        category: expense.category || '',
        subcategory: expense.subcategory || '',
        vendor: expense.vendor || '',
        paymentMethod: expense.paymentMethod || 'cash',
        isReimbursable: expense.isReimbursable || false,
        receipt: null,
        notes: expense.notes || ''
      });
      if (expense.receiptUrl) {
        setReceiptPreview(expense.receiptUrl);
      }
    }
  }, [expense]);

  useEffect(() => {
    // Auto-categorization when description or vendor changes
    if (formData.description || formData.vendor) {
      const suggested = expenseService.suggestCategory(formData.description, formData.vendor);
      if (suggested && suggested !== formData.category) {
        setSuggestedCategory(suggested);
      } else {
        setSuggestedCategory(null);
      }
    }
  }, [formData.description, formData.vendor, formData.category]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload only images (JPEG, PNG, GIF) or PDF files');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setFormData(prev => ({ ...prev, receipt: file }));
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setReceiptPreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setReceiptPreview('pdf');
      }
    }
  };

  const handleRemoveReceipt = () => {
    setFormData(prev => ({ ...prev, receipt: null }));
    setReceiptPreview(null);
    document.getElementById('receipt-input').value = '';
  };

  const applySuggestedCategory = () => {
    if (suggestedCategory) {
      setFormData(prev => ({ ...prev, category: suggestedCategory }));
      setSuggestedCategory(null);
      toast.info('Category applied successfully');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.vendor.trim()) {
      newErrors.vendor = 'Vendor is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please correct the errors and try again');
      return;
    }

    setIsLoading(true);

    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
        receiptUrl: formData.receipt ? URL.createObjectURL(formData.receipt) : (expense?.receiptUrl || null)
      };

      if (expense) {
        await expenseService.update(expense.Id, expenseData);
        toast.success('Expense updated successfully');
      } else {
        await expenseService.create(expenseData);
        toast.success('Expense created successfully');
      }

      onSave();
    } catch (error) {
      console.error('Error saving expense:', error);
      toast.error('Failed to save expense. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {expense ? 'Edit Expense' : 'Add New Expense'}
        </h2>
        <Button variant="ghost" onClick={onCancel}>
          <ApperIcon name="X" size={20} />
        </Button>
      </div>

      {suggestedCategory && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ApperIcon name="Lightbulb" size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Suggested category: <strong>{suggestedCategory}</strong>
              </span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => setSuggestedCategory(null)}>
                Dismiss
              </Button>
              <Button size="sm" onClick={applySuggestedCategory}>
                Apply
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Description"
            required
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            error={errors.description}
            placeholder="Enter expense description"
          />

          <FormField
            label="Amount"
            type="number"
            required
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            error={errors.amount}
            placeholder="0.00"
            step="0.01"
            min="0"
          />

          <FormField
            label="Date"
            type="date"
            required
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            error={errors.date}
          />

          <FormField
            label="Vendor"
            required
            value={formData.vendor}
            onChange={(e) => handleInputChange('vendor', e.target.value)}
            error={errors.vendor}
            placeholder="Enter vendor name"
          />

          <FormField
            label="Category"
            type="select"
            required
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            error={errors.category}
          >
            <option value="">Select category</option>
            {Object.keys(categories).map(category => (
              <option key={category} value={category}>
                {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </FormField>

          <FormField
            label="Subcategory"
            type="select"
            value={formData.subcategory}
            onChange={(e) => handleInputChange('subcategory', e.target.value)}
            disabled={!formData.category}
          >
            <option value="">Select subcategory</option>
            {formData.category && categories[formData.category]?.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </FormField>

          <FormField
            label="Payment Method"
            type="select"
            value={formData.paymentMethod}
            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
          >
            {paymentMethods.map(method => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </FormField>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="reimbursable"
              checked={formData.isReimbursable}
              onChange={(e) => handleInputChange('isReimbursable', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="reimbursable" className="text-sm font-medium text-gray-700">
              Reimbursable expense
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Receipt Upload
          </label>
          
          {!receiptPreview ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                id="receipt-input"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="receipt-input" className="cursor-pointer">
                <ApperIcon name="Upload" size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Click to upload receipt</p>
                <p className="text-sm text-gray-500">PNG, JPG, GIF or PDF up to 5MB</p>
              </label>
            </div>
          ) : (
            <div className="relative">
              {receiptPreview === 'pdf' ? (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="FileText" size={20} className="text-red-600" />
                    <span className="text-sm font-medium">PDF Receipt Uploaded</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveReceipt}
                  >
                    <ApperIcon name="X" size={16} />
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={receiptPreview}
                    alt="Receipt preview"
                    className="w-full max-w-xs h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveReceipt}
                  >
                    <ApperIcon name="X" size={16} />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <FormField
          label="Notes"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Additional notes (optional)"
          rows={3}
          className="resize-none"
        />

        <div className="flex gap-4 pt-6">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            {isLoading ? (
              <>
                <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                {expense ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <ApperIcon name="Save" size={16} className="mr-2" />
                {expense ? 'Update Expense' : 'Create Expense'}
              </>
            )}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ExpenseForm;