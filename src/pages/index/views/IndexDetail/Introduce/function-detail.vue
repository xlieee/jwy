<template>
  <div class="modalMain">
    <div class="modal-head">
      <p class="modal-title">功能详情</p>
      <p class="modal-description">详细的功能说明</p>
    </div>
    <div
      v-for="(subList,index) of handleData(funcData)"
      :key="index"
      class="modal_content-list-group">
        <ul class="modal_content-list">
          <li 
            v-for="(item,num) of subList" 
            :class="item.id === curId ? 'active': ''" 
            :key="item.id"
            @click="handleClick(item,index,num)"
            class="content-item">
            <div
              class="sub-class-bg"
              >
              <img
                class="sub-service-img"
                :src="require(`../../../assets/img/introduce_${num}.png`)"
                alt=""
              >
              
            </div>
            <div class="sub-text">
              <p class="title"><span>{{item.name}}</span><i></i></p>
              <p class="desc" v-html="changeText(item.description)"></p>
            </div>
          </li>
          <div class="indicator-triangle" :style="`left:calc((100% / 3) * ${num} / 2)`"></div>
        </ul>
      <div 
        v-show="curId&&index === coordinate[0]"
        :class="index === coordinate[0] ? `nth${coordinate[1]}`:''"
        class="content-item-detail clear">
        <p v-html="description"></p>
      </div>
      
    </div>
  </div>
</template>
<script>
export default {
  props: {
    funcData: {
      type   : Array,
      default: () => []
    }
  },
  data () {
    return {
      list       : [],
      curId      : '',
      coordinate : [0, 0],
      description: '',
      num        : 0
    }
  },
  methods: {
    handleData (stateType) {
      return stateType.reduce((ret, cur, index) => {
        const coordinate_0 = ~~(index / 3)
        ret[coordinate_0] = ret[coordinate_0] || []
        ret[coordinate_0].push(cur)
        return ret
      }, [])
    },
    handleClick (item, row, column) {
      if (item.id === this.curId) {
        this.curId = ''
      } else {
        this.num = column * 2 + 1
        this.curId = item.id,
        this.coordinate = [row, column]
        this.description = item.moreDescription || '暂无描述'

      }
    },
    changeText (value) {
      if (value.length > 30) {
        return value.slice(0, 30) + '...'
      } else {
        return value
      }
    }
  }
}
</script>