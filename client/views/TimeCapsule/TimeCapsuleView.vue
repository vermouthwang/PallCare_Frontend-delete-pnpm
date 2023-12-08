<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import TimeCapsuleBGComponent from "../../components/TimeCapsule/TimeCapsuleBGComponent.vue";
import router from "../../router";
import { useTCStore } from "../../stores/timeCapsule";
import { formatEntryDate } from "../../utils/formatDate";
const { getReleaseDate } = useTCStore();
let releaseDate = ref<string>();

onBeforeMount(async () => {
  releaseDate.value = formatEntryDate(await getReleaseDate());
});
</script>

<template>
      
  <body>
    <div class="navigation">
      <img @click="router.push({ name: 'Home' })" src="@/assets/images/home.png"/>
      <text class="pagetitle">Time Capsule</text>
    </div>
    <div class="pageexplainationdiv">
      <text class="pageexplaination">In Time Capsule, selected contents will be activated after the automatic realease time you set. </text>
    </div>
  <div class="release">
    <div class ="release-date">
      <text class="date">Earliest Release Date {{ releaseDate }}</text>
    </div>
    <TimeCapsuleBGComponent />
    
  </div>
  <button class="bluebuttoncenterlong" @click="router.push({ name: 'PreferencePb' })">Edit Release Time</button>
  <button class="blackbuttoncenterlong" @click="router.push({ name: 'TimeCapsuleContent' })">Edit Contents</button>
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
    background:#F0E7D8;
    gap: 15px;
  }
  .navigation {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
  .release{
    display: flex;
    flex-direction: column;
    /* justify-content: space-between; */
    align-items: center;
    height: 400px;
    gap: -100px;
    flex-shrink: 0;
  }

  .pagetitle{
  display: flex;
  width: 240px;
  height: 45px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: #131313;
  font-family: New York;
  font-size: 30px;
  font-style: normal;
  font-weight: 496;
  line-height: normal;
  text-transform: uppercase;
}

.release-date{
  position: absolute;
  top: 350px;
  display: inline-flex;
  padding: 11px 1px 15px 1px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 7px;
  border: 0.5px solid #000;
  background: var(--color-background-input, #FFF);

}

.date{
  width: 145.484px;
  color: #000;
  text-align: center;
  font-family: SF Pro Display;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
line-height: normal;
}

</style>
