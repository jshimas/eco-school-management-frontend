<template>
  <div class="container mt-4 mb-5 d-flex flex-column align-items-center">
    <router-link
      class="align-self-start mb-4"
      :to="{ name: 'schoolMeetings', params: { schoolId: userStore.user.schoolId } }"
    >
      <!-- Button trigger modal -->
      <button
        type="button"
        class="btn btn-light align-self-start"
        data-bs-toggle="modal"
        data-bs-target="#modal"
      >
        <i class="bi bi-arrow-left"></i> Back to meetings
      </button>
    </router-link>
    <div
      v-if="meetingsStore.loading && updateState"
      class="spinner-border text-primary"
      role="status"
    >
      <span class="visually-hidden">Loading...</span>
    </div>

    <div v-if="!meetingsStore.loading" class="col-12">
      <div class="mb-4">
        <h2 class="mb-0">{{ meetingsStore.meeting.subject }}</h2>
        <div class="hstack gap-2">
          <div class="ms-auto">
            <button
              v-if="!updateState && ifPermissions"
              class="btn btn-outline-primary"
              @click.prevent="updateState = !updateState"
            >
              <i class="bi bi-pen"></i> Edit details
            </button>
            <div v-if="updateState" class="hstack gap-2">
              <button
                type="button"
                class="btn btn-outline-secondary"
                @click.prevent="refreshPageData"
              >
                <i class="bi bi-x-lg"></i> CANCEL
              </button>
              <button type="button" class="btn btn-success" @click.prevent="handleSave">
                <i class="bi bi-save"></i> SAVE
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-2">
        <!-- supervisors -->
        <div class="vstack col-2">
          <div
            v-if="userStore.loading || meetingsStore.loading"
            class="spinner-border text-primary"
            role="status"
          >
            <span class="visually-hidden">Loading...</span>
          </div>
          <div v-if="!userStore.loading && !meetingsStore.loading">
            <div v-if="!updateState || (!updateState && ifPermissions)">
              <div
                class="mb-2 pb-2 border-bottom border-solid border-1 d-flex justify-content-between align-items-center"
              >
                <p class="m-0 p-0">Participants</p>
              </div>
              <div class="vstack gap-2 py-2">
                <div
                  v-for="participant in meetingsStore.meeting.participants"
                  :key="participant.id"
                  class="border border-solid border-1 hstack gap-3 py-2 px-4"
                >
                  <i class="bi bi-person-circle fs-5 opacity-50"></i>
                  <div class="hstack gap-2">
                    <p class="fw-bolder m-0">
                      {{ participant.firstname }} {{ participant.lastname }}
                    </p>
                  </div>
                </div>
                
              </div>
            </div>

            <div
              v-if="
                (updateState && meeting.creatorId == userStore.user.id) || // permission to update for creator
                (updateState && ['admin', 'coordinator'].includes(userStore.user.role)) // higher roles
              "
            >
              <div class="vstack gap-2" style="height: 300px">
                <div
                  class="mb-2 pb-2 border-bottom border-solid border-1 d-flex justify-content-between align-items-center"
                >
                  <p class="m-0">Participants</p>
                </div>
                <div class="ps-1 overflow-auto">
                  <div class="form-check" v-for="user in userStore.users" :key="user.id">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      :id="user.id"
                      :value="user.id"
                      v-model="meeting.participantsIds"
                      :checked="meeting.participantsIds.includes(user.id)"
                    />
                    <label :for="user.id" class="form-check-label"
                      ><div>
                        <p class="fw-bolder m-0">{{ user.firstname }} {{ user.lastname }}</p>
                        <p class="fw-light m-0">{{ user.email }}</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="!userStore.loading && !meetingsStore.loading">
            <div v-if="!updateState || (!updateState && ifPermissions)">
              <div
                class="mb-2 pb-2 border-bottom border-solid border-1 d-flex justify-content-between align-items-center"
              >
                <p class="m-0 p-0">Editors</p>
              </div>
              <div class="vstack gap-2 py-2">
                <div
                  v-for="id in meeting.editorsIds"
                  :key="id"
                  class="border border-solid border-1 hstack gap-3 py-2 px-4"
                >
                  <i class="bi bi-person-circle fs-5 opacity-50"></i>
                  <div class="hstack gap-2">
                    <p class="fw-bolder m-0">
                      {{ userStore.users.find((user) => user.id == id).firstname }} {{ userStore.users.find((user) => user.id == id).lastname }}
                    </p>
                  </div>
                </div>
                
              </div>
            </div>

            <div
              v-if="
                (updateState && meeting.creatorId == userStore.user.id) || // permission to update for creator
                (updateState && ['admin', 'coordinator'].includes(userStore.user.role)) // higher roles
              "
            >
              <div class="vstack gap-2" style="height: 300px">
                <div
                  class="mb-2 pb-2 border-bottom border-solid border-1 d-flex justify-content-between align-items-center"
                >
                  <p class="m-0">Editors</p>
                </div>
                <div class="ps-1 overflow-auto">
                  <div class="form-check" v-for="id in meeting.participantsIds" :key="id">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      :id="id"
                      :value="id"
                      v-model="meeting.editorsIds"
                      :checked="meeting.editorsIds.includes(id)"
                    />
                    <label :for="id" class="form-check-label"
                      ><div>
                        <p class="fw-bolder m-0">{{ userStore.users.find((user) => user.id == id).firstname }} {{ userStore.users.find((user) => user.id == id).lastname }}</p>
                        <p class="fw-light m-0">{{ userStore.users.find((user) => user.id == id).email }}</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Activity details -->
        <div class="vstack col-7">
          <p class="m-0 mx-5 mb-2 pb-2 border-bottom border-solid border-1">Meeting details</p>
          <MeetingDetails v-if="!updateState" :meeting="meetingsStore.meeting" />
          <div v-if="updateState" class="vstack gap-2 py-2 px-5">
            <form class="vstack gap-2">
              <div class="form-group">
                <label for="theme">Subject*</label>
                <input
                  id="subject"
                  type="text"
                  class="form-control"
                  placeholder="Enter meeting subject"
                  v-model="meeting.subject"
                />
              </div>
              <div class="form-group">
                <label for="notes">Notes</label>
                <textarea
                  id="notes"
                  type="text"
                  class="form-control"
                  placeholder="Any extra notes..."
                  rows="3"
                  v-model="meeting.notes"
                />
              </div>
              <!-- optional fields -->
              <p>*Required fields</p>
            </form>
          </div>
        </div>

        <!-- Images -->
        <div class="col col-3">
          <div class="vstack">
            <p class="m-0 mb-2 pb-2 border-bottom border-solid border-1">Images</p>
            <div v-if="meeting.images.length" class="mt-3 mb-3">
              <div v-for="(image, index) in meeting.images" :key="index">
                <div class="hstack gap-2 align-items-center mb-2">
                  <button
                    v-if="updateState"
                    class="btn btn-sm btn-outline-danger"
                    @click="removeImage(index)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                  <p class="m-0">{{ image.file ? image.file.name : image.originalName }}</p>
                </div>
              </div>
            </div>
            <div v-else>
              <p class="my-2 mb-3 p-0 opacity-50">This meeting has no images</p>
            </div>
            <div v-if="updateState" class="mb-2">
              <label for="imageInput" class="form-label">Upload images</label>
              <input
                ref="imageInput"
                type="file"
                class="form-control"
                accept="image/*"
                multiple
                @change="handleImageChange"
              />
            </div>

            <!-- Gallery modal -->
            <button
              type="button"
              class="btn btn-outline-primary"
              data-bs-toggle="modal"
              data-bs-target="#imageModal"
              v-if="meeting.images && meeting.images.length > 0"
            >
              View image gallery
            </button>
            <div
              class="modal fade"
              id="imageModal"
              tabindex="-1"
              aria-labelledby="imageModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog modal-dialog-centered modal-md">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="imageModalLabel">Image gallery</h5>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body">
                    <div
                      id="carouselExampleIndicators"
                      class="carousel slide"
                      data-bs-interval="false"
                    >
                      <!-- Indicators -->
                      <div class="carousel-indicators">
                        <button
                          v-for="(image, index) in meeting.images"
                          :key="index"
                          :data-bs-target="'#carouselExampleIndicators'"
                          :data-bs-slide-to="index"
                          :class="{ active: index === 0 }"
                          type="button"
                        ></button>
                      </div>

                      <!-- Slides -->
                      <div class="carousel-inner">
                        <div
                          v-for="(image, index) in meeting.images"
                          :key="index"
                          :class="{ 'carousel-item': true, active: index === 0 }"
                        >
                          <img
                            :src="image.url ? image.url : image.filepath"
                            class="d-block w-100"
                            :alt="image.alt"
                          />
                          <div class="carousel-caption d-none d-md-block">
                            <div class="bg-dark opacity-75 p-0 rounded-3">
                              <h5>{{ image.file ? image.file.name : image.originalName }}</h5>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Controls -->
                      <a
                        class="carousel-control-prev"
                        href="#carouselExampleIndicators"
                        role="button"
                        data-bs-slide="prev"
                      >
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                      </a>
                      <a
                        class="carousel-control-next"
                        href="#carouselExampleIndicators"
                        role="button"
                        data-bs-slide="next"
                      >
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-danger" v-if="meetingsStore.error">
              {{ meetingsStore.error }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, reactive, ref, unref, watchEffect } from 'vue'
