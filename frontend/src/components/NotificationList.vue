<template>
  <div class="d-flex">
    <div class="font-dark parent-container">
      <div v-if="snoozeMulti" class="blur-bg"></div>
      <div class="x-between px-20 py-20">
        <h4 class="font-size-16 mb-10">
          <chevron v-if="source === 'page'" class="mr-20 back-btn clickable" @click="goBack"></chevron>
          Notifications
        </h4>
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
        <div v-if="selectedFilter === 'All'">
          <Dropdown v-if="multiSelect" class="more-btn" :items="multiActionsAll" @on-selected="handleSelectedAction" />
          <p
            v-else-if="notifications.length > 0"
            class="link clickable mt-0 text-right mark-all-read-link"
            @click="handleMarkAllAsRead"
          >
            Mark all as read
          </p>
        </div>
        <div v-else class="x-row">
          <Dropdown
            v-if="multiSelect"
            class="more-btn"
            :items="multiActionsArchive"
            @on-selected="handleSelectedAction"
          />
        </div>
      </div>
      <div
        v-if="notifications.length > 0"
        :class="['px-20', source === 'page' ? '' : 'notification-list']"
      >
        <div
          v-for="(notification, index) in notifications"
          :key="notification._id"
          :class="[
            'notification-row my-20',
            { 'read-notification': notification.read },
            { 'selected-notification': checked[index] }
          ]"
          @click="handleMarkAsRead(notification._id, notification.actionUrl)"
        >
          <div class="d-flex font-size-12">
            <div class="x-start checkbox-div mr-10">
              <input
                :disabled="snoozeMulti"
                :class="{ 'check-icon': checked[index], 'unread-notif-bg': !notification.read }"
                type="checkbox"
                id="checkbox"
                v-model="checked[index]"
                @change="handleChecked(notification._id, index)"
                @click.stop
              />
            </div>
            <div class="x-between font-size-12 details-div">
              <div class="my-5 notification-title">
                <p class="bold m-0 ml-0">
                  {{ notification.title }}
                </p>
                <p class=" " v-html="notification.message"></p>
              </div>
              <div class="x-between font-size-12 notification-content">
              <p>
              {{ notification.content }}
              </p>
              </div>
              <div class="mr-20 mb-10 icons-snooze-div">
                <div class="icons-time-div">
                  <div class="d-flex x-row x-end">
                    <div class="icons-div">
                      <img
                        v-if="notification.archivedAt"
                        class="clickable top-1 pos-relative mx-10"
                        src="../assets/unarchive-icon.svg"
                        @click.stop="handleUnArchiveNotification([notification._id])"
                      />
                      <div v-else-if="!multiSelect" class="x-end">
                        <img
                          class="clickable top-1 pos-relative mx-10"
                          src="../assets/Snooze.svg"
                          @click.stop="() => {CurrentsnoozeSingle = index;}"
                        />
                        <img
                          class="clickable top-1 pos-relative"
                          src="../assets/archive-icon.svg"
                          @click.stop="handleArchiveNotification([notification._id])"
                          />
                      </div>
                    </div>
                        <span v-if="!notification.read" class="blue-circle ml-10" />
                  </div>
                  <p class="light ml-20 mt-10 x-end created-since">
                    {{ getNotificationTime(notification.createdAt) }}
                  </p>
                </div>

              </div>
            </div>
            
            <div v-if="CurrentsnoozeSingle === index && !multiSelect" class="snooze-bar d-flex">
              <input type="number" class="snooze-amount m-5" v-model="snoozeAmount" @click.stop />
              <div class="m-5 rel">
                <button @click.stop="snoozeDropdown = !snoozeDropdown" class="btn snooze-variant-m">
                  <div class="selector">{{ snoozeVariant }}</div>
                  <chevron></chevron>
                </button>
                <ul v-if="snoozeDropdown" class="dropdown-menu-snooze">
                  <li v-for="(snoozeItem, index) of snoozeItems" :key="snoozeItem">
                    <div
                      class="dropdown-item-snooze"
                      :class="{ 'no-border': index === snoozeItems.length - 1 }"
                      v-bind:value="snoozeItem"
                      @click.stop="{snoozeVariant = snoozeItem; snoozeDropdown = false;}"
                    >
                      {{ snoozeItem }}
                    </div>
                  </li>
                </ul>
              </div>
              <img
                src="../assets/Remove.svg"
                alt="Cancel"
                class="m-5 snooze-cancel"
                @click.stop="() => {CurrentsnoozeSingle = -1;}"
              />
              <img
                src="../assets/Done.svg"
                alt="Confirm"
                class="m-5 snooze-done"
                @click.stop="
                  () => {handleSnoozeSingle(index, notification._id);}"
              />
            </div>

          </div>
        </div>
      </div>
      <div v-else class="d-flex">
        <span class="mx-auto font-size-14">{{
          selectedFilter === 'All' ? 'No notifications' : 'No archived notifications'
        }}</span>
      </div>
    </div>
    <SnoozePopup
      v-if="snoozeMulti"
      class="popup"
      @multi-snooze-input="
        (param) => {
          console.log(selectedNotificList)
          handleSnoozeMulti(param, selectedNotificList)
        }
      "
      @hide-snooze-popup="
        () => {
          snoozeMulti = false
        }
      "
    ></SnoozePopup>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, onBeforeMount, ref } from 'vue'
