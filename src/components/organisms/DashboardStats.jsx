import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatCard from '@/components/molecules/StatCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { invoiceService } from '@/services/api/invoiceService';
import { customerService } from '@/services/api/customerService';
import { itemService } from '@/services/api/itemService';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingAmount: 0,
    totalInvoices: 0,
    totalCustomers: 0,
    totalItems: 0,
    overdueInvoices: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [invoices, customers, items] = await Promise.all([
        invoiceService.getAll(),
        customerService.getAll(),
        itemService.getAll()
      ]);

      const totalRevenue = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + (inv.total || 0), 0);

      const pendingAmount = invoices
        .filter(inv => inv.status === 'pending')
        .reduce((sum, inv) => sum + (inv.total || 0), 0);

      const overdueInvoices = invoices.filter(inv => {
        if (inv.status === 'pending' && inv.dueDate) {
          const dueDate = new Date(inv.dueDate);
          const today = new Date();
          return dueDate < today;
        }
        return false;
      }).length;

      setStats({
        totalRevenue,
        pendingAmount,
        totalInvoices: invoices.length,
        totalCustomers: customers.length,
        totalItems: items.length,
        overdueInvoices,
      });
    } catch (err) {
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadStats} />;

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toFixed(2)}`,
      icon: 'DollarSign',
      gradient: true,
      trend: 'up',
      trendValue: '+12%'
    },
    {
      title: 'Pending Amount',
      value: `₹${stats.pendingAmount.toFixed(2)}`,
      icon: 'Clock',
      trend: stats.pendingAmount > 0 ? 'up' : 'down',
      trendValue: stats.pendingAmount > 0 ? '+5%' : '0%'
    },
    {
      title: 'Total Invoices',
      value: stats.totalInvoices.toString(),
      icon: 'FileText',
      trend: 'up',
      trendValue: '+3'
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers.toString(),
      icon: 'Users',
      trend: 'up',
      trendValue: '+2'
    },
    {
      title: 'Total Items',
      value: stats.totalItems.toString(),
      icon: 'Package',
      trend: 'up',
      trendValue: '+1'
    },
    {
      title: 'Overdue Invoices',
      value: stats.overdueInvoices.toString(),
      icon: 'AlertTriangle',
      trend: stats.overdueInvoices > 0 ? 'up' : 'down',
      trendValue: stats.overdueInvoices > 0 ? '+1' : '0'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard {...card} />
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;