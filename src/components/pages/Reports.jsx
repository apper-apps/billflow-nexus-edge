import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import StatCard from '@/components/molecules/StatCard';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { invoiceService } from '@/services/api/invoiceService';
import { customerService } from '@/services/api/customerService';

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');

  useEffect(() => {
    loadReports();
  }, [selectedPeriod]);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [invoices, customers] = await Promise.all([
        invoiceService.getAll(),
        customerService.getAll()
      ]);

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const filteredInvoices = invoices.filter(invoice => {
        const invoiceDate = new Date(invoice.createdAt);
        
        switch (selectedPeriod) {
          case 'current-month':
            return invoiceDate.getMonth() === currentMonth && 
                   invoiceDate.getFullYear() === currentYear;
          case 'last-month':
            const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
            return invoiceDate.getMonth() === lastMonth && 
                   invoiceDate.getFullYear() === lastMonthYear;
          case 'current-year':
            return invoiceDate.getFullYear() === currentYear;
          default:
            return true;
        }
      });

      const totalSales = filteredInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
      const totalTax = filteredInvoices.reduce((sum, inv) => sum + (inv.taxAmount || 0), 0);
      const paidInvoices = filteredInvoices.filter(inv => inv.status === 'paid');
      const pendingInvoices = filteredInvoices.filter(inv => inv.status === 'pending');
      const overdueInvoices = filteredInvoices.filter(inv => inv.status === 'overdue');

      setReportData({
        totalSales,
        totalTax,
        totalInvoices: filteredInvoices.length,
        paidAmount: paidInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
        pendingAmount: pendingInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
        overdueAmount: overdueInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
        paidCount: paidInvoices.length,
        pendingCount: pendingInvoices.length,
        overdueCount: overdueInvoices.length,
        topCustomers: customers.slice(0, 5),
        recentInvoices: filteredInvoices.slice(-5).reverse()
      });
    } catch (err) {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleExportGST = () => {
    toast.info('GST export feature coming soon!');
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadReports} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <div className="flex gap-4 items-center">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="form-input"
          >
            <option value="current-month">Current Month</option>
            <option value="last-month">Last Month</option>
            <option value="current-year">Current Year</option>
            <option value="all-time">All Time</option>
          </select>
          <Button onClick={handleExportGST}>
            <ApperIcon name="Download" size={16} />
            Export GST
          </Button>
        </div>
      </div>

      {/* Sales Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value={`₹${reportData.totalSales.toFixed(2)}`}
          icon="TrendingUp"
          gradient={true}
        />
        <StatCard
          title="Total Tax Collected"
          value={`₹${reportData.totalTax.toFixed(2)}`}
          icon="Receipt"
        />
        <StatCard
          title="Total Invoices"
          value={reportData.totalInvoices}
          icon="FileText"
        />
        <StatCard
          title="Paid Amount"
          value={`₹${reportData.paidAmount.toFixed(2)}`}
          icon="CheckCircle"
        />
      </div>

      {/* Invoice Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Paid Invoices"
          value={`${reportData.paidCount} invoices`}
          icon="CheckCircle"
        />
        <StatCard
          title="Pending Invoices"
          value={`${reportData.pendingCount} invoices`}
          icon="Clock"
        />
        <StatCard
          title="Overdue Invoices"
          value={`${reportData.overdueCount} invoices`}
          icon="AlertTriangle"
        />
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            GST Summary
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Taxable Amount:</span>
              <span className="font-semibold">₹{(reportData.totalSales - reportData.totalTax).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total Tax (GST):</span>
              <span className="font-semibold">₹{reportData.totalTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg">
              <span className="text-gray-900 font-medium">Total Sales:</span>
              <span className="font-bold text-lg gradient-text">₹{reportData.totalSales.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Payment Status
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <span className="text-gray-600">Collected:</span>
              <span className="font-semibold text-green-600">₹{reportData.paidAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
              <span className="text-gray-600">Pending:</span>
              <span className="font-semibold text-yellow-600">₹{reportData.pendingAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
              <span className="text-gray-600">Overdue:</span>
              <span className="font-semibold text-red-600">₹{reportData.overdueAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Export Options
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={() => toast.info('GSTR-1 export coming soon!')}
            className="flex items-center gap-2"
          >
            <ApperIcon name="FileText" size={16} />
            Export GSTR-1
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.info('GSTR-3B export coming soon!')}
            className="flex items-center gap-2"
          >
            <ApperIcon name="FileText" size={16} />
            Export GSTR-3B
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.info('Sales report export coming soon!')}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Download" size={16} />
            Export Sales Report
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Reports;