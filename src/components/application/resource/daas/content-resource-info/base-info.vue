<template>
  <Form 
    ref="formRef" 
    :model="form"
    :rules="rules">
    <Row :gutter="16"><div class="form-title form-title-fix">基本信息</div></Row>
    <Row :gutter="16">
      <i-col span="24">
        <div style="display:inline-block;margin-right:10px;width:calc(100% - 130px)">
          <FormItem 
            label="应用名称："
            :label-width="$calcLabelWidth('应用名称：',{isRequired:true,extraNum:1})"
            prop="appId">
            <select-app 
              v-model="form.appId"
              clearable
              :default-option-list="defaultAppOptionList"/>
          </FormItem>
        </div>
        <Button 
          @click="onClickApplyDetail"
          type="primary"
          :loading="detailLoading"
          style="width:120px">应用详情</Button>
        <apply-detail v-model="showApplyDetail" ref="applyDetail" />
      </i-col>
    </Row>
    <Row :gutter="16">
      <i-col span="24">
        <FormItem 
          label="申请单位："
          :label-width="$calcLabelWidth('申请单位：',{isRequired:true,extraNum:1})"
          prop="orgName">
          <Input :value="form.orgName" readonly/>
        </FormItem>
      </i-col>
    </Row>
    <Row :gutter="16">
      <i-col span="12">
        <FormItem 
          label="申请人："
          :label-width="$calcLabelWidth('申请人：',{isRequired:true,extraNum:2})"
          prop="applyUser">
          <Input :value="form.applyUser" readonly/>
        </FormItem>
      </i-col>
      <i-col span="12">
        <FormItem 
          label="联系电话："
          :label-width="$calcLabelWidth('联系电话：',{isRequired:true})"
          prop="applyPhone">
          <Input :value="form.applyPhone" readonly/>
        </FormItem>
      </i-col>
    </Row>
    <Row :gutter="16">
      <i-col span="24">
        <FormItem 
          label="申请事由："
          :label-width="$calcLabelWidth('申请事由：',{isRequired:true,extraNum:1})"
          prop="applyIntroduction"
          class="textarea-label-fix">
          <Input 
            v-model="form.applyIntroduction"
            type="textarea" />
        </FormItem>
      </i-col>
    </Row>
    <Row :gutter="16">
      <i-col span="8" style="min-width:440px">
        <FormItem 
          label="部门审批人："
          :label-width="$calcLabelWidth('部门审批人：',{isRequired:true})"
          prop="departmentApprovalUser">
          <select-person 
            v-model="form.departmentApprovalUser"
            clearable
            :default-option-list="defaultApprovalUserOptionList"/>
        </FormItem>
      </i-col>
    </Row>
  </Form>
</template>
<script>
import SelectApp from '@/components/select-app'
import SelectPerson from '@/components/select-person'
import { fetchAppDetail } from '@/api'
import observable from '../observable'

export default {
  components: {
    SelectApp,
    SelectPerson,
    ApplyDetail: () => import('./modal-apply-detail')
  },
  data () {
    return {
      showApplyDetail: false,
      detailLoading  : false,

      rules: {
        appId                 : { required: true, message: '应用名称不能为空', trigger: 'change' },
        orgName               : { required: true, message: '申请单位不能为空' },
        applyUser             : { required: true, message: '申请人不能为空' },
        applyPhone            : { required: true, message: '联系电话不能为空' },
        applyIntroduction     : { required: true, message: '申请事由不能为空' },
        departmentApprovalUser: { required: true, message: '部门审批人不能为空' }
      }
    }
  },
  computed: {
    defaultApprovalUserOptionList () {
      const { 
        departmentApprovalUser:id, 
        departmentApprovalUserName:realName,
        departmentApprovalUserOrg:orgNames
      } = observable.state.resource
      return [{ id, realName, orgNames }]
    },
    defaultAppOptionList () {
      const { appId:id, appName:fullName } = observable.state.resource
      return [{ id, fullName }]
    },
    form () {
      return observable.state.resource
    }
  },
  methods: {
    setState (v) {
      observable.state.resource.applyPhone = v
    },
    onClickApplyDetail () {
      const applyDetail = this.$refs.applyDetail
      if (applyDetail && applyDetail.infoList.length) {
        this.showApplyDetail = true
      } else {
        this.detailLoading = true
        fetchAppDetail(observable.state.resource.appId).then(res => {
          this.detailLoading = false
          this.showApplyDetail = true
          const { code, data } = res
          if (code === 0) {
            const {
              fullName, createTime, areaName, policeTypeName,
              constructionUnit, constructionPerson, constructionPhone,
              buildUnit, buildPerson, buildPhone
            } = data
            applyDetail.infoList = [
              {
                label: '应用信息', 
                list : [
                  { label: '应用名称', value: fullName, span: 12 },
                  { label: '注册时间', value: createTime, span: 12 },
                  { label: '所属地区', value: areaName, span: 12 },
                  { label: '所属警种', value: policeTypeName, span: 12 }
                  // { label: '所属单位', value: '单位', span: 24 }
                ]
              },
              {
                label: '建设单位', 
                list : [
                  { label: '建设单位', value: constructionUnit, span: 24 },
                  { label: '负责人', value: constructionPerson, span: 12 },
                  { label: '联系电话', value: constructionPhone, span: 12 }
                ]
              },
              {
                label: '承建单位', 
                list : [
                  { label: '承建单位', value: buildUnit, span: 24 },
                  { label: '负责人', value: buildPerson, span: 12 },
                  { label: '联系电话', value: buildPhone, span: 12 }
                ]
              }
            ]
          }
        })
      }
    }
  }
}
</script>