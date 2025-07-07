import { cn } from '@/utils/cn';

const Loading = ({ className, type = 'default' }) => {
  if (type === 'table') {
    return (
      <div className={cn("animate-pulse space-y-4", className)}>
        <div className="bg-gray-100 h-12 rounded-lg"></div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-gray-50 h-16 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (type === 'cards') {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-lg p-6 shadow-md">
            <div className="bg-gray-200 h-4 rounded w-1/2 mb-4"></div>
            <div className="bg-gray-100 h-8 rounded mb-2"></div>
            <div className="bg-gray-100 h-4 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'form') {
    return (
      <div className={cn("animate-pulse space-y-6", className)}>
        <div className="bg-gray-100 h-10 rounded-lg"></div>
        <div className="bg-gray-100 h-10 rounded-lg"></div>
        <div className="bg-gray-100 h-24 rounded-lg"></div>
        <div className="bg-gray-100 h-10 rounded-lg w-32"></div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>
  );
};

export default Loading;