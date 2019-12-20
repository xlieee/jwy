// import * as request from './index'

// export const login = ({ userName, password }) => {
//   return request.post('http://localhost:3001/login', {
//     userName,
//     password
//   })
// }

// export const getUserInfo = () => {
//   return request.get('/api/getUserInfo')
// }

import axios from '_index/libs/request'

export const fetchUserInfo = () => {
  return axios.request({
    url: 'api/getUserInfo'
  })
}

