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
          <Dropdown
            v-if="multiSelect"
            class="more-btn"
            :items="['Archive', 'Snooze', 'Mark As Read', 'Mark As Unread']"
            @on-selected="handleSelectedAction"
          />
          <p
            v-else-if="notifications.length > 0"
            class="link clickable mt-0 text-right mark-all-read-link"
            @click="handleMarkAllAsRead"
          >
            Mark all as read
          </p>
        </div>
        <div v-else>
          <Dropdown v-if="multiSelect" class="more-btn" :items="['Unarchive']" @on-selected="handleSelectedAction" />
        </div>
      </div>
      <div v-if="notifications.length > 0" :class="['px-20', source === 'page' ? '' : 'notification-list']">
        <div
          v-for="(notification, index) in notifications"
          :key="notification._id"
          :class="[
            'notification-row my-20',
            { 'read-notification': notification.read },
            { 'selected-notification': checked[index] },
            { 'slide-transition': slideNotification[index] }
          ]"
          @click="handleMarkAsRead(notification._id, notification.actionUrl)"
        >
          <div class="x-wrap d-flex font-size-12">
            <div class="x-start checkbox-div mr-10">
              <input
                id="checkbox"
                v-model="checked[index]"
                :disabled="snoozeMulti"
                :class="['ml-10', { 'check-icon': checked[index], 'unread-notif-bg': !notification.read }]"
                type="checkbox"
                @change="handleChecked(notification._id, index)"
                @click.stop
              />
            </div>
            <div class="x-between font-size-12 details-div">
              <div class="notification-content">
                <p class="bold font-size-12">
                  {{ notification.title }}
                </p>
                <p class="mt-2" v-html="notification.message"></p>
              </div>
              <div class="mr-5 icons-time-div">
                <div class="d-flex x-row x-end">
                  <div class="icons-div">
                    <img
                      v-if="notification.archivedAt && !multiSelect"
                      class="clickable top-1 pos-relative"
                      src="../assets/unarchive-icon.svg"
                      @click.stop="handleUnArchiveNotification([notification._id], [index])"
                    />
                    <div v-else-if="!multiSelect" class="x-end">
                      <img
                        class="clickable top-1 pos-relative mx-10"
                        src="../assets/snooze.svg"
                        @click.stop="openSnoozeInput(index)"
                      />
                      <img
                        class="clickable top-1 pos-relative"
                        src="../assets/archive-icon.svg"
                        @click.stop="handleArchiveNotification([notification._id], [index])"
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

            <div v-if="currentsnoozeIndex === index && !multiSelect" class="snooze-bar d-flex x-between my-10">
              <div class="d-flex snooze-inputs x-row">
                <input
                  v-model="snoozeAmount"
                  type="number"
                  :class="['snooze-amount m-5', { 'invalid-input': invalidInput }]"
                  @change="invalidInput = false"
                  @click.stop
                />
                <div class="m-5 rel">
                  <button class="btn snooze-variant-m" @click.stop="snoozeDropdown = !snoozeDropdown">
                    <div class="selector">{{ snoozeVariant }}</div>
                    <chevron></chevron>
                  </button>
                  <ul v-if="snoozeDropdown" class="dropdown-menu-snooze-n">
                    <li v-for="(snoozeItem, index) of snoozeItems" :key="snoozeItem">
                      <div
                        class="dropdown-item-snooze"
                        :class="{ 'no-border': index === snoozeItems.length - 1 }"
                        :value="snoozeItem"
                        @click.stop="handleVariantChoice(snoozeItem)"
                      >
                        {{ snoozeItem }}
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="snooze-icons d-flex">
                <img
                  src="../assets/remove.svg"
                  alt="Cancel"
                  class="m-5 snooze-cancel"
                  @click.stop="
                    () => {
                      currentsnoozeIndex = -1
                    }
                  "
                />
                <img
                  src="../assets/done.svg"
                  alt="Confirm"
                  class="m-5 snooze-done"
                  @click.stop="
                    () => {
                      handleSnooze([notification._id], [index], null)
                    }
                  "
                />
              </div>
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
          handleSnooze(selectedNotificList, selectedIdxs, param)
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
  unArchiveNotification,
  snoozeNotification,
  markManyAsRead,
  markManyAsUnread
} from '@/services/notifications'
import { getSubscriberId, getThemeId } from '../utils.js'
import SnoozePopup from './SnoozePopup.vue'
import Dropdown from './Dropdown.vue'
import chevron from '@/icons/chevron.vue'

