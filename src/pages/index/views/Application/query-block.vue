<template>
  <div class="application-control">
    <div class="application-control-search">
      <Form ref="form" :model="form">
        <Row>
          <i-col span="8">
            <FormItem prop="name" label='服务名称：' :label-width="108">
                <Input type="text" v-model="form.name" placeholder="请输入服务名称进行搜索" clearable/>
                
            </FormItem>
          </i-col>
            <i-col span="8">
            <FormItem prop="object" label='所属分类：' :label-width="108">
              <Cascader v-model="form.object" :data="aasSide" change-on-select></Cascader>
              <!-- <Select >
                  <Option v-for="item in aasSide" :value="item.id" :key="item.id">{{item.title}}</Option>
              </Select> -->
            </FormItem>
          </i-col>
          <i-col span="4">
            <span class="searchBtn" @click="$emit('on-search',form)">查询</span>
          </i-col>
        </Row>
      </Form>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    aasSide: {
      type   : Array,
      default: () => []
    }
  },
  data () {
    return {
      form: {
        name  : '',
        object: []
      }
    }
  }
}
</script>