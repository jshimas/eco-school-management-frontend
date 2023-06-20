<template>
  <div class="row row-cols-2 g-3 py-2 px-5" v-if="meeting">
    <div class="col">
      <p class="fs-6 fw-bold mb-0 text-secondary text-uppercase">Start date | Time</p>
      <p class="fs-6 m-0">{{ formatDate(meeting.date) }} | {{ formatTime(meeting.startTime) }}</p>
    </div>
    <div class="col">
      <p class="fs-6 fw-bold mb-0 text-secondary text-uppercase">End Time</p>
      <p class="fs-6 m-0">
        {{ meeting.endTime ? formatDate(meeting.endTime) : 'Not finished' }}
      </p>
    </div>
    <div class="col">
      <p class="fs-6 fw-bold mb-0 text-secondary text-uppercase">Place</p>
      <p class="fs-6 m-0">
        {{ meeting.place }}
      </p>
    </div>
    <div class="col-12">
      <p class="fs-12 fw-bold mb-0 text-secondary text-uppercase border-bottom pb-2 mb-4">Notes</p>
      <p
        class="fs-12 m-0"
        v-if="meeting.notes"
        v-html="meeting.notes || 'Edit the meeting to add some notes...'"
      ></p>
      <p class="fs-12 m-0 opacity-50" v-else>Edit the meeting to add some notes...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MeetingDetails',
  props: ['meeting'],
  setup() {
    const formatDate = (stringDate) => {
      const date = new Date(stringDate)
      return date.toLocaleString('lt-LT').split(' ')[0]
    }

    function formatTime(time) {
      return time.split('T')[1].split(':').slice(0, 2).join('h')
    }

    return {
      formatDate,
      formatTime
    }
  }
}
</script>
<style>
blockquote {
  border-left: 3px solid #ddd;
  padding-left: 1rem;
}
</style>
