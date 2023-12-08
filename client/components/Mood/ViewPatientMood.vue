<script setup lang="ts">
import { useMoodStore } from "@/stores/mood";
import { formatDateCustom } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { usePreferenceStore } from "../../stores/preference";




const { createMood, refreshMood, deleteMood, getPreviousMoods} = useMoodStore();
const { userMood, hasMood, previousMoods, datesUpdated, hasPreviousMoods} = storeToRefs(useMoodStore());

const { patientUsername } = storeToRefs(usePreferenceStore());
const isLoading = ref(true);



onBeforeMount(async () => {
    refreshMood(patientUsername.value);
    await getPreviousMoods(patientUsername.value);
    isLoading.value = false;
});
</script>

<template>
    <div class="container">

    <div v-if="hasMood" >
        <h2>{{patientUsername}} is feeling</h2>
        <div class="mood-emoji">{{ userMood }}</div>
        <h2>right now.</h2>
    </div>
    <div v-else>
        <h2> {{patientUsername}} has not set a current mood.</h2>
    </div>

    
    <hr class="separator">


    <h2>{{patientUsername}}'s past moods</h2>
    <div class="previous-moods" v-if="hasPreviousMoods && !isLoading">
        <div v-for="(mood, index) in [...previousMoods].reverse()" :key="index" class="previous-mood">
            <p class="past-mood">{{ mood }}</p>
            <p class="past-mood-date">{{ formatDateCustom([...datesUpdated].reverse()[index], "MM/DD/YY") }}</p>
        <p class="past-mood-time">{{ formatDateCustom([...datesUpdated].reverse()[index], "h:mm a") }}</p>
        </div>
    </div>
    <div v-else-if="!isLoading">
        <p class="past-mood-text">{{patientUsername}}'s previous moods will show up here.</p>
    </div>
    <div v-else>
        <p>Loading...</p>
    </div>
    </div>
</template>

<style scoped>
.container {
    border: 2px solid black;
    padding: 10px; 
    border-radius: 10px;
    margin-bottom: 20px;
    margin-top: 10px;
    max-width: 500px;
}

.mood-emoji {
    font-size: 3em;
    text-align: center;
}

.selected-emoji {
    font-size: 1.7em; 
}

.separator {
    border-top: 1px solid rgba(0, 0, 0, 0.287); 
    margin: 20px 0; 
}

.mood {
    width: 75px;
    height: 70px;
    font-size: 2em;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    
}
.mood p {
    transition: font-size 0.3s ease;
}

.moods {
    display: flex;
    justify-content: center;
    align-items: center;
}

.other-container {
    margin-left: 20px;
    margin-right: 20px;
}

.other {
    font-size: 0.8em;
    margin-bottom: 3px;
}

.custom-input {
    width: 60px; 
    height: 20px; 
    border: 2px solid black;
    background-color: rgba(163, 163, 161, 0.102);
    text-align: center;
    font-size: 0.7em;
    margin-top: 0px;
    border-radius: 5px;
}

.options {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 25px;
    margin-top: 10px;
}

.notify {
    display: flex;
    align-items: center;
    gap: 10px;
}

.checkbox  {
    margin-right: 5px;
}

.viewers {
    text-decoration: underline;
}

button {
    -webkit-backdrop-filter: blur(8px);
    /* Safari 9+ */
    backdrop-filter: blur(8px);
    /* Chrome and Opera */
    box-shadow: 0px 2px 10px 2px rgb(0 0 0 / 15%);
    font-family: SF Pro Display;
    letter-spacing: 0.08em;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    outline: inherit;
    text-transform: uppercase;
    transition: .3s ease;
    display: flex;
    width: 120px;
    height: 30px;
    padding: 18px;
    border: none;
    justify-content: center;
    align-items: center;
    border-radius: 33px;
    background: #131313;
    color: #F0E7D8;
  }
  


  .past-mood-text {
    font-size: 0.9em;
    color: grey;
}

.past-mood {
    font-size: 2em;
    line-height: 0;
}

.past-mood-date {
    font-size: 0.8em;
    color: rgb(54, 54, 54);
    line-height: 0;
}

.past-mood-time {
    font-size: 0.75em;
    color: rgb(139, 139, 139);
}

.previous-moods {
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
    padding:10px
}

.previous-mood {
    min-width: 70px;
    padding: 10px;
    background-color: rgba(208, 208, 208, 0.185);   
    box-shadow: 2px 5px 5px #a8a8a8;
    border-radius: 10px;
    margin-right: 10px;
}

</style>
