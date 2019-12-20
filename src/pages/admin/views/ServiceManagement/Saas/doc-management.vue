<template>
  <div class="service_doc-management">
    <Row>
      <i-col span="7">
        <Card 
          ref="left-card"
          :bordered="false" 
          dis-hover
          class="left">
          <p 
            slot="title"
            title="广东科信人车伴随产品说明文档广东科信人车伴随产品说明文档"
            class="title-fix">广东科信人车伴随产品说明文档广东科信人车伴随产品说明文档</p>
          <div class="doc-dir">
            <div class="item title">
              <span class="item-title">文档目录</span>
              <span 
                @click="onClickAction('doc','add')"
                class="item-icon"><i class="icon-sprites-small icon-add-small"></i>新增</span>
            </div>
            <div style="position:relative">
              <ul class="list">
                <li
                  v-for="(item,index) of docList"
                  :key="item.id"
                  class="item">
                  <span
                    @click="onClickName('doc',item.id,index)"
                    class="item-title" 
                    :title="item.name"
                    :class="{'item-title--active': curDocId === item.id}">{{item.name}}</span>
                  <span class="item-icon">
                    <i
                      v-for="icon of iconList"
                      :key="icon.action"
                      @click="onClickAction('doc',icon.action,item.id,index)" 
                      :title="icon.title" 
                      :class="[
                        'icon-sprites-small',
                        `icon-${icon.action}-small`,
                        {'not-allowed':checkNotAllowed(icon.action,index,'doc')}
                      ]" ></i>
                  </span>
                </li>
              </ul>
              <Spin size="default" fix v-show="docLoading"></Spin>
            </div>
          </div>
          <div class="annex">
            <div class="item title">
              <span class="item-title">附件</span>
            </div>
            <div style="position:relative">
              <ul class="list">
                <li
                  v-for="(item,index) of annexList"
                  :key="item.id"
                  class="item">
                  <span
                    @click="onClickName('annex',item.url)"
                    class="item-title" 
                    :title="item.name">{{item.name}}</span>
                  <span class="item-icon">
                    <i
                      v-for="icon of iconList"
                      :key="icon.action"
                      @click="onClickAction('annex',icon.action,item.id,index)" 
                      :title="icon.title" 
                      :class="[
                        'icon-sprites-small',
                        `icon-${icon.action}-small`,
                        {'not-allowed':checkNotAllowed(icon.action,index,'annex')}
                      ]" ></i>
                  </span>
                </li>
              </ul>
              <Spin size="default" fix v-show="annexLoading"></Spin>
            </div>
            <upload-file 
              folder="saas"
              @on-success="onUploadSuccess"
              #default="{disabled}"
              style="margin: 10px 0 5px 0;">
              <Button type="primary">
                <Icon type="md-arrow-round-up" class="icon-btn-upload" />上传文件{{disabled ? '中...': ''}}
              </Button>
            </upload-file>
            <p>支持扩展名：.rar .zip .doc .docx .pdf .jpg...</p>
          </div>
        </Card>
      </i-col>
      <i-col span="17">
        <Card
          ref="card2"
          :bordered="false" 
          dis-hover
          class="right">
          <p slot="title">{{curDocId?'文档详情':'新增文档'}}</p>
          <Form 
            ref="formRef" 
            :model="form"
            :rules="rules">
            <FormItem 
              label="名称："
              :label-width="$calcLabelWidth('名称：',{isRequired:true})"
              prop="name">
              <Input 
                v-model="form.name"
                maxlength="50" 
                show-word-limit
                placeholder="请输入名称" />
            </FormItem>
            <FormItem 
              label="正文：" 
              :label-width="$calcLabelWidth('正文：',{isRequired:true})" 
              prop="content"
              class="textarea-label-fix"
              style="width:100%;height: calc(100vh - 368px)">
              <Tinymce 
                v-model="form.content"
                ref="tinymce"
                class="tinymce-fix"
                v-on="$listeners"
                :base-url="$baseUrl"
                folder="saas"
                :action="`${$baseUrl}/fileStore/uploadImage`"></Tinymce>
            </FormItem>
          </Form>
        </Card>
        <div class="custom-btn-group shadow">
          <Button
            @click="onClickBtn('cancel')"
            class="btn btn-cancel">取消</Button>
          <Button
            @click="onClickBtn('ok')"
            class="btn btn-ok">保存</Button>
        </div>
      </i-col>
    </Row>
    
  </div>
</template>
<script>
import Tinymce from '_admin/components/tinymce'
import UploadFile from '@/components/upload-file'

