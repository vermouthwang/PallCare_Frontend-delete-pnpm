<script setup lang="ts">
import { useForumStore } from "@/stores/forum";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, defineAsyncComponent, onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatEntryDate } from "../../utils/formatDate";

const PostComponent = defineAsyncComponent(() => import("../Post/PostComponent.vue"));
const emit = defineEmits(["editTopic", "refreshTopics"]);
const { currentUsername } = storeToRefs(useUserStore());
const { isAuthor } = useUserStore();
const { currentTopic } = useForumStore();
const { isInTopic } = useForumStore();

const loaded = ref(false);
const props = defineProps(["topic"]);
let responses = ref<Array<Record<string, string>>>([]);

const canEdit = computed(() => {
  if (!isInTopic) {
    return isAuthor(props.topic.author);
  } else {
    return isAuthor(currentTopic.author);
  }
});

const getResponses = async () => {
  let responseResults = [];
  try {
    for (let response of currentTopic.responses) {
      responseResults.push(await fetchy(`/api/posts/${response}`, "GET"));
    }
  } catch (_) {
    return;
  }
  responses.value = responseResults;
};

const deleteTopic = async () => {
  try {
    await fetchy(`/api/topics/${currentTopic._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshTopics");
};

onBeforeMount(async () => {
  if (isInTopic) {
    await getResponses();
    loaded.value = true;
  }
});
</script>

<template>
  <div>
    <div class="card">
        <div class="top">
          <text v-if="isInTopic" class="date">{{ formatEntryDate(currentTopic.dateCreated) }}   By {{ currentTopic.author }}</text>
          <text v-else class="date">{{ formatEntryDate(props.topic.dateCreated) }}    By {{ props.topic.author }}</text>
        </div>
        <div class="top">
          <text class="topictitle">{{ currentTopic.title }}</text>
        </div>
        <div class="bottom" v-if="isInTopic">
          <text class="topiccontent">{{ currentTopic.content }}</text>
          <div class="buttons" v-if="canEdit">
            <button class="little-black" @click="emit('editTopic', currentTopic._id)">Edit</button>
            <button class="little-gray" @click="deleteTopic">Delete</button>
          </div>
        </div>
        <div class="bottom" v-else>        
          <text class="topictitle">{{ props.topic.title }}</text>
        </div>
    </div>
    <section class="responses" v-if="isInTopic && loaded && responses.length !== 0">
      <article v-for="response in responses" :key="response._id">
        <Suspense>
          <PostComponent :post="response" />
        </Suspense>
      </article>
    </section>
    <p v-else-if="isInTopic && loaded">No responses found</p>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  width: 300px;
  height: 150px;
  padding: 1.5px 0px 9px 1.5px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  border-radius: var(--numbers-spacing-12, 12px);
  border: 1.5px solid #000;
}

p {
  margin: 0;
}
.top {
  display: flex;
  width: 350px;
  height: 28px;
  padding: 0px -10px;
  align-items: center;
  gap: 40px;
  flex-shrink: 0;
}
.date {
  display: flex;
  width: 207px;
  height: 18px;
  flex-direction: column;
  justify-content: flex-end;
  flex-shrink: 0;
  color: #000;
  font-family: SF Pro Display;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 82.938%;
}
.topictitle {
  display: flex;
  width: 190px;
  height: 45px;
  flex-direction: column;
  justify-content: flex-end;
  flex-shrink: 0;
  color: #000;
  font-family: SF Pro Display;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 82.938%;
}
.topiccontent {
  display: flex;
  width: 190px;
  height: 45px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: #8d8989;
  font-family: SF Pro Display;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.buttons {
  display: flex;
  width: 66px;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}
.bottom {
  display: flex;
  width: 225px;
  padding: 0px 20px 0px 13px;
  align-items: flex-start;
  gap: 20px;
}
.little-black {
  display: flex;
  width: 75px;
  height: 25px;
  padding: 10px;
  background: #131313;
  font: 100% SF Pro Display;
  font-size: 16px;
}
.little-gray {
  display: flex;
  width: 75px;
  height: 25px;
  padding: 10px;
  background: rgb(101, 103, 104);
  font: 100% SF Pro Display;
  font-size: 16px;
}
.responses {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
</style>