<template>
  <div class="container mt-4">
    <h1>Image Marking</h1>

    <div v-for="(activity, index) in activities" :key="index">
      <h2>{{ activity.name }}</h2>
      <div class="row">
        <div v-for="(image, i) in activity.images" :key="i" class="col-md-4 mt-4">
          <div :class="['card', { 'bg-primary': image.marked }]" @click="markImage(activity, i)">
            <img :src="image.filepath" class="card-img-top" alt="Image" />
            <div class="card-body">
              <p class="card-text">{{ image.originalName }}</p>
            </div>
          </div>
        </div>
      </div>
      <button class="btn btn-primary mt-4" @click="showMarkedImages(activity)">
        Show Marked Images
      </button>
      <div class="mt-4" v-if="activity.markedImages.length > 0">
        <h3>Marked Images:</h3>
        <ul>
          <li v-for="(name, i) in activity.markedImages" :key="i">{{ name }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useActivitiesStore } from '../../stores/activities'

export default {
  setup() {
    const activitiesStore = useActivitiesStore()
    const activities = ref([])

    function markImage(activity, index) {
      activity.images[index].marked = !activity.images[index].marked
    }

    function showMarkedImages(activity) {
      activity.markedImages = activity.images
        .filter((image) => image.marked)
        .map((image) => image.name)
    }

    onMounted(() => {
      activitiesStore.fetchUserActivities()
      activities.value = activitiesStore.activities
    })

    return {
      activities,
      markImage,
      showMarkedImages
    }
  }
}
</script>
