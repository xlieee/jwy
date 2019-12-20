<template>
  <div>
    <div v-if="modalData.type === 'submitCarts'">
      <Modal
          v-model="applyPermission"
          title="基本信息"
          footer-hide
          @on-cancel="$emit('on-cancel')"
          width="960px">
          <Form ref="baseInfo" :model="form" :rules="rules">
            <Row :gutter='20' style="border-bottom:1px solid #E4E7ED">
              <i-col span="24">
                <FormItem prop="appId" label='应用名称：' :label-width="108">
                  <Select
                      v-model="form.appId"
                      filterable
                      remote
                      placeholder="下拉选择，输入过滤"
                      :loading="loading1"
                      :remote-method='getCloudAppList'>
                      <Option v-for="option in cloudList" :value="option.id" :label="option.fullName" :key="option.id">
                          <span>{{option.fullName}}</span>
                          <span class="org-right">{{getOrg(option.createUserOrg)}}</span>
                      </Option>
                  </Select>
                </FormItem>
              </i-col>
              <i-col span="24">
                <FormItem prop="orgId" label='申请单位：' :label-width="108">
                  <Select
                      v-model="form.orgId"
                      filterable
                      remote
                      :loading='loading3'
                      multiple
                      disabled
                      placeholder="下拉选择，输入过滤"
                      :remote-method='getOrgList'>
                      <Option v-for="option in orgList" :value="option.id" :label="option.name" :key="option.id">
                      </Option>
                  </Select>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem prop="applyUser" label='申请人：' :label-width="108">
                  <Select
                      v-model="form.applyUser"
                      filterable
                      remote
                      disabled
                      :loading='loading2'
                      placeholder="下拉选择，输入过滤"
                      :remote-method='getApproveList'>
                      <Option v-for="option in approveList" :value="option.id" :label="option.realName" :key="option.id">
                          <span>{{option.realName}}</span>
                          <span class="org-right">{{getOrg(option.orgList)}}</span>
                      </Option>
                  </Select>
                  <!-- <Input v-model="form.user" placeholder="根据选择的应用信息填充，可修改"/> -->
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem prop="applyPhone" label='联系电话：' :label-width="108">
                  <Input disabled v-model="form.applyPhone" placeholder="根据选择的应用信息填充，可修改"/>
                </FormItem>
              </i-col>
              <i-col span="24">
                <FormItem prop="applyIntroduction" label='申请说明：' :label-width="108">
                  <Input type="textarea" v-model="form.applyIntroduction" placeholder="请输入组件描述"/>
                </FormItem>
              </i-col>
              <i-col span="24">
                <FormItem prop="departmentApprovalUser" label='部门审批人：' :label-width="121">
                  <Select
                      v-model="form.departmentApprovalUser"
                      filterable
                      remote
                      :loading='loading2'
                      placeholder="下拉选择，输入过滤"
                      :remote-method='getApproveList'>
                      <Option v-for="option in approveList" :value="option.id" :label="option.realName" :key="option.id">
                          <span>{{option.realName}}</span>
                          <span class="org-right">{{getOrg(option.orgList)}}</span>
                      </Option>
                  </Select>
                </FormItem>
              </i-col>
            </Row>
            <Row class="application-file">
              <p class="title">申请资料</p>
              <upload-file 
                folder="applyOrder/file"
                @on-success="onUploadSuccess"
                #default="{disabled}"
                style="margin: 10px 0 5px 0;">
                <Button type="primary" style="width:150px" class="upload-btn">
                  <Icon type="md-arrow-round-up" class="icon-btn-upload" style="vertical-align:text-top"/>上传文件{{disabled ? '中...': ''}}
                </Button>
              </upload-file>
              <p>支持扩展名：.rar .zip .doc .docx .pdf .jpg...</p>
              <ul class="upload-list">
                <li 
                  v-for="(file,index) of fileList"
                  :key="file.id"
                  class="item">
                  <a :href="file.url" download>{{file.name}}</a>
                  <Icon @click="onDelFile(index)" type="md-close-circle" />  
                  </li>
              </ul>
            </Row>
          </Form>
          <div class="modalFooter">
            <Button 
              @click="$emit('on-cancel')"
              class="btn btn-cancel">取消</Button>
            <Button 
              @click="handleSubmit('baseInfo')"
              class="btn btn-ok">确定</Button>
          </div>
      </Modal>
    </div>
    <div v-if="modalData.type === 'submitCarts-yun'">
      <Modal
          v-model="applyPermission"
          title="基本信息"
          footer-hide
          width="960px"
          @on-cancel="$emit('on-cancel')">
          <Form ref="yunInfo" :model="yunForm" :rules="yunRules">
            <Row :gutter='20' style="border-bottom:1px solid #E4E7ED">
              <i-col span="24">
                <FormItem prop="unit" label='申请单位：' :label-width="108">
                  <Select
                      v-model="yunForm.orgId"
                      filterable
                      remote
                      :loading='loading3'
                      multiple
                      placeholder="下拉选择，输入过滤"
                      :remote-method='getOrgList'>
                      <Option v-for="option in orgList" :value="option.id" :label="option.name" :key="option.id">
                      </Option>
                  </Select>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem prop="user" label='申请人：' :label-width="108">
                  <Select
                      v-model="yunForm.applyUser"
                      filterable
                      remote
                      :loading='loading2'
                      placeholder="下拉选择，输入过滤"
                      :remote-method='getApproveList'>
                      <Option v-for="option in approveList" :value="option.id" :label="option.realName" :key="option.id">
                          <span>{{option.realName}}</span>
                          <span class="org-right">{{getOrg(option.orgList)}}</span>
                      </Option>
                  </Select>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem prop="applyPhone" label='联系电话：' :label-width="108">
                  <Input v-model="yunForm.applyPhone" placeholder="根据选择的应用信息填充，可修改"/>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem prop="idCard" label='身份证号：' :label-width="108">
                  <Input v-model="yunForm.idCard" placeholder="根据申请人登录信息获取"/>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem prop="duty" label='职务：' :label-width="108">
                  <Input v-model="yunForm.duty" placeholder="根据申请人登录信息获取"/>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem prop="date" label='申请时间：' :label-width="108">
                  <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" v-model="yunForm.date" placeholder="请选择申请时间" style="width:100%"></DatePicker>
                </FormItem>
              </i-col>
              <i-col span="12">
                <FormItem prop="address" label='终端IP地址：' :label-width="120">
                  <Input v-model="yunForm.address" placeholder="请输入应用使用的终端IP地址"/>
                </FormItem>
              </i-col>
              <i-col span="24">
                <FormItem prop="remark" label='申请说明：' :label-width="108">
                  <Input type="textarea" v-model="yunForm.remark" placeholder="请输入组件描述"/>
                </FormItem>
              </i-col>
              <i-col span="24">
                <FormItem prop="leader" label='部门审批人：' :label-width="121">
                  <Select
                      v-model="yunForm.departmentApprovalUser"
                      filterable
                      remote
                      :loading='loading2'
                      placeholder="下拉选择，输入过滤"
                      :remote-method='getApproveList'>
                      <Option v-for="option in approveList" :value="option.id" :label="option.realName" :key="option.id">
                          <span>{{option.realName}}</span>
                          <span class="org-right">{{getOrg(option.orgList)}}</span>
                      </Option>
                  </Select>
                </FormItem>
              </i-col>
            </Row>
            <Row class="application-file">
              <p class="title">申请资料</p>
              <upload-file 
                folder="applyOrder/file"
                @on-success="onUploadSuccess"
                #default="{disabled}"
                style="margin: 10px 0 5px 0;">
                <Button type="primary" style="width:150px">
                  <Icon type="md-arrow-round-up" class="icon-btn-upload" />上传文件{{disabled ? '中...': ''}}
                </Button>
              </upload-file>
              <p>支持扩展名：.rar .zip .doc .docx .pdf .jpg...</p>
              <ul class="upload-list">
                <li 
                  v-for="(file,index) of fileList"
                  :key="file.id"
                  class="item">
                  <a :href="file.url" download>{{file.name}}</a>
                  <Icon @click="onDelFile(index)" type="md-close-circle" />  
                  </li>
              </ul>
            </Row>
          </Form>

          <div class="modalFooter">
            <Button 
              @click="$emit('on-cancel')"
              class="btn btn-cancel">取消</Button>
            <Button 
              @click="handleSubmit('yunInfo')"
              class="btn btn-ok">确定</Button>
          </div>
      </Modal>
    </div>
    <div v-if="modalData.type === 'no-login'">
      <Modal
        v-model="applyPermission"
        title="提示"
        class-name="vertical-center-modal"
        @on-cancel="applyPermission = false">
        <div class="modalText">
          您好，请先登录！
        </div>
        <div class="modalFooter" slot="footer">
          <Button 
            @click="applyPermission = false"
            class="btn btn-cancel">取消</Button>
          <Button 
            @click="toLogin"
            class="btn btn-ok">确定</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
