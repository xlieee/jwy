<template>
  <div class="home-side-list">
    <ul class="sub-type-list">
      <li
        v-for="(value, num) in sideDataList"
        :key="num"
        @click="handleClick(value)"
      >
        <a
          onclick="return false"
          href="javascript:void(0);"
          target="_blank"
        >
            <div
              class="sub-class-bg"
            >
              <img
                class="sub-service-img"
                :style="{
                  width: value.image ? '80px':'',
                  height: value.image ? '80px':''
                  }"
                :src="`${value.image}`"
                alt=""
              >
            </div>
            <div class="sub-text">
              <p class="title" v-if="value.title">{{value.title | splitByTitle(titleLength)}}</p>
              <p class="desc" v-if="value.description" v-html="changeByDescription(value.description)"></p>
              <p class="title" v-if="value.name">{{value.name}}</p>
              <p class="desc" v-if="value.count">{{value.count}}</p>
            </div>
        </a>
      </li>
    </ul>
    <PromptModal :modal-data="modalData"/>
  </div>
</template>
<script>
import PromptModal from '_index/components/prompt-modal.vue'
export default {
  components: {
    PromptModal
  },
  props: {
    sideDataList: {
      type   : Array,
      default: () => []
    },
    titleLength: {
      type   : Number,
      default: () => 10
    },
    descLength: {
      type   : Number,
      default: () => 40
    },
    type  : String,
    origin: String
  },
  data () {
    return {
      modalData: {
        type           : '',
        applyPermission: false
      }
    }
  },
  methods: {
    handleClick (row) {
      if (this.origin === 'doc') {
        this.$router.push({ path: `/productDoc/${row.id}`, query: { type: this.type } })
      } else {
        if (localStorage.token) {
          this.$router.push({ path: '/indexDetail/' + row.id, query: { type: this.type } })
        } else {
          this.modalData.type = 'no-login'
          this.modalData.applyPermission = !this.modalData.applyPermission
        }
      }
      
    },
    changeByDescription (value) {
      if (value.length < this.descLength) {
        return value
      } else {
        return value.slice(0, this.descLength) + '...'
      }
    }
  }
}
</script>