<template>
  <div class="container mt-5 mb-5 d-flex flex-column align-items-center">
    <router-link
      class="col-md-6 p-0 m-0"
      :to="{ name: 'schoolMeetings', params: { schoolId: route.params.schoolId } }"
    >
      <!-- Button trigger modal -->
      <button v-if="!meetingChanged" type="button" class="btn btn-light align-self-start">
        <i class="bi bi-arrow-left"></i> Back to meetings
      </button>
    </router-link>
    <div class="col-md-6 p-0 m-0">
      <!-- Button trigger modal -->
      <button
        v-if="meetingChanged"
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
      aria-labelledby="cancelmeetingCreationModal"
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
          <div class="modal-body">All the meeting creation data will be lost</div>
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

    <!-- Create meeting form -->
    <h1>Create Meeting</h1>

    <div v-if="userStore.loading" class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div v-if="!userStore.loading" class="col-md-6">
      <form class="vstack gap-2" @submit.prevent="createmeeting">
        <div class="form-group">
          <label for="subject">Subject*</label>
          <input
            id="subject"
            type="text"
            class="form-control"
            placeholder="Enter meeting subject"
            v-model="meeting.subject"
          />
          <div v-for="error of v$.subject.$errors" :key="error.$uid">
            <div class="text-danger">{{ error.$message }}</div>
          </div>
        </div>
        <div class="form-group">
          <label for="place">Place*</label>
          <input
            id="place"
            type="text"
            class="form-control"
            placeholder="Enter meeting place"
            v-model="meeting.place"
          />
          <div v-for="error of v$.place.$errors" :key="error.$uid">
            <div class="text-danger">{{ error.$message }}</div>
          </div>
        </div>
        <div class="form-group">
          <label for="date">Date*</label>
          <input
            id="date"
            type="date"
            class="form-control"
            placeholder="Enter meeting start date"
            v-model="meeting.date"
          />
          <div v-for="error of v$.date.$errors" :key="error.$uid">
            <div class="text-danger">{{ error.$message }}</div>
          </div>
        </div>
        <div class="form-group">
          <label for="start-time">Start Time*</label>
          <input
            id="start-time"
            type="time"
            class="form-control"
            placeholder="Enter meeting start date"
            v-model="meeting.startTime"
          />
          <div v-for="error of v$.startTime.$errors" :key="error.$uid">
            <div class="text-danger">{{ error.$message }}</div>
          </div>
        </div>
        <div>
          <label for="editors">Editors*</label>
          <div class="form-check" v-for="user in userStore.users" :key="user.id">
            <input
              type="checkbox"
              class="form-check-input"
              :id="user.id"
              :value="user.id"
              v-model="meeting.editorsIds"
            />
            <label :for="user.id" class="form-check-label"
              >{{ user.firstname }} {{ user.lastname }}
            </label>
          </div>
          <div v-for="error of v$.editorsIds.$errors" :key="error.$uid">
            <div class="text-danger">{{ error.$message }}</div>
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
import { useMeetingsStore } from '../../stores/meetings'
import { useUserStore } from '../../stores/user'
import { useVuelidate } from '@vuelidate/core'
import { required, minValue, helpers } from '@vuelidate/validators'

const route = useRoute()
const router = useRouter()
const meetingsStore = useMeetingsStore()
const userStore = useUserStore()
const meeting = reactive({
  subject: '',
  date: '',
  startTime: '',
  place: '',
  editorsIds: [],
})

const meetingChanged = ref(false)
for (const key in meeting) {
  watch(
    () => meeting[key],
    (newValue, oldValue) => {
      if (newValue !== oldValue) {
        meetingChanged.value = true
      }
    }
  )
}

const rules = {
  subject: { required: helpers.withMessage(`Subject cannot be empty`, required) },
  place: { required: helpers.withMessage(`Place cannot be empty`, required) },
  date: {
    required: helpers.withMessage(`Date cannot be empty`, required),
    minValue: helpers.withMessage(
      'Date must be after today',
      (value) => new Date(value) > new Date()
    )
  },
  startTime: {
    required: helpers.withMessage(`Start time cannot be empty`, required),
  },
  editorsIds: { required: helpers.withMessage(`Pick meeting supervisors`, required) }
}

const v$ = useVuelidate(rules, meeting)

onBeforeMount(async () => {
  await userStore.getAllUsers()
})

const createmeeting = async () => {
  const isFormCorrect = await unref(v$).$validate()
  if (!isFormCorrect) return

  meeting.startTime = meeting.date + 'T' + meeting.startTime;

  console.log(meeting);

  await meetingsStore.createMeeting(meeting)
  await meetingsStore.fetchAllMettings()
  router.push({ name: 'schoolMeetings', params: { schoolId: route.params.schoolId } })
}

const handleReturn = () => {
  router.push({ name: 'schoolMeetings', params: { schoolId: route.params.schoolId } })
}
</script>
