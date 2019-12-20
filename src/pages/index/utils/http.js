import axios from 'axios'
import Qs from 'qs'
// import {
//   PAGE_LOADING_SHOW
// } from '../store/modules/common/types'
// import store from '../store/'

const instance = axios.create({
  // baseURL: 'http://192.168.31.138:8099',
  // baseURL: 'http://192.168.31.138:8099/rest',
  // baseURL: 'http://192.168.31.138:8081',
  // baseURL: 'http://104.0.53.19:8088/rest',
  // baseURL: 'http://192.168.31.115:9090',
  // baseURL: 'http://192.168.31.77:8180',
  // baseURL: process.env['VUE_APP_' + process.env.PORT],
  baseURL        : window.CUR_ENV,
  timeout        : 15000,
  withCredentials: true
})

const _arr = [axios, instance]
_arr.forEach(item => {
  item.interceptors.request.use(config => {
    // store.commit(PAGE_LOADING_SHOW);
    return config
  })

  item.interceptors.response.use(response => {
    const data = response.data
    const code = data.code
    if (!code && code !== 0) {
      return data
    } else {
      if (code === 0) {
        if (data && Object.prototype.hasOwnProperty.call(data, 'service')) {
          return data
        }
        return data.data
      } else {
        return data.msg
      }
    }
  }, error => {
    const ret = error.response
    if (ret) {
      switch (ret.status) {
      case 400:
        throw '===错误请求==='
      case 401:
        throw '===未授权，请重新登录==='
      case 403:
        throw '===拒绝访问==='
      case 404:
        throw '===请求错误,未找到该资源==='
      case 405:
        throw '===请求方法未允许==='
      case 408:
        throw '===请求超时==='
      case 500:
        throw '===服务器端出错==='
      case 501:
        throw '===网络未实现==='
      case 502:
        throw '===网络错误==='
      case 503:
        throw '===服务不可用==='
      case 504:
        throw '===网络超时==='
      case 505:
        throw '===http版本不支持该请求==='
      default:
        throw `===连接错误${ret.status}===`
      } 
    } else {
      throw '===接口调用超时==='
    }
  })
})

const get = (url, opts = {}) => {
  if (opts.external) {
    return axios.get(url, {
      params         : opts.params,
      timeout        : 10000,
      withCredentials: true
    })
  }
  return instance.get(url, {
    params: opts.params
  })
}

const post = (url, opts = {}) => {
  if (opts.external) {
    if (opts.isFormData) {
      return axios.post(url, Qs.stringify(opts.data), {
        timeout: 10000,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
    }
    return axios.post(url, opts.data, {
      timeout: 10000
    })
  }
  if (opts.isFormData) {
    return instance.post(url, Qs.stringify(opts.data), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
  }
  return instance.post(url, opts.data)
}
const all = (fns = [], cb) => {
  return axios.all(fns)
    .then(axios.spread(function (...res) {
      cb && cb(res)
    }))
}
export {
  get,
  post,
  all
}

