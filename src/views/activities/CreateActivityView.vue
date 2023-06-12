<template>
  <div class="container mt-5 mb-5 d-flex flex-column align-items-center">
    <router-link
      class="col-md-6 p-0 m-0"
      :to="{ name: 'schoolActivities', params: { schoolId: route.params.schoolId } }"
    >
      <!-- Button trigger modal -->
      <button v-if="!activityChanged" type="button" class="btn btn-light align-self-start">
        <i class="bi bi-arrow-left"></i> Back to activities
      </button>
    </router-link>
    <div class="col-md-6 p-0 m-0">
      <!-- Button trigger modal -->
      <button
        v-if="activityChanged"
        type="button"
        class="btn btn-light align-self-start"
        data-bs-toggle="modal"
        data-bs-target="#modal"
      >
        <i class="bi bi-arrow-left"></i> Back to activities
      </button>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="modal"
      aria-labelledby="cancelActivityCreationModal"
      aria-hidden="true"
    >
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
          <div class="modal-body">All the activity creation data will be lost</div>
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

    <!-- Create activity form -->
    <h1>Create Activity</h1>

    <div v-if="userStore.loading" class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div v-if="!userStore.loading" class="col-md-6">
      <form class="vstack gap-2" @submit.prevent="createActivity">
        <div class="form-group">
          <label for="theme">Theme*</label>
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
          <label for="name">Name*</label>
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
          <label for="location">Location*</label>
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
          <label for="startDate">Start Date*</label>
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
          <label for="supervisors">Supervisors*</label>
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

        <!-- optional fields -->
        <div>
          <button
            type="button"
            class="btn btn-light mb-2"
            data-bs-toggle="collapse"
            data-bs-target="#optional-fields"
            aria-expanded="false"
            aria-controls="optional-fields"
          >
            Add extra information
          </button>
          <div class="collapse vstack gap-2" id="optional-fields">
            <div class="collapse form-group">
              <label for="reason">Reason</label>
              <input
                id="reason"
                type="text"
                class="form-control"
                placeholder="Write a motive for the activity"
                v-model="activity.reason"
              />
            </div>
            <div class="form-group optional-field">
              <label for="goal">Goal</label>
              <input
                id="goal"
                type="text"
                class="form-control"
                placeholder="Write a goal for the activity"
                v-model="activity.goal"
              />
            </div>
            <div class="form-group">
              <label for="result">Result</label>
              <input
                id="result"
                type="text"
                class="form-control"
                placeholder="Write the result of the activity"
                v-model="activity.result"
              />
            </div>
            <div class="form-group">
              <label for="resources">Resources</label>
              <input
                id="resources"
                type="text"
                class="form-control"
                placeholder="Write the needed resources for the activity"
                v-model="activity.resources"
              />
            </div>
            <div class="form-group">
              <label for="notes">Notes</label>
              <input
                id="notes"
                type="text"
                class="form-control"
                placeholder="Any extra notes..."
                v-model="activity.notes"
              />
            </div>
          </div>
        </div>
        <p>*Required fields</p>

        <button type="submit" class="btn btn-success">Create</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, reactive, unref, ref, watch } from 'vue'
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
  supervisorsIds: [],
  reason: '',
  goal: '',
  result: '',
  resources: '',
  notes: ''
})

const activityChanged = ref(false)
for (const key in activity) {
  watch(
    () => activity[key],
    (newValue, oldValue) => {
      if (newValue !== oldValue) {
        activityChanged.value = true
      }
    }
  )
}

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

  await await activitiesStore.createActivity(activity)
  await activitiesStore.fetchUserActivities()
  router.push({ name: 'schoolActivities', params: { schoolId: route.params.schoolId } })
}

const handleReturn = () => {
  router.push({ name: 'schoolActivities', params: { schoolId: route.params.schoolId } })
}
</script>
