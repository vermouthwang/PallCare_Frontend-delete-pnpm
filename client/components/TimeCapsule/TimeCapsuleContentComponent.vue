<script setup lang="ts">
import { defineEmits, onBeforeMount, ref } from "vue";
import router from "../../router";
import { useDiaryStore } from "../../stores/diary";
import { useLetterStore } from "../../stores/letter";
import { useTCStore } from "../../stores/timeCapsule";
import { useWishStore } from "../../stores/wish";

const { removeFromTimeCapsule } = useTCStore();
const { getDiaryById } = useDiaryStore();
const { getWishById } = useWishStore();
const { getLetterById } = useLetterStore();
const props = defineProps(["delay", "selected"]);
const emit = defineEmits(["deleteContent"]);
const editRoutePath = ref("");
const behaviorTag = ref("");
let content = ref("");

async function deleteContent() {
  await removeFromTimeCapsule(props.delay._id);
  emit("deleteContent");
}
async function initDiaryComponent() {
  const delay = props.delay;
  try {
    content.value = (await getDiaryById(delay.content)).content;
  } catch {
    await deleteContent();
  }
  editRoutePath.value = `/diary/edit/${delay.content}`;
  behaviorTag.value = props.delay.behavior === "send" ? "reveal" : "delete";
}

async function initWishComponent() {
  const delay = props.delay;
  try {
    content.value = (await getWishById(delay.content)).content;
  } catch {
    await deleteContent();
  }
  // editRoutePath.value = `/wish/edit/${delay.content}`;
  editRoutePath.value = "/time_capsule/content";
  behaviorTag.value = props.delay.behavior;
}

async function initLetterComponent() {
  const delay = props.delay;
  try {
    content.value = (await getLetterById(delay.content)).content;
  } catch {
    await deleteContent();
  }
  editRoutePath.value = `/letter/edit/${props.delay.content}`;
  behaviorTag.value = props.delay.behavior;
}

onBeforeMount(async () => {
  switch (props.delay.type) {
    case "Diary":
      await initDiaryComponent();
      break;
    case "Wish":
      await initWishComponent();
      break;
    case "Letter":
      await initLetterComponent();
      break;
  }
});
</script>

<template>
  <body @click="router.push({ path: editRoutePath })">
    <p>{{ props.delay.type }}</p>
    <p>{{ content }}</p>
    <p>Capsule to {{ behaviorTag }}</p>
  </body>
  <button @click="deleteContent">Remove</button>
</template>

<style scoped></style>
