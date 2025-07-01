import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue,
  color = 'primary',
  delay = 0 
}) => {
  const colors = {
    primary: 'from-primary-500 to-primary-600',
    success: 'from-green-500 to-green-600',
    warning: 'from-yellow-500 to-yellow-600',
    accent: 'from-accent-500 to-accent-600',
    info: 'from-blue-500 to-blue-600'
  }

  const iconColors = {
    primary: 'text-primary-600 bg-primary-100',
    success: 'text-green-600 bg-green-100',
    warning: 'text-yellow-600 bg-yellow-100',
    accent: 'text-accent-600 bg-accent-100',
    info: 'text-blue-600 bg-blue-100'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      className="card-gradient p-6 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${iconColors[color]} flex items-center justify-center`}>
          <ApperIcon name={icon} size={24} />
        </div>
        
        {trend && (
          <div className={`flex items-center space-x-1 text-sm font-medium ${
            trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
          }`}>
            <ApperIcon 
              name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
              size={14} 
            />
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-gray-900 to-gray-700">
          {value}
        </p>
        <p className="text-sm text-gray-600 font-medium">
          {title}
        </p>
      </div>
    </motion.div>
  )
}

export default StatCard