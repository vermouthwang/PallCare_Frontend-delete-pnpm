import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useNavigationStore = defineStore(
  "naviagtion",
  () => {
    let navigationVisible = ref(false);

    const showNav = computed(() => navigationVisible.value == true);

    const setNavOff = () => {
      navigationVisible.value = false;
    };

    const setNavOn = () => {
      navigationVisible.value = true;
    };

    return {
      navigationVisible,
      showNav,
      setNavOff,
      setNavOn,
    };
  },
  { persist: true },
);
