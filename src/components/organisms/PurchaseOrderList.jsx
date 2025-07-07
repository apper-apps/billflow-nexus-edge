import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import StatusBadge from '@/components/molecules/StatusBadge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const PurchaseOrderList = ({ 
  purchaseOrders, 
  loading, 
  error, 
  onEdit, 
  onDelete, 
  onStatusChange 
}) => {
  const [sortBy, setSortBy] = useState('orderDate');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortedPOs = () => {
    if (!purchaseOrders.length) return [];
    
    return [...purchaseOrders].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'orderDate' || sortBy === 'expectedDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortBy === 'total') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'received': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'draft': return 'secondary';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!purchaseOrders.length) {
    return (
      <Empty
        icon="ShoppingCart"
        title="No Purchase Orders"
        description="Start by creating your first purchase order to track your purchases."
      />
    );
  }

  const sortedPOs = getSortedPOs();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="table-header">
            <tr>
              <th 
                className="table-header-cell cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('poNumber')}
              >
                <div className="flex items-center gap-2">
                  PO Number
                  <ApperIcon 
                    name={sortBy === 'poNumber' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={16} 
                  />
                </div>
              </th>
              <th 
                className="table-header-cell cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('supplier')}
              >
                <div className="flex items-center gap-2">
                  Supplier
                  <ApperIcon 
                    name={sortBy === 'supplier' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={16} 
                  />
                </div>
              </th>
              <th 
                className="table-header-cell cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('orderDate')}
              >
                <div className="flex items-center gap-2">
                  Order Date
                  <ApperIcon 
                    name={sortBy === 'orderDate' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={16} 
                  />
                </div>
              </th>
              <th 
                className="table-header-cell cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('expectedDate')}
              >
                <div className="flex items-center gap-2">
                  Expected Date
                  <ApperIcon 
                    name={sortBy === 'expectedDate' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={16} 
                  />
                </div>
              </th>
              <th className="table-header-cell">Status</th>
              <th 
                className="table-header-cell cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('total')}
              >
                <div className="flex items-center gap-2">
                  Total
                  <ApperIcon 
                    name={sortBy === 'total' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={16} 
                  />
                </div>
              </th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedPOs.map((po) => (
              <motion.tr
                key={po.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="table-row"
              >
                <td className="table-cell">
                  <div className="font-medium text-primary-600">{po.poNumber}</div>
                  {po.description && (
                    <div className="text-sm text-gray-500 truncate max-w-32">{po.description}</div>
                  )}
                </td>
                <td className="table-cell">
                  <div className="font-medium">{po.supplier}</div>
                  {po.supplierEmail && (
                    <div className="text-sm text-gray-500">{po.supplierEmail}</div>
                  )}
                </td>
                <td className="table-cell">{formatDate(po.orderDate)}</td>
                <td className="table-cell">{formatDate(po.expectedDate)}</td>
                <td className="table-cell">
                  <StatusBadge 
                    status={po.status} 
                    variant={getStatusVariant(po.status)}
                  />
                </td>
                <td className="table-cell font-medium">{formatCurrency(po.total)}</td>
                <td className="table-cell">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(po)}
                    >
                      <ApperIcon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(po.Id)}
                      className="text-red-600 hover:text-red-700"
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

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {sortedPOs.map((po) => (
          <motion.div
            key={po.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-primary-600">{po.poNumber}</h3>
                <p className="text-sm text-gray-600">{po.supplier}</p>
              </div>
              <StatusBadge 
                status={po.status} 
                variant={getStatusVariant(po.status)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Order Date:</span>
                <p className="font-medium">{formatDate(po.orderDate)}</p>
              </div>
              <div>
                <span className="text-gray-500">Expected:</span>
                <p className="font-medium">{formatDate(po.expectedDate)}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="text-lg font-bold text-primary-600">
                {formatCurrency(po.total)}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(po)}
                >
                  <ApperIcon name="Edit" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(po.Id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <ApperIcon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PurchaseOrderList;