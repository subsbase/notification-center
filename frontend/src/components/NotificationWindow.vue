<template>
  <div class="notification-window">
    <div class="x-between px-20">
      <h4 class="font-size-16 mb-0">Notifications</h4>
      <i class="fa fa-times my-21 clickable"></i>
    </div>
    <NotificationList/>
    <div>
      <p class="medium clickable view-all-btn py-30">View all notifications</p>
    </div>
  </div>
</template>

<script>
import NotificationList from './NotificationList.vue'
export default {
  components: {
    NotificationList
  }
}
</script>
