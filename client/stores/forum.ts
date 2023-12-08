import { fetchy } from "@/utils/fetchy";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useForumStore = defineStore(
  "forum",
  () => {
    const isInTopic = ref(false);
    const currentTopic = ref<Record<string, any>>({});
    const pagenumber = ref(1);

    const resetStore = () => {
      isInTopic.value = false;
      currentTopic.value = {};
      pagenumber.value = 1;
    };

    const enterTopic = async (topicId: string) => {
      isInTopic.value = true;
      currentTopic.value = await getTopic(topicId);
    };

    const exitTopic = () => {
      isInTopic.value = false;
      currentTopic.value = {};
    };

    const getTopics = async () => {
      return await fetchy(`/api/topics?page=${pagenumber.value}`, "GET");
    };

    const getTopic = async (topicId: string) => {
      return await fetchy(`/api/topics/${topicId}`, "GET");
    };

    const createTopic = async (title: string, body: string) => {
      await fetchy("/api/topics", "POST", { body: { title, body } });
    };

    return {
      isInTopic,
      currentTopic,
      pagenumber,
      resetStore,
      enterTopic,
      exitTopic,
      getTopics,
      getTopic,
      createTopic,
    };
  },
  { persist: true },
);
