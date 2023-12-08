<script setup lang="ts">
import { ref } from "vue";
import router from "../../router";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["topic"]);
const title = ref(props.topic.title);
const content = ref(props.topic.content);
const emit = defineEmits(["editTopic", "refreshTopics"]);

const editTopic = async () => {
  try {
    await fetchy(`/api/topics/${props.topic._id}`, "PATCH", 
    { body: { update: { title: title.value, content: content.value } } });
  } catch (e) {
    return;
  }
  emit("editTopic");
  emit("refreshTopics");
};
</script>

<template>
    <div calss="navigation">
      <img @click="router.push({ name: 'Topic/' + props.topic._id })" src="./assets/images/back.svg" alt="arrow" />
    </div>
    <form class="create-form" @submit.prevent="editTopic">
        <div class="inputspace">
        <input class="topic-title" id="title" v-model="title" placeholder="Enter Your New Title" required />
        <textarea class="topic-content" id="content" v-model="content" required> {{ props.topic.content }} </textarea>
        </div>
        
        <div class="base">
        <menu>
            <li><button class="bluebuttoncenterlong" type="submit">Save</button></li>
            <li><button class="bluebuttoncenterlong" @click="emit('editTopic')">Cancel</button></li>
        </menu>
        </div>
    </form>
</template>

<style scoped>
.navigation {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px 12px;
  width: 100%;
  height: 50px;
  background-color: #f0e7d8;
}
.create-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.topic-content {
  width: 60%;
  height: 150px;
  flex-shrink: 0;
  border-radius: 7px;
  border: 1px solid #000;
}
.topic-title {
  display: flex;
  width: 120px;
  height: 25px;
  padding: 0px 12px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  font-size: 12px;
  align-items: flex-start;
  border-radius: 7px;
  border: 1px solid #000;
  background-color: #f0e7d8;
}
.inputspace {
  display: flex;
  width: 300px;
  height: 290px;
  padding-top: 10px;
  /* padding-bottom: 0px; */
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-space-075, 6px);
  border-radius: var(--numbers-spacing-12, 12px);
  background: #9fb9c7;
}
</style>