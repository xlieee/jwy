import axios from '../libs/request'

//获取消息列表
export const fetchMessage = data => {
  return axios.request({
    method: 'get',
    url   : '/sys/notification/page',
    params: data

  })
}
//删除消息
export const asyncDeleteMessage = data => {
  return axios.request({
    method: 'delete',
    url   : '/sys/notification/delete/' + data
  })
}
//全部删除
export const asyncDeleteAllMessage = () => {
  return axios.request({
    method: 'delete',
    url   : '/sys/notification/deleteAll'
  })
}
//批量已读
export const asyncReadMessage = data => {
  return axios.request({
    method: 'put',
    url   : '/sys/notification/read/' + data
  })
}
//全部已读
export const asyncReadAllMessage = () => {
  return axios.request({
    method: 'put',
    url   : '/sys/notification/readAll'
  })
}

//工作台申请单统计
export const asyncApplicationForm = () => {
  return axios.request({
    method: 'get',
    url   : '/bpm/applyOrder/workbench/applicationForm'
  })
}