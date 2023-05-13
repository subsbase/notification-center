<template>
  <div>
    <NotificationList
    :notifications="notifications"
    :archivedNotifications="archivedNotifications"
    :source="'page'"
    @on-click-mark-read="fetchAllNotifications"
    />
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import NotificationList from "../components/NotificationList.vue";
import { getAllNotifications, getArchivedNotifications } from "@/services/notifications";
import { io } from "socket.io-client";

const notifications = ref([])
const archivedNotifications = ref([])

const socket = io("http://127.0.0.1:3000", {
  extraHeaders: {
    "x-realm": "admin-portal"
  }
});
socket.on("notification", function (data) {
  fetchAllNotifications()
  console.log("notification", data);
});

onBeforeMount(() => {
  fetchAllNotifications()
  fetchArchivedNotifications()
});

const fetchAllNotifications = () => { 
  getAllNotifications("test1")
    .then((res) => {
      notifications.value = res.reverse()
    })
    .catch((err) => {
      console.error(err);
    });
}

const fetchArchivedNotifications = () => { 
  getArchivedNotifications("test1")
    .then((res) => {
      archivedNotifications.value = res.reverse()
    })
    .catch((err) => {
      console.error(err);
    });
}
</script>
