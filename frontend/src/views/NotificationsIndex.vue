<template>
  <div ref="notificationsListRef">
    <NotificationList
      :notifications="notifications"
      :unread-count="unreadCount"
      :source="'page'"
      :loading="loading"
      @refresh-notifications="refreshNotifications"
      @on-change-filter="updateFilter"
      @on-handle-snooze="updateNotificationsList"
      @on-handle-archive-unarchive="updateNotificationsList"
    />
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, onUnmounted } from 'vue'
import NotificationList from '../components/NotificationList.vue'
import { getAllNotifications, getArchivedNotifications, getNotificationsUnreadCount } from '@/services/notifications'
import { io } from 'socket.io-client'
import { getSubscriberId, getRealmHeader } from '../utils.js'
import { BASE_URL } from '@/services/server'

const notifications = ref([])
const subscriberID = ref('')
const pageSize = ref(10)
const notificationsListRef = ref(null)
const totalCount = ref(0)
const loading = ref(false)
const currentTab = ref('All')
const unreadCount = ref(0)

const socket = io(BASE_URL, {
  extraHeaders: {
    'x-realm': getRealmHeader()
  },
  path: '/notifc/socket'
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

onBeforeMount(() => {
  subscriberID.value = getSubscriberId()
  fetchNotificationsUnreadCount()
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleScroll = () => {
  const element = notificationsListRef.value
  if (
    element.getBoundingClientRect().bottom - 25 <= window.innerHeight &&
    totalCount.value > pageSize.value &&
    !loading.value
  ) {
    pageSize.value += 10
    if (currentTab.value === 'All') {
      fetchAllNotifications()
    } else {
      fetchArchivedNotifications()
    }
  }
}

const updateNotificationsList = (param) => {
  notifications.value.splice(param[0], 1)
  refreshNotifications(param[1])
}

const refreshNotifications = (param) => {
  if (param === 'All') {
    fetchAllNotifications()
  } else {
    fetchArchivedNotifications()
  }
}

const fetchAllNotifications = () => {
  loading.value = true
  getAllNotifications(subscriberID.value, 1, pageSize.value)
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
  getArchivedNotifications(subscriberID.value, 1, pageSize.value)
    .then((res) => {
      if (res?.archivedNotifications) {
        notifications.value.splice(0, notifications.value.length, ...res.archivedNotifications)
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

const updateFilter = (param) => {
  if (param === 'All') {
    currentTab.value = 'All'
    fetchAllNotifications()
  } else {
    currentTab.value = 'Archived'
    fetchArchivedNotifications()
  }
}
const fetchNotificationsUnreadCount = () => {
  getNotificationsUnreadCount(subscriberID.value)
    .then((res) => {
      unreadCount.value = res.count
    })
    .catch((err) => {
      console.error(err)
    })
}
</script>
