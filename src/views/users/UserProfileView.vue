<template>
  <div class="container mt-5 d-flex flex-column">
    <h3>User Profile</h3>
    <div class="mb-4 row">
      <div class="col-6">
        <label for="name" class="form-label">Name</label>
        <input type="text" class="form-control" id="name" v-model="user.firstname" />
      </div>
      <div class="col-6">
        <label for="lastname" class="form-label">Last Name</label>
        <input type="text" class="form-control" id="lastname" v-model="user.lastname" />
      </div>
      <div class="col-6">
        <label class="mt-4" for="school">School</label>
        <input
          type="text"
          disabled
          class="form-control"
          id="school"
          v-model="userStore.user.schoolName"
        />
      </div>
      <div class="col-6">
        <label class="mt-4" for="role">Role</label>
        <input type="text" disabled class="form-control" id="role" v-model="userStore.user.role" />
      </div>
      <span v-if="userStore.error">{{ userStore.error }}</span>
      <div class="col-12 mt-4">
        <button type="button" class="btn btn-success me-2" @click="save"><i class="bi bi-save"></i> SAVE</button>
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

export default {
  setup() {
    const userStore = useUserStore()
    const user = reactive({
      firstname: '',
      lastname: '',
    })
    const save = async () => {
      await userStore.updateUser(userStore.user.id,user)
    }
    const reset = () => {
      user.firstname = userStore.user.firstname
      user.lastname = userStore.user.lastname
    }

    onBeforeMount(async () => {
      await userStore.getMe()
      user.firstname = userStore.user.firstname
      user.lastname = userStore.user.lastname
    })

    return {
      userStore,
      user,
      reset,
      save
    }
  }
}
</script>
