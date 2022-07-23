/*
 * @Description:
 * @Author: code pro
 * @Date: 2022-06-07 17:57:41
 * @LastEditTime: 2022-06-19 18:28:29
 * @LastEditors: code pro
 */
import { createRouter, createWebHashHistory } from "vue-router";
import App from "../App.vue";

const routes = [
  {
    path: "/",
    name: "app",
    component: App,
    children: [
      {
        path: "/users",
        name: "users",
        component: () => import("@/pages/user/manage/index.vue"),
      },
      {
        path: "/agent/commission",
        name: "AgentCommission",
        component: () => import("@/pages/agent/agent-commission/index.vue"),
      },
      {
        path: "",
        name: "AgentManage",
        component: () => import("@/pages/agent/agent-manage/index.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/user/login"),
  },
  {
    path: "/landing",
    name: "landing",
    component: () => import("../pages/LandingDemo.vue"),
  },
  {
    path: "/error",
    name: "error",
    component: () => import("../pages/Error.vue"),
  },
  {
    path: "/:pathMatch(.*)",
    name: "notfound",
    component: () => import("../pages/NotFound.vue"),
  },
  {
    path: "/access",
    name: "access",
    component: () => import("../pages/Access.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
