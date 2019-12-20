<template>
  <div>
    <Upload 
      ref="upload"
      :action="`${$baseUrl}/fileStore/uploadDoc`"
      :headers="{access_token}"
      :before-upload="onBeforeUpload"
      :on-success="onSuccess"
      with-credentials
      :data='datas'
      :format="format"
      :show-upload-list="!hideList && flag"
      v-show="!noButton">
      <slot><Button :disabled="!canEdit" icon="ios-cloud-upload-outline">上传附件</Button></slot>
    </Upload>
    <ul class="ivu-upload-list" v-if="!hideList">
      <li 
        v-for="(file,index) of fileList"
        :key="file.id"
        class="ivu-upload-list-file ivu-upload-list-file-finish" style="padding:0;line-height: 30px;font-size: 14px;">
        <span>
          <i class="ivu-icon" :class="/(png|jpeg|jpg)/i.test(file.suffix) ? 'ivu-icon-ios-image':'ivu-icon-ios-document-outline'"></i> 
          <a download :href="file.url"> {{ file.originName }}</a>
        </span>
        <i v-if="!noButton" @click="() => removeFile(index)" class="ivu-icon ivu-icon-ios-close ivu-upload-list-remove" style="font-size:26px;margin-top:4px"></i> 
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    canEdit: {
      type   : Boolean,
      default: true
    },
    format: {
      type   : Array,
      default: () => []
    },
    hideList: Boolean,
    fileList: {
      type   : Array,
      default: () => []
    },
    onlyOne: {
      type   : Boolean,
      default: true
    },
    noButton: Boolean,
    datas   : Object
  }, 
  data () {
    this.$nextTick(() => {
      this.uploadList = this.$refs.upload.fileList
    })
    return {
      access_token: localStorage.getItem('token'),

      uploadList: [],
      flag      : true
    }
  },
  methods: {
    onBeforeUpload () {
      this.onlyOne && (this.fileList.length = 0)
      this.flag = true
      this.$emit('before-upload')
    },
    onSuccess (response, file, fileList) {
      console.log(response, file, fileList)
      if (response.code === 0) {
        const file = response.data
        this.fileList.push(file)
        
        this.flag = false
        this.$emit('on-change', this.fileList)
        console.log(this.fileList, 'this.fileList')
        this.uploadList.pop()
      }
    },
    removeFile (index) {
      this.fileList.splice(index, 1)
      this.$emit('on-change', this.fileList)
    }
  }
}
</script>