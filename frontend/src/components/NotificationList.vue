<template>
  <div class="font-dark parent-container">
    <!-- <div class="blur-bg"></div> -->
    <div class="x-between px-20 py-20">
    <h4 class="font-size-16 mb-10">
      <i v-if="source === 'page'" class="fa fa-chevron-left mr-20 clickable" @click="goBack"></i>
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
    <Dropdown v-if="multiSelect" class="more-btn" :items="multiActionsAll" @on-selected="handleSelectedAction"/>
    <p v-else-if="notifications.length > 0" class="link clickable mt-0 text-right mark-all-read-link" @click="handleMarkAllAsRead">
      Mark all as read
    </p>
    </div>
    <div v-else class="x-row">
    <Dropdown v-if="multiSelect" class="more-btn" :items="multiActionsArchive" @on-selected="handleSelectedAction"/>
  </div>
 </div>

  <div :class="['px-20', source === 'page' ? '' : 'notification-list']" v-if="notifications.length">
    <div
      v-for="(notification, index) in notifications"
      :key="notification._id"
      :class="['notification-row my-20', { 'read-notification': notification.read }, { 'selected-notification' : checked[index]}]"
      @click="handleMarkAsRead(notification._id, notification.actionUrl)"
    >
    <div class="d-flex font-size-12">
    <div class="x-start checkbox-div mr-10">
      <input :class="{'check-icon': checked[index] , 'unread-notif-bg': !notification.read}" type="checkbox" id="checkbox" v-model="checked[index]" @change="handleChecked(notification._id,index)" @click.stop/>
    </div>
    <div class="x-between font-size-12 details-div">
        <div class="my-5 notification-content">
          <p class="bold m-0 ml-0">
            {{ notification.title }}
          </p>
          <p class=" " v-html="notification.message"></p>
        </div>
          <!-- Here we add unarchive icon to archived and archive icon for all-->
        <div  class="icons-div mr-20 mb-10 ">
        <div >
        <div class="d-flex x-row">
         <div class="icons-time-div">
          <div class="x-end mr-25">
          <img
            v-if="notification.archivedAt "
            class="clickable top-1 pos-relative mx-10"
            src="../assets/unarchive-icon.svg"
            @click.stop="handleUnArchiveNotification([notification._id])"
          />
          <div v-else-if="!multiSelect" class="x-end">
            <img
            class="clickable top-1 pos-relative mx-10"
            src="../assets/Snooze.svg"
            @click.stop="()=>{snoozeSingle[index]=!snoozeSingle[index]}"
          /> 
          <!-- snooze handler missing -->
            <img
            class="clickable top-1 pos-relative"
            src="../assets/archive-icon.svg"
            @click.stop="handleArchiveNotification([notification._id])"
          />
        </div>
        <span v-if="!notification.read" class="blue-circle ml-10 mt-10"/>
        <span v-else></span>
          </div>
          <p class="light ml-20 mt-10 x-end created-since">
          {{getNotificationTime(notification.createdAt)}}
          </p>
         </div>
          <div v-if="snoozeSingle[index] && !multiSelect" class="snooze-bar d-flex">
            <input type="number" class="snooze-amount m-5" v-model="snoozeAmount" @click.stop>
            <select name="snooze-variant" id="snooze-variant" v-model="snoozeVariant" class="snooze-variant m-5" @click.stop >
              <option value="Minutes" > Minutes</option>              
              <option value="Hours" > Hours</option>
              <option value="Days"  > Days</option>
            </select>
            <img src="../assets/Remove.svg" alt="Cancel" class="m-5" @click.stop="()=>{snoozeSingle[index]=!snoozeSingle[index]}">
            <img src="../assets/Done.svg" alt="Confirm" class="m-5" @click.stop="()=>{snoozeSingle[index]=!snoozeSingle[index]; handleSnoozeSingle(notification._id);}">
          </div>
         </div>
        </div>
        </div>
      </div>
      </div>

      <div class="x-between font-size-12">
        <p>
          {{ notification.content }}
        </p>
      </div>
    </div>
  </div>
  <div v-else class="d-flex">
    <span class="mx-auto font-size-14">{{
      selectedFilter === 'All' ? 'No notifications' : 'No archived notifications'
    }}</span>
  </div>
  <SnoozePopup  v-if="snoozeMulti" class="popup"
  @multi-snooze-input="(param) =>{snoozeAmountMulti=param[0]; snoozeVariantMulti=param[1]}"
  @hide-snooze-popup="()=> {snoozeMulti=false}"
  ></SnoozePopup>
