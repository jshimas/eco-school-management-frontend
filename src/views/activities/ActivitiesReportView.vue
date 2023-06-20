<template>
  <div class="container mt-4 mb-5">
    <router-link
      class="align-self-start"
      :to="{ name: 'schoolActivities', params: { schoolId: userStore.user.schoolId } }"
    >
      <!-- Button trigger modal -->
      <button type="button" class="btn btn-light align-self-start mb-4">
        <i class="bi bi-arrow-left"></i> Back to activities
      </button>
    </router-link>
    <h1 class="mb-3">Activities report</h1>

    <div v-if="activitiesStore.loading" class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <!-- <div class="row mb-1">
      <div class="col-4">Activity</div>
      <div class="col-5">Images</div>
      <div class="col-3">Selected images</div>
    </div> -->
    <div
      class="row border border-solid border-1 p-3"
      v-if="!activitiesStore.loading"
      v-for="(activity, index) in activities"
      :key="index"
    >
      <div class="col-4 border-end">
        <span class="badge rounded-pill bg-success mb-2">{{ activity.theme }}</span>
        <h5 class="mb-3">{{ activity.name }}</h5>
        <p class="m-0">Finished at: {{ formatDate(activity.endDate) }}</p>
        <p class="m-0">Started at: {{ formatDate(activity.startDate) }}</p>
        <p class="m-0">
          Duration in days:
          {{ getDifferenceInDays(new Date(activity.endDate), new Date(activity.startDate)) }}
        </p>
      </div>
      <div class="col-5 border-end">
        <div class="row g-3">
          <div v-for="(image, i) in activity.images" :key="i" class="col-4">
            <div
              :class="['p-2 d-flex justify-content-center ', { 'bg-warning': image.marked }]"
              @click="markImage(activity, i)"
            >
              <img :src="image.filepath" class="card-img-top gallery-image" alt="Image" />
            </div>
          </div>
        </div>
      </div>
      <div class="col-2" v-if="activity.images && activity.images.some((i) => i.marked)">
        <div v-for="(image, i) in activityMarkedImages(activity)" :key="i">
          <h4>{{ image.originalName }}</h4>
        </div>
      </div>

      <!-- <button class="btn btn-primary mt-4" @click="showMarkedImages(activity)">
          Show Marked Images
        </button> -->
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useActivitiesStore } from '../../stores/activities'
import { useUserStore } from '../../stores/user'

export default {
  setup() {
    const activitiesStore = useActivitiesStore()
    const userStore = useUserStore()
    const activities = ref([])

    function markImage(activity, index) {
      activity.images[index].marked = !activity.images[index].marked
    }

    function showMarkedImages(activity) {
      activity.markedImages = activity.images
        .filter((image) => image.marked)
        .map((image) => image.originalName)
    }

    function formatDate(stringDate) {
      const date = new Date(stringDate)
      return date.toLocaleString('lt-LT').split(' ')[0]
    }

    function getDifferenceInDays(date1, date2) {
      const oneDay = 24 * 60 * 60 * 1000 // Number of milliseconds in a day
      const timeDiff = Math.abs(date2 - date1) // Get the absolute difference in milliseconds
      const diffDays = Math.round(timeDiff / oneDay) // Divide by the number of milliseconds in a day and round to the nearest whole number
      return diffDays
    }

    const activityMarkedImages = (activity) => activity.images.filter((i) => i.marked)

    onMounted(async () => {
      await activitiesStore.fetchUserActivities()
      await userStore.getMe()
      activities.value = activitiesStore.finished
    })

    return {
      userStore,
      activitiesStore,
      activities,
      markImage,
      showMarkedImages,
      activityMarkedImages,
      formatDate,
      getDifferenceInDays
    }
  }
}
</script>

<style>
.inner-border {
  box-shadow: inset 0 0 0 2px #000000;
}
.gallery-image {
  width: 140px;
  height: 140px;
  object-fit: cover;
}
</style>
