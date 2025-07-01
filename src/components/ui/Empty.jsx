import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  icon = "BookOpen", 
  title = "No data available", 
  description = "There's nothing to show here yet.",
  actionText = "Get Started",
  onAction
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card p-12 text-center bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200"
    >
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          transition: { 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className="w-20 h-20 mx-auto mb-6 text-gray-400"
      >
        <ApperIcon name={icon} size={80} />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-gray-800 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        {description}
      </p>
      
      {onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="Plus" size={16} />
          <span>{actionText}</span>
        </motion.button>
      )}
    </motion.div>
  )
}

export default Empty