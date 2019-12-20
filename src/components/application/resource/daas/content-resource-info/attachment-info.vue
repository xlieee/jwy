<template>
  <div>
    <Row :gutter="16">
      <div class="form-title form-title-fix" style="padding-bottom:0">
        <slot name="title">
          附件信息<span style="font-weight:400;color:#909399">（请上传服务使用说明文件）</span>
        </slot>
      </div>
    </Row>
    <upload-file 
      folder="bpm"
      @on-success="onUploadSuccess"
      #default="{disabled}"
      style="margin: 10px 0 5px 0;">
      <Button type="primary" style="width:120px" :disabled="!canUpload">
        <Icon type="md-arrow-round-up" class="icon-btn-upload" />上传文件{{disabled ? '中...': ''}}
      </Button>
    </upload-file>
    <p>支持扩展名：.rar .zip .doc .docx .pdf .jpg...</p>
    <ul class="upload-list">
      <li 
        v-for="(file,index) of fileList"
        :key="file.id"
        class="item">
        <a :href="file.url" download>{{file.originName}}</a>
        <Icon @click="onDelFile(index)" type="md-close-circle" />
      </li>
    </ul>
  </div>
</template>
<script>
import UploadFile from '@/components/upload-file'
import observable from '../observable'
export default {
  components: { UploadFile },
  props     : {
    field: {
      type   : String,
      default: 'resource'
    },
    list: {
      type   : String,
      default: 'fileList'
    },
    canUpload: {
      type   : Boolean,
      default: true
    }
  },
  computed: {
    fileList () {
      const fileList = observable.state[this.field][this.list]
      return fileList ? fileList.map(file => {
        const { id, url, originName } = file
        return { id, originName, url }
      }) : []
    }
  },
  methods: {
    onDelFile (index) {
      observable.state[this.field][this.list].splice(index, 1)
    },
    onUploadSuccess (response) {
      const { code, data, msg } = response
      if (code === 0) {
        const { id, url, originName } = data
        observable.state[this.field][this.list].push({
          id, originName, url
        })
      } else {
        this.$Message.error(msg)
      }
    }
  }
}
</script>