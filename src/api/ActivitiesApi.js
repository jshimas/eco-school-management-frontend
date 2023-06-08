import Api from './Api'

class ActivitiesApi extends Api {
  constructor(schoolId) {
    super(`/schools/${schoolId}/activities`)
  }

  static async getActivityById(id) {
    return await this.get(`/${id}`)
  }

  async getAllActivities() {
    return await this.get()
  }

  async approveActivity(id) {
    return await this.patch(`/${id}`, { approved: true })
  }

  async deleteActivity(id) {
    return await this.delete(`/${id}`)
  }

  async createActivity(data) {
    console.log('DATA TO SEND', data)
    return await this.post('', data)
  }
}

export default ActivitiesApi
