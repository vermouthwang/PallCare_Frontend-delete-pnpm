<script setup lang="ts">
import { storeToRefs } from "pinia";
import { defineAsyncComponent, onBeforeMount, ref } from "vue";
import router from "../../router";
import { useForumStore } from "../../stores/forum";
import { useUserStore } from "../../stores/user";
import { fetchy } from "../../utils/fetchy";
import EditTopicForm from "./EditTopicForm.vue";
import SearchTopicForm from "./SearchTopicForm.vue";

const TopicComponent = defineAsyncComponent(() => import("./TopicComponent.vue"));
const { isLoggedIn } = storeToRefs(useUserStore());
const { pagenumber } = storeToRefs(useForumStore());
const { enterTopic } = useForumStore();

const loaded = ref(false);
let topics = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchAuthor = ref("");

async function getTopics(author?: string) {
  let topicResults;
  try {
    if (author) {
      topicResults = await fetchy("/api/topics", "GET", { query: { author } });
    } else {
      topicResults = await fetchy("/api/topics", "GET");
    }
  } catch (_) {
    return;
  }
  topics.value = topicResults.topics;
  pagenumber.value = topicResults.page;
}

function updateEditing(id: string) {
  editing.value = id;
}

async function enter(id: string) {
  await enterTopic(id);
  router.push({ name: "Topic" });
}

onBeforeMount(async () => {
  await getTopics();
  loaded.value = true;
});
</script>

<template>
    <div class="searchbar">
        <h2 v-if="!searchAuthor">Topics:</h2>
        <h2 v-else>Topics by {{ searchAuthor }}:</h2>
        <SearchTopicForm @getTopicsByAuthor="getTopics" />
    </div>
    <section class="topics" v-if="loaded && topics.length !== 0">
        <article v-for="topic in topics" :key="topic._id">
          <Suspense>
            <TopicComponent v-if="editing !== topic._id" :topic="topic" @click="enter(topic._id)" @refreshTopics="getTopics" @editTopic="updateEditing" />
            <EditTopicForm v-else :topic="topic" @refreshTopics="getTopics" @editTopic="updateEditing" />
          </Suspense>
        </article>
    </section>
    <p v-else-if="loaded">No topics found</p>
    <p v-else>Loading...</p>
</template>

<style scoped>
.topics {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.searchbar {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

article {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
</style>