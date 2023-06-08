<template>
  <div class="container mt-5">
    <h1>Create Activity</h1>

    <div class="container d-flex justify-content-start">
      <form class="w-100">
        <div class="form-group">
          <label>Theme</label>
          <input
            type="text"
            class="form-control"
            placeholder="Enter activity theme"
            v-model="activity.theme"
          />
        </div>
        <div class="form-group">
          <label>Name</label>
          <input
            type="text"
            class="form-control"
            placeholder="Enter activity name"
            v-model="activity.name"
          />
        </div>
        <div class="form-group">
          <label>Location</label>
          <input
            type="text"
            class="form-control"
            placeholder="Enter activity location"
            v-model="activity.location"
          />
        </div>
        <div class="form-group">
          <label>Start Date</label>
          <input
            type="date"
            class="form-control"
            placeholder="Enter activity location"
            v-model="activity.startDate"
          />
        </div>
        <select
          v-model="activity.supervisorsIds"
          class="form-select"
          multiple
          aria-label="multiple select example"
        >
          <option v-for="(item, i) in userStore.users" :value="item.id" :key="i">
            {{ item.name }}
          </option>
        </select>
        <button @click="createActivity" class="btn btn-success">Create</button>
      </form>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, ref } from 'vue'
import { useActivitiesStore } from '../../stores/activities'
import { useUserStore } from '../../stores/user'

export default {
  components: {},
  methods: {
      createActivity: async () => {
        const res = await activitiesStore.createActivity(activity)
        if (res) {
          console.log(res)
          //router.push({ name: 'activities' })
        }
      }
    }
  ,
  setup() {
    const activitiesStore = useActivitiesStore()
    const userStore = useUserStore()
    const activity = {
      theme: '',
      name: '',
      location: '',
      startDate: '',
      supervisorsIds: []
    }

    /* onBeforeMount(async () => {
      if (userStore.users.length === 0) {
        await userStore.getAllUsers()
      }
    }) */

    /* const createActivity = async () => {
      const res = await activitiesStore.createActivity(activity)
      if (res) {
        console.log(res);
        //router.push({ name: 'activities' })
      }
    } */

    

    return {
      activitiesStore,
      activity,
      userStore,
    }
  }
}
</script>
