<script setup lang="ts">
import { storeToRefs } from "pinia";
import { defineAsyncComponent, onBeforeMount, ref } from "vue";
import { useUserStore } from "../../stores/user";
import { fetchy } from "../../utils/fetchy";
import EditWishForm from "./EditWishForm.vue";

const WishComponent = defineAsyncComponent(() => import("./WishComponent.vue"));
const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let wishes = ref<Array<Record<string, string>>>([]);
let editing = ref("");

async function getWishes(author?: string) {
  let wishResults;
  try {
    if (author) {
      wishResults = await fetchy("/api/wishes", "GET", { query: { author } });
    } else {
      wishResults = await fetchy("/api/wishes", "GET");
    }
  } catch (_) {
    return;
  }
  wishes.value = wishResults;
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getWishes();
  loaded.value = true;
});
</script>

<template>
  <section class="wishes" v-if="loaded && wishes.length !== 0">
    <article v-for="wish in wishes" :key="wish._id">
      <Suspense>
        <WishComponent v-if="editing !== wish._id" :wish="wish" @refreshWishes="getWishes" @editWish="updateEditing" />
        <EditWishForm v-else :wish="wish" @refreshWishes="getWishes" @editWish="updateEditing" />
      </Suspense>
    </article>
  </section>
  <p v-else-if="loaded">No wishes found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
.wishes {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
