// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './styles/index.scss'
// 引入element-ui
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
// 使用ElementUI框
Vue.use(ElementUI)

Vue.config.productionTip = false
// 添加全局路由守卫----使用 router.beforeEach 注册一个全局导航守卫
router.beforeEach((to, from, next) => {
  var token = localStorage.getItem('mytoken')
  // 如果有token值,则next继续进行
  if (token) {
    next()
  } else {
    // console.log(to)
    to.path === '/login' ? next() : next({path: '/login'})
    // if (to.path === '/login') {
    //   next()
    // } else {
    //   next({path: '/login'})
    // }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
