<template>
  <div class="clickable notification-bell" @click="fetchAllNotifications()">
    <div class="py-5 px-5 pos-relative">
      <span v-if="notificationCount > 0" class="notification-count">{{ notificationCount }}</span>
      <img class="clickable top-1" src="../assets/notification.png" />
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted } from 'vue'
import { getAllNotifications, getNotificationsUnreadCount } from '@/services/notifications'
import { io } from 'socket.io-client'
import { getSubscriberId, getRealmHeader } from '../utils.js'
import { BASE_URL } from '@/services/server'

const notificationCount = ref(0)
const subscriberID = ref('')
const socket = io(BASE_URL, {
  extraHeaders: {
    'x-realm': getRealmHeader()
  },
  path: '/notifc/socket'
})
socket.on('connect', function () {
  socket.emit('joinGroup', subscriberID.value)
})
socket.on('notification', function () {
  fetchNotificationsUnreadCount()
})

socket.on('NotificationRead', function () {
  fetchNotificationsUnreadCount()
})

socket.on('NotificationsRead', function () {
  fetchNotificationsUnreadCount()
})

socket.on('NotificationArchived', function () {
  fetchNotificationsUnreadCount()
})

onBeforeMount(() => {
  subscriberID.value = getSubscriberId()
  fetchNotificationsUnreadCount()
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

const fetchNotificationsUnreadCount = () => {
  getNotificationsUnreadCount(subscriberID.value)
    .then((res) => {
      notificationCount.value = res.count
    })
    .catch((err) => {
      console.error(err)
    })
}
</script>
