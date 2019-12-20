<template>
  <Form 
    ref="formRef" 
    :model="form"
    :rules="rules">
    <FormItem 
      label="名称："
      :label-width="$calcLabelWidth('名称：',{isRequired:true,extraNum:1})"
      prop="name">
      <Input 
        v-model="form.name"
        maxlength="50" 
        show-word-limit
        placeholder="请输入名称" />
    </FormItem>
    <FormItem 
      label="描述：" 
      :label-width="$calcLabelWidth('描述：',{extraNum:2})" 
      prop="description"
      class="textarea-label-fix"
      style="width:100%">
      <Input 
        v-show="name === 'character' || name === 'detail'"
        v-model="form.description"
        :rows="3"
        maxlength="30" 
        show-word-limit
        type="textarea" />
      <div v-show="name === 'scene'">  
        <Tinymce 
          v-model="form.description"
          ref="tinymce1"
          v-on="$listeners"
          :base-url="$baseUrl"
          folder="saas"
          :action="`${$baseUrl}/fileStore/uploadImage`"></Tinymce>
      </div>
    </FormItem>
    <FormItem
      v-show="iconShow"
      label="图标："
      :label-width="$calcLabelWidth('图标：',{isRequired:true,extraNum:1})" 
      prop="imageId"
      :rules="{ required: iconShow, message: '图标不能为空' }">
      <div style="line-height:36px;color:#909399">(图片尺寸80*80px)</div>
      <upload-logo 
        folder="saas"
        :url="form.imageUrl"
        @on-success="onUploadSuccess"/>

    </FormItem>  
    <FormItem 
      v-show="!iconShow"
      label="展开解释：" 
      :label-width="$calcLabelWidth('展开解释：')" 
      prop="moreDescription"
      class="textarea-label-fix"
      style="width:100%">
      <Tinymce 
        v-model="form.moreDescription"
        ref="tinymce2"
        v-on="$listeners"
        :base-url="$baseUrl"
        folder="saas"
        :action="`${$baseUrl}/fileStore/uploadImage`"></Tinymce>
    </FormItem>    
  </Form>
</template>
<script>
import UploadLogo from '@/components/upload-logo'
import Tinymce from '_admin/components/tinymce'
export default {
  components: {
    Tinymce,
    UploadLogo
  },
  props: {
    name: String
  },
  data () {
    return {
      form: {
        name       : '',
        description: '',
        imageId    : '',
        imageUrl   : '',

        moreDescription: ''
      },
      rules: {
        name: { required: true, message: '名称不能为空' }
      }
    }
  },
  computed: {
    iconShow () {
      return ['character', 'scene'].indexOf(this.name) > -1
    }
  },
  mounted () {
    const $refs = this.$refs
    const formRef = $refs.formRef
    this.setTinymceTextContent = [$refs.tinymce1.setTextContent, $refs.tinymce2.setTextContent]
    this.validate = formRef.validate
    this.resetFields = formRef.resetFields
  },
  methods: {
    onUploadSuccess (response) {
      const { code, data } = response
      if (code === 0) {
        this.form.imageId = data.id
        this.form.imageUrl = data.url
        this.$refs.formRef.validateField('imageId')
      }
    }
  }
}
</script>