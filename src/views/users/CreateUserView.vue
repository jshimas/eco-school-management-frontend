<template>
  <div class="container mt-5 mb-5 d-flex flex-column align-items-center">
    <router-link class="col-md-6 p-0 m-0" :to="{ name: 'users' }">
      <!-- Button trigger modal -->
      <button v-if="!userChanged" type="button" class="btn btn-light align-self-start">
        <i class="bi bi-arrow-left"></i> Back to users
      </button>
    </router-link>
    <div class="col-md-6 p-0 m-0">
      <!-- Button trigger modal -->
      <button
        v-if="userChanged"
        type="button"
        class="btn btn-light align-self-start"
        data-bs-toggle="modal"
        data-bs-target="#modal"
      >
        <i class="bi bi-arrow-left"></i> Back to users
      </button>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="modal" aria-labelledby="cancelUserCreationModal" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalTitle">Do you want to go back?</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">All the user creation data will be lost</div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Stay</button>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              @click="handleReturn"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create user form -->
    <h1>Create new user</h1>

    <div v-if="projectStore.loading" class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div v-if="!projectStore.loading" class="col-md-6">
      <form class="vstack gap-2" @submit.prevent="createUser">
        <div class="form-group">
          <label for="theme" class="form-label">First name*</label>
          <input
            id="theme"
            type="text"
            class="form-control"
            placeholder="Enter first name"
            v-model="user.firstname"
          />
          <div v-for="error of v$.firstname.$errors" :key="error.$uid">
            <div class="text-danger">{{ error.$message }}</div>
          </div>
        </div>
        <div class="form-group">
          <label for="name" class="form-label">Last name*</label>
          <input
            id="name"
            type="text"
            class="form-control"
            placeholder="Enter last name"
            v-model="user.lastname"
          />
          <div v-for="error of v$.lastname.$errors" :key="error.$uid">
            <div class="text-danger">{{ error.$message }}</div>
          </div>
        </div>
        <div class="form-group">
          <label for="location" class="form-label">Email*</label>
          <input
            id="location"
            type="text"
            class="form-control"
            placeholder="Enter user email"
            v-model="user.email"
          />
          <div v-for="error of v$.email.$errors" :key="error.$uid">
            <div class="text-danger">{{ error.$message }}</div>
          </div>
        </div>
        <div class="form-group">
          <label for="school" class="form-label">School</label>
          <select id="school" class="form-select" v-model="user.schoolId" required>
            <option value="" disabled>Select a school</option>
            <option v-for="school in projectStore.schools" :value="school.id" :key="school.id">
              {{ school.name }}
            </option>
          </select>
          <div v-for="error of v$.schoolId.$errors" :key="error.$uid">
            <div class="text-danger">{{ error.$message }}</div>
          </div>
        </div>
        <div class="form-group">
          <label for="role" class="form-label">Role</label>
          <select id="role" class="form-select" v-model="user.roleId" required>
            <option value="" disabled>Select a role</option>
            <option v-for="roleOption in roleOptions" :value="roleOption.id" :key="roleOption.id">
              {{ roleOption.name }}
            </option>
          </select>
          <div v-for="error of v$.roleId.$errors" :key="error.$uid">
            <div class="text-danger">{{ error.$message }}</div>
          </div>
        </div>

        <p>*Required fields</p>

        <div class="d-flex justify-content-center mt-2">
          <div v-if="userStore.loading" class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <button v-if="!userStore.loading" type="submit" class="btn btn-success">Create</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, reactive, unref, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '../../stores/project'
import { useUserStore } from '../../stores/user'
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'

const router = useRouter()
const projectStore = useProjectStore()
const userStore = useUserStore()
const user = reactive({
  firstname: '',
  lastname: '',
  email: '',
  schoolId: '',
  roleId: ''
})

const roleOptions = ref([
  { id: 1, name: 'member' },
  { id: 2, name: 'coordinator' },
  { id: 3, name: 'admin' }
])

const userChanged = ref(false)
for (const key in user) {
  watch(
    () => user[key],
    (newValue, oldValue) => {
      if (newValue !== oldValue) {
        userChanged.value = true
      }
    }
  )
}

const rules = {
  firstname: { required: helpers.withMessage(`First name cannot be empty`, required) },
  lastname: { required: helpers.withMessage(`Last name cannot be empty`, required) },
  email: {
    required: helpers.withMessage(`Email cannot be empty`, required),
    email: helpers.withMessage('Please provide a valid email', email)
  },
  schoolId: { required: helpers.withMessage(`Please pick a school`, required) },
  roleId: { required: helpers.withMessage(`Please pick a role`, required) }
}

const v$ = useVuelidate(rules, user)

onBeforeMount(async () => {
  await projectStore.fetchAllProjects()
})

const createUser = async () => {
  const isFormCorrect = await unref(v$).$validate()
  if (!isFormCorrect) return

  await userStore.createUser(user)
  await userStore.getAllUsers()
  router.push({ name: 'users' })
}

const handleReturn = () => {
  router.push({ name: 'users' })
}
</script>
