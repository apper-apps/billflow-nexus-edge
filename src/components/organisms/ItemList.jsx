import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { itemService } from '@/services/api/itemService';

const ItemList = ({ onEdit, onCreate }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await itemService.getAll();
      setItems(data);
    } catch (err) {
      setError('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemService.delete(id);
        toast.success('Item deleted successfully');
        loadItems();
      } catch (error) {
        toast.error('Failed to delete item');
      }
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.hsnCode.includes(searchTerm)
  );

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadItems} />;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Items</h2>
          <div className="flex gap-4 items-center">
            <SearchBar
              placeholder="Search items..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
            <Button onClick={onCreate}>
              <ApperIcon name="Plus" size={16} />
              New Item
            </Button>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <Empty
            icon="Package"
            title="No items found"
            description="Add your first item to start creating invoices."
            actionLabel="Add Item"
            onAction={onCreate}
          />
        ) : (
          <div className="table-container">
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Name</th>
                  <th className="table-header-cell">HSN Code</th>
                  <th className="table-header-cell">Price</th>
                  <th className="table-header-cell">GST Rate</th>
                  <th className="table-header-cell">Stock</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <motion.tr
                    key={item.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="table-row"
                  >
                    <td className="table-cell font-medium text-primary-600">
                      {item.name}
                    </td>
                    <td className="table-cell">
                      {item.hsnCode}
                    </td>
                    <td className="table-cell font-semibold">
                      ₹{item.price.toFixed(2)}
                    </td>
                    <td className="table-cell">
                      {item.gstRate}%
                    </td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.stockQuantity > 10 
                          ? 'bg-green-100 text-green-800' 
                          : item.stockQuantity > 0 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {item.stockQuantity} {item.unit}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(item)}
                        >
                          <ApperIcon name="Edit" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.Id)}
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemList;