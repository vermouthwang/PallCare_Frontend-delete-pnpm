<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import DiaryComponent from "../../components/Diary/DiaryComponent.vue";
import WishComponent from "../../components/Wish/WishComponent.vue";
import router from "../../router";
import { useTCStore } from "../../stores/timeCapsule";
import { useUserStore } from "../../stores/user";

const { getUnselectedContent } = useTCStore();
const { currentUsername } = storeToRefs(useUserStore());
const emit = defineEmits(["refreshContent"]);
let diaries = ref<Array<Record<string, string>>>([]);
let wishes = ref<Array<Record<string, string>>>([]);

async function refreshDiaries(_id: string) {
  diaries.value = diaries.value.filter((diary) => diary._id !== _id);
  emit("refreshContent");
}

async function refreshWishes(_id: string) {
  wishes.value = wishes.value.filter((wish) => wish._id !== _id);
  emit("refreshContent");
}

onBeforeMount(async () => {
  const unselectedContent = await getUnselectedContent(currentUsername.value);
  diaries.value = unselectedContent.diaries;
  wishes.value = unselectedContent.wishes;
});
</script>
<template>
  <body>
    <div class="navigation">
      <img @click="router.push({ name: 'TimeCapsuleContent' })" src="@/assets/images/back.svg" />
      <text class="pagetitle">Add Contents</text>
    </div>
    <div class="creatediv" @click="router.push({ path: `/letter/create/${true}` })">
      <text class="createdivtitle">Write a new letter here</text>
      <div class="blank">
        <img src="@/assets/images/diaryicon.png" style="height: 200%; width: fit-content" />
      </div>
    </div>
    <button @click="router.push({ path: `/letter/create/${true}` })">Create a new letter to store in Time Capsule</button>
    <h1>Select Diaries to Add to Time Capsule</h1>
    <article v-for="diary in diaries" :key="diary._id">
      <!-- TODO: add DIARY component w/ conditional styling -->
      <DiaryComponent :diary="diary" :capsule="true" @refreshDiaries="refreshDiaries(diary._id)" />
    </article>
    <h1>Select Wishes to Add to Time Capsule</h1>
    <article v-for="wish in wishes" :key="wish._id">
      <!-- TODO: add WISH component w/ conditional styling -->
      <Suspense>
        <WishComponent :wish="wish" :capsule="true" @refreshWishes="refreshWishes(wish._id)" />
      </Suspense>
    </article>
  </body>
</template>

<style scoped>
body {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 60px 18px 120px 18px;
  justify-content: space-between;
  flex-direction: column;
  background: #f0e7d8;
  gap: 15px;
}

.creatediv {
  display: flex;
  width: 290px;
  height: 89px;
  padding-left: 14px;
  align-items: center;
  gap: 39px;
  flex-shrink: 0;
  border-radius: var(--numbers-spacing-12, 12px);
  background: #9fb9c7;
}
.createdivtitle {
  display: flex;
  width: 162px;
  height: 57px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: #000;
  font-family: SF Pro Display;
  font-size: 22px;
  font-style: normal;
  font-weight: 600;
  line-height: 103.822%;
}
.navigation {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.blank {
  display: flex;
  width: 68px;
  height: 62px;
  align-items: flex-end;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 7px;
  background-color: #f0e7d8;
}

</style>
