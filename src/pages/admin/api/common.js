import axios, { promiseWrap, promiseHandleRet } from '@/libs/request'

export const asyncDelRowById = async url => {
  const ret = await promiseWrap(
    axios.request({
      method: 'delete',
      url
    })
  )
  return promiseHandleRet(ret, ['删除失败！', '删除成功!'])
}

export const fetchAllOrgList = () => {
  return axios.request({
    method: 'get',
    url   : '/sys/org/tree'
  })
}

export const fetchDictByName = name => {
  return axios.request({
    method: 'get',
    url   : `/sys/web/dict/children/${name}`
  })
}

export const fetchMenuList = () => {
  return axios.request({
    method: 'get',
    url   : '/sys/permission/all'
  })
}