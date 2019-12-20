<template>
  <div class="quick-nav">
    <ul
      class="index-content-anchor"
    >
      
      <li @click="$emit('back','saas')">
      </li>
      <li @click="$emit('back','daas')">
      </li>
      <li @click="$emit('back','paas')">
      </li>
      <li @click="$emit('back','iaas')">
      </li>
      <li @click="$emit('back')">
      </li>
      <li @click="$emit('back')">
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  
  data () {
    return {
      modalData: {
        type           : '',
        applyPermission: false
      }
    }
  },
  methods: {
    
  }
}
</script>

