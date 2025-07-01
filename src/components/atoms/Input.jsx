import React, { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = forwardRef(({ 
  label, 
  type = 'text', 
  placeholder,
  error,
  icon,
  iconPosition = 'left',
  disabled = false,
  className = '',
  ...props 
}, ref) => {
  const hasIcon = !!icon
  const hasError = !!error

  return (
    <div className="w-full">
      {label && (
        <label className="form-label">
          {label}
        </label>
      )}
      
      <div className="relative">
        {hasIcon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon 
              name={icon} 
              size={16} 
              className={`${hasError ? 'text-red-400' : 'text-gray-400'}`}
            />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            form-input 
            ${hasIcon && iconPosition === 'left' ? 'pl-10' : ''}
            ${hasIcon && iconPosition === 'right' ? 'pr-10' : ''}
            ${hasError ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''}
            ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
            ${className}
          `}
          {...props}
        />
        
        {hasIcon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ApperIcon 
              name={icon} 
              size={16} 
              className={`${hasError ? 'text-red-400' : 'text-gray-400'}`}
            />
          </div>
        )}
      </div>
      
      {hasError && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input