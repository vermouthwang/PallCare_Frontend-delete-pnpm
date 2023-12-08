<script setup lang="ts">
import router from "@/router";




async function goHome() {

    void router.push({ name: "Home" });
}

async function back() {
    void router.push({ name: "PreferenceP" });
}

</script>

<template>
    <main>
      <img class="back-button" @click="back" src="@/assets/images/back.svg"/>
  
    <h1>Thanks for sharing!</h1>

    <p>We provide patient-centered communication system with multiple features, sign in and start your journey to know more.</p>      
    <div class="grid-container">
        <div class="image-caption">
            <img src="@/assets/images/placeholder.svg"/>
            <p class="caption">Time Capsule</p>
        </div>
        <div class="image-caption">
            <img src="@/assets/images/placeholder.svg"/>
            <p class="caption">One-way Letter</p>
        </div>
        <div class="image-caption">
            <img src="@/assets/images/placeholder.svg"/>
            <p class="caption">Semi-Public Diary</p>
        </div>
        <div class="image-caption">
            <img src="@/assets/images/placeholder.svg"/>
            <p class="caption">Mood Tracking</p>
        </div>
        <div class="image-caption">
            <img src="@/assets/images/placeholder.svg"/>
            <p class="caption">Post Sharing Forum</p>
        </div>
        <div class="image-caption">
            <img src="@/assets/images/placeholder.svg"/>
            <p class="caption">Shared Wishlist</p>
        </div>
    </div>
    <button class="next-button" @click="goHome" > Finish</button>
  
    </main>
  </template>
  
  <style scoped>
  h1 {
    text-align: center;
  }

  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    height: 100vh; 
  }
  .image-caption {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .caption {
    margin-top: 0px;
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

  .grid-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr); 
    grid-template-rows: repeat(2, 1fr); 
    gap: 10px; 
  }
  </style>