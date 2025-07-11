import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import Dashboard from '@/components/pages/Dashboard';
import Invoices from '@/components/pages/Invoices';
import Customers from '@/components/pages/Customers';
import Items from '@/components/pages/Items';
import PurchaseOrders from '@/components/pages/PurchaseOrders';
import Payments from '@/components/pages/Payments';
import Expenses from '@/components/pages/Expenses';
import Reports from '@/components/pages/Reports';
import Settings from '@/components/pages/Settings';
function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>
<Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/items" element={<Items />} />
          <Route path="/purchase-orders" element={<PurchaseOrders />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default App;