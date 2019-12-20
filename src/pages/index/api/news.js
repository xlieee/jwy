
import axios from '_index/libs/request'
//获取新闻列表
export const fetchNewsList = data => {
  return axios.request({
    method: 'get',
    url   : '/cms/web/news/page',
    params: data
  })
}
//获取新闻详情
export const fetchDataDetailById = (id, type) => {
  return axios.request({
    method: 'get',
    url   : '/cms/web/' + type + '/detail/' + id + '?type=2'
  })
}

//获取轮播图列表
export const fetchCarouselData = data => {
  return axios.request({
    method: 'get',
    url   : '/cms/web/carousel/page',
    params: data
  })
}
//获取规范文档类型列表
export const fetchDocumentTypeList = () => {
  return axios.request({
    method: 'get',
    url   : '/sys/web/dict/children/docType'
  })
}
//获取规范文档列表
export const fetchDocumentData = data => {
  return axios.request({
    method: 'get',
    url   : '/cms/document/page',
    params: data
  })
}
//获取常见问题类型列表
export const fetchProblemTypeList = () => {
  return axios.request({
    method: 'get',
    url   : '/sys/web/dict/children/problemType'
  })
}

//获取常见问题列表
export const fetchProblemData = data => {
  return axios.request({
    method: 'get',
    url   : '/cms/problem/page',
    params: data
  })
}