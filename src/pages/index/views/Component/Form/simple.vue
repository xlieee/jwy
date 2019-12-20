<template>
  <div>
    <a-form>
      <a-form-item>
        <a-input
          v-model="input1"
          palceholder="input"/>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      input1: ''
    }
  }
}
</script>
