<script setup lang="ts">
import TopicComponent from '../../components/Forum/TopicComponent.vue';
import router from '../../router';
import { useForumStore } from '../../stores/forum';

const { exitTopic } = useForumStore();

const exit = () => {
  exitTopic();
  router.push({ name: 'Forum' });
}
</script>

<template>
  <body>
    <div calss="navigation">
      <img @click="exit" src="@/assets/images/back.svg" />
    </div>
    <TopicComponent />
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

.navigation{
  display: flex;
  width: 300px;
  align-items: center;
  gap: 23px;
}
</style>