import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'defualt',
      component: Login
    }, {
      name: 'Login',
      path: '/login',
      component: Login
    },
    {
      name: 'Home',
      path: '/Home',
      component: Home
    }
  ]
})
