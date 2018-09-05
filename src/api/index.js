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
// 新增用户-- 添加用户请求路径：users 请求方法：post
export const addUser = pa => {
  return axios.post('users', pa).then(res => {
    return res.data
  })
}
// 用户数据编辑 -- 请求路径：users/:id 请求方法：put
export const editUser = pa => {
  return axios.put(`users/${pa.id}`, pa).then(res => {
    return res.data
  })
}
// 用户数据删除 -- 请求路径：users/:id 请求方法：delete
export const deleteUser = delid => {
  return axios.delete(`users/${delid}`).then(res => {
    return res.data
  })
}
