import { createRouter, createWebHistory } from "vue-router";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("../views/Home.vue"),
    },
    {
      path: "/register",
      component: () => import("../views/Register.vue"),
    },
    {
      path: "/sign-in",
      component: () => import("../views/SignIn.vue"),
    },
    {
      path: "/courses-list",
      name: "courses-list",
      component: () => import("../views/Courses.vue"),
    },
    {
      path: "/papers-list/:courseCode",
      name: "papers-list",
      component: () => import("../views/Papers.vue"),
    },
    {
      path: "/questions-list/:paperId",
      name: "questions-list",
      component: () => import("../views/Questions.vue"),
    },
    {
      path: "/generated-paper/:courseCode",
      name: "generated-paper",
      component: () => import("../views/GeneratedPaper.vue"),
    },
    {
      path: "/upload-paper",
      component: () => import("../views/UploadPaper.vue"),
    },
  ],
});

export default router;
