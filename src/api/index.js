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
// 获取角色列表中的下拉框数据 --请求路径：roles 请求方法：get
export const getRolesList = () => {
  return axios.get('roles').then(res => {
    return res.data
  })
}
// 实现分配用户角色 -- 请求路径：users/:id/role 请求方法：put
export const grantUser = pa => {
  return axios.put(`users/${pa.id}/role`, {rid: pa.rid}).then(res => {
    return res.data
  })
}
// 实现用户角色的状态改变 -- 请求路径：users/:uId/state/:type 请求方法：put
export const changeuserState = pa => {
  return axios.put(`users/${pa.uId}/state/${pa.type}`).then(res => {
    return res.data
  })
}
// 删除角色指定权限 -- 请求路径：roles/:roleId/rights/:rightId 请求方法：delete
export const deleteRoles = (roleId, rightId) => {
  return axios.delete(`roles/${roleId}/rights/${rightId}`).then(res => {
    return res.data
  })
}
// 添加角色 --请求路径：roles 请求方法：post
export const addRole = pa => {
  return axios.post('roles', pa).then(res => {
    return res.data
  })
}
// 获取权限列表-- 请求路径：请求路径：rights/:type 请求方法：get
export const getRightsList = pa => {
  return axios.get(`rights/${pa.type}`).then(res => {
    return res.data
  })
}
// getAllRightsList 获取权限列表-- 请求路径：请求路径：rights/:type 请求方法：get
export const getAllRightsList = list => {
  return axios.get(`rights/${list}`).then(res => {
    return res.data
  })
}
// 添加单个角色权限 --请求路径：roles/:roleId/rights 请求方法：post
export const grantroleright = (roleId, rids) => {
  return axios.post(`roles/${roleId}/rights`, rids).then(res => {
    return res.data
  })
}
