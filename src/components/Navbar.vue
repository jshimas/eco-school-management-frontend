<template>
  <nav class="navbar navbar-expand-sm bg-body-tertiary" data-bs-theme="dark">
    <div class="container-fluid" v-if="!userStore.loading && userStore.user">
      <a class="navbar-brand" href="#">Navbar</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="{ name: 'schoolProject', params: { schoolId: userStore.user.schoolId } }"
              >Project</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="{ name: 'schoolActivities', params: { schoolId: userStore.user.schoolId } }"
              >Activities</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="{ name: 'schoolMeetings', params: { schoolId: userStore.user.schoolId } }"
              >Meetings</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="{ name: 'userProfile', params: { userId: userStore.user.id } }"
              >Profile</router-link
            >
          </li>
          <li class="nav-item" v-if="['admin', 'coordinator'].includes(userStore.user.role)">
            <router-link class="nav-link" :to="{ name: 'users' }">Users</router-link>
          </li>
        </ul>
      </div>
      <div class="ms-auto me-4">
        {{ upperCase(userStore.user.role) }} | {{ userStore.user.firstname }}
        {{ userStore.user.lastname }}
      </div>
      <form @submit="logout">
        <button class="btn btn-outline-light" type="submit">Logout</button>
      </form>
    </div>
  </nav>
</template>

<script>
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'
import { onBeforeMount } from 'vue'

export default {
  name: 'Navbar',
  setup() {
    const userStore = useUserStore()
    const router = useRouter()

    onBeforeMount(async () => {
      await userStore.getMe()
    })

    const logout = async () => {
      await userStore.logout()
      router.push('/login')
    }

    const upperCase = (string) => string.toUpperCase()

    return {
      logout,
      userStore,
      upperCase
    }
  }
}
</script>
