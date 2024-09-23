import React from 'react';
import './button.css';

const Button = ({ type, onClick, disabled, loading, style, label }) => {
  return (
    <button
      id="button"
      className={!!loading ? 'toolbar-form-loading' : ''}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={style}
    >
      {!loading && label}
    </button>
  );
};

export default Button;
