<template>
  <div class="container">
    <div v-if="projectStore.loading" class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div v-if="!projectStore.loading" class="card">
      <h3 class="card-title">{{ projectStore.school.projectName }}</h3>
      <h6 class="card-subtitle">{{ projectStore.school.name }}</h6>
      <span class="badge rounded-pill bg-primary">{{ projectStore.school.level }}</span>
      <div class="card-text">
        <p>Number of activities: {{ projectStore.school.activitiesQuantity }}</p>
        <p>Number of students: {{ projectStore.school.studentsQuantity }}</p>
        <p>Number of themes: {{ projectStore.school.themesQuantity }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { onBeforeMount } from 'vue'
import { useProjectStore } from '../stores/project'

export default {
  setup() {
    const projectStore = useProjectStore()

    onBeforeMount(async () => {
      if (!projectStore.school) {
        await projectStore.fetchUserProject()
      }
    })

    return {
      projectStore
    }
  }
}
</script>
