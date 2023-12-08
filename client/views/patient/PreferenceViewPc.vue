<script setup lang="ts">
import router from "@/router";
import { useContactStore } from "@/stores/contact";
import { useNavigationStore } from "@/stores/navigation";
import { usePreferenceStore } from "@/stores/preference";

import { ref } from "vue";


const { createPatientPasscode } = usePreferenceStore();
const { setNavOn } = useNavigationStore();

const { 
    //createPasscode
} = useContactStore();

let passcode1 = ref("");
let passcode2 = ref("");
let passcode3 = ref("");
let passcode4 = ref("");


async function goHome() {
    update();
    setNavOn();
    void router.push({ name: "Home" });
}

async function back() {
    void router.push({ name: "PreferencePb" });
}

async function update() {
    let passcode = passcode1.value + passcode2.value + passcode3.value + passcode4.value;
    await createPatientPasscode(passcode);
}

</script>

<template>
    <main>
      <img class="back-button" @click="back" src="@/assets/images/back.svg"/>
  
    <h2>Set a friend passcode</h2>

    <p>Non-patient users who set you as their patient contact (your family, your friends) need this passcode to activate and view your content.</p>
      
    <div class="password">
      <input type="password" v-model="passcode1" maxlength="1" size="1" class="custom-input">
      <input type="password" v-model="passcode2" maxlength="1" size="1" class="custom-input">
      <input type="password" v-model="passcode3" maxlength="1" size="1" class="custom-input">
      <input type="password" v-model="passcode4" maxlength="1" size="1" class="custom-input">
  
    </div>
    
      <button class="next-button" @click="goHome" > Finish</button>
  
    </main>
  </template>
  
  <style scoped>
  h1 {
    text-align: center;
  }

  h2 {
    text-align: center;
  }
.password {
  display: flex;
  justify-content: center;
}
  .custom-input {
    border: 2px solid black;
    border-radius: 10px;
    background: rgba(163, 163, 161, 0.232);
    padding: 10px;
    outline: none;
    appearance: none; 
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 20px;
    margin-right: 10px;
  }

 
  
  p {
    position: relative;
    display: block;
    font-size: 1em;
    color: rgb(0, 0, 0);
    margin-right: auto;
    margin-left: auto;
    margin-bottom: 20px;
    text-align: left;
  }
  
  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    height: 100vh; 
    padding: 20px;
  }

  .time-capsule {
    margin-bottom: 20px;
  }
  
  .back-button {
    position: absolute;
    top: 20px;
    left: 20px;
  }
  
  .next-button {
    position: absolute;
    bottom: 60px;
    right: 20px;
  }
  </style>