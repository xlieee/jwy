<template>
  <div class="doc-saas">
    <DocProductTabs :tabs='tabs' type='saas' @on-click='changeTabs'></DocProductTabs>
    <div class="doc-saas-table">
      <TableModel :columnsData='columnsData' :tableList='tableList'></TableModel>
      <Page :total="total" :page-size="page.size" class-name='pagination' @on-change="changepage"/>
    </div>

  </div>
</template>
<script>
import DocProductTabs from '../doc-product-tabs'
import TableModel from '_index/components/table-model'
import { fetchSubclass, fetchAssData } from '_index/api/index.js'
export default {
  components: {
    DocProductTabs,
    TableModel
  },
  data () {
    return {
      tabs       : [],
      columnsData: [
        {
          title: '产品名称',
          key  : 'name'
        },
        {
          title    : '类型',
          key      : 'subclassName',
          typewidth: 120
        },
        {
          title: '建设单位',
          key  : 'constructionUnit'
        },
        {
          title: '责任人',
          key  : 'constructionPerson',
          width: 100
        },
        {
          title: '发布时间',
          width: 180,
          key  : 'createTime'
        }, {
          title : '操作',
          width : 80,
          key   : 'control',
          render: (h, { row }) => {
            const actions = [
              { icon: 'detail', type: 'detail', title: '详情' }
            ]
            return actions.map(({ icon, title }) => {
              return (
                <Tooltip 
                  content={title} 
                  theme="light" 
                  placement="top"
                  class="tooltip-fix">
                  <i 
                    onClick={() => this.show(row)}
                    class={`icon-sprites-g1 icon-${icon}`}></i>
                </Tooltip>
                    
              )
            })
          }
        }
      ],
      tableList: [],
      page     : {
        current : 1,
        size    : 10,
        subclass: '',
        name    : ''
      },
      total: 0
    }
  },
  mounted () {
    this.getSubclass()
    this.getData()
  },
  methods: {
    //获取所属分类
    getSubclass () {
      fetchSubclass().then(res => {
        if (res.code === 0) {
          this.tabs = res.data.map(item => {
            return {
              value: item.id,
              label: item.title
            }
          })
          this.getData()
        } else {
          this.daasSide = []
        }
      })
    },
    //获取SaaS列表
    getData () {
      fetchAssData(this.page, 'saas').then(res => {
        if (res.code === 0) {
          this.tableList = res.data.records.map(item => {
            return {
              id                : item.id,
              name              : item.shortName,
              createTime        : item.createTime,
              subclassName      : item.subclassName,
              constructionUnit  : item.constructionUnit,
              constructionPerson: item.constructionPerson
            }
          })
          this.total = res.data.total
        } else {
          this.tableList = []
        }
      })
    },
    changepage (index) {
      this.page.current = index
      this.getData()
    },
    changeTabs (value) {
      this.page.subclass = value
      this.getData()
    },
    show (params) {
      console.log(params, 'params')
      this.$router.push({ path: `/productDoc/${params.id}`, query: { type: 'saas' } })
    }
  }
}
</script>
<style lang="scss">
.doc-saas-table{
  margin-top: 10px;
  padding: 16px 24px 50px;
  background: #fff;
  margin-bottom: 110px;
  overflow: hidden;
}
</style>