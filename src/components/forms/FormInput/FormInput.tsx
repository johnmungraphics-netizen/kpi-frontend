/**
 * Form Input Component
 * 
 * Form-specific input component with enhanced validation and styling.
 * To be implemented in Phase 2.
 */

import React from 'react';

interface FormInputProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export const FormInput: React.FC<FormInputProps> = (props) => {
  // TODO: Implement form input with enhanced styling
  return (
    <div className="form-input">
      <label>{props.label}</label>
      <input
        name={props.name}
        type={props.type || 'text'}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        required={props.required}
        disabled={props.disabled}
      />
      {props.error && <span className="error">{props.error}</span>}
    </div>
  );
};

export default FormInput;
