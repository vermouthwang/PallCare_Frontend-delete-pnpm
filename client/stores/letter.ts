import { defineStore } from "pinia";

import { BodyT, fetchy } from "@/utils/fetchy";
import { ObjectId } from "mongodb";

export const useLetterStore = defineStore(
  "letter",
  () => {
    const createLetter = async (to: string[], content: string, responseEnabled: boolean, delay?: string) => {
      if (delay) {
        return await fetchy("/api/letter", "POST", {
          body: { to, content, responseEnabled, delay },
        });
      } else {
        const letter = await fetchy("/api/letter", "POST", {
          body: { to, content, responseEnabled },
        });
        const _id = letter.letter._id;
        return await fetchy(`/api/letter/send/${_id}`, "PATCH");
      }
    };
    const getLetterContactNames = async () => {
      return await fetchy("/api/contact/usernames", "GET");
    };

    const getReceiverId = async (contactname: string[]) => {
      return await fetchy(`/api/contact/receiver`, "POST", { body: { contactname } });
    };

    const getAuthorLetters = async () => {
      return await fetchy(`/api/letter`, "GET");
    };

    const deletesentLetter = async (_id: ObjectId) => {
      return await fetchy(`/api/letter/client/${_id}`, "DELETE");
    };

    const removeunsentletter = async (_id: ObjectId) => {
      return await fetchy(`/api/letter/${_id}`, "DELETE");
    };

    const getLetterById = async (_id: ObjectId) => {
      return await fetchy(`/api/letter/${_id}`, "GET");
    };

    const getReceiversUsername = async (receivers: ObjectId[]) => {
      const usernames = [];
      for (const _id of receivers) {
        usernames.push(await fetchy(`/api/contact/receiver/${_id}`, "GET"));
      }
      return usernames;
    };
    const getAuthorEntries = async (username: string) => {
      return await fetchy(`/api/diary/entries/${username}`, "GET");
    };

    const getDiaryById = async (_id: ObjectId) => {
      return await fetchy(`/api/diary/${_id}`, "GET");
    };

    const updateLetter = async (_id: ObjectId, content: string, responseEnabled: boolean, delay: string) => {
      if (delay !== "") {
        return await fetchy(`/api/letter/${_id}`, "PATCH", { body: { content, responseEnabled, delay } });
      } else {
        await fetchy(`/api/letter/${_id}`, "PATCH", { body: { content, responseEnabled } });
        return await fetchy(`/api/letter/send/${_id}`, "PATCH");
        // await fetchy(`/api/delay/content/${_id}`, "DELETE");
      }
    };

    const getDelayByContentId = async (_id: ObjectId) => {
      return await fetchy(`/api/delay/content/${_id}`, "GET");
    };

    const deleteDiary = async (_id: ObjectId) => {
      return await fetchy(`/api/diary/${_id}`, "DELETE");
    };

    const isDiaryHidden = async (_id: ObjectId) => {
      return await fetchy(`/api/diary/revealed/${_id}`, "GET");
    };

    const modifyDiaryContent = async (_id: ObjectId, patch: BodyT) => {
      return await fetchy(`/api/diary/${_id}`, "PATCH", { body: { update: patch } });
    };

    return {
      createLetter,
      getLetterContactNames,
      getReceiverId,
      getAuthorLetters,
      deletesentLetter,
      removeunsentletter,
      getLetterById,
      updateLetter,
      getDelayByContentId,
      getReceiversUsername,
      getAuthorEntries,
      getDiaryById,
      deleteDiary,
      isDiaryHidden,
      modifyDiaryContent,
    };
  },
  { persist: true },
);
