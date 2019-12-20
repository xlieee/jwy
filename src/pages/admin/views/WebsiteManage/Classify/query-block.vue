<template>
  <Card :bordered="false" dis-hover>
    <div class="query-block">
      <span class="label">名称：</span>
      <Input 
        v-model="query.name"
        style="width:270px"
        placeholder="请输入名称进行查询"/>
    </div>
    <div class="query-block">
      <span class="label">分类：</span>
      <Select 
        v-model="query.classification"
        style="width:270px"
        clearable
        placeholder="请选择分类">
        <Option 
          v-for="(item,index) in docTypeList" 
          :value="item.id" 
          :key="index">{{ item.name }}</Option>
      </Select>
    </div>
    <div class="query-block">
      <span class="label">状态：</span>
      <Select 
        v-model="query.state"
        style="width:270px"
        clearable
        placeholder="请选择状态">
        <Option 
          v-for="(item,index) in newsStatus" 
          :value="item.value" 
          :key="index">{{ item.name }}</Option>
      </Select>
    </div>
    <div style="display:inline-block">
      <Button 
        @click="onClickQuery"
        style="margin:0 20px 0 70px;width:88px;"
        type="primary">查 询</Button>
      <Button 
        @click="onClickAdd"
        type="primary" 
        ghost><Icon type="md-add" />新增文档</Button>
    </div>
  </Card>
</template>
<script>
import { 
  fetchDocumentTypeList
} from '_admin/api/website'
export default {
  props: {
    query: {
      type: Object
    },
    onClickQuery: {
      type: Function
    },
    onClickAdd: {
      type: Function
    }
  },
  mounted () {
    this.getDocTypeList()
  },
  data () {
    return {
      newsStatus: [
        { name: '已上线', value: 1 },
        { name: '待上线', value: 0 }
      ],
      docTypeList: []
    }
  },
  methods: {
    getDocTypeList () {
      fetchDocumentTypeList().then(res => {
        console.log(res)
        if (res.code === 0) {
          this.docTypeList = res.data.map((item) => {
            return {
              id  : item.id,
              name: item.name
            }
          })
        } else {
          this.docTypeList = []
        }

      })
    }
  }
}
</script>