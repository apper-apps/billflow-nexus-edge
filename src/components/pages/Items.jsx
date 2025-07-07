import { useState } from 'react';
import { motion } from 'framer-motion';
import ItemList from '@/components/organisms/ItemList';
import ItemForm from '@/components/organisms/ItemForm';

const Items = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleCreate = () => {
    setSelectedItem(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedItem(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {showForm ? (
        <ItemForm
          item={selectedItem}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <ItemList
          onEdit={handleEdit}
          onCreate={handleCreate}
        />
      )}
    </motion.div>
  );
};

export default Items;