<template>
        <div v-if="snoozeSingle[index]" class="snooze-bar d-flex">
           <input type="number" class="snooze-amount m-5" v-model="snoozeAmount" @click.stop>
           <select name="snooze-variant" id="snooze-variant" v-model="snoozeVariant" class="snooze-variant m-5" @click.stop >
             <option value="Minutes" > Minutes</option>              
             <option value="Hours" > Hours</option>
             <option value="Days"  > Days</option>
           </select>
           <img src="../assets/Remove.svg" alt="Cancel" class="m-5" @click.stop="()=>{snoozeSingle[index]=!snoozeSingle[index]}">
           <img src="../assets/Done.svg" alt="Confirm" class="m-5" @click.stop="()=>{snoozeSingle[index]=!snoozeSingle[index]; handleSnoozeSingle(notification._id);}">
        </div>
</template>

<script>

</script>

<style>
</style>