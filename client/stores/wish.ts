import { defineStore } from "pinia";

import { fetchy } from "@/utils/fetchy";
import { ObjectId } from "mongodb";
export const useWishStore = defineStore(
  "wish",
  () => {
    const getWishesByAuthor = async (username: string) => {
      return await fetchy(`/api/wishes/${username}`, "GET");
    };

    const getWishById = async (_id: ObjectId) => {
      return await fetchy(`/api/wishes/${_id}`, "GET");
    };

    return {
      getWishesByAuthor,
      getWishById,
    };
  },
  { persist: true },
);
