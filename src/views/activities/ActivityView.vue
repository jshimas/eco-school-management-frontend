<template>
  <div class="container mt-4 mb-5 d-flex flex-column align-items-center">
    <div v-if="activitiesStore.loading" class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div v-if="!activitiesStore.loading" class="col-10">
      <div class="mb-4">
        <h5 class="align-self-start mb-0">Activity</h5>
        <h2 class="mb-0">{{ activitiesStore.activity.name }}</h2>
        <div class="hstack gap-2">
          <span class="badge rounded-pill bg-primary">{{ activitiesStore.activity.theme }}</span>
          <span v-if="activitiesStore.activity.approved" class="badge rounded-pill bg-success"
            >Approved</span
          >
          <span v-else class="badge rounded-pill bg-secondary">Waiting for approval</span>
          <div class="form-check form-switch ms-auto">
            <input
              class="form-check-input"
              type="checkbox"
              id="edit"
              @change="updateSupervisors = !updateSupervisors"
            />
            <label class="form-check-label" for="flexSwitchCheckDefault">Edit</label>
          </div>
        </div>
      </div>

      <!-- supervisors -->
      <div class="row g-2">
        <div class="vstack col-2">
          <div v-if="!updateSupervisors">
            <div
              class="mb-2 pb-2 border-bottom border-solid border-1 d-flex justify-content-between align-items-center"
            >
              <p class="m-0 p-0">Supervisors</p>
            </div>
            <div class="vstack gap-2 py-2">
              <div
                v-for="supervisor in activitiesStore.activity.supervisors"
                :key="supervisor.id"
                class="border border-solid border-1 hstack gap-3 py-2 px-4"
              >
                <i class="bi bi-person-circle fs-3 opacity-50"></i>
                <div>
                  <p class="fw-bolder m-0">{{ supervisor.firstname }} {{ supervisor.lastname }}</p>
                  <p class="fw-light m-0">{{ supervisor.email }}</p>
                </div>
                <i
                  v-if="supervisor.id === activitiesStore.activity.creatorId"
                  class="bi bi-star-fill ms-auto opacity-50"
                ></i>
              </div>
            </div>
          </div>

          <div v-if="updateSupervisors">
            <div v-if="userStore.loading" class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <div v-if="!userStore.loading" class="vstack gap-2" style="height: 300px">
              <div
                class="mb-2 pb-2 border-bottom border-solid border-1 d-flex justify-content-between align-items-center"
              >
                <p class="m-0">Change supervisors</p>
              </div>
              <div class="ps-1 overflow-auto">
                <div class="form-check" v-for="user in userStore.users" :key="user.id">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    :id="user.id"
                    :value="user.id"
                    :checked="checkSupervisor(user.id)"
                    :disabled="user.id === activitiesStore.activity.creatorId"
                  />
                  <label :for="user.id" class="form-check-label"
                    ><div>
                      <p class="fw-bolder m-0">{{ user.firstname }} {{ user.lastname }}</p>
                      <p class="fw-light m-0">{{ user.email }}</p>
                    </div>
                  </label>
                </div>
                <div class="d-flex gap-2 justify-content-center mt-3">
                  <button
                    class="btn btn-outline-secondary"
                    @click.prevent="updateSupervisors = false"
                  >
                    Cancel
                  </button>
                  <button
                    class="btn btn-primary flex-fill"
                    @click.prevent="updateSupervisors = false"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Activity details -->
        <div class="vstack col-4">
          <p class="m-0 mx-5 mb-2 pb-2 border-bottom border-solid border-1">Activity details</p>
          <ActivityDetails :activity="activitiesStore.activity" />
        </div>

        <!-- Images -->
        <div class="vstack col-2">
          <p class="m-0 mb-2 pb-2 border-bottom border-solid border-1">Images</p>
          <div v-if="uploadedImages.length" class="mt-3 mb-3">
            <div v-for="(image, index) in uploadedImages" :key="index">
              <div class="hstack gap-2 align-items-center mb-2">
                <button
                  v-if="updateSupervisors"
                  class="btn btn-sm btn-outline-danger"
                  @click="removeImage(index)"
                >
                  <i class="bi bi-trash"></i>
                </button>
                <p class="m-0">{{ image.file.name }}</p>
              </div>
            </div>
          </div>
          <div v-else>
            <p class="my-2 mb-3 p-0 opacity-50">This activity has no images</p>
          </div>
          <div v-if="updateSupervisors" class="mb-2">
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
            <div class="modal-dialog modal-dialog-centered modal-sm">
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
                        v-for="(image, index) in uploadedImages"
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
                        v-for="(image, index) in uploadedImages"
                        :key="index"
                        :class="{ 'carousel-item': true, active: index === 0 }"
                      >
                        <img :src="image.url" class="d-block w-100" :alt="image.alt" />
                        <div class="carousel-caption d-none d-md-block">
                          <div class="bg-dark opacity-75 p-0 rounded-3">
                            <h5>{{ image.file.name }}</h5>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useActivitiesStore } from '../../stores/activities'
import { useUserStore } from '../../stores/user'
import { useRoute } from 'vue-router'
import { onBeforeMount } from 'vue'
import ActivityDetails from '../../components/ActivityDetails.vue'

export default {
  components: { ActivityDetails },
  setup() {
    const uploadedImages = ref([])
    const updateSupervisors = ref(false)
    const route = useRoute()
    const activitiesStore = useActivitiesStore()
    const userStore = useUserStore()
    let supervisorsIds = []

    onBeforeMount(async () => {
      await activitiesStore.fetchActivity(route.params.activityId)
      console.log(userStore.users)
      if (!userStore.users) {
        await userStore.getAllUsers()
      }
      supervisorsIds = activitiesStore.activity.supervisors.map((s) => s.id)
      console.log(supervisorsIds.includes(58))
      console.log(supervisorsIds.includes(60))
      console.log(supervisorsIds.includes(582))
    })

    const checkSupervisor = (userId) => supervisorsIds.includes(userId)

    const handleImageChange = (event) => {
      const files = Array.from(event.target.files)
      const newImages = files.map((file) => {
        const imageUrl = URL.createObjectURL(file)
        return { file, url: imageUrl }
      })
      uploadedImages.value.push(...newImages)
    }

    const removeImage = (index) => {
      uploadedImages.value.splice(index, 1)
    }

    return {
      uploadedImages,
      userStore,
      activitiesStore,
      handleImageChange,
      removeImage,
      checkSupervisor,
      updateSupervisors
    }
  }
}
</script>
