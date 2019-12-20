<template>
  <Card :bordered="false" dis-hover>
    <p slot="title">{{data.title}}</p>
    <Button 
      v-show="data.rootNodeBtnShow"
      slot="extra"
      size="default" 
      @click="onClickAddBtn('root-node','新增根节点')"
      type="primary">新增根节点</Button>
    <div style="padding: 20px">
      <content-form 
        ref="formRef"
        :form="data.form" />
        <form-modal 
          :modal="modal"
          :width="$lt?700:900"
          @on-emit="onFormModalEmited">
          <content-form 
            ref="modalForm"
            :form="modalForm" />
        </form-modal>

        <div style="padding-left:112px" v-show="data.selectedId">
          <Button 
            @click="onEmit('on-save',{
              ...data.form,
              pid: data.selectedPid,
              pvalue: data.selectedPvalue,
              id: data.selectedId
            })"
            :loading="data.btnLoading"
            type="primary"
            style="margin:0 16px 6px 0">保存修改</Button>
          <Button 
            @click="onEmit('on-del',{
              url: `/sys/dict/delete/${data.selectedId}`,
              hasChild: data.hasChild,
              name:'节点'
            })"
            style="margin:0 16px 6px 0">删除节点</Button>
          <Button
            v-show="data.childNodeBtnShow"
            @click="onClickAddBtn('child-node','新增子节点')"
            type="primary"
            style="margin:0 16px 6px 0">新增子节点</Button>
        </div>
      </div>
  </Card>
</template>
<script>
import FormModal from '_admin/components/form-modal'
import ContentForm from './content-form'
import { contentMixins } from '_admin/mixins/like-sys-dict'
export default {
  components: {
    FormModal,
    ContentForm
  },
  mixins: [contentMixins],
  props : {
    data: {
      type: Object
    }
  },
  data () {
    const modalForm = JSON.parse(JSON.stringify(this.data.form))
    return {
      // ModalForm
      modalForm,

      // FormModal
      modal: {
        show      : false,
        btnLoading: false,
        title     : ''
      },
      clickNodeType: 'child-node',
      rules        : {
        name: { required: true, message: '节点名称不能为空' },
        sort: { required: true, message: '节点排序不能为空' }
      }
    }
  },
  mounted () {
    const formRef = this.$refs.formRef
    this.validate = formRef.validate
    this.resetFields = formRef.resetFields
  }
}
</script>