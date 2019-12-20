<template>
  <div>
    <div class="tabList">
      <!-- <dl v-for="(item,index) in list" :key="index">
        <dt><img :src="item.img" alt=""></dt>
        <dd>
          <p>{{item.title}}</p>
          <p>{{item.descript}}</p>
        </dd>
      </dl> -->
      <dl v-for="(item,index) in list" :key="index" @click="onClick(item)">
        <dt><img :src="item.image" alt=""></dt>
        <dd>
          <p class="title">{{item.title}}</p>
          <p v-html="item.description"></p>
        </dd>
      </dl>
    </div>
    
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type   : Array,
      default: () => []
    }
  },
  methods: {
    onClick (row) {
      if (row.url) {
        window.open(row.url)
      } else {
        this.$router.push({ path: '/indexDetail/' + row.id, query: { type: 'cloudApp' } })
      }
    }
  }
  
}
</script>