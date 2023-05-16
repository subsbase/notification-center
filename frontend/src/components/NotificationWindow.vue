<template>
  <!-- <i @click="showNotificationWindow" class="fa fa-bell clickable"></i> -->
  <div v-if="showNotificationWindowTrigger" class="notification-window">
    <NotificationList
      :notifications="notifications"
      @on-click-mark-read="refreshNotifications"
      :archivedNotifications="archivedNotifications"
    />
    <div>
      <p
        @click="showAllNotificationsPage()"
        class="medium clickable view-all-btn py-30"
      >
        View all notifications
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { io } from "socket.io-client";
import NotificationList from "./NotificationList.vue";
import {
  getAllNotifications,
  getArchivedNotifications,
} from "@/services/notifications";

const notifications = ref([]);
const archivedNotifications = ref([]);
// const subID = ref('')
// const themeID = ref('')
const showNotificationWindowTrigger = ref(true);

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
  // fetchArchivedNotifications();
  console.log("notification", data);
});

const refreshNotifications = () => {
  fetchAllNotifications()
  fetchArchivedNotifications();
};

onBeforeMount(() => {
  //getSubscriberId()
  fetchAllNotifications();
  fetchArchivedNotifications();
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
  a.target = "_top";
  a.href = "http://localhost:3100/notifications";
  a.click();
};

const fetchAllNotifications = () => {
  getAllNotifications("5513489")
    .then((res) => {
      notifications.value = res.reverse();
    })
    .catch((err) => {
      console.error(err);
    });
};

const fetchArchivedNotifications = () => {
  getArchivedNotifications("5513489")
    .then((res) => {
      archivedNotifications.value = res;
    })
    .catch((err) => {
      console.error(err);
    });
};
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
