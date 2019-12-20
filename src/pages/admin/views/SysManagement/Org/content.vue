<template>
  <Card :bordered="false" dis-hover>
    <p slot="title">{{data.title}}</p>
    <div style="padding: 20px">
      <content-form 
        ref="formRef"
        :form="data.form" />
        <form-modal 
          :modal="modal"
          :width="$lt?720:840"
          @on-emit="onFormModalEmited">
          <content-form 
            ref="modalForm"
            :form="modalForm" />
        </form-modal>

        <div style="padding-left:80px" v-show="data.selectedId">
          <Button 
            @click="onEmit('on-save',{
              ...data.form,
              pid: data.selectedPid,
              id: data.selectedId
            })"
            :loading="data.btnLoading"
            type="primary"
            style="margin:0 16px 6px 0">保存修改</Button>
          <Button 
            v-show="!hideDel"
            @click="onEmit('on-del',{
              url: `/sys/org/delete/${data.selectedId}`,
              hasChild: data.hasChild,
              name:'组织'
            })"
            style="margin:0 16px 6px 0">删除组织</Button>
          <Button
            v-show="data.childNodeBtnShow"
            @click="onClickAddBtn('child-node','新增下级组织')"
            type="primary"
            style="margin:0 16px 6px 0">新增下级组织</Button>
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
    },
    hideDel: Boolean
  },
  data () {
    const modalForm = JSON.parse(JSON.stringify(this.data.form))
    return {
      // ModalForm
      modalForm,

      // FormModal
      modal: {
        show : false,
        title: ''
      },
      clickNodeType: 'child-node',
      rules        : {
        name: { required: true, message: '组织名称不能为空' },
        sort: { required: true, message: '排序不能为空' }
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