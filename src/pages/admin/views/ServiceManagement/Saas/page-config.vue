<template>
  <div>
    <Card 
      v-for="(item,index) of configList"
      :key="item.name"
      :bordered="false" 
      dis-hover
      class="card-fix-style"
      style="margin-bottom:30px">
      <p slot="title">{{item.title}}</p>
      <Button 
        @click="onClickAdd(index,item.name,item.title)"
        type="primary"
        size="default"
        ghost
        slot="extra"><Icon type="md-add" />新增</Button>
      <Table 
        :columns="item.columns" 
        :data="item.data"
        size="default" />
    </Card>
    <Modal
      v-model="modal.show"
      :title="modal.title"
      transfer
      :mask-closable="false"
      :width="840">

      <page-config-form 
        ref="innerComponent"
        :name="curName"
        @tinymce-inited="onTinymceInited" />
      <Spin size="large" fix v-if="spinShow"></Spin>

      <div slot="footer" style="text-align:center">
        <Button 
          @click="onClickModalBtn('cancel')"
          style="width:90px">取消</Button>
        <Button 
          @click="onClickModalBtn('confirm')"
          type="primary"
          :loading="modal.loading"
          style="width:90px">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import PageConfigForm from './page-config-form'
import { updateOverviewService } from '_admin/api/service'

