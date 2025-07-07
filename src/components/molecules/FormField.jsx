import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import { cn } from '@/utils/cn';

const FormField = ({ 
  label, 
  type = 'text', 
  required = false, 
  error, 
  className,
  children,
  ...props 
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label required={required}>
          {label}
        </Label>
      )}
      {type === 'select' ? (
        <Select error={error} {...props}>
          {children}
        </Select>
      ) : (
        <Input type={type} error={error} {...props} />
      )}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;