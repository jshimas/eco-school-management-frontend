<template>
  <div class="container mt-5 d-flex flex-column">
    <h3>Edit User</h3>
    <div class="mb-4 row">
      <div class="col-6">
        <label for="name" class="form-label">Name</label>
        <input type="text" class="form-control" id="name" v-model="user.firstname" />
      </div>
      <div class="col-6">
        <label for="lastname" class="form-label">Last Name</label>
        <input type="text" class="form-control" id="lastname" v-model="user.lastname" />
      </div>
      <div class="col-6 mt-3">
        <label for="email" class="form-label">Email</label>
        <input type="text" class="form-control" id="email" v-model="user.email" />
      </div>
      <div class="col-6">
        <label class="mt-4" for="role">Role</label>
        <select id="role" class="form-select" v-model="user.role" required>
          <option value="" disabled>Select a role</option>
          <option v-for="role in roleOptions" :value="role.name" :key="role.name">
            {{ role.name }}
          </option>
        </select>
      </div>
      <span v-if="userStore.error">{{ userStore.error }}</span>
      <div class="col-12 mt-4">
        <button type="button" class="btn btn-success me-2" @click="save">
          <i class="bi bi-save"></i> SAVE
        </button>
        <button type="button" class="btn btn-outline-secondary" @click="reset">
          <i class="bi bi-x-lg"></i> Reset
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, reactive, ref } from 'vue'
import { useUserStore } from '../../stores/user'
import { useRoute, useRouter } from 'vue-router'

export default {
  setup() {
    const userStore = useUserStore()
    const user = reactive({
      firstname: '',
      lastname: '',
      role: '',
      email: ''
    })
    const roleOptions = ref([
      { id: 1, name: 'member' },
      { id: 2, name: 'coordinator' },
      { id: 3, name: 'admin' }
    ])
    const route = useRoute()
    const router = useRouter()

    const save = async () => {
      user.roleId = roleOptions.value.find((role) => role.name === user.role).id
      delete user.role
      await userStore.updateUser(userStore.userEdit.id, user)
      router.push({ name: 'users' })
    }
    const reset = () => {
      user.firstname = userStore.userEdit.firstname
      user.lastname = userStore.userEdit.lastname
      user.role = userStore.userEdit.role
      user.email = userStore.userEdit.email
    }

    onBeforeMount(async () => {
      await userStore.getUserById(route.params.userId)
      user.firstname = userStore.userEdit.firstname
      user.lastname = userStore.userEdit.lastname
      user.role = userStore.userEdit.role
      user.email = userStore.userEdit.email
    })

    return {
      userStore,
      user,
      reset,
      save,
      roleOptions
    }
  }
}
</script>