import { useMeetingsStore } from '../../stores/meetings'
import { useUserStore } from '../../stores/user'
import { useRoute, useRouter } from 'vue-router'
import MeetingDetails from '../../components/MeetingDetails.vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minValue, helpers } from '@vuelidate/validators'

export default {
  components: { MeetingDetails },
  computed: {
    ifPermissions() {
      return this.meetingsStore.meeting.participants.find(
        (participant) => participant.id === this.userStore.user.id
      ).permissions.editor
    },
  },
  setup() {
    // let uploadedImages = ref([])
    const updateState = ref(false)
    const route = useRoute()
    const router = useRouter()
    const userStore = useUserStore()
    const meetingsStore = useMeetingsStore()
    let disableStartDate = ref(false)
    let disableEndDate = ref(false)
    let meeting = reactive({
      id: '',
      subject: '',
      participantsIds: [],
      editorsIds: [],
      notes: [],
      images: [],
      participantsIds: [],
      editorsIds: []
    })

    const rules = {
      subject: { required: helpers.withMessage(`subject cannot be empty`, required) }
    }

    const v$ = useVuelidate(rules, meeting)

    const reasignToReactiveMeeting = () => {
      meeting.id = meetingsStore.meeting.id
      meeting.subject = meetingsStore.meeting.subject
      meeting.participantsIds = meetingsStore.meeting.participants.map((p) => p.id)
      meeting.editorsIds = meetingsStore.meeting.participants.map((p) => {
        if (p.permissions.editor) return p.id
      })
      meeting.notes = meetingsStore.meeting.notes
    }

    onBeforeMount(async () => {
      await userStore.getAllUsers()
      await meetingsStore.fetchMeeting(route.params.meetingId)
      reasignToReactiveMeeting(meetingsStore.meeting)
    })

    const handleImageChange = (event) => {
      const files = Array.from(event.target.files)
      const newImages = files.map((file) => {
        const imageUrl = URL.createObjectURL(file)
        return { file, url: imageUrl }
      })
      meeting.images.push(...newImages)
    }

    const removeImage = (index) => meeting.images.splice(index, 1)

    const refreshPageData = async () => {
      updateState.value = false
      await meetingsStore.fetchMeeting(route.params.meetingId)
      reasignToReactiveMeeting(meetingsStore.meeting)
    }

    const handleSave = async () => {
      const isFormCorrect = await unref(v$).$validate()
      if (!isFormCorrect) return

      const meetingFormData = new FormData()
      Object.entries(meeting).forEach(
        ([key, value]) => value && meetingFormData.append(`${key}`, value)
      )
      meetingFormData.set('participantsIds', JSON.stringify(meeting.participantsIds))
      meetingFormData.set('editorsIds', JSON.stringify(meeting.editorsIds))
      meeting.images.forEach((image) => {
        meetingFormData.append('images', image.file)
      })

      await meetingsStore.updateMeeting(meetingFormData, route.params.meetingId)

      await refreshPageData()
    }

    return {
      userStore,
      handleImageChange,
      removeImage,
      updateState,
      meeting,
      v$,
      handleSave,
      router,
      disableStartDate,
      disableEndDate,
      meetingsStore,
      refreshPageData
    }
  }
}
</script>
