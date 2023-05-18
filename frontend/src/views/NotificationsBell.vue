<template>
  <p class="clickable notification-bell" @click="fetchAllNotifications()">
     <span class="notification-count">{{ notificationCount }}</span>
    <img
      class="clickable top-1 pos-relative"
      src="../assets/notification.png"
    />
  </p>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { getNotificationsUnreadCount } from "@/services/notifications";
import { io } from "socket.io-client";

import { getSubscriberId, getRealmHeader } from "../utils.js"

const notificationCount = ref(0)
const subscriberID = ref("");

const socket = io(process.env.VUE_APP_SERVER_BASE_URL, {
  extraHeaders: {
    "x-realm": getRealmHeader()
  }
});
socket.on("connect", function () {
  socket.emit("joinGroup", subscriberID.value);
});
socket.on("notification", function () {
  fetchNotificationsUnreadCount()
});

socket.on("NotificationRead", function () {
  fetchNotificationsUnreadCount()
});

socket.on("NotificationsRead", function () {
  fetchNotificationsUnreadCount()
});

socket.on("NotificationArchived", function () {
  fetchNotificationsUnreadCount()
});

socket.on("NotificationUnarchived", function () {
  fetchNotificationsUnreadCount()
});


onBeforeMount(() => {
  subscriberID.value = getSubscriberId()
  fetchNotificationsUnreadCount() 
});

// const fetchAllNotifications = () => { 
//   getAllNotifications(subscriberID.value)
//     .then((res) => {
//       notificationCount.value =  res.filter((notification) => !notification.read)
//     .length
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// }

const fetchNotificationsUnreadCount = () => { 
  getNotificationsUnreadCount(subscriberID.value)
    .then((res) => {
      notificationCount.value =  res.count
    })
    .catch((err) => {
      console.error(err);
    });
}


</script>
