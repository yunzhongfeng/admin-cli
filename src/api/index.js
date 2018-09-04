import axios from 'axios'
// 配置基准路径
const baseURL = 'http://localhost:8888/api/private/v1/'
axios.defaults.baseURL = baseURL

// 添加拦截器
// Add a request interceptor
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  let token = localStorage.getItem('mytoken')
  if (token) config.headers['Authorization'] = token
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
//  登录
export const login = (params) => {
  return axios.post('login', params).then(res => {
    return res.data
  })
}
// 获取数据列表
export const getListData = pa => {
  return axios.get('users', {params: pa}).then(res => {
    return res.data
  })
}
