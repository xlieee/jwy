<template>
  <div class="work-approve">
    <ul class="work-approve-tabs">
      <li 
        v-for="(item,index) in tabList" 
        :key="item.type" 
        @click="tabChange(index,item.type)" 
        :class="activeIndex==index?'active':''">{{item.name}}</li>
    </ul>
    <common-resource-form 
      :left-offset="110"
      class-name="ivu-modal-wrap-index-top"/>
    <!-- <query-block
      v-once
      :form="page"
      :on-click-query="onClickQuery"/>
    <div class="application-control-table" style="background:#fff;padding:20px 16px 24px">
      <Table 
        :columns="columns" 
        :data="datas" 
        :row-key='true'
        >
      </Table>
      <div style="overflow:hidden">
        <Page :total="total" :page-size="page.size" class-name='pagination' @on-change="changepage"/>
      </div>
    </div> -->
  </div>
</template>
<script>
// import QueryBlock from './query-block'
import CommonResourceForm from '@/components/application/resource/daas'
export default {
  components: {
    // QueryBlock,
    CommonResourceForm
  },
  props: {
    type: String
  },
  data () {
    return {
      tabList: [
        { name: 'IAAS资源申请', type: 'iaas' },
        { name: 'PAAS资源申请', type: 'paas' },
        { name: 'DAAS资源申请', type: 'daas' },
        { name: 'SAAS资源申请', type: 'saas' },
        { name: '上云应用申请', type: 'cloud' },
        { name: '应用注册申请', type: 'application' },
        { name: '服务发布申请', type: 'service' }
      ],
      activeIndex: 2,
      page       : {
        size   : 10,
        current: 1,
        name   : '',
        state  : ''
      },
      total  : 0,
      columns: [
        {
          title: '序号',
          type : 'index',
          width: 80
        }, {
          title: '申请单号',
          key  : 'name'
        }, {
          title: '申请人',
          key  : 'person'
        }, {
          title: '申请单位',
          key  : 'unit'
        }, {
          title: '资源名称',
          key  : 'source'
        }, {
          title: '状态',
          key  : 'status'
        }, {
          title: '申请时间',
          key  : 'date'
        }, {
          title : '操作',
          width : 100,
          render: (h, { row }) => {
            const actions = [
              { icon: 'detail', type: 'edit', title: '编辑' },
              { icon: 'del', type: 'delete', title: '删除' }
            ]
            return actions.map(({ icon, type, title }) => {
              return (
                <Tooltip 
                  content={title} 
                  theme="light" 
                  placement="top"
                  class="tooltip-fix">
                  <i 
                    onClick={() => this.onClickRowAction({ type, row })}
                    class={`icon-sprites-g1 icon-${icon}`}></i>
                </Tooltip>
                  
              )
            })
          }
        }
      ],
      datas: [
        { name: '201910230002' }
      ],
      transmitData: {
        type        : 'daas',
        resourceType: this.getResourceType('daas')
      }
    }
  },
  watch: {
    'transmitData.type' (newVal) {
      this.transmitData.resourceType = this.getResourceType(newVal)
    },
    type (newVal) {
      this.transmitData.resourceType = this.getResourceType(newVal)
      this.activeIndex = this.tabList.findIndex(item => item.type == this.type)
    }
  },
  provide () {
    return {
      dynamicVar: this.transmitData
    }
  },
  methods: {
    getResourceType (type) {
      return ['cloud', 'saas', 'daas', 'paas', 'iaas', 'application', 'service'].indexOf(type || this.transmitData.type) + 1
    },
    tabChange (index, type) {
      this.activeIndex = index
      this.transmitData.type = type
    },
    onClickQuery (form) {
      console.log(form)
    },
    changepage (page) {
      this.page.current = page
    },
    onClickRowAction ({ type }) {
      console.log(type)
    }
  }
  
}
</script>
<style>
.ivu-modal-wrap-index-top {
  top: 80px;
}
</style>