<template>
  <div class="row row-cols-2 g-3 py-2 px-5">
    <div class="col">
      <p class="fs-6 fw-bold mb-0 text-secondary text-uppercase">Start date</p>
      <p class="fs-6 m-0">{{ formatDate(activity.startDate) }}</p>
    </div>
    <div class="col">
      <p class="fs-6 fw-bold mb-0 text-secondary text-uppercase">End date</p>
      <p class="fs-6 m-0">
        {{ activity.endDate ? formatDate(activity.endDate) : 'Unfinished task' }}
      </p>
    </div>
    <div v-if="activity.reason" class="col">
      <p class="fs-6 fw-bold mb-0 text-secondary text-uppercase">Reason</p>
      <p class="fs-6 m-0">
        {{ activity.reason }}
      </p>
    </div>
    <div v-if="activity.goal" class="col">
      <p class="fs-6 fw-bold mb-0 text-secondary text-uppercase">Goal</p>
      <p class="fs-6 m-0">
        {{ activity.goal }}
      </p>
    </div>
    <div v-if="activity.result" class="col">
      <p class="fs-6 fw-bold mb-0 text-secondary text-uppercase">Result</p>
      <p class="fs-6 m-0">
        {{ activity.result }}
      </p>
    </div>
    <div v-if="activity.resources" class="col">
      <p class="fs-6 fw-bold mb-0 text-secondary text-uppercase">Resources</p>
      <p class="fs-6 m-0">
        {{ activity.resources }}
      </p>
    </div>
    <div v-if="activity.location" class="col">
      <p class="fs-6 fw-bold mb-0 text-secondary text-uppercase">Location</p>
      <p class="fs-6 m-0">
        {{ activity.location }}
      </p>
    </div>

    <div v-if="activity.notes" class="col">
      <p class="fs-6 fw-bold mb-0 text-secondary text-uppercase">Notes</p>
      <p class="fs-6 m-0">
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
      return date.toLocaleString('lt-LT').split(' ')[0]
    }
    return {
      formatDate
    }
  }
}
</script>
