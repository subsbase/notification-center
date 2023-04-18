<template>
  <div class="notification-window">
    {{ notifications }}
    <div class="x-between px-20">
      <h4 class="font-size-16 mb-0">Notifications</h4>
      <i class="fa fa-times my-21 clickable"></i>
    </div>
    <NotificationList />
    <div>
      <p class="medium clickable view-all-btn py-30">View all notifications</p>
    </div>
  </div>
</template>

<script setup>
import { io } from "socket.io-client";
import NotificationList from "./NotificationList.vue";
import { ref } from "vue";

const notifications = ref([]);
const socket = io("http://127.0.0.1:3000");
socket.on("connect", function () {
  socket.emit("joinGroup", "test");
  console.log("Connected");
});
socket.on("notification", function (data) {
  notifications.value = data;
  console.log("notification", data);
});

// onMounted(() => {

//   // axios
//   //   .get('http://127.0.0.1:3000/notifc/subjects')
//   //   .then(response => (this.info = response))
// });
</script>
