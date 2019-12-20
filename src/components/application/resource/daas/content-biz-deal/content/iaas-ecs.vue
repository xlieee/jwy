<template>
  <div style="padding-bottom:20px">
    <Row :gutter="16"><div class="form-title form-title-fix">服务器信息</div></Row>
    <div style="border:1px solid #e8eaec;border-bottom:none">
      <Table 
        :columns="columns" 
        :data="biz.serviceList" />
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
                :label-width="$calcLabelWidth('应用组件：',{extraNum:1})"
                prop="applicationComponent">
                <Input :value="form.applicationComponent" readonly />
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem 
                label='规格(核/G)：' 
                :label-width="$calcLabelWidth('规格(核/G)：',{extraNum:2})"
                prop="specs">
                <Input :value="form.specs" readonly />
              </FormItem>
            </i-col>
          </Row>
          <Row :gutter="16">
            <i-col span="12">
              <FormItem 
                label='数据盘存储(GB)：' 
                :label-width="$calcLabelWidth('数据盘存储(GB)：',{extraNum:2})"
                prop="dataDiskStorage">
                <Input :value="form.dataDiskStorage" readonly />
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem 
                label='镜像：' 
                :label-width="$calcLabelWidth('镜像：',{extraNum:3.5})"
                prop="image">
                <Input :value="form.image" readonly />
              </FormItem>
            </i-col>
          </Row>
          <Row :gutter="16">
            <i-col span="12">
              <FormItem 
                label='实例ID：' 
                :label-width="$calcLabelWidth('实例ID：',{required:true,extraNum:2})"
                prop="instanceId">
                <Input v-model="form.instanceId" />
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem 
                label='IP地址：' 
                :label-width="$calcLabelWidth('IP地址：',{required:true,extraNum:2.5})"
                prop="ipAddress">
                <Input v-model="form.ipAddress" />
              </FormItem>
            </i-col>
          </Row>
          <Row :gutter="16">
            <i-col span="12">
              <FormItem 
                label='用户名：' 
                :label-width="$calcLabelWidth('用户名：',{required:true,extraNum:2})"
                prop="username">
                <Input v-model="form.username" />
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem 
                label='密码：' 
                :label-width="$calcLabelWidth('密码：',{required:true,extraNum:3.5})"
                prop="password">
                <Input v-model="form.password" />
              </FormItem>
            </i-col>
          </Row>
          <Row :gutter="16">
            <i-col span="12">
              <FormItem 
                label='开放端口：' 
                :label-width="$calcLabelWidth('开放端口：',{required:true,extraNum:1})"
                prop="openPort">
                <Input v-model="form.openPort" />
              </FormItem>
            </i-col>
            <i-col span="24">
              <FormItem 
                label='申请说明：' 
                :label-width="$calcLabelWidth('申请说明：',{extraNum:1})"
                prop="introduction">
                <Input 
                  type="textarea" 
                  :value="form.introduction"
                  readonly  
                  placeholder="请输入申请说明"/>
              </FormItem>
            </i-col>
          </Row>
        </Form>

        <div slot="footer" style="text-align:center">
          <Button 
            v-show="share.canBiz"
            @click="onClickModalBtn('cancel')"
            style="width:90px">取消</Button>
          <Button 
            v-show="share.canBiz"
            @click="onClickModalBtn('confirm')"
            type="primary"
            :loading="modal.btnLoading"
            :class="[{'keys-btn': !this.fromAdmin}]"
            style="width:90px">确定</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
import { 
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
        canBiz: false
      })
    }
  },
  data () {
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
          title : '实例ID',
          key   : 'instanceId',
          render: (h, { row:{ configInfo:{ instanceId } } }) => [instanceId]
        },
        {
          title : 'IP地址',
          key   : 'ipAddress',
          render: (h, { row:{ configInfo:{ ipAddress } } }) => [ipAddress]
        },
        {
          title : '开放端口',
          key   : 'openPort',
          render: (h, { row:{ configInfo:{ openPort } } }) => [openPort]
        },
        {
          title : '用户名',
          key   : 'username',
          render: (h, { row:{ configInfo:{ username } } }) => [username]
        },
        {
          title : '密码',
          key   : 'password',
          render: (h, { row:{ configInfo:{ password } } }) => [password]
        },
        {
          title    : '操作',
          width    : 100,
          className: 'table-column-fix',
          render   : (h, { row }) => {
            const actions = [{ icon: 'detail', type: 'detail', title: '编辑' }]
            if (this.share.canBiz) {
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
        instanceId          : '',
        ipAddress           : '',
        openPort            : '',
        username            : '',
        password            : '',
        introduction        : ''
      },
      rules: {
        applicationComponent: { required: true, message: '请输入应用组件', trigger: 'blur' },
        specs               : { required: true, message: '请选择内存规格', trigger: 'change' },
        dataDiskStorage     : { required: true, message: '请输入数据盘存储', trigger: 'blur' },
        image               : { required: true, message: '请选择镜像类型', trigger: 'change' },
        instanceId          : { required: true, message: '请输入实例ID', trigger: 'blur' },
        ipAddress           : { required: true, message: '请输入IP地址', trigger: 'blur' },
        openPort            : { required: true, message: '请输入开放端口', trigger: 'blur' },
        username            : { required: true, message: '请输入用户名', trigger: 'blur' },
        password            : { required: true, message: '请输入密码', trigger: 'blur' }
      },
      specsList: [],
      imageList: []
    }
  },
  computed: {
    biz () {
      return observable.state.biz
    }
  },
  methods: {
    onClickRowAction ({ type, row }) {
      if (type === 'del') {
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
        msg    : '是否确认删除此应用?',
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
      Object.assign(this.form, JSON.parse(JSON.stringify(row.configInfo)))
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
            const _data = {
              orderNum, viewName: _viewName, ...copyForm
            }
            asyncIaasService(_data).then(res => {
              modal.btnLoading = true
              const { code, msg } = res
              if (code === 0) {
                modal.show = false
                Object.assign(serviceList[modal.curIndex], copyForm)
                
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