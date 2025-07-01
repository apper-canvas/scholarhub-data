import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
    { name: 'Courses', href: '/courses', icon: 'BookOpen' },
    { name: 'Grades', href: '/grades', icon: 'Award' },
    { name: 'Calendar', href: '/calendar', icon: 'Calendar' },
    { name: 'Announcements', href: '/announcements', icon: 'Bell' },
    { name: 'Profile', href: '/profile', icon: 'User' }
  ]

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0 lg:z-0"
      >
        <div className="flex flex-col w-70 bg-white border-r border-gray-200 h-full shadow-lg lg:shadow-none">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                ScholarHub
              </h1>
            </div>
            
            <button
              onClick={onClose}
              className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                >
                  <ApperIcon 
                    name={item.icon} 
                    size={18} 
                    className={`${isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary-600'}`}
                  />
                  <span className="ml-3 font-medium">{item.name}</span>
                </NavLink>
              )
            })}
          </nav>
          
          {/* User info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">JS</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  John Smith
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Computer Science
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default Sidebar