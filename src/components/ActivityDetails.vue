<template>
  <div class="vstack gap-2 py-2 px-5">
    <div class="vstack">
      <p class="fs-6 fw-bold mb-0 text-secondary text-uppercase">Start date</p>
      <p class="fs-6">{{ formatDate(activity.startDate) }}</p>
    </div>
    <div class="vstack gap-0">
      <p class="fs-6 fw-bold mb-0 text-secondary text-uppercase">End date</p>
      <p class="fs-6">
        {{ activity.endDate ? formatDate(activity.endDate) : 'Unfinished task' }}
      </p>
    </div>
    <div v-if="activity.reason" class="vstack gap-0">
      <p class="fs-6 fw-bold mb-0 text-secondary text-uppercase">Motive</p>
      <p class="fs-6">
        {{ activity.reason }}
      </p>
    </div>
    <div v-if="activity.goal" class="vstack gap-0">
      <p class="fs-6 fw-bold mb-0 text-secondary text-uppercase">Goal</p>
      <p class="fs-6">
        {{ activity.goal }}
      </p>
    </div>
    <div v-if="activity.result" class="vstack gap-0">
      <p class="fs-6 fw-bold mb-0 text-secondary text-uppercase">Result</p>
      <p class="fs-6">
        {{ activity.result }}
      </p>
    </div>
    <div v-if="activity.resources" class="vstack gap-0">
      <p class="fs-6 fw-bold mb-0 text-secondary text-uppercase">Resources</p>
      <p class="fs-6">
        {{ activity.resources }}
      </p>
    </div>
    <div v-if="activity.location" class="vstack gap-0">
      <p class="fs-6 fw-bold mb-0 text-secondary text-uppercase">Location</p>
      <p class="fs-6">
        {{ activity.location }}
      </p>
    </div>

    <div v-if="activity.notes" class="vstack gap-0">
      <p class="fs-6 fw-bold mb-0 text-secondary text-uppercase">Notes</p>
      <p class="fs-6">
        {{ activity.notes }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActivityDetails',
  props: ['activity'],
  setup() {
    const formatDate = (stringDate) => {
      const date = new Date(stringDate)
      return date.toLocaleString('en-US')
    }
    return {
      formatDate
    }
  }
}
</script>
