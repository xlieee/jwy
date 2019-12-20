<template>
  <div class="application-daas">
    <div class="application-daas-main">
      <QueryBlcok :aasSide='cloudAppSide' @on-search='onSearch'/>
      <div class="application-control-table">
        <Table 
          :columns="columns" 
          :data="dataList" 
          :row-key='true'
          >
          <template slot-scope="{ row, index }" slot="action">
            <Tooltip content="说明文档" placement="bottom">
                <span class="documentIcon" @click="show(row,index)" style="margin-right:10px"></span>
            </Tooltip>
            <Tooltip content="购物车" placement="bottom">
                <span class="cartIcon" @click="remove(row,index)" :id="`target-${row.id}`" ></span>
            </Tooltip>
          </template>
        </Table>
        <div style="overflow:hidden">
          <Page :total="total" :page-size="page.size" class-name='pagination' @on-change="changepage"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { fetchSubclass, fetchAssUseTokenData } from '_index/api/index.js'
import QueryBlcok from '../query-block'
export default {
  components: {
    QueryBlcok
  },
  data () {
    return {
      count  : 0,
      single : false,
      columns: [
        {
          title: '服务名称',
          key  : 'name'
        }, {
          title: '版本号',
          width: 100,
          key  : 'version'
        }, 
        // {
        //   title: '服务商',
        //   key  : 'serviceName'
        // }, 
        {
          title: '所属分类',
          key  : 'subclassName',
          width: 200
        }, {
          title: '发布时间',
          width: 200,
          key  : 'createTime'
        }, {
          title: '操作',
          width: 120,
          key  : 'control',
          slot : 'action'
         
        }
      ],
      dataList   : [],
      pageSize   : 10, //每页显示多少条
      dataCount  : 0, //总条数
      pageCurrent: 1, //当前页
      checkedList: [],
      page       : {
        current : 1,
        size    : 10,
        subclass: '',
        name    : '',
        isApply : true,
        state   : 1
      },
      total       : 0,
      cloudAppSide: []
    }
  },
  mounted () {
    this.getData()
    this.getSubclass()
  },
  methods: {
    //说明文档
    show (params) {
      this.$router.push({ path: `/productDoc/${params.id}`, query: { type: 'cloudApp' } })
    },
    remove (params) {
      console.log(params, 'params')
      this.$emit('addCart', params.id, 2)
    },
    //获取所属分类
    getSubclass () {
      fetchSubclass('CloudApp').then(res => {
        if (res.code === 0) {
          this.cloudAppSide = res.data.map(item => {
            return {
              value: item.id,
              label: item.title
            }
          })
          this.getData()
        } else {
          this.cloudAppSide = []
        }
      })
    },
    //获取DaaS列表
    getData () {
      fetchAssUseTokenData(this.page, 'cloudApp').then(res => {
        if (res.code === 0) {
          this.dataList = res.data.records.map(item => {
            return {
              id          : item.id,
              name        : item.shortName,
              createTime  : item.createTime,
              version     : item.version,
              subclassName: item.subclassName
            }
          })
          this.total = res.data.total
        } else {
          this.dataList = []
        }
      })
    },
    changepage (index) {
      console.log(index, 'index')
      this.page.current = index
      this.getData()

    },
    onRowClick (row, index) {
      console.log(row, index)
    },
    tableSlect (selection, isInit) {
      console.log(selection, isInit)
      this.count = selection.length
      if (selection.length > 0) {
        this.single = true
      } else {
        this.single = false
      }
    },
    handleSelecedAll (value) {
      console.log(value, '22')
      if (value) {
        this.count = this.dataList.length
        this.single = true
      } else {
        this.count = 0
        this.single = false
      }
      this.$refs.selection.selectAll(value)
    },
    onSearch (form) {
      this.page.name = form.name,
      this.page.subclass = form.object[0]
      this.getData()
    }
  }
  
}
</script> 