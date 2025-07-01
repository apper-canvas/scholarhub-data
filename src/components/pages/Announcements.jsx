import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AnnouncementCard from '@/components/molecules/AnnouncementCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Input from '@/components/atoms/Input'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import announcementService from '@/services/api/announcementService'
import { toast } from 'react-toastify'

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([])
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  const loadAnnouncements = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await announcementService.getAll()
      setAnnouncements(data)
      setFilteredAnnouncements(data)
    } catch (err) {
      setError(err.message || 'Failed to load announcements')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnnouncements()
  }, [])

  useEffect(() => {
    let filtered = announcements

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(announcement =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply priority filter
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'unread') {
        filtered = filtered.filter(announcement => !announcement.read)
      } else {
        filtered = filtered.filter(announcement => announcement.priority === selectedFilter)
      }
    }

    setFilteredAnnouncements(filtered)
  }, [announcements, searchTerm, selectedFilter])

  const handleMarkAsRead = async (announcementId) => {
    try {
      const updatedAnnouncements = announcements.map(announcement =>
        announcement.Id === announcementId
          ? { ...announcement, read: true }
          : announcement
      )
      
      setAnnouncements(updatedAnnouncements)
      toast.success('Marked as read')
    } catch (err) {
      toast.error('Failed to mark as read')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const updatedAnnouncements = announcements.map(announcement => ({
        ...announcement,
        read: true
      }))
      
      setAnnouncements(updatedAnnouncements)
      toast.success('All announcements marked as read')
    } catch (err) {
      toast.error('Failed to mark all as read')
    }
  }

  if (loading) {
    return <Loading type="dashboard" />
  }

  if (error) {
    return <Error message={error} onRetry={loadAnnouncements} />
  }

  const unreadCount = announcements.filter(a => !a.read).length
  const highPriorityCount = announcements.filter(a => a.priority === 'high').length
  const mediumPriorityCount = announcements.filter(a => a.priority === 'medium').length
  const lowPriorityCount = announcements.filter(a => a.priority === 'low').length

  const filters = [
    { key: 'all', label: 'All', count: announcements.length },
    { key: 'unread', label: 'Unread', count: unreadCount },
    { key: 'high', label: 'High Priority', count: highPriorityCount },
    { key: 'medium', label: 'Medium Priority', count: mediumPriorityCount },
    { key: 'low', label: 'Low Priority', count: lowPriorityCount }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
          <p className="text-gray-600">Stay updated with important notices and updates</p>
        </div>
        
        {unreadCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="CheckCheck" size={16} />
            <span>Mark All Read</span>
          </motion.button>
        )}
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <ApperIcon name="Bell" size={24} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {announcements.length}
          </h3>
          <p className="text-gray-600">Total</p>
        </div>
        
        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <ApperIcon name="Eye" size={24} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {unreadCount}
          </h3>
          <p className="text-gray-600">Unread</p>
        </div>
        
        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <ApperIcon name="AlertTriangle" size={24} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {highPriorityCount}
          </h3>
          <p className="text-gray-600">High Priority</p>
        </div>
        
        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <ApperIcon name="Clock" size={24} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {mediumPriorityCount}
          </h3>
          <p className="text-gray-600">Medium Priority</p>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              placeholder="Search announcements..."
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

      {/* Announcements List */}
      {filteredAnnouncements.length === 0 ? (
        <Empty
          icon="Bell"
          title={searchTerm ? "No announcements found" : "No announcements"}
          description={searchTerm ? "Try adjusting your search terms or filters." : "No announcements available at the moment."}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {filteredAnnouncements.map((announcement, index) => (
            <AnnouncementCard
              key={announcement.Id}
              title={announcement.title}
              content={announcement.content}
              priority={announcement.priority}
              date={announcement.date}
              isRead={announcement.read}
              onMarkAsRead={() => handleMarkAsRead(announcement.Id)}
              delay={index * 0.05}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default Announcements