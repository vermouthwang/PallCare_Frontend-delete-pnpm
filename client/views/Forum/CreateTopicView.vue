<script setup lang="ts">
import CreateTopicForm from '../../components/Forum/CreateTopicForm.vue';
import router from '../../router';
</script>

<template>
  <body>
    <div calss="navigation">
      <img @click="router.push({ name: 'Forum' })" src="@/assets/images/back.svg" />
    </div>
    <CreateTopicForm />
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
.nagivation{
  display: flex;
  width: 300px;
  align-items: center;
  gap: 23px;
}
</style>