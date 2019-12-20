
import axios from '_index/libs/request'

//登录
export const login = data => {
  return axios.request({
    method: 'post',
    url   : '/auth/login',
    data

  })
}

//用户详情
export const userInfo = token => {
  return axios.request({
    method: 'get',
    url   : '/auth/token/' + token

  })
}
//退出
export const exit = () => {
  return axios.request({
    method: 'get',
    url   : '/auth/logout'
  })
}