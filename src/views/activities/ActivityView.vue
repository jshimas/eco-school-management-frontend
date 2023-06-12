<template>
  <div class="container mt-4 mb-5 d-flex flex-column align-items-center">
    <router-link
      class="align-self-start mb-4"
      :to="{ name: 'schoolActivities', params: { schoolId: userStore.user.schoolId } }"
    >
      <!-- Button trigger modal -->
      <button
        type="button"
        class="btn btn-light align-self-start"
        data-bs-toggle="modal"
        data-bs-target="#modal"
      >
        <i class="bi bi-arrow-left"></i> Back to activities
      </button>
    </router-link>
    <div
      v-if="activitiesStore.loading && updateState"
      class="spinner-border text-primary"
      role="status"
    >
      <span class="visually-hidden">Loading...</span>
    </div>

    <div v-if="!activitiesStore.loading" class="col-12">
      <div class="mb-4">
        <h2 class="mb-0">{{ activity.name }}</h2>
        <div class="hstack gap-2">
          <span class="badge rounded-pill bg-primary" style="font-size: 16px">{{
            activity.theme
          }}</span>
          <span
            v-if="activity.approved"
            class="badge rounded-pill bg-success"
            style="font-size: 16px"
          >
            Approved</span
          >
          <span
            v-if="!activity.approved"
            class="badge rounded-pill bg-secondary"
            style="font-size: 16px"
            >Waiting for approval</span
          >
          <span
            v-if="activity.approved && activity.endDate && new Date(activity.endDate) <= new Date()"
            class="badge rounded-pill bg-dark"
            style="font-size: 16px"
          >
            Finished</span
          >
          <div class="ms-auto">
            <button
              v-if="
                (!updateState && activity.creatorId == userStore.user.id) || // permission to update for creator
                (!updateState && ['admin', 'coordinator'].includes(userStore.user.role)) || // higher roles
                (!updateState && activity.supervisorsIds.includes(userStore.user.id)) // if a user is a supervisor
              "
              class="btn btn-outline-primary"
              @click.prevent="updateState = !updateState"
            >
              <i class="bi bi-pen"></i> Edit execution details
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
            v-if="userStore.loading || activitiesStore.loading"
            class="spinner-border text-primary"
            role="status"
          >
            <span class="visually-hidden">Loading...</span>
          </div>
          <div v-if="!userStore.loading && !activitiesStore.loading">
            <div
              v-if="
                !updateState ||
                (updateState &&
                  activity.supervisorsIds.includes(userStore.user.id) &&
                  !['admin', 'coordinator'].includes(userStore.user.role) &&
                  activity.creatorId != userStore.user.id)
              "
            >
              <div
                class="mb-2 pb-2 border-bottom border-solid border-1 d-flex justify-content-between align-items-center"
              >
                <p class="m-0 p-0">Supervisors</p>
              </div>
              <div class="vstack gap-2 py-2">
                <div
                  v-for="supervisor in activity.supervisors"
                  :key="supervisor.id"
                  class="border border-solid border-1 hstack gap-3 py-2 px-4"
                >
                  <i class="bi bi-person-circle fs-5 opacity-50"></i>
                  <div class="hstack gap-2">
                    <p class="fw-bolder m-0">
                      {{ supervisor.firstname }} {{ supervisor.lastname }}
                    </p>
                  </div>
                  <i
                    v-if="supervisor.id === activity.creatorId"
                    class="bi bi-star-fill ms-auto opacity-50"
                  ></i>
                </div>
              </div>
            </div>

            <div
              v-if="
                (updateState && activity.creatorId == userStore.user.id) || // permission to update for creator
                (updateState && ['admin', 'coordinator'].includes(userStore.user.role)) // higher roles
              "
            >
              <div class="vstack gap-2" style="height: 300px">
                <div
                  class="mb-2 pb-2 border-bottom border-solid border-1 d-flex justify-content-between align-items-center"
                >
                  <p class="m-0">Supervisors</p>
                </div>
                <div class="ps-1 overflow-auto">
                  <div class="form-check" v-for="user in userStore.users" :key="user.id">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      :id="user.id"
                      :value="user.id"
                      v-model="activity.supervisorsIds"
                      :checked="activity.supervisorsIds.includes(user.id)"
                      :disabled="user.id === activity.creatorId"
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
        </div>

        <!-- Activity details -->
        <div class="vstack col-7">
          <p class="m-0 mx-5 mb-2 pb-2 border-bottom border-solid border-1">Activity details</p>
          <ActivityDetails v-if="!updateState" :activity="activitiesStore.activity" />
          <div v-if="updateState" class="vstack gap-2 py-2 px-5">
            <form class="vstack gap-2">
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
                  :disabled="disableStartDate"
                />
                <div v-for="error of v$.startDate.$errors" :key="error.$uid">
                  <div class="text-danger">{{ error.$message }}</div>
                </div>
              </div>

              <!-- optional fields -->
              <div>
                <div class="vstack gap-2" id="optional-fields">
                  <div class="form-group">
                    <label for="startDate">End Date</label>
                    <input
                      id="startDate"
                      type="date"
                      class="form-control"
                      placeholder="Enter activity start date"
                      v-model="activity.endDate"
                    />
                    <div v-for="error of v$.endDate.$errors" :key="error.$uid">
                      <div class="text-danger">{{ error.$message }}</div>
                    </div>
                  </div>
                  <div class="form-group">
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
                    <textarea
                      id="notes"
                      type="text"
                      class="form-control"
                      placeholder="Any extra notes..."
                      rows="3"
                      v-model="activity.notes"
                    />
                  </div>
                </div>
              </div>
              <p>*Required fields</p>
            </form>
          </div>
        </div>

        <!-- Images -->
        <div class="col col-3">
          <div class="vstack">
            <p class="m-0 mb-2 pb-2 border-bottom border-solid border-1">Images</p>
            <div v-if="activity.images.length" class="mt-3 mb-3">
              <div v-for="(image, index) in activity.images" :key="index">
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
              <p class="my-2 mb-3 p-0 opacity-50">This activity has no images</p>
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
              v-if="activity.images && activity.images.length > 0"
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
                          v-for="(image, index) in activity.images"
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
                          v-for="(image, index) in activity.images"
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
            <div class="text-danger" v-if="activitiesStore.error">
              {{ activitiesStore.error }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, reactive, ref, unref, watchEffect } from 'vue'
