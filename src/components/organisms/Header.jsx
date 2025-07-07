import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Header = ({ onMenuToggle }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          <div className="hidden md:block">
            <h2 className="text-xl font-semibold text-gray-900">
              Welcome back!
            </h2>
            <p className="text-sm text-gray-600">
              Manage your business efficiently with BillFlow Pro
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <ApperIcon name="Bell" size={20} />
            <span className="hidden sm:inline ml-2">Notifications</span>
          </Button>
          <Button variant="ghost" size="sm">
            <ApperIcon name="HelpCircle" size={20} />
            <span className="hidden sm:inline ml-2">Help</span>
          </Button>
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={16} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;