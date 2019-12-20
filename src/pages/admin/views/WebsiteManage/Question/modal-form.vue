<template>
  <Form 
    ref="formRef" 
    :model="form" 
    :rules="rules">
    <Row>
      <i-col span='24'>
        <FormItem 
          label="标题："
          :label-width="$calcLabelWidth('标题：',{isRequired:true,extraNum:1})"
          prop="title">
          <Input 
            v-model="form.title"
            placeholder="请输入名称" />
        </FormItem>
      </i-col>
      <i-col span='12'>
        <FormItem 
          label="问题分类："
          :label-width="$calcLabelWidth('问题分类：',{isRequired:true,extraNum:1})"
          prop="classification">
          <Select 
            v-model="form.classification"
            placeholder="请选择问题分类">
            <Option 
              v-for="(item,index) in problemTypeList" 
              :value="item.id" 
              :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
       </i-col>
       <i-col span='12'>
        <FormItem 
          label="发布状态："
          :label-width="$calcLabelWidth('发布状态：',{isRequired:true,extraNum:1})"
          prop="state">
          <Select 
            v-model="form.state"
            placeholder="请选择发布状态">
            <Option 
              v-for="(item,index) in [{name:'未发布',status:0},{name:'已发布',status:1}]" 
              :value="item.status" 
              :key="index">{{ item.name }}</Option>
          </Select>
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
              base-url="http://192.168.31.20:8005"
              min-height="240"
              :id="`vue-tinymce-${+new Date()}`"
              :action="`${$baseUrl}/fileStore/uploadImage`"
              source-url="/static/vendor/tinymce/tinymce.min.js"
              language-url="/static/vendor/tinymce/zh_CN.js"></Tinymce>
        </FormItem>
      </i-col>
      <i-col :span='24'>
        <FormItem 
          label="文档附件："
          :label-width="$calcLabelWidth('文档附件：',{isRequired:true,extraNum:1})"
          prop="fileList">
           <UploadFile
              :file-list="form.files"
              :datas='{folder:"/document/file"}'
              @on-change="data=>handleChangeFile(data)"
              :only-one="false"/>
        </FormItem>
      </i-col>
      
    </Row>
               
  </Form>
</template>
<script>
import { 
  fetchProblemTypeList
} from '_admin/api/website'
import UploadFile from '_admin/components/UploadFile'
import Tinymce from '_admin/components/tinymce'
export default {
  props: {
    form: {
      type: Object
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
          this.$refs.formRef.resetFields()
        })
      } else {
        if (this.curIndex === -1) {
          this.$refs.formRef.resetFields()
          this.form.files = []
          this.form.content = ''
          this.$refs.tinymce.setTextContent('')
        }
      }
    }
  },
  data () {
    return {
      rules: {
        title: {
          required: true, message : '文档名称不能为空'
        },
        state: {
          required: true, message : '发布状态不能为空'
        },
        content: {
          required: true, message : '新闻内容不能为空'
        },
        classification: {
          required: true, message : '新闻分类不能为空'
        }
      },
      problemTypeList: []
    }
  },
  mounted () {
    const formRef = this.$refs.formRef
    this.validate = formRef.validate
    this.resetFields = formRef.resetFields
    this.fetchProblemTypeList()
  },
  methods: {
    handleDate (value) {
      this.form.createTime = value
    },
    fetchProblemTypeList () {
      fetchProblemTypeList().then(res => {
        if (res.code === 0) {
          this.problemTypeList = res.data.map((item) => {
            return {
              id  : item.id,
              name: item.name
            }
          })
        } else {
          this.problemTypeList = []
        }

      })
    },
    handleChangeFile (fileList) {
      this.fileIdList = fileList.map(item => item.id)
      this.form.fileIds = this.fileIdList.join(',')
    }
  },
  components: {
    UploadFile,
    Tinymce
  }
}
</script>