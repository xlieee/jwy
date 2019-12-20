import axios from '@/libs/request'

export const fetchServiceList = (serviceType, { current, size, name, subclass, state }) => {
  return axios.request({
    method: 'get',
    url   : `/srm/${serviceType}/page`,
    params: { current, size, name, subclass, state }
  })
}
export const updateSaasService = (name, { 
  id, fullName, shortName, subclass, areaVal, policeTypeVal,
  sort, sourceId, systemUrl, description, imageId,
  constructionUnit, constructionPerson, constructionPhone,
  buildUnit, buildPerson, buildPhone,
  version, formCode, approvalProcess, ifApply, ifApi, applyDesc
}) => {
  return axios.request({
    method: 'post',
    url   : `/srm/${name}/addOrEdit`,
    data  : { 
      id, fullName, shortName, subclass, areaVal, policeTypeVal,
      sort, sourceId, systemUrl, description, imageId,
      constructionUnit, constructionPerson, constructionPhone,
      buildUnit, buildPerson, buildPhone,
      version, formCode, approvalProcess, ifApply, ifApi, applyDesc
    }
  })
}
export const updateOverviewService = data => {
  return axios.request({
    method: 'post',
    url   : '/srm/overview/addOrEdit',
    data  
  })
}
export const fetchServiceById = (name, id) => {
  return axios.request({
    method: 'get',
    url   : `/srm/${name}/detail/${id}`
  })
}
export const fetchServiceActionList = (name, serviceId, sourceType) => {
  return axios.request({
    method: 'get',
    url   : `/srm/${name}/list/${serviceId}`,
    params: { sourceType }
  })
}
export const updateDocService = ({
  id,
  type, sourceType, name, serviceId,
  content, fileId
}) => {
  return axios.request({
    method: 'post',
    url   : '/srm/document/addOrEdit',
    data  : {
      id,
      type, sourceType, name, serviceId,
      content, fileId
    }
  })
}

export const updateDocSortService = (id, nextId) => {
  return axios.request({
    method: 'put',
    url   : `/srm/document/changeSort/${id}`,
    params: { nextId }
  })
}
export const updateOnlineService = (name, id, state) => {
  return axios.request({
    method: 'put',
    url   : `/srm/${name}/onOrDownLine/${id}`,
    params: { state }
  })
}
export const fetchFormCode = sourceApiType => {
  return axios.request({
    method: 'get',
    url   : `/sys/web/dict/value/${sourceApiType}FormCode`
  })
}