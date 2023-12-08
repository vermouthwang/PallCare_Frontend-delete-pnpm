<script setup lang="ts">
import { useNavigationStore } from "@/stores/navigation";
import { onBeforeMount } from "vue";
import CreateWishForm from "../../components/Wish/CreateWishForm.vue";
import router from "../../router";

const { setNavOff, setNavOn } = useNavigationStore();

function back()  {
  setNavOn();
  router.push({ name: 'Wish' })
}

onBeforeMount(async()=> {
  setNavOff();
})
</script>

<template>
  <body>
    <div class="navigation">
      <img @click="back" src="@/assets/images/back.svg" />
      <h1>New Wish</h1>
    </div>
    <CreateWishForm />
  </body>
</template>

<style scoped>
body {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 60px 18px 120px 18px;
  justify-content: space-between;
  flex-direction: column;
  background: #f0e7d8;
}
.navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 4rem;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}
.navigation img {
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
}
.navigation h1 {
  font-size: 1.5rem;
  font-weight: 500;
  color: #333333;
}
</style>
