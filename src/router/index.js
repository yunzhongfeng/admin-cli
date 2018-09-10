import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import User from '@/views/user/User.vue'
import Welcome from '@/views/Welcome.vue'
import Role from '@/views/rights/Role.vue'
import Right from '@/views/rights/Right.vue'
import Goods from '@/views/goods/Goods.vue'
import List from '@/views/goods/GoodsList.vue'
import Add from '@/views/goods/GoodsAdd.vue'
import Params from '@/views/goods/Params.vue'
import Categories from '@/views/goods/Categories.vue'
import Reports from '@/views/reports/Reports.vue'
import Orders from '@/views/OrdersMag/Orders.vue'
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
          path: 'users',
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
          path: 'rights',
          component: Right
        },
        {
          name: 'Goods',
          path: 'goods',
          component: Goods,
          redirect: {name: 'List'},
          children: [
            {name: 'List', path: 'list', component: List},
            {name: 'Add', path: 'add', component: Add}
          ]
        },
        {
          name: 'Params',
          path: 'params',
          component: Params
        },
        {
          name: 'Categories',
          path: 'categories',
          component: Categories
        },
        {
          name: 'Reports',
          path: 'reports',
          component: Reports
        },
        {
          name: 'Orders',
          path: 'orders',
          component: Orders
        }
      ]
    }
  ]
})
