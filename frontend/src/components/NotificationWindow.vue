<template>
  <!-- <i @click="showNotificationWindow" class="fa fa-bell clickable"></i> -->
  <div v-if="showNotificationWindowTrigger" class="notification-window">

    <NotificationList
    :notifications="notifications"
    @on-click-mark-read="fetchAllNotifications"
    />
    <div>
      <p @click="showAllNotificationsPage()" class="medium clickable view-all-btn py-30">View all notifications</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { io } from "socket.io-client";
import NotificationList from "./NotificationList.vue";
import { getAllNotifications } from "@/services/notifications";

const notifications = ref([])
// const subID = ref('')
// const themeID = ref('')
const showNotificationWindowTrigger = ref(true)

const socket = io("http://127.0.0.1:3000");
socket.on("connect", function () {
  socket.emit("joinGroup", "test");
  console.log("Connected");
});
socket.on("notification", function (data) {
  fetchAllNotifications()
  console.log("notification", data);
});

onBeforeMount(() => {
  //getSubscriberId()
  fetchAllNotifications() 
});

// const showNotificationWindow = () => { 
//   showNotificationWindowTrigger.value = !showNotificationWindowTrigger.value

//  }

// const getSubscriberId = () => { 
//   let url = new URL(window.location)
//   let params = new URLSearchParams(url.search)
//   subID.value = params.get('subscriberId')
//   themeID.value = `#`+params.get('themeID')
//   window.console.log('themeID.value', themeID.value)
// }

const showAllNotificationsPage = () => { 
  let a = document.createElement("a");
      a.target = "_blank";
      a.href = 'http://localhost:3100/notifications';
      a.click();
}

const fetchAllNotifications = () => { 
  getAllNotifications("test")
    .then((res) => {
      notifications.value = res.reverse()
    })
    .catch((err) => {
      console.error(err);
    });
}

</script>

<!-- <style>
.link {
    color: v-bind(themeID);
    text-decoration: underline;
    font-weight: 500;
}
.blue-circle {
    background-color: v-bind(themeID);
    height: 10px;
    width: 10px;
    border-radius: 50%;
    display: inline-block;
}
/* :root {
  --accent-color: v-bind(themeID);
} */
</style> -->