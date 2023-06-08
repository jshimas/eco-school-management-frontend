import { defineStore } from 'pinia'
import UsersApi from '../api/UsersApi'
import VueCookies from 'vue-cookies'

const defaultState = {
  user: null,
  loading: false,
  error: null,
  users: []
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

        console.log(res)

        this.users = res.data.users
        console.log(this.users)
      } catch (error) {
        console.log(error)
        this.error = error.response.data.message
      } finally {
        this.loading = false
      }
    }
  }
})
