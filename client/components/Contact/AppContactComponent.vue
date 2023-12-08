<script setup lang="ts">
import { useContactStore } from "../../stores/contact";

const { getContacts} = useContactStore();

const props = defineProps(["appUser"]);
</script>

<template>
        <div class="user">
            <img src="@/assets/images/profile.svg"/>
            <p>{{props.appUser}}</p>
        </div>
</template>

<style scoped>
h1 {
    text-align: center;
}

.user {
    display: flex;
    flex-direction: row;
    justify-content: start;
    gap: 10px;
    margin-bottom: 10px;
  }

    
</style>