import { createRouter, createWebHashHistory } from 'vue-router'

import home from '@/views/home.vue'
import login from '@/views/login.vue'
import register from '@/views/register.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/home', component: home },
  { path: '/login', component: login },
  { path: '/register', component: register }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')//1.读取token
  if (to.path === '/home' && !token) {       //2.想要访问"后台主页"且token值不存在
    //next(false) //3.1 不允许跳转
    next('/login')//3.2 强制跳转到"登录页面"
  } else {
    next()        //3.3 直接放行，允许访问"后台主页"
  }
})

export default router
