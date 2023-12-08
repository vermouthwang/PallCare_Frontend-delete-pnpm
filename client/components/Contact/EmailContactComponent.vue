<script setup lang="ts">
import { onBeforeMount } from "vue";
import { useContactStore } from "../../stores/contact";
const { getContacts} = useContactStore();

const props = defineProps(["emailUser"]);
const emit = defineEmits(["refreshContacts"]);
</script>

<template>
        <div class="user">
            <img src="@/assets/images/user.svg"/>
            <div class="info">
                <text>{{props.emailUser.contactname}}</text>
                <text>{{props.emailUser.contactemailaddress}}</text>
            </div>
        </div>
</template>

<style scoped>
h1 {
    text-align: center;
}

.user {
    display: flex;
    flex-direction: row;
    /* justify-content: start; */
    gap: 10px;
    margin-bottom: 10px;
  }

.info {
    display: flex;
    flex-direction: column;
    justify-content: start;
    /* margin-bottom: 10px; */
  }


    
</style>