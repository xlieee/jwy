<template>
  <div>
    <Form 
      ref="formRef" 
      :model="form"
      :rules="rules"
      style="padding:0 20px">
      <Row :gutter="16"><div class="form-title">流程信息</div></Row>
      <Row :gutter="16">
        <i-col span="16">
          <FormItem 
            label="流程名称："
            :label-width="$calcLabelWidth('流程名称：',{isRequired:true})"
            prop="name">
            <Input 
              v-model="form.name"
              placeholder="请输入流程名称" />
          </FormItem>
        </i-col>
        <i-col span="8">
          <FormItem 
            label="默认流程："
            :label-width="$calcLabelWidth('默认流程：',{isRequired:true})"
            prop="type">
            <Select 
            v-model="form.type"
            placeholder="请选择流程默认">
              <Option 
                v-for="(process,index) of processList" 
                :value="index" 
                :key="index">{{ process }}</Option>
            </Select>
          </FormItem>
        </i-col>
      </Row>
      <Row :gutter="16">
        <i-col span="24">
          <FormItem 
            label="流程说明："
            :label-width="$calcLabelWidth('流程说明：',{isRequired:true})"
            prop="description">
            <Input 
              v-model="form.description"
              type="textarea"
              :row="3"
              placeholder="请输入流程说明" />
          </FormItem>
        </i-col>
      </Row>
    </Form>
    <div style="padding: 0 20px">
      <div style="margin:20px 4px 14px;border-top: 1px solid #E4E7ED"></div>
      <div class="form-title flex-between" style="padding: 12px 2px">
        配置信息
        <Button 
          @click="onClickAdd"
          type="primary"
          size="default"
          style="width:70px">+ 新增</Button>
      </div>
      <Table 
        :columns="table.columns" 
        :data="form.modelVoList"
        :loading="table.loading"
        size="large" />
      <Modal
        ref="modal"
        v-model="modal.show"
        @on-visible-change="onVisibleChange"
        :title="modal.title"
        transfer
        :mask-closable="false"
        :width="600">
        <Form 
          ref="subFormRef" 
          :model="subForm"
          :rules="subRules">
          <FormItem 
            label="名称："
            :label-width="$calcLabelWidth('名称：',{isRequired:true,extraNum:1})"
            prop="name">
            <Input 
              v-model="subForm.name"
              placeholder="请输入环节名称" />
          </FormItem>
          <FormItem 
            label="处理人："
            :label-width="$calcLabelWidth('处理人：',{isRequired:true})"
            prop="handlePerson">
            <Select
              v-model="subForm.handlePerson"
              ref="handlePerson"
              multiple
              filterable
              remote
              loading-text="获取数据中..."
              :remote-method="query => handlePersonemoteMethod(query,'handlePerson')"
              @on-open-change="onOpenChange($event,'handlePerson')"
              :loading="handlePersonLoading"
              placeholder="请输入至少2个中文进行搜索或过滤，可配置多人">
              <Option 
                v-for="option in optionList" 
                :value="option.id"
                :label="option.realName"
                :key="option.id">
                <span>{{option.realName}}</span>
                <span class="option-span" :title="option.orgNames">{{option.orgNames}}</span>
              </Option>
            </Select>
          </FormItem>
          <FormItem 
            label="参与人："
            :label-width="$calcLabelWidth('参与人：',{extraNum:1})"
            prop="participatePerson">
            <Select
              v-model="subForm.participatePerson"
              ref="participatePerson"
              multiple
              filterable
              remote
              loading-text="获取数据中..."
              :remote-method="query => handlePersonemoteMethod(query,'participatePerson')"
              @on-open-change="onOpenChange($event,'participatePerson')"
              :loading="participatePersonLoading"
              placeholder="请输入至少2个中文进行搜索或过滤，可配置多人">
              <Option 
                v-for="option in optionList" 
                :value="option.id" 
                :label="option.realName"
                :key="option.id">
                {{option.realName}}
                <span class="option-span" :title="option.orgNames">{{option.orgNames}}</span>
              </Option>
            </Select>
          </FormItem>
          <Row :gutter="8">
            <i-col span="24">
            </i-col>
          </Row>
          <FormItem 
            label="知会人："
            :label-width="$calcLabelWidth('知会人：',{extraNum:1})"
            prop="informPerson">
            <Select
              v-model="subForm.informPerson"
              ref="informPerson"
              multiple
              filterable
              remote
              loading-text="获取数据中..."
              :remote-method="query => handlePersonemoteMethod(query,'informPerson')"
              @on-open-change="onOpenChange($event,'informPerson')"
              :loading="informPersonLoading"
              placeholder="请输入至少2个中文进行搜索或过滤，可配置多人">
              <Option 
                v-for="option in optionList" 
                :value="option.id"
                :label="option.realName" 
                :key="option.id">
                {{option.realName}}
                <span class="option-span" :title="option.orgNames">{{option.orgNames}}</span>
              </Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer" style="text-align:center">
          <Button 
            @click="onClickModalBtn('cancel')"
            style="margin-right:10px;width:100px">取消</Button>
          <Button 
            @click="onClickModalBtn('confirm')"
            type="primary"
            :loading="modal.loading"
            style="width:100px">确定</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
