<script setup lang="ts">
import LoginForm from "@/components/Login/LoginForm.vue";
import router from "@/router";
import { useNavigationStore } from "@/stores/navigation";

const { setNavOff, setNavOn } = useNavigationStore();


async function goHome() {
  setNavOn();
  void router.push({ name: "Home" });
}
</script>

<template>
  <main class="centered">
    <img @click="goHome" src="@/assets/images/back.svg"/>

    <h1>Welcome Back</h1>
    <LoginForm />
    
  </main>
</template>

<style>
h1 {
  display: flex;
  width: 299px;
  height: 12px;
  padding-top: 12px;
  align-items: center;
  flex-shrink: 0;
  color: #000;
  font-family: New York;
  font-size: 35px;
  font-style: normal;
  font-weight: 496;
  line-height: normal;
  text-transform: uppercase;
}
.navigation {
  display: flex;
  width: 298px;
  padding-right: 0px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
}
.centered{
position: absolute;
top: 40%;
left: 50%;
transform: translate(-50%, -50%);
width: 100vw;
height: 120vh;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
z-index: 10;
gap: 27px;
/* display: inline-flex; */
}

img:hover{
  width: 60px;
}
</style>
