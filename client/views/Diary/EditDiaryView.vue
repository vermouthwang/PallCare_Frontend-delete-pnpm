<script setup lang="ts">
import { ObjectId } from "mongodb";
import { onBeforeMount, ref } from "vue";
import router from "../../router";
import { useDelayStore } from "../../stores/delay";
import { useDiaryStore } from "../../stores/diary";
import { useTCStore } from "../../stores/timeCapsule";
import { useUserStore } from "../../stores/user";

const { currentUsername } = useUserStore();
const { addToTimeCapsule } = useTCStore();
const { getDiaryById, modifyDiaryContent } = useDiaryStore();
const { getDelayByContent, deleteDelay, updateDelay } = useDelayStore();
const props = defineProps(["_id"]);
let content = ref("");
let hidden = ref<boolean>(false);
let prevDelayId = ref<ObjectId>();
let timeCapsule = ref<boolean>(false);
let behaviorIsSend = ref<boolean>(false);

function resetBehaviorOptions() {
  if (!hidden.value) {
    behaviorIsSend.value = false;
  }
}
async function editTimeCapsule() {
  // new addition to capsule
  if (timeCapsule.value) {
    if (!prevDelayId.value) {
      await addToTimeCapsule(currentUsername, props._id, "Diary", behaviorIsSend.value ? "send" : "delete");
    } else {
      await updateDelay(prevDelayId.value, { behavior: behaviorIsSend.value ? "send" : "delete" });
    }
  } // was in capsule, and now it is deseleted
  else if (prevDelayId.value) {
    await deleteDelay(prevDelayId.value);
  }
}

async function submitForm() {
  await modifyDiaryContent(props._id, { content: content.value, hidden: hidden.value });
  await editTimeCapsule();
  await router.push({ name: "Diary" });
}
onBeforeMount(async () => {
  const diary = await getDiaryById(props._id);
  content.value = diary.content;
  hidden.value = diary.hidden;

  try {
    const delay = await getDelayByContent(props._id);
    prevDelayId.value = delay._id;
    timeCapsule.value = true;
    behaviorIsSend.value = delay.behavior === "send";
  } catch {
    // catch if there not currently in time capsule --> do nothing
  }
});
</script>
<template>
  <body>
    <div class="navigation">
      <img @click="router.push({ name: 'Diary' })" src="@/assets/images/back.svg" />
      <h1>Edit Diary</h1>
    </div>
    <text class="entry-date"></text>
    <form class="create-form" @submit.prevent="submitForm">
      <div class="inputspace">
        <textarea class="diary-content" id="content" v-model="content" placeholder="Write a Diary Entry!" required> </textarea>
      </div>

      <div class="setting">
        <div class="field-title">
          <p class="setting-title">Settings</p>
          <span class="badge">?</span>
        </div>
        <fieldset class="diary-fields" :style="{ height: timeCapsule ? '150px' : '120px' }">
          <div class="left">
            <!-- Private setting -->
            <div class="options">
              <p class="form-subtitle">Private</p>
              <label class="switch">
                <input type="checkbox" id="hidden" v-model="hidden" @change="resetBehaviorOptions" />
                <span class="slider round"></span>
              </label>
            </div>
            <!-- Forum setting -->
            <div v-if="!hidden">
              <div class="options">
                <p class="form-subtitle">Post on Forum</p>
                <label class="switch">
                  <input type="checkbox" />
                  <span class="slider round"></span>
                </label>
              </div>
              <div class="options">
                <p class="form-subtitle">Create a topic</p>
                <input type="text" class="forum-topic" />
              </div>
            </div>
            <!-- TIme capsule setting -->
            <div class="options">
              <p class="form-subtitle">Add to Time Capsule</p>
              <label class="switch">
                <input type="checkbox" v-model="timeCapsule" />
                <span class="slider round"></span>
              </label>
            </div>
            <div class="options" v-if="timeCapsule">
              <p class="form-subtitle">Behavior</p>
              <label class="switch" v-if="timeCapsule">
                <input type="checkbox" v-model="behaviorIsSend" :disabled="!hidden" />
                <span class="slider round"></span>
              </label>
              <p class="form-subtitle">{{ behaviorIsSend ? "Send" : "Delete" }}</p>
            </div>
          </div>
        </fieldset>
      </div>

      <button type="submit" class="bluebuttoncenterlong">Edit Diary</button>
    </form>
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
}

.create-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.entry-date {
  display: flex;
  width: 277px;
  height: 19px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: #131313;
}

/* .edit-form * {
  margin-top: 20px;
} */
.diary-content {
  width: 60%;
  height: 150px;
  flex-shrink: 0;
  border-radius: 7px;
  border: 1px solid #000;
}

.setting {
  display: flex;
  height: 220px;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px 0px 0px 10px;
  gap: 0px;
}

.field-title {
  display: flex;
  align-items: center;
  gap: 10px;
}
.setting-title {
  color: #000;
  font-family: SF Pro Display;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 0px;
  /* line-height: 103.822%; 20.764px */
}

textarea.diary-content {
  display: flex;
  width: 260px;
  height: 240px;
  padding: 10px 11px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  flex-shrink: 0;
}
.inputspace {
  display: flex;
  width: 300px;
  height: 290px;
  padding-top: 10px;
  /* padding-bottom: 0px; */
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-space-075, 6px);
  border-radius: var(--numbers-spacing-12, 12px);
  background: #9fb9c7;
}
.left {
  gap: 12px;
}
.options {
  display: flex;
  align-items: center;
  gap: 22px;
}

.form-subtitle {
  color: #000;
  font-family: SF Pro Display;
  font-style: normal;
  font-weight: 500;
  height: 1px;
  line-height: 0;
  /* line-height: 103.822%; 13.497px */
}

.diary-fields {
  display: flex;
  width: 290px;
  height: 125px;
  padding: 8px 0px 15px 10px;
  align-items: column;
  gap: 13px;
  flex-shrink: 0;
  border-radius: var(--numbers-spacing-12, 12px);
  border: 1.5px solid #000;
}

.forum-topic {
  display: flex;
  width: 120px;
  height: 25px;
  padding: 0px 12px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  font-size: 12px;
  align-items: flex-start;
  border-radius: 7px;
  border: 1px solid #000;
  background-color: #f0e7d8;
}
</style>
