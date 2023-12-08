<script setup lang="ts">
import LetterListComponent from "../../components/Letter/LetterListComponent.vue";
import router from "../../router";
</script>
<template>
  <body>
    <div class="navigation">
      <img @click="router.push({ name: 'Home' })" src="@/assets/images/home.png" />
      <text class="pagetitle">Letter</text>
    </div>
    <div class="pageexplainationdiv">
      <text class="pageexplaination">You can write a letter here and send it either to your contact in this app or an email contact which you can add in your contact page.</text>
    </div>
    <div class="creatediv" @click="router.push({ name: 'CreateLetter' })">
      <text class="createdivtitle">Write a new letter here</text>
      <div class="blank">
        <img src="@/assets/images/diaryicon.png" style="height: 200%; width: fit-content" />
      </div>
    </div>
    <div class="previousDiarytitle">
      <text class="previousDiary">Previous Letters</text>
      <input type="text" class="diarysearchbar" placeholder="Search" />
    </div>
    <LetterListComponent />
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
  gap: 15px;
}
.creatediv {
  display: flex;
  width: 290px;
  height: 89px;
  padding-left: 14px;
  align-items: center;
  gap: 39px;
  flex-shrink: 0;
  border-radius: var(--numbers-spacing-12, 12px);
  background: #9fb9c7;
}
.createdivtitle {
  display: flex;
  width: 162px;
  height: 57px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: #000;
  font-family: SF Pro Display;
  font-size: 22px;
  font-style: normal;
  font-weight: 600;
  line-height: 103.822%;
}
.navigation {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.blank {
  display: flex;
  width: 68px;
  height: 62px;
  align-items: flex-end;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 7px;
  background-color: #f0e7d8;
}

.previousDiarytitle {
  display: flex;
  height: 46px;
  align-items: flex-start;
  gap: 20px;
  padding-top: 10px;
}

.previousDiary {
  display: flex;
  width: 171px;
  height: 35px;
  flex-direction: column;
  justify-content: center;
  color: #000;
  font-family: SF Pro Display;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.diarysearchbar {
  display: flex;
  width: 103px;
  height: 26px;
  padding: 0px 7px;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  border-radius: var(--numbers-spacing-12, 12px);
  border: 1.3px solid #000;
  background: #f0e7d8;
}
</style>
