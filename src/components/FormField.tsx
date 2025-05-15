// src/components/FormField.tsx
import React, { isValidElement, cloneElement } from "react";

interface FormFieldProps {
  label: string;
  error?: string | null;
  required?: boolean;
  isValidating?: boolean;
  children: React.ReactNode;
  id?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required,
  isValidating,
  children,
  id,
}) => {
  const labelId = id || label.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className="form-field">
      <label htmlFor={labelId} className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      {isValidElement(children)
        ? cloneElement(children as React.ReactElement, { id: labelId })
        : (() => { throw new Error('FormField expects a single React element as its child.'); })()}
      {isValidating && <div className="validating">Validating...</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default FormField;