import moment from 'moment'
import {
  archiveNotification,
  markAllAsRead,
  markAsRead,
  unArchiveNotification,
  markAsUnread,
  snoozeNotification
} from '@/services/notifications'
import { getSubscriberId, getThemeId, getRealmHeader } from '../utils.js'
import SnoozePopup from './SnoozePopup.vue'
import Dropdown from './Dropdown.vue'
import chevron from '@/icons/chevron.vue'

const emit = defineEmits(['on-click-mark-read', 'on-click-mark-unread', 'on-snooze-notific'])

const props = defineProps({
  notifications: { type: Array, default: () => [] },
  source: { type: String },
  unreadCount: { type: Number }
})

const subscriberID = ref('')
const themeID = ref('')
const selectedFilter = ref('All')
const filters = ref(['All', 'Archive'])
const checked = ref([])
const selectedNotificList = ref([])
const multiSelect = ref(false)
const multiActionsAll = ref(['Archive', 'Snooze', 'Mark As Read', 'Mark As Unread'])
const multiActionsArchive = ref(['Unarchive'])
const multiActionSelected = ref('')
const CurrentsnoozeSingle = ref()
const snoozeAmount = ref(0)
const snoozeVariant = ref()
const snoozeMulti = ref(false)
const snoozeAmountMulti = ref()
const snoozeVariantMulti = ref('')
const slideNotification = ref([])
const snoozeDropdown = ref(false)
const snoozeItems = ref(['Minutes', 'Hours', 'Days'])

onBeforeMount(() => {
  subscriberID.value = getSubscriberId()
  themeID.value = getThemeId()
  emit('on-handle-archive-unarchive', 'All')
})

const goBack = () => {
  history.back()
}

const getNotificationTime = (time) => {
  return moment(time).local().fromNow()
}

const onChangeFilter = (filterType) => {
  selectedFilter.value = filterType
  multiSelect.value = false
  checked.value = []
  selectedNotificList.value = []
  emit('on-handle-archive-unarchive', filterType)
}

const handleArchiveNotification = (notifications) => {
  const payload = notifications
  archiveNotification(subscriberID.value, payload)
    .then(() => {
      emit('on-click-mark-read', selectedFilter.value)
    })
    .catch((err) => {
      console.error(err)
    })
}

const handleUnArchiveNotification = (notifications) => {
  const payload = notifications
  unArchiveNotification(subscriberID.value, payload)
    .then(() => {
      emit('on-click-mark-read', selectedFilter.value)
    })
    .catch((err) => {
      console.error(err)
    })
}

const handleMarkAllAsRead = () => {
  markAllAsRead(subscriberID.value)
    .then(() => {
      emit('on-click-mark-read', selectedFilter.value)
    })
    .catch((err) => {
      console.error(err)
    })
}

const handleMarkAsRead = (notificationId, actionUrl) => {
  if (selectedFilter.value === 'All') {
    markAsRead(subscriberID.value, notificationId)
      .then(() => {
        emit('on-click-mark-read', selectedFilter.value)
        window.top.location.href = actionUrl
      })
      .catch((err) => {
        console.error(err)
      })
  }
}

