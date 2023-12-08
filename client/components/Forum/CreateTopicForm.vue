<script setup lang="ts">
import { ref } from "vue";
import router from "../../router";
import { useUserStore } from "../../stores/user";
import { fetchy } from "../../utils/fetchy";
import { formatEntryDate } from "../../utils/formatDate";

const { currentUsername } = useUserStore();
const title = ref("");
const content = ref("");
const emit = defineEmits(["refreshTopics"]);

const CreateTopic = async () => {
  let topic;
  try {
    topic = (
      await fetchy("/api/topics", "POST", {
        body: { title: title.value, content: content.value },
      })
    ).topic;
  } catch (_) {
    return;
  }
  emit("refreshTopics");
  emptyForm();
  await router.push({ name: "Forum" });
};

const emptyForm = () => {
  title.value = "";
  content.value = "";
};
</script>

<template>
  <text class="entry-date">{{ formatEntryDate(new Date()) }}</text>
  <form class="create-form" @submit.prevent="CreateTopic">
    <div class="inputspace">
      <input class="topic_title" id="title" v-model="title" placeholder="Enter Your New Title" required />
      <textarea class="topic-content" id="content" v-model="content" placeholder="Write Down Your Topic!" required> </textarea>
    </div>

    <li><button class="bluebuttoncenterlong" type="submit">Save</button></li>

  </form>
</template>

<style scoped>
.entry-date {
  display: flex;
  width: 277px;
  height: 19px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: #131313;
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