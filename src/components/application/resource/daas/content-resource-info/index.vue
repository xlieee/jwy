<template>
  <div>
    <base-info />
    <div style="margin-bottom:10px;border-top:1px solid #e8eaec"></div>
    <application-info />
    <div style="margin-bottom:10px;border-top:1px solid #e8eaec"></div>
    <attachment-info :can-upload="share.canEdit"/>
  </div>
</template>
<script>
import BaseInfo from './base-info'
import ApplicationInfo from './application-info'
import AttachmentInfo from './attachment-info'

export default {
  name  : 'resource-info',
  inject: ['share'],

  components: {
    BaseInfo,
    ApplicationInfo,
    AttachmentInfo
  }
  
}
</script>