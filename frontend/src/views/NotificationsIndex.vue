<template>
  <div>
    <NotificationList
    :notifications="notifications"
    :source="'page'"
    @on-click-mark-read="fetchAllNotifications"
    />
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import NotificationList from "../components/NotificationList.vue";
import { getAllNotifications } from "@/services/notifications";
import { io } from "socket.io-client";

const notifications = ref([])

const socket = io("http://127.0.0.1:3000");
socket.on("notification", function (data) {
  fetchAllNotifications()
  console.log("notification", data);
});

onBeforeMount(() => {
  fetchAllNotifications()
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
</script>
