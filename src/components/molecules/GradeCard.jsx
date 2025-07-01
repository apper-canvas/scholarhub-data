import React from 'react'
import { motion } from 'framer-motion'
import Badge from '@/components/atoms/Badge'

const GradeCard = ({ 
  courseCode, 
  courseName, 
  grade, 
  credits, 
  points,
  semester,
  delay = 0 
}) => {
  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+':
      case 'A':
      case 'A-':
        return 'success'
      case 'B+':
      case 'B':
      case 'B-':
        return 'info'
      case 'C+':
      case 'C':
      case 'C-':
        return 'warning'
      case 'D+':
      case 'D':
        return 'accent'
      default:
        return 'error'
    }
  }

  const getGradeClass = (grade) => {
    switch (grade) {
      case 'A+':
      case 'A':
      case 'A-':
        return 'grade-a'
      case 'B+':
      case 'B':
      case 'B-':
        return 'grade-b'
      case 'C+':
      case 'C':
      case 'C-':
        return 'grade-c'
      case 'D+':
      case 'D':
        return 'grade-d'
      default:
        return 'grade-f'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.01 }}
      className={`card p-4 ${getGradeClass(grade)} hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-gray-900">{courseCode}</h3>
            <Badge variant="default" size="small">{credits} Credits</Badge>
          </div>
          <p className="text-sm text-gray-600 font-medium">{courseName}</p>
          <p className="text-xs text-gray-500 mt-1">{semester}</p>
        </div>
        
        <div className="text-right">
          <Badge variant={getGradeColor(grade)} size="large" className="font-bold">
            {grade}
          </Badge>
          <p className="text-sm text-gray-600 mt-1 font-medium">
            {points} Points
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default GradeCard