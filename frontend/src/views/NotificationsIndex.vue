<template>
  <div ref="notificationsListRef">
    <NotificationList
      :notifications="notifications"
      :source="'page'"
      @on-click-mark-read="refreshNotifications"
      @on-handle-archive-unarchive="onArchiveUnArchive"
    />
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, onUnmounted } from 'vue'
import NotificationList from '../components/NotificationList.vue'
import { getAllNotifications, getArchivedNotifications } from '@/services/notifications'
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

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleScroll = () => {
  const element = notificationsListRef.value
  if (
    element.getBoundingClientRect().bottom <= window.innerHeight &&
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
const refreshNotifications = () => {
  fetchAllNotifications()
  fetchArchivedNotifications()
}

const fetchAllNotifications = () => {
  loading.value = true
  getAllNotifications(subscriberID.value, 1, pageSize.value)
    .then((res) => {
      notifications.value.splice(0, notifications.value.length, ...res.notifications)
      totalCount.value = res?.totalCount
      loading.value = false
    })
    .catch((err) => {
      console.error(err)
    })
}

const fetchArchivedNotifications = () => {
  loading.value = true
  getArchivedNotifications(subscriberID.value, 1, pageSize.value)
    .then((res) => {
      notifications.value.splice(0, notifications.value.length, ...res.archivedNotifications)
      totalCount.value = res?.totalCount
      loading.value = false
    })
    .catch((err) => {
      console.error(err)
    })
}

const onArchiveUnArchive = (param) => {
  if (param === 'All') {
    currentTab.value = 'All'
    fetchAllNotifications()
  } else {
    currentTab.value = 'Archived'
    fetchArchivedNotifications()
  }
}
</script>
