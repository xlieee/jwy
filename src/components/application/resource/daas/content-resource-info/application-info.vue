<template>
  <div style="padding-bottom:20px">
    <Row :gutter="16"><div class="form-title form-title-fix">申请信息</div></Row>
    <Row :gutter="16" class="sub-title">
      <div class="icon-required">服务列表</div>
      <Button 
        @click="onClickAdd"
        type="text" 
        size="small"
        style="float:right">
        <i class="icon-sprites-small icon-add-small"></i>新增
      </Button>
    </Row>
    <component ref="curComponent" :is="curComponent"></component>
  </div>
  
</template>
<script>
import observable from '../observable'
export default {
  components: { 
    Daas: () => import('./application-info-content/daas'),
    Ecs : () => import('./application-info-content/iaas-ecs')
  },
  computed: {
    curComponent () {
      const viewName = observable.state.viewName
      return viewName || 'daas'
    }
  },
  methods: {
    onClickAdd () {
      const { curComponent } = this.$refs
      if (curComponent) {
        curComponent.onClickRowAction({ type: 'add' })
      }
    }
  }
}
</script>