import { defineStore } from "pinia";

import { fetchy } from "@/utils/fetchy";

export const useContactStore = defineStore(
  "contact",
  () => {
    const createEmailContact = async (username: string, email: string) => {
      await fetchy("/api/contact/email", "POST", {
        body: { username, email },
      });
    };

    const createUserContact = async (contact: string) => {
      await fetchy("/api/contact", "POST", {
        body: { contact },
      });
    };

    const getContacts = async () => {
      return await fetchy(`/api/contact`, "GET");
    };

    const getAllEmailContacts = async () => {
      const emailcontacts = await fetchy(`/api/contact/email`, "GET");
      // return emailcontacts;
      const contactlist = [];
      for (const contact of emailcontacts) {
        let contactname = await fetchy(`/api/contact/receiver/${contact.contact}`, "GET");
        let contactemailaddress = await fetchy(`/api/email/${contact.contact}`, "GET");
        contactlist.push({ contactname, contactemailaddress });
      }
      return contactlist;
    };

    const getAllAppContactsUsername = async () => {
      const appcontact = await fetchy(`/api/contact/inapp`, "GET");
      const contactlist = [];
      for (const contact of appcontact) {
        try {
          let contactname = await fetchy(`/api/user/username/${contact.contact}`, "GET");
          contactlist.push(contactname);
        } catch (e) {
          continue;
        }
      }
      return contactlist;
    };

    // const getEmailContactInformation = async (contact: Object) => {
    //   let contactname = await fetchy(`/api/contact/receiver/${contact.contact}`, "GET")
    // }

    return {
      createEmailContact,
      createUserContact,
      getContacts,
      getAllEmailContacts,
      getAllAppContactsUsername,
    };
  },
  { persist: true },
);
