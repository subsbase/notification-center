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
import { getAllNotifications } from "@/services/notifications";
import { io } from "socket.io-client";

import { getSubscriberId, getRealmHeader } from "../utils.js"

const notificationCount = ref(0)
const subscriberID = ref("");

const socket = io(process.env.SERVER_BASE_URL, {
  extraHeaders: {
    "x-realm": getRealmHeader()
  }
});
socket.on("connect", function () {
  socket.emit("joinGroup", subscriberID.value);
});
socket.on("notification", function () {
  fetchAllNotifications()
});

socket.on("NotificationRead", function () {
  fetchAllNotifications()
});

socket.on("NotificationsRead", function () {
  fetchAllNotifications()
});

socket.on("NotificationArchived", function () {
  fetchAllNotifications()
});


onBeforeMount(() => {
  subscriberID.value = getSubscriberId()
  fetchAllNotifications() 
});

const fetchAllNotifications = () => { 
  getAllNotifications(subscriberID.value)
    .then((res) => {
      notificationCount.value =  res.filter((notification) => !notification.read)
    .length
    })
    .catch((err) => {
      console.error(err);
    });
}


</script>
