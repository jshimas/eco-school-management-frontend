import { defineStore } from 'pinia'
import UsersApi from '../api/UsersApi'
import VueCookies from 'vue-cookies'

const defaultState = {
  user: null,
  loading: false,
  error: null,
  users: null
}

export const useUserStore = defineStore('user', {
  state: () => ({ ...defaultState }),

  actions: {
    logout() {
      VueCookies.remove('jwt')

      Object.assign(this, defaultState)
    },

    async login(credentials) {
      try {
        this.loading = true

        // Call the API to login
        const userApi = new UsersApi()
        this.error = null
        const res = await userApi.login(credentials)
        VueCookies.set('jwt', res.data.token)
      } catch (error) {
        console.log(error)
        this.error = error.response.data.message
      } finally {
        this.loading = false
      }
    },

    async getMe() {
      if (!VueCookies.isKey('jwt')) return
      try {
        this.loading = true
        const userApi = new UsersApi()
        const res = await userApi.getCurrentUser()
        this.user = res.data.user
      } catch (error) {
        console.log(error)
        this.error = error.response.data.message
      } finally {
        this.loading = false
      }
    },

    async getAllUsers() {
      try {
        this.loading = true

        const userApi = new UsersApi()
        const res = await userApi.getAllUsers()

        this.users = res.data.users
      } catch (error) {
        console.log(error)
        this.error = error.response.data.message
      } finally {
        this.loading = false
      }
    },

    async createUser(data) {
      try {
        this.loading = true

        const userApi = new UsersApi()
        const res = await userApi.createUser(data)
      } catch (error) {
        console.log(error)
        this.error = error.response.data.message
      } finally {
        this.loading = false
      }
    },

    async updateUser(userId, data) {
      try {
        this.loading = true

        const userApi = new UsersApi()
        const res = await userApi.updateUser(userId, data)

      } catch (error) {
        console.log(error)
        this.error = error.response.data.message
      } finally {
        this.loading = false
      }
    },

    async createUserPassword(token, data) {
      try {
        this.loading = true
        this.error = null
        const userApi = new UsersApi()
        const res = await userApi.createUserPassword(token, data)
        console.log(res)
      } catch (error) {
        console.log(error)
        this.error = error
      } finally {
        this.loading = false
      }
    }
  }
})
