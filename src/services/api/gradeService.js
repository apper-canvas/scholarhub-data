import gradesData from '@/services/mockData/grades.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class GradeService {
  constructor() {
    this.grades = [...gradesData]
  }

  async getAll() {
    await delay(300)
    return [...this.grades]
  }

  async getById(id) {
    await delay(250)
    const grade = this.grades.find(g => g.Id === id)
    if (!grade) {
      throw new Error('Grade not found')
    }
    return { ...grade }
  }

  async getByStudentId(studentId) {
    await delay(300)
    // For demo purposes, return all grades
    return [...this.grades]
  }

  async getBySemester(semester) {
    await delay(250)
    return this.grades.filter(grade => grade.semester === semester)
  }

  async getGPA(studentId) {
    await delay(200)
    const studentGrades = [...this.grades]
    
    if (studentGrades.length === 0) {
      return 0
    }
    
    const totalPoints = studentGrades.reduce((sum, grade) => sum + (grade.points * grade.credits), 0)
    const totalCredits = studentGrades.reduce((sum, grade) => sum + grade.credits, 0)
    
    return totalCredits > 0 ? totalPoints / totalCredits : 0
  }

  async getSemesterGPA(studentId, semester) {
    await delay(200)
    const semesterGrades = this.grades.filter(grade => grade.semester === semester)
    
    if (semesterGrades.length === 0) {
      return 0
    }
    
    const totalPoints = semesterGrades.reduce((sum, grade) => sum + (grade.points * grade.credits), 0)
    const totalCredits = semesterGrades.reduce((sum, grade) => sum + grade.credits, 0)
    
    return totalCredits > 0 ? totalPoints / totalCredits : 0
  }

  async getTranscript(studentId) {
    await delay(400)
    // Group grades by semester
    const transcript = {}
    this.grades.forEach(grade => {
      if (!transcript[grade.semester]) {
        transcript[grade.semester] = []
      }
      transcript[grade.semester].push({ ...grade })
    })
    
    return transcript
  }

  async create(gradeData) {
    await delay(400)
    const newId = Math.max(...this.grades.map(g => g.Id)) + 1
    const newGrade = {
      ...gradeData,
      Id: newId
    }
    this.grades.push(newGrade)
    return { ...newGrade }
  }

  async update(id, gradeData) {
    await delay(350)
    const index = this.grades.findIndex(g => g.Id === id)
    if (index === -1) {
      throw new Error('Grade not found')
    }
    
    this.grades[index] = { ...this.grades[index], ...gradeData }
    return { ...this.grades[index] }
  }

  async delete(id) {
    await delay(300)
    const index = this.grades.findIndex(g => g.Id === id)
    if (index === -1) {
      throw new Error('Grade not found')
    }
    
    this.grades.splice(index, 1)
    return true
  }
}

export default new GradeService()