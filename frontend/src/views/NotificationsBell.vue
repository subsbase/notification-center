<template>
  <div class="clickable notification-bell" @click="fetchAllNotifications()">
    <div class="py-5 px-5 pos-relative">
      <span class="notification-count">{{ notificationCount }}</span>
      <img class="clickable top-1" src="../assets/notification.png" />
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted } from 'vue'
import { getAllNotifications } from '@/services/notifications'
import { io } from 'socket.io-client'

import { getSubscriberId, getRealmHeader } from '../utils.js'

const notificationCount = ref(0)
const subscriberID = ref('')

const socket = io(process.env.VUE_APP_SERVER_BASE_URL, {
  extraHeaders: {
    'x-realm': getRealmHeader()
  },
  path: '/notifc/socket'
})
socket.on('connect', function () {
  socket.emit('joinGroup', subscriberID.value)
})
socket.on('notification', function () {
  fetchAllNotifications()
})

socket.on('NotificationRead', function () {
  fetchAllNotifications()
})

socket.on('NotificationsRead', function () {
  fetchAllNotifications()
})

socket.on('NotificationArchived', function () {
  fetchAllNotifications()
})

onBeforeMount(() => {
  subscriberID.value = getSubscriberId()
  fetchAllNotifications()
})
onMounted(() => {
  const height = document.body.offsetHeight
  window.parent.postMessage({ height }, '*')
})

const fetchAllNotifications = () => {
  getAllNotifications(subscriberID.value)
    .then((res) => {
      notificationCount.value = res.filter((notification) => !notification.read).length
    })
    .catch((err) => {
      console.error(err)
    })
}
</script>
