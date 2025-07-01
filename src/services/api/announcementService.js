import announcementsData from '@/services/mockData/announcements.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class AnnouncementService {
  constructor() {
    this.announcements = [...announcementsData]
  }

  async getAll() {
    await delay(300)
    return [...this.announcements].sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  async getById(id) {
    await delay(250)
    const announcement = this.announcements.find(a => a.Id === id)
    if (!announcement) {
      throw new Error('Announcement not found')
    }
    return { ...announcement }
  }

  async getRecent(limit = 5) {
    await delay(200)
    return [...this.announcements]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit)
  }

  async getUnread() {
    await delay(250)
    return this.announcements
      .filter(announcement => !announcement.read)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  async getByPriority(priority) {
    await delay(250)
    return this.announcements
      .filter(announcement => announcement.priority === priority)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  async getByCategory(category) {
    await delay(250)
    return this.announcements
      .filter(announcement => announcement.category === category)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  async markAsRead(id) {
    await delay(200)
    const index = this.announcements.findIndex(a => a.Id === id)
    if (index === -1) {
      throw new Error('Announcement not found')
    }
    
    this.announcements[index].read = true
    return { ...this.announcements[index] }
  }

  async markAllAsRead() {
    await delay(300)
    this.announcements.forEach(announcement => {
      announcement.read = true
    })
    return [...this.announcements]
  }

  async create(announcementData) {
    await delay(400)
    const newId = Math.max(...this.announcements.map(a => a.Id)) + 1
    const newAnnouncement = {
      ...announcementData,
      Id: newId,
      date: new Date().toISOString(),
      read: false
    }
    this.announcements.push(newAnnouncement)
    return { ...newAnnouncement }
  }

  async update(id, announcementData) {
    await delay(350)
    const index = this.announcements.findIndex(a => a.Id === id)
    if (index === -1) {
      throw new Error('Announcement not found')
    }
    
    this.announcements[index] = { ...this.announcements[index], ...announcementData }
    return { ...this.announcements[index] }
  }

  async delete(id) {
    await delay(300)
    const index = this.announcements.findIndex(a => a.Id === id)
    if (index === -1) {
      throw new Error('Announcement not found')
    }
    
    this.announcements.splice(index, 1)
    return true
  }
}

export default new AnnouncementService()