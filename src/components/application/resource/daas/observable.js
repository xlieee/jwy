import Vue from 'vue'

export default {
  state: Vue.observable({
    viewName    : '',
    resource    : {},
    approval    : [],
    feedback    : [],
    biz         : {},
    processSteps: []
  }),
  setState (key, value) {
    this.state[key] = value
  }
}