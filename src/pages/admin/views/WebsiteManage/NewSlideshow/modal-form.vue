<template>
  <Form 
    ref="formRef" 
    :model="form" 
    :rules="rules">
    <Row>
      <i-col span='24'>
        <FormItem 
          label="新闻标题："
          :label-width="$calcLabelWidth('新闻标题：',{isRequired:true,extraNum:1})"
          prop="title">
          <Input 
            v-model="form.title"
            placeholder="请输入新闻标题" />
        </FormItem>
      </i-col>
      <i-col span='24'>
        <FormItem 
          label="新闻简介："
          :label-width="$calcLabelWidth('新闻简介：',{isRequired:true,extraNum:1})"
          prop="briefIntroduction">
          <Input 
            v-model="form.briefIntroduction"
            type="textarea"
            maxlength="150"
            show-word-limit
            placeholder="请输入新闻简介" />
        </FormItem>
      </i-col>
      <i-col span='12'>
        <FormItem 
          label="发布时间："
          :label-width="$calcLabelWidth('发布时间：',{isRequired:true,extraNum:1})"
          prop="onlineTime">
          <DatePicker type="date" placeholder="请选择发布时间" :value="form.onlineTime" style="width:100%" @on-change="handleDate"></DatePicker>
        </FormItem>
      </i-col>
      <!-- <i-col span='12'>
        <FormItem 
          label="发布状态："
          :label-width="$calcLabelWidth('发布状态：',{isRequired:true,extraNum:1})"
          prop="state">
          <Select 
            v-model="form.state"
            placeholder="请选择发布状态">
            <Option 
              v-for="(item,index) in [{name:'未发布',value:0},{name:'已发布',value:1}]" 
              :value="item.value" 
              :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
       </i-col> -->
       <i-col span='12'>
        <FormItem 
          label="是否为外部链接新闻："
          :label-width="$calcLabelWidth('是否为外部链接新闻：',{isRequired:true,extraNum:1})"
          prop="link">
          <RadioGroup 
            v-model="form.link">
            <Radio :label="1" style="margin-right:14px">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
       </i-col>
       <i-col span='24' v-if="form.link===1">
        <FormItem 
          label="外部链接："
          :label-width="$calcLabelWidth('外部链接：',{isRequired:true,extraNum:1})"
          prop="url">
          <Input 
            v-model="form.url"
            placeholder="请输入外部链接" />
        </FormItem>
      </i-col>
      <i-col span='24'>
        <FormItem label="上传封面图：" prop="image" :label-width="$calcLabelWidth('上传封面图：',{isRequired:true,extraNum:1})">
            <upload-logo 
              folder="carousel"
              :url="form.imageUrl"
              @on-success="onUploadSuccess"/>
          </FormItem>
        
      </i-col>
      <i-col span='24'>
        <FormItem 
          label="编辑正文："
          :label-width="$calcLabelWidth('编辑正文：',{isRequired:true,extraNum:1})"
          prop="content">
            <Tinymce 
              v-model="form.content"
              ref="tinymce"
              v-on="$listeners"
              :base-url="$baseUrl"
              folder="news/content"
              :action="`${$baseUrl}/fileStore/uploadImage`"></Tinymce>
        </FormItem>
        
      </i-col>
    </Row>
               
  </Form>
</template>
<script>
import Tinymce from '_admin/components/tinymce'
import UploadLogo from '@/components/upload-logo'
export default {
  props: {
    form: {
      type   : Object,
      default: () => {
        return {
          title            : '',
          briefIntroduction: '',
          onlineTime       : '',
          state            : 0,
          link             : 0,
          url              : '',
          image            : '',
          content          : '',
          imageUrl         : ''
        }
      }
    },
    modalShow: {
      type: Boolean
    },
    curIndex: {
      type: Number
    }
  },
  watch: {
    modalShow (newVal) {
      if (!newVal) {
        this.$nextTick(() => {
          this.$refs.tinymce.isDynamicChangeValue = false
        })
      } else {
        if (this.curIndex === -1) {
          this.$refs.formRef.resetFields()
          this.form.content = ''
          this.form.url = ''
          this.form.imageUrl = ''
          this.$refs.tinymce.setTextContent('')
        }
      }
    }
  },
  data () {
    return {
      rules: {
        title: {
          required: true, message : '新闻标题不能为空'
        },
        briefIntroduction: {
          required: true, message : '新闻简介不能为空'
        },
        image: {
          required: true, message : '封面图不能为空'
        }
      },
      uploadList: []
    }
  },
  methods: {
    
    onUploadSuccess (response) {
      const { code, data } = response
      if (code === 0) {
        this.form.image = data.id
        this.$set(this.form, 'imageUrl', data.url)
        // this.form.imageUrl = data.url
        this.$refs.formRef.validateField('image')
      }
    },
    handleDate (value) {
      this.form.onlineTime = value
    }
  },
  mounted () {
    const formRef = this.$refs.formRef
    this.validate = formRef.validate
    this.resetFields = formRef.resetFields
  },
  components: {
    Tinymce,
    UploadLogo
  }
}
</script>