import { createWebHistory, createRouter } from 'vue-router'
import NotificationsPopup from '@/views/NotificationsPopup.vue'
import NotificationsIndex from '@/views/NotificationsIndex.vue'
import NotificationsBell from '@/views/NotificationsBell.vue'

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
    path: '/notificationsBell',
    name: 'NotificationsBell',
    component: NotificationsBell
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
