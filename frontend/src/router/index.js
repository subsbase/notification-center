import { createWebHistory, createRouter } from 'vue-router'
import NotificationsPopup from '@/views/NotificationsPopup.vue'
import NotificationsIndex from '@/views/NotificationsIndex.vue'
import NotificationsIcon from '@/views/NotificationsIcon.vue'

const routes = [
  {
    path: '/',
    name: 'NotificationsPopup',
    component: NotificationsPopup
  },
  {
    path: '/notificationsIndex',
    name: 'NotificationsIndex',
    component: NotificationsIndex
  },
  {
    path: '/notificationsIcon',
    name: 'NotificationsIcon',
    component: NotificationsIcon
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
