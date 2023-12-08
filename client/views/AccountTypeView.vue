<script setup lang="ts">
import router from "@/router";
import { useNavigationStore } from "@/stores/navigation";
import { useUserStore } from "@/stores/user";
import { onBeforeMount, ref } from "vue";



const family = ref(false);
const patient = ref(false);
const userType = ref("");
const { getUserType, isFamily } = useUserStore();



const { updateUser } = useUserStore();
const { setNavOff } = useNavigationStore();


function selectFamily() {
    family.value = true;
    patient.value = false;
}

function selectPatient() {
    patient.value = true;
    family.value = false;
}

async function preferences() {
    if (family.value) {
    userType.value = "family";
  } else if (patient.value) {
    userType.value = "patient";
  }

  await updateUser({ userType: userType.value });
  // await getUserType();

  if (family.value) {
      void router.push({ name: "PreferenceF" });
  } else if (patient.value) {
    void router.push({ name: "PreferenceP" });
  }
}



onBeforeMount(() => {
  setNavOff();
});




</script>

<template>
 

  <main class="centered">
    <h1>Select <br>Account Type</h1>
    <section class="option-container">
      <div class="option patient" :class="{ option: true, patient: true, selected: patient }" @click="selectPatient">
        <img src="@/assets/images/patient.png" alt="Patient" />
        <label>I AM A</label>
        <h2>PATIENT</h2>
    </div>
        <div class="option family" :class="{ option: true, family: true, selected: family }" @click="selectFamily" >
            <img src="@/assets/images/family.png" alt="Family/Friends" />
            <label>I AM</label>
            <h2>FAMILY OR FRIENDS</h2>
        </div>
    </section>
    <button @click="preferences" > Next</button>
  </main>
</template>

<style scoped>
main.centered {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h1 {
  text-align: center;
}

h2 {
  margin: 5px
}

.selected {
  border: 2px solid black;
}

.option-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
}

.option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  border-radius: 10px;
  padding: 10px;
  width: 150px;

}

.option.family {
  background-color: #EDB4C7; 
}

.option.patient {
  background-color: #9FB9C7; 
}

.option img {
  width: 140px;
  height: 140px;
  border-radius: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
}

.option label {
  margin-top: 10px;
}
</style>












