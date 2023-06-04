<template>
  <div>
    <NotificationList
      :notifications="notifications"
      :archivedNotifications="archivedNotifications"
      :source="'page'"
      @on-click-mark-read="refreshNotifications"
    />
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import NotificationList from '../components/NotificationList.vue'
import { getAllNotifications, getArchivedNotifications } from '@/services/notifications'
import { io } from 'socket.io-client'

import { getSubscriberId, getRealmHeader } from '../utils.js'

const notifications = ref([])
const archivedNotifications = ref([])
const subscriberID = ref('')

const socket = io(process.env.VUE_APP_WEBSOCKET_BASE_URL, {
  extraHeaders: {
    'x-realm': getRealmHeader
  },
  path: '/notifc/socket'
})
socket.on('notification', function () {
  fetchAllNotifications()
})

onBeforeMount(() => {
  subscriberID.value = getSubscriberId()
  fetchAllNotifications()
  fetchArchivedNotifications()
})

const refreshNotifications = () => {
  fetchAllNotifications()
  fetchArchivedNotifications()
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
      archivedNotifications.value = res.reverse()
    })
    .catch((err) => {
      console.error(err)
    })
}
</script>
