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

const notificationCount = ref(0)

const socket = io("http://127.0.0.1:3000", {
  extraHeaders: {
    "x-realm": "admin-portal"
  }
});
socket.on("connect", function () {
  socket.emit("joinGroup", "5513489");
  console.log("Connected");
});
socket.on("notification", function (data) {
  fetchAllNotifications()
  console.log("notification", data);
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
  fetchAllNotifications() 
});

const fetchAllNotifications = () => { 
  getAllNotifications("5513489")
    .then((res) => {
      notificationCount.value =  res.filter((notification) => !notification.read)
    .length
    console.log('hi',  notificationCount.value)
    })
    .catch((err) => {
      console.error(err);
    });
}


</script>
