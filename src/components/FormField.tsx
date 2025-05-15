// src/components/FormField.tsx
import React from "react";

interface FormFieldProps {
  label: string;
  error?: string | null;
  required?: boolean;
  isValidating?: boolean;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required,
  isValidating,
  children,
}) => {
  return (
    <div className="form-field">
      <label className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      {children}
      {isValidating && <div className="validating">Validating...</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default FormField;
