import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CourseCard from '@/components/molecules/CourseCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import courseService from '@/services/api/courseService'
import { toast } from 'react-toastify'

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  const loadCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await courseService.getEnrolledCourses()
      setCourses(data)
      setFilteredCourses(data)
    } catch (err) {
      setError(err.message || 'Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  useEffect(() => {
    let filtered = courses

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply category filter
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'high-enrollment') {
        filtered = filtered.filter(course => (course.enrolled / course.capacity) > 0.8)
      } else if (selectedFilter === 'morning') {
        filtered = filtered.filter(course => course.schedule.includes('AM'))
      } else if (selectedFilter === 'afternoon') {
        filtered = filtered.filter(course => course.schedule.includes('PM'))
      }
    }

    setFilteredCourses(filtered)
  }, [courses, searchTerm, selectedFilter])

  const handleDropCourse = (courseId) => {
    toast.success('Course dropped successfully')
  }

  if (loading) {
    return <Loading type="table" />
  }

  if (error) {
    return <Error message={error} onRetry={loadCourses} />
  }

  const filters = [
    { key: 'all', label: 'All Courses', count: courses.length },
    { key: 'high-enrollment', label: 'High Enrollment', count: courses.filter(c => (c.enrolled / c.capacity) > 0.8).length },
    { key: 'morning', label: 'Morning Classes', count: courses.filter(c => c.schedule.includes('AM')).length },
    { key: 'afternoon', label: 'Afternoon Classes', count: courses.filter(c => c.schedule.includes('PM')).length }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
          <p className="text-gray-600">Manage your enrolled courses and view schedules</p>
        </div>
        
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => toast.info('Course registration opens soon!')}
        >
          Add Course
        </Button>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              placeholder="Search courses by name, code, or instructor..."
              icon="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map(filter => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedFilter === filter.key
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
                <Badge variant="default" size="small" className="ml-2">
                  {filter.count}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Course Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <ApperIcon name="BookOpen" size={24} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {courses.length}
          </h3>
          <p className="text-gray-600">Total Courses</p>
        </div>
        
        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <ApperIcon name="Clock" size={24} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {courses.reduce((total, course) => total + course.credits, 0)}
          </h3>
          <p className="text-gray-600">Total Credits</p>
        </div>
        
        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <ApperIcon name="Users" size={24} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {Math.round(courses.reduce((total, course) => total + (course.enrolled / course.capacity), 0) / courses.length * 100)}%
          </h3>
          <p className="text-gray-600">Avg. Enrollment</p>
        </div>
      </motion.div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <Empty
          icon="BookOpen"
          title={searchTerm ? "No courses found" : "No courses enrolled"}
          description={searchTerm ? "Try adjusting your search terms or filters." : "You haven't enrolled in any courses yet."}
          actionText="Browse Available Courses"
          onAction={() => toast.info('Course catalog coming soon!')}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {filteredCourses.map((course, index) => (
            <CourseCard
              key={course.Id}
              code={course.code}
              name={course.name}
              credits={course.credits}
              instructor={course.instructor}
              schedule={course.schedule}
              room={course.room}
              enrolled={course.enrolled}
              capacity={course.capacity}
              delay={index * 0.1}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default Courses