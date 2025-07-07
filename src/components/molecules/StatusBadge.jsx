import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const StatusBadge = ({ status, showIcon = true }) => {
  const statusConfig = {
    paid: { 
      variant: 'paid', 
      icon: 'CheckCircle', 
      label: 'Paid' 
    },
    pending: { 
      variant: 'pending', 
      icon: 'Clock', 
      label: 'Pending' 
    },
    overdue: { 
      variant: 'overdue', 
      icon: 'AlertCircle', 
      label: 'Overdue' 
    },
    draft: { 
      variant: 'draft', 
      icon: 'FileText', 
      label: 'Draft' 
    },
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <Badge variant={config.variant}>
      {showIcon && (
        <ApperIcon name={config.icon} size={12} className="mr-1" />
      )}
      {config.label}
    </Badge>
  );
};

export default StatusBadge;