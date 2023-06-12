import Api from './Api'

class SchoolsApi extends Api {
  constructor() {
    super('/schools') // Set the appropriate base URL for meetings endpoint
  }

  async getAllSchools() {
    return await this.get()
  }

  async getSchoolById(id) {
    return await this.get(`/${id}`)
  }
}

export default SchoolsApi
