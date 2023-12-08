<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useDiaryStore } from "../../stores/diary";
import { useLetterStore } from "../../stores/letter";
import { useUserStore } from "../../stores/user";
import LetterComponent from "./LetterComponent.vue";

const { currentUsername } = storeToRefs(useUserStore());
const { getAuthorEntries } = useDiaryStore();
const { getAuthorLetters } = useLetterStore();
const loaded = ref(false);
let letterList = ref<Array<Record<string, string>>>([]);

async function getEntries() {
  let allLetters = await getAuthorLetters();
  let showletters = [];
  for (let i = 0; i < allLetters.length; i++) {
    if (allLetters[i].show == true) {
      showletters.push(allLetters[i]);
    }
  }
  letterList.value = showletters;
  // diaryList.value = await getAuthorEntries(currentUsername.value);
}

onBeforeMount(async () => {
  await getEntries();
  console.log(letterList.value);
  loaded.value = true;
});
</script>

<template>
  <section v-if="loaded && letterList.length !== 0">
    <article v-for="letter in letterList" :key="letter._id">
      <LetterComponent :letter="letter" @refreshLetters="getEntries" />
    </article>
  </section>
  <p v-else-if="loaded">No letters found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 0px 0px 0px 0px;
}
</style>