</div>

</template>

<script setup>
import { defineProps, defineEmits, onBeforeMount, ref, watch} from 'vue'
import moment from 'moment'
import { archiveNotification, markAllAsRead, markAsRead, unArchiveNotification, markAsUnread, snoozeNotification } from '@/services/notifications'
import { getSubscriberId, getThemeId } from '../utils.js'
import SnoozePopup from './SnoozePopup.vue';
import Dropdown from './Dropdown.vue';

const emit = defineEmits(['on-click-mark-read','on-click-mark-unread','on-snooze-notific'])

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
const multiSelect = ref(false);
const multiActionsAll = ref(['Archive','Snooze','Mark As Read','Mark As Unread'])
const multiActionsArchive = ref(['Unarchive'])
const multiActionSelected = ref('')
const snoozeSingle = ref([])
const snoozeAmount = ref(null)
const snoozeVariant = ref(null)
const snoozeMulti = ref(false)
const snoozeAmountMulti = ref()
const snoozeVariantMulti = ref("")

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
  selectedNotificList.value = [];
  emit('on-handle-archive-unarchive', filterType) //  this is where we emit the filter change and in response the parent component fetches the filtered notifications
}

const handleArchiveNotification = (notifications) => {
  const payload = notifications
  archiveNotification(subscriberID.value, payload) // this part handles the archive
    .then(() => {
      emit('on-click-mark-read', selectedFilter.value) // this part emits change to the parent which will fetch the changed data
    })
    .catch((err) => {
      console.error(err)
    })
}

