<template>
  <div class="unitModal">
    <div class="modalMain">
      <p class="unit-title">责任单位</p>
      <div class="unit-item">
        <span>建设单位：{{dataInfo.constructionUnit}}</span>
        <span>联系人：{{dataInfo.constructionPerson}}</span>
        <span>联系电话：{{dataInfo.constructionPhone}}</span>
      </div>
      <div class="unit-item">
        <span>责任单位：{{dataInfo.buildUnit}}</span>
        <span>联系人：{{dataInfo.buildPerson}}</span>
        <span>联系电话：{{dataInfo.buildPhone}}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    dataInfo: {
      type   : Object,
      default: () => {}
    }
  }
}
</script>