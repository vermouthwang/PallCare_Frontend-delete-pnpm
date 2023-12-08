import { defineStore } from "pinia";

import { BodyT, fetchy } from "@/utils/fetchy";
import { ObjectId } from "mongodb";
export const useDelayStore = defineStore(
  "delay",
  () => {
    const createDelay = async (contentID: ObjectId, type: "Diary" | "Letter" | "Wish", behavior: "send" | "delete", activation: string) => {
      return await fetchy(`/api/delay/${contentID}`, "POST", { body: { type, behavior, activation } });
    };

    const getDelayById = async (_id: ObjectId) => {
      return await fetchy(`apy/delay/${_id}`, "GET");
    };

    const getDelayByContent = async (contentID: ObjectId) => {
      return await fetchy(`/api/delay/content/${contentID}`, "GET");
    };

    const deleteDelay = async (_id: ObjectId) => {
      return await fetchy(`/api/delay/${_id}`, "DELETE");
    };

    const isDelayExpired = async (_id: ObjectId) => {
      return await fetchy(`/api/delay/expired/${_id}`, "GET");
    };

    const executeDelay = async (_id: ObjectId) => {
      return await fetchy(`/api/delay/executed/${_id}`, "DELETE");
    };

    const updateDelay = async (_id: ObjectId, patch: BodyT) => {
      return await fetchy(`/api/delay/${_id}`, "PATCH", { body: { update: patch } });
    };

    return {
      createDelay,
      getDelayById,
      getDelayByContent,
      deleteDelay,
      isDelayExpired,
      executeDelay,
      updateDelay,
    };
  },
  { persist: true },
);
