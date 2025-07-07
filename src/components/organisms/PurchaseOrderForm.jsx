import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';
import { customerService } from '@/services/api/customerService';
import { itemService } from '@/services/api/itemService';

const PurchaseOrderForm = ({ purchaseOrder, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    poNumber: '',
    supplier: '',
    supplierEmail: '',
    supplierPhone: '',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDate: '',
    status: 'draft',
    description: '',
    lineItems: [{ itemId: '', itemName: '', quantity: 1, unitPrice: 0, total: 0 }],
    subtotal: 0,
    tax: 0,
    total: 0,
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadCustomers();
    loadItems();
    if (purchaseOrder) {
      setFormData({
        ...purchaseOrder,
        orderDate: purchaseOrder.orderDate.split('T')[0],
        expectedDate: purchaseOrder.expectedDate ? purchaseOrder.expectedDate.split('T')[0] : ''
      });
    } else {
      generatePONumber();
    }
  }, [purchaseOrder]);

  useEffect(() => {
    calculateTotals();
  }, [formData.lineItems]);

  const loadCustomers = async () => {
    try {
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (err) {
      console.error('Failed to load customers:', err);
    }
  };

  const loadItems = async () => {
    try {
      const data = await itemService.getAll();
      setItems(data);
    } catch (err) {
      console.error('Failed to load items:', err);
    }
  };

  const generatePONumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    setFormData(prev => ({
      ...prev,
      poNumber: `PO-${timestamp}`
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleLineItemChange = (index, field, value) => {
    const newLineItems = [...formData.lineItems];
    newLineItems[index] = {
      ...newLineItems[index],
      [field]: value
    };

    if (field === 'itemId' && value) {
      const selectedItem = items.find(item => item.Id === parseInt(value));
      if (selectedItem) {
        newLineItems[index] = {
          ...newLineItems[index],
          itemName: selectedItem.name,
          unitPrice: selectedItem.price || 0
        };
      }
    }

    if (field === 'quantity' || field === 'unitPrice') {
      newLineItems[index].total = (newLineItems[index].quantity || 0) * (newLineItems[index].unitPrice || 0);
    }

    setFormData(prev => ({
      ...prev,
      lineItems: newLineItems
    }));
  };

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { itemId: '', itemName: '', quantity: 1, unitPrice: 0, total: 0 }]
    }));
  };

  const removeLineItem = (index) => {
    if (formData.lineItems.length > 1) {
      setFormData(prev => ({
        ...prev,
        lineItems: prev.lineItems.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateTotals = () => {
    const subtotal = formData.lineItems.reduce((sum, item) => sum + (item.total || 0), 0);
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + tax;

    setFormData(prev => ({
      ...prev,
      subtotal,
      tax,
      total
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.poNumber.trim()) {
      newErrors.poNumber = 'PO number is required';
    }

    if (!formData.supplier.trim()) {
      newErrors.supplier = 'Supplier is required';
    }

    if (!formData.orderDate) {
      newErrors.orderDate = 'Order date is required';
    }

    if (!formData.expectedDate) {
      newErrors.expectedDate = 'Expected delivery date is required';
    }

    if (formData.lineItems.some(item => !item.itemId || !item.quantity || item.quantity <= 0)) {
      newErrors.lineItems = 'All line items must have valid item and quantity';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
    } catch (err) {
      toast.error('Failed to save purchase order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {purchaseOrder ? 'Edit Purchase Order' : 'Create Purchase Order'}
          </h1>
          <p className="text-gray-600">
            {purchaseOrder ? 'Update purchase order details' : 'Create a new purchase order'}
          </p>
        </div>
        <Button variant="outline" onClick={onCancel}>
          <ApperIcon name="X" size={20} />
          <span className="ml-2">Cancel</span>
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="PO Number" error={errors.poNumber}>
            <Input
              value={formData.poNumber}
              onChange={(e) => handleInputChange('poNumber', e.target.value)}
              error={errors.poNumber}
              placeholder="PO-123456"
            />
          </FormField>

          <FormField label="Status" error={errors.status}>
            <Select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              error={errors.status}
            >
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="received">Received</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </FormField>

          <FormField label="Supplier" error={errors.supplier}>
            <Input
              value={formData.supplier}
              onChange={(e) => handleInputChange('supplier', e.target.value)}
              error={errors.supplier}
              placeholder="Supplier name"
            />
          </FormField>

          <FormField label="Supplier Email">
            <Input
              type="email"
              value={formData.supplierEmail}
              onChange={(e) => handleInputChange('supplierEmail', e.target.value)}
              placeholder="supplier@company.com"
            />
          </FormField>

          <FormField label="Order Date" error={errors.orderDate}>
            <Input
              type="date"
              value={formData.orderDate}
              onChange={(e) => handleInputChange('orderDate', e.target.value)}
              error={errors.orderDate}
            />
          </FormField>

          <FormField label="Expected Delivery" error={errors.expectedDate}>
            <Input
              type="date"
              value={formData.expectedDate}
              onChange={(e) => handleInputChange('expectedDate', e.target.value)}
              error={errors.expectedDate}
            />
          </FormField>
        </div>

        <FormField label="Description">
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="form-input min-h-[80px] resize-vertical"
            placeholder="Purchase order description..."
          />
        </FormField>

        {/* Line Items */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Line Items</h3>
            <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
              <ApperIcon name="Plus" size={16} />
              <span className="ml-2">Add Item</span>
            </Button>
          </div>
          
          {errors.lineItems && (
            <p className="text-red-500 text-sm mb-4">{errors.lineItems}</p>
          )}

          <div className="space-y-4">
            {formData.lineItems.map((item, index) => (
              <div key={index} className="grid grid-cols-1 lg:grid-cols-6 gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="lg:col-span-2">
                  <label className="form-label">Item</label>
                  <Select
                    value={item.itemId}
                    onChange={(e) => handleLineItemChange(index, 'itemId', e.target.value)}
                  >
                    <option value="">Select item</option>
                    {items.map(availableItem => (
                      <option key={availableItem.Id} value={availableItem.Id}>
                        {availableItem.name}
                      </option>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <label className="form-label">Quantity</label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleLineItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div>
                  <label className="form-label">Unit Price</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) => handleLineItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div>
                  <label className="form-label">Total</label>
                  <Input
                    type="number"
                    value={item.total.toFixed(2)}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeLineItem(index)}
                    disabled={formData.lineItems.length === 1}
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="border-t pt-6">
          <div className="flex justify-end">
            <div className="w-full max-w-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₹{formData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (18%):</span>
                <span className="font-medium">₹{formData.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>₹{formData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <FormField label="Notes">
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="form-input min-h-[80px] resize-vertical"
            placeholder="Additional notes..."
          />
        </FormField>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {purchaseOrder ? 'Update Purchase Order' : 'Create Purchase Order'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default PurchaseOrderForm;