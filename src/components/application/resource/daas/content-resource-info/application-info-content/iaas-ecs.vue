<template>
  <div style="border:1px solid #e8eaec;border-bottom:none">
    <Table 
      :columns="columns" 
      :data="tableData" />
    <Modal
      v-model="modal.show"
      :title="modal.title"
      transfer
      :mask-closable="false"
      :width="720">
      <Form 
        ref="formRef" 
        :model="form" 
        :rules="rules">
        <Row :gutter="16">
          <i-col span="12">
            <FormItem 
              label="应用组件："
              :label-width="$calcLabelWidth('应用组件：',{isRequired:true})"
              prop="applicationComponent">
              <Input 
                v-model="form.applicationComponent" 
                placeholder="请输入应用组件名称"/>
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem 
              label='规格(核/G)：' 
              :label-width="$calcLabelWidth('规格(核/G)：',{isRequired:true,extraNum:1})"
              prop="specs">
              <Select
                v-model="form.specs"
                @on-change="onChange($event,'specsName','specsList')"
                placeholder="请选择规格">
                <Option 
                  v-for="option in specsList" 
                  :value="option.id" 
                  :key="option.id">{{option.name}}</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row :gutter="16">
          <i-col span="12">
            <FormItem 
              label='数据盘存储(GB)：' 
              :label-width="$calcLabelWidth('数据盘存储(GB)：',{isRequired:true,extraNum:1})"
              prop="dataDiskStorage">
              <Input  
                v-model="form.dataDiskStorage"
                placeholder="请输入" />
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem 
              label='镜像：' 
              :label-width="$calcLabelWidth('镜像：',{isRequired:true,extraNum:2.5})"
              prop="image">
              <Select
                v-model="form.image"
                @on-change="onChange($event,'imageName','imageList')"
                placeholder="请选择镜像类型">
                <Option 
                  v-for="option in imageList" 
                  :value="option.id" 
                  :key="option.id">{{option.name}}</Option>
              </Select>
            </FormItem>
          </i-col>
        </Row>
        <Row :gutter="16">
          <i-col span="24">
            <FormItem 
              label='申请说明：' 
              :label-width="$calcLabelWidth('申请说明：',{isRequired:true})"
              prop="introduction">
              <Input 
                type="textarea" 
                v-model="form.introduction" 
                placeholder="请输入申请说明"/>
            </FormItem>
          </i-col>
        </Row>
      </Form>

      <div slot="footer" style="text-align:center">
        <Button 
          v-show="share.canEdit"
          @click="onClickModalBtn('cancel')"
          style="width:90px">取消</Button>
        <Button 
          v-show="share.canEdit"
          @click="onClickModalBtn('confirm')"
          type="primary"
          :loading="modal.btnLoading"
          :class="[{'keys-btn': !this.fromAdmin}]"
          style="width:90px">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { 
  fetchDictByName,
  asyncDelRowById,
  asyncIaasService
} from '@/api'
import observable from '../../observable'
export default {
  name  : 'ecs',
  inject: {
    fromAdmin: {
      default: false
    },
    share: {
      default: () => ({
        canEdit: true
      })
    }
  },
  props: {
    viewName: String
  },
  data () {
    if (!this.fromAdmin) {
      observable.setState('resource', { serviceList: [] })  
    }
    return {
      columns: [
        {
          title: '序号',
          type : 'index',
          width: 60
        },
        {
          title : '应用组件',
          key   : 'applicationComponent',
          render: (h, { row:{ configInfo:{ applicationComponent } } }) => [applicationComponent]
        },
        {
          title : '规格名称(核/G)',
          key   : 'specsName',
          render: (h, { row:{ configInfo:{ specsName } } }) => [specsName]
        },
        {
          title : '数据盘存储(GB)',
          key   : 'dataDiskStorage',
          render: (h, { row:{ configInfo:{ dataDiskStorage } } }) => [dataDiskStorage]
        },
        {
          title : '镜像',
          key   : 'imageName',
          render: (h, { row:{ configInfo:{ imageName } } }) => [imageName]
        },
        {
          title : '申请说明',
          key   : 'introduction',
          render: (h, { row:{ configInfo:{ dataDiskStorage } } }) => [dataDiskStorage]
        },
        {
          title    : '操作',
          width    : 100,
          className: 'table-column-fix',
          render   : (h, { row }) => {
            const actions = [{ icon: 'detail', type: 'detail', title: '编辑' }]
            if (this.share.canEdit) {
              actions.push({ icon: 'del', type: 'del', title: '删除' })
            }
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
      modal: {
        show      : false,
        btnLoading: false,
        title     : '新增',
        curIndex  : -1,
        curId     : ''
      },
      form: {
        applicationComponent: '',
        specs               : '',
        specsName           : '',
        dataDiskStorage     : '',
        image               : '',
        imageName           : '',
        introduction        : ''
      },
      rules: {
        applicationComponent: { required: true, message: '请输入应用组件', trigger: 'blur' },
        specs               : { required: true, message: '请选择内存规格', trigger: 'change' },
        dataDiskStorage     : { required: true, message: '请输入数据盘存储', trigger: 'blur' },
        image               : { required: true, message: '请选择镜像类型', trigger: 'change' }
      },
      specsList: [],
      imageList: []
    }
  },
  computed: {
    tableData () {
      return observable.state.resource.serviceList.map(item => {
        const { id, configInfo } = item
        return { id, configInfo }
      })
    }
  },
  created () {
    this.fetchList()
  },
  methods: {
    onChange (id, field, list) {
      this.form[field] = this[list].find(item => id === item.id).name
    },
    fetchList () {
      fetchDictByName('ecsSpecs').then(res => {
        const { code, data } = res
        if (code === 0) {
          this.specsList = data.map(item => ({ id: item.id, name: item.name }))
        }
      })
      fetchDictByName('ecsImage').then(res => {
        const { code, data } = res
        if (code === 0) {
          this.imageList = data.map(item => ({ id: item.id, name: item.name }))
        }
      })
    },
    onClickRowAction ({ type, row }) {
      if (type === 'add') {
        Object.assign(this.modal, {
          curIndex: -1,
          curId   : '',
          show    : true,
          title   : '新增'
        })
      } else if (type === 'del') {
        this.handleDelActionAsync(row.id, row._index)
      } else if (type === 'detail') {
        const { _index:index, configInfo:{ applicationComponent }, id } = row
        Object.assign(this.modal, {
          curIndex: index,
          curId   : id,
          show    : true,
          title   : applicationComponent
        })
        this.handleDetailAction(row)
      }
    },
    handleDelActionAsync (id, index) {
      this.$xlModal.show({
        loading: true,
        msg    : '是否确认删除此服务?',
        ok     : async next => {
          const { code, msg } = await asyncDelRowById(`/bpm/applyIaas/delete/${id}`)
          next()
          if (code === 0) {
            this.$Message.success(msg)
            observable.state.resource.serviceList.splice(index, 1)
          } else {
            this.$Message.error(msg)
          }
        }
      })
    },
    handleDetailAction (row) {
      const { applicationComponent, specs, dataDiskStorage, image, introduction } = row.configInfo
      Object.assign(this.form, {
        applicationComponent, specs, dataDiskStorage, image, introduction
      })
    },
    onClickModalBtn (type) {
      const { modal } = this
      if (type === 'cancel') {
        modal.show = false
      } else {
        const { form, $refs:{ formRef } } = this
        formRef.validate(vaild => {
          if (vaild) {
            modal.btnLoading = true

            const copyForm = JSON.parse(JSON.stringify(form))
            const { state: { resource:{ id:orderNum, serviceList }, viewName } } = observable
            const _viewName = this.viewName || viewName || 'ecs'
            const curIndex = modal.curIndex
            const _data = {
              orderNum, viewName: _viewName, ...copyForm
            }
            if (curIndex > -1) {
              _data.id = modal.curId
            }
            asyncIaasService(_data).then(res => {
              modal.btnLoading = false
              const { code, data, msg } = res
              if (code === 0) {
                modal.show = false
                if (curIndex === -1) {
                  serviceList.push({ id: data, configInfo: copyForm })
                } else {
                  Object.assign(serviceList[curIndex], copyForm)
                }
                this.$Message.success(msg)
              } else {
                this.$Message.error(msg)
              }
            })
          }
        })
      }
    }
  }
}
</script>