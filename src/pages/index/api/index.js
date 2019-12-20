
import axios from '_index/libs/request'

//获取评价列表
export const fetchEvaluate = (data, id) => {
  return axios.request({
    method: 'get',
    url   : '/srm/evaluation/page/' + id,
    params: data

  })
}
//新增评论
export const asyncAddEvaluate = data => {
  return axios.request({
    method: 'post',
    url   : '/srm/evaluation/add',
    data  : data

  })
}
//评论详情
export const fetchEvaluateById = id => {
  return axios.request({
    method: 'get',
    url   : '/srm/evaluation/' + id

  })
}
//回复评价
export const asyncReplyEvaluate = data => {
  return axios.request({
    method: 'post',
    url   : '/srm/evaluationReply/reply',
    data
  })
}
//获取SaaS子类列表
export const fetchSubclass = (type) => {
  return axios.request({
    method: 'get',
    url   : `/sys/web/dict/children/srm${type}Subclass`
  })
}
//获取saas/daas/iaas/paas/yun列表--门户
export const fetchAssData = (data, type) => {
  return axios.request({
    method: 'get',
    url   : `/srm/web/${type}/page`,
    params: data
  })
}
//获取saas/daas/iaas/paas/yun列表
export const fetchAssUseTokenData = (data, type) => {
  return axios.request({
    method: 'get',
    url   : `/srm/${type}/page`,
    params: data
  })
}
//获取saas/daas/iaas/paas/yun详情
export const fetchAssDataById = (id, type) => {
  return axios.request({
    method: 'get',
    url   : `/srm/${type}/detail/${id}`
  })
}
//获取saas/daas/iaas/paas/yun服务详情
export const fetchDataSubclassfwById = (id, type) => {
  return axios.request({
    method: 'get',
    url   : `/srm/overview/list/${id}?sourceType=${type}`
  })
}
//获取saas/daas/iaas/paas/yun文档列表
export const fetchDataDocumentList = (id, type) => {
  return axios.request({
    method: 'get',
    url   : `/srm/document/list/${id}?sourceType=${type}`
  })
}
//获取saas/daas/iaas/paas/yun列表介绍
export const fetchDataInstroduction = (type) => {
  return axios.request({
    method: 'get',
    url   : `/sys/web/dict/value/${type}`
  })
}