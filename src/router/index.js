import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import User from '@/views/user/User.vue'
import Welcome from '@/views/Welcome.vue'
import Role from '@/views/rights/Role.vue'
import Right from '@/views/rights/Right.vue'
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
      redirect: {name: 'Welcome'},
      // 添加嵌套路由
      children: [
        {
          name: 'User',
          path: 'user',
          component: User
        },
        {
          name: 'Welcome',
          path: 'welcome',
          component: Welcome
        },
        {
          name: 'Role',
          path: 'roles',
          component: Role
        },
        {
          name: 'Right',
          path: 'right',
          component: Right
        }
      ]
    }
  ]
})
