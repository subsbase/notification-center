<template>
  <div>
    <NotificationList
      :notifications="notifications"
      :archived-notifications="archivedNotifications"
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
import { BASE_URL } from '@/services/server'

const notifications = ref([])
const archivedNotifications = ref([])
const subscriberID = ref('')
const pageSize = ref(100)

const socket = io(BASE_URL, {
  extraHeaders: {
    'x-realm': getRealmHeader()
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
  getAllNotifications(subscriberID.value, 1, pageSize.value)
    .then((res) => {
      notifications.value = res
    })
    .catch((err) => {
      console.error(err)
    })
}

const fetchArchivedNotifications = () => {
  getArchivedNotifications(subscriberID.value)
    .then((res) => {
      archivedNotifications.value = res
    })
    .catch((err) => {
      console.error(err)
    })
}
</script>
