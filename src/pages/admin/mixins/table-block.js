export default {
  methods: {
    // row-action
    handleEditAction (row, modelObj) {
      const { _index, title } = row
      const _model = modelObj && typeof modelObj === 'object' ? modelObj : this
      _model.table.curIndex = _index 
      Object.assign(_model.modal, {
        show: true,
        title
      })
      const excludeFields = ['_rowKey', '_index']
      const copyData = JSON.parse(JSON.stringify(row, (k, v) => {
        if (excludeFields.indexOf(k) === -1) return v
      }))
      Object.assign(_model.modalForm, copyData)
    },
    handleDelActionSync (index, modelObj) {
      const _model = modelObj && typeof modelObj === 'object' ? modelObj : this
      _model.table.data.splice(index, 1)
      _model.modal.show = false
    },

    // modal

    onVisibleChange (value, modalFormName) {
      if (!value) {
        const _modalFormName = modalFormName || 'modalForm'
        this.$refs[_modalFormName].resetFields()
      }
    },
    onClickModalBtn (btnType, modelObj) {
      const _model = modelObj && typeof modelObj === 'object' ? modelObj : this
      const { modal } = _model
      if (btnType === 'cancel') {
        modal.show = false
      } else if (btnType === 'confirm') {
        const { modalForm, table, $refs } = _model
        modal.btnLoading = true

        $refs.modalForm.validate(vaild => {
          if (vaild) {
            const updateItem = this.updateItem
            if (updateItem && typeof updateItem === 'function') {
              updateItem().then(res => {
                modal.btnLoading = false
                const { code, msg } = res
                if (code === 0) {
                  modal.show = false
                  this.$Message.success('操作成功')
                  this.fetchTableList()
                } else {
                  this.$Message.error(msg)
                }
                // const copyData = JSON.parse(JSON.stringify(modalForm))
                // const curIndex = table.curIndex
                // curIndex === -1 
                //   ? this.fetchTableList()
                //   : Object.assign(table.data[curIndex], copyData) 
                
              })
            } else {
              const copyData = JSON.parse(JSON.stringify(modalForm))
              const curIndex = table.curIndex
              curIndex === -1 
                ? table.data.push(copyData)
                : table.data.splice(curIndex, 1, copyData) 
              
              modal.show = false
            }

          }

        })
      }
    }
    
  }
}