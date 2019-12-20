export default {
  install: Vue => {
    const $width = document.documentElement.clientWidth
    Vue.prototype.$width = $width
    Vue.prototype.$lt = $width < 1360

    Vue.prototype.$calcLabelWidth = (str = '', opts = {}, fontSize = 16) => {
      let colonEnding = 0
      if (str.slice(-1) === '：') {
        colonEnding = 1
        str = str.slice(0, -1)
      }
      const { 
        isRequired = false,
        extraNum = 0
      } = opts
      // .5: 空格、英文
      //  1: 中文、必填、isRequired
      //  2: 冒号
      // 基础字体 14
      // eslint-disable-next-line no-control-regex
      const equalOne = (str.match(/[\u4e00-\u9fa5]/g) || '').length
      const equalHalf = (str.match(/\w|\s/g) || '').length / 2
  
      const total = equalOne + equalHalf + Boolean(isRequired) + 2 * colonEnding + extraNum
      return total * fontSize
    }
    Vue.prototype.$filterInput = function (e, next, { type = 'number', length } = {}) {
      const target = e.target
      let value = ''
      if (type === 'float') {
        value = target.value.replace(/[^(\d|.)]+/g, '') || ''
      } else if (type === 'number') {
        let v = target.value.replace(/[^\d]+/g, '')
        if (length) {
          v = v.substr(0, length)
        }
        value = Number(v) || ''
      } else if (type === 'tel') {
        value = target.value.replace(/[^\d|-]+/g, '') || ''
        if (length) {
          value = value.substr(0, length)
        }
      } else if (type === 'id') {
        value = target.value.replace(/[^(\d|a-z|A-Z)]+/g, '') || ''
      }

      this.$nextTick(() => {
        target.value = value
      })
      next(value)
    }
  }
}