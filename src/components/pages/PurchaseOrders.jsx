import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PurchaseOrderList from '@/components/organisms/PurchaseOrderList';
import PurchaseOrderForm from '@/components/organisms/PurchaseOrderForm';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import ApperIcon from '@/components/ApperIcon';
import { purchaseOrderService } from '@/services/api/purchaseOrderService';

const PurchaseOrders = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [filteredPOs, setFilteredPOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPO, setEditingPO] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadPurchaseOrders();
  }, []);

  useEffect(() => {
    filterPurchaseOrders();
  }, [purchaseOrders, searchTerm, statusFilter]);

  const loadPurchaseOrders = async () => {
    try {
      setLoading(true);
      const data = await purchaseOrderService.getAll();
      setPurchaseOrders(data);
      setError(null);
    } catch (err) {
      setError('Failed to load purchase orders');
      toast.error('Failed to load purchase orders');
    } finally {
      setLoading(false);
    }
  };

  const filterPurchaseOrders = () => {
    let filtered = [...purchaseOrders];

    if (searchTerm) {
      filtered = filtered.filter(po =>
        po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(po => po.status === statusFilter);
    }

    setFilteredPOs(filtered);
  };

  const handleCreate = () => {
    setEditingPO(null);
    setShowForm(true);
  };

  const handleEdit = (purchaseOrder) => {
    setEditingPO(purchaseOrder);
    setShowForm(true);
  };

  const handleSave = async (purchaseOrderData) => {
    try {
      if (editingPO) {
        await purchaseOrderService.update(editingPO.Id, purchaseOrderData);
        toast.success('Purchase order updated successfully');
      } else {
        await purchaseOrderService.create(purchaseOrderData);
        toast.success('Purchase order created successfully');
      }
      await loadPurchaseOrders();
      handleCancel();
    } catch (err) {
      toast.error(editingPO ? 'Failed to update purchase order' : 'Failed to create purchase order');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this purchase order?')) {
      try {
        await purchaseOrderService.delete(id);
        toast.success('Purchase order deleted successfully');
        await loadPurchaseOrders();
      } catch (err) {
        toast.error('Failed to delete purchase order');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPO(null);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const po = purchaseOrders.find(p => p.Id === id);
      if (po) {
        await purchaseOrderService.update(id, { ...po, status: newStatus });
        toast.success('Purchase order status updated');
        await loadPurchaseOrders();
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (showForm) {
    return (
      <PurchaseOrderForm
        purchaseOrder={editingPO}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
          <p className="text-gray-600">Manage and track your purchase orders</p>
        </div>
        <Button onClick={handleCreate} className="w-full sm:w-auto">
          <ApperIcon name="Plus" size={20} />
          <span className="ml-2">Create Purchase Order</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by PO number, supplier, or description..."
            />
          </div>
          <div className="w-full lg:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="received">Received</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Purchase Orders List */}
      <PurchaseOrderList
        purchaseOrders={filteredPOs}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
    </motion.div>
  );
};

export default PurchaseOrders;