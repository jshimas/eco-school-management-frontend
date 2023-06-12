import { defineStore } from 'pinia'
import SchoolsApi from '../api/SchoolApi'
import { useUserStore } from './user'

export const useProjectStore = defineStore('project', {
  state: () => ({
    school: null,
    schools: null,
    error: null,
    loading: false
  }),

  actions: {
    async fetchUserProject() {
      try {
        this.loading = true
        const userStore = useUserStore()
        const schoolsApi = new SchoolsApi()
        const res = await schoolsApi.getSchoolById(userStore.user.schoolId)
        this.school = res.data.school
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
    async fetchAllProjects() {
      try {
        this.loading = true
        const schoolsApi = new SchoolsApi()
        const res = await schoolsApi.getAllSchools()
        this.schools = res.data.schools
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    }
  }
})
