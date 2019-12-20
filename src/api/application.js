import axios from '../libs/request'

export const fetchPageList = ({
  current, size, type, orderNum, state, startDate, endDate, name, status
}) => {
  return axios.request({
    method: 'get',
    url   : '/bpm/applyOrder/page',
    params: {
      current, size, type, orderNum, state, startDate, endDate, name, status
    }
  })
}
//工作台申请审批列表分页条件查询
export const fetchWebPageList = ({
  current, size, type, orderNum, state, startDate, endDate, name, status
}) => {
  return axios.request({
    method: 'get',
    url   : '/bpm/applyOrder/workbench/approvalPage/' + type,
    params: {
      current, size, type, orderNum, state, startDate, endDate, name, status
    }
  })
}
export const fetchDetailById = id => {
  return axios.request({
    method: 'get',
    url   : `/bpm/applyOrder/detail/${id}`
  })
}

export const fetchBizList = id => {
  return axios.request({
    method: 'get',
    url   : `/bpm/applyOrder/businessHanding/${id}`
  })
}
export const asyncDelBiz = id => {
  return axios.request({
    method: 'put',
    url   : `/bpm/applyDaas/deleteOrRecover/${id}`
  })
}
export const updateDaasBiz = ({
  businessId, secretKey, id
}) => {
  return axios.request({
    method: 'post',
    url   : '/bpm/applyDaas/handing',
    data  : { businessId, secretKey, id }
  })
}
