import { defineStore } from 'pinia'
import ActivitiesApi from '../api/ActivitiesApi'
import { useUserStore } from './user'

export const useActivitiesStore = defineStore('activity', {
  state: () => ({
    activities: null,
    activity: null,
    error: null,
    loading: false
  }),

  actions: {
    async fetchUserActivities() {
      try {
        this.loading = true
        const userStore = useUserStore()
        const activitiesApi = new ActivitiesApi(userStore.user.schoolId)
        const res = await activitiesApi.getAllActivities()
        this.activities = res.data.activities
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    async fetchActivity(activityId) {
      try {
        this.loading = true
        const userStore = useUserStore()
        console.log(userStore.user.schoolId)
        const activitiesApi = new ActivitiesApi(userStore.user.schoolId)
        const res = await activitiesApi.getActivityById(activityId)
        this.activity = res.data.activity
      } catch (err) {
        console.log(err)
        this.error = err
      } finally {
        this.loading = false
      }
    },

    async approveActivity(id) {
      try {
        this.loading = true
        const userStore = useUserStore()
        const activitiesApi = new ActivitiesApi(userStore.user.schoolId)
        await activitiesApi.approveActivity(id)

        const activityToApprove = this.activities.find((a) => a.id === id)
        activityToApprove.approved = true
      } catch (err) {
        console.log(err)
        this.error = err
      } finally {
        this.loading = false
      }
    },

    async deleteActivity(id) {
      try {
        this.loading = true
        const userStore = useUserStore()
        const activitiesApi = new ActivitiesApi(userStore.user.schoolId)
        await activitiesApi.deleteActivity(id)

        this.activities = this.activities.filter((a) => a.id !== id)
      } catch (err) {
        console.log(err)
        this.error = err
      } finally {
        this.loading = false
      }
    },
    async createActivity(data) {
      try {
        this.loading = true
        const userStore = useUserStore()
        const activitiesApi = new ActivitiesApi(userStore.user.schoolId)

        const res = await activitiesApi.createActivity(data)
        return await res.data
      } catch (err) {
        console.log(err)
        this.error = err
      } finally {
        this.loading = false
      }
    }
  },

  getters: {
    pending() {
      return this.activities.filter((a) => !a.approved)
    },
    approved() {
      return this.activities.filter((a) => a.approved)
    },
    inProgress() {
      return this.activities.filter((a) => {
        return new Date(a.startDate) < new Date() && !a.endDate
      })
    },
    planned() {
      return this.activities.filter((a) => a.approved && new Date(a.startDate) > new Date())
    }
  }
})
