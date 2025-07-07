import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  className,
  gradient = false 
}) => {
  return (
    <div className={cn(
      'bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300',
      gradient && 'bg-gradient-to-br from-primary-50 to-accent-50',
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          'p-3 rounded-lg',
          gradient ? 'bg-white/50' : 'bg-primary-100'
        )}>
          <ApperIcon name={icon} size={24} className="text-primary-600" />
        </div>
        {trend && (
          <div className={cn(
            'flex items-center gap-1 text-sm font-medium',
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          )}>
            <ApperIcon 
              name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
              size={16} 
            />
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  );
};

export default StatCard;