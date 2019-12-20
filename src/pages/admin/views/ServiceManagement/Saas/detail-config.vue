<template>
  <Form 
    ref="formRef" 
    :model="form"
    :rules="rules"
    style="padding:0 20px">
    <Row :gutter="16"><div class="form-title">基本信息</div></Row>
    <Row :gutter="16">
      <i-col span="8">
        <FormItem 
          label="服务名称："
          :label-width="$calcLabelWidth('服务名称：',{isRequired:true})"
          prop="fullName">
          <Input 
            v-model="form.fullName"
            placeholder="请输入服务名称" />
        </FormItem>
      </i-col>
      <i-col span="8">
        <FormItem 
          label="服务简称："
          :label-width="$calcLabelWidth('服务简称：',{isRequired:true})"
          prop="shortName">
          <Input 
            v-model="form.shortName"
            placeholder="请输入服务简称" />
        </FormItem>
      </i-col>
      <i-col span="8" v-if="sourceApiType !== 'daas'">
        <FormItem 
          label="所属子类："
          :label-width="$calcLabelWidth('所属子类：',{isRequired:true})"
          :rules="{ required: sourceApiType !== 'iaas', message: '所属子类不能为空', trigger: 'change' }"
          prop="subclass">
          <Select 
            :disabled="sourceApiType === 'iaas'"
            v-model="form.subclass"
            placeholder="请选择所属子类">
            <Option 
              v-for="item of subTypeOtherList" 
              :value="item.id" 
              :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </i-col>
      <i-col span="8" v-else>
        <FormItem 
          label="所属子类："
          :label-width="$calcLabelWidth('所属子类：',{isRequired:true})"
          :rules="{ required: true, message: '所属子类不能为空', trigger: 'change',type:'array' }"
          prop="subclass">
          <Cascader 
            :data="subTypeDaasList" 
            v-model="form.subclass"></Cascader>
        </FormItem>
      </i-col>
    </Row> 
    <Row :gutter="16">
      <i-col span="8">
        <FormItem 
          label="所属地区："
          :label-width="$calcLabelWidth('所属地区：',{isRequired:true})"
          prop="areaVal">
          <Select 
            v-model="form.areaVal"
            placeholder="请选择所属地区">
            <Option 
              v-for="item of areaList" 
              :value="item.id" 
              :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </i-col>
      <i-col span="8">
        <FormItem 
          label="所属警种："
          :label-width="$calcLabelWidth('所属警种：',{isRequired:true})"
          prop="policeTypeVal">
        <Select 
            v-model="form.policeTypeVal"
            placeholder="请选择所属警种">
            <Option 
              v-for="item of policeTypeList" 
              :value="item.id" 
              :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </i-col>
      <i-col span="8">
        <FormItem 
          label="服务排序："
          :label-width="$calcLabelWidth('服务排序：',{extraNum:1})" 
          prop="sort">
          <Input 
            :value="form.sort"
            @on-change="$filterInput($event,v => form.sort = v, {type:'number',length:5})"
            placeholder="请输入(1-99999)" />
        </FormItem>
      </i-col>
    </Row> 
    <Row :gutter="16">
      <i-col span="8">
        <FormItem 
          label="版本号："
          :label-width="$calcLabelWidth('版本号：',{extraNum:2})"
          prop="version">
          <Input 
            v-model="form.version"
            :disabled="['iaas','paas'].indexOf(sourceApiType) > -1"
            placeholder="请输入版本号" />
        </FormItem>
      </i-col>
      <i-col span="8">
        <FormItem 
          label="表单编码："
          :label-width="$calcLabelWidth('表单编码：',{extraNum:1})"
          prop="formCode">
          <Input :value="form.formCode" readonly />
        </FormItem>
      </i-col>
      <i-col span="8">
        <FormItem 
          label="审批流程："
          :label-width="$calcLabelWidth('审批流程：',{extraNum:1})"
          prop="approvalProcess">
          <Select 
            v-model="form.approvalProcess"
            placeholder="请选择审批流程">
            <Option 
              v-for="item of processList" 
              :value="item.id" 
              :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </i-col>
    </Row>
    <Row :gutter="16" v-if="sourceApiType === 'saas'">
      <i-col span="24">
        <FormItem 
          label="来源应用："
          :label-width="$calcLabelWidth('来源应用：',{extraNum:1})"
          prop="sourceId">
          <Select 
            v-model="form.sourceId"
            @on-change="onChangeSourceId"
            filterable
            placeholder="请选择来源应用">
            <Option 
              v-for="item of sourceList" 
              :value="item.id" 
              :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </i-col>
    </Row>
    <Row :gutter="16">
      <i-col span="8" v-if="isCloud">
        <FormItem 
          label="系统地址："
          :label-width="$calcLabelWidth('系统地址：',{extraNum:1})"
          prop="systemUrl">
          <Input 
            v-model="form.systemUrl"
            placeholder="请选择系统地址" />
        </FormItem>
      </i-col>
      <i-col span="8" v-if="['saas','daas','paas'].indexOf(sourceApiType) > -1">
        <FormItem 
          label="API服务："
          :label-width="$calcLabelWidth('API服务：',{isRequired:true,extraNum:.5})"
          prop="ifApi">
          <RadioGroup 
            v-model="form.ifApi"
            class="radio-fix">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
      </i-col>
    </Row> 
    <Row :gutter="16">
      <i-col span="24">
        <FormItem 
          :label="`${isCloud?'应用':'服务'}描述：`" 
          :label-width="$calcLabelWidth('服务描述：',{isRequired:true})" 
          prop="description"
          class="textarea-label-fix"
          style="width:100%">
          <Tinymce 
            v-model="form.description"
            ref="tinymce1"
            text-only
            @tinymce-inited="onTinymceInited"></Tinymce>
        </FormItem> 
      </i-col>
    </Row>
    <Row :gutter="16">
      <i-col span="24">
        <FormItem 
          :label="`${isCloud?'应用':'服务'}LOGO`"
          :label-width="$calcLabelWidth('服务LOGO',{isRequired:true,extraNum:2})" 
          prop="imageId">

          <div style="line-height:36px;color:#909399">（图片尺寸80*80px）</div>
          <upload-logo 
            folder="saas"
            :url="form.imageUrl"
            @on-success="onUploadSuccess"/>
          
        </FormItem> 
      </i-col>
    </Row>
    <Row :gutter="16"><div class="form-title">申请信息</div></Row>
    <Row :gutter="16">
      <i-col span="24">
        <FormItem 
          label="能否申请："
          :label-width="$calcLabelWidth('能否申请：',{isRequired:true})"
          prop="ifApply">
          <RadioGroup v-model="form.ifApply">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
      </i-col>
      <i-col span="24">
        <FormItem 
          label="申请说明：" 
          :label-width="$calcLabelWidth('申请说明：',{extraNum:1})" 
          prop="applyDesc"
          class="textarea-label-fix"
          style="width:100%">
          <Tinymce 
            v-model="form.applyDesc"
            ref="tinymce2"
            text-only
            @tinymce-inited="onTinymceInited"></Tinymce>
        </FormItem> 
      </i-col>
    </Row>
    <Row :gutter="16"><div class="form-title">建设单位</div></Row>
    <Row :gutter="16">
      <i-col span="8">
        <FormItem 
          label="建设单位："
          :label-width="$calcLabelWidth('建设单位：',{isRequired:true})"
          prop="constructionUnit">
          <Input v-model="form.constructionUnit" />
          <!-- <Select
            v-model="form.constructionUnit"
            filterable
            remote
            :remote-method="onQueryUnit"
            :loading="queryLoading">
            <Option 
              v-for="option in queryList" 
              :value="option.id" 
              :key="option.id">{{option.name}}</Option>
          </Select> -->
        </FormItem>
      </i-col>
      <i-col span="8">
        <FormItem 
          label="联系人："
          :label-width="$calcLabelWidth('联系人：',{isRequired:true})"
          prop="constructionPerson">
          <Input 
            v-model="form.constructionPerson"
            placeholder="请输入联系人" />
        </FormItem>
      </i-col>
      <i-col span="8">
        <FormItem 
          label="联系电话："
          :label-width="$calcLabelWidth('联系电话：',{isRequired:true})"
          prop="constructionPhone">
          <Input
            :value="form.constructionPhone"
            @on-change="$filterInput($event,v => form.constructionPhone = v, {type:'tel'})"
            placeholder="请输入联系人电话" />
        </FormItem>
      </i-col>
    </Row>
    <Row :gutter="16"><div class="form-title">建设单位</div></Row>
    <Row :gutter="16">
      <i-col span="8">
        <FormItem 
          label="承建单位："
          :label-width="$calcLabelWidth('承建单位：',{isRequired:true})"
          prop="buildUnit">
          <Input v-model="form.buildUnit" />
          <!-- <Select
            v-model="form.buildUnit"
            filterable
            remote
            :remote-method="onQueryUnit"
            :loading="queryLoading">
            <Option 
              v-for="option in queryList" 
              :value="option.id" 
              :key="option.id">{{option.name}}</Option>
          </Select> -->
        </FormItem>
      </i-col>
      <i-col span="8">
        <FormItem 
          label="联系人："
          :label-width="$calcLabelWidth('联系人：',{isRequired:true})"
          prop="buildPerson">
          <Input 
            v-model="form.buildPerson"
            placeholder="请输入联系人" />
        </FormItem>
      </i-col>
      <i-col span="8">
        <FormItem 
          label="联系电话："
          :label-width="$calcLabelWidth('联系电话：',{isRequired:true})"
          prop="buildPhone">
          <Input
            :value="form.buildPhone"
            @on-change="$filterInput($event,v => form.buildPhone = v, {type:'tel'})"
            placeholder="请输入联系人电话" />
        </FormItem>
      </i-col>
    </Row>
  </Form>
