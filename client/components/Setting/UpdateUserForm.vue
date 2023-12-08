<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

let username = ref("");
let password = ref("");

const { updateUser, updateSession } = useUserStore();

async function updateUsername() {
  await updateUser({ username: username.value });
  await updateSession();
  username.value = "";
}

async function updatePassword() {
  await updateUser({ password: password.value });
  await updateSession();
  password.value = "";
}
</script>

<template>
  <div class="section">
  <form @submit.prevent="updateUsername" >
    <fieldset>
      <legend>Change your username</legend>
      <input class="custom-input" type="text" placeholder="New username" v-model="username" required />
      <button type="submit" >Update username</button>
    </fieldset>
  </form>

  <form @submit.prevent="updatePassword" >
    <fieldset>
      <legend>Change your password</legend>
      <input class="custom-input" type="password" placeholder="New password" v-model="password" required />
      <button type="submit" >Update password</button>
    </fieldset>
  </form>
</div>
</template>


<style>
fieldset {
  border: none;
}

h2 {
  text-align: center;
  letter-spacing: 0.06em;
  font-size: 0.9em;
  text-transform: uppercase;
}

.custom-input {
  border: 2px solid black;
  border-radius: 10px;
  background: transparent;
  padding: 10px;
  outline: none;
  appearance: none; 
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 150px;
  margin-bottom: 20px;
}

form {
  display: flex;
  gap: 0.5em;
  align-items: center;
  padding-left: 1em;
  padding-top: 0.5em;
}

legend {
  text-align: left;
  font-size: 0.9em;
}



button {
  height: 40px;
}


button:hover {
  background:rgba(255, 255, 255, 0.3); 
}
</style>

