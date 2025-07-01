import eventsData from '@/services/mockData/events.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class EventService {
  constructor() {
    this.events = [...eventsData]
  }

  async getAll() {
    await delay(300)
    return [...this.events].sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  async getById(id) {
    await delay(250)
    const event = this.events.find(e => e.Id === id)
    if (!event) {
      throw new Error('Event not found')
    }
    return { ...event }
  }

  async getByDateRange(startDate, endDate) {
    await delay(300)
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    return this.events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate >= start && eventDate <= end
    }).sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  async getByType(type) {
    await delay(250)
    return this.events.filter(event => event.type === type)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  async getUpcoming(limit = 10) {
    await delay(200)
    const now = new Date()
    return this.events
      .filter(event => new Date(event.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, limit)
  }

  async getTodaysEvents() {
    await delay(200)
    const today = new Date().toISOString().split('T')[0]
    return this.events.filter(event => event.date.split('T')[0] === today)
  }

  async create(eventData) {
    await delay(400)
    const newId = Math.max(...this.events.map(e => e.Id)) + 1
    const newEvent = {
      ...eventData,
      Id: newId
    }
    this.events.push(newEvent)
    return { ...newEvent }
  }

  async update(id, eventData) {
    await delay(350)
    const index = this.events.findIndex(e => e.Id === id)
    if (index === -1) {
      throw new Error('Event not found')
    }
    
    this.events[index] = { ...this.events[index], ...eventData }
    return { ...this.events[index] }
  }

  async delete(id) {
    await delay(300)
    const index = this.events.findIndex(e => e.Id === id)
    if (index === -1) {
      throw new Error('Event not found')
    }
    
    this.events.splice(index, 1)
    return true
  }
}

export default new EventService()