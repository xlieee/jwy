<template>
  <Form 
    ref="formRef" 
    :model="form" 
    :rules="rules">
    <Row>
      <i-col span='24'>
        <FormItem 
          label="文档名称："
          :label-width="$calcLabelWidth('文档名称：',{isRequired:true,extraNum:1})"
          prop="title">
          <Input 
            v-model="form.title"
            placeholder="请输入文档名称" />
        </FormItem>
      </i-col>
      <i-col span='12'>
        <FormItem 
          label="文档分类："
          :label-width="$calcLabelWidth('文档分类：',{isRequired:true,extraNum:1})"
          prop="classification">
          <Select 
            v-model="form.classification"
            placeholder="请选择文档分类">
            <Option 
              v-for="(item,index) in docTypeList" 
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
          label="文档描述："
          :label-width="$calcLabelWidth('文档描述：',{isRequired:true,extraNum:1})"
          prop="introduction">
          <Input 
            v-model="form.introduction"
            type="textarea"
            maxlength="150"
            show-word-limit
            placeholder="请输入文档描述" />
        </FormItem>
      </i-col>
      <i-col :span='24'>
        <FormItem 
          label="文档附件："
          :label-width="$calcLabelWidth('文档附件：',{isRequired:true,extraNum:1})"
          prop="fileList" class="ivu-form-item-required">
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
import UploadFile from '_admin/components/UploadFile'
import { 
  fetchDocumentTypeList
} from '_admin/api/website'
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
        }
      }
    }
  },
  data () {
    //自定义规则校验上传附件
    const validateFileList = (rule, value, callback) => {
      console.log(this.form.fileIds)
      if (!this.form.fileIds) {
        callback(new Error('上传附件不能为空'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        title: {
          required: true, message : '文档名称不能为空', trigger : 'blur'
        },
        classification: {
          required: true, message : '文档分类不能为空'
        },
        state: {
          required: true, message : '发布状态不能为空'
        },
        fileList: {
          // required: true, message : '上传附件不能为空'
          validator: validateFileList, trigger  : 'change'
        }
      },
      docTypeList: [],
      fileIdList : []
    }
  },
  mounted () {
    const formRef = this.$refs.formRef
    this.validate = formRef.validate
    this.resetFields = formRef.resetFields
    this.getDocTypeList()
  },
  methods: {
    handleDate (value) {
      this.form.createTime = value
    },
    getDocTypeList () {
      fetchDocumentTypeList().then(res => {
        console.log(res)
        if (res.code === 0) {
          this.docTypeList = res.data.map((item) => {
            return {
              id  : item.id,
              name: item.name
            }
          })
        } else {
          this.docTypeList = []
        }

      })
    },
    handleChangeFile (fileList) {
      this.fileIdList = fileList.map(item => item.id)
      this.form.fileIds = this.fileIdList.join(',')
    }
  },
  components: {
    UploadFile
  }
}
</script>