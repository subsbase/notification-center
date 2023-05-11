<template>
  <div class="x-between px-20">
    <h4 class="font-size-16 mb-10">Notifications</h4>
    <!-- <i class="fa fa-times my-21 clickable"></i> -->
  </div>
  <div class="x-between px-20 font-size-12">
    <p class="mt-0">
      You’ve got <strong> {{ getUnreadCount }} unread</strong> notifications
    </p>
    <p @click="handleMarkAllAsRead" class="link clickable mt-0">
      Mark all as read
    </p>
  </div>

  <div class="x-between px-20 font-size-12">
    <div class="d-flex filters mb-30">
        <div v-for="filter in filters" :key="filter" :class="['mr-20 clickable', {'active': selectedFilter === filter}]" @click="onChangeFilter(filter)">
          {{ filter }}
        </div>
    </div>
    </div>
    
  <div :class="['px-20', source === 'page' ? '' : 'notification-list']">
    <!-- <p class="font-size-12 mb-10 text-left medium">Today</p> -->
    <div
      @click="handleMarkAsRead(notification._id, notification.actionUrl)"
      v-for="notification in notifications"
      :key="notification._id"
      :class="[
        'notification-row mb-10',
        { 'read-notification': notification.read },
      ]"
    >
      <div class="x-between font-size-12">
        <p class="bold m-0">{{ notification.topic.displayText }}</p>
        <div>
          <span v-if="!notification.read" class="blue-circle mr-10"> </span>
          <img
            @click.stop="handleArchiveNotification(notification._id)"
            class="clickable top-1 pos-relative"
            src="../assets/archive-icon.svg"
          />
        </div>
      </div>

      <div class="x-between font-size-12">
        <p>
          {{ notification.content }}
        </p>
        <p class="light">
          {{ getNotificationTime(notification.createdAt) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed, defineEmits, onBeforeMount, ref } from "vue";
import moment from "moment";
import {
  archiveNotification,
  markAllAsRead,
  markAsRead,
} from "@/services/notifications";

const emit = defineEmits(["on-click-mark-read"]);

const props = defineProps({
  notifications: { type: Array, default: () => [] },
  archivedNotifications: { type: Array, default: () => [] },
  source: { type: String },
});

const subID = ref("");
const themeID = ref("");
const selectedFilter = ref("All");
const filters = ref(["All", "Archive"]);
const notificationsData = ref([]);

const getUnreadCount = computed(() => {
  return props.notifications.filter((notification) => !notification.read)
    .length;
});

onBeforeMount(() => {
  getSubscriberId();
  notificationsData.value = props.notifications
});


const onChangeFilter = (filterType) => {
  selectedFilter.value = filterType
  if(filterType === 'All') {
    notificationsData.value = props.notifications
  }
  else {
    notificationsData.value = props.archivedNotifications
  }
}

const handleArchiveNotification = (notificationId) => {
  const payload = [];
  payload.push(notificationId);
  archiveNotification("test1", payload)
    .then((res) => {
      console.log("res", res);
      emit("on-click-mark-read");
    })
    .catch((err) => {
      console.error(err);
    });
};

const getSubscriberId = () => {
  let url = new URL(window.location);
  let params = new URLSearchParams(url.search);
  subID.value = params.get("subscriberId");
  themeID.value = `#` + params.get("themeID");
  window.console.log("themeID.value", themeID.value);
};

const getNotificationTime = (time) => {
  return moment(time).fromNow();
};

const handleMarkAllAsRead = () => {
  markAllAsRead("test1")
    .then((res) => {
      console.log("res", res);
      emit("on-click-mark-read");
    })
    .catch((err) => {
      console.error(err);
    });
};

const handleMarkAsRead = (notificationId, actionUrl) => {
  markAsRead("test1", notificationId)
    .then((res) => {
      console.log("res", res);
      emit("on-click-mark-read");
      let a = document.createElement("a");
      a.target = "_blank";
      a.href = actionUrl;
      a.click();
    })
    .catch((err) => {
      console.error(err);
    });
};
</script>

<style>
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
</style>
