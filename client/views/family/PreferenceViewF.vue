<script setup lang="ts">

import router from "@/router";


import { useNavigationStore } from "@/stores/navigation";
import { usePreferenceStore } from "@/stores/preference";
import { onBeforeMount, ref } from "vue";

const { setNavOff, setNavOn } = useNavigationStore();

const { verifyPatientPasscode, boundwithpatient } = usePreferenceStore();

let username = ref("");
let passcode1 = ref("");
let passcode2 = ref("");
let passcode3 = ref("");
let passcode4 = ref("");
let showerror = ref(false);

async function verify() {
  let passcode = passcode1.value + passcode2.value + passcode3.value + passcode4.value;
  let verified = await verifyPatientPasscode(username.value, passcode);
  if (verified){
    //add contact to the patientuser
    await boundwithpatient(username.value);
    setNavOn();
    router.push({ name: "Home" });
  }else{
    showerror.value = true;
  }
  // void router.push({ name: "PreferenceP" });
}

async function noPasscode() {
  
 //do something
}

onBeforeMount(() => {
  setNavOff();
});

async function accountType() {
  void router.push({ name: "AccountType" });
}




</script>

<template>
  <main>
    <img class="back-button" @click="accountType" src="@/assets/images/back.svg"/>

    <div>
      <h1>Link to your patient</h1>
      <br>
      <p>As a non-patient user, you have to link your account to the patient you are taking care of to activate your account.</p>
    </div>
    

      <div class="username">
        <h2 >Patient Username:</h2>
        <form >
            <input v-model="username" placeholder="ex: Amily004" class="custom-input1"/>
        </form>
      </div>
      

        <h2 >Patient Passcode:</h2>
        <div class="passcode-container">

        <input type="password" v-model="passcode1" maxlength="1" size="1" class="custom-input">
        <input type="password" v-model="passcode2" maxlength="1" size="1" class="custom-input">
        <input type="password" v-model="passcode3" maxlength="1" size="1" class="custom-input">
        <input type="password" v-model="passcode4" maxlength="1" size="1" class="custom-input">          
      </div>
      <div class="no-passcode" @click="noPasscode"> No Passcode</div>
      <p v-if="showerror" style="color:red">Wrong passcode</p>

    <button class="next-button" @click="verify"> Verify</button>

  </main>
</template>

<style scoped>
h1 {
  text-align: left;
}

h2 {
  text-align: left;
}

.username {
  margin-bottom: 20px;
}

.no-passcode {
  font-size: 0.9em;
  color: grey;
  text-decoration: underline;
}

.passcode-container {
  display: flex;
  justify-content: start;
  gap: 10px; 
  margin-bottom: 20px;
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

.custom-input1 {
  border: 2px solid black;
  border-radius: 10px;
  background: transparent;
  padding: 10px;
  outline: none;
  appearance: none; 
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 200px;
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
  padding-left: 5%;
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
