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
import { paymentService } from '@/services/api/paymentService';
import { invoiceService } from '@/services/api/invoiceService';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPayments();
    loadInvoices();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentService.getAll();
      setPayments(data);
    } catch (err) {
      setError('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const loadInvoices = async () => {
    try {
      const data = await invoiceService.getAll();
      setInvoices(data);
    } catch (err) {
      console.error('Failed to load invoices:', err);
    }
  };

  const getInvoiceNumber = (invoiceId) => {
    const invoice = invoices.find(inv => inv.Id === invoiceId);
    return invoice ? invoice.invoiceNumber : 'Unknown';
  };

  const filteredPayments = payments.filter(payment => {
    const invoiceNumber = getInvoiceNumber(payment.invoiceId);
    return invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
           payment.reference.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadPayments} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Payments</h2>
          <div className="flex gap-4 items-center">
            <SearchBar
              placeholder="Search payments..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
            <Button onClick={() => toast.info('Record payment feature coming soon!')}>
              <ApperIcon name="Plus" size={16} />
              Record Payment
            </Button>
          </div>
        </div>

        {filteredPayments.length === 0 ? (
          <Empty
            icon="CreditCard"
            title="No payments found"
            description="Payment records will appear here once invoices are paid."
            actionLabel="Record Payment"
            onAction={() => toast.info('Record payment feature coming soon!')}
          />
        ) : (
          <div className="table-container">
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Invoice #</th>
                  <th className="table-header-cell">Amount</th>
                  <th className="table-header-cell">Payment Date</th>
                  <th className="table-header-cell">Mode</th>
                  <th className="table-header-cell">Reference</th>
                  <th className="table-header-cell">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <motion.tr
                    key={payment.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="table-row"
                  >
                    <td className="table-cell font-medium text-primary-600">
                      {getInvoiceNumber(payment.invoiceId)}
                    </td>
                    <td className="table-cell font-semibold">
                      ₹{payment.amount.toFixed(2)}
                    </td>
                    <td className="table-cell">
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </td>
                    <td className="table-cell">
                      {payment.mode}
                    </td>
                    <td className="table-cell">
                      {payment.reference}
                    </td>
                    <td className="table-cell">
                      <StatusBadge status={payment.status === 'completed' ? 'paid' : 'pending'} />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Payments;