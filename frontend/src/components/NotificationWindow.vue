<template>
  <div class="notification-window">
    <NotificationList
      :notifications="notifications"
      :unread-count="unreadCount"
      :loading="loading"
      @on-change-filter="refreshNotifications"
      @refresh-notifications="refreshNotifications"
      @on-handle-snooze="updateNotificationsList"
      @on-handle-archive-unarchive="updateNotificationsList"
    />
    <div>
      <p class="medium clickable view-all-btn py-30" @click="showAllNotificationsPage()">View all notifications</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { io } from 'socket.io-client'
import NotificationList from './NotificationList.vue'
import { getAllNotifications, getArchivedNotifications, getNotificationsUnreadCount } from '@/services/notifications'
import { BASE_URL } from '@/services/server'
import { getSubscriberId, getRealmHeader, getNotificationsPageURL } from '../utils.js'

const notifications = ref([])
const subscriberID = ref('')
const totalArchivedCount = ref(0)
const loading = ref(false)
const totalCount = ref(0)
const unreadCount = ref(0)

onBeforeMount(() => {
  subscriberID.value = getSubscriberId()
})
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
  fetchAllNotifications()
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

const refreshNotifications = (param) => {
  if (param === 'All') {
    fetchAllNotifications()
  } else {
    fetchArchivedNotifications()
  }
}

const updateNotificationsList = (param) => {
  notifications.value.splice(param[0], 1)
  refreshNotifications(param[1])
}

onBeforeMount(() => {
  fetchNotificationsUnreadCount()
})

const showAllNotificationsPage = () => {
  let a = document.createElement('a')
  a.target = '_top'
  a.href = `${getNotificationsPageURL()}`
  a.click()
}

const fetchAllNotifications = () => {
  loading.value = true
  getAllNotifications(subscriberID.value)
    .then((res) => {
      if (res?.notifications) {
        notifications.value.splice(0, notifications.value.length, ...res.notifications)
        totalCount.value = res?.totalCount
      } else {
        notifications.value.splice(0, notifications.value.length)
        totalCount.value = 0
      }
    })
    .catch((err) => {
      console.error(err)
    })
    .finally(() => {
      loading.value = false
    })
}

const fetchArchivedNotifications = () => {
  loading.value = true
  getArchivedNotifications(subscriberID.value)
    .then((res) => {
      if (res?.archivedNotifications) {
        notifications.value.splice(0, notifications.value.length, ...res.archivedNotifications)
        totalArchivedCount.value = res?.totalCount
      } else {
        notifications.value.splice(0, notifications.value.length)
        totalArchivedCount.value = 0
      }
    })
    .catch((err) => {
      console.error(err)
    })
    .finally(() => {
      loading.value = false
    })
}

const fetchNotificationsUnreadCount = () => {
  loading.value = true
  getNotificationsUnreadCount(subscriberID.value)
    .then((res) => {
      unreadCount.value = res.count
    })
    .catch((err) => {
      console.error(err)
    })
    .finally(() => {
      loading.value = false
    })
}
</script>
