<template>
  <div>
    <News/>
    <Yun/>
    <Saas id="anchor_saas" class="anchor_saas" :more='more'/>
    <Daas id="anchor_daas" class="anchor_daas" :more='more'/>
    <Paas id="anchor_paas" class="anchor_paas" :more='more'/>
    <Iaas id="anchor_iaas" class="anchor_iaas" :more='more'/>
    <BaseSource/>
    <PromptModal :modal-data="modalData"/>
  </div>
</template>
<script>
import News from '../News'
import Yun from './Yun/index.vue'
import Saas from './Saas/index.vue'
import Daas from './Daas/index.vue'
import Paas from './Paas/index.vue'
import Iaas from './Iaas/index.vue'
import BaseSource from './BaseSource/index.vue'
import PromptModal from '_index/components/prompt-modal.vue'

export default {
  components: {
    News,
    Yun,
    Saas,
    Daas,
    Paas,
    Iaas,
    BaseSource,
    PromptModal
  },
  data () {
    return {
      modalData: {
        type           : '',
        applyPermission: false
      }
    }
  },
  
  methods: {
    more (type, data) {
      console.log(type, data)
      if (localStorage.token) {
        this.$router.push({ path: `indexMore/${type}`, query: { sideList: JSON.stringify(data) } })
      } else {
        this.modalData.type = 'no-login'
        this.modalData.applyPermission = !this.modalData.applyPermission
      }
    }
    
  }
}
</script>