import { toolDownloadFile } from '@/libs/tool'
import {
  updateDocService,
  updateDocSortService
} from '_admin/api/service'
export default {
  name      : 'doc-management',
  components: {
    Tinymce,
    UploadFile
  },
  props: {
    sourceType: Number,
    id        : String
  },
  data () {
    return {

      form: {
        name   : '',
        content: ''
      },
      
      curDocId: '',

      annexLoading: false,
      docLoading  : false,
      
      iconList: [
        { action: 'moveup', title: '上移' },
        { action: 'movedown', title: '下移' },
        { action: 'del', title: '删除' }
      ],

      docList  : [],
      annexList: [],
      
      rules: {
        name   : { required: true, message: '标题不能为空' },
        content: { required: true, message: '正文不能为空' }
      }
    }
  },
  computed: {
    docListLastIndex () {
      return this.docList.length - 1
    },
    annexListLastIndex () {
      return this.annexList.length - 1
    }
  },
  mounted () {
    const $refs = this.$refs
    this.resetFields = $refs.formRef.resetFields
    this.setTextContent = $refs.tinymce.setTextContent
  },
  methods: {
    onClickBtn (type) {
      const { $refs, resetFields } = this
      if (type === 'cancel') {
        resetFields()
        $refs.tinymce.setTextContent()
      } else {
        $refs.formRef.validate(vaild => {
          if (vaild) {
            const copyForm = JSON.parse(JSON.stringify(this.form))
            copyForm.type = 0
            if (this.curDocId) {
              copyForm.id = this.curDocId
            }
            
            this.updateDocService(copyForm)
          }
        })
      }
    },
    updateDocService ({ id, name, content, type, fileId }, customMsg) {
      const { sourceType, id:serviceId } = this
      updateDocService({
        id, type, name,
        sourceType, 
        serviceId,   
        content, fileId
      }).then(res => {
        const { code, msg } = res
        if (code === 0) {
          this.$emit('on-success', { type: 'doc-management' })
          this.$Message.success(customMsg || msg || '操作成功！')
        } else {
          this.$Message.error(msg)
        }
      })
    },
    checkNotAllowed (action, index, type = 'doc') {
      if (action === 'moveup') {
        if (index === 0) {
          return true
        }
      }
      if (action === 'movedown') {
        if (index === this[`${type}ListLastIndex`]) {
          return true
        }
      } 
      return false
    },
    handleRight ({ name, content }) {
      const { name:curName, content:curContent } = this.form
      const $refs = this.$refs
      if (curName && curContent) {
        $refs.formRef.resetFields()
      }
      this.$nextTick(() => {
        this.form.name = name
        this.form.content = content
        $refs.tinymce.setTextContent(content)
      })
    },
    onClickName (type, id, index) {
      if (type === 'doc') {
        if (this.curDocId === id) {
          this.curDocId = ''
        } else {
          this.curDocId = id
          const { name, content } = this.docList[index]
          this.handleRight({ name, content })
        }
      } else {
        toolDownloadFile({ url: id, target: '_blank' })
      }
    },
    onClickAction (type, action, id, index) {
      const isDoc = type === 'doc'
      if (action === 'add') {
        if (isDoc) {
          this.curDocId = ''
          this.handleRight({})
        } 
      } else if (action === 'del')  {
        this.handleDelActionAsync({
          url    : `/srm/document/delete/${id}`,
          msg    : `是否确认删除此${isDoc ? '文档' : '附件'}?`,
          success: () => this.$emit('on-success', { type: 'doc-management' })
        })
      } else {
        if (!this.checkNotAllowed(action, index, type)) {
          this[isDoc ? 'docLoading' : 'annexLoading'] = true
          const nextId = this[isDoc ? 'docList' : 'annexList'][action === 'moveup' ? index - 1 : index + 1].id

          updateDocSortService(id, nextId).then(res => {
            this[isDoc ? 'docLoading' : 'annexLoading'] = false
            const { code, msg } = res
            if (code === 0) {
              this.$emit('on-success', { type: 'doc-management' })
              this.$Message.success(`${isDoc ? '文档' : '附件'}排序调整成功！`)
            } else {
              this.$Message.error(msg)
            }
          })
        }
      }
    },
    onUploadSuccess (response) {
      const { code, data, msg } = response
      if (code === 0) {
        const { id, originName:name } = data
        this.updateDocService({
          fileId: id,
          name  : name.substr(0, name.lastIndexOf('.')),
          type  : 1
        }, '上传文件成功！')
      } else {
        this.$Message.error(msg)
      }
    }
  }
}
</script>
<style lang="scss">
.service_doc-management {
  .ivu-col {
    height: calc(100vh - 120px);
  }
  // .transition {
  //   transition: all 300ms linear;
  // }
  .left {
    height: 100%;
    background-color: #F0F6FE;
    .ivu-card-body {
      padding: 10px 0;
    }
  }
  .doc-dir,
  .annex {
    padding: 0 16px 10px;
    .title {
      padding: 10px 0;
      font-weight: 600;
      font-size: 15px;
      .item-icon {
        cursor: pointer;
      }
    }
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
    }
  }
  .doc-dir {
    border-bottom: 1px solid #e8eaec; 
    .item {
      &-title--active {
        font-size: 16px;
        font-weight: 600;
        color: $theme-color;
        &:before {
          content: '';
          width: 16px;
          height: 2px;
          background-color: $theme-color;
        }
      }
    }
  }
  .list {
    overflow: auto;
    max-height: calc(100vh - 380px);
    @extend %scroll;
    .item {
      height: 36px;
      font-size: 15px;
      &-title {
        &:before {
          content: '';
          display: inline-block;
          margin-right: 4px;
          width: 8px;
          height: 1px;
          vertical-align: middle;
          background-color: #515a6e;
        }
      }
      &-title {
        @extend %ellipsis;
        cursor: pointer;
      }
      &-icon {
        flex-shrink: 0;
        cursor: pointer;
      }
    }
    .not-allowed {
      cursor: not-allowed;
    }
  }
  .right {
    .ivu-card-head {
      margin: 0 16px;
    }
  }
  .tinymce-fix {
    iframe {
      height: calc(100vh - 424px) !important;
    }
  }
  .shadow {
    button {
      width: 120px;
    }
    position: relative;
    padding: 16px 16px 20px 0;
    box-shadow: 0px -2px 20px 0px rgba(11,36,68,0.1);
  }
}
</style>