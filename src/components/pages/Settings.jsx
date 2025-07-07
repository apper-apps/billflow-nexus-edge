import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Settings = () => {
  const [businessInfo, setBusinessInfo] = useState({
    name: 'Your Business Name',
    gstin: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    email: '',
    phone: '',
    website: ''
  });

  const [invoiceSettings, setInvoiceSettings] = useState({
    prefix: 'INV',
    startNumber: 1,
    terms: 'Payment due within 30 days',
    notes: 'Thank you for your business!'
  });

  const [taxSettings, setTaxSettings] = useState({
    defaultGstRate: 18,
    panNumber: '',
    cinNumber: ''
  });

  const handleBusinessInfoChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setBusinessInfo(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setBusinessInfo(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleInvoiceSettingsChange = (field, value) => {
    setInvoiceSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTaxSettingsChange = (field, value) => {
    setTaxSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    toast.success('Settings saved successfully!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <Button onClick={handleSave}>
          <ApperIcon name="Save" size={16} />
          Save Settings
        </Button>
      </div>

      {/* Business Information */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Business Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Business Name"
            value={businessInfo.name}
            onChange={(e) => handleBusinessInfoChange('name', e.target.value)}
            required
          />
          <FormField
            label="GSTIN"
            value={businessInfo.gstin}
            onChange={(e) => handleBusinessInfoChange('gstin', e.target.value.toUpperCase())}
            placeholder="22AAAAA0000A1Z5"
          />
          <FormField
            label="Email"
            type="email"
            value={businessInfo.email}
            onChange={(e) => handleBusinessInfoChange('email', e.target.value)}
          />
          <FormField
            label="Phone"
            value={businessInfo.phone}
            onChange={(e) => handleBusinessInfoChange('phone', e.target.value)}
          />
          <FormField
            label="Website"
            value={businessInfo.website}
            onChange={(e) => handleBusinessInfoChange('website', e.target.value)}
            placeholder="https://yourwebsite.com"
          />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Street"
            value={businessInfo.address.street}
            onChange={(e) => handleBusinessInfoChange('address.street', e.target.value)}
          />
          <FormField
            label="City"
            value={businessInfo.address.city}
            onChange={(e) => handleBusinessInfoChange('address.city', e.target.value)}
          />
          <FormField
            label="State"
            value={businessInfo.address.state}
            onChange={(e) => handleBusinessInfoChange('address.state', e.target.value)}
          />
          <FormField
            label="Pincode"
            value={businessInfo.address.pincode}
            onChange={(e) => handleBusinessInfoChange('address.pincode', e.target.value)}
          />
        </div>
      </div>

      {/* Invoice Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Invoice Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Invoice Prefix"
            value={invoiceSettings.prefix}
            onChange={(e) => handleInvoiceSettingsChange('prefix', e.target.value)}
          />
          <FormField
            label="Starting Number"
            type="number"
            value={invoiceSettings.startNumber}
            onChange={(e) => handleInvoiceSettingsChange('startNumber', parseInt(e.target.value) || 1)}
          />
        </div>
        <div className="mt-6">
          <FormField
            label="Default Terms & Conditions"
            value={invoiceSettings.terms}
            onChange={(e) => handleInvoiceSettingsChange('terms', e.target.value)}
          />
        </div>
        <div className="mt-6">
          <FormField
            label="Default Notes"
            value={invoiceSettings.notes}
            onChange={(e) => handleInvoiceSettingsChange('notes', e.target.value)}
          />
        </div>
      </div>

      {/* Tax Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Tax Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Default GST Rate (%)"
            type="number"
            value={taxSettings.defaultGstRate}
            onChange={(e) => handleTaxSettingsChange('defaultGstRate', parseInt(e.target.value) || 18)}
            min="0"
            max="100"
          />
          <FormField
            label="PAN Number"
            value={taxSettings.panNumber}
            onChange={(e) => handleTaxSettingsChange('panNumber', e.target.value.toUpperCase())}
            placeholder="AAAAA0000A"
          />
          <FormField
            label="CIN Number"
            value={taxSettings.cinNumber}
            onChange={(e) => handleTaxSettingsChange('cinNumber', e.target.value.toUpperCase())}
            placeholder="U12345XX2024PTC123456"
          />
        </div>
      </div>

      {/* Backup & Data */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Backup & Data
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => toast.info('Backup feature coming soon!')}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Download" size={16} />
            Export Data
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.info('Import feature coming soon!')}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Upload" size={16} />
            Import Data
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;