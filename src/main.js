// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './styles/index.scss'
// 引入element-ui
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
// 引入vue-echarts 图形数据可视化表
import Echarts from 'vue-echarts'
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 引入富文本的样式文件
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// vue-amap
import VueAMap from 'vue-amap'

// 引入vuex中的 store
import store from '@/store/store.js'
// 使用vue-echarts 制作 数据可视化表
Vue.component('chart', Echarts)
// 使用ElementUI框
Vue.use(ElementUI)
// 使用富文本编辑器
Vue.use(VueQuillEditor)
// 使用vue-amap地图插件
Vue.use(VueAMap)
// 初始化vue-amap
VueAMap.initAMapApiLoader({
  // 高德的key
  key: '6a204f2b675f32f8849ec4b6b7c21e5c',
  // 插件集合
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 高德 sdk 版本，默认为 1.4.4
  v: '1.4.4'
})

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
  store, // 注入vuex中的store
  router,
  components: { App },
  template: '<App/>'
})
