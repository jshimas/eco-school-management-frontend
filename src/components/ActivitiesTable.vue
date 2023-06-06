<template>
  <div class="container">
    <table v-if="activities && activities.length > 0" class="table table-hover">
      <thead>
        <tr>
          <th class="fw-bold">Theme</th>
          <th class="fw-bold">Activity</th>
          <th class="fw-bold">Start date</th>
          <th class="fw-bold">State</th>
          <th class="fw-bold" v-if="withActions">Actions</th>
        </tr>
      </thead>
      <tbody class="table-group-divider">
        <tr v-for="activity in activities" :key="activity.id">
          <td>{{ activity.theme }}</td>
          <td>{{ activity.name }}</td>
          <td>{{ formatDate(activity.startDate) }}</td>
          <td>{{ getStateName(activity) }}</td>
          <td v-if="withActions">
            <div class="hstack gap-2">
              <button
                class="btn btn-sm btn-outline-success mr-2"
                @click="activitiesStore.approveActivity(activity.id)"
              >
                <i class="bi bi-check"></i>Accept</button
              ><button
                class="btn btn-sm btn-outline-danger"
                @click="activitiesStore.deleteActivity(activity.id)"
              >
                <i class="bi bi-x"></i>Reject
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="container d-flex justify-content-center opacity-50">
      <p v-if="!activities || activities.length === 0">{{ message }}</p>
    </div>
  </div>
</template>

<script>
import { useActivitiesStore } from '../stores/activities'

export default {
  name: 'ActivitiesTable',
  props: ['activities', 'withActions', 'message'],
  setup() {
    const activitiesStore = useActivitiesStore()

    function getStateName(activity) {
      if (!activity.approved) return 'pending'
      else if (activity.startDate < new Date()) return 'ready'
      else if (activity.endDate) return 'finished'
      else return 'in progress'
    }

    function formatDate(stringDate) {
      const date = new Date(stringDate)
      return date.toLocaleString('en-US')
    }

    return {
      activitiesStore,
      formatDate,
      getStateName
    }
  }
}
</script>
