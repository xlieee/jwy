/**
 * 剔除omitKeys内字段的浅拷贝
 * @param {object} source 
 * @param {Array<string>} omitKeys 
 */
export const toolOmit = (source = {}, omitKeys = []) => {
  return Object.keys(source).reduce((ret, key) => {
    if (omitKeys.indexOf(key) > -1) {
      return ret
    }
    ret[key] = source[key]
    return ret
  }, {})
}

/**
 * 对象浅拷贝
 * fields为数组时,只处理fields内对应字段
 * @param {object} targetObj 
 * @param {object} valueObj 
 * @param {Array<string>} fields 
 */
export const toolAssign = (targetObj, valueObj, fields) => {
  if (!fields) {
    Object.assign(targetObj, valueObj)
  } else if (Array.isArray(fields)) {
    const len = fields.length
    let index = 0
    let field = ''
    for (index; index < len; index++) {
      field = fields[index]
      targetObj[field] = valueObj[field]
    }
  }
}

/**
 * 文件下载
 * @param {string} url 
 * @param {object} param
 * params = {
 *  startDate: '2019-01-01',
 *  endDate: '2019-01-02',
 *  areas: '佛山市'
 * }
 */
export const toolDownloadFile = ({ url, params = {}, target = '_self' }) => {
  const form = document.createElement('form')
  form.setAttribute('action', url)
  form.setAttribute('method', 'get')
  form.setAttribute('target', target)
  for (const key in params) {
    const input = document.createElement('input')
    input.setAttribute('type', 'hidden')
    input.setAttribute('name', key)
    input.setAttribute('value', params[key])
    form.appendChild(input)
  }
  document.body.appendChild(form)
  form.submit()
  form.remove()
}