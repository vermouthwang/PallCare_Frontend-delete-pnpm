<script setup lang="ts">
import router from "@/router";
import { useMoodStore } from "@/stores/mood";
import { useNavigationStore } from "@/stores/navigation";
import { usePreferenceStore } from "@/stores/preference";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import MoodForm from "../components/Mood/MoodForm.vue";
import ViewPatientMood from "../components/Mood/ViewPatientMood.vue";
import { formatDate } from "../utils/formatDate";

const isLoading = ref(true);
const { userMood, hasMood } = storeToRefs(useMoodStore());
const { currentUsername, isLoggedIn, isFamily } = storeToRefs(useUserStore());
const { getUserType } = useUserStore();

const { refreshMood } = useMoodStore();
const { patientUsername } = storeToRefs(usePreferenceStore());
const { setNavOff, setNavOn } = useNavigationStore();


let currentDate = formatDate(new Date());

async function loginUser() {
  void router.push({ name: "Login" });
  
}

async function registerUser() {
  void router.push({ name: "Register" });
  
}

async function settings() {
  void router.push({ name: "Settings" });
}

async function contacts() {
  void router.push({ name: "Contact" });
}

onBeforeMount(async () => {

  isLoading.value = true;
  await getUserType(currentUsername.value);
  if(isFamily) {
    void refreshMood(patientUsername.value);
  } else {
    void refreshMood(currentUsername.value);
  }

  setNavOn();

  isLoading.value = false;

  
});


</script>

<template>
    <main>
  
<!-- home page -->
        <div v-if="isLoggedIn">
          <div class="flex-container">
            <div>
              <p id="date" class="text-left date">{{currentDate}}</p>
              <h1 class="text-left">Hi {{ currentUsername }} !</h1>
            </div>
            <img @click="settings" class="settings-icon" src="@/assets/images/settings.svg"/>
            <div class="profile-container">
              <img class="profile-pic" src="@/assets/images/profile.svg"/>
              <div v-if="hasMood && !isFamily" class="mood-emoji">{{ userMood }}</div>
            </div>
          </div>
          
          <div v-if="!isFamily && !isLoading">
            <MoodForm/>
          </div>
          <div v-else-if="!isLoading">
            <ViewPatientMood/>
          </div>
          <div v-else>
            <p>Loading Moods...</p>
          </div>

          <div v-if="!isFamily">
            <button @click="contacts">Your Contacts</button>
          </div>
          
          
        </div>
    



<!-- welcome login -->

        <div v-else>
            <div >
              <img class="animate logo" src="@/assets/images/logo.svg" />
           </div>
    
          <div class="forms fade-in">
            <div class="welcometitle>">
              <h1>Welcome to Palliative Care App</h1>
            </div>
            
            <div class="info">
              <img src="@/assets/images/placeholderimage0.png" width="300"/>
            </div>

            <div class="button-container">
              <button class="blackbutton" @click="loginUser" ><p class="login">LOGIN</p></button>
              <button class="bluebutton" @click="registerUser"> <p class="Register">REGISTER</p></button>
            </div>
            
            
          </div>
          
        </div>
      </main>
</template>

<style scoped>
.mood-emoji {
  position: absolute;
  bottom: 0;
  right: 0.4em;
  font-size: 20px;
}


main {
 
  height: 100vh; 
}

.date {
  font-size: 0.9em;
  letter-spacing: 0.02em;
  color:rgb(81, 81, 81);
}


.mood-custom {
  border: 3px solid green;
  border-radius: 50%;
}
  
.info {
  display: flex;
  align-items: center;
  gap: 10px;
}


.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text-left {
  text-align: left;
  width: auto;
}

.profile-container {
  position: relative;
  max-width: 500px;
}

.profile-pic {
  position: relative;
  margin-right: 15px;
  margin-top: 15px;
  width: 50px;
}

.settings-icon {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 22px;
}


* {
transition: all 0.5s ease;
}


.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.bluebutton {
  /* background: #1E1E1E; */
  border-radius: 40px;
  width: 300px;
  height: 60px;
  border: none;
  outline: none;
}

.blackbutton {
  background: #1E1E1E;
  border-radius: 40px;
  width: 300px;
  height: 60px;
  border: none;
  outline: none;
}

p.login {
  color: #FFF;
  text-align: center;
  
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
p.Register {
  color: #131313;
  text-align: center;
  font-family: SF Pro Display;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

button:hover {
background:rgba(255, 255, 255, 0.3); 
}

.selected {
background:rgba(255, 255, 255, 0.3); 
}

.centered {
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
}

.logo {
position: absolute;
width: 10em;
height: 100vh;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
}

.bg-container {
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
z-index: -1;
}

.background-image  {
width: 100%;
height: 100%;
object-fit: cover;
}



.animate {
-webkit-animation: fadeinout 4s linear forwards;
animation: fadeinout 4s linear forwards;
}

.fade-in {
-webkit-animation: fadein 6s linear forwards;
animation: fadein 6s linear forwards;
}

.fade-in-form {
-webkit-animation: fadein 0.2s linear forwards;
animation: fadein 0.2s linear forwards;
}

@-webkit-keyframes fadeinout {
0%,100% { opacity: 0; }
60% { opacity: 1; }
}

@keyframes fadeinout {
0%,100% { opacity: 0; }
60% { opacity: 1; }
}

@-webkit-keyframes fadein {
0%, 60%{ opacity: 0; }
100% { opacity: 1; }
}

@keyframes fadein {
0%, 60% { opacity: 0; }
100% { opacity: 1; }
}

@keyframes fadeInAll {
0% {opacity: 0;}
100% {opacity: 1;}
}


.forms {
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
width: 100%;
height: 120%;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
z-index: 10;
gap: 57px;
/* display: inline-flex; */
background: #F0E7D8;
}


</style>