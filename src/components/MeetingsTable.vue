<template>
  <div class="container">
    <table v-if="meetings && meetings.length > 0" class="table table-hover">
      <thead>
        <tr>
          <th class="fw-bold">Subject</th>
          <th class="fw-bold">Place</th>
          <th class="fw-bold">Date</th>
          <th class="fw-bold">Start Hour</th>
          <th class="fw-bold" v-if="withActions && userStore.user.role !== 'member'">Actions</th>
        </tr>
      </thead>
      <tbody class="table-group-divider">
        <tr
          v-for="meeting in sortByStartDate(meetings)"
          :key="meeting.id"
          :class="{ 'clickable-row': !withActions }"
          @click="!withActions && navigateToMeeting(meeting.id)"
        >
          <td>{{ meeting.subject }}</td>
          <td>{{ meeting.place }}</td>
          <td>{{ formatDate(meeting.date) }}</td>
          <td>{{ formatTime(meeting.startTime) }}</td>
          <td v-if="withActions && userStore.user.role !== 'member'">
            <div class="hstack gap-2">
              <button
                class="btn btn-sm btn-outline-primary mr-2"
                @click="navigateToActivity(meeting.id)"
              >
                <i class="bi bi-pen"></i> Edit
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="container d-flex justify-content-center opacity-50">
      <p v-if="!meetings || meetings.length === 0">{{ message }}</p>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

export default {
  name: 'AMeetingsTable',
  props: ['meetings', 'withActions', 'message'],
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    function formatDate(stringDate) {
      const date = new Date(stringDate)
      return date.toLocaleString('lt-LT').split(' ')[0]
    }

    function formatTime(time) {


      return time.split('T')[1].split(':').slice(0, 2).join('h')
    }

    function navigateToMeeting(meetingId) {
      router.push({
        name: 'meeting',
        params: { schoolId: userStore.user.schoolId, meetingId: meetingId }
      })
    }

    function sortByStartDate(activities) {
      return activities.sort((a, b) =>
        a.startDate > b.startDate ? 1 : a.startDate < b.startDate ? -1 : 0
      )
    }

    return {
      formatDate,
      formatTime,
      navigateToMeeting,
      sortByStartDate
    }
  }
}
</script>
