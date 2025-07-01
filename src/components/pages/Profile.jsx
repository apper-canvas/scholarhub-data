import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import studentService from '@/services/api/studentService'
import { toast } from 'react-toastify'

const Profile = () => {
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})

  const loadProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await studentService.getById(1)
      setStudent(data)
      setFormData(data)
    } catch (err) {
      setError(err.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    try {
      await studentService.update(student.Id, formData)
      setStudent(formData)
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error('Failed to update profile')
    }
  }

  const handleCancel = () => {
    setFormData(student)
    setIsEditing(false)
  }

  if (loading) {
    return <Loading type="dashboard" />
  }

  if (error) {
    return <Error message={error} onRetry={loadProfile} />
  }

  if (!student) return null

  const getYearLabel = (year) => {
    switch (year) {
      case 1: return '1st Year'
      case 2: return '2nd Year'
      case 3: return '3rd Year'
      case 4: return '4th Year'
      default: return `${year}th Year`
    }
  }

  const getAcademicStanding = (gpa) => {
    if (gpa >= 3.7) return { label: 'Dean\'s List', variant: 'success' }
    if (gpa >= 3.0) return { label: 'Good Standing', variant: 'primary' }
    if (gpa >= 2.0) return { label: 'Regular Standing', variant: 'warning' }
    return { label: 'Academic Probation', variant: 'error' }
  }

  const academicStanding = getAcademicStanding(student.gpa)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-start"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Profile</h1>
          <p className="text-gray-600">View and manage your academic information</p>
        </div>
        
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              icon="Edit"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6 text-center"
          >
            <div className="w-32 h-32 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-white text-4xl font-bold">
                {student.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {student.name}
            </h2>
            
            <p className="text-gray-600 mb-4">
              {student.major}
            </p>
            
            <div className="space-y-3">
              <Badge variant="primary" size="large">
                {getYearLabel(student.year)}
              </Badge>
              
              <Badge variant={academicStanding.variant} size="large">
                {academicStanding.label}
              </Badge>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {student.gpa.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">GPA</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {student.credits}
                  </p>
                  <p className="text-sm text-gray-600">Credits</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="User" size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Personal Information
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                value={isEditing ? formData.name : student.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
              />
              
              <Input
                label="Email Address"
                type="email"
                value={isEditing ? formData.email : student.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
              />
              
              <Input
                label="Student ID"
                value={student.id}
                disabled={true}
              />
              
              <Input
                label="Phone Number"
                value={isEditing ? formData.phone || '' : student.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                placeholder="(555) 123-4567"
              />
            </div>
          </motion.div>

          {/* Academic Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Academic Information
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Major"
                value={student.major}
                disabled={true}
              />
              
              <Input
                label="Academic Year"
                value={getYearLabel(student.year)}
                disabled={true}
              />
              
              <Input
                label="Cumulative GPA"
                value={student.gpa.toFixed(2)}
                disabled={true}
              />
              
              <Input
                label="Total Credits"
                value={student.credits.toString()}
                disabled={true}
              />
            </div>
          </motion.div>

          {/* Emergency Contact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Phone" size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Emergency Contact
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Contact Name"
                value={isEditing ? formData.emergencyContactName || '' : student.emergencyContactName || ''}
                onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                disabled={!isEditing}
                placeholder="Parent/Guardian Name"
              />
              
              <Input
                label="Contact Phone"
                value={isEditing ? formData.emergencyContactPhone || '' : student.emergencyContactPhone || ''}
                onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                disabled={!isEditing}
                placeholder="(555) 123-4567"
              />
              
              <Input
                label="Relationship"
                value={isEditing ? formData.emergencyContactRelation || '' : student.emergencyContactRelation || ''}
                onChange={(e) => handleInputChange('emergencyContactRelation', e.target.value)}
                disabled={!isEditing}
                placeholder="Parent, Guardian, etc."
              />
              
              <Input
                label="Address"
                value={isEditing ? formData.address || '' : student.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!isEditing}
                placeholder="Home Address"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Profile