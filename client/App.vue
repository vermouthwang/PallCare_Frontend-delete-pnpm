<script setup lang="ts">
import router from "@/router";
import { useNavigationStore } from "@/stores/navigation";
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn, isFamily } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());
const { showNav } = storeToRefs(useNavigationStore());
const { logoutUser } = useUserStore();

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  if (isLoggedIn.value) {
    try {
      await userStore.updateSession();
    } catch {
      // User is not logged in
    }
  } else {
    await logout();
  }
});

async function logout() {
  await logoutUser();
  void router.push({ name: "Home" });
}
</script>

<template>
  <header>
    <nav v-if="isLoggedIn && showNav">
      <!-- <div class="title"> -->
        <!-- <img src="@/assets/images/logo.svg" /> -->
      <!-- </div> -->

      <ul>
        <!-- <li v-if="isFamily">
          <RouterLink :to="{ name: 'Forum' }" :class="{ underline: currentRouteName == 'Forum' }"> Forum </RouterLink>
        </li>
        <li v-else>
          <RouterLink :to="{ name: 'Forum' }" :class="{ underline: currentRouteName == 'Forum' }"> Forum </RouterLink>
        </li> -->
        <li>
        <RouterLink :to="{ name: 'Forum' }" > 
          <img v-if="currentRouteName == 'Forum'" src="@/assets/images/forumON.svg" class="navImage"/>
          <img v-if="currentRouteName != 'Forum'" src="@/assets/images/forumOFF.svg" class="navImage"/>
         </RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'Diary' }" > 
            <img v-if="currentRouteName == 'Diary'" src="@/assets/images/diaryON.svg" class="navImage"/>
            <img v-if="currentRouteName != 'Diary'" src="@/assets/images/diaryOFF.svg" class="navImage"/>
           </RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'TimeCapsule' }" > 
            <img v-if="currentRouteName == 'TimeCapsule'" src="@/assets/images/capsuleON.svg" class="navImage"/>
            <img v-if="currentRouteName != 'TimeCapsule'" src="@/assets/images/capsuleOFF.svg" class="navImage"/>
           </RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'Wish' }" > 
            <img v-if="currentRouteName == 'Wish'" src="@/assets/images/wishON.svg" class="navImage"/>
            <img v-if="currentRouteName != 'Wish'" src="@/assets/images/wishOFF.svg" class="navImage"/>
           </RouterLink>
        </li>
       
        <li>
          <RouterLink :to="{ name: 'Letter' }" > 
            <img v-if="currentRouteName == 'Letter'" src="@/assets/images/letterON.svg" class="navImage2"/>
            <img v-if="currentRouteName != 'Letter'" src="@/assets/images/letterOFF.svg" class="navImage2"/>
           </RouterLink>
        </li>
      </ul>
    </nav>
    <!-- <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article> -->
  </header>

  <RouterView />
</template>

<style scoped>
@import "./assets/toast.css";

nav {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0px;
  width: 320px auto;
  margin-left: 3%;
  margin-bottom: 15px;
  background-color: rgba(0, 0, 0, 0.092);
  border-radius: 33px;
}

ul {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: row;
  width: 350px;
  list-style-type: none;
  margin: 0; 
  padding: 10px;
}



h1 {
  font-size: 2em;
  margin: 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  height: 2em;
}

a {
  font-size: large;
  color: black;
  text-decoration: none;
}


.underline {
  text-decoration: underline;
}

.navImage{
  height: 1.5em;
}

.navImage2{
  height: 1.2em;
}
</style>
