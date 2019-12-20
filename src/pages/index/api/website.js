
import axios from '_index/libs/request'

//获取评价列表
export const fetchListAllByName = data => {
  return axios.request({
    method: 'get',
    url   : '/srm/document/listAllByCondition',
    params: data
  })
}