<template>
  <div v-if="showNotificationWindowTrigger" class="notification-window">
    <NotificationList
      :notifications="notifications"
      @on-click-mark-read="refreshNotifications"
      @on-handle-archive-unarchive="onArchiveUnArchive"
    />
    <div>
      <p @click="showAllNotificationsPage()" class="medium clickable view-all-btn py-30">View all notifications</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { io } from 'socket.io-client'
import NotificationList from './NotificationList.vue'
import { getAllNotifications, getArchivedNotifications } from '@/services/notifications'

import { getSubscriberId, getRealmHeader } from '../utils.js'

const notifications = ref([])
const subscriberID = ref('')

const showNotificationWindowTrigger = ref(true)

onBeforeMount(() => {
  subscriberID.value = getSubscriberId()
})
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

const refreshNotifications = () => {
  fetchAllNotifications()
  fetchArchivedNotifications()
}

onBeforeMount(() => {
  fetchAllNotifications()
  fetchArchivedNotifications()
})

const onArchiveUnArchive = (param) => {
  if (param === 'All') {
    fetchAllNotifications()
  } else {
    fetchArchivedNotifications()
  }
}

const showAllNotificationsPage = () => {
  let a = document.createElement('a')
  a.target = '_top'
  a.href = process.env.VUE_APP_HOST_NOTIFICATIONS_URL
  a.click()
}

const fetchAllNotifications = () => {
  getAllNotifications(subscriberID.value)
    .then((res) => {
      notifications.value = res.reverse()
    })
    .catch((err) => {
      console.error(err)
    })
}

const fetchArchivedNotifications = () => {
  getArchivedNotifications(subscriberID.value)
    .then((res) => {
      notifications.value = res
    })
    .catch((err) => {
      console.error(err)
    })
}
</script>
