import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import eventService from '@/services/api/eventService'

const Calendar = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('month')

  const loadEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await eventService.getAll()
      setEvents(data)
    } catch (err) {
      setError(err.message || 'Failed to load calendar events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getEventsForDate = (date) => {
    return events.filter(event => 
      isSameDay(new Date(event.date), date)
    )
  }

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'exam':
        return 'error'
      case 'assignment':
        return 'warning'
      case 'lecture':
        return 'primary'
      case 'holiday':
        return 'success'
      default:
        return 'info'
    }
  }

  const getEventIcon = (type) => {
    switch (type) {
      case 'exam':
        return 'FileText'
      case 'assignment':
        return 'Edit'
      case 'lecture':
        return 'BookOpen'
      case 'holiday':
        return 'Calendar'
      default:
        return 'Clock'
    }
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const selectedDateEvents = getEventsForDate(selectedDate)

  if (loading) {
    return <Loading type="dashboard" />
  }

  if (error) {
    return <Error message={error} onRetry={loadEvents} />
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Calendar</h1>
          <p className="text-gray-600">View your schedule, assignments, and important dates</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'month' ? 'primary' : 'outline'}
            size="small"
            onClick={() => setViewMode('month')}
          >
            Month
          </Button>
          <Button
            variant={viewMode === 'week' ? 'primary' : 'outline'}
            size="small"
            onClick={() => setViewMode('week')}
          >
            Week
          </Button>
          <Button
            variant={viewMode === 'day' ? 'primary' : 'outline'}
            size="small"
            onClick={() => setViewMode('day')}
          >
            Day
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3 space-y-4">
          {/* Calendar Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="small"
                  icon="ChevronLeft"
                  onClick={() => navigateMonth(-1)}
                />
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="small"
                  icon="ChevronRight"
                  onClick={() => navigateMonth(1)}
                />
              </div>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, index) => {
                const dayEvents = getEventsForDate(date)
                const isSelected = isSameDay(date, selectedDate)
                const isCurrentMonth = isSameMonth(date, currentDate)
                const isCurrentDay = isToday(date)

                return (
                  <motion.button
                    key={date.toISOString()}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.01 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      relative p-3 h-20 border border-gray-100 hover:bg-gray-50 transition-all
                      ${isSelected ? 'bg-primary-50 border-primary-200' : ''}
                      ${isCurrentDay ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white' : ''}
                      ${!isCurrentMonth ? 'opacity-30' : ''}
                    `}
                  >
                    <div className={`text-sm font-medium ${isCurrentDay ? 'text-white' : 'text-gray-900'}`}>
                      {format(date, 'd')}
                    </div>
                    
                    {dayEvents.length > 0 && (
                      <div className="absolute bottom-1 left-1 right-1">
                        <div className="flex flex-wrap gap-1">
                          {dayEvents.slice(0, 2).map((event, eventIndex) => (
                            <div
                              key={eventIndex}
                              className={`w-2 h-2 rounded-full ${
                                event.type === 'exam' ? 'bg-red-500' :
                                event.type === 'assignment' ? 'bg-yellow-500' :
                                event.type === 'lecture' ? 'bg-blue-500' :
                                'bg-green-500'
                              }`}
                            />
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-600 font-medium">
                              +{dayEvents.length - 2}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Event Details Sidebar */}
        <div className="space-y-4">
          {/* Selected Date */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Calendar" size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {format(selectedDate, 'EEEE')}
                </h3>
                <p className="text-sm text-gray-600">
                  {format(selectedDate, 'MMMM d, yyyy')}
                </p>
              </div>
            </div>

            {selectedDateEvents.length === 0 ? (
              <p className="text-gray-500 text-sm">No events scheduled</p>
            ) : (
              <div className="space-y-3">
                {selectedDateEvents.map((event, index) => (
                  <motion.div
                    key={event.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        event.type === 'exam' ? 'bg-red-100 text-red-600' :
                        event.type === 'assignment' ? 'bg-yellow-100 text-yellow-600' :
                        event.type === 'lecture' ? 'bg-blue-100 text-blue-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        <ApperIcon name={getEventIcon(event.type)} size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {event.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {event.time} • {event.location}
                        </p>
                        <Badge variant={getEventTypeColor(event.type)} size="small" className="mt-2">
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <h3 className="font-semibold text-gray-900 mb-4">Upcoming Events</h3>
            
            {events.slice(0, 5).map((event, index) => (
              <motion.div
                key={event.Id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`w-3 h-3 rounded-full ${
                  event.type === 'exam' ? 'bg-red-500' :
                  event.type === 'assignment' ? 'bg-yellow-500' :
                  event.type === 'lecture' ? 'bg-blue-500' :
                  'bg-green-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {event.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(event.date), 'MMM d')} • {event.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Calendar