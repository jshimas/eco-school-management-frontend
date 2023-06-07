import { defineStore } from 'pinia'
import UsersApi from '../api/UsersApi'
import VueCookies from 'vue-cookies'

const defaultState = {
  user: null,
  loading: false,
  error: null
}

export const useUserStore = defineStore('user', {
  state: () => ({ ...defaultState }),

  actions: {
    logout() {
      document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
      VueCookies.remove('jwt')

      Object.assign(this, defaultState)
    },

    async login(credentials) {
      try {
        this.loading = true

        // Call the API to login
        const userApi = new UsersApi()
        this.error = false
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
    }
  }
})
