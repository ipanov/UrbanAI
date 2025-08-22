import React from 'react';
import './Input.css';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  variant?: 'default' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  variant = 'default',
  size = 'md',
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const inputClasses = [
    'input',
    `input--${variant}`,
    `input--${size}`,
    leftIcon && 'input--with-left-icon',
    rightIcon && 'input--with-right-icon',
    error && 'input--error',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="input-container">
      {label && (
        <label className="input-label" htmlFor={props.id}>
          {label}
        </label>
      )}
      <div className="input-wrapper">
        {leftIcon && <div className="input-icon input-icon--left">{leftIcon}</div>}
        <input
          className={inputClasses}
          {...props}
        />
        {rightIcon && <div className="input-icon input-icon--right">{rightIcon}</div>}
      </div>
      {error && <div className="input-error">{error}</div>}
    </div>
  );
};

export default Input;