import axios, { promiseWrap, promiseHandleRet } from '../libs/request'

export const logout = ({ idCard, password }) => {
  return axios.request({
    method: 'get',
    url   : '/auth/logout',
    params: { idCard, password }
  })
}
export const fetchUserInfo = () => {
  return axios.request({
    method: 'get',
    url   : `/auth/token/${localStorage.getItem('token')}`
  })
}
export const fetchUserByName = query => {
  return axios.request({
    method: 'get',
    url   : `/sys/user/realName/${query}`
  })
}

export const asyncDelRowById = async url => {
  const ret = await promiseWrap(
    axios.request({
      method: 'delete',
      url
    })
  )
  return promiseHandleRet(ret, ['删除失败！', '删除成功!'])
}

export const fetchDictByName = name => {
  return axios.request({
    method: 'get',
    url   : `/sys/web/dict/children/${name}`
  })
}
export const fetchDictByNameTree = name => {
  return axios.request({
    method: 'get',
    url   : `/sys/web/tree/${name}`
  })
}
//获取上云应用列表
export const fetchCloudAppList = name => {
  return axios.request({
    method: 'get',
    url   : '/srm/cloudApp/list',
    params: { name }
  })
}
export const fetchAppDetail = id => {
  return axios.request({
    method: 'get',
    url   : `/srm/cloudApp/detail/${id}`
  })
}

export const fetchDaasServiceByName = name => {
  return axios.request({
    method: 'get',
    url   : '/srm/daas/list',
    params: { name }
  })
}
export const asyncDaasService = ({ orderNum, serviceId }) => {
  return axios.request({
    method: 'post',
    url   : '/bpm/applyDaas/add',
    data  : { orderNum, serviceId }
  })
}
export const asyncIaasService = ({ 
  orderNum, viewName,
  id,
  applicationComponent, specs, image, dataDiskStorage, introduction
}) => {
  return axios.request({
    method: 'post',
    url   : '/bpm/applyIaas/addOrEdit',
    data  : { 
      orderNum, viewName, 
      id,
      configInfo: { applicationComponent, specs, image, dataDiskStorage, introduction }
    }
  })
}

//根据组织机构名模糊查询组织列表
export const fetchOrgDetailList = (name) => {
  return axios.request({
    method: 'get',
    url   : '/sys/org/detail/' + name
  })
}
//提交申请信息
export const asyncApplySubmit = data => {
  return axios.request({
    method: 'post',
    url   : '/bpm/applyOrder/addOrEdit',
    data
  })
}

export const fetchProcessStepList = orderNum => {
  return axios.request({
    method: 'get',
    url   : `/bpm/instance/wfmListByOrderNum/${orderNum}`
  })
}
export const fetchApprovalList = orderId => {
  return axios.request({
    method: 'get',
    url   : `/bpm/instance/approveList/${orderId}`
  })
}

export const fetchFeedbackList = orderId => {
  return axios.request({
    method: 'get',
    url   : `/bpm/feedback/list/${orderId}`
  })
}
export const asyncAddFeedback = ({
  orderId, content
}) => {
  return axios.request({
    method: 'post',
    url   : '/bpm/feedback/add',
    data  : { orderId, content }
  })
}

export const updateProcess = ({
  id, comment, type, taskId,
  person, result
}) => {
  return axios.request({
    method: 'put',
    url   : '/bpm/applyOrder/operate',
    data  : { 
      id, comment, type, taskId,
      person, result
    }
  })
}