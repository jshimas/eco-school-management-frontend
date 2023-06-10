import Api from './Api'

class ActivitiesApi extends Api {
  constructor(schoolId) {
    super(`/schools/${schoolId}/activities`)
  }

  async getActivityById(id) {
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
    return await this.post('', data)
  }

  async updateActivity(activityFormData) {
    return await this.patchWithImages(`/${activityFormData.get('id')}`, activityFormData)
  }
}

export default ActivitiesApi
