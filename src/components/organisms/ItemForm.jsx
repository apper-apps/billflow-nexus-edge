import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import { itemService } from '@/services/api/itemService';

const ItemForm = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    hsnCode: '',
    price: 0,
    gstRate: 18,
    unit: 'pcs',
    stockQuantity: 0,
    description: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData(item);
    }
  }, [item]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.hsnCode.trim()) {
      newErrors.hsnCode = 'HSN Code is required';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (formData.gstRate < 0 || formData.gstRate > 100) {
      newErrors.gstRate = 'GST Rate must be between 0 and 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      if (item) {
        await itemService.update(item.Id, formData);
        toast.success('Item updated successfully');
      } else {
        await itemService.create(formData);
        toast.success('Item created successfully');
      }
      
      onSave();
    } catch (error) {
      toast.error('Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {item ? 'Edit Item' : 'Add New Item'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <FormField
            label="Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            required
          />
          
          <FormField
            label="HSN Code"
            value={formData.hsnCode}
            onChange={(e) => handleInputChange('hsnCode', e.target.value)}
            error={errors.hsnCode}
            required
          />
          
          <FormField
            label="Price"
            type="number"
            value={formData.price}
            onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
            error={errors.price}
            min="0"
            step="0.01"
            required
          />
          
          <FormField
            label="GST Rate (%)"
            type="number"
            value={formData.gstRate}
            onChange={(e) => handleInputChange('gstRate', parseInt(e.target.value) || 0)}
            error={errors.gstRate}
            min="0"
            max="100"
            required
          />
          
          <FormField
            label="Unit"
            type="select"
            value={formData.unit}
            onChange={(e) => handleInputChange('unit', e.target.value)}
          >
            <option value="pcs">Pieces</option>
            <option value="kg">Kilograms</option>
            <option value="ltr">Liters</option>
            <option value="mtr">Meters</option>
            <option value="box">Box</option>
            <option value="pack">Pack</option>
          </FormField>
          
          <FormField
            label="Stock Quantity"
            type="number"
            value={formData.stockQuantity}
            onChange={(e) => handleInputChange('stockQuantity', parseInt(e.target.value) || 0)}
            min="0"
          />
        </div>

        <div className="mb-6">
          <FormField
            label="Description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Saving...' : (item ? 'Update Item' : 'Create Item')}
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

export default ItemForm;