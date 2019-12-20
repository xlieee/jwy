<template>
  <Upload
    :on-success="onSuccess"
    :on-error="onError"
    :before-upload="onBeforeUpload"
    :disabled="disabled"
    :headers="{access_token}"
    ref="upload"
    type="drag"
    :format="['jpg','jpeg','png','svg','gif']"
    :action="`${$baseUrl}/fileStore/uploadImage`"
    :data="{folder}"
    name="image"
    :show-upload-list="false"
    style="display:inline-block">
    <div :style="{height:`${size}px`}" class="flex-center">
      <Icon v-if="!url" type="ios-add" :size="size" />
      <img 
        v-else
        :src="url"
        :width="size"
        :height="size" />
      <Progress 
        v-if="uploadList.length" 
        :percent="uploadList[0].percentage" 
        hide-info 
        style="position: absolute;left:0"></Progress>
    </div>
  </Upload>
</template>
<script>
export default {
  props: {
    folder: String,

    url: String,

    size: {
      type   : Number,
      default: 80
    }
  },
  data () {
    return {
      access_token: localStorage.getItem('token'),

      disabled  : false,
      uploadList: []
    }
  },
  mounted () {
    this.uploadList = this.$refs.upload.fileList
    console.log(this.url, 'url')
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