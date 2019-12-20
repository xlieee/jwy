import axios from '@/libs/request'

//获取新闻列表
export const fetchPageData = data => {
  return axios.request({
    method: 'get',
    url   : '/cms/news/page',
    params: data
  })
}
//新增/编辑新闻
export const updateNewsData = data => {
  return axios.request({
    method: 'post',
    url   : '/cms/news/addOrEdit',
    data
  })
}
//上线/下线新闻
export const updateOnlineNews = data => {
  return axios.request({
    method: 'put',
    url   : '/cms/news/onOrDownLine/' + data.id + '?state=' + (data.state === 1 ? 0 : 1)
  })
}
//置顶/取消置顶新闻(top====1:置顶 0:取消)
export const updateTopNews = (id, top) => {
  return axios.request({
    method: 'put',
    url   : `/cms/news/top/${id}?top=${top}`
  })
}

//新闻详情
export const fetchNewsById = id => {
  return axios.request({
    method: 'get',
    url   : '/cms/news/detail/' + id
  })
}

//获取轮播图列表
export const fetchCarouselData = data => {
  return axios.request({
    method: 'get',
    url   : '/cms/carousel/page',
    params: data
  })
}
//新增/编辑轮播图
export const updateCarouselData = data => {
  return axios.request({
    method: 'post',
    url   : '/cms/carousel/addOrEdit',
    data
  })
}
//轮播新闻详情
export const fetchCarouselById = id => {
  return axios.request({
    method: 'get',
    url   : '/cms/carousel/detail/' + id
  })
}
//上线/下线轮播新闻
export const updateOnlineCarousel = data => {
  return axios.request({
    method: 'put',
    url   : '/cms/carousel/onOrDownLine/' + data.id + '?state=' + (data.state === 1 ? 0 : 1)
  })
}
//上移/下移轮播新闻
export const updateCarouselSort = data => {
  return axios.request({
    method: 'put',
    url   : '/cms/carousel/changeSort/' + data.id + '?nextId=' + data.nextId
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
//新增/编辑规范文档
export const updateDocumentData = data => {
  return axios.request({
    method: 'post',
    url   : '/cms/document/addOrEdit',
    data
  })
}
//获取规范文档类型列表
export const fetchDocumentTypeList = () => {
  return axios.request({
    method: 'get',
    url   : '/sys/web/dict/children/docType'
  })
}
//文档详情
export const fetchDocumentById = id => {
  return axios.request({
    method: 'get',
    url   : '/cms/document/detail/' + id
  })
}
//上线/下线文档
export const updateOnlineDocument = data => {
  return axios.request({
    method: 'put',
    url   : '/cms/document/onOrDownLine/' + data.id + '?state=' + (data.state === 1 ? 0 : 1)
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
//新增/编辑常见问题
export const updateProblemData = data => {
  return axios.request({
    method: 'post',
    url   : '/cms/problem/addOrEdit',
    data
  })
}
//常见问题详情
export const fetchProblemById = id => {
  return axios.request({
    method: 'get',
    url   : '/cms/problem/detail/' + id
  })
}
//上线/下线问题
export const updateOnlineProblem = data => {
  return axios.request({
    method: 'put',
    url   : '/cms/problem/onOrDownLine/' + data.id + '?state=' + (data.state === 1 ? 0 : 1)
  })
}