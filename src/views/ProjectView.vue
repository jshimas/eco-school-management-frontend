<template>
  <div class="container col col-5 mt-4">
    <div v-if="projectStore.loading" class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div v-if="!projectStore.loading" class="p-4">
      <div class="d-flex flex-column align-items-center">
        <h3 class="fs-4 text-uppercase opacity-50">
          {{ projectStore.school.projectName }}
        </h3>
        <h6 class="fs-3">{{ projectStore.school.name }}</h6>
        <div>
          <span class="badge rounded-pill bg-primary fs-5 mb-4">{{
            projectStore.school.level
          }}</span>
        </div>
      </div>
      <div class="card-text text-capitalize opacity-90 d-flex flex-column align-items-center mb-5">
        <p class="m-0 fs-5">
          Number of activities:
          <span class="ms-3 fw-bold">{{ projectStore.school.activitiesQuantity }}</span>
        </p>
        <p class="m-0 fs-5">
          Number of students:
          <span class="ms-3 fw-bold">{{ projectStore.school.studentsQuantity }}</span>
        </p>
        <p class="m-0 fs-5">
          Number of themes:
          <span class="ms-3 fw-bold">{{ projectStore.school.themesQuantity }}</span>
        </p>
      </div>
      <div class="d-flex flex-column align-items-center mb-2 fw-bold">
        <h6 class="fw-bold">Don't know where to start?</h6>
      </div>
      <div class="hstack d-flex justify-content-center">
        <div
          class="vstack w-50 px-4 border-end d-flex flex-column align-items-center justify-content-center gap-2"
        >
          <p class="text-center">
            Colaborate and discuss with schoolmates, generate new ideas, and plan your activities 🎯
          </p>
          <router-link
            :to="{ name: 'schoolMeetings', params: { schoolId: userStore.user.schoolId } }"
          >
            <button class="btn btn-primary mt-auto">Participate in Meetings</button></router-link
          >
        </div>
        <div
          class="vstack w-50 px-4 d-flex flex-column align-items-center justify-content-center gap-2"
        >
          <p class="text-center">
            Help your school achieve next level by creating new themes and unique activities 🤓
          </p>
          <router-link
            :to="{ name: 'schoolActivities', params: { schoolId: userStore.user.schoolId } }"
          >
            <button class="btn btn-success">Discover Activities</button></router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onBeforeMount } from 'vue'
import { useProjectStore } from '../stores/project'
import { useUserStore } from '../stores/user'

export default {
  setup() {
    const projectStore = useProjectStore()
    const userStore = useUserStore()

    onBeforeMount(async () => {
      await projectStore.fetchUserProject()
      // await userStore.getMe()
    })

    return {
      projectStore,
      userStore
    }
  }
}
</script>
