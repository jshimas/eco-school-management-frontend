<template>
  <div class="container mt-5 d-flex flex-column">
    <h1>Users</h1>
    <div v-if="!userStore.loading">
      <UsersTable
        :users="usersWithoutLogged"
        :withActions="false"
        :message="'No approved actions at the moment'"
      />
    </div>
    <router-link :to="{ name: 'createUser' }">
      <button class="btn btn-primary">Add new user</button>
    </router-link>
  </div>
</template>

<script>
import { useUserStore } from '../../stores/user'
import { onBeforeMount, defineComponent, computed } from 'vue'
import UsersTable from '../../components/UsersTable.vue'

export default (await import('vue')).defineComponent({
  components: {
    UsersTable
  },
  computed: {
    usersWithoutLogged() {
      const userStore = useUserStore()
      return userStore.users.filter((user) => user.id !== userStore.user.id)
    }
  },

  setup() {
    const userStore = useUserStore()

    onBeforeMount(async () => {
      await userStore.getAllUsers()
    })

    return {
      userStore
    }
  }
})
</script>
