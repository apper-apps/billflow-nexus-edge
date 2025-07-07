import { useState } from 'react';
import { motion } from 'framer-motion';
import InvoiceList from '@/components/organisms/InvoiceList';
import InvoiceForm from '@/components/organisms/InvoiceForm';

const Invoices = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleCreate = () => {
    setSelectedInvoice(null);
    setShowForm(true);
  };

  const handleEdit = (invoice) => {
    setSelectedInvoice(invoice);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setSelectedInvoice(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedInvoice(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {showForm ? (
        <InvoiceForm
          invoice={selectedInvoice}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <InvoiceList
          onEdit={handleEdit}
          onCreate={handleCreate}
        />
      )}
    </motion.div>
  );
};

export default Invoices;