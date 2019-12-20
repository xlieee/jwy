<template>
  <div class="base-form">
    <p class="base-form-title">服务基本信息</p>
    <Form ref="form" :model="form" :rules="rules">
      <Row >
        <i-col span="24">
          <FormItem prop="name" label='服务名称：' :label-width="108">
              <Input type="text" v-model="form.name" placeholder="请规范填写服务名称（填写规范：区域+警种+服务名称。例如:(广东科信智慧运维一体化平台）"/>
          </FormItem>
        </i-col>
        <i-col span="24">
          <FormItem prop="type" label='服务类型：' :label-width="108">
            <RadioGroup v-model="form.type">
              <Radio label="SaaS服务">
                  <span>SaaS服务</span>
              </Radio>
              <Radio label="DaaS服务">
                  <span>DaaS服务</span>
              </Radio>
              <Radio label="PaaS服务">
                  <span>PaaS服务</span>
              </Radio>
            </RadioGroup>
          </FormItem>
        </i-col>
        <i-col span="24">
          <FormItem prop="isPublic" label='是否发布到API网关：' :label-width="180">
              <RadioGroup v-model="form.isPublic">
                <Radio label="SaaS服务">
                    <span>SaaS服务</span>
                </Radio>
                <Radio label="DaaS服务">
                    <span>DaaS服务</span>
                </Radio>
                <Radio label="PaaS服务">
                    <span>PaaS服务</span>
                </Radio>
              </RadioGroup>
          </FormItem>
        </i-col>
        <i-col span="24">
          <FormItem prop="isApplication" label='是否来源于应用：' :label-width="154">
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
      </Row>
      <i-col span="21">
        <FormItem prop="origin" label='来源应用：' :label-width="108">
            <Select v-model="form.origin">
                <Option value="beijing">New York</Option>
                <Option value="shanghai">London</Option>
                <Option value="shenzhen">Sydney</Option>
            </Select>
        </FormItem>
      </i-col>
      <i-col span="3">
        <FormItem>
            <Button class="register">应用注册</Button>
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
      <i-col span="8">
        <FormItem prop="tag" label='标签：' :label-width="108">
            <Select v-model="form.tag">
                <Option value="beijing">New York</Option>
                <Option value="shanghai">London</Option>
                <Option value="shenzhen">Sydney</Option>
            </Select>
        </FormItem>
      </i-col>
      <i-col span="8">
        <FormItem prop="showName" label='显示名称：' :label-width="120">
            <Input type="text" v-model="form.showName" placeholder="优先显示显示名称"/>
        </FormItem>
      </i-col>
      <i-col span="8">
        <FormItem prop="provider" label='服务商：' :label-width="120">
            <Input type="text" v-model="form.provider" placeholder="根据所属应用信息填充，可修改"/>
        </FormItem>
      </i-col>
      <i-col span="24">
        <FormItem prop="description" label='服务描述：' :label-width="108">
            <Input type="textarea" v-model="form.description" placeholder="请输入服务描述"/>
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
      
    </Form>
    <div class="fileUpload">
      <p class="upload-title base-form-title">附件信息 <span>（请上传服务使用说明文件）</span></p>
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
          { required: true, message: '请输入服务名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择服务类型', trigger: 'change' }
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
        provider: [
          { required: true, message: '请输入服务商名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入服务描述', trigger: 'blur' }
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
  background: $btnColor;
  font-size: 16px;
  margin-left: 16px;
  &:hover{
    background: $btnColor;
    color: #fff;
  }
}

.avatar-uploader{
  width: 100%;
  border: 0;
  outline: none;
  box-shadow:none;
  padding-bottom: 30px;
  border-bottom: 1px solid #E4E7ED;
  overflow: hidden;
  padding-left: 108px;
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