import { fetchUserByName } from '@/api'
export default {
  props: {
    processList: {
      type   : Array,
      default: () => []
    }
  },
  data () {
    function debounce (filterFn, fn, wait) {
      let timer = null
      return (query, type) => {
        let _query = filterFn(query, type)
        if (timer) clearTimeout(timer)  
        timer = setTimeout(fn.bind(this, _query), wait)
      }
      
    }
    this.handlePersonemoteMethod = debounce(this.filterQuery, this.handlePersonemoteMethod, 500)
    return {
      form: {
        name       : '',
        type       : '',
        description: '',
        modelVoList: []
      },
      rules: {
        name       : { required: true, message: '流程名称不能为空' },
        type       : { required: true, message: '默认流程不能为空', trigger: 'change', type: 'number' },
        description: { required: true, message: '流程说明不能为空' }
      },

      modal: {
        show      : false,
        loading   : false,
        btnLoading: false,
        title     : '新增',
        curIndex  : -1,
        curId     : ''
      },

      table: {
        columns: [
          {
            title: '序号',
            type : 'index',
            width: 80
          },
          {
            title: '环节名称',
            key  : 'name'
          },
          {
            title : '处理人',
            key   : 'handlePerson',
            render: (h, { row:{ handlePerson } }) => [handlePerson.map(item => item.realName).join('/')]
          },
          {
            title : '参与人',
            key   : 'participatePerson',
            render: (h, { row:{ participatePerson } }) => [participatePerson.map(item => item.realName).join('/')]
          },
          {
            title : '知会人',
            key   : 'informPerson',
            render: (h, { row:{ informPerson } }) => [informPerson.map(item => item.realName).join('/')]
          },
          {
            title    : '操作',
            width    : 120,
            className: 'table-column-fix',
            render   : (h, { row }) => {
              const actions = [
                { icon: 'detail', type: 'detail', title: '详情' },
                { icon: 'del', type: 'del', title: '删除' }
              ]
              return actions.map(({ icon, type, title }) => {
                return (
                  <Tooltip 
                    content={title} 
                    theme="light" 
                    placement="top"
                    class="tooltip-fix">
                    <i 
                      onClick={() => this.onClickRowAction({ type, row })}
                      class={`icon-sprites-g1 icon-${icon}`}></i>
                  </Tooltip>
                  
                )
              })
            }
          }
        ],
        loading: false
      },
      subForm: {
        name             : '',
        handlePerson     : [],
        participatePerson: [],
        informPerson     : []
      },
      subRules: {
        name        : { required: true, message: '环节名称不能为空' },
        handlePerson: { required: true, message: '参与人不能为空', trigger: 'change', type: 'array' }
      },

      optionList: [],

      handlePersonLoading     : false,
      participatePersonLoading: false,
      informPersonLoading     : false
    }
  },
  mounted () {
    const { 
      formRef,
      handlePerson, 
      participatePerson, 
      informPerson 
    } = this.$refs
    this.validate = formRef.validate
    this.resetFields = formRef.resetFields

    this.$handlePerson = handlePerson
    this.$participatePerson = participatePerson
    this.$informPerson = informPerson
    
  },
  methods: {
    filterQuery (query, type) {
      const _query = query.replace(/[^\u4e00-\u9fa5]+/g, '')
      const ref = this['$' + type]
      ref.setQuery(_query || null)
      this.$nextTick(() => {
        ref.setQuery(_query || null)
      })
      return _query
    },
    handlePersonemoteMethod (query) {
      if (query.length >= 2) {
        const queryedList = this.queryedList
        const optionList = this.optionList
        const isExistInQueryedList = queryedList && queryedList.find(item => query === item)
        const isExistInList = optionList.find(item => query === item.realName)
        if (isExistInQueryedList || isExistInList) return
        
        this.handlePersonLoading = true
        fetchUserByName(query).then(res => {
          this.handlePersonLoading = false
          const { data } = res
          this.queryedList = queryedList || []
          this.queryedList.push(query)
          if (optionList.length) {
              
            optionList.push(...data.reduce((ret, cur) => {
              if (!optionList.find(item => cur.id === item.id)) {
                const orgNames = cur.orgList.map(org => org.name).join(',')
                ret.push({ 
                  realName: 
                  cur.realName, 
                  id: cur.id, orgNames 
                })
              }
              return ret
            }, []))
          } else {
            this.optionList = data.map(item => ({ 
              realName: item.realName, 
              id      : item.id, 
              orgNames: item.orgList.map(org => org.name).join(',') 
            }))
          }
        })
      }
    },
    onOpenChange (value, type) {
      if (!value) {
        this['$' + type].query = ''
      }
    },

    onVisibleChange (value) {
      if (!value) {
        this.$refs.subFormRef.resetFields()
      }
    },
    onClickAdd () {
      const { modal } = this
      modal.curIndex = -1
      modal.curId = ''
      modal.show = true
    },

    onClickRowAction ({ type, row }) {
      const { modelVoList } = this.form
      const index = row._index
      if (type === 'detail') {
        this.modal.curIndex = index
        const { subForm } = this
        const {
          name, handlePerson, informPerson, participatePerson
        } = modelVoList[index]
                
        Object.assign(subForm, {
          name,
          handlePerson     : handlePerson.map(v => v.id),
          informPerson     : informPerson.map(v => v.id),
          participatePerson: participatePerson.map(v => v.id)
        })
        
        this.modal.show = true
      } else if (type === 'del') {
        modelVoList.splice(index, 1)
      }
    },

    onClickModalBtn (type) {
      const { modal } = this
      if (type === 'cancel') {
        modal.show = false
      } else {
        const { $refs:{ subFormRef }, form:{ modelVoList }, subForm } = this
        subFormRef.validate(vaild => {
          if (vaild) {
            const copyForm = JSON.parse(JSON.stringify(subForm))
            const optionList = this.optionList
            ;['handlePerson', 'participatePerson', 'informPerson'].forEach(key => {
              copyForm[key] = copyForm[key].map(v => {
                const { id, realName, orgNames } = optionList.find(item => v === item.id)
                return { id, realName, orgNames }
              })
            })
            const curIndex = modal.curIndex
            if (curIndex === -1) {
              modelVoList.push(copyForm)
            } else {
              modelVoList.splice(curIndex, 1, copyForm)
            }

            modal.show = false
          }
        })
      }
    }
  }
}
</script>