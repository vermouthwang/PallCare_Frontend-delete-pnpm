import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { fetchy } from "@/utils/fetchy";

export const useMoodStore = defineStore(
  "mood",
  () => {
    const userMood = ref("");
    const previousMoods = ref([]);
    const datesUpdated = ref<any[]>([]);

    const hasMood = computed(() => userMood.value !== "");

    const hasPreviousMoods = computed(() => previousMoods.value.length !== 0);

    const resetStore = () => {
      userMood.value = "";
    };

    const createMood = async (mood: string, notify: boolean) => {
      const moodcreated = await fetchy("/api/moods", "POST", {
        body: { mood, notify },
      });
      //   userMood.value = moodcreated.mood.mood;
    };

    const refreshMood = async (_id: string) => {
      let mood;
      try {
        mood = await fetchy(`/api/moods/${_id}`, "GET", { alert: false });
        userMood.value = mood[0].mood;
        previousMoods.value = mood[0].previousMoods;
        datesUpdated.value = mood[0].updates;
      } catch {
        userMood.value = "";
        previousMoods.value = [];
        datesUpdated.value = [];
      }
    };

    const getPreviousMoods = async (username: string) => {
      let moods;
      moods = await fetchy(`/api/moods/${username}/previous`, "GET");
      previousMoods.value = moods.previousMoods;
      datesUpdated.value = moods.updates;
    };

    const getMoods = async () => {
      return await fetchy(`/api/moods`, "GET");
    };

    const deleteMood = async () => {
      await fetchy("/api/moods/", "DELETE");
      resetStore();
    };

    return {
      userMood,
      previousMoods,
      hasPreviousMoods,
      datesUpdated,
      hasMood,
      createMood,
      refreshMood,
      getPreviousMoods,
      getMoods,
      deleteMood,
    };
  },
  { persist: true },
);
