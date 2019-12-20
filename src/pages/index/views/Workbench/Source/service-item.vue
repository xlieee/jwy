<template>
  <div class="service-item">
    <div class="show-data">
      <ul>
        <li v-for="(item,index) in dataList" :key="index" :style="`background-image:url(${require(`_index/assets/img/work-publish-bg_${index}.png`)})`">
          <dl>
            <dt>{{item.name}}</dt>
            <dd><span>{{item.count}}</span>{{item.unit}}</dd>
          </dl>
          <img :src="require(`_index/assets/img/work-source-${type}_${index}.png`)" alt="">
        </li>
      </ul>
    </div>
    <div class="application-control-table" style="margin-top:20px;background:#fff;padding:0 16px 24px">
      <div class="query">
        <ul v-if="type===1">
          <li v-for="item in typeList" :key="item" :class="active==item?'active':''" @click="queryChange(item)">{{item.toUpperCase()}}服务</li>
        </ul>
        <p v-else>
          应用列表·20
        </p>
        <Input search placeholder="请输入服务名称进行查询" style="width:350px;margin-top:14px"/>
      </div>
      <Table 
        :columns="columns" 
        :data="datas" 
        :row-key='true'
        >
      </Table>
      <div style="overflow:hidden">
        <Page :total="total" :page-size="page.size" class-name='pagination' @on-change="changepage"/>
      </div>
    </div>
    <WorkModal :permission='permission'/>
  </div>
</template>
<script>
const dataTotal = [
  [
    { name: '发布服务总数', count: 344, unit: '个' },
    { name: '被订阅总数', count: 85, unit: '次' },
    { name: '被调用总数', count: 682.77, unit: '万次' }
  ], [
    { name: '注册应用总数', count: 344, unit: '个' },
    { name: '用户总量', count: 85, unit: '人' },
    { name: '总访问量', count: 682.77, unit: '万次' }
  ]
]
import WorkModal from '../modal'
export default {
  components: {
    WorkModal
  },
  props: {
    type: Number
  },
  data () {
    return {
      dataList: [],
      columns : [],
      datas   : [
        {
          name: '全息画像'
        }
      ],
      total: 0,
      page : {
        current: 1,
        size   : 10
      },
      typeList    : ['saas', 'daas', 'paas'],
      active      : 'saas',
      permission  : false,
      tableColumns: [
        [
          {
            title: '序号',
            type : 'index',
            width: 80
          },
          {
            title: '服务名称',
            key  : 'name'
          }, {
            title: '发布人',
            width: 100,
            key  : 'person'
          }, {
            title: '发布时间',
            width: 120,
            key  : 'date'
          }, {
            title: '申请单号',
            width: 100,
            key  : 'single'
          }, {
            title: '被订阅量',
            width: 100,
            key  : 'count'
          }, {
            title: '被调用数',
            width: 100,
            key  : 'use'
          }, {
            title: '状态',
            width: 100,
            key  : 'status'
          }, {
            title : '操作',
            width : 100,
            render: (h, { row }) => {
              const flag = row.state === 0 ? 'offline' : 'online'
              const actions = [
                { icon: 'detail', type: 'edit', title: '编辑' },
                { icon: 'offline', type: 'offline', title: '下线' },
                { icon: 'online', type: 'online', title: '上线' }
              ].filter(action => flag !== action.type)
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
        [
          {
            title: '序号',
            type : 'index',
            width: 80
          },
          {
            title: '应用名称',
            key  : 'name'
          }, {
            title: '注册人',
            width: 100,
            key  : 'person'
          }, {
            title: '注册时间',
            width: 120,
            key  : 'date'
          }, {
            title: '申请单号',
            width: 100,
            key  : 'single'
          }, {
            title: '用户量',
            width: 100,
            key  : 'count'
          }, {
            title: '访问量',
            width: 100,
            key  : 'use'
          }, {
            title: '状态',
            width: 100,
            key  : 'status'
          }, {
            title : '操作',
            width : 100,
            render: (h, { row }) => {
              const flag = row.state === 0 ? 'offline' : 'online'
              const actions = [
                { icon: 'detail', type: 'edit', title: '编辑' },
                { icon: 'offline', type: 'offline', title: '下线' },
                { icon: 'online', type: 'online', title: '上线' }
              ].filter(action => flag !== action.type)
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
        ]
      ]
    }
  },
  watch: {
    type (newVal) {
      if (newVal) {
        console.log(this.type)
        this.dataList = dataTotal[this.type - 1]
        this.columns = this.tableColumns[this.type - 1]
      }
    }
  },
  mounted () {
    this.dataList = dataTotal[this.type - 1]
    this.columns = this.tableColumns[this.type - 1]
  },
  methods: {
    changepage (page) {
      this.page.current = page
    },
    queryChange (item) {
      this.active = item
    },
    onClickRowAction ({ type }) {
      console.log(type, 'type')
      if (type === 'edit') {
        this.permission = !this.permission
      }
    }
  }
}
</script>
<style lang="scss" scope>
.query{
  display: flex;
  justify-content: space-between;
  height: 68px;
  
  ul{
    overflow: hidden;
    li{
      float: left;
      margin-right: 60px;
      line-height: 68px;
      cursor: pointer;
      font-size: 16px;
      color: #0B2444;
    }
    .active{
      color: $active;
      font-weight: 600
    }
  }
  p{
    line-height: 68px;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }
}
</style>