const handleMarkAsUnread = (notificationId, actionUrl) => {
  if (selectedFilter.value === 'All') {
    markAsUnread(subscriberID.value, notificationId)
      .then(() => {
        emit('on-click-mark-unread', selectedFilter.value)
        window.top.location.href = actionUrl
      })
      .catch((err) => {
        console.error(err)
      })
  }
}

const handleChecked = (nId, idx) => {
  if (checked.value[idx]) {
    selectedNotificList.value.push(nId)
  } else {
    const toDelete = selectedNotificList.value.findIndex((i) => i === nId)
    selectedNotificList.value.splice(toDelete, 1)
  }
  multiSelect.value = selectedNotificList.value.length <= 0 ? false : true
}

const calculateUTC = (amount, variant) => {
  const result = new Date()
  const year = result.getUTCFullYear()
  const month = result.getUTCMonth() + 1
  const day = result.getUTCDate()
  const hours = result.getUTCHours()
  const minutes = result.getUTCMinutes()
  const seconds = result.getUTCSeconds()

  console.log()
  if (variant === 'Minutes') {
    result.setUTCMinutes(minutes + amount)
  }
  if (variant === 'Hours') {
    result.setUTCHours(hours + amount)
  }
  if (variant === 'Days') {
    result.setUTCDate(day + amount)
  }
  return result.toISOString()
}

const handleSnoozeSingle = (idx, nId) => {
  CurrentsnoozeSingle.value = -1
  const result = calculateUTC(snoozeAmount.value, snoozeVariant.value)
  const data = {
    notificationsIds: [nId],
    snoozeUntil: result
  }
  snoozeNotification(subscriberID.value, data)
    .then(() => {
      emit('on-snooze-notific', selectedFilter.value)
    })
    .catch((err) => {
      console.error(err)
    })
  snoozeAmount.value = null
  snoozeVariant.value = null
  // $delete(notifications, idx);
  // slideNotification.value[idx]=true
}

const handleSnoozeMulti = (param, notifications) => {
  snoozeAmountMulti.value = param[0]
  snoozeVariantMulti.value = param[1]
  console.log(snoozeAmountMulti.value, snoozeVariantMulti.value)
  const snoozeMultiDate = calculateUTC(snoozeAmountMulti.value, snoozeVariantMulti.value)
  console.log(snoozeMultiDate)
  console.log(notifications)
  const payload = {
    notificationsIds: notifications,
    snoozeUntil: snoozeMultiDate
  }
  snoozeNotification(subscriberID.value, payload)
    .then(() => {
      emit('on-snooze-notific', selectedFilter.value)
    })
    .catch((err) => {
      console.error(err)
    })
}

const handleSelectedAction = (param) => {
  multiActionSelected.value = param

  if (multiActionSelected.value == 'Archive') {
    handleArchiveNotification(selectedNotificList.value)
    checked.value = []
    multiSelect.value = false
    selectedNotificList.value = []
  }
  if (multiActionSelected.value == 'Unarchive') {
    handleUnArchiveNotification(selectedNotificList.value)
    checked.value = []
    multiSelect.value = false
    selectedNotificList.value = []
  }
  if (multiActionSelected.value == 'Snooze') {
    snoozeMulti.value = true
  }
  if (multiActionSelected.value == 'Mark As Read') {
    let notification
    for (let notifId of selectedNotificList.value) {
      notification = props.notifications.filter((notif) => notif._id == notifId)[0]
      handleMarkAsRead(notifId, notification.actionUrl)
    }
    checked.value = []
    multiSelect.value = false
    selectedNotificList.value = []
  }
  if (multiActionSelected.value == 'Mark As Unread') {
    let notification
    for (let notifId of selectedNotificList.value) {
      notification = props.notifications.filter((notif) => notif._id == notifId)[0]
      handleMarkAsUnread(notifId, notification.actionUrl)
    }
    checked.value = []
    multiSelect.value = false
    selectedNotificList.value = []
  }
}
</script>

<style lang="scss">
.parent-container {
  position: relative;
  height: 100%;
  width: 100%;
}

.back-btn {
  transform: rotate(90deg);
}

.link {
  color: v-bind(themeID);
  text-decoration: underline;
  font-weight: 500;
}

.unread-notif-bg {
  background-color: #ebeff6;
}

