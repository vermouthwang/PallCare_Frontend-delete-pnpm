import { defineStore } from "pinia";
import { ref } from "vue";

import { BodyT, fetchy } from "@/utils/fetchy";

export const usePreferenceStore = defineStore(
  "preference",
  () => {
    const patientUsername = ref("");

    const updatePreferences = async (patch: BodyT) => {
      await fetchy("/api/preferences", "PATCH", { body: { update: patch } });
    };

    const createPatientPasscode = async (passcode: string) => {
      return await fetchy("/api/contact/passcode", "POST", { body: { passcode } });
    };

    const verifyPatientPasscode = async (patientname: string, passcode: string) => {
      return await fetchy(`/api/contact/passcode/verified`, "POST", { body: { patientname, passcode } });
    };

    const boundwithpatient = async (patientname: string) => {
      patientUsername.value = patientname;
      return await fetchy(`/api/contact/bound`, "POST", { body: { patientname } });
    };

    return {
      patientUsername,
      updatePreferences,
      createPatientPasscode,
      verifyPatientPasscode,
      boundwithpatient,
    };
  },
  { persist: true },
);
