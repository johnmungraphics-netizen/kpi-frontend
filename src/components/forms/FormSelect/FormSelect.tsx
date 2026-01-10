/**
 * Form Select Component
 * 
 * Dropdown select component for forms.
 * To be implemented in Phase 2.
 */

import React from 'react';

interface FormSelectProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export const FormSelect: React.FC<FormSelectProps> = (props) => {
  // TODO: Implement select with proper styling
  return (
    <div className="form-select">
      <label>{props.label}</label>
      <select
        name={props.name}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        required={props.required}
        disabled={props.disabled}
      >
        {props.placeholder && <option value="">{props.placeholder}</option>}
        {props.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {props.error && <span className="error">{props.error}</span>}
    </div>
  );
};

export default FormSelect;
