import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GradeCard from '@/components/molecules/GradeCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import gradeService from '@/services/api/gradeService'

const Grades = () => {
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSemester, setSelectedSemester] = useState('all')

  const loadGrades = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await gradeService.getAll()
      setGrades(data)
    } catch (err) {
      setError(err.message || 'Failed to load grades')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGrades()
  }, [])

  const calculateGPA = (gradesList) => {
    if (gradesList.length === 0) return 0
    
    const totalPoints = gradesList.reduce((sum, grade) => sum + (grade.points * grade.credits), 0)
    const totalCredits = gradesList.reduce((sum, grade) => sum + grade.credits, 0)
    
    return totalCredits > 0 ? totalPoints / totalCredits : 0
  }

  const getGradeDistribution = (gradesList) => {
    const distribution = { 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 }
    
    gradesList.forEach(grade => {
      const letter = grade.grade.charAt(0)
      if (distribution.hasOwnProperty(letter)) {
        distribution[letter]++
      }
    })
    
    return distribution
  }

  const filteredGrades = selectedSemester === 'all' 
    ? grades 
    : grades.filter(grade => grade.semester === selectedSemester)

  const semesters = [...new Set(grades.map(grade => grade.semester))].sort().reverse()
  const overallGPA = calculateGPA(grades)
  const semesterGPA = calculateGPA(filteredGrades)
  const distribution = getGradeDistribution(filteredGrades)

  if (loading) {
    return <Loading type="table" />
  }

  if (error) {
    return <Error message={error} onRetry={loadGrades} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Grades</h1>
          <p className="text-gray-600">Track your academic performance and GPA</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="form-input"
          >
            <option value="all">All Semesters</option>
            {semesters.map(semester => (
              <option key={semester} value={semester}>{semester}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* GPA Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="card p-6 text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <ApperIcon name="Award" size={32} className="text-white" />
          </div>
          <h3 className="text-3xl font-bold text-green-800 mb-1">
            {overallGPA.toFixed(2)}
          </h3>
          <p className="text-green-600 font-medium">Overall GPA</p>
        </div>
        
        <div className="card p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <ApperIcon name="TrendingUp" size={32} className="text-white" />
          </div>
          <h3 className="text-3xl font-bold text-blue-800 mb-1">
            {semesterGPA.toFixed(2)}
          </h3>
          <p className="text-blue-600 font-medium">
            {selectedSemester === 'all' ? 'Overall' : 'Semester'} GPA
          </p>
        </div>
        
        <div className="card p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <ApperIcon name="BookOpen" size={32} className="text-white" />
          </div>
          <h3 className="text-3xl font-bold text-purple-800 mb-1">
            {filteredGrades.reduce((sum, grade) => sum + grade.credits, 0)}
          </h3>
          <p className="text-purple-600 font-medium">Total Credits</p>
        </div>
      </motion.div>

      {/* Grade Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
        
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(distribution).map(([grade, count]) => {
            const colors = {
              'A': 'from-green-500 to-green-600',
              'B': 'from-blue-500 to-blue-600',
              'C': 'from-yellow-500 to-yellow-600',
              'D': 'from-orange-500 to-orange-600',
              'F': 'from-red-500 to-red-600'
            }
            
            return (
              <div key={grade} className="text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${colors[grade]} rounded-lg mx-auto mb-2 flex items-center justify-center`}>
                  <span className="text-white font-bold text-xl">{grade}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-600">Courses</p>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Grades List */}
      {filteredGrades.length === 0 ? (
        <Empty
          icon="Award"
          title="No grades available"
          description="No grades found for the selected semester."
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {semesters.map(semester => {
            const semesterGrades = selectedSemester === 'all' 
              ? grades.filter(grade => grade.semester === semester)
              : filteredGrades.filter(grade => grade.semester === semester)
            
            if (semesterGrades.length === 0) return null
            
            const semGPA = calculateGPA(semesterGrades)
            
            return (
              <div key={semester} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">{semester}</h3>
                  <Badge variant="primary" size="medium">
                    GPA: {semGPA.toFixed(2)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {semesterGrades.map((grade, index) => (
                    <GradeCard
                      key={grade.Id}
                      courseCode={grade.courseCode}
                      courseName={grade.courseName}
                      grade={grade.grade}
                      credits={grade.credits}
                      points={grade.points}
                      semester={grade.semester}
                      delay={index * 0.05}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}

export default Grades