const handleUnArchiveNotification = (notifications) => {
  const payload = notifications
  unArchiveNotification(subscriberID.value, payload) // this part handles the unarchive
    .then(() => {
      emit('on-click-mark-read', selectedFilter.value) // this part emits change to the parent which will fetch the changed data
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

const handleChecked = (nId, idx) =>{
  if(checked.value[idx]){
    selectedNotificList.value.push(nId)
  }else{
    const toDelete = selectedNotificList.value.findIndex((i) => i===nId)
    selectedNotificList.value.splice(toDelete, 1)
  }
  multiSelect.value= selectedNotificList.value.length<=0 ? false : true;
}

const calculateUTC = (amount,variant) => {
  const result = new Date();
  const year = result.getUTCFullYear();
  const month = result.getUTCMonth() + 1; // Months are zero-based, so add 1
  const day = result.getUTCDate();
  const hours = result.getUTCHours();
  const minutes = result.getUTCMinutes();
  const seconds = result.getUTCSeconds();

  if(variant.value==="Minutes"){
    result.setUTCMinutes(minutes+amount)
  }
  if(variant.value==="Hours"){
    result.setUTCHours(hours+amount)
  }
  if(variant.value==="Days"){
    result.setUTCDate(day+amount)
  }
  return result.toISOString();
}

const handleSnoozeSingle =(nId) =>{
  const result = calculateUTC(snoozeAmount.value,snoozeVariant.value)
  const data={
    "NotificationsIds":[nId],
    "snoozeUntil": result
  }
  snoozeNotification(subscriberID.value, data) // this part handles the unarchive
    .then(() => {
      emit('on-snooze-notific', selectedFilter.value) // this part emits change to the parent which will fetch the changed data
    })
    .catch((err) => {
      console.error(err)
    })
  snoozeAmount.value=null
  snoozeVariant.value=null
}

const handleSnoozeMulti = (notifications) =>{
  const snoozeMultiDate = calculateUTC(snoozeAmountMulti,snoozeVariantMulti);
  const payload = {
    "notificationsIds": notifications,
    "snoozeUntil": snoozeMultiDate
  }
  snoozeNotification(subscriberID.value, payload) // this part handles the unarchive
    .then(() => {
      emit('on-snooze-notific', selectedFilter.value) // this part emits change to the parent which will fetch the changed data
    })
    .catch((err) => {
      console.error(err)
    })
}

const handleSelectedAction = (param) => {
  multiActionSelected.value = param;

  if(multiActionSelected.value=='Archive'){
    handleArchiveNotification(selectedNotificList.value)
  }
  if(multiActionSelected.value=='Unarchive'){
    handleUnArchiveNotification(selectedNotificList.value)
  }
  if(multiActionSelected.value=='Snooze'){
    snoozeMulti.value=true
    handleSnoozeMulti(selectedNotificList.value)
    
  }
  if(multiActionSelected.value=='Mark As Read'){
    let notification
    for(let notifId of selectedNotificList.value){
      notification = props.notifications.filter((notif) => notif._id == notifId)[0]
      handleMarkAsRead(notifId, notification.actionUrl)
    }
  }
  if(multiActionSelected.value=='Mark As Unread'){
    let notification
    for(let notifId of selectedNotificList.value){
      notification = props.notifications.filter((notif) => notif._id == notifId)[0]
      handleMarkAsUnread(notifId, notification.actionUrl)
    }
  }
  multiSelect.value = false
  checked.value = []
  selectedNotificList.value = [];
}

</script>

<style lang="scss">

.link {
  color: v-bind(themeID);
  text-decoration: underline;
  font-weight: 500;
}

.unread-notif-bg{
  background-color: #EBEFF6
}

.mark-all-read-link{
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
.checkbox-div{
    flex-grow: 1;
}

.notification-content{
    flex-grow: 6;
}
.details-div{
    flex-grow: 8;
    width: 80%;
}

.icons-div{
    display: flex;
    flex: 2;
    align-items: right;
    justify-content: flex-end;
}

.icons-time-div{
  width: 9.5em;
  text-align: right;
}

.created-since{
  position: absolute;
}

.check-icon {
  font-family: system-ui, sans-serif;
  font-weight: bold;
  line-height: 1.1;
  display: grid;
  grid-template-columns: 1em auto;

}
input[type="checkbox"]::before {
  content: "";
  width: 0.65em;
  height: 0.65em;
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em var(--form-control-color);
  background-color: CanvasText;
  transform-origin: bottom left;
  clip-path: polygon(17% 50%, 7% 55%, 50% 82%, 98% 5%, 90% 0%, 48% 70%); /* Adjusted clip-path values */
  
}

input[type="checkbox"]:checked::before {
  position: relative;
  top:1px;
  left: 0px;
  transform: scale(1.9) skewX(-10deg) skewY(14deg);
  z-index: 2;
  background-color:#181146;
}
input[type="checkbox"]:checked::after {
  content: '';
  width: 5px;
  height: 7px;
  display: block;
  right: -2px;
  z-index: 1;
  top: 1px;
  background: inherit;
  position: absolute;
  transform: skew(0deg,-50deg)
}
input[type=checkbox]{
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
.more-btn{
  border-width: 0px;
  background-color: white;
}
.more-icon{
  width: 20px;
  height: 20px;
}

.snooze-amount{
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

.snooze-variant{
  background-color: transparent;
  border-radius: 8px;
  border: 1px solid #181146;
}

.parent-container{
  position: relative; /* Make sure it's relative for absolute positioning of the shadow */
  width: 100%;
  height: 100%;
}

.blur-bg{
  position: absolute; /* Required for positioning the ::before pseudo-element */
  width: 300px; /* Adjust the width as needed */
  height: 200px; /* Adjust the height as needed */
  z-index: 0;
}
.blur-bg::before{
  content: ""; /* Required for the pseudo-element to generate content */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5); /* Translucent white color */
  z-index: -1; /* Place the shadow behind the content */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Adjust the shadow properties as needed */
}

.popup{
  z-index: 2;
}

</style>
