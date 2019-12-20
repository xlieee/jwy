<template>
  <div 
    :style="{ 
      display: inline ? 'inline-block': 'block',
      marginRight: margin ? '20px': 0,
      width: (width < 120 ? 120 : width) +'px' 
    }" 
    class="form-item-container">
    <div class="label">
      <i v-if="required" class="required">*</i>
      <span class="name">{{ label }}</span>
      <!-- <Poptip v-if="content" word-wrap width="200" :content="content"><i class="icon_question-mark"></i></Poptip> -->
    </div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    inline: {
      type   : Boolean,
      default: false
    },
    margin: {
      type   : Boolean,
      default: false
    },
    width   : String,
    label   : String,
    required: {
      type   : Boolean,
      default: false
    },
    content: String
  }
}
</script>
<style lang="scss">
.form-item-container {
  position: relative;
  width: 100%;
  margin-top: 10px;
  .label {
    margin-bottom: 4px;
    font-size: 14px;
    line-height: 20px;
    float: left;
  }
  .required {
    float: left;
    position: relative;
    top: 2px;
    width: 12px;
    color: #EE534B; 
  }
  .name {
    flex-shrink: 0;
    margin-right: 10px;
    color: #303133;
  }
}
</style>
