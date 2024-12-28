import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

import Login from "../views/login.vue";
import Doctor from "../views/doctor/doctorSystem.vue";

import Personal from "../views/personal/index.vue";
import personalInfo from "../views/personal/personal_info.vue";
// 引入个人信息的组件

import Patient from "../views/mypatient/index.vue";
import patientList from "../views/mypatient/patient_list.vue";
import patientDetail from "../views/mypatient/patient_detail.vue";
// 引入我的病人组件

Vue.use(VueRouter);

const routes = [{
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/doctor",
    name: "doctor",
    component: Doctor,
    redirect: "/doctor/patient/list",
    children: [
      {
        path: "personal",
        component: Personal,
        redirect: "/doctor/personal/info",
        children: [{
          path: "info",
          component: personalInfo,
        }],
      },
      {
        path: "patient",
        component: Patient,
        redirect: "/doctor/patient/list",
        children: [
          {
            path: "list",
            component: patientList,
          },
          {
            path: "detail/:id/:from",
            component: patientDetail,
            name: "patientDetail"
          },
          {
            path: "diagnose/:id",
            component: patientDetail,
            name: "diagnose"
          }
        ],
      },
      {
        path: "statistics",
        name: "Statistics",
        component: () => import('@/views/statistics/index'),
        meta: { title: '统计信息' }
      }
    ],
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: () => import('@/views/statistics/index'),
    meta: { title: '统计信息' }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  // 如果是登录页面,直接放行
  if (to.path === '/login') {
    next();
    return;
  }
  
  // 判断是否登录
  const token = localStorage.getItem('token');
  if (!token) {
    next('/login');
    return;
  }
  
  next();
});

const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch((error) => error);
};

export default router;