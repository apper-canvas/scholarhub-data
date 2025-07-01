import React from 'react'
import { motion } from 'framer-motion'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'medium',
  className = '' 
}) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800",
    success: "bg-gradient-to-r from-green-100 to-green-200 text-green-800",
    warning: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800",
    error: "bg-gradient-to-r from-red-100 to-red-200 text-red-800",
    info: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800",
    accent: "bg-gradient-to-r from-accent-100 to-accent-200 text-accent-800"
  }
  
  const sizes = {
    small: "px-2 py-1 text-xs",
    medium: "px-3 py-1 text-sm",
    large: "px-4 py-2 text-base"
  }

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </motion.span>
  )
}

export default Badge