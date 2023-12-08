<script setup lang="ts">

import PreferenceForm from "@/components/Preference/PreferenceForm.vue";
import router from "@/router";
import { useNavigationStore } from "@/stores/navigation";
import { usePreferenceStore } from "@/stores/preference";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";



const {  updatePreferences } = usePreferenceStore();
const { setNavOff } = useNavigationStore();
const { userType} = storeToRefs(useUserStore());
const { getUserType } = useUserStore();
const { currentUsername } = storeToRefs(useUserStore());




let age = ref("");
let aid = ref("");


async function accountType() {
  void router.push({ name: "AccountType" });
}

async function update() {
  let visualAid;
  if (aid.value === "Yes") {
    visualAid = true;
  } else {
    visualAid = false;
  }
  await updatePreferences({ age: age.value });
  await updatePreferences({ visualAid: visualAid });

  if(userType.value == "patient"){
    void router.push({ name: "PreferencePb" });
  }else{
    void router.push({ name: "PreferenceFb" });
  }

}

onBeforeMount(async () => {
  await getUserType(currentUsername.value);
  setNavOff();
});

</script>

<template>
  <main>
    <div v-if="userType == 'patient'" class="back-button">
      <img @click="accountType" src="@/assets/images/back.svg"/>
    </div>
    
    <div>
      <h1>Tell Us More About You ...</h1>

      <PreferenceForm/>
  
      <p>These can be changed later in settings</p>
      
    </div>
    

  </main>
</template>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 60px;
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
  text-align: center;
  height: 100vh;
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



