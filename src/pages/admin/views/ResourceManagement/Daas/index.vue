<template>
  <common-resource-form 
    from-admin
    :collapsed="collapsed"
    :left-offset="leftOffset"
    class-name="ivu-modal-wrap-admin-top"/>
</template>
<script>
import CommonResourceForm from '@/components/application/resource/daas'
export default {
  components: { CommonResourceForm },
  computed  : {
    leftOffset () {
      return this.$store.getters.leftOffset
    },
    collapsed () {
      return this.$store.state.collapsed
    }
  },
  data () {
    const type = this.$route.path.split('/').pop().toLowerCase()
    const resourceType = ['cloud', 'saas', 'daas', 'paas', 'iaas'].indexOf(type) + 1
    return {
      data: {
        type,
        resourceType
      }
    }
  },
  provide () {
    return {
      fromAdmin : true,
      dynamicVar: this.data
    }
  },
  mounted () {
    const createVars = path => {
      const type = path.split('/').pop().toLowerCase()
      const resourceType = ['cloud', 'saas', 'daas', 'paas', 'iaas'].indexOf(type) + 1
      return { type, resourceType }
    }
    this.$watch('$route.path', newVal => {
      Object.assign(this.data, createVars(newVal))
    }, { immediate: true }) 
  }
}
</script>
<style lang="scss">
.ivu-modal-wrap-admin-top {
  top: 68px;
}

</style>