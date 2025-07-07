import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  className,
  icon = "FileText",
  title = "No data found",
  description = "Get started by creating your first item.",
  actionLabel = "Create New",
  onAction
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center",
      className
    )}>
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-full p-6 mb-6">
        <ApperIcon name={icon} size={48} className="text-primary-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-8 max-w-md">
        {description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="btn-primary flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={16} />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default Empty;