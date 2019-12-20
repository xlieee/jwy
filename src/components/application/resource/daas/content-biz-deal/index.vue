<template>
  <div>
    <component :is="curComponent"></component>
    <div style="border-top:1px solid #e8eaec"></div>
    <attachment-info 
      field="biz" 
      list="implementFileList"
      :can-upload="share.canBiz">
      <template slot="title">实施文件</template>
    </attachment-info>
  </div>
</template>
<script>
import AttachmentInfo from '../content-resource-info/attachment-info'
import observable from '../observable'
export default {
  components: {
    Daas: () => import('./content/daas'),
    Ecs : () => import('./content/iaas-ecs'),
    AttachmentInfo
  },
  inject  : ['share'],
  computed: {
    curComponent () {
      const viewName = observable.state.viewName
      return viewName || 'daas'
    }
  }
}
</script>