export default {
  name: 'page-config',

  components: { 
    PageConfigForm
  },
  props: {
    sourceType: Number,
    id        : String
  },
  data () {
    return {
      spinShow          : false,
      curRow            : null,
      curName           : '',
      configListCurIndex: -1,

      modal: {
        show    : false,
        loading : false,
        title   : '',
        curIndex: -1,
        curId   : ''
      },

      configList: [
        {
          name   : 'character',
          title  : '功能特点',
          columns: [
            {
              title: '序号',
              type : 'index',
              width: 80
            },
            {
              title: '功能特点名称',
              key  : 'name'
            },
            // {
            //   type : 'html',
            //   title: '功能特点描述',
            //   key  : 'description'
            // },
            {
              title : '功能图标',
              key   : 'images',
              render: (h, { row }) => {
                const { imageUrl } = row
                return imageUrl ? <img src={imageUrl} width="60" height="60" style="vertical-align: middle;" /> : null
              }
            },
            {
              title    : '操作',
              width    : 120,
              className: 'table-column-fix',
              render   : (h, { row }) => {
                const actions = [
                  { icon: 'detail', type: 'detail', title: '详情' },
                  { icon: 'del', type: 'del', title: '删除' }
                ]
                return actions.map(({ icon, type, title }) => {
                  return (
                    <Tooltip 
                      content={title} 
                      theme="light" 
                      placement="top"
                      class="tooltip-fix">
                      <i 
                        onClick={() => this.onClickRowAction(0, { type, row })}
                        class={`icon-sprites-g1 icon-${icon}`}></i>
                    </Tooltip>
                    
                  )
                })
              }
            }
          ],
          data: []
        },
        {
          name   : 'scene',
          title  : '应用场景',
          columns: [
            {
              title: '序号',
              type : 'index',
              width: 80
            },
            {
              title: '应用场景名称',
              key  : 'name'
            },
            // {
            //   type : 'html',
            //   title: '功能特点描述',
            //   key  : 'description'
            // },
            {
              title : '业务介绍图',
              key   : 'images',
              render: (h, { row }) => {
                const { imageUrl } = row
                return imageUrl ? <img src={imageUrl} width="60" height="60" style="vertical-align: middle;" /> : null
              }
            },
            {
              title    : '操作',
              width    : 120,
              className: 'table-column-fix',
              render   : (h, { row }) => {
                const actions = [
                  { icon: 'detail', type: 'detail', title: '详情' },
                  { icon: 'del', type: 'del', title: '删除' }
                ]
                return actions.map(({ icon, type, title }) => {
                  return (
                    <Tooltip 
                      content={title} 
                      theme="light" 
                      placement="top"
                      class="tooltip-fix">
                      <i 
                        onClick={() => this.onClickRowAction(1, { type, row })}
                        class={`icon-sprites-g1 icon-${icon}`}></i>
                    </Tooltip>
                    
                  )
                })
              }
            }
          ],
          data: []
        },
        {
          name   : 'detail',
          title  : '功能详情',
          columns: [
            {
              title: '序号',
              type : 'index',
              width: 80
            },
            {
              title: '功能详情名称',
              key  : 'name'
            },
            // {
            //   type : 'html',
            //   title: '功能特点描述',
            //   key  : 'description'
            // },
            {
              title    : '操作',
              width    : 120,
              className: 'table-column-fix',
              render   : (h, { row }) => {
                const actions = [
                  { icon: 'detail', type: 'detail', title: '详情' },
                  { icon: 'del', type: 'del', title: '删除' }
                ]
                return actions.map(({ icon, type, title }) => {
                  return (
                    <Tooltip 
                      content={title} 
                      theme="light" 
                      placement="top"
                      class="tooltip-fix">
                      <i 
                        onClick={() => this.onClickRowAction(2, { type, row })}
                        class={`icon-sprites-g1 icon-${icon}`}></i>
                    </Tooltip>
                    
                  )
                })
              }
            }
          ],
          data: []
        }
      ]
    }
  },
  methods: {
    onTinymceInited () {
      if (this.spinShow) {
        this.spinShow = false
        this.handleInnerComponent()
      }
    },
    handleInnerComponent () {
      if (this.modal.curIndex === -1) {
        const $innerComponent = this.$refs.innerComponent
        $innerComponent.resetFields()

        $innerComponent.setTinymceTextContent[0]()
        if (!$innerComponent.iconShow) {
          $innerComponent.setTinymceTextContent[1]()
        }
      } else {
        const $innerComponent = this.$refs.innerComponent
        const $form = $innerComponent.form
        const row = this.curRow
        Object.keys($form).forEach(field => {
          $form[field] = row[field]
        })

        $innerComponent.setTinymceTextContent[0](row.description)
        if (!$innerComponent.iconShow) {
          $innerComponent.setTinymceTextContent[1](row.explain)
        }
      }
    },

    onClickAdd (index, name, title) {
      this.configListCurIndex = index
      this.curName = this.configList[index].name
      Object.assign(this.modal, {
        loading : false,
        curIndex: -1,
        curId   : '',
        title   : `新增${title}`,
        show    : true
      })
      if (!this.spinShow) {
        this.handleInnerComponent()
      }
      
    },

    onClickRowAction (configListCurIndex, { type, row }) {
      this.configListCurIndex = configListCurIndex
      if (type === 'detail') {
        this.handleDetailAction(JSON.parse(JSON.stringify(row)))
      } else if (type === 'del') {
        this.handleDelActionAsync({
          url    : `/srm/overview/delete/${row.id}`,
          msg    : '是否确认删除此数据?',
          success: () => this.handleDelAction(row._index)
        })
      }
    },
    handleDetailAction (row) {
      const { modal } = this
      this.curName = this.configList[this.configListCurIndex].name
      Object.assign(modal, {
        loading : false,
        curIndex: row._index,
        curId   : row.id,
        title   : '功能特点',
        show    : true
      })

      this.curRow = row

      if (!this.spinShow) {
        this.handleInnerComponent()
      }
      
    },
    handleDelAction (index) {
      this.configList[this.configListCurIndex].data.splice(index, 1)
    },

    onClickModalBtn (type) {
      const { modal } = this
      if (type === 'cancel') {
        modal.show = false
      } else if (type === 'confirm') {
        const $innerComponent = this.$refs.innerComponent
        $innerComponent.validate(vaild => {
          if (vaild) {
            modal.loading = true
            const copyForm = JSON.parse(JSON.stringify($innerComponent.form))
            copyForm.serviceId = this.id
            copyForm.sourceType = this.sourceType
            copyForm.type = this.configListCurIndex
            const list = this.configList[this.configListCurIndex].data
            const curIndex = modal.curIndex
            if (curIndex !== -1) {
              copyForm.id = modal.curId
            }

            updateOverviewService(copyForm).then(res => {
              const { code, data, msg } = res
              modal.loading = false
              if (code == 0) {
                if (curIndex === -1) {
                  copyForm.id = data
                  list.unshift(copyForm)
                } else {
                  list.splice(curIndex, 1, copyForm)
                }
                this.$Message.success('新增成功！')
                modal.show = false
              } else {
                this.$Message.success(msg)
              }
            })
  
          }
        })
      }
    }
  }
}
</script>