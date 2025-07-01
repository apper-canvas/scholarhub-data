import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from '@/components/organisms/Sidebar'
import Header from '@/components/organisms/Header'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  
  const getPageTitle = () => {
    const path = location.pathname
    switch (path) {
      case '/':
        return 'Dashboard'
      case '/courses':
        return 'My Courses'
      case '/grades':
        return 'Academic Grades'
      case '/calendar':
        return 'Academic Calendar'
      case '/announcements':
        return 'Announcements'
      case '/profile':
        return 'Student Profile'
      default:
        return 'ScholarHub'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-70">
          <Sidebar isOpen={true} onClose={() => {}} />
        </div>
      </div>
      
      {/* Mobile Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          title={getPageTitle()}
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout