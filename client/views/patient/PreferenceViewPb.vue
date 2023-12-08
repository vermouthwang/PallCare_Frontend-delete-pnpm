<script setup lang="ts">
import router from "@/router";
import { usePreferenceStore } from "@/stores/preference";
import { ref } from "vue";



const { updatePreferences } = usePreferenceStore();

const days = ref(null)


async function back() {
  void router.push({ name: "PreferenceP" });
}

async function next() {
  await updatePreferences({ timeCapsule: days.value });

  void router.push({ name: "PreferencePc" });
}

</script>

<template>
    <main>
      <img  class="back-button" @click="back" src="@/assets/images/back.svg"/>
  
      <h2>We care about users’ privacy and their after life wishes.
        Here, you can set up your TIME CAPSULE date which is: after a specific time you have not logged into our app, we will help you to automatically DELETE some private content or SEND some content to your contacts.</h2>

        <div class="time-capsule">
          <h3 >Set your time capsule date:</h3>
          <form @submit="next">
              <input class="custom-input" v-model="days" placeholder="Number of Days" />
          </form>
          <h3>after I have not logged in, the time capsule will be activated.</h3>
        </div>
        

        <p>This activation time and content stored in the time capsule can be changed later in settings.</p>
      
      <img class="next-button"  @click="next" src="@/assets/images/next.svg"/>  
    </main>
  </template>
  
  <style scoped>
  h1 {
    text-align: center;
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
  }

  h2 {
    text-align: left;
    font-size: medium;
    font-weight: 500;
    margin-bottom: 35px;
  }
  
  p {
    position: relative;
    display: block;
    font-size: 0.9em;
    color: grey;
    margin-right: auto;
    margin-left: auto;
  }
  
  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    height: 100vh; 
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