import { fetchUserByName, fetchCloudAppList, fetchOrgDetailList } from '@/api/index.js'
import UploadFile from '@/components/upload-file'
import {
  updateDocService
} from '_admin/api/service'
export default {
  components: {
    UploadFile
  },
  props: {
    modalData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      applyPermission: false,
      rules          : {
        appId: [
          { required: true, message: '请输入应用名称', trigger: 'change' }
        ],
        orgId: [
          { required: true, message: '请选择申请单位', trigger: 'change', type: 'array' }
        ],
        applyUser: [
          { required: true, message: '请输入申请人名称', trigger: 'change' }
        ],
        applyPhone: [
          { required: true, message: '请输入申请人电话', trigger: 'blur' }
        ],
        applyIntroduction: [
          { required: true, message: '请输入申请说明', trigger: 'blur' }
        ],
        departmentApprovalUser: [
          { required: true, message: '请输入部门审批人', trigger: 'change' }
        ]
      },
      yunRules: {
        unit: [
          { required: true, message: '请选择申请单位', trigger: 'change' }
        ],
        user: [
          { required: true, message: '请输入申请人名称', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入申请人电话', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入申请说明', trigger: 'blur' }
        ],
        idCard: [
          { required: true, message: '请输入申请人身份证号', trigger: 'blur' }
        ],
        duty: [
          { required: true, message: '请输入申请人职务', trigger: 'blur' }
        ],
        date: [
          { required: true, message: '请输入申请时间', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入终端IP地址', trigger: 'blur' }
        ],
        leader: [
          { required: true, message: '请输入部门审批人', trigger: 'change' }
        ]
      },
      form       : {},
      yunForm    : {},
      loading1   : false,
      loading2   : false,
      loading3   : false,
      cloudList  : [], //应用名称列表
      orgList    : [], //申请单位列表
      approveList: [], //审批人列表
      userInfo   : {},
      fileList   : []
    }
  },
  created () {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.getApproveList(this.userInfo.realName)
  },
  watch: {
    'modalData.applyPermission' (newVal) {
      this.applyPermission = newVal
      if (this.modalData.type === 'submitCarts') {
        this.getApproveList(this.userInfo.realName)
        this.orgList = this.userInfo.orgList
        this.$nextTick(() => {
          this.$set(this.form, 'applyUser', this.userInfo.id)
          this.$set(this.form, 'applyPhone', this.userInfo.phone)
          this.$set(this.form, 'orgId', this.userInfo.orgList.map(item => item.id))
          
          this.checkValid(['applyUser', 'applyPhone', 'orgId'], 'baseInfo')
        })
      }
      
    }
  },
  methods: {
    //多个参数验证
    checkValid (fieldsToValidate, name) {
      // let fieldsToValidate = ['username', 'password', 'gender', 'email']
      let _self = this
      Promise.all(fieldsToValidate.map(item => {
        let p = new Promise(function (resolve) {
          _self.$refs[name].validateField(item, (error) => {
            resolve(error)
          })
        })
        return p
      })).then((data) => {
        // data 里是各个字段的验证错误信息, 如果为空串则认为验证通过, 如果数组里全为空串则所有验证通过
        // 判断data 里是否全是空串
    
        // 去除数组空值
        data = data.filter(item => item)
        if (!data.length) {
          console.log('通过验证')
        } else {
          console.log('验证不通过')
        }
      })
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$emit('on-ok', this.form)
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    //获取应用列表
    getCloudAppList (name) {
      this.loading1 = true
      fetchCloudAppList(name).then(res => {
        this.loading1 = false
        if (res.code === 0) {
          this.cloudList = res.data
          
        } else {
          this.cloudList = []
        }
      })
    },
    //获取审批人列表
    getApproveList (name) {
      this.loading2 = true
      fetchUserByName(name).then(res => {
        this.loading2 = false
        if (res.code === 0) {
          this.approveList = res.data.map(item => {
            return {
              realName: item.realName,
              orgList : item.orgList,
              id      : item.id
            }
          })
        } else {
          this.approveList = []
        }
      })
    },
    onUploadSuccess (response) {
      console.log(response, 'responses')
      const { code, data, msg } = response
      if (code === 0) {
        const { id, url, originName:name } = data
        this.fileList.push({
          id, name, url
        })
        
        this.form.fileId = this.fileList.map(item => item.id).join(',')
      } else {
        this.$Message.error(msg)
      }
    },
    updateDocService ({ id, name, content, type, fileId }, customMsg) {
      const { sourceType, id:serviceId } = this
      updateDocService({
        id, type, name,
        sourceType, 
        serviceId,   
        content, fileId
      }).then(res => {
        const { code, msg } = res
        if (code === 0) {
          this.$emit('on-success', { type: 'doc-management' })
          this.$Message.success(customMsg || msg || '操作成功！')
        } else {
          this.$Message.error(msg)
        }
      })
    },
    onDelFile (index) {
      this.fileList.splice(index, 1)
      this.form.fileId = this.fileList.map(item => item.id).join(',')
    },
    //获取用户机构
    getOrg (arr) {
      if (arr && arr.length > 0) {
        let names = []
        names = arr.map(item => item.name)
        return names.join(',')
      }
    },
    //获取申请单位列表
    getOrgList (name) {
      this.loading3 = true
      fetchOrgDetailList(name).then(res => {
        this.loading3 = false
        if (res.code === 0) {
          this.orgList = res.data.map(item => {
            return {
              name: item.name,
              id  : item.id
            }
          })
        } else {
          this.orgList = []
        }
      })
    },
    //登录
    toLogin () {
      window.location.href = '/login.html'
    }
  }
}
</script>
<style lang="scss">
.modalFooter{
  margin-top: 33px;
  display: flex;
  justify-content: center;
  box-shadow:0px -2px 4px 0px rgba(246,111,106,0.1);
  border-radius:0px 0px 4px 4px;
  padding-top: 13px;
  .btn:first-of-type{
    margin-right: 20px;
  }
  .btn{
    width: 108px;
    height: 44px;
    font-size: 16px;
    border: 0;
  }
  .btn-cancel,.btn-cancel:hover{
    background: #EBEEF5;
    color: #606266;
  }
  .btn-ok,.btn-ok:hover{
    background: $active;
    color: #fff;
  }
}
.application-file{
  .title{
    font-size: 18px;
    color: #303133;
    font-weight: 600;
    margin: 30px 0 0;
  }
  .upload-click{
    width: 140px;
    height: 44px;
    background: $btnColor;
    color: #fff;
    position: relative;
    padding-left: 38px;
    &:hover{
      background: $btnColor;
      color: #fff;
    }
    i{
      width: 19px;
      height: 20px;
      display: inline-block;
      background: url('~_index/assets/img/click-upload.png') no-repeat center center;
      position: absolute;
      top: 11px;
      left: 24px;
      margin-right: 9px;
    }
  }
  .file-upload-tip{
    font-size: 14px;
    color: #909399;
  }
}
.org-right{
  float:right;
  width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
}
.upload-btn{
  &:hover{
    background: $theme-color;
    color: #fff;
  }
}
</style>