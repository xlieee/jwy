import { asyncDelRowById } from '../api/common'

export const indexMixins = {
  data () {
    return {
      treeErrorMsg: '',
      emptyText   : '数据获取中...',
      treeList    : [],

      curSelectedNode: {}
    }
  },
  mounted () {
    const cardBodyEl = this.$refs['card-tree'].$el.querySelector('.ivu-card-body')
    const { top } = cardBodyEl.getBoundingClientRect()
    cardBodyEl.style.overflow = 'auto'
    cardBodyEl.style.maxHeight = `calc(100vh - ${top + 24}px)`
  },
  methods: {
    resetFields () {
      this.$refs.content.resetFields()
    },
    async onEmited ({ type, data, next }) {
      const { content } = this
      if (type === 'on-save') {
        this.$refs.content.validate(async valid => {
          if (valid) {
            content.btnLoading = true
            const { pid, id } = data
            const { msg } = await this.updateItem(pid, id)
            content.btnLoading = false
            this.$Message.success(msg)
            this.onSave(data)
          }
        })
        
      } else if (type === 'on-del') {
        const { url, hasChild, name } = data
        this.handleDelActionAsync({
          url,
          message: hasChild ? `当前${name}下的所有子${name}将一并删除，是否确认删除？` : `是否确认删除此${name}?`
        })
      } else if (type === 'on-add-child-node' || type === 'on-add-root-node') {
        const isRootNode = type === 'on-add-root-node'
        const pid = isRootNode ? this.treeList.pid : this.curSelectedNode.id
        const { code, msg } = await this.updateItem(pid)
        if (code === 0) {
          next(false)
          this.fetchTreeList(true)
          this.$Message.success(msg)
        } else {
          next(true)
          this.$Message.error(msg)
        }

      }
    },
    delCallback () {
      Object.assign(this.content, {
        childNodeBtnShow: false,
        selectedId      : '',
        selectedPid     : ''
      })
      this.resetFields()
      this.fetchTreeList(true)
    },
    handleDelActionAsync ({ url, message }) {
      this.$xlModal.show({
        loading: true,
        msg    : message,
        ok     : async next => {
          const { code, msg } = await asyncDelRowById(url)
          next()
          if (code === 0) {
            this.$Message.success(msg)
            this.fetchTreeList(true)
          } else {
            this.$Message.error(msg)
          }
          this.delCallback()
        }
      })
    }
  }
}

export const contentMixins = {
  methods: {
    onClickAddBtn (type, title) {
      Object.assign(this.modal, {
        show: true,
        title
      })
      this.clickNodeType = type
    },
    onFormModalEmited ({ type, value }) {
      if (type === 'on-visible-change') {
        if (!value) {
          this.$refs.modalForm.resetFields()
        }
      } else if (type === 'on-click-btn') {
        this.onClickModalBtn(value)
      }
    },
    onEmit (type, data, next) {
      this.$emit('on-emit', { type, data, next }) 
    },
    onClickModalBtn (btnType) {
      const { modal } = this
      if (btnType === 'cancel') {
        modal.show = false
      } else if (btnType === 'confirm') {
        const { modalForm, $refs, clickNodeType } = this
        $refs.modalForm.validate(vaild => {
          if (vaild) {
            modal.btnLoading = true
            this.onEmit(
              `on-add-${clickNodeType}`, 
              JSON.parse(JSON.stringify(modalForm)), 
              show => Object.assign(modal, { btnLoading: false, show }))
            
          }
        })
      }
    }
  }
}