<template>
  <div class="x-between px-20">
    <h4 class="font-size-16 mb-10">
      <i @click="goBack" v-if="source === 'page'" class="fa fa-chevron-left mr-20 clickable"></i>
      Notifications</h4>
    <!-- <i class="fa fa-times my-21 clickable"></i> -->
  </div>
  <div class="x-between px-20 font-size-12">
    <div class="d-flex filters mb-30">
      <div
        v-for="filter in filters"
        :key="filter"
        :class="['mr-20 clickable', { active: selectedFilter === filter }]"
        @click="onChangeFilter(filter)"
      >
        {{ filter }}
      </div>
    </div>
  </div>

  <div class="x-between px-20 font-size-12" v-if="selectedFilter === 'All'">
    <p class="mt-0">
      <span>
        You’ve got <strong> {{ getUnreadCount }} unread</strong> notifications
      </span>
    </p>
    <p v-if="notifications.length > 0" @click="handleMarkAllAsRead" class="link clickable mt-0 text-right">
      Mark all as read
    </p>
  </div>



  <div :class="['px-20', source === 'page' ? '' : 'notification-list']">
    <!-- <p class="font-size-12 mb-10 text-left medium">Today</p> -->
    <div
      @click="handleMarkAsRead(notification._id, notification.actionUrl)"
      v-for="notification in notificationsData"
      :key="notification._id"
      :class="[
        'notification-row mb-10',
        { 'read-notification': notification.read },
      ]"
    >
      <div class="x-between font-size-12">
        <p class="bold m-0">{{ notification.topic.name }}</p>
        <div>
          <span v-if="!notification.read" class="blue-circle mr-10"> </span>
          <img
            v-if="notification.archivedAt"
            @click.stop="handleUnArchiveNotification(notification._id)"
            class="clickable top-1 pos-relative"
            src="../assets/unarchive-icon.svg"
          />
          <img
            v-else
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
import {
  defineProps,
  computed,
  defineEmits,
  onBeforeMount,
  ref,
  onMounted,
} from "vue";
import moment from "moment";
import {
  archiveNotification,
  markAllAsRead,
  markAsRead,
  unArchiveNotification
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
});

onMounted(() => {
  getSubscriberId();
  setTimeout(() => {
    notificationsData.value = props.notifications;
  }, 1000);
});

const goBack = () => {
  history.back();
}

const onChangeFilter = (filterType) => {
  selectedFilter.value = filterType;
  if (filterType === "All") {
    notificationsData.value = props.notifications;
  } else {
    notificationsData.value = props.archivedNotifications;
  }
};

const handleArchiveNotification = (notificationId) => {
  const payload = [];
  payload.push(notificationId);
  archiveNotification("5513489", payload)
    .then((res) => {
      console.log("res", res);
      onChangeFilter()
      emit("on-click-mark-read");
    })
    .catch((err) => {
      console.error(err);
    });
};

const handleUnArchiveNotification = (notificationId) => {
  const payload = [];
  payload.push(notificationId);
  unArchiveNotification("5513489", payload)
    .then((res) => {
      console.log("res", res);
      onChangeFilter()
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
  markAllAsRead("5513489")
    .then((res) => {
      console.log("res", res);
      emit("on-click-mark-read");
    })
    .catch((err) => {
      console.error(err);
    });
};

const handleMarkAsRead = (notificationId, actionUrl) => {
  if(selectedFilter.value === 'All') {
    markAsRead("5513489", notificationId)
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
  }

};
</script>

<style lang="scss">
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
.filters {
    div {
        line-height: 1.7;
        &.active {
            border-bottom: 2px solid v-bind(themeID);
        }
    }
}
/* :root {
--accent-color: v-bind(themeID);
} */
</style>
