import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import StatCard from '@/components/molecules/StatCard'
import CourseCard from '@/components/molecules/CourseCard'
import AnnouncementCard from '@/components/molecules/AnnouncementCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import studentService from '@/services/api/studentService'
import courseService from '@/services/api/courseService'
import announcementService from '@/services/api/announcementService'

const Dashboard = () => {
  const [student, setStudent] = useState(null)
  const [courses, setCourses] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [studentData, coursesData, announcementsData] = await Promise.all([
        studentService.getById(1),
        courseService.getEnrolledCourses(),
        announcementService.getRecent()
      ])
      
      setStudent(studentData)
      setCourses(coursesData)
      setAnnouncements(announcementsData)
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  if (loading) {
    return <Loading type="dashboard" />
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />
  }

  if (!student) {
    return <Empty title="No student data available" description="Unable to load your student information." />
  }

  const upcomingDeadlines = [
    { title: 'CS 401 Project Proposal', date: '2024-02-15', type: 'assignment' },
    { title: 'MATH 301 Midterm Exam', date: '2024-02-18', type: 'exam' },
    { title: 'ENG 201 Essay Submission', date: '2024-02-20', type: 'assignment' }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {student.name}!
            </h1>
            <p className="text-primary-100 text-lg">
              {student.major} • {student.year === 1 ? '1st' : student.year === 2 ? '2nd' : student.year === 3 ? '3rd' : '4th'} Year
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <ApperIcon name="GraduationCap" size={48} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Current GPA"
          value={student.gpa.toFixed(2)}
          icon="Award"
          trend="up"
          trendValue="+0.12"
          color="success"
          delay={0.1}
        />
        <StatCard
          title="Total Credits"
          value={student.credits}
          icon="BookOpen"
          trend="up"
          trendValue="+15"
          color="primary"
          delay={0.2}
        />
        <StatCard
          title="Active Courses"
          value={courses.length}
          icon="Calendar"
          color="info"
          delay={0.3}
        />
        <StatCard
          title="Semester Rank"
          value="#12"
          icon="Trophy"
          trend="up"
          trendValue="+3"
          color="accent"
          delay={0.4}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Courses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Current Courses</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              View All
            </motion.button>
          </div>
          
          {courses.length === 0 ? (
            <Empty 
              icon="BookOpen"
              title="No courses enrolled"
              description="You haven't enrolled in any courses yet."
              actionText="Browse Courses"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.slice(0, 4).map((course, index) => (
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
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
              <ApperIcon name="Clock" size={20} className="text-gray-400" />
            </div>
            
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    deadline.type === 'exam' ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {deadline.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(deadline.date).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Announcements */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Announcements</h3>
              <ApperIcon name="Bell" size={20} className="text-gray-400" />
            </div>
            
            {announcements.length === 0 ? (
              <Empty 
                icon="Bell"
                title="No announcements"
                description="No recent announcements to display."
              />
            ) : (
              <div className="space-y-4">
                {announcements.slice(0, 3).map((announcement, index) => (
                  <AnnouncementCard
                    key={announcement.Id}
                    title={announcement.title}
                    content={announcement.content}
                    priority={announcement.priority}
                    date={announcement.date}
                    isRead={announcement.read}
                    delay={0.8 + index * 0.1}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard