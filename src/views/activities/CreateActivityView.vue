<template>
  <div class="container mt-5 mb-5 d-flex flex-column align-items-center">
    <h1>Create Activity</h1>

    <div v-if="userStore.loading" class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div v-if="!userStore.loading" class="col-md-6">
      <form class="vstack gap-2" @submit.prevent="createActivity">
        <div class="form-group">
          <label for="theme">Theme</label>
          <input
            id="theme"
            type="text"
            class="form-control"
            placeholder="Enter activity theme"
            v-model="activity.theme"
          />
          <div v-for="error of v$.theme.$errors" :key="error.$uid">
            <div class="text-danger">{{ error.$message }}</div>
          </div>
        </div>
        <div class="form-group">
          <label for="name">Name</label>
          <input
            id="name"
            type="text"
            class="form-control"
            placeholder="Enter activity name"
            v-model="activity.name"
          />
          <div v-for="error of v$.name.$errors" :key="error.$uid">
            <div class="text-danger">{{ error.$message }}</div>
          </div>
        </div>
        <div class="form-group">
          <label for="location">Location</label>
          <input
            id="location"
            type="text"
            class="form-control"
            placeholder="Enter activity location"
            v-model="activity.location"
          />
          <div v-for="error of v$.location.$errors" :key="error.$uid">
            <div class="text-danger">{{ error.$message }}</div>
          </div>
        </div>
        <div class="form-group">
          <label for="startDate">Start Date</label>
          <input
            id="startDate"
            type="date"
            class="form-control"
            placeholder="Enter activity start date"
            v-model="activity.startDate"
          />
          <div v-for="error of v$.startDate.$errors" :key="error.$uid">
            <div class="text-danger">{{ error.$message }}</div>
          </div>
        </div>
        <div>
          <label for="supervisors">Supervisors</label>
          <div class="form-check" v-for="user in userStore.users" :key="user.id">
            <input
              type="checkbox"
              class="form-check-input"
              :id="user.id"
              :value="user.id"
              v-model="activity.supervisorsIds"
            />
            <label :for="user.id" class="form-check-label"
              >{{ user.firstname }} {{ user.lastname }}
            </label>
          </div>
          <div v-for="error of v$.supervisorsIds.$errors" :key="error.$uid">
            <div class="text-danger">{{ error.$message }}</div>
          </div>
        </div>
        <button type="submit" class="btn btn-success">Create</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, reactive, unref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useActivitiesStore } from '../../stores/activities'
import { useUserStore } from '../../stores/user'
import { useVuelidate } from '@vuelidate/core'
import { required, minValue, helpers } from '@vuelidate/validators'

const route = useRoute()
const router = useRouter()
const activitiesStore = useActivitiesStore()
const userStore = useUserStore()
const activity = reactive({
  theme: '',
  name: '',
  location: '',
  startDate: '',
  supervisorsIds: []
})

const rules = {
  theme: { required: helpers.withMessage(`Theme cannot be empty`, required) },
  name: { required: helpers.withMessage(`Name cannot be empty`, required) },
  location: { required: helpers.withMessage(`Location cannot be empty`, required) },
  startDate: {
    required: helpers.withMessage(`Start date cannot be empty`, required),
    minValue: helpers.withMessage(
      'Start date must be after today',
      (value) => new Date(value) > new Date()
    )
  },
  supervisorsIds: { required: helpers.withMessage(`Pick activity supervisors`, required) }
}

const v$ = useVuelidate(rules, activity)

onBeforeMount(async () => {
  await userStore.getAllUsers()
})

const createActivity = async () => {
  const isFormCorrect = await unref(v$).$validate()
  if (!isFormCorrect) return

  const res = await activitiesStore.createActivity(activity)
  await activitiesStore.fetchUserActivities()
  if (res) {
    console.log(res)
    router.push({ name: 'schoolActivities', params: { schoolId: route.params.schoolId } })
  }
}
</script>
