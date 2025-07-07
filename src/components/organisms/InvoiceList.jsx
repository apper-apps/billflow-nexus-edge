import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import StatusBadge from '@/components/molecules/StatusBadge';
import SearchBar from '@/components/molecules/SearchBar';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { invoiceService } from '@/services/api/invoiceService';
import { customerService } from '@/services/api/customerService';

const InvoiceList = ({ onEdit, onCreate }) => {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadInvoices();
    loadCustomers();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await invoiceService.getAll();
      setInvoices(data);
    } catch (err) {
      setError('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (err) {
      console.error('Failed to load customers:', err);
    }
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.Id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await invoiceService.delete(id);
        toast.success('Invoice deleted successfully');
        loadInvoices();
      } catch (error) {
        toast.error('Failed to delete invoice');
      }
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getCustomerName(invoice.customerId).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadInvoices} />;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Invoices</h2>
          <div className="flex gap-4 items-center">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
            <SearchBar
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
            <Button onClick={onCreate}>
              <ApperIcon name="Plus" size={16} />
              New Invoice
            </Button>
          </div>
        </div>

        {filteredInvoices.length === 0 ? (
          <Empty
            icon="FileText"
            title="No invoices found"
            description="Create your first invoice to get started with billing."
            actionLabel="Create Invoice"
            onAction={onCreate}
          />
        ) : (
          <div className="table-container">
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Invoice #</th>
                  <th className="table-header-cell">Customer</th>
                  <th className="table-header-cell">Amount</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Due Date</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <motion.tr
                    key={invoice.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="table-row"
                  >
                    <td className="table-cell font-medium text-primary-600">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="table-cell">
                      {getCustomerName(invoice.customerId)}
                    </td>
                    <td className="table-cell font-semibold">
                      ₹{invoice.total?.toFixed(2) || '0.00'}
                    </td>
                    <td className="table-cell">
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td className="table-cell">
                      {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="table-cell">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(invoice)}
                        >
                          <ApperIcon name="Edit" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(invoice.Id)}
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info('PDF download feature coming soon!')}
                        >
                          <ApperIcon name="Download" size={16} />
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

export default InvoiceList;