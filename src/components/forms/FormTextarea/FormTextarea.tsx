/**
 * Form Textarea Component
 * 
 * Multi-line text input for forms.
 * To be implemented in Phase 2.
 */

import React from 'react';

interface FormTextareaProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
}

export const FormTextarea: React.FC<FormTextareaProps> = (props) => {
  // TODO: Implement textarea with proper styling
  return (
    <div className="form-textarea">
      <label>{props.label}</label>
      <textarea
        name={props.name}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        required={props.required}
        disabled={props.disabled}
        rows={props.rows || 4}
      />
      {props.error && <span className="error">{props.error}</span>}
    </div>
  );
};

export default FormTextarea;
