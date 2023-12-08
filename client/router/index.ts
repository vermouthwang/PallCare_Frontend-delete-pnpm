import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import AccountTypeView from "../views/AccountTypeView.vue";
import ContactView from "../views/ContactView.vue";
import { CreateDiaryView, DiaryView, EditDiaryView } from "../views/Diary/_diaryViews";
import CreateTopicView from "../views/Forum/CreateTopicView.vue";
import EditTopicView from "../views/Forum/EditTopicView.vue";
import ForumView from "../views/Forum/ForumView.vue";
import TopicView from "../views/Forum/TopicView.vue";
import HomeView from "../views/HomeView.vue";
import { CreateLetterView, EditLetterView, LetterView, ResponseLetterView } from "../views/Letter/_letterView";
import LoginView from "../views/LoginView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import RegisterView from "../views/RegisterView.vue";
import SettingView from "../views/SettingView.vue";
import { TimeCapsuleAddContentView, TimeCapsuleContentView, TimeCapsuleView } from "../views/TimeCapsule/_timeCapsuleViews";
import CreateWishView from "../views/Wish/CreateWishView.vue";
import WishBoardViewVue from "../views/Wish/WishBoardView.vue";
import PreferenceViewF from "../views/family/PreferenceViewF.vue";
import PreferenceViewFb from "../views/family/PreferenceViewFb.vue";
import PreferenceViewP from "../views/patient/PreferenceViewP.vue";
import PreferenceViewPb from "../views/patient/PreferenceViewPb.vue";
import PreferenceViewPc from "../views/patient/PreferenceViewPc.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/contact",
      name: "Contact",
      component: ContactView,
      meta: { requiresAuth: true },
    },
    {
      path: "/preferenceF",
      name: "PreferenceF",
      component: PreferenceViewF,
      meta: { requiresAuth: true },
    },
    {
      path: "/preferenceF",
      name: "PreferenceFb",
      component: PreferenceViewFb,
      meta: { requiresAuth: true },
    },
    {
      path: "/preferenceP",
      name: "PreferenceP",
      component: PreferenceViewP,
      meta: { requiresAuth: true },
    },
    {
      path: "/preferencePb",
      name: "PreferencePb",
      component: PreferenceViewPb,
      meta: { requiresAuth: true },
    },
    {
      path: "/preferencePb",
      name: "PreferencePc",
      component: PreferenceViewPc,
      meta: { requiresAuth: true },
    },
    {
      path: "/diary",
      name: "Diary",
      component: DiaryView,
      meta: { requiresAuth: true },
    },
    {
      path: "/diary/create",
      name: "CreateDiary",
      component: CreateDiaryView,
      meta: { requiresAuth: true },
    },
    {
      path: "/diary/edit/:_id",
      name: "EditDiary",
      component: EditDiaryView,
      props: (route) => ({ _id: route.params._id }),
      meta: { requiresAuth: true },
    },
    {
      path: "/letter",
      name: "Letter",
      component: LetterView,
      meta: { requiresAuth: true },
    },
    {
      path: "/letter/create/:capsule?",
      name: "CreateLetter",
      component: CreateLetterView,
      props: (route) => ({ capsule: route.params.capsule }),
      meta: { requiresAuth: true },
    },
    {
      path: "/letter/edit/:_id",
      name: "EditLetter",
      component: EditLetterView,
      props: (route) => ({ _id: route.params._id }),
      meta: { requiresAuth: true },
    },
    {
      path: "/letter/response/:_id",
      name: "ResponseLetter",
      component: ResponseLetterView,
      props: (route) => ({ _id: route.params._id }),
      meta: { requiresAuth: true },
    },
    {
      path: "/forum",
      name: "Forum",
      component: ForumView,
      meta: { requiresAuth: true },
    },
    {
      path: "/forum/topic",
      name: "Topic",
      component: TopicView,
      meta: { requiresAuth: true },
    },
    {
      path: "/forum/create",
      name: "CreateTopic",
      component: CreateTopicView,
      meta: { requiresAuth: true },
    },
    {
      path: "/forum/edit/:_id",
      name: "EditTopic",
      component: EditTopicView,
      props: (route) => ({ _id: route.params._id }),
      meta: { requiresAuth: true },
    },
    {
      path: "/delay",
      name: "Delay",
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: "/wish",
      name: "Wish",
      component: WishBoardViewVue,
      meta: { requiresAuth: true },
    },
    {
      path: "/wish/create",
      name: "CreateWish",
      component: CreateWishView,
      meta: { requiresAuth: true },
    },
    {
      path: "/setting",
      name: "Settings",
      component: SettingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      // beforeEnter: (to, from) => {
      //   const { isLoggedIn } = storeToRefs(useUserStore());
      //   if (isLoggedIn.value) {
      //     return { name: "Settings" };
      //   }
      // },
    },
    {
      path: "/register",
      name: "Register",
      component: RegisterView,
      meta: { requiresAuth: false },
    },
    {
      path: "/accountType",
      name: "AccountType",
      component: AccountTypeView,
      meta: { requiresAuth: false },
      props: true,
    },
    {
      path: "/setting",
      name: "Settings",
      component: SettingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/time_capsule",
      name: "TimeCapsule",
      component: TimeCapsuleView,
      meta: { requiresAuth: true },
    },
    {
      path: "/time_capsule/content",
      name: "TimeCapsuleContent",
      component: TimeCapsuleContentView,
      meta: { requiresAuth: true },
    },
    {
      path: "/time_capsule/add",
      name: "TimeCapsuleAdd",
      component: TimeCapsuleAddContentView,
      meta: { requiresAuth: true },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }
});

export default router;