</template>
<script>
import UploadLogo from '@/components/upload-logo'
import Tinymce from '_admin/components/tinymce'
import { mapState } from 'vuex'
export default {
  name: 'detail-config',

  components: {
    UploadLogo,
    Tinymce
  },
  inject: ['processList', 'subTypeDaasList', 'subTypeOtherList'],
  
  props: {
    sourceApiType: String,
    formCode     : String,
    sourceType   : Number
  },
  data () {
    const dispatch = this.$store.dispatch
    dispatch('fetchDictByName', 'policeType')
    dispatch('fetchDictByName', 'area')
    return {
      sourceList: [],
      
      queryLoading: false,
      queryList   : [],

      tinymceInited: false,

      form: {
        fullName       : '',
        shortName      : '',
        subclass       : this.sourceApiType === 'daas' ? [] : '',
        areaVal        : '',
        policeTypeVal  : '',
        sort           : 1,
        version        : '',
        formCode       : '',
        approvalProcess: '',
        sourceId       : '',
        systemUrl      : '',
        description    : '',
        imageId        : '', 
        imageUrl       : '', 

        ifApply  : 0,
        ifApi    : 0,
        applyDesc: '',

        constructionUnit  : '',
        constructionPerson: '',
        constructionPhone : '',

        buildUnit  : '',
        buildPerson: '',
        buildPhone : ''
      },
      rules: {
        fullName     : { required: true, message: '服务名称不能为空' },
        shortName    : { required: true, message: '服务简称不能为空' },
        areaVal      : { required: true, message: '所属地区不能为空', trigger: 'change' },
        policeTypeVal: { required: true, message: '所属警种不能为空', trigger: 'change' },
        description  : { required: true, message: '服务描述不能为空' },
        imageId      : { required: true, message: '服务LOGO不能为空' },

        ifApply: { required: true, message: '请选择是否能申请', trigger: 'change', type: 'number' },
        ifApi  : { required: true, message: '请选择是否是API服务', trigger: 'change', type: 'number' },

        constructionUnit  : { required: true, message: '建设单位不能为空' },
        constructionPerson: { required: true, message: '联系人不能为空' },
        constructionPhone : { required: true, message: '联系人电话不能为空' },

        buildUnit  : { required: true, message: '承建单位不能为空' },
        buildPerson: { required: true, message: '联系人不能为空' },
        buildPhone : { required: true, message: '联系人电话不能为空' }
      }
      
    }
  },
  computed: {
    ...mapState(['policeTypeList', 'areaList']),
    isCloud () {
      return /cloud/i.test(this.sourceApiType)
    }
  },
  watch: {
    formCode: {
      immediate: true,
      handler (newVal) {
        this.form.formCode = newVal
      }
    }
  },
  mounted () {
    const formRef = this.$refs.formRef
    this.validate = formRef.validate
    this.resetFields = formRef.resetFields
  },
  methods: {
    onTinymceInited () {
      if (!this.tinymceInited) {
        this.tinymceInited = true
        const { description, applyDesc } = this.form
        this.setTinymceContent(description, applyDesc)
      }
    },
    setTinymceContent (content1, content2) {
      const $refs = this.$refs

      $refs.tinymce1.setTextContent(content1)
      $refs.tinymce2.setTextContent(content2)
    },
    onChangeSourceId (id) {
      if (id) {
        const {
          constructionUnit,
          constructionPerson,
          constructionPhone,
          buildUnit,
          buildPerson,
          buildPhone
        } = this.sourceList.find(item => id === item.id)
        Object.assign(this.form, {
          constructionUnit,
          constructionPerson,
          constructionPhone,
          buildUnit,
          buildPerson,
          buildPhone
        })
      }
    },
    onUploadSuccess (response) {
      const { code, data } = response
      if (code === 0) {
        this.form.imageId = data.id
        this.form.imageUrl = data.url
        this.$refs.formRef.validateField('imageId')
      }
    },
    onQueryUnit (query) {
      if (query) {
        this.queryLoading = true
        setTimeout(() => {
          this.queryLoading = false
          this.queryList = [
            {
              id  : '1',
              name: '查询结果1'
            },
            {
              id  : '2',
              name: '查询结果2'
            }
          ]
        }, 3000)
      } else {
        this.queryList = []
      }
    }
  }
}
</script>