.mark-all-read-link {
  text-decoration: none;
  font-weight: 800;
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
      color: v-bind(themeID);
    }
  }
}
.checkbox-div {
  flex-grow: 1;
}

.notification-title {
  flex-grow: 6;
}

.notification-content {
  width: 50%;
}

.details-div {
  flex-grow: 8;
  width: 80%;
}

.icons-div {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.created-since {
  white-space: nowrap;
}

.snooze-cancel {
  height: 22px;
}

.snooze-done {
  height: 19px;
}

.icons-time-div {
  width: 9.5em;
  text-align: right;
}

.check-icon {
  font-family: system-ui, sans-serif;
  font-weight: bold;
  line-height: 1.1;
  display: grid;
  grid-template-columns: 1em auto;
}

input[type='checkbox'] {
  -webkit-appearance: none;
  position: relative;
  appearance: none;
  margin: 0;
  font: inherit;
  color: currentColor;
  width: 1.15em;
  height: 1.15em;
  border: 0.15em solid currentColor;
  border-radius: 0.15em;
  display: grid;
  place-content: center;
  display: grid;
  place-content: center;
}

input[type='checkbox']::before {
  content: '';
  width: 0.65em;
  height: 0.65em;
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em var(--form-control-color);
  background-color: CanvasText;
  transform-origin: bottom left;
  clip-path: polygon(17% 50%, 7% 55%, 50% 82%, 98% 5%, 90% 0%, 48% 70%); /* Adjusted clip-path values */
}

input[type='checkbox']:checked::before {
  position: relative;
  top: 1px;
  left: 0px;
  transform: scale(1.9) skewX(-10deg) skewY(14deg);
  z-index: 1;
  background-color: #181146;
}

input[type='checkbox']:checked::after {
  content: '';
  width: 5px;
  height: 7px;
  display: block;
  right: -2px;
  z-index: 0;
  top: 1px;
  background: inherit;
  position: absolute;
  transform: skew(0deg, -50deg);
}

input[type='checkbox']:disabled {
  opacity: 0.2;
  cursor: auto;
}

.more-btn {
  border-width: 0px;
  background-color: white;
}
.more-icon {
  width: 20px;
  height: 20px;
}

.snooze-bar {
  display: flex;
  align-items: center;
}

.snooze-amount {
  background-color: transparent;
  -moz-appearance: textfield;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid #181146;
  text-align: center;
}

.snooze-amount::-webkit-inner-spin-button,
.snooze-amount::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.snooze-variant-m {
  position: relative;
  background-color: transparent;
  border-radius: 8px;
  border: 1px solid #181146;
  color: #181146;
  width: 95px;
  height: 30px;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn {
  cursor: pointer;
}

.dropdown-menu-snooze {
  position: absolute;
  top: 100%;
  right: 0%;
  z-index: 1;
  background-color: white;
  border: 0px;
  box-shadow: 2px 2px 4px 4px rgba(0, 0, 0, 0.04);
  width: 100px;
  max-height: 78px;
  overflow-y: hidden;
  border-radius: 10px;
  padding: 2px 0px 2px 0px;
}

.dropdown-item-snooze {
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #ddd;
  padding: 3px 2px 3px 5px;
  text-align: left;
  background-color: #fff;
  color: #181146;
  padding: 3px 5px;
  height: 25px;
}

.dropdown-item-snooze:hover {
  background-color: #f0f0f0;
}

.no-border {
  border: 0px;
}

.blur-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
}
.blur-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.795);
  z-index: 2;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.185);
}

.popup {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  transform: translate(-50%, -50%);
}

.listItem {
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #ddd;
  padding: 6px 40px 6px 10px;
  text-align: left;
}

.listMenu {
  background-color: transparent;
  border-radius: 8px;
  border: 1px solid #181146;
  box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.04);
  width: 100px;
  max-height: 112px;
  overflow-y: hidden;
  padding: 5px 0px 5px 0px;
}

.slide-transition {
  -webkit-animation: slide 0.5s forwards;
  -webkit-animation-delay: 2s;
  animation: slide 0.5s forwards;
  animation-delay: 2s;
}

@-webkit-keyframes slide {
  100% {
    left: 0;
  }
}

@keyframes slide {
  100% {
    left: 0;
  }
}
</style>
