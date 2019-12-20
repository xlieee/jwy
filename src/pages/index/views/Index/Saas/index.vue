<template>
  <div class="saas">
    <div class="saasMain">
      <div class="saas-head">
        <p class="saas-title">热门SAAS服务</p>
        <p class="saas-description">{{total}}个应用及系统，全方位满足您的警务需求</p>
      </div>
      <div class="saasContent">
        <SideItem :sideList='saasSide' type='saas' :bg='saasbg' :onSide='handleSide'/>
        <SideList :sideDataList='saasDataList' type='saas'/>
      </div>
      <a href="javascripg:;" class="more" @click="more('saas',saasSide)">查看更多</a>
    </div>
  </div>
</template>
<script>
import SideItem from '../../../components/side-item'
import SideList from '../../../components/side-list'
import saasbg from '../../../assets/img/home-side-saas-bg.png'
import { fetchSubclass, fetchAssData } from '_index/api/index.js'
export default {
  components: {
    SideItem,
    SideList
  },
  props: {
    more: {
      type: Function
    }
  },
  data () {
    return {
      saasSide    : [],
      saasbg      : 'background:url(' + saasbg + ') no-repeat center center',
      saasDataList: [
        {
          title      : '数据积木',
          description: '在其他各个界面中都可采集为一个集合，在有多个集合数据类型相同的情况下都可以进行碰撞分析。然后分析出看似无关的两个集合是否在某些方面存在关联。在其他各个界面中都可采集为一个集合，在有多个集合数据类型相同的情况下都可以进行碰撞分析。然后分析出看似无关的两个集合是否在某些方面存在关联。'
        }, {
          title      : '人车伴随',
          description: '通过案件任务详情，将伴随任务列表（有车牌号、手机号、混合）加入任务池中，进行伴随分析，从而知道车牌号的轨迹，与之相关的手机号的轨迹，找出嫌疑人的轨迹'
        }, {
          title      : '批量落地',
          description: '通过宽带查询，手机查询，实名查询等方式，可实时查看在逃人数以及本地在逃数量趋势图，联查全国在逃人员信息，通过虚实关联出虚拟身份信息'
        }, {
          title      : 'IP落地',
          description: '通过特定的IP地址、宽带接入上网账号、MAC值等条件信息查询出符合查询条件的某个时间段/点的上下线、登录等上网动作信息。'
        }, {
          title      : '模型超市',
          description: '模型超市是可视化建模平台的配套工程，是模型输出、展示、学习、交流、评价、考核、管理的综合平台，也是与建模相关的其他业务活动的载体，是以建模的方式快速实现大数据技术赋能、数据赋能、业务赋能应用闭环的重要保障。'
        }, {
          title      : '广东科信智慧新搜索',
          description: '公安智能搜索工具，基于大数据工程数据的基础上实现多维度数据的一键查询，为打击犯罪、反恐维稳、指挥决策提供强大的数据支撑，为基层民警提供了实时、迅速、便捷、准确、全面的搜索服务，向民警提供了有机整合后的数据资源，全量刻画搜索目标的档案信息。'
        }, {
          title      : '警情分布',
          description: '以案件类型、案件性质、性质分类、处理单位、派出所、案发时间为条件来查询出案件发生情况。'
        }, {
          title      : '对象管控',
          description: '通过预警通知来预防被管控对象作出更多的危险行为。根据实时分布图，实时热力图掌握前科犯罪人员的大致分布情况，更好的分配警力资源。'
        }, {
          title      : '全网追逃',
          description: '可实时查看在逃人数以及本地在逃数量趋势图，联查全国在逃人员信息，通过虚实关联出虚拟身份信息。'
  
        }
      ],
      page: {
        current : 1,
        size    : 9,
        name    : '',
        subclass: ''

      },
      total: 0
    }
  },
  mounted () {
    this.getSubclass()
    
  },
  watch: {
    '$route.name' (newVal) {
      if (newVal == 'index') {
        this.page.subclass = this.saasSide[0].id
        this.getDataList()
      }
    }
  },
  methods: {
    //获取侧边列表
    getSubclass () {
      fetchSubclass('Saas').then(res => {
        if (res.code === 0) {
          this.page.subclass = res.data[0].id
          this.saasSide = res.data.map(item => {
            return {
              id    : item.id,
              title : item.title,
              remark: item.remark
            }
          })
          this.getDataList()
        } else {
          this.saasSide = []
        }
      })
    },
    //获取SaaS列表
    getDataList () {
      fetchAssData(this.page, 'saas').then(res => {
        if (res.code === 0) {
          this.saasDataList = res.data.records.map(item => {
            return {
              id         : item.id,
              title      : item.shortName,
              description: item.description,
              url        : item.systemUrl,
              image      : item.imageUrl
            }
          })
          this.total = res.data.total
        } else {
          this.saasDataList = []
        }
      })
    },
    handleSide (id) {
      this.page.subclass = id
      this.getDataList()
    }
  }
}
</script>