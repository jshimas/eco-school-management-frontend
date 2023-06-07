import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ProjectView from '../views/ProjectView.vue'
import ActivitiesView from '../views/activities/ActivitiesView.vue'
import MeetingsView from '../views/meetings/MeetingsView.vue'
import UserProfileView from '../views/users/UserProfileView.vue'
import { useUserStore } from '../stores/user'
import VueCookies from 'vue-cookies'

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
      component: LoginView
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
