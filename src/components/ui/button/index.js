import React from 'react';
import './style.css';

export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const classNames = `btn btn-${variant} btn-${size} ${className}`.trim();

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

