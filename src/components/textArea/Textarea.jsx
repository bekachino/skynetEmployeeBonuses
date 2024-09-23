import React from 'react';
import './textarea.css';

const Textarea = ({
  name,
  value,
  onChange,
  label,
  style,
  helperText,
  helperTextType,
  required,
}) => {
  return (
    <div className="input" style={style}>
      <textarea
        value={value}
        name={name}
        onChange={onChange}
        placeholder={label}
        required={required}
      />
      {
        <span className={`input-helper-text ${helperTextType}`}>
          {helperText}
        </span>
      }
    </div>
  );
};

export default Textarea;
