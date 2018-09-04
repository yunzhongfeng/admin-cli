import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import User from '@/views/user/User.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'Login',
      path: '/login',
      component: Login
    },
    {
      name: 'Home',
      path: '/',
      component: Home,
      children: [
        {
          name: 'User',
          path: 'user',
          component: User
        }
      ]
    }
  ]
})
