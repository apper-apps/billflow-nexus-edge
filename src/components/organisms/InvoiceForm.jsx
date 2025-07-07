import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { invoiceService } from '@/services/api/invoiceService';
import { customerService } from '@/services/api/customerService';
import { itemService } from '@/services/api/itemService';

const InvoiceForm = ({ invoice, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    customerId: '',
    items: [{ itemId: '', quantity: 1, rate: 0, amount: 0 }],
    notes: '',
    dueDate: '',
  });
  
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCustomers();
    loadItems();
    if (invoice) {
      setFormData(invoice);
    } else {
      generateInvoiceNumber();
    }
  }, [invoice]);

  const loadCustomers = async () => {
    try {
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (error) {
      toast.error('Failed to load customers');
    }
  };

  const loadItems = async () => {
    try {
      const data = await itemService.getAll();
      setItems(data);
    } catch (error) {
      toast.error('Failed to load items');
    }
  };

  const generateInvoiceNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const invoiceNumber = `INV-${year}${month}${day}-${random}`;
    setFormData(prev => ({ ...prev, invoiceNumber }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    if (field === 'itemId') {
      const selectedItem = items.find(item => item.Id === parseInt(value));
      if (selectedItem) {
        updatedItems[index].rate = selectedItem.price;
        updatedItems[index].amount = selectedItem.price * updatedItems[index].quantity;
      }
    }
    
    if (field === 'quantity' || field === 'rate') {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate;
    }
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { itemId: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        items: updatedItems
      }));
    }
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const taxAmount = subtotal * 0.18; // 18% GST
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { subtotal, taxAmount, total } = calculateTotals();
      const invoiceData = {
        ...formData,
        subtotal,
        taxAmount,
        total,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      
      if (invoice) {
        await invoiceService.update(invoice.Id, invoiceData);
        toast.success('Invoice updated successfully');
      } else {
        await invoiceService.create(invoiceData);
        toast.success('Invoice created successfully');
      }
      
      onSave();
    } catch (error) {
      toast.error('Failed to save invoice');
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, taxAmount, total } = calculateTotals();

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {invoice ? 'Edit Invoice' : 'Create New Invoice'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <FormField
            label="Invoice Number"
            value={formData.invoiceNumber}
            onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
            required
          />
          
          <FormField
            label="Customer"
            type="select"
            value={formData.customerId}
            onChange={(e) => handleInputChange('customerId', e.target.value)}
            required
          >
            <option value="">Select Customer</option>
            {customers.map(customer => (
              <option key={customer.Id} value={customer.Id}>
                {customer.name}
              </option>
            ))}
          </FormField>
          
          <FormField
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
          />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Items</h3>
          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                <FormField
                  label="Item"
                  type="select"
                  value={item.itemId}
                  onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                  required
                >
                  <option value="">Select Item</option>
                  {items.map(product => (
                    <option key={product.Id} value={product.Id}>
                      {product.name}
                    </option>
                  ))}
                </FormField>
                
                <FormField
                  label="Quantity"
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                  min="1"
                  required
                />
                
                <FormField
                  label="Rate"
                  type="number"
                  value={item.rate}
                  onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  required
                />
                
                <FormField
                  label="Amount"
                  value={item.amount.toFixed(2)}
                  readOnly
                />
                
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeItem(index)}
                    disabled={formData.items.length === 1}
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addItem}
              className="w-full"
            >
              <ApperIcon name="Plus" size={16} />
              Add Item
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <FormField
            label="Notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">GST (18%):</span>
              <span className="font-semibold">₹{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span className="gradient-text">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Saving...' : (invoice ? 'Update Invoice' : 'Create Invoice')}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </motion.form>
  );
};

export default InvoiceForm;