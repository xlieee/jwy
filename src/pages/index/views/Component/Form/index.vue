<template>
  <div style="padding:10px;background-color:#eee">
    <a-row :gutter="16">
      <a-col :span="8">
        <a-card title="普通" :bordered=false>
          <a-form class="ui__clear-mb">
            <a-form-item label="姓名" colon  :label-col="{ span: 6 }" :wrapper-col="{ span: 12, offset: 1  }">
              <a-input 
                defaultValue="xx"
                placeholder="name"/> 
            </a-form-item>
            <a-form-item label="年龄" colon  :label-col="{ span: 6 }" :wrapper-col="{ span: 12, offset: 1  }">
              <a-input
                v-model="age" 
                placeholder="age"/> 
            </a-form-item>
            <a-form-item label="数字" colon  :label-col="{ span: 6 }" :wrapper-col="{ span: 12, offset: 1  }">
              <a-input-number 
                :min="1" 
                :max="10" 
                v-model="inputNumber"
                style="width:100%"
                placeholder="number" /> 
            </a-form-item>
            <a-form-item label="年龄" colon  :label-col="{ span: 6 }" :wrapper-col="{ span: 12, offset: 1  }">
              <a-input
                :value="number"
                @change="onChange"
                placeholder="string number"/>
            </a-form-item>
            <a-form-item label="Tel" colon  :label-col="{ span: 6 }" :wrapper-col="{ span: 12, offset: 1  }">
              <a-input
                v-model="tel"
                @change="onChangeTel"
                placeholder="tel length is 11"/>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="表单整体作为组件" :bordered=false>
          <Simple />
        </a-card> 
      </a-col>
      <a-col :span="8">
        <a-card title="Vuex 表单" :bordered=false>
          <p>card content</p>
        </a-card>   
      </a-col>
    </a-row>
  </div>
</template>
<script>
import Simple from './simple'
export default {
  components: {
    Simple
  },
  data () {
    return {
      name       : '',
      age        : 18,
      inputNumber: 1,
      number     : '',
      tel        : ''
    }
  },
  methods: {
    onChangeTel (e) {
      const value = e.target.value.replace(/^0|[^\d]+/, '')
      this.tel = value.substr(0, 11) 
    },
    onChange (e) {
      // 正整数
      // 1
      //const value = e.target.value.replace(/^0|[^\d]+/, '')
      //this.number = Number(value) || ''
      // 2
      // const value = parseInt(e.target.value||0, 10)
      // if (!isNaN(value)) {
      //   this.number = value === 0 ? '' : value
      // }
      // 字符串数字
      const { value } = e.target
      const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/
      if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
        this.number = Number(value)
      }
    }
  }
}
</script>