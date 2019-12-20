<template>
  <div 
    style="minWidth: 500px" 
    v-show="hasInit"
    :class="['tinymce-modal',{'fix__mce-tooltip': isFullscreen}]">
    <textarea :id="readOnlyOptions.tinymceId"></textarea>
  </div>
</template>
<script>
const GLOBAL = {
  collection   : [],
  scriptCreated: false,
  run (initTinymce) {
    this.collection.push(initTinymce)
    const scriptId = 'tinymce_js'
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.src = '/static/vendor/tinymce/tinymce.min.js'
      script.id = scriptId
      script.onload = () => {
        this.scriptCreated = true
        while (this.collection.length) {
          this.collection.shift()()
        }
      }
      document.body.appendChild(script)
    } else {
      if (this.scriptCreated) {
        while (this.collection.length) {
          this.collection.shift()()
        }
      }
    }
  }
}

export default {
  props: {
    minHeight: {
      type   : [Number, String],
      default: 120
    },
    action: {
      type: String
    },
    baseUrl: {
      type   : String,
      default: ''
    },
    folder: {
      type   : String,
      default: ''
    },
    value: {
      type: String
    },
    textOnly: Boolean
  },
  data () {
    let readOnlyOptions
    if (this.textOnly) {
      readOnlyOptions = Object.freeze({
        tinymceId: `vue-tinymce-${this._uid}`
      })
    } else {
      readOnlyOptions = Object.freeze({
        tinymceId: `vue-tinymce-${this._uid}`,
        folder   : this.folder,
        baseUrl  : this.baseUrl,
        action   : this.action
      })
    }
    return {
      hasInit             : false,
      readOnlyOptions,
      isDynamicChangeValue: false,
      isFullscreen        : false
    }
  },
  watch: {
    value (newVal) {
      if (!this.isDynamicChangeValue && this.hasInit) {
        this.setTextContent(newVal)
      }
    },
    isFullscreen () {} // 处理137行处isFullscreen无法响应bug
  },
  mounted () {
    GLOBAL.run(this.initTinymce)
    if (!this.textOnly) {
      this.imagesUploadHandler = (blobInfo, success, failure) => {
        const { action, folder } = this.readOnlyOptions
        //上传图片
        let xhr = ''
        let formData = ''
        xhr = new XMLHttpRequest()
        // xhr.withCredentials = false
        xhr.open('POST', action)
        xhr.setRequestHeader('access_token', localStorage.getItem('token'))
        formData = new FormData()
        formData.append('image', blobInfo.blob())
        formData.append('folder', folder)
        xhr.onload = () => {
          let json = {}
          if (xhr.status !== 200) {
            return failure('上传出错!')
          }
          json = JSON.parse(xhr.responseText)
          success(json.data.url)
        }
        xhr.send(formData)

      }
    } else {
      this.images_upload_handler = () => {}
    }
  },
  // activated () {
  //   if (this.isFullscreen) {
  //     window.tinymce.get(this.readOnlyOptions.tinymceId).execCommand('mceFullScreen')
  //   }
  // },
  methods: {
    setTextContent (value) {
      window.tinymce.get(this.readOnlyOptions.tinymceId).setContent(value || '')
    },
    initTinymce () {
      const { tinymceId } = this.readOnlyOptions
      const toolbar = this.textOnly 
        ? ['searchreplace bold italic underline alignleft aligncenter alignright outdent indent code preview forecolor fontsizeselect fontselect fullscreen']
        : ['searchreplace bold italic underline alignleft aligncenter alignright outdent indent  blockquote undo redo  code codesample hr bullist numlist link image charmap preview insertdatetime media table forecolor fontsizeselect fontselect fullscreen'] 
      this.$nextTick(() => {
        window.tinymce.init({
          selector        : `#${tinymceId}`,
          baseURL         : '/static/vendor/tinymce',
          suffix          : '.min',
          language_url    : '/static/vendor/tinymce/zh_CN.js',
          max_height      : 500,
          min_height      : this.minHeight,
          object_resizing : false, // 禁用所有图像/表格的大小调整 可能的值： true，false，img
          menubar         : false,
          fontsize_formats: '10px 12px 14px 18px 24px 36px',
          plugins         : ['advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools insertdatetime link lists media nonbreaking noneditable  paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars '],
          toolbar,
          branding        : false,
          // 处理上传图片为绝对路径（默认会处理成相对路径，即不带ip）
          // convert_urls    : false,
          // relative_urls   : false,
          
          end_container_on_empty_block: true, // 如果在空内部块元素内按下回车键，则此选项允许您拆分当前容器块元素
          powerpaste_word_import      : 'clean', // 过滤从Microsoft Word粘贴的内容(clean - 保留内容的结构，例如标题，表格和列表，但删除内联样式和类   merge - 保留原始文档的内联格式和结构)
          code_dialog_height          : 450, // version 4x
          code_dialog_width           : 1000, // version 4x
          advlist_bullet_styles       : 'square',
          advlist_number_styles       : 'default',
          default_link_target         : '_blank',
          link_title                  : false,
          statusbar                   : false, // 编辑器底部的状态栏
          nonbreaking_force_tab       : true,
          images_upload_handler       : this.imagesUploadHandler,
          init_instance_callback      : editor => {
            if (this.value) {
              editor.setContent(this.value)
            }
            this.hasInit = true
            this.$emit('tinymce-inited')
            /** 
             * NodeChange:当编辑器内的选择发生变化时，将触发此事件
             * Change: 当在编辑器内进行更改以导致添加撤消级别时，将触发此事件
             * SetContent: 将内容插入编辑器后会触发此事件
             */
            editor.on('NodeChange Change KeyUp SetContent', () => {
              this.isDynamicChangeValue = true
              this.$emit('input', editor.getContent())
              window.tinymce.triggerSave()
            })
          },
          setup: editor => {
            editor.on('FullscreenStateChanged', e => {
              this.isFullscreen = e.state
            })
          }
        })
      })
    },
    destroy () {
      const tinymce = window.tinymce.get(this.readOnlyOptions.tinymceId)
      this.isFullscreen && tinymce.execCommand('mceFullScreen')
      tinymce && tinymce.destroy()
    }
  }
}
</script>
<style lang="scss">
.tinymce-modal{
  &.fix__mce-tooltip {
    .mce-tooltip {
      transform: translateY(45px);
    }
  }
  .mce-tinymce {
    box-sizing: border-box !important;
  }
  .mce-panel{
    border-color: #dcdee2;
  }
}
</style>