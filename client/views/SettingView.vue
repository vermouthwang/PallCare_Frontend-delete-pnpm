<script setup lang="ts">
import router from "@/router";
import { usePreferenceStore } from "@/stores/preference";
import { useUserStore } from "@/stores/user";

import { storeToRefs } from "pinia";
import { ref } from "vue";
import PreferenceForm from "../components/Preference/PreferenceForm.vue";
import UpdateUserForm from "../components/Setting/UpdateUserForm.vue";

const { currentUsername } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();
const { updatePreferences } = usePreferenceStore();

const days = ref(null)


async function updateTimeCapsule() {
  await updatePreferences({ timeCapsule: days.value });
}

async function logout() {
  await logoutUser();
  void router.push({ name: "Home" });
}

async function delete_() {
  await deleteUser();
  void router.push({ name: "Home" });
}

async function goHome() {
  void router.push({ name: "Home" });
}
</script>

<template>
  <main class="column">
    <img @click="goHome" src="@/assets/images/back.svg" class="back-button"/>

    <h1 class="title">Settings for {{ currentUsername }}</h1>

    <div class="buttons">
      <button  @click="logout">Logout</button>
      <button class="delete" @click="delete_">Delete User</button>
    </div>
    
    <div>
      <UpdateUserForm />
    </div>
    <div>
      <form @submit.prevent="updateTimeCapsule" >
        <fieldset>
          <legend>Update Time Capsule</legend>
          <input class="custom-input" type="password" placeholder="Number of Days" v-model="days" required />
          <button type="submit" >Update Days</button>
        </fieldset>
      </form>
    </div>

    <div class="preferences">
      <p>Update User Preferences:</p>
      <PreferenceForm/>
    </div>

   
    
  </main>
</template>

<style scoped>
.delete {
  background: red
}

.preferences {
  margin-bottom: 50px;
}

button {
  margin-bottom: 10px;
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
.column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2.5em;
}

main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.back-button {
  position: absolute;
  top: 40px;
  left: 20px;
}

.title {
  margin-bottom: 20px;

}

h1 {
  font-size: 1.5em;
  line-height: 0;
}
</style>
