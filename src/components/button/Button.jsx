import React from 'react';
import './button.css';

const Button = ({type, onClick, disabled, loading}) => {
  return (
    <button
      id="button" className={!!loading ? 'toolbar-form-loading' : ''}
      type={type} disabled={disabled || loading} onClick={onClick}
    >
      {!loading && 'Поиск'}
    </button>
  );
};

export default Button;