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

const notifications = ref([])

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
