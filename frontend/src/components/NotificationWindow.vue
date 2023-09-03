<template>
  <div v-if="showNotificationWindowTrigger" class="notification-window">
    <NotificationList
      :notifications="notifications"
      :unreadCount="unreadCount"
      @on-click-mark-read="refreshNotifications"
      @on-handle-archive-unarchive="onArchiveUnArchive"
      @on-click-mark-unread="refreshNotifications"
      @on-snooze-notific="refreshNotifications"
    />
    <div>
      <p class="medium clickable view-all-btn py-30" @click="showAllNotificationsPage()">View all notifications</p>
    </div>
    <!-- <SnoozePopup class="popup"
    @multi-snooze-input="(param) =>{snoozeAmountMulti=param[0]; snoozeVariantMulti=param[1]}"
    @hide-snooze-popup="()=> {snoozeMulti=false}"
    ></SnoozePopup> -->
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
const totalCount = ref(0)
const unreadCount = ref(0)

const showNotificationWindowTrigger = ref(true)

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

onBeforeMount(() => {
  fetchAllNotifications()
  fetchArchivedNotifications()
  fetchNotificationsUnreadCount()
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
  a.href = `${getNotificationsPageURL()}`
  a.click()
}

const fetchAllNotifications = () => {
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
}

const fetchArchivedNotifications = () => {
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
}

const fetchNotificationsUnreadCount = () => {
  getNotificationsUnreadCount(subscriberID.value)
    .then((res) => {
      console.log(res)
      unreadCount.value = res.count
    })
    .catch((err) => {
      console.error(err)
    })
}
</script>