const emit = defineEmits([
  'on-click-mark-read',
  'on-click-mark-unread',
  'on-change-filter',
  'on-handle-snooze',
  'on-handle-archive-unarchive'
])

defineProps({
  notifications: { type: Array, default: () => [] },
  source: { type: String, default: () => {} },
  unreadCount: { type: Number, default: () => {} }
})

const subscriberID = ref('')
const themeID = ref('')
const selectedFilter = ref('All')
const filters = ref(['All', 'Archive'])
const checked = ref([])
const selectedIdxs = ref([])
const selectedNotificList = ref([])
const multiSelect = ref(false)
const multiActionSelected = ref('')
const currentsnoozeIndex = ref()
const snoozeAmount = ref(0)
const snoozeVariant = ref('Minutes')
const snoozeMulti = ref(false)
const snoozeDropdown = ref(false)
const snoozeItems = ref(['Minutes', 'Hours', 'Days'])
const slideNotification = ref([])
const invalidInput = ref(false)

onBeforeMount(() => {
  subscriberID.value = getSubscriberId()
  themeID.value = getThemeId()
  emit('on-change-filter', 'All')
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
  console.log('before emit', filterType)
  emit('on-change-filter', filterType)
}

const handleChecked = (nId, idx) => {
  const toDelete = selectedNotificList.value.findIndex((i) => i === nId)
  if (toDelete > -1) {
    selectedNotificList.value.splice(toDelete, 1)
    selectedIdxs.value.splice(
      selectedIdxs.value.findIndex((i) => i === idx),
      1
    )
  } else {
    selectedNotificList.value.push(nId)
    multiSelect.value = true
    selectedIdxs.value.push(idx)
  }
  multiSelect.value = selectedNotificList.value.length <= 0 ? false : true
}

const handleArchiveNotification = (notifications, notifIdxs) => {
  const payload = notifications
  archiveNotification(subscriberID.value, payload)
    .then(() => {
      notifIdxs.forEach((idx) => {
        slideNotification.value[idx] = true
        setTimeout(() => {
          emit('on-handle-archive-unarchive', idx)
          slideNotification.value = []
        }, 650)
      })
    })
    .catch((err) => {
      console.error(err)
    })
}

const handleUnArchiveNotification = (notifications, notifIdxs) => {
  const payload = notifications
  unArchiveNotification(subscriberID.value, payload)
    .then(() => {
      notifIdxs.forEach((idx) => {
        slideNotification.value[idx] = true
        setTimeout(() => {
          emit('on-handle-archive-unarchive', idx)
          slideNotification.value = []
        }, 650)
      })
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

const handleMarkAsReadMulti = (notificationIds) => {
  if (selectedFilter.value === 'All') {
    markManyAsRead(subscriberID.value, notificationIds)
      .then(() => {
        emit('on-click-mark-read', selectedFilter.value)
      })
      .catch((err) => {
        console.error(err)
      })
  }
}

const handleMarkAsRead = (notificationId, actionUrl) => {
  if (selectedFilter.value === 'All') {
    markManyAsRead(subscriberID.value, [notificationId])
      .then(() => {
        emit('on-click-mark-read', selectedFilter.value)
        window.top.location.href = actionUrl
      })
      .catch((err) => {
        console.error(err)
      })
  }
}

const handleMarkAsUnread = (notificationIds) => {
  if (selectedFilter.value === 'All') {
    markManyAsUnread(subscriberID.value, notificationIds)
      .then(() => {
        emit('on-click-mark-unread', selectedFilter.value)
      })
      .catch((err) => {
        console.error(err)
      })
  }
}

const calculateUTC = (amount, variant) => {
  const result = new Date()
  const day = result.getUTCDate()
  const hours = result.getUTCHours()
  const minutes = result.getUTCMinutes()
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

const handleVariantChoice = (snoozeItem) => {
  snoozeVariant.value = snoozeItem
  snoozeDropdown.value = false
}

const openSnoozeInput = (index) => {
  currentsnoozeIndex.value = index
  invalidInput.value = false
}

const handleSnooze = (notifIds, notifIdxs, snoozeInputs = null) => {
  if (snoozeInputs && multiSelect) {
    snoozeAmount.value = snoozeInputs[0]
    snoozeVariant.value = snoozeInputs[1]
  } else if (snoozeAmount.value <= 0) {
    invalidInput.value = true
    return
  }
  const result = calculateUTC(snoozeAmount.value, snoozeVariant.value)
  const data = {
    notificationsIds: notifIds,
    snoozeUntil: result
  }
  snoozeNotification(subscriberID.value, data)
    .then(() => {
      notifIdxs.forEach((idx) => {
        slideNotification.value[idx] = true
        setTimeout(() => {
          emit('on-handle-snooze', idx)
          slideNotification.value = []
        }, 650)
      })
    })
    .catch((err) => {
      console.error(err)
    })
  snoozeAmount.value = 0
  snoozeVariant.value = 'Minutes'
  if (multiSelect.value) {
    selectedNotificList.value = []
    selectedIdxs.value = []
    multiSelect.value = false
    checked.value = []
  }
  currentsnoozeIndex.value = -1
}

const handleSelectedAction = (param) => {
  multiActionSelected.value = param

  if (multiActionSelected.value == 'Archive') {
    handleArchiveNotification(selectedNotificList.value, selectedIdxs.value)
    checked.value = []
    multiSelect.value = false
    selectedNotificList.value = []
    selectedIdxs.value = []
  }
  if (multiActionSelected.value == 'Unarchive') {
    handleUnArchiveNotification(selectedNotificList.value, selectedIdxs.value)
    checked.value = []
    multiSelect.value = false
    selectedNotificList.value = []
    selectedIdxs.value = []
  }
  if (multiActionSelected.value == 'Snooze') {
    snoozeMulti.value = true
  }
  if (multiActionSelected.value == 'Mark As Read') {
    handleMarkAsReadMulti(selectedNotificList.value)
    checked.value = []
    multiSelect.value = false
    selectedNotificList.value = []
    selectedIdxs.value = []
  }
  if (multiActionSelected.value == 'Mark As Unread') {
    handleMarkAsUnread(selectedNotificList.value)
    checked.value = []
    multiSelect.value = false
    selectedNotificList.value = []
    selectedIdxs.value = []
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
  width: 5%;
}

.details-div {
  flex: 9 0 0%;
}

.notification-content {
  flex-grow: 7;
  width: 85%;
}

.icons-time-div {
  flex-grow: 1;
  width: 15%;
}

.icons-div {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.created-since {
  white-space: nowrap;
  font-weight: 400;
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
  width: 1.35em;
  height: 1.35em;
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
  flex: 1 1 0%;
}

.snooze-amount {
  background-color: transparent;
  -moz-appearance: textfield;
  appearance: textfield;
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

.snooze-cancel {
  height: 22px;
}

.snooze-done {
  height: 19px;
}

.btn {
  cursor: pointer;
}

.dropdown-menu-snooze-n {
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
  animation: slide-right 0.3s forwards;
  animation-delay: 0.3s;
}

.invalid-input {
  border: 2px solid red;
  -webkit-animation: shake-horizontal 0.7s cubic-bezier(0.455, 0.03, 0.515, 0.955) both;
  animation: shake-horizontal 0.7s cubic-bezier(0.455, 0.03, 0.515, 0.955) both;
}

@keyframes slide-right {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
}

@-webkit-keyframes slide-right {
  0% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
  }
  100% {
    -webkit-transform: translateX(100%);
    transform: translateX(100%);
  }
}

@-webkit-keyframes shake-horizontal {
  0%,
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70% {
    -webkit-transform: translateX(-8px);
    transform: translateX(-8px);
  }
  20%,
  40%,
  60% {
    -webkit-transform: translateX(8px);
    transform: translateX(8px);
  }
  80% {
    -webkit-transform: translateX(5px);
    transform: translateX(5px);
  }
  90% {
    -webkit-transform: translateX(-5px);
    transform: translateX(-5px);
  }
}

@keyframes shake-horizontal {
  0%,
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70% {
    -webkit-transform: translateX(-8px);
    transform: translateX(-8px);
  }
  20%,
  40%,
  60% {
    -webkit-transform: translateX(8px);
    transform: translateX(8px);
  }
  80% {
    -webkit-transform: translateX(5px);
    transform: translateX(5px);
  }
  90% {
    -webkit-transform: translateX(-8px);
    transform: translateX(-8px);
  }
}
</style>
