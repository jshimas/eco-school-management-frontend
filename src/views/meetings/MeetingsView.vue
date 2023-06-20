<template>
  <div class="container mt-5">
    <h1>Meetings</h1>
    <h3>Project: {{ projectStore.school.projectName }}</h3>
    <h6 class="mb-4">School: {{ projectStore.school.name }}</h6>

    <div v-if="meetingsStore.loading" class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>

    <div v-if="!meetingsStore.loading">
      <MeetingsTable
        :meetings="meetingsStore.meetings"
        :withActions="false"
        :message="'No approved actions at the moment'"
      />
    </div>
    <router-link
      v-if="userStore.user.role == 'coordinator' || userStore.user.role == 'admin'"
      :to="{ name: 'createMeeting' }"
    >
      <button class="btn btn-success"><i class="bi bi-plus"></i> Create meeting</button>
    </router-link>
  </div>
</template>

<script>
import { onBeforeMount, ref } from 'vue'
import { useMeetingsStore } from '../../stores/meetings'
import { useProjectStore } from '../../stores/project'
import { useUserStore } from '../../stores/user'
import MeetingsTable from '../../components/MeetingsTable.vue'

export default {
  components: {
    MeetingsTable
  },

  setup() {
    const meetingsStore = useMeetingsStore()
    const projectStore = useProjectStore()
    const userStore = useUserStore()
    const filter = ref('approved')

    onBeforeMount(async () => {
      await meetingsStore.fetchAllMettings()
      await projectStore.fetchUserProject()
    })

    return {
      meetingsStore,
      projectStore,
      userStore,
      filter
    }
  }
}
</script>
