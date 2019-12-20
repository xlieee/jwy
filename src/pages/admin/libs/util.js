import axios from './request'

export const utilImagesUploadHandler = (
  blobInfo, success, failure, folder
) => {
  const formData = new FormData()
  formData.append('image', blobInfo.blob())
  formData.append('folder', folder)
  axios.request({
    method: 'post',
    url   : '/fileStore/uploadImage',
    data  : formData
  }).then(res => {
    if (res.msg) {
      failure(res.msg)
    } else {
      success(process.env.VUE_APP_BASE_URL + res[0].url)
    }
  })
  
}

/**
 * ViewUI Input只支持输入汉字、英文、数字、下划线
 * @param {event} e
 * @param {function} callback
 */
export const utilonlyWAndZh = function (e, callback) {
  let v = e.target.value.replace(/[^\w\u4e00-\u9fa5]+/g, '') || ''
  this.$nextTick(() => {
    e.target.value = v
  })
  callback && callback.call(this, v)
}

export const utilFilterOrgTreeList = function self (data = []) {
  return data.map(item => {
    let { title, expand, children, id, loading } = item
    const _item = { title, expand, children, id }
    if (children.length) {
      _item.children = self(children)
      _item.loading = loading
    }
    return _item
  })
}

export const utilFilterDictTreeList = function self (data = []) {
  return data.map(item => {
    const { name, children } = item
    if (children.length) {
      item.children = self(children)
    }
    item.title = name
    return item
  })
}
export const utilFilterDictTreeListWithLoading = function self (data = []) {
  return data.map(item => {
    const { children, description, title, fullPathID, id, parentID, loading } = item
    const _item = { children, description, title, fullPathID, id, parentID }
    if (item.loading === false) {
      _item.loading = loading
    }
    return _item
  })
}