<template>
  <div class="message">
    <Table
      ref="selection"
      class="message-table"
      :columns="columns"
      :data="tableData"
      @on-select="handleSelect"
      @on-select-cancel="handleCancel"
      @on-select-all="handleSelectAll"
      @on-select-all-cancel="handleSelectAll"
    >
      <template slot-scope="{ row }" slot="content">
        <span><i :style="`backgroundColor:${!row.read?'#FF0000':''}`" class="no-read"></i>{{row.content}}</span>
      </template>
      <template slot-scope="{ row }" slot="action">
        <Tooltip content="编辑" placement="bottom">
            <span class="editIcon" @click="show(row)"></span>
        </Tooltip>
        <Tooltip content="删除" placement="bottom">
            <span class="deleteIcon" @click="remove(row)"></span>
        </Tooltip>
      </template>
    </Table>

    <div class="message-footer">
      <div class="btnGroup">
        <span @click="onRead">标记为已读</span>
        <span @click="removeMore">删除</span>
        <span @click="readAll">全部已读</span>
        <span @click="removeAll">全部删除</span>
      </div>
      <Page :total="total" @on-change="changePage" class-name='pagination' style="margin-top:25px"></Page>
    </div>
    <WorkModal :title="message.createTime" 
      :modalText='modalText' 
      :permission="detailModal" 
      @cancel='handleClose' 
      type='detailModal'/>
    <WorkModal title="提示" 
      modalText='您确认要删除数据吗？删除数据后不可恢复，请谨慎操作!' 
      :permission="deleteModal" 
      @cancel='handleClose' 
      @ok='deleteOk'
      type='deleteModal'/>
  </div>
</template>
<script>
import WorkModal from '../modal'
import { fetchMessage, asyncDeleteMessage, asyncReadMessage, asyncReadAllMessage, asyncDeleteAllMessage } from '_index/api/work.js'
export default {
  components: {
    WorkModal
  },
  data () {
    return {
      columns: [
        {
          type : 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '内容',
          key  : 'content',
          slot : 'content'
        },
        {
          title: '时间',
          key  : 'createTime',
          width: 180
        }, {
          title: '操作',
          width: 120,
          key  : 'control',
          slot : 'action'
        }
      ],
      tableData: [],
      total    : 0,
      page     : {
        current: 1,
        size   : 10
      },
      selectedIds: new Set(),
      selectedSum: 0, //选中的总数量
      message    : {
        createTime: '',
        content   : '',
        id        : ''
      },
      detailModal: false,
      deleteModal: false,
      modalText  : ''
    }
  },
  created () {
    this.getMessageList()
  },
  methods: {
    handleClose (modal) {
      console.log(modal, 'modal')
      this[modal] = false
    },
    handleSelectAll (selection) {
      if (selection.length === 0) {
        // cy 若取消全选，删除保存在selectedIds里和当前table数据的id一致的数据，达到，当前页取消全选的效果
        // 当前页的table数据
        let data = this.$refs.selection.data
        data.forEach((item) => {
          if (this.selectedIds.has(item.id)) {
            this.selectedIds.delete(item.id)
          }
        })
      } else {
        selection.forEach(item => {
          this.selectedIds.add(item.id)
        })
      }
      //同步
      this.selectedSum = this.selectedIds.size
    },
    handleSelect (slection, row) {
      this.selectedIds.add(row.id)
    },
    handleCancel (sleection, row) {
      this.selectedIds.delete(row.id)
    },
    //  这个函数就放在你点击翻页的函数里就行了（需要注意要在table将数据渲染完毕后执行，否则报错），
    //  达到每次翻页加载时将以前选中的row勾选上的效果
    // cy 给跨页丢失的选中行重新添加选中状态
    setChecked () {
      // 找到绑定的table的ref对应的dom，找到table的objData对象，objData保存的是当前页的数据
      let objData = this.$refs.selection.objData
      console.log(objData, 'objData')
      for (let index in objData) {
        if (this.selectedIds.has(objData[index].id)) {
          objData[index]._isChecked = true
        }
      }
    },
    changePage (pageIndex) {
      console.log(pageIndex, 'pageIndex')
      //分页逻辑 --- start
      this.tableData = []
      this.page.current = pageIndex
      this.getMessageList()
      //分页逻辑 --- end
      setTimeout(() => {
        this.setChecked()
      }, 500)
    },
    getMessageList () {
      fetchMessage(this.page).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.records
          this.total = res.data.total
        } else {
          this.tableData = []
          this.total = 0
        }
      })
    },
    show (row) {
      const { message } = this
      Object.keys(message).forEach(item => {
        message[item] = row[item]
      })
      this.modalText = row.content
      this.detailModal = true
    },
    //删除单条数据
    remove (row) {
      const { message } = this
      Object.keys(message).forEach(item => {
        message[item] = row[item]
      })
      this.deleteModal = true
    },
    //批量删除
    removeMore () {
      console.log(this.selectedIds, Array.from(this.selectedIds).join(','), 'selectedIds')
      const { selectedIds, message } = this
      if (selectedIds.size === 0) {
        this.modalText = '请勾选数据'
        this.detailModal = true
      } else {
        this.modalText = ''
        message.id = Array.from(selectedIds).join(',')
        this.deleteModal = true
      }
    },
    //全部删除
    removeAll () {
      this.message.id = ''
      this.deleteModal = true
    },
    //批量已读
    onRead () {
      const { selectedIds } = this
      asyncReadMessage(Array.from(selectedIds).join(',')).then(res => {
        if (res.code == 0) {
          this.$Message.success(res.msg)
          this.getMessageList()
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    //全部已读
    readAll () {
      asyncReadAllMessage().then(res => {
        if (res.code === 0) {
          this.$Message.success(res.msg)
          this.getMessageList()
          this.$emit('getList')
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    deleteOk () {
      if (this.message.id) {
        asyncDeleteMessage(this.message.id).then(res => {
          if (res.code === 0) {
            this.$Message.success(res.msg)
            this.getMessageList()
            this.deleteModal = false
            if (this.selectedIds.size > 0) {
              let arr = this.message.id.split(',')
              arr.forEach((item) => {
                if (this.selectedIds.has(item.id)) {
                  this.selectedIds.delete(item.id)
                }
              })
            }
          } else {
            this.$Message.error(res.msg)
          }
        })
      } else {
        asyncDeleteAllMessage().then(res => {
          if (res.code === 0) {
            this.$Message.success(res.msg)
            this.getMessageList()
            this.deleteModal = false
          } else {
            this.$Message.error(res.msg)
          }
        })
      }
    }
  }
}
</script>