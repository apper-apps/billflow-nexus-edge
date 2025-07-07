import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  
const menuItems = [
    { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/invoices', label: 'Invoices', icon: 'FileText' },
    { path: '/customers', label: 'Customers', icon: 'Users' },
    { path: '/items', label: 'Items', icon: 'Package' },
    { path: '/purchase-orders', label: 'Purchase Orders', icon: 'ShoppingCart' },
    { path: '/payments', label: 'Payments', icon: 'CreditCard' },
    { path: '/expenses', label: 'Expenses', icon: 'Receipt' },
    { path: '/reports', label: 'Reports', icon: 'BarChart3' },
    { path: '/settings', label: 'Settings', icon: 'Settings' },
  ];

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:block w-64 bg-white border-r border-gray-200 h-screen">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-2 rounded-lg">
            <ApperIcon name="Receipt" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">BillFlow Pro</h1>
            <p className="text-sm text-gray-600">GST Billing Suite</p>
          </div>
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                )
              }
            >
              <ApperIcon name={item.icon} size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Mobile Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="lg:hidden fixed left-0 top-0 w-64 bg-white h-screen z-50 border-r border-gray-200"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-2 rounded-lg">
                <ApperIcon name="Receipt" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">BillFlow Pro</h1>
                <p className="text-sm text-gray-600">GST Billing Suite</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  )
                }
              >
                <ApperIcon name={item.icon} size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;