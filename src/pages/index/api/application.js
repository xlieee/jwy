
import axios from '_index/libs/request'

//获取评价列表
export const asyncAddCart = data => {
  return axios.request({
    method: 'post',
    url   : '/bpm/shoppingCart/add',
    data

  })
}
//获取购物车列表
export const fetchCartList = () => {
  return axios.request({
    method: 'get',
    url   : '/bpm/shoppingCart/list'
  })
}
//获取购物车删除/批量删除
export const asyncDeleteCart = id => {
  return axios.request({
    method: 'delete',
    url   : '/bpm/shoppingCart/delete/' + id
  })
}
//获取购物车数量
export const fetchCartCount = () => {
  return axios.request({
    method: 'get',
    url   : '/bpm/shoppingCart/count'
  })
}

