import { useState } from 'react';
import { motion } from 'framer-motion';
import CustomerList from '@/components/organisms/CustomerList';
import CustomerForm from '@/components/organisms/CustomerForm';

const Customers = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleCreate = () => {
    setSelectedCustomer(null);
    setShowForm(true);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setSelectedCustomer(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedCustomer(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {showForm ? (
        <CustomerForm
          customer={selectedCustomer}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <CustomerList
          onEdit={handleEdit}
          onCreate={handleCreate}
        />
      )}
    </motion.div>
  );
};

export default Customers;