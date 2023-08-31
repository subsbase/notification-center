<template>
  <div class="snooze-bar-m d-flex">
    <input type="number" class="snooze-amount-m m-5" v-model="snoozeAmount" @click.stop>
    <select name="snooze-variant" id="snooze-variant-m" v-model="snoozeVariant" class="snooze-variant m-5" @click.stop>
      <option value="Minutes" > Minutes</option>              
      <option value="Hours" > Hours</option>
      <option value="Days"  > Days</option>
    </select>
    <img src="../assets/Remove.svg" alt="Cancel" class="btn m-5" @click.stop="{ emit('hide-snooze-popup');}">
    <img src="../assets/Done.svg" alt="Confirm" class="btn m-5" @click.stop="handleSnoozeInput">
  </div>
</template>

<script setup>
import { defineEmits, ref } from "vue";

const snoozeAmount = ref();
const snoozeVariant = ref();

const emit = defineEmits(['multi-snooze-input','hide-snooze-popup']);

const handleSnoozeInput = () => {
  if(!snoozeAmount || !snoozeVariant){
    //show a warning message!
  }
  else{
    emit('hide-snooze-popup')
    emit('multi-snooze-input', [snoozeAmount.value, snoozeVariant.value]);
  }
};
</script>

<style>
.snooze-bar-m{
  position: absolute;
  top: 50%;
  left: 38%;
  background: #fff;
  width: fit-content;
  padding: 15px 45px 15px 45px;
  border-radius: 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}
.snooze-amount-m{
  background-color: transparent;
  -moz-appearance: textfield;
  width: 40px;
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

.snooze-variant-m{
  background-color: transparent;
  border-radius: 8px;
  border: 1px solid #181146;
  width: 130px;
}

.btn:hover{
  cursor:pointer;
}
</style>