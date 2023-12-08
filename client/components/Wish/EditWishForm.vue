<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["wish"]);
const content = ref(props.wish.content);
const emit = defineEmits(["editWish", "refreshWishes"]);

const editWish = async (content: string) => {
  try {
    await fetchy(`/api/wishes/${props.wish._id}`, "PATCH", { body: { update: { content: content } } });
  } catch (e) {
    return;
  }
  emit("editWish");
  emit("refreshWishes");
};
</script>

<template>
    <form @submit.prevent="editWish(content)">
        <p class="author">{{ props.wish.author }}</p>
        <textarea id="content" v-model="content" placeholder="Create a wish!" required> </textarea>
        <div class="base">
        <menu>
            <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
            <li><button class="btn-small pure-button" @click="emit('editWish')">Cancel</button></li>
        </menu>
        <p v-if="props.wish.dateCreated !== props.wish.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.wish.dateUpdated) }}</p>
        <p v-else class="timestamp">Created on: {{ formatDate(props.wish.dateCreated) }}</p>
        </div>
    </form>
</template>

<style scoped>
form {
    background-color: var(--base-bg);
    display: flex;
    flex-direction: column;
    gap: 0.5em;
}

textarea {
    font-family: inherit;
    font-size: inherit;
    height: 6em;
    border-radius: 4px;
    resize: none;
}

p {
    margin: 0em;
}

.author {
    font-weight: bold;
    font-size: 1.2em;
}

menu {
    list-style-type: none;
    display: flex;
    flex-direction: row;
    gap: 1em;
    padding: 0;
    margin: 0;
}

.base {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
}

.timestamp {
    display: flex;
    justify-content: flex-end;
    font-size: 0.9em;
    font-style: italic;
}

</style>