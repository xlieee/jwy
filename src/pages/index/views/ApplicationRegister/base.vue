<template>
  <div class="base-form">
    <p class="base-form-title">应用信息</p>
    <Form ref="form" :model="form" :rules="rules">
      <Row style="border-bottom:1px solid #E4E7ED">
        <i-col span="24">
          <FormItem prop="name" label='应用名称：' :label-width="108">
              <Input type="text" v-model="form.name" placeholder="请规范填写应用名称（填写规范：区域+警种+应用名称。例如:(广东科信智慧运维一体化平台），（只支持汉字、英文、数字、下划线）"/>
          </FormItem>
        </i-col>
        <i-col span="8">
          <FormItem prop="place" label='所属地区：' :label-width="108">
              <Select v-model="form.place">
                  <Option value="beijing">New York</Option>
                  <Option value="shanghai">London</Option>
                  <Option value="shenzhen">Sydney</Option>
              </Select>
          </FormItem>
        </i-col>
        <i-col span="8">
          <FormItem prop="police" label='所属警种：' :label-width="120">
              <Select v-model="form.police">
                  <Option value="beijing">New York</Option>
                  <Option value="shanghai">London</Option>
                  <Option value="shenzhen">Sydney</Option>
              </Select>
          </FormItem>
        </i-col>
        <i-col span="8">
          <FormItem prop="classify" label='所属分类：' :label-width="120">
              <Select v-model="form.classify">
                  <Option value="beijing">New York</Option>
                  <Option value="shanghai">London</Option>
                  <Option value="shenzhen">Sydney</Option>
              </Select>
          </FormItem>
        </i-col>
        <i-col span="24">
          <FormItem prop="address" label='系统地址：' :label-width="108">
              <Input type="text" v-model="form.address" placeholder="请输入系统地址，包含前缀"/>
          </FormItem>
        </i-col>
        <i-col span="8">
          <FormItem prop="type" label='应用状态：' :label-width="108">
            <RadioGroup v-model="form.type">
              <Radio label="build">
                  <span>建设中</span>
              </Radio>
              <Radio label="complete">
                  <span>建设完成</span>
              </Radio>
            </RadioGroup>
          </FormItem>
        </i-col>
        <i-col span="8">
          <FormItem prop="isPublic" label='是否可申请：' :label-width="140">
              <RadioGroup v-model="form.isPublic">
                <Radio label="true">
                    <span>是</span>
                </Radio>
                <Radio label="false">
                    <span>否</span>
                </Radio>
              </RadioGroup>
          </FormItem>
        </i-col>
        <i-col span="8">
          <FormItem prop="isApplication" label='是否加密应用：' :label-width="153">
              <RadioGroup v-model="form.isApplication">
                <Radio label="1">
                    <span>是</span>
                </Radio>
                <Radio label="0">
                    <span>否</span>
                </Radio>
              </RadioGroup>
          </FormItem>
        </i-col>
        <i-col span="24">
          <FormItem label="服务LOGO" prop="logo">
              <Upload
                :before-upload="handleUpload"
                action=""
                class="avatar-uploader"
              >
                <Button class="logo_upload">
                  <img style="width:80px;height:80px" :src="require('../../assets/img/upload.svg')" alt="">
                </Button>
              </Upload>
              <span class="form_logo_text">( 图片尺寸 80 x 80px )</span>
          </FormItem>
        </i-col>
        <i-col span="24">
          <FormItem prop="description" label='权限描述：' :label-width="108">
              <Input type="textarea" v-model="form.description" placeholder="请输入权限描述"/>
          </FormItem>
        </i-col>
        <i-col span="24">
          <FormItem prop="serdescription" label='应用描述：' :label-width="108">
              <Input type="textarea" v-model="form.serdescription" placeholder="请输入应用描述"/>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem prop="buildCycle" label='建设周期：' :label-width="108">
              <i-input v-model="form.buildCycle">
                  <span slot="append">月</span>
              </i-input>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem prop="lifeCycle" label='生命周期：' :label-width="120">
              <i-input v-model="form.lifeCycle">
                  <span slot="append">年</span>
              </i-input>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem prop="onlineDate" label='上线时间：' :label-width="108">
               <DatePicker v-model="form.onlineDate" type="date" :clearable='false' style="width:100%"></DatePicker>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem prop="method" label='建设方式：' :label-width="120">
              <RadioGroup v-model="form.method">
                <Radio label="owner">
                    <span>自建</span>
                </Radio>
                <Radio label="other">
                    <span>承建</span>
                </Radio>
              </RadioGroup>
          </FormItem>
        </i-col>
      </Row>
      <Row style="border-bottom:1px solid #E4E7ED">
        <p style="margin:30px 0 40px" class="base-form-title">建设单位</p>
        <i-col span="24">
          <FormItem prop="buildUnit" label='建设单位：' :label-width="108">
              <Select v-model="form.buildUnit">
                  <Option value="beijing">New York</Option>
                  <Option value="shanghai">London</Option>
                  <Option value="shenzhen">Sydney</Option>
              </Select>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem prop="buildPrincipal" label='负责人：' :label-width="108">
              <Select v-model="form.buildPrincipal">
                  <Option value="beijing">New York</Option>
                  <Option value="shanghai">London</Option>
                  <Option value="shenzhen">Sydney</Option>
              </Select>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem prop="buildprincipalPhone" label='负责人电话：' :label-width="140">
              <Input type="text" v-model="form.buildprincipalPhone" placeholder="请输入负责人电话"/>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem prop="transactor" label='经办人：' :label-width="108">
              <Input type="text" v-model="form.buildtransactor" placeholder="请输入经办人"/>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem prop="transactorPhone" label='经办人电话：' :label-width="140">
              <Input type="text" v-model="form.buildtransactorPhone" placeholder="请输入经办人电话"/>
          </FormItem>
        </i-col>
      </Row>
      <Row style="border-bottom:1px solid #E4E7ED">
        <p style="margin:30px 0 40px" class="base-form-title">承建单位</p>
        <i-col span="24">
          <FormItem prop="unit" label='承建单位：' :label-width="108">
              <Select v-model="form.unit">
                  <Option value="beijing">New York</Option>
                  <Option value="shanghai">London</Option>
                  <Option value="shenzhen">Sydney</Option>
              </Select>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem prop="principal" label='负责人：' :label-width="108">
              <Select v-model="form.principal">
                  <Option value="beijing">New York</Option>
                  <Option value="shanghai">London</Option>
                  <Option value="shenzhen">Sydney</Option>
              </Select>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem prop="principalPhone" label='负责人电话：' :label-width="140">
              <Input type="text" v-model="form.principalPhone" placeholder="请输入负责人电话"/>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem prop="transactor" label='经办人：' :label-width="108">
              <Input type="text" v-model="form.transactor" placeholder="请输入经办人"/>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem prop="transactorPhone" label='经办人电话：' :label-width="140">
              <Input type="text" v-model="form.transactorPhone" placeholder="请输入经办人电话"/>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem prop="code" label='统一社会信用代码：' :label-width="170">
              <Input type="text" v-model="form.code" placeholder="请输入统一社会信用代码"/>
          </FormItem>
        </i-col>
        <i-col span="12">
          <FormItem prop="idCard" label='负责人身份证号码：' :label-width="189">
              <Input type="text" v-model="form.idCard" placeholder="请输入负责人身份证号码"/>
          </FormItem>
        </i-col>
      </Row>
      
    </Form>
    <div class="fileUpload">
      <p class="upload-title base-form-title" style="margin:30px 0 27px">附件信息 <span>（请上传服务使用说明文件）</span></p>
      <Upload
            :before-upload="handleUpload"
            action=""
            class="avatar-uploader"
            style="border:0;padding:0"
            :show-upload-list="true"
          >
            <Button class="upload-click"><i></i>点击上传</Button>
          </Upload>
          <ul class="file-list">
            <li
              v-for="(item, index) in file"
              :key="index"
            >
              <span>{{ item.name }}</span>
              <div>
                <Icon
                  type="md-close"
                  @click="delectFile(item.name)"
                />
              </div>
            </li>
          </ul>
          <p class="file-upload-tip">支持扩展名：.rar .zip .doc .docx .pdf .jpg...</p>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      form : {},
      rules: {
        name: [
          { required: true, message: '请输入应用名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择应用类型', trigger: 'change' }
        ],
        isPublic: [
          { required: true, message: '是否发布到API网关', trigger: 'change' }
        ],
        isApplication: [
          { required: true, message: '是否来源于应用', trigger: 'change' }
        ],
        origin: [
          { required: true, message: '请选择来源应用', trigger: 'change' }
        ],
        place: [
          { required: true, message: '请选择所属地区', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入系统地址', trigger: 'blur' }
        ],
        police: [
          { required: true, message: '请选择所属警种', trigger: 'change' }
        ],
        classify: [
          { required: true, message: '请选择所属分类', trigger: 'change' }
        ],
        tag: [
          { required: true, message: '请选择所属标签', trigger: 'change' }
        ],
        logo: [
          { required: true, message: '请选择logo', trigger: 'change' }
        ],
        buildCycle: [
          { required: true, message: '请输入建设周期', trigger: 'blur' }
        ],
        lifeCycle: [
          { required: true, message: '请输入生命周期', trigger: 'blur' }
        ],
        onlineDate: [
          { required: true, type: 'date', message: '请输入上线时间', trigger: 'change' }
        ],
        buildUnit: [
          { required: true, message: '请选择建设单位', trigger: 'change' }
        ],
        buildPrincipal: [
          { required: true, message: '请选择项目负责人', trigger: 'change' }
        ],
        buildprincipalPhone: [
          { required: true, message: '请输入负责人电话', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请选择承建单位', trigger: 'change' }
        ],
        principal: [
          { required: true, message: '请选择项目负责人', trigger: 'change' }
        ],
        principalPhone: [
          { required: true, message: '请输入负责人电话', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入统一社会信用代码', trigger: 'blur' }
        ],
        idCard: [
          { required: true, message: '请输入负责人身份证号码', trigger: 'blur' }
        ],
        method: [
          { required: true, message: '请选择建设方式', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入权限描述', trigger: 'blur' }
        ],
        serdescription: [
          { required: true, message: '请输入应用描述', trigger: 'blur' }
        ]
      },
      file    : [],
      imageUrl: '',
      loading : false
    }
  },
  methods: {
    handleUpload (file) {
      if (!file) return false
      let formData = new FormData()
      formData.append('file', file) // 文件对象;
      // this.$http
      //   .post('/files/upload', {
      //     data: formData
      //   })
      //   .then(res => {
      //     this.setBasicInfo({ image: res[0].url })
      //   })
      return false
    }
    
  },
  components: {
    // FormItemContainer
  }
}
</script>
<style lang="scss" scoped>
.base-form-title{
  font-size:18px;
  font-weight:600;
  color:#303133;
  line-height:25px;
  margin-bottom: 30px;
}
.upload-title{
  span{
    font-size: 18px;
    color: #909399;
    font-weight: 400;
  }
}
.register{
  width: 140px;
  height: 44px;
  color: #fff;
  background: #3399FF;
  font-size: 16px;
  margin-left: 16px;
}

.avatar-uploader{
  width: 100%;
  border: 0;
  outline: none;
  box-shadow:none;
  overflow: hidden;
  padding-left: 108px;
  height: 80px;
  // position: absolute;
  // top: 50px;
  // left: 100px;
  .logo_upload{
    height: 80px;
    padding: 0
  }
}
.form_logo_text {
    position: absolute;
    top: 5px;
    left: 94px;
    color: #909399;
    font-size: 16px;
}
.upload-click{
  width: 140px;
  height: 44px;
  background: $btnColor;
  font-size: 16px;
  color: #fff;
  position: relative;
  padding-left: 26px;
  &:hover{
    background: $btnColor;
    color: #fff;
  }
  i{
    width: 19px;
    height: 20px;
    display: inline-block;
    background: url('../../assets/img/click-upload.png') no-repeat center center;
    position: absolute;
    top: 11px;
    left: 24px;
    margin-right: 9px;
  }
}
.file-upload-tip{
  font-size:14px;
  color:#909399;
  line-height:20px;
}
</style>