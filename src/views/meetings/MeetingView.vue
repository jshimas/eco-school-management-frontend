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
        <span
          v-if="!meeting.endTime && new Date(meeting.startTime) > new Date()"
          class="badge rounded-pill bg-warning"
          >To be held</span
        >
        <span
          v-if="!meeting.endTime && new Date(meeting.startTime) <= new Date()"
          class="badge rounded-pill bg-success"
          >In progress</span
        >
        <span v-if="meeting.endTime" class="badge rounded-pill bg-dark">Finished</span>
        <div class="hstack gap-3">
          <h2 class="mb-0">{{ meeting.subject }}</h2>

          <!-- Finish and edit details buttons -->
          <div
            class="ms-auto hstack gap-2"
            v-if="!updateState && !meeting.endTime && userWithPermissions"
          >
            <button
              v-if="new Date(meeting.startTime) <= new Date()"
              type="button"
              class="btn btn-outline-success"
              data-bs-toggle="modal"
              data-bs-target="#finishMeetingModal"
            >
              <i class="bi bi-check-all"></i> FINISH
            </button>
            <div
              class="modal fade"
              id="finishMeetingModal"
              tabindex="-1"
              aria-labelledby="finishMeetingModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="finishMeetingModalLabel">
                      Are you sure you want to finish the meeting?
                    </h5>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body">
                    After finishing the meeting you won't be able to edit it.
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                      Close
                    </button>
                    <button
                      type="button"
                      class="btn btn-success"
                      data-bs-dismiss="modal"
                      @click.prevent="handleFinish"
                    >
                      Finish it
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <button class="btn btn-outline-primary" @click.prevent="updateState = !updateState">
              <i class="bi bi-pen"></i> Edit details
            </button>
          </div>

          <!-- Cancel and save buttons -->
          <div v-if="updateState" class="hstack gap-2 ms-auto">
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

      <div class="row g-1">
        <!-- participants -->
        <div class="vstack col-2 gap-3">
          <div
            v-if="userStore.loading || meetingsStore.loading"
            class="spinner-border text-primary"
            role="status"
          >
            <span class="visually-hidden">Loading...</span>
          </div>
          <div v-if="!userStore.loading && !meetingsStore.loading">
            <div v-if="!updateState">
              <div
                class="mb-2 pb-2 border-bottom border-solid border-1 d-flex justify-content-between align-items-center"
              >
                <p class="m-0 p-0">Participants</p>
              </div>
              <div class="vstack gap-2 py-2">
                <div
                  v-for="participant in meeting.participants"
                  :key="participant.id"
                  class="border border-solid border-1 hstack gap-3 py-2 px-3"
                >
                  <i class="bi bi-person-circle fs-5 opacity-50"></i>
                  <div class="hstack gap-2">
                    <p class="fw-bolder m-0">
                      {{ participant.firstname }} {{ participant.lastname }}
                    </p>
                  </div>
                  <i
                    v-if="meeting.editorsIds?.includes(participant.id)"
                    class="bi bi-pen ms-auto opacity-50"
                  ></i>
                </div>
              </div>
            </div>

            <div v-if="updateState && userWithPermissions">
              <div class="vstack gap-2" style="height: 250px">
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
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Editors -->
          <div v-if="!userStore.loading && !meetingsStore.loading">
            <div v-if="updateState && ['admin', 'coordinator'].includes(userStore.user.role)">
              <div class="vstack gap-2" style="height: 300px">
                <div
                  class="mb-2 pb-2 border-bottom border-solid border-1 d-flex justify-content-between align-items-center"
                >
                  <p class="m-0">Editors</p>
                </div>
                <div class="ps-1 overflow-auto">
                  <div class="form-check" v-for="user in userStore.users" :key="user.id">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      :id="user.id"
                      :value="user.id"
                      v-model="meeting.editorsIds"
                      :checked="meeting.editorsIds?.includes(user.id)"
                    />
                    <label :for="user.id" class="form-check-label"
                      ><div>
                        <p class="fw-bolder m-0">{{ user.firstname }} {{ user.lastname }}</p>
                        <!-- <p class="fw-light m-0">{{ user.email }}</p> -->
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Meeting details -->
        <div class="vstack col-8">
          <p class="m-0 mx-5 mb-2 pb-2 border-bottom border-solid border-1">Meeting details</p>
          <MeetingDetails
            v-if="!updateState && !meetingsStore.loading"
            :meeting="meetingsStore.meeting"
          />
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
              <label for="notes">Notes</label>
              <TiptapEditor v-model:content="meeting.notes"></TiptapEditor>
              <p>*Required fields</p>
            </form>
          </div>
        </div>

        <!-- Images -->
        <div class="col col-2">
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
import { onBeforeMount, reactive, ref, unref } from 'vue'
import { useMeetingsStore } from '../../stores/meetings'
import { useUserStore } from '../../stores/user'
import { useRoute, useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, minValue, helpers } from '@vuelidate/validators'
import MeetingDetails from '../../components/MeetingDetails.vue'
import TiptapEditor from '../../components/text-editor/TiptapEditor.vue'

export default {
  components: { MeetingDetails, TiptapEditor },
  setup() {
    const updateState = ref(false)
    const route = useRoute()
    const router = useRouter()
    const userStore = useUserStore()
    const meetingsStore = useMeetingsStore()
    let disableStartDate = ref(false)
    let disableEndDate = ref(false)
    const userWithPermissions = ref(false)
    let meeting = reactive({
      id: '',
      subject: '',
      participantsIds: [],
      editorsIds: [],
      participants: [],
      notes: '',
      images: []
    })

    const rules = {
      subject: { required: helpers.withMessage(`subject cannot be empty`, required) }
    }

    const v$ = useVuelidate(rules, meeting)

    const reasignToReactiveMeeting = (fetchedMeeting) => {
      Object.entries(fetchedMeeting).forEach(([key, value]) => (meeting[key] = value))
      meeting.participantsIds = fetchedMeeting.participants.map((p) => p.id)
      meeting.editorsIds = fetchedMeeting.participants.reduce(
        (acc, p) => (p.permissions.editor ? [...acc, p.id] : acc),
        []
      )
    }

    onBeforeMount(async () => {
      await userStore.getAllUsers()
      await meetingsStore.fetchMeeting(route.params.meetingId)
      reasignToReactiveMeeting(meetingsStore.meeting)
      userWithPermissions.value =
        userStore.user.role !== 'member' || meeting.editorsIds.includes(userStore.user.id)
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
      let oldImagesIds = meeting.images.reduce(
        (acc, image) => (image.filepath ? [...acc, image.id] : acc), // if it has filepath, it means that it has been somewhere stored
        []
      )
      meetingFormData.set('oldImagesIds', JSON.stringify(oldImagesIds))
      meeting.images.forEach((image) => {
        meetingFormData.append('images', image.file)
      })

      await meetingsStore.updateMeeting(meetingFormData)

      await refreshPageData()
    }

    const handleFinish = async () => {
      const meetingFormData = new FormData()
      meetingFormData.append('id', meeting.id)
      meetingFormData.append('endTime', new Date())
      await meetingsStore.updateMeeting(meetingFormData)
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
      refreshPageData,
      handleFinish,
      userWithPermissions
    }
  }
}
</script>
