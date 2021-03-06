import axios from 'axios'
import Qs from 'qs'
class HttpRequest {
  constructor () {
    this.defaultOptions = {
      baseURL: window.GLOBAL_URL,
      timeout: 60000
    }

    this.instance = axios.create()
    this.interceptors(this.instance)
  }
  merge (options) {
    return {
      ...this.defaultOptions,
      ...options
    }
  }
  request (options = { url: '', method: 'get' }) {
    if (options.method.toLowerCase() === 'post') {
      const { data, isFormData } = options
      data && isFormData && (options.data = Qs.stringify(options.data))
    }

    return this.instance(this.merge(options))
  }
  interceptors (instance) {
    instance.interceptors.request.use(config => {
      config.headers.access_token = localStorage.getItem('token') 
      
      return config
    }, error => {
      return Promise.reject(error)
    })
    
    instance.interceptors.response.use(res => { 
      // const { code } = res.data
      // if (code === 2052) {
      //   const path = encodeURIComponent(window.location.pathname.replace('/admin', ''))
      //   window.location.href = `/login?from=${path}`
      //   return 
      // }
      return res.data
    }, error => {
      const { response, config } = error
      const code = response.status
      const kv = {
        '404': '服务调用失败！',
        '500': '服务器错误！'
      }
      return Promise.reject({ code, msg: kv[code], url: config.url })
    })
    
  }
}
export default new HttpRequest()

export function promiseWrap (promise) {
  return promise
    .then(res => [null, res])
    .catch(err => [err, null])
}
export function promiseHandleRet ([error, res], [failMsg, successMsg]) {
  if (error || res.code !== 0) {
    if (error) {
      return {
        code: -10101,
        msg : '服务连接出错，请重试！'
      }
    }
    return {
      code: -10101,
      msg : res.msg || failMsg || '操作失败！'
    }
  }
  res.msg = res.msg || successMsg
  return res
}