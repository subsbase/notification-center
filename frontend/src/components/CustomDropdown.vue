<script setup >

import { defineProps, defineEmits, ref } from "vue";

defineProps({
    items: { type: Array, default: () => []}
})

const emit = defineEmits(['on-selected'])

const dropdownMenu = ref(false);
const selected=ref("");

const openDropdownMenu = () => {
    dropdownMenu.value = !dropdownMenu.value;
}
const handleSelect = (val) => {
    selected.value = val;
    dropdownMenu.value = false;
    emit('on-selected', selected.value)
}

</script>

<template>
<div>
  <button @click="openDropdownMenu" class="more-btn" > 
    <img src="../assets/more.svg" alt="more-icon">
  </button>
  <div v-if="dropdownMenu" class="dropdown-menu">
    <div v-for="item of items" :key="item" >
        <div class="dropdown-item" v-bind:value="item" @click="handleSelect(item)"> {{item}}</div>
    </div>
  </div>
  
</div>
</template>

<style>
.more-btn {
  border: none;
  background-color: white;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 90px; /* Adjust the top position to be just below the button */
  right: 35px;
  z-index: 100;
  background-color: white;
  border: 0px;
  box-shadow: 2px 2px 4px 4px rgba(0, 0, 0, 0.04);
  width: 150px;
  max-height: 108px;
  overflow-y: hidden;
  border-radius: 10px;
  border-top-right-radius: 0px;
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #ddd;
  padding: 6px 40px 6px 10px; 
  text-align: left;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}
</style>