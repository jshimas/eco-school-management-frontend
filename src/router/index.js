import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ProjectView from '../views/ProjectView.vue'
import ActivitiesView from '../views/activities/ActivitiesView.vue'
import MeetingsView from '../views/meetings/MeetingsView.vue'
import UserProfileView from '../views/users/UserProfileView.vue'
import CreateActivityView from '../views/activities/CreateActivityView.vue'
import ActivityView from '../views/activities/ActivityView.vue'
import CreateUserView from '../views/users/CreateUserView.vue'
import UsersView from '../views/users/UsersView.vue'
import CreatePasswordView from '../views/users/CreatePasswordView.vue'
import CreateMeetingsView from '../views/meetings/CreateMeetingView.vue'
import MeetingView from '../views/meetings/MeetingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        hideNavbar: true
      }
    },
    {
      path: '/users/create-password',
      name: 'createPassword',
      component: CreatePasswordView,
      meta: {
        hideNavbar: true
      }
    },
    {
      path: '/users/:userId',
      name: 'userProfile',
      component: UserProfileView,
      meta: { requiresAuth: true }
    },
    {
      path: '/schools/:schoolId',
      name: 'schoolProject',
      component: ProjectView,
      meta: { requiresAuth: true }
    },
    {
      path: '/schools/:schoolId/activities',
      name: 'schoolActivities',
      component: ActivitiesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/schools/:schoolId/meetings',
      name: 'schoolMeetings',
      component: MeetingsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/schools/:schoolId/meetings/create',
      name: 'createMeeting',
      component: CreateMeetingsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/schools/:schoolId/meetings/:meetingId',
      name: 'meeting',
      component: MeetingView,
      meta: { requiresAuth: true }
    },
    {
      path: '/schools/:schoolId/activities/create',
      name: 'createActivity',
      component: CreateActivityView,
      meta: { requiresAuth: true }
    },
    {
      path: '/schools/:schoolId/activities/:activityId',
      name: 'activity',
      component: ActivityView,
      meta: { requiresAuth: true }
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
      meta: { requiresAuth: true }
    },
    {
      path: '/users/create',
      name: 'createUser',
      component: CreateUserView,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  if (to.name !== 'login' && !userStore.user) {
    await userStore.getMe()
    if (!userStore.user) {
      next({ name: 'login' })
    } else {
      next()
    }
  } else next()
})

export default router
