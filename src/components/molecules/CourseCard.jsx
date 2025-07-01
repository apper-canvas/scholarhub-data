import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'

const CourseCard = ({ 
  code, 
  name, 
  credits, 
  instructor, 
  schedule, 
  room,
  enrolled,
  capacity,
  delay = 0 
}) => {
  const enrollmentPercentage = (enrolled / capacity) * 100
  const isNearCapacity = enrollmentPercentage > 80

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      className="card p-6 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-bold text-lg text-gray-900">{code}</h3>
            <Badge variant="primary" size="small">{credits} Credits</Badge>
          </div>
          <p className="text-gray-700 font-medium mb-2">{name}</p>
          <p className="text-sm text-gray-600">Prof. {instructor}</p>
        </div>
        
        <div className="text-right">
          <Badge 
            variant={isNearCapacity ? 'warning' : 'success'} 
            size="small"
            className="mb-2"
          >
            {enrolled}/{capacity}
          </Badge>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ApperIcon name="Clock" size={16} />
          <span>{schedule}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ApperIcon name="MapPin" size={16} />
          <span>{room}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Enrollment</span>
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${enrollmentPercentage}%` }}
              transition={{ duration: 1, delay: delay + 0.2 }}
              className={`h-2 rounded-full ${
                isNearCapacity ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 'bg-gradient-to-r from-green-400 to-green-500'
              }`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CourseCard