<script setup lang="ts">
import { ref } from "vue";
import router from "../../router";
import { useTCStore } from "../../stores/timeCapsule";
import { useUserStore } from "../../stores/user";
import { fetchy } from "../../utils/fetchy";
import { formatEntryDate } from "../../utils/formatDate";
const { currentUsername } = useUserStore();
const { addToTimeCapsule } = useTCStore();
const content = ref("");
const visibility = ref("");
const emit = defineEmits(["refreshWishes"]);
let timeCapsule = ref<boolean>(false);
let behaviorIsSend = ref<boolean>(false);

function resetBehaviorOptions() {
  if (visibility.value !== "private") {
    behaviorIsSend.value = false;
  }
}

const createWish = async () => {
  let wish;
  try {
    wish = (
      await fetchy("/api/wishes", "POST", {
        body: { content: content.value, visibility: visibility.value },
      })
    ).wish;
  } catch (_) {
    return;
  }
  await addToTimeCapsule(currentUsername, wish._id, "Wish", behaviorIsSend.value ? "send" : "delete");
  emit("refreshWishes");
  emptyForm();
  await router.push({ name: "Wish" });
};

const emptyForm = () => {
  content.value = "";
};
</script>

<template>
  <text class="entry-date">{{ formatEntryDate(new Date()) }}</text>
  <form class="create-form" @submit.prevent="createWish()">
    <div class="inputspace">
      <textarea class="wish-content" id="content" v-model="content" placeholder="Write Down Your Wish!" required> </textarea>
    </div>

    <div class="setting">
      <div class="field-title">
        <p class="setting-title">Settings</p>
        <span class="badge">?</span>
      </div>
      <fieldset class="wish-fields" :style="{ height: timeCapsule ? '150px' : '120px' }">
        <div class="left">
          <!-- Private setting -->
          <div class="options">
            <p class="form-subtitle">Private</p>
            <label class="switch">
              <input type="radio" id="private" name="visibility" value="private" v-model="visibility" />
              <span class="slider round"></span>
            </label>
          </div>
          <div class="options">
            <p class="form-subtitle">Contacts Only</p>
            <label class="switch">
              <input type="radio" id="contacts" name="visibility" value="contacts" v-model="visibility" @change="resetBehaviorOptions" />
              <span class="slider round"></span>
            </label>
          </div>
          <div class="options">
            <p class="form-subtitle">Public</p>
            <label class="switch">
              <input type="radio" id="public" name="visibility" value="public" v-model="visibility" @change="resetBehaviorOptions" />
              <span class="slider round"></span>
            </label>
          </div>
          <!-- Time capsule setting -->
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
              <input type="checkbox" v-model="behaviorIsSend" :disabled="visibility != 'private'" />
              <span class="slider round"></span>
            </label>
            <p class="form-subtitle">{{ behaviorIsSend ? "Send" : "Delete" }}</p>
          </div>
        </div>
      </fieldset>
    </div>
    <button type="submit" class="bluebuttoncenterlong">Create Wish</button>
  </form>
</template>

<style scoped>
.entry-date {
  display: flex;
  width: 277px;
  height: 19px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: #131313;
}
.create-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
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

textarea.wish-content {
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

.wish-fields {
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
</style>
