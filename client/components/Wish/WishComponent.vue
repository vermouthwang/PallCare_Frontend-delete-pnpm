<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useTCStore } from "../../stores/timeCapsule";
import { fetchy } from "../../utils/fetchy";
import { formatEntryDate } from "../../utils/formatDate";

const { addToTimeCapsule } = useTCStore();
const props = defineProps(["wish", "capsule"]);
const emit = defineEmits(["editWish", "refreshWishes"]);
const { currentUsername } = storeToRefs(useUserStore());
const { isContact, isAuthor } = useUserStore();

const canView = computed(() => {
  if (props.wish.visibility === "public") {
    return true;
  } else if (props.wish.visibility === "contacts") {
    return isContact(props.wish.author);
  } else {
    return isAuthor(props.wish.author);
  }
});

const canEdit = computed(() => {
  return isAuthor(props.wish.author);
});

const deleteWish = async () => {
  try {
    await fetchy(`/api/wishes/${props.wish._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshWishes");
};

async function addWishToCapsule(behavior: "send" | "delete") {
  await addToTimeCapsule(currentUsername.value, props.wish._id, "Wish", behavior);
  emit("refreshWishes");
}
</script>

<template>
  <div class="card">
    <div class="top">
      <span v-if="props.wish.visibility == 'private'" class="ribbon">PRIVATE</span>
      <span v-else-if="props.wish.visibility == 'contacts'" class="ribbon2">CONTACTS</span>
      <span v-else class="ribbon2">PUBLIC</span>
      <text class="date">{{ formatEntryDate(props.wish.dateCreated) }}</text>
    </div>
    <div class="bottom">
      <text v-if="canView" class="wishcontent">{{ props.wish.content.substring(0, 90) + ".." }}</text>
      <div class="buttons" v-if="props.capsule">
        <button v-if="props.wish.visibility == 'private'" class="little-black" @click="addWishToCapsule('send')">Send</button>
        <button class="little-black" @click="addWishToCapsule('delete')">Delete</button>
      </div>
      <div class="buttons" v-else-if="canEdit">
        <button class="little-black" @click="emit('editWish', props.wish._id)">Edit</button>
        <button class="little-gray" @click="deleteWish">Delete</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  width: 300px;
  height: 95px;
  padding: 1.5px 0px 9px 1.5px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  border-radius: var(--numbers-spacing-12, 12px);
  border: 1.5px solid #000;
}

p {
  margin: 0em;
}
.top {
  display: flex;
  width: 350px;
  height: 28px;
  padding: 0px -10px;
  align-items: center;
  gap: 40px;
  flex-shrink: 0;
}
.date {
  display: flex;
  width: 207px;
  height: 18px;
  flex-direction: column;
  justify-content: flex-end;
  flex-shrink: 0;
  color: #000;
  font-family: SF Pro Display;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 82.938%;
}
.wishcontent {
  display: flex;
  width: 190px;
  height: 45px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: #8d8989;
  font-family: SF Pro Display;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.buttons {
  display: flex;
  width: 66px;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}
menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.bottom {
  display: flex;
  width: 225px;
  padding: 0px 20px 0px 13px;
  align-items: flex-start;
  gap: 20px;
}

.base article:only-child {
  margin-left: auto;
}

.little-black {
  display: flex;
  width: 75px;
  height: 25px;
  padding: 10px;
  background: #131313;
  font: 100% SF Pro Display;
  font-size: 16px;
}
.ribbon {
  width: 60px;
  font-size: 14px;
  padding: 4px;
  position: relative;
  left: -10px;
  box-shadow: 2px 2px 6px #9d9c9c;
  text-align: center;
  border-radius: 25px;
  transform: rotate(-20deg);
  background-color: #edb4c7;
  color: white;
}
.ribbon2 {
  width: 60px;
  font-size: 14px;
  padding: 4px;
  position: relative;
  left: -10px;
  box-shadow: 2px 2px 6px #9d9c9c;
  text-align: center;
  border-radius: 25px;
  transform: rotate(-20deg);
  background-color: #9fb9c7;
  color: rgb(0, 0, 0);
}
.little-gray {
  display: flex;
  width: 75px;
  height: 25px;
  padding: 10px;
  background: rgb(101, 103, 104);
  font: 100% SF Pro Display;
  font-size: 16px;
}
</style>
