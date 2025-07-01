import React from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'

const AnnouncementCard = ({ 
  title, 
  content, 
  priority, 
  date, 
  isRead = false,
  onMarkAsRead,
  delay = 0 
}) => {
  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'high':
        return 'error'
      case 'medium':
        return 'warning'
      default:
        return 'info'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return 'AlertTriangle'
      case 'medium':
        return 'AlertCircle'
      default:
        return 'Info'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.01 }}
      className={`card p-6 ${!isRead ? 'border-l-4 border-primary-500 bg-gradient-to-r from-blue-50 to-white' : ''} hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            priority === 'high' ? 'bg-red-100 text-red-600' :
            priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
            'bg-blue-100 text-blue-600'
          }`}>
            <ApperIcon name={getPriorityIcon(priority)} size={16} />
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold ${!isRead ? 'text-gray-900' : 'text-gray-700'}`}>
              {title}
            </h3>
            <p className="text-sm text-gray-500">
              {format(new Date(date), 'MMM dd, yyyy • HH:mm')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant={getPriorityVariant(priority)} size="small">
            {priority}
          </Badge>
          {!isRead && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onMarkAsRead}
              className="text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ApperIcon name="Check" size={16} />
            </motion.button>
          )}
        </div>
      </div>
      
      <p className={`text-sm leading-relaxed ${!isRead ? 'text-gray-700' : 'text-gray-600'}`}>
        {content}
      </p>
      
      {!isRead && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="inline-flex items-center text-xs text-primary-600 font-medium">
            <ApperIcon name="Circle" size={8} className="mr-2 fill-current" />
            New
          </span>
        </div>
      )}
    </motion.div>
  )
}

export default AnnouncementCard