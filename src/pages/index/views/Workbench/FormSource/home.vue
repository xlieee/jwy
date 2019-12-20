<template>
  <div class="formSource">
    <ul class="radioType">
      <li v-for="(item,index) in tabList" :key="index" :class="activeIndex==index?'active':''" @click="tabChange(item,index)">
        <i :class="'icon-'+item.icon"></i>{{item.name}}
      </li>
    </ul>
    <div class="form-source-content">
      <div class="form-list" v-for="(item,index) in dataList" :key="index">
        <TitleBlcok :name='item.name'></TitleBlcok>
        <div class="form-data" :style="`background:${item.color}`" @click="handleClick(item)">
          <div class="total">
            <div>
              <p class="title">申请总数：</p>
              <p class="data">{{item.total}}</p>
            </div>
            <img :src="`${require('_index/assets/img/work-form-'+item.alias+'.png')}`" alt="">
          </div>

          <div class="otherData">
            <p>待审核：<span>{{item.pedding}}</span></p>
            <p>被驳回：<span>{{item.reject}}</span></p>
            <p>使用中：<span>{{item.inUse}}</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TitleBlcok from '_index/components/title-block.vue'
import { asyncApplicationForm } from '_index/api/work'
const list = [
  [
    { 
      name   : '上云应用申请单',
      alias  : 'cloud',
      type   : 1,
      color  : 'linear-gradient(95deg,rgba(102,126,234,1) 0%,rgba(100,182,255,1) 100%)',
      total  : 0,
      pedding: 0,
      reject : 0,
      inUse  : 0
    },
    { 
      name   : 'SaaS服务申请单',
      type   : 2,
      alias  : 'saas',
      color  : 'linear-gradient(270deg,rgba(255,145,102,1) 0%,rgba(255,127,100,1) 100%)',
      total  : 0,
      pedding: 0,
      reject : 0,
      inUse  : 0
    },
    { 
      name   : 'DaaS服务申请单',
      type   : 3,
      alias  : 'daas',
      color  : 'linear-gradient(270deg,rgba(86,232,210,1) 0%,rgba(68,215,182,1) 100%)',
      total  : 0,
      pedding: 0,
      reject : 0,
      inUse  : 0
    },
    { 
      name   : 'PaaS服务申请单',
      type   : 4,
      alias  : 'paas',
      color  : 'linear-gradient(270deg,rgba(112,215,237,1) 0%,rgba(2,157,211,1) 100%)',
      total  : 0,
      pedding: 0,
      reject : 0,
      inUse  : 0
    },
    { 
      name   : 'IaaS资源申请单',
      type   : 5,
      alias  : 'iaas',
      color  : 'linear-gradient(90deg,rgba(28,203,117,1) 0%,rgba(130,222,131,1) 100%)',
      total  : 0,
      pedding: 0,
      reject : 0,
      inUse  : 0
    }
          
  ], [
    { 
      name     : '服务发布申请',
      alias    : 'publish',
      type     : 6,
      color    : 'linear-gradient(95deg,rgba(102,126,234,1) 0%,rgba(100,182,255,1) 100%)',
      total    : 0,
      pedding  : 0,
      implement: 0,
      reject   : 0,
      inUse    : 0
    },
    { 
      name     : '服务变更申请',
      type     : 7,
      alias    : 'change',
      color    : '#4BCAFF',
      total    : 0,
      pedding  : 0,
      implement: 0,
      reject   : 0,
      inUse    : 0
    },
    { 
      name     : '服务释放申请',
      alias    : 'release',
      color    : '#44D7B6',
      total    : 0,
      pedding  : 0,
      implement: 0,
      reject   : 0,
      inUse    : 0
    }
  ], [
    { 
      name     : '应用注册申请',
      alias    : 'publish',
      color    : 'linear-gradient(95deg,rgba(102,126,234,1) 0%,rgba(100,182,255,1) 100%)',
      total    : 0,
      pedding  : 0,
      implement: 0,
      reject   : 0,
      inUse    : 0
    },
    { 
      name     : '应用变更申请',
      alias    : 'change',
      color    : '#4BCAFF',
      total    : 0,
      pedding  : 0,
      implement: 0,
      reject   : 0,
      inUse    : 0
    },
    { 
      name     : '应用释放申请',
      alias    : 'release',
      color    : '#44D7B6',
      total    : 0,
      pedding  : 0,
      implement: 0,
      reject   : 0,
      inUse    : 0
    }
  ]
]
export default {
  components: {
    TitleBlcok
  },
  props: {
    onClick: Function
  },
  data () {
    return {
      tabList: [
        { name: '资源服务', icon: 'source' },
        { name: '服务发布', icon: 'service' },
        { name: '应用注册', icon: 'application' }
      ],
      activeIndex: 0,
      dataList   : list[0],
      statusList : [
        { name: '进行中', alias: 'pedding' }, 
        { name: '已完成', alias: 'inUse' }, 
        { name: '已驳回', alias: 'reject' }
      ]
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    tabChange (row, index) {
      this.activeIndex = index
      this.dataList = list[index]
      this.getData()
    },
    handleClick (row) {
      this.onClick(1, row)
    },
    getData () {
      asyncApplicationForm().then(res => {
        if (res.code === 0 && res.data && res.data.length > 0) {
          this.dataList.forEach(item => {
            let total = 0
            for (let j = 0;j < res.data.length;j++) {
              if (item.type == res.data[j].type) {
                total += res.data[j].count
                item[this.statusList[res.data[j].state].alias] = res.data[j].count || 0
              }
              item.total = total
            }
          })
        }
      })
    }
  }
  
}
</script>