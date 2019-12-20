<template>
  <Form 
    ref="formRef" 
    :model="form" 
    :rules="rules">
    <Row :gutter="24">
      <i-col span="12">
        <FormItem 
          label="姓名："
          :label-width="$calcLabelWidth('姓名：',{isRequired:true,extraNum:2})"
          prop="realName">
          <Input 
            v-model="form.realName"
            placeholder="请输入姓名" />
        </FormItem>
      </i-col>
      <i-col span="12">
        <FormItem 
          label="身份证号："
          :label-width="$calcLabelWidth('身份证号：',{extraNum:1})" 
          prop="idcard">
          <Input 
            :value="form.idcard"
            @on-change="$filterInput($event,v => form.idcard = v, {type:'id'})"
            placeholder="请输入身份证号" />
        </FormItem>
      </i-col>
      <i-col span="12">
        <FormItem 
          label="联系电话："
          :label-width="$calcLabelWidth('联系电话：',{extraNum:1})" 
          prop="phone">
          <Input 
            :value="form.phone"
            @on-change="$filterInput($event,v => form.phone = v, {type:'tel'})"
            placeholder="请输入联系电话" />
        </FormItem>
      </i-col>
      <i-col span="12">
        <FormItem 
          label="排序："
          :label-width="$calcLabelWidth('排序：',{isRequired:true,extraNum:2})"
          prop="sort">
          <Input 
            :value="form.sort"
            @on-change="$filterInput($event,v => form.sort = v, {type:'number',length:5})"
            placeholder="请输入(1-99999)" />
        </FormItem>
      </i-col>
      <i-col span="24">
        <FormItem 
          label="用户类型：" 
          :label-width="$calcLabelWidth('用户类型：',{isRequired:true})" 
          prop="type">
          <Select 
            v-model="form.type"
            placeholder="请选择用户类型">
            <Option 
              v-for="item of typeList" 
              :value="item.code" 
              :key="item.code">{{ item.value }}</Option>
          </Select>
        </FormItem>
      </i-col>
      <i-col span="24">
        <FormItem 
          label="所属组织："
          :label-width="$calcLabelWidth('所属组织：',{isRequired:true})" 
          prop="orgs">
          <tree-select
            v-model="form.orgs"
            :data="orgsList"
            :expand-all="false"
            check-strictly></tree-select>
        </FormItem>
      </i-col>
      <i-col span="24" v-show="departmentTypeShow">
        <FormItem 
          v-show="userType === 3"
          label="租户类型" 
          :label-width="$calcLabelWidth('租户类型：',{isRequired:true})" 
          prop="tenantId"
          :rules="{ required: userType === 3, message: '租户不能为空' }">
          <Select 
            v-model="form.tenantId"
            placeholder="请选择租户类型">
            <Option 
              v-for="item of tenantList" 
              :value="item.id" 
              :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem 
          v-show="userType === 2"
          label="管理部门" 
          :label-width="$calcLabelWidth('管理部门：',{isRequired:true})" 
          prop="manageOrgs"
          :rules="{ required: userType === 2, type: 'array', message: '管理部门不能为空', trigger: 'change' }">
          <tree-select
            v-model="form.manageOrgs"
            :data="manageOrgsList"
            :expand-all="false"
            check-strictly></tree-select>
        </FormItem>
      </i-col>
      <i-col span="12" v-show="policeInfoShow">
        <FormItem 
          label="职务："
          :label-width="$calcLabelWidth('职务：',{isRequired:true,extraNum:2})" 
          prop="duty"
          :rules="{ required: policeInfoShow, message: '职务不能为空' }">
          <Input 
            v-model="form.duty"
            placeholder="请输入职务" />
        </FormItem>
      </i-col>
      <i-col span="12" v-show="policeInfoShow">
        <FormItem 
          label="警号：" 
          :label-width="$calcLabelWidth('警号：',{isRequired:true,extraNum:2})" 
          prop="policeNumber"
          :rules="{ required: policeInfoShow, message: '警号不能为空' }">
          <Input 
            v-model="form.policeNumber"
            placeholder="请输入警号" />
        </FormItem>
      </i-col>
      <i-col span="12" v-show="policeInfoShow">
        <FormItem 
          label="警衔：" 
          :label-width="$calcLabelWidth('警衔：',{isRequired:true,extraNum:2})" 
          prop="policeRank"
          :rules="{ required: policeInfoShow, message: '警衔不能为空', trigger: 'change' }">
          <Select 
            v-model="form.policeRank"
            placeholder="请选择警衔">
            <Option 
              v-for="item of policeRankList" 
              :value="item.id" 
              :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </i-col>
      <i-col span="12" v-show="policeInfoShow">
        <FormItem 
          label="警种：" 
          :label-width="$calcLabelWidth('警种：',{extraNum:3})" 
          prop="policeType"
          :rules="{ required: policeInfoShow, message: '警种不能为空', trigger: 'change' }">
          <Select 
            v-model="form.policeType"
            placeholder="请选择警种">
            <Option 
              v-for="item of policeTypeList" 
              :value="item.id" 
              :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </i-col>
      
      <i-col span="24">
        <FormItem 
          label="用户角色：" 
          :label-width="$calcLabelWidth('用户角色：',{required:true,extraNum:1})" 
          prop="roles">
          <Select 
            v-model="form.roles"
            multiple
            placeholder="请选择用户角色" >
            <Option 
              v-for="item of roleList" 
              :value="item.id" 
              :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </i-col>
      <i-col span="24">
        <FormItem 
          label="描述：" 
          :label-width="$calcLabelWidth('描述：',{required:true,extraNum:3})" 
          prop="description"
          class="textarea-label-fix"
          style="width:100%">
          <Input 
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述" />
        </FormItem>
      </i-col>
    </Row>              
  </Form>
