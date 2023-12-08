<script setup lang="ts">
import { default as AppContactComponent } from "@/components/Contact/AppContactComponent.vue";
import EmailContactComponent from "@/components/Contact/EmailContactComponent.vue";
import router from "@/router";
import { useContactStore } from "@/stores/contact";
import { computed, onBeforeMount, ref } from "vue";

const { createEmailContact, createUserContact, getContacts, getAllEmailContacts, getAllAppContactsUsername } = useContactStore();

const loaded = ref(false);
let showAppText = ref(false);
let showEmailText = ref(false);



let showAddAppContacts = ref(false);
let showAddEmailContacts = ref(false);

let appUser = ref('');
let emailUser = ref('');
let emailUserName = ref('');

let appUsers = ref<Array<Record<string, string>>>([]);
let emailUsers = ref<Array<Record<string, string>>>([]);


let showAllAppUsers = ref(false);
let showAllEmailUsers = ref(true);


let displayedAppUsers = computed(() => {
  return showAllAppUsers.value ? appUsers.value : appUsers.value.slice(0, 1);
});


let displayedEmailUsers = computed(() => {
  return showAllEmailUsers.value ? emailUsers.value : emailUsers.value.slice(0, 1);
});




async function back() {
    void router.push({ name: "Home" });
}


function showAddApp()  {
    showAddAppContacts.value = true;
}

function showAddEmail()  {
    showAddEmailContacts.value = true;
}

function cancel()  {
    appUser.value ='';
    emailUser.value ='';
    showAddAppContacts.value = false;
    showAddEmailContacts.value = false;
}

function submitAddApp()  {
    // await createUserContact()

    showAddAppContacts.value = false;
    appUser.value ='';
}

async function submitAddEmail()  {
    await createEmailContact( emailUserName.value, emailUser.value,)
    // showAddEmailContacts.value = false;
    emailUser.value ='';
    emailUserName.value ='';
    showAddEmailContacts.value = false;
    getEmailContacts()
}

async function getEmailContacts(){
  emailUsers.value = await getAllEmailContacts()
  appUsers.value = await getAllAppContactsUsername()
}

onBeforeMount(async () => {
//   await getContacts();
  getEmailContacts()
  loaded.value = true;
});


</script>

<template>
    <main>
      <img @click="back" src="@/assets/images/back.svg"/>
  
    <h1>Your Contacts</h1>

    <div class="section">
        <div class="title">
            <h2>App Contacts</h2>
            <span @click="showAppText = !showAppText" class="badge">?</span>
            <p v-if="showAppText" class="question">These are contacts that have accounts in the app.</p>
        </div>

        <div v-if="loaded && appUsers.length !== 0">
        <article v-for="appUser in displayedAppUsers" :key="appUser._id">
            <AppContactComponent :appUser="appUser"/>
        </article>
        </div>  
        <p v-else-if="loaded">No App Users Yet</p>
        <p v-else>Loading...</p>

        <!-- for  example -->
        <!-- <div class="user">
            <img src="@/assets/images/profile.svg"/>
            <p>Contact Name</p>
        </div>
        <div class="user">
            <img src="@/assets/images/profile.svg"/>
            <p>Contact Name</p>
        </div> -->

        <div v-if="showAddAppContacts" class="modal">
            <div class="modal-content">
                <form @submit.prevent="submitAddApp">
                    <label for="content">Invite App User:</label>
                    <textarea id="content" v-model="appUser" placeholder="User Email" required> </textarea>
                    <div class="buttons">
                      <button type="submit" class="" >Submit</button>
                      <button class="" @click="cancel" >Cancel</button>
                    </div>
                  </form>
            </div>
        </div>

        <button @click="showAddApp">Invite User to App</button>
    </div>

    <div class="section">
        <div class="title">
            <h2>Email Contacts</h2>
            <span @click="showEmailText = !showEmailText" class="badge">?</span>
            <p v-if="showEmailText" class="question">These are contacts that are contacted via email only.</p>
        </div>
        
        <div v-if="loaded && emailUsers.length !== 0">
            <article v-for="emailUser in emailUsers" :key="emailUser._id">
              <EmailContactComponent :emailUser="emailUser"/>
            </article>
        </div>
        <p v-else-if="loaded">No Email Users Yet</p>
        <p v-else>Loading...</p>
        
        <!-- for example -->
        <!-- <div class="user">
            <img src="@/assets/images/user.svg"/>
            <p>Email address</p>
        </div>
        <div class="user">
            <img src="@/assets/images/user.svg"/>
            <p>Email address</p>
        </div> -->

        <div v-if="showAddEmailContacts" class="modal">
            <div class="modal-content">
                <form @submit.prevent="submitAddEmail">
                    <label for="content">Add Email Contact:</label>
                    <input id="content" v-model="emailUser" placeholder="Contact Email" required/>
                    <input id="emailusername" v-model="emailUserName" placeholder="Contact Name" required/>
                    <div class="buttons">
                      <button type="submit" class="" >Submit</button>
                      <button class="" @click="cancel" >Cancel</button>
                    </div>
                  </form>
            </div>
        </div>
        <button @click="showAddEmail">Add Email Contact</button>
    </div>
  
    </main>
  </template>
  
  <style scoped>
  h1 {
    text-align: center;
  }

  h2 {
    text-align: left;
    line-height: 0;
  }

  .question {
    font-size: 0.9em;
    color:grey;
  }

  .section {
    border: 2px solid black;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
  }

  .title {
    display: flex;
    flex-direction: row;
    justify-content: start;
    gap: 10px;
    margin-bottom: 10px;
  }

  .user {
    display: flex;
    flex-direction: row;
    justify-content: start;
    gap: 10px;
    margin-bottom: 10px;
  }

  .badge {
    height: 15px;
    margin:0
  }

  .modal {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
      position: fixed;
      z-index: 1;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0,0,0,0.3);
    }
    
    .modal-content {
      margin: 15% auto;
      padding: 20px;
      border-radius: 10px;
      width: 80%;
    }

    form {
        -webkit-backdrop-filter: blur(8px);  
        backdrop-filter: blur(8px); 
        box-shadow: 0px 4px 10px 4px rgb(0 0 0 / 40%);
        background: rgba(255, 255, 255, 0.5); 
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        gap: 0.5em;
        padding: 1em;
        border: 2px solid black;
      }
      
      textarea {
        font-family: "SF-Compact-Thin";
        font-size: inherit;
        height: 6em;
        padding: 0.5em;
        border-radius: 4px;
        resize: none;
        background-color: rgba(255, 255, 255, 0.8);
        border: none;
      }

    button {
        height: 40px;
        margin-top: 15px;
    }

    main {
        height: 100vh;
    }
      
    
      
    
  </style>