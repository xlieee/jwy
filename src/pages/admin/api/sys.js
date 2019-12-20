import axios, { promiseWrap, promiseHandleRet }  from '@/libs/request'

// dict
export const fetchDictTreeList = () => {
  return axios.request({
    method: 'get',
    url   : '/sys/dict/tree'
  })
}
export const updateDictItem = async ({ 
  id, name, pid, remark, sort, value, pvalue
}) => {
  const action = id ? '修改' : '新增'
  const ret = await promiseWrap(
    axios.request({
      method: 'put',
      url   : '/sys/dict/add',
      data  : { id, name, pid, remark, sort, value, pvalue }
    })
  )
  return promiseHandleRet(ret, [`${action}失败！`, `${action}成功!`])
}

// org
export const fetchOrgTreeList = () => {
  return axios.request({
    method: 'get',
    url   : '/sys/org/tree'
  })
}
export const updateOrgItem = async ({ 
  id, pid, name, title, sort, value, 
  description, code, contactPerson, contactNumber, parentFullOrgId
}) => {
  const action = id ? '修改' : '新增'
  const ret = await promiseWrap(
    axios.request({
      method: 'put',
      url   : '/sys/org/add',
      data  : { 
        id, pid, name, title, sort, value, 
        description, code, contactPerson, contactNumber, parentFullOrgId
      }
    })
  )
  return promiseHandleRet(ret, [`${action}失败！`, `${action}成功!`])
}

// role

export const updateRole = ({ 
  id, name, value /* code */, description
}) => {
  return axios.request({
    method: 'put',
    url   : '/sys/role/add',
    data  : { id, name, value, description }
  })
}
export const fetchRoleList = ({
  current, size, name
}) => {
  return axios.request({
    method: 'post',
    url   : '/sys/role/page',
    data  : { current, size, name }
  }) 
}
export const fetchPermissionList = () => {
  return axios.request({
    method: 'get',
    url   : '/sys/permission/all'
  }) 
}
export const fetchPermissionById = id => {
  return axios.request({
    method: 'get',
    url   : `/sys/role/rolePermission/${id}`
  }) 
}
export const updatePermission = ({
  permissionIds, roleId
}) => {
  return axios.request({
    method: 'put',
    url   : '/sys/role/modifyPermission',
    data  : { permissionIds, roleId }
  }) 
}

// log

export const fetchLogList = ({
  current, size, name, content
}) => {
  return axios.request({
    method: 'get',
    url   : '/sys/log/page',
    data  : { current, size, name, content }
  })
}

// tenant

export const fetchTenantList = ({
  current, size, name, orgName
}) => {
  return axios.request({
    method: 'post',
    url   : '/sys/tenant/page',
    data  : { current, size, name, orgName }
  })
}
export const updateTenant = ({ 
  id, name, orgIds
}) => {
  return axios.request({
    method: 'put',
    url   : '/sys/tenant/add',
    data  : { tenantId: id, name, orgIds }
  })
}

// user

export const fetchUserTypeList = () => {
  return axios.request({
    method: 'get',
    url   : '/sys/user/allUserType'
  })
}
export const fetchUserList = ({
  current, size, realName, idCard, type, orgId
}) => {
  return axios.request({
    method: 'get',
    url   : '/sys/user/page',
    params: { current, size, realName, idCard, type, orgId }
  })
}
export const updateUser = async ({ 
  id,
  realName, idcard, phone, sort, orgs,
  type, manageOrgs, tenantId, duty, policeNumber,
  policeRank, policeType, roles, description
}) => {
  const action = id ? '修改' : '新增'
  const ret = await promiseWrap(
    axios.request({
      method: 'put',
      url   : '/sys/user/add',
      data  : { 
        id,
        realName, idcard, phone, sort, orgs,
        type, manageOrgs, tenantId, duty, policeNumber,
        policeRank, policeType, roles, description
      }
    })
  )
  return promiseHandleRet(ret, [`${action}失败！`, `${action}成功!`])
}

export const updateUserPwd = async id => {
  const ret = await promiseWrap(
    axios.request({
      method: 'get',
      url   : `/sys/user/resetPassword/${id}`
    })
  )
  return promiseHandleRet(ret, ['重置失败！', '重置成功!'])
}

export const fetchWorkflowList = ({
  current, size, name, type
}) => {
  return axios.request({
    method: 'get',
    url   : '/bpm/workflow/page',
    params: { current, size, name, type }
  })
}
export const updateWorkflow = ({
  id,
  description, name, modelVoList, type, version
  
}) => {
  return axios.request({
    method: 'put',
    url   : '/bpm/workflow/add',
    data  : {
      id,
      description, name, modelVoList, type, version
    }
  })
}
export const fetchWorkflowById = id => {
  return axios.request({
    method: 'get',
    url   : `/bpm/workflow/${id}`
  })
}