import { useActivitiesStore } from '../../stores/activities'
import { useUserStore } from '../../stores/user'
import { useRoute, useRouter } from 'vue-router'
import ActivityDetails from '../../components/ActivityDetails.vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minValue, helpers } from '@vuelidate/validators'

export default {
  components: { ActivityDetails },
  setup() {
    // let uploadedImages = ref([])
    const updateState = ref(false)
    const route = useRoute()
    const router = useRouter()
    const activitiesStore = useActivitiesStore()
    const userStore = useUserStore()
    let disableStartDate
    let activity = reactive({
      theme: '',
      name: '',
      location: '',
      startDate: '',
      endDate: '',
      supervisorsIds: [],
      images: [],
      oldImagesIds: [],
      reason: '',
      goal: '',
      result: '',
      resources: '',
      notes: '',
      creatorId: ''
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
      endDate: {
        minValue: helpers.withMessage(
          'End date must be after or equal the start date',
          (value, { startDate }) => !value || new Date(value) >= new Date(startDate)
        )
      }
    }

    const v$ = useVuelidate(rules, activity)

    const reasignToReactiveActivity = (fetchedActivity) => {
      Object.entries(fetchedActivity).forEach(([key, value]) => (activity[key] = value))
      activity.supervisorsIds = fetchedActivity.supervisors.map((s) => s.id)
      activity.startDate = new Date(activity.startDate).toISOString().slice(0, 10)
      activity.endDate = activity.endDate
        ? new Date(activity.endDate).toISOString().slice(0, 10)
        : null
    }

    onBeforeMount(async () => {
      await activitiesStore.fetchActivity(route.params.activityId)
      await userStore.getAllUsers()
      reasignToReactiveActivity(activitiesStore.activity)
      disableStartDate = activity.approved && new Date(activity.startDate) < new Date()
    })

    const handleImageChange = (event) => {
      const files = Array.from(event.target.files)
      const newImages = files.map((file) => {
        const imageUrl = URL.createObjectURL(file)
        return { file, url: imageUrl }
      })
      activity.images.push(...newImages)
    }

    const removeImage = (index) => activity.images.splice(index, 1)

    const refreshPageData = async () => {
      await activitiesStore.fetchActivity(route.params.activityId)
      reasignToReactiveActivity(activitiesStore.activity)
      updateState.value = false
    }

    const handleSave = async () => {
      const isFormCorrect = await unref(v$).$validate()
      if (!isFormCorrect) return

      const activityFormData = new FormData()
      Object.entries(activity).forEach(
        ([key, value]) => value && activityFormData.append(`${key}`, value)
      )
      activityFormData.delete('images')
      activityFormData.set('supervisorsIds', JSON.stringify(activity.supervisorsIds))
      let oldImagesIds = activity.images.reduce(
        (acc, image) => (image.filepath ? [...acc, image.id] : acc),
        []
      )
      activityFormData.set('oldImagesIds', JSON.stringify(oldImagesIds))
      activity.images.forEach((image) => {
        activityFormData.append('images', image.file)
      })

      await activitiesStore.updateActivity(activityFormData)

      await refreshPageData()
    }

    return {
      userStore,
      activitiesStore,
      handleImageChange,
      removeImage,
      updateState,
      activity,
      v$,
      handleSave,
      router,
      disableStartDate
    }
  }
}
</script>
