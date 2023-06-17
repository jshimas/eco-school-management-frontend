import { defineStore } from 'pinia'
import MeetingsApi from '../api/MeetingsApi';

export const useMeetingsStore = defineStore('meeting', {
  state: () => ({
    meetings: null,
    meeting: null,
    error: null,
    loading: false
  }),


  actions: {
    async fetchAllMettings() {
      try {
        this.loading = true
        const meetingsApi = new MeetingsApi()
        const res = await meetingsApi.getAllMeetings()
        this.meetings = res.data.meetings
      } catch (err) {
        this.error = err
        console.log(err);
      } finally {
        this.loading = false
      }
    },

    async fetchMeeting(meetingId) {
      try {
        this.loading = true
        const meetingsApi = new MeetingsApi()
        const res = await meetingsApi.getMeetingById(meetingId)
        this.meeting = res.data.meeting
      } catch (err) {
        console.log(err)
        this.error = err
      } finally {
        this.loading = false
      }
    },
    async createMeeting(data) {
      try {
        this.loading = true
        const meetingsApi = new MeetingsApi()
        const res = await meetingsApi.createMeeting(data)
        return await res.data
      } catch (err) {
        console.log(err)
        this.error = err
      } finally {
        this.loading = false
      }
    },
    async updateMeeting(meeting) {
      try {
        this.loading = true
        const meetingsApi = new MeetingsApi()
        const res = await meetingsApi.updateMeetingById(meeting)

      } catch (err) {
        console.log(err)
        this.error = err
      } finally {
        this.loading = false
      }
    }
  },

  getters: {
    
  }
})
