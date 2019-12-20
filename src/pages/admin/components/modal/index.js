import xlModal from './index.vue'

let vm = null
let append = false
export default {
  install: Vue => {
    function createVm () {
      const xlModalVm = Vue.extend(xlModal)
      return new xlModalVm().$mount()
    }
    if (!vm) { 
      const methods = {
        show (opts) {
          if (!append) {
            append = true
            vm = createVm()
            document.body.appendChild(vm.$el)
          }
          const { next, setShow, setLoading, remove } = this
          setShow(true)
          if (opts) {
            setLoading(false)
            const $typeof = typeof opts
            if ($typeof === 'object') {
              const { msg, title, loading, ok, cancel } = opts
              if (title && typeof title === 'string') vm.title = title
              if (cancel && typeof cancel === 'boolean') vm.cancelShow = cancel
              vm.msg = msg
              if (loading) {
                if (ok && typeof ok === 'function') {
                  // override
                  vm.onOk = function () {
                    setLoading(true)
                    ok.call(vm, next, remove)
                  }
                }
              }
            } else {
              vm.msg = opts
            }
          }
          return { next, remove }
        },
        next (status = true) {
          vm.loading = false
          if (status) {
            vm.show = false
          }
        },
        setShow (status) {
          vm.show = status
        },
        setLoading (status) {
          vm.loading = status
        },
        remove () {
          if (append) {
            document.body.removeChild(vm.$el)
          }
        }
      }
      
      Vue.prototype.$xlModal = methods
    }
  }
}