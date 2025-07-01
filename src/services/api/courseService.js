import coursesData from '@/services/mockData/courses.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class CourseService {
  constructor() {
    this.courses = [...coursesData]
  }

  async getAll() {
    await delay(300)
    return [...this.courses]
  }

  async getById(id) {
    await delay(250)
    const course = this.courses.find(c => c.Id === id)
    if (!course) {
      throw new Error('Course not found')
    }
    return { ...course }
  }

  async getEnrolledCourses() {
    await delay(350)
    // For demo purposes, return all courses as enrolled
    return [...this.courses]
  }

  async getAvailableCourses() {
    await delay(300)
    // Return courses that aren't at capacity
    return this.courses.filter(course => course.enrolled < course.capacity)
  }

  async enrollInCourse(courseId, studentId) {
    await delay(400)
    const course = this.courses.find(c => c.Id === courseId)
    if (!course) {
      throw new Error('Course not found')
    }
    
    if (course.enrolled >= course.capacity) {
      throw new Error('Course is full')
    }
    
    course.enrolled += 1
    return { ...course }
  }

  async dropCourse(courseId, studentId) {
    await delay(300)
    const course = this.courses.find(c => c.Id === courseId)
    if (!course) {
      throw new Error('Course not found')
    }
    
    if (course.enrolled > 0) {
      course.enrolled -= 1
    }
    return { ...course }
  }

  async create(courseData) {
    await delay(400)
    const newId = Math.max(...this.courses.map(c => c.Id)) + 1
    const newCourse = {
      ...courseData,
      Id: newId,
      enrolled: 0
    }
    this.courses.push(newCourse)
    return { ...newCourse }
  }

  async update(id, courseData) {
    await delay(350)
    const index = this.courses.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error('Course not found')
    }
    
    this.courses[index] = { ...this.courses[index], ...courseData }
    return { ...this.courses[index] }
  }

  async delete(id) {
    await delay(300)
    const index = this.courses.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error('Course not found')
    }
    
    this.courses.splice(index, 1)
    return true
  }
}

export default new CourseService()