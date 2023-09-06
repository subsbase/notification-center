<template>
  <div class="snooze-bar-m d-flex">
    <input
      type="number"
      class="snooze-amount-m m-5"
      v-model="snoozeAmount"
      @click.stop
    />
    <div class="m-5">
      <button @click="dropdownMenu=!dropdownMenu" class="btn snooze-variant-m" > 
        <div class="selector"> {{ snoozeVariant }} </div>
        <chevron></chevron>
      </button>
      <ul v-if="dropdownMenu" class="dropdown-menu-snooze">
        <li v-for="(item, index) of items" :key="item" >
          <div class="dropdown-item-snooze" :class="{'no-border': index === items.length - 1 }" v-bind:value="item" @click="handleSelect(item)"> {{item}}</div>
        </li>
      </ul>
    </div>
    <img
      src="../assets/Remove.svg"
      alt="Cancel"
      class="btn m-5"
      @click.stop="{ emit('hide-snooze-popup');}"
    />
    <img
      src="../assets/Done.svg"
      alt="Confirm"
      class="btn m-5"
      @click.stop="handleSnoozeInput"
    />
  </div>
</template>

<script setup>
import { defineEmits, ref } from "vue";
import chevron from '../icons/chevron.vue'

const snoozeAmount = ref(0);
const snoozeVariant = ref('Minutes');
const items = ref(['Minutes','Hours','Days']);
const dropdownMenu = ref(false);

const emit = defineEmits(['multi-snooze-input', 'hide-snooze-popup']);

const handleSnoozeInput = () => {
  if (!snoozeAmount || !snoozeVariant) {
    //show a warning message!
  } else {
    emit('hide-snooze-popup');
    emit('multi-snooze-input', [snoozeAmount.value, snoozeVariant.value]);
  }
};

const handleSelect = (val) => {
    snoozeVariant.value = val;
    dropdownMenu.value = false;
}

</script>

<style>

.snooze-bar-m {
  background: #fff;
  width: fit-content;
  padding: 15px 45px 15px 45px;
  border-radius: 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}

.snooze-amount-m {
  background-color: transparent;
  -moz-appearance: textfield;
  width: 40px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid #181146;
  color: #181146;
  text-align: center;
}

.snooze-amount-m::-webkit-inner-spin-button,
.snooze-amount-m::-webkit-outer-spin-button {
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
  top: 75%; 
  right: 35%;
  z-index: 1;
  background-color: white;
  border: 0px;
  box-shadow: 2px 2px 4px 4px rgba(0, 0, 0, 0.04);
  width: 100px;
  max-height: 78px;
  overflow-y: hidden;
  border-radius: 10px;
  padding: 2px 0px 2px 0px ;
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

.no-border{
  border: 0px;
}

</style>
