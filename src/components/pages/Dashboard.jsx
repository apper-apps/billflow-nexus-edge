import { motion } from 'framer-motion';
import DashboardStats from '@/components/organisms/DashboardStats';
import ApperIcon from '@/components/ApperIcon';

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome to BillFlow Pro - Your GST billing solution
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <ApperIcon name="Calendar" size={16} />
              <span className="text-sm font-medium">
                {new Date().toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Activities
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="bg-green-100 p-2 rounded-full">
                <ApperIcon name="CheckCircle" size={16} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Invoice INV-20241201-001 paid
                </p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-full">
                <ApperIcon name="FileText" size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  New invoice created for Tech Solutions
                </p>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="bg-yellow-100 p-2 rounded-full">
                <ApperIcon name="AlertCircle" size={16} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Payment reminder sent
                </p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg hover:from-primary-100 hover:to-accent-100 transition-all duration-200 group">
              <div className="flex flex-col items-center">
                <div className="bg-primary-500 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                  <ApperIcon name="Plus" size={20} className="text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  New Invoice
                </span>
              </div>
            </button>
            <button className="p-4 bg-gradient-to-br from-secondary-50 to-primary-50 rounded-lg hover:from-secondary-100 hover:to-primary-100 transition-all duration-200 group">
              <div className="flex flex-col items-center">
                <div className="bg-secondary-500 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                  <ApperIcon name="Users" size={20} className="text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  Add Customer
                </span>
              </div>
            </button>
            <button className="p-4 bg-gradient-to-br from-accent-50 to-secondary-50 rounded-lg hover:from-accent-100 hover:to-secondary-100 transition-all duration-200 group">
              <div className="flex flex-col items-center">
                <div className="bg-accent-500 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                  <ApperIcon name="Package" size={20} className="text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  Add Item
                </span>
              </div>
            </button>
            <button className="p-4 bg-gradient-to-br from-green-50 to-accent-50 rounded-lg hover:from-green-100 hover:to-accent-100 transition-all duration-200 group">
              <div className="flex flex-col items-center">
                <div className="bg-green-500 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                  <ApperIcon name="BarChart3" size={20} className="text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  View Reports
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;