<template>
  <div class="container mt-5">
    <h1>Activities</h1>
    <h3>Project: {{ projectStore.school.projectName }}</h3>
    <h6 class="">School: {{ projectStore.school.name }}</h6>

    <div v-if="activitiesStore.loading" class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>

    <div class="container d-flex justify-content-end">
      <div v-if="!activitiesStore.loading" class="btn-group mb-2" role="group">
        <input
          type="radio"
          class="btn-check"
          name="btnradio"
          id="btn-radio-approved"
          autocomplete="off"
          checked
          @click="filter = 'approved'"
        />
        <label class="btn btn-outline-primary" for="btn-radio-approved">Approved</label>

        <input
          type="radio"
          class="btn-check"
          name="btnradio"
          id="btn-radio-ready"
          autocomplete="off"
          @click="filter = 'ready'"
        />
        <label class="btn btn-outline-primary" for="btn-radio-ready">Ready</label>

        <input
          type="radio"
          class="btn-check"
          name="btnradio"
          id="btn-radio-in-progress"
          autocomplete="off"
          @click="filter = 'inProgress'"
        />
        <label class="btn btn-outline-primary" for="btn-radio-in-progress">In Progress</label>

        <input
          type="radio"
          class="btn-check"
          name="btnradio"
          id="btn-radio-pending"
          autocomplete="off"
          @click="filter = 'pending'"
        />
        <label class="btn btn-outline-primary" for="btn-radio-pending"
          ><i
            v-if="activitiesStore.pending && activitiesStore.pending.length > 0"
            class="bi bi-three-dots"
          ></i>
          Pending
        </label>
      </div>
    </div>

    <div v-if="!activitiesStore.loading">
      <ActivitiesTable
        v-if="filter === 'approved'"
        :activities="activitiesStore.approved"
        :withActions="false"
        :message="'No approved actions at the moment'"
      />
      <ActivitiesTable
        v-if="filter === 'ready'"
        :activities="activitiesStore.ready"
        :withActions="false"
        :message="'No ready actions at the moment'"
      />
      <ActivitiesTable
        v-if="filter === 'inProgress'"
        :activities="activitiesStore.inProgress"
        :withActions="false"
        :message="'No in progress actions at the moment'"
      />
      <ActivitiesTable
        v-if="filter === 'pending'"
        :activities="activitiesStore.pending"
        :withActions="true"
        :message="'No pending actions at the moment'"
      />
    </div>
    <router-link :to="{name: 'createActivity'}">
      <button class="btn btn-success">Create activity</button>
    </router-link>
  </div>
</template>

<script>
import { onBeforeMount, ref } from 'vue'
import { useActivitiesStore } from '../../stores/activities'
import { useProjectStore } from '../../stores/project'
import { useUserStore } from '../../stores/user'
import ActivitiesTable from '../../components/ActivitiesTable.vue'

export default {
  components: {
    ActivitiesTable
  },

  setup() {
    const activitiesStore = useActivitiesStore()
    const projectStore = useProjectStore()
    const userStore = useUserStore()
    const filter = ref('approved')

    onBeforeMount(async () => {
      if (!activitiesStore.activities) {
        await activitiesStore.fetchUserActivities()
      }
      if (!projectStore.school) {
        await projectStore.fetchUserProject()
      }
    })

    return {
      activitiesStore,
      projectStore,
      userStore,
      filter
    }
  }
}
</script>