</template>
<script>
import TreeSelect from '_admin/components/tree-select'
import { fetchDictByName } from '_admin/api/common'
import { fetchRoleList, fetchTenantList } from '_admin/api/sys'
export default {
  components: { TreeSelect },
  inject    : ['typeList', 'allOrgList'],
  props     : {
    form: {
      type: Object
    }
  },
  data () {
    return {
      rules: {
        realName   : { required: true, message: '姓名不能为空' },
        idcard     : { required: true, message: '身份证号不能为空' },
        sort       : { required: true, message: '排序不能为空' },
        orgs       : { required: true, type: 'array', message: '所属组织不能为空', trigger: 'change' },
        type       : { required: true, type: 'number', message: '用户类型不能为空', trigger: 'change' },
        roles      : { required: true, type: 'array', message: '用户角色不能为空', trigger: 'change' },
        description: { required: true, message: '描述不能为空' }
      },
      tenantList    : [],
      roleList      : [],
      policeRankList: [],
      policeTypeList: [],

      orgsList      : [],
      manageOrgsList: []
    }
  },
  computed: {
    userType () {
      return this.form.type
    },
    departmentTypeShow () {
      const userType = this.userType
      return userType === 2 || userType === 3
    },
    policeInfoShow () {
      return this.userType === 1 || this.departmentTypeShow
    }
  },
  watch: {
    allOrgList (newVal) {
      if (!this.orgsList.length) {
        this.orgsList = JSON.parse(JSON.stringify(newVal))
        this.manageOrgsList = JSON.parse(JSON.stringify(newVal))
      }
    } 
  },
  mounted () {
    const formRef = this.$refs.formRef
    this.validate = formRef.validate
    this.resetFields = formRef.resetFields

    fetchTenantList({ name: '', orgName: '' }).then(res => {
      const { code, data } = res
      if (code === 0) { 
        this.tenantList = data.records.map(item => ({ id: item.tenantId, name: item.name }))
      }
    })
    fetchRoleList({ name: '' }).then(res => {
      const { code, data } = res
      if (code === 0) { 
        this.roleList = data.records.map(item => ({ id: item.id, name: item.name }))
      }
    })

    fetchDictByName('policeType').then(res => {
      const { code, data } = res
      if (code === 0) {
        this.policeTypeList = data.map(item => ({ id: item.id, name: item.name }))
      }
    })
    fetchDictByName('policeRank').then(res => {
      const { code, data } = res
      if (code === 0) {
        this.policeRankList = data.map(item => ({ id: item.id, name: item.name }))
      }
    })
  }
}
</script>