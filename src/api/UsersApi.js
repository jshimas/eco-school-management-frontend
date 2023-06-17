import Api from './Api'

class UsersApi extends Api {
  constructor() {
    super('/users')
  }

  async login({ email, password }) {
    return await this.post('/login', { email, password })
  }

  async getUserById(id) {
    return await this.get(`/${id}`)
  }

  async updateUser(userId, data) {
    return await this.update(`/${userId}`, data)
  }

  async getAllUsers() {
    return await this.get()
  }

  async getCurrentUser() {
    return await this.get(`/me`)
  }

  async createUser(data) {
    return await this.post('', data)
  }

  async createUserPassword(token, credentials) {
    return await this.post(`/create-password/${token}`, credentials)
  }
}

export default UsersApi
