<template>
  <div>
    <query-block 
      ref="query"
      :status-list="statusList"
      :on-click-query="onClickQuery"
      :source-api-type="sourceApiType"
      :is-daas="isDaas"
      :on-click-add="onClickAdd"/>
    <div style="height: 16px"></div>
    <Card 
      :bordered="false" 
      dis-hover 
      class="card-table-fix">
      <Table 
        :columns="table.columns" 
        :data="table.data"
        :loading="table.loading"
        size="large"
        tooltip-theme="light" />
      <div class="page-wrapper">
        <Page 
          :total="page.pageTotal"
          :current="page.currentPage"
          show-total
          show-elevator
          show-sizer
          @on-change="onChangePage"
          @on-page-size-change="onPageSizeChange"
          placement="top" />
      </div>
      <Modal
        ref="modal"
        v-model="modal.show"
        :title="modal.title"
        transfer
        :mask-closable="!modal.btnLoading"
        :styles="styles"
        class-name="ivu-modal-wrap-admin-top"
        :class="['modal-fullscreen-fix',{'clear-padding': modal.innerComponent === 'doc-management'}]"
        fullscreen
        :footer-hide="footerHide"
        :mask="false"
        scrollable>

        <component 
          ref="innerComponent"
          :form-code="formCode"
          :source-api-type="sourceApiType"
          :source-type="sourceType"
          :id="table.curId"
          :is="modal.innerComponent"
          @on-success="onSuccess"></component>
        <Spin size="large" fix v-if="modal.loading"></Spin>

        <div slot="footer">
          <Button 
            @click="onClickModalBtn('cancel')"
            class="btn140 btn-cancel">取消</Button>
          <Button 
            @click="onClickModalBtn('confirm')"
            :loading="modal.btnLoading"
            :disabled="modal.loading"
            class="btn140 btn-ok">保存</Button>
        </div>
      </Modal>
    </Card>
  </div>
</template>
<script>
import QueryBlock from './query-block'
import DetailConfig from './detail-config'
import PageConfig from './page-config'
import DocManagement from './doc-management'

import { 
  asyncDelRowById,
  fetchDictByName,
  fetchDictByNameTree
} from '@/api'
import {
  fetchServiceList,
  fetchServiceById,
  updateSaasService,
  fetchServiceActionList,
  updateOnlineService,
  fetchFormCode
} from '_admin/api/service'
import { fetchWorkflowList } from '_admin/api/sys'

