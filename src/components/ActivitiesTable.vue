<template>
  <div class="container">
    <table v-if="activities && activities.length > 0" class="table table-hover">
      <thead>
        <tr>
          <th class="fw-bold">Theme</th>
          <th class="fw-bold">Activity</th>
          <th class="fw-bold">Start date</th>
          <th class="fw-bold">End date</th>
          <th class="fw-bold">State</th>
          <th class="fw-bold" v-if="withActions && userStore.user.role !== 'member'">Actions</th>
        </tr>
      </thead>
      <tbody class="table-group-divider">
        <tr
          v-for="activity in sortByStartDate(activities)"
          :key="activity.id"
          :class="{ 'clickable-row': !withActions }"
          @click="!withActions && navigateToActivity(activity.id)"
        >
          <td>{{ activity.theme }}</td>
          <td>{{ activity.name }}</td>
          <td>{{ formatDate(activity.startDate) }}</td>
          <td>{{ activity.endDate ? formatDate(activity.endDate) : '-' }}</td>
          <td>{{ getStateName(activity) }}</td>
          <td v-if="withActions && userStore.user.role !== 'member'">
            <div class="hstack gap-2">
              <button
                class="btn btn-sm btn-outline-primary mr-2"
                @click="navigateToActivity(activity.id)"
              >
                <i class="bi bi-pen"></i> Edit
              </button>
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
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

export default {
  name: 'ActivitiesTable',
  props: ['activities', 'withActions', 'message'],
  setup() {
    const router = useRouter()
    const activitiesStore = useActivitiesStore()
    const userStore = useUserStore()

    function getStateName(activity) {
      if (!activity.approved) return 'pending'
      else if (activity.approved && new Date(activity.startDate) > new Date()) return 'planned'
      else if (activity.endDate && new Date(activity.endDate) < new Date()) return 'finished'
      else return 'in progress'
    }

    function formatDate(stringDate) {
      const date = new Date(stringDate)
      return date.toLocaleString('lt-LT').split(' ')[0]
    }

    function navigateToActivity(activityId) {
      router.push({
        name: 'activity',
        params: { schoolId: userStore.user.schoolId, activityId: activityId }
      })
    }

    function sortByStartDate(activities) {
      return activities.sort((a, b) => (a.endDate > b.endDate ? 1 : a.endDate < b.endDate ? -1 : 0))
    }

    return {
      activitiesStore,
      formatDate,
      getStateName,
      userStore,
      navigateToActivity,
      sortByStartDate
    }
  }
}
</script>
