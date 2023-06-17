<template>
    <div class="container">
      <table v-if="users && users.length > 0" class="table table-hover">
        <thead>
          <tr>
            <th class="fw-bold">ID</th>
            <th class="fw-bold">Name</th>
            <th class="fw-bold">Email</th>
            <th class="fw-bold">Role</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          <tr
            v-for="user in users"
            :key="user.id"
            :class="{ 'clickable-row': !withActions }"
            @click="!withActions && navigateToEditUser(user.id)"
          >
            <td>{{ user.id }}</td>
            <td>{{ user.firstname }} {{ user.lastname }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td v-if="withActions && userStore.user.role !== 'member'">
              <div class="hstack gap-2">
                <button
                  class="btn btn-sm btn-outline-primary mr-2"
                  @click="navigateToEditUser(user.id)"
                >
                  <i class="bi bi-pen"></i> Edit
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="container d-flex justify-content-center opacity-50">
        <p v-if="!users || users.length === 0">{{ message }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import { useRouter } from 'vue-router'
  import { useUserStore } from '../stores/user'
  
  export default {
    name: 'UsersTable',
    props: ['users','withActions', 'message'],
    setup() {
      const router = useRouter()
      const userStore = useUserStore()
  
      function navigateToEditUser(userId) {
        router.push({
          name: 'editUser',
          params: { userId: userId }
        })
      }
  
      return {
        navigateToEditUser,
        userStore
      }
    }
  }
  </script>
  