export default {
  components: {
    QueryBlock,
    DetailConfig,
    PageConfig,
    DocManagement
  },
  data () {
    const { sourceType, sourceApiType } = this.dynamicCreateVars(this.$route.path)
    return {
      processList: [],

      sourceType,
      sourceApiType,

      formCode: '',

      statusList: ['待上线', '已上线'],

      // FormModal
      modal: {
        show          : false,
        loading       : false, // 返回结果前禁止提交
        btnLoading    : false,
        title         : '',
        innerComponent: null
      },
      // TableBlock
      page: {
        pageTotal  : 0,
        pageSize   : 10,
        currentPage: 1
      },
      table: {
        columns: [
          {
            title: '序号',
            type : 'index',
            width: 70
          },
          {
            title   : '服务名称',
            key     : 'fullName',
            ellipsis: true,
            tooltip : true
          },
          {
            title: '所属子类',
            width: 140,
            key  : 'subclassName'
          },
          {
            title: '创建时间',
            width: 150,
            key  : 'createTime'
          },
          {
            title: '责任人',
            width: 100,
            key  : 'constructionPerson'
          },
          {
            title : '状态',
            width : 100,
            key   : 'state',
            render: (h, { row:{ state } }) => [this.statusList[state]]
          },
          {
            title    : '操作',
            width    : 200,
            className: 'table-column-fix',
            render   : (h, { row }) => {
              const isOn = row.state === 1
              const lineAction = {
                icon : isOn ? 'offline' : 'online',
                type : 'online',
                title: isOn ? '下线' : '上线'
              }
              const actions = [
                { icon: 'detail', type: 'detail', title: '详情' },
                { icon: 'doc', type: 'doc', title: '文档管理' },
                lineAction,
                { icon: 'config', type: 'pageConfig', title: '服务页面配置' },
                // { icon: 'apply', type: 'edit', title: '回复' },
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
                      onClick={() => this.onClickRowAction({ type, row })}
                      class={`icon-sprites-g1 icon-${icon}`}></i>
                  </Tooltip>
                  
                )
              })
            }
          }
        ],
        data: [],
        
        loading : false,
        curIndex: -1,
        curId   : ''
      },
      serviceType: '', //服务类型

      subTypeDaasList : [],
      subTypeOtherList: []
    }
  },
  computed: {
    // .ivu-modal
    styles () {
      const leftOffset = this.leftOffset || this.$store.getters.leftOffset
      return {
        marginLeft: `${leftOffset}px`,
        width     : `calc(100% - ${leftOffset}px) !important`
      }
    },
    footerHide () {
      const innerComponent = this.modal.innerComponent
      return 'doc-management' === innerComponent || 'page-config' === innerComponent
    },
    isDaas () {
      return this.sourceApiType === 'daas'
    }
  },
  provide () {
    return {
      processList     : this.processList,
      subTypeDaasList : this.subTypeDaasList,
      subTypeOtherList: this.subTypeOtherList

    }
  },
  created () {
    fetchFormCode(this.sourceApiType).then(res => {
      const { code, data:{ remark } } = res
      if (code === 0) {
        this.formCode = remark
        const $innerComponent = this.$refs.innerComponent
        if ($innerComponent) {
          $innerComponent.form.formCode = remark
        }
      }
    })
  },
  mounted () {
    this.$watch('$route.path', (newVal) => {
      
      Object.assign(this.$refs.query.query, {
        name        : '',
        subTypeDaas : [],
        subTypeOther: '',
        status      : -1
      })
      if (newVal) {
        let name = newVal.split('/')[newVal.split('/').length - 1]
        if (name == 'cloud') {
          this.serviceType = 'CloudApp'
        } else {
          this.serviceType = name.charAt(0).toUpperCase() + name.substring(1)
        }
      }

      this.modal.show = false
      this.resetIfPathChanged(newVal)
      this.fetchSubList(this.sourceApiType)
      this.fetchTableList()
      this.fetchWorkflowList()

    }, { immediate: true }) 
  },
  methods: {
    fetchSubList (sourceApiType) {
      if (sourceApiType === 'daas') {
        if (!this.subTypeDaasList.length) {
          fetchDictByNameTree('srmDaasSubclass').then(res => {
            const { code, data } = res
            if (code === 0) {
              this.subTypeDaasList.splice(0)
              this.subTypeDaasList.push(...data.map(function self (item) {
                const { children, id, name } = item
                let _children = []
                if (children.length) {
                  _children = children.map(self)
                }
                return {
                  value   : id,
                  label   : name,
                  children: _children
                }
              }))
            }
          })
        }
      } else {
        const _type = sourceApiType[0].toUpperCase() + sourceApiType.substring(1)
        fetchDictByName(`srm${_type}Subclass`).then(res => {
          const { code, data } = res
          if (code === 0) {
            this.subTypeOtherList.splice(0)
            this.subTypeOtherList.push(...data.map(item => {
              const { id, name } = item
              return { id, name }
            }))
          }
        })
      }
    },
    fetchWorkflowList () {
      fetchWorkflowList({}).then(res => {
        const { code, data:{ records } } = res
        if (code === 0) {
          this.processList.splice(0)
          this.processList.push(...records.map(item => ({ id: item.id, name: item.name })))
        }
      })
    },
    resetIfPathChanged (path) {
      const { sourceType, sourceApiType } = this.dynamicCreateVars(path)
      this.sourceType = sourceType
      this.sourceApiType = sourceApiType
      this.table.data = []
      Object.assign(this.page, {
        pageTotal  : 0,
        pageSize   : 10,
        currentPage: 1
      })
    },
    dynamicCreateVars (path) {
      const type = path.split('/').pop().toLowerCase()
      const sourceType = ['cloud', 'saas', 'daas', 'paas', 'iaas'].indexOf(type) + 1
      const sourceApiType = type === 'cloud' ? 'cloudApp' : type
      return { sourceType, sourceApiType }
    },

    // QueryBlock
    onClickQuery () {
      this.page.currentPage = 1
      this.fetchTableList()
    },
    setModalScrollTop () {
      this.$nextTick(() => {
        this.$refs.modal.$el.querySelector('.ivu-modal-body').scrollTop = 0
      })
    },
    onClickAdd () {
      this.table.curIndex = -1
      this.table.curId = ''
      Object.assign(this.modal, {
        innerComponent: 'detail-config',
        title         : '新增应用',
        show          : true
      })
      const $innerComponent = this.$refs.innerComponent
      if ($innerComponent) {
        this.setModalScrollTop()
        $innerComponent.resetFields()
        this.$nextTick(() => {
          $innerComponent.form.formCode = this.formCode
        })
        if ($innerComponent.tinymceInited) {
          $innerComponent.setTinymceContent('', '')
        }
      }
    },
    fetchTableList () {
      this.table.loading = true
      const { name, subTypeDaas, subTypeOther, status:state } = this.$refs.query.query
      const { currentPage: current, pageSize: size } = this.page
      fetchServiceList(this.sourceApiType, {
        current, size, name, 
        subclass: this.isDaas ? subTypeDaas.join(',') : subTypeOther, 
        state   : state === -1 ? '' : state
      }).then(res => {
        this.table.loading = false
        const { code, data } = res
        if (code === 0) {
          const { total, records } = data
          this.table.data = records
          this.page.pageTotal = total
        } 
      })
    },

    // page
    onChangePage (pageNum) {
      this.page.currentPage = pageNum
      this.fetchTableList()
    },
    onPageSizeChange (pageSize) {
      this.page.pageSize = pageSize
      if (this.page.currentPage === 1) {
        this.fetchTableList()
      }
    },

    // row-action
    onClickRowAction ({ type, row }) {
      const lastId = this.table.curId
      const curId = row.id
      const $innerComponent = this.$refs.innerComponent
      const curInnerComponentName = $innerComponent ? $innerComponent.$options.name : ''
      if (type === 'detail') {

        this.handleAction({ index: row._index, title: '详情配置', innerComponent: 'detail-config' })
        if (curInnerComponentName !== 'detail-config' || lastId !== curId) {
          this.modal.loading = true
          this.table.curId = curId
          this.handleDetailAction()
        } 
    
      } else if (type === 'del') {

        this.handleDelActionAsync({
          url    : `/srm/${this.sourceApiType}/delete/${curId}`,
          msg    : '是否确认删除此服务?',
          success: this.fetchTableList
        })
        
      } else if (type === 'pageConfig') {

        this.handleAction({ index: row._index, title: '服务页面配置', innerComponent: 'page-config' })
        if (curInnerComponentName !== 'page-config' || lastId !== curId) {
          this.modal.loading = true
          this.table.curId = curId
          this.handlePageConfigAction()
        }

      } else if (type === 'doc') {

        this.handleAction({ index: row._index, title: '文档管理', innerComponent: 'doc-management' })
        if (curInnerComponentName !== 'doc-management' || lastId !== curId) {
          this.modal.loading = true
          this.table.curId = curId
          this.handleDocAction()
        }
      } else if (type === 'online') {
        const state = row.state === 1 ? 0 : 1
        updateOnlineService(
          this.sourceApiType, curId, state
        ).then(res => {
          const { code } = res
          const _msg = state === 0 ? '服务下线' : '服务上线'
          if (code === 0) {
            this.fetchTableList()
            this.$Message.success(`${_msg}成功！`)
          } else {
            this.$Message.error(`${_msg}失败！`)
          }
        })
      }
    },
    handleAction ({ index, title, innerComponent }) {
      const { table, modal } = this
      table.curIndex = index 
      Object.assign(modal, {
        innerComponent,
        title,
        show: true
      })
    },
    handleDetailAction () {
      const $refs = this.$refs
      const curInnerComponent = $refs.innerComponent
      if (curInnerComponent && curInnerComponent.$options.name === 'detail-config') {
        curInnerComponent.resetFields()
      }
      fetchServiceById(this.sourceApiType, this.table.curId).then(res => {
        this.setModalScrollTop()
        const { code, data, msg } = res
        const $innerComponent = $refs.innerComponent
        const form = $innerComponent.form
        this.modal.loading = false
        if (code === 0) {
          Object.keys(form).forEach(field => {
            form[field] = data[field]
          })

          const { description, applyDesc } = data
          if ($innerComponent.tinymceInited) {
            $innerComponent.setTinymceContent(description, applyDesc)
          }
        } else {
          this.$Message.error(msg)
        }
      })
    },
    handlePageConfigAction () {
      const $refs = this.$refs
      const curInnerComponent = $refs.innerComponent
      if (curInnerComponent && curInnerComponent.$options.name === 'page-config') {
        const configList = curInnerComponent.configList
        configList.forEach(config => config.data = [])
      }
      fetchServiceActionList(
        'overview', this.table.curId, this.sourceType
      ).then(res => {
        this.setModalScrollTop()
        const { code, data, msg } = res
        this.modal.loading = false
        const innerComponent = $refs.innerComponent
        innerComponent.handleDelActionAsync = innerComponent.handleDelActionAsync || this.handleDelActionAsync

        if (code === 0) {
          if (data && data.length) {
            const _data = data.reduce((ret, cur) => {
              const { type, description, moreDescription, imageId, name, id, imageUrl } = cur
              ret[type].push({ description, moreDescription, imageId, name, id, imageUrl })
              return ret
            }, [[], [], []])
            const configList = $refs.innerComponent.configList
            configList.forEach((config, index) => config.data = _data[index])
          }
        } else {
          this.$Message.error(msg)
        }
      })
    },
    handleDocAction (shouldResetFields = true) {
      const $refs = this.$refs
      const curInnerComponent = $refs.innerComponent
      if (
        shouldResetFields && 
        curInnerComponent && 
        curInnerComponent.$options.name === 'doc-management'
      ) {
        curInnerComponent.resetFields()
        curInnerComponent.setTextContent && curInnerComponent.setTextContent()
      }
      fetchServiceActionList(
        'document', this.table.curId, this.sourceType
      ).then(res => {
        this.setModalScrollTop()
        const { code, data, msg } = res
        this.modal.loading = false
        if (code === 0) {
          const innerComponent = $refs.innerComponent
          innerComponent.handleDelActionAsync = innerComponent.handleDelActionAsync || this.handleDelActionAsync
          
          if (Array.isArray(data)) {
            const { docList, annexList } = innerComponent
            docList.splice(0)
            annexList.splice(0)
            data.forEach(item => {
              const { type, id, name } = item
              if (type === 0) {
                docList.push({ id, name, content: item.content })
              } else {
                annexList.push({ id, name, url: item.fileUrl }) 
              }
            })
          }
        } else {
          this.$Message.error(msg)
        }
      })
    },
    
    handleDelActionAsync (opts) {
      const { url, msg, success } = opts
      this.$xlModal.show({
        loading: true,
        msg    : msg || '是否确认删除?',
        ok     : async next => {
          const { code, msg } = await asyncDelRowById(url)
          next()
          if (code === 0) {
            this.$Message.success(msg)
            success && success()
          } else {
            this.$Message.error(msg)
          }
        }
      })
    },

    onAsyncCb (res) {
      this.modal.btnLoading = false
      const { code, msg } = res
      if (code === 0) {
        this.$Message.success(msg)
        this.modal.show = false
        this.fetchTableList()
      } else {
        this.$Message.error(msg)
      }
    },
    onClickModalBtn (btnType) {
      const { modal } = this
      if (btnType === 'cancel') {
        modal.show = false
      } else if (btnType === 'confirm') {
        const { table, $refs } = this
        const $innerComponent = $refs.innerComponent
        const innerComponent = modal.innerComponent
        
        if (innerComponent === 'detail-config') {
          $innerComponent.validate(vaild => {
            if (vaild) {
              modal.btnLoading = true
              const copyData = JSON.parse(JSON.stringify($innerComponent.form))
              if (table.curIndex !== -1) {
                copyData.id = table.curId
              }
              updateSaasService(this.sourceApiType, copyData).then(this.onAsyncCb)
            }
          })
        } 
        // else if (innerComponent === PageConfig) {
        //   const serviceId = table.curId
        //   const copyData = JSON.parse(
        //     JSON.stringify(
        //       $innerComponent.configList.map(item => item.data)
        //     )
        //   )
        //   const sourceType = this.sourceType
        //   const _data = copyData.reduce((ret, cur, index) => {
        //     ret.push(...cur.map(item => {
        //       return {
        //         ...item,
        //         type: index,
        //         sourceType,
        //         serviceId
        //       }
        //     }))
        //     return ret
        //   }, [])
        //   updateOverviewService(_data).then(this.onAsyncCb)
          
        // }
      }
    },

    onSuccess ({ type }) {
      if (type === 'doc-management') {
        this.handleDocAction(false)
      }
    }
  }
}
</script>