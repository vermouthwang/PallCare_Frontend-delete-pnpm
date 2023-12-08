import { defineStore } from "pinia";

import { BodyT, fetchy } from "@/utils/fetchy";
import { ObjectId } from "mongodb";
export const useTCStore = defineStore(
  "timeCapsule",
  () => {
    const getReleaseDate = async () => {
      const pref = await fetchy("/api/preferences", "GET");
      const date = new Date();
      date.setDate(date.getDate() + pref.timeCapsule);
      return date;
    };

    const getSelectContent = async (username: string) => {
      return await fetchy(`/api/timecapsule/${username}`, "GET");
    };

    const getUnselectedContent = async (username: string) => {
      return await fetchy(`/api/timecapsule/not_selected/${username}`, "GET");
    };

    const addToTimeCapsule = async (username: string, contentID: ObjectId, type: "Diary" | "Letter" | "Wish", behavior: "send" | "delete") => {
      const body: BodyT = { username, type, behavior };
      await fetchy(`/api/timecapsule/${contentID}`, "POST", { body });
    };

    const removeFromTimeCapsule = async (delay: ObjectId) => {
      await fetchy(`/api/delay/${delay}`, "DELETE");
    };

    return {
      getReleaseDate,
      getSelectContent,
      getUnselectedContent,
      addToTimeCapsule,
      removeFromTimeCapsule,
    };
  },
  { persist: true },
);
