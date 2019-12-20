<template>
  <div class="doc-main">
    <Tabs value="name1" class="documents-tabs" v-model="tabActive">
        <TabPane v-for="(item,index) in tabs" :key="index" :label="item.name">
          <component :is="tabsComponents[index]"></component>
        </TabPane>
    </Tabs>
    <!-- <Tabs v-model="tabActive" class="documents-tabs">
        <TabPane v-for="(item,index) in tabs" :key="index" :tab="item.name">
          <keep-alive>
            <component :is="tabsComponents[index]"></component>
          </keep-alive>
        </TabPane>
    </Tabs> -->
  </div>
</template>
<script>
import SAAS from './Saas'
import DAAS from './Daas'
import PAAS from './Paas'
import IAAS from './Iaas'
export default {
  data () {
    return {
      tabs          : [{ name: 'SAAS产品文档' }, { name: 'DAAS产品文档' }, { name: 'PAAS产品文档' }, { name: 'IAAS产品文档' }],
      tabActive     : 0,
      tabsComponents: [SAAS, DAAS, PAAS, IAAS]
    }
  },
  components: {
    // SAAS,
    // DAAS,
    // PAAS,
    // IAAS
  }
}
</script>