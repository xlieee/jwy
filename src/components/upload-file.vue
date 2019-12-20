<template>
  <Upload
    :on-success="onSuccess"
    :on-error="onError"
    :before-upload="onBeforeUpload"
    :headers="{access_token}"
    ref="upload"
    type="drag"
    :action="`${$baseUrl}/fileStore/uploadDoc`"
    :data="{folder}"
    name="file"
    :disabled="disabled"
    :show-upload-list="false"
    style="display:inline-block">
    <slot :disabled="disabled"></slot>
  </Upload>
</template>
<script>
export default {
  props: {

    folder: String,

    size: {
      type   : Number,
      default: 80
    }
  },
  data () {
    return {
      access_token: localStorage.getItem('token'),

      uploadList: [],
      disabled  : false
    }
  },
  mounted () {
    this.uploadList = this.$refs.upload.fileList
  },
  methods: {
    onSuccess (response) {
      this.disabled = false
      this.$emit('on-success', response)
      this.uploadList.pop()
    },
    onError () {
      this.uploadList.pop()
      this.disabled = false
    },
    onBeforeUpload () {
      this.disabled = true
    }
  }
}
</script>