import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-12 text-center bg-gradient-to-br from-red-50 to-red-100 border-red-200"
    >
      <motion.div
        animate={{ 
          rotate: [0, -10, 10, -10, 0],
          transition: { duration: 0.5, delay: 0.2 }
        }}
        className="w-16 h-16 mx-auto mb-4 text-red-500"
      >
        <ApperIcon name="AlertTriangle" size={64} />
      </motion.div>
      
      <h3 className="text-lg font-semibold text-red-800 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-red-600 mb-6 max-w-md mx-auto">
        {message}
      </p>
      
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="RefreshCw" size={16} />
          <span>Try Again</span>
        </motion.button>
      )}
    </motion.div>
  )
}

export default Error