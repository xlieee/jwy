<template>
  <div class="aas_content-list-container">
    <div
      v-for="(subList,index) of list"
      :key="index"
      class="aas_content-list-group">
        <ul class="aas_content-list">
        <li 
          v-for="(item,num) of subList" 
          :class="item.id === curId ? 'active': ''" 
          :key="item.id"
          @click="handleClick(item,index,num)"
          class="content-item">
          <div
            class="sub-class-bg"
            :style="item.imageId"
            >
            <img
              class="sub-service-img"
              :style="{
                width: item.image ? '80px':'',
                height: item.image ? '80px':''
                }"
              :src="item.image"
              alt=""
            >
            
          </div>
          <div class="sub-text">
            <p class="title">{{item.name}}</p>
            <p class="desc" v-html="changeText(item.description)"></p>
          </div>
        </li>
        <div class="indicator-triangle" :style="`left:calc((100% / 3) * ${num} / 2)`"></div>
      </ul>
      <div 
        v-show="curId&&index === coordinate[0]"
        :class="index === coordinate[0] ? `nth${coordinate[1]}`:''"
        class="content-item-detail clear">
        <p v-html="info.description||'暂无描述'"><a href="javascript:;" @click="onDetail">查看详情</a></p>
        <div style="overflow:hidden">
          <a href="javascript:;" class="apply" @click="addCart" :id='`add-${curId}`'>加入购物车</a>
        </div>
        
      </div>
    </div>
    <Modal
        v-model="detailModal"
        :title="info.name"
        @on-ok="ok"
        footer-hide
        width="960px"
        class-name="application-center-modal"
        @on-cancel="onCancel">
        <Row :gutter="16" class="sub-title">
          <div class="icon-required">服务列表</div>
          <Button 
            @click="onClickAdd"
            type="text" 
            size="small"
            style="float:right">
            <i class="icon-sprites-small icon-add-small"></i>新增
          </Button>
        </Row>
        <Ecs viewName="ecs" ref="curComponent"></Ecs>

        <div class="modalFooter">
          <Button 
            @click="onCancel"
            class="btn btn-cancel">取消</Button>
          <Button 
            @click="onSubmit"
            class="btn btn-ok">确定</Button>
        </div>
    </Modal>
    <Modal
        v-model="paasModal"
        :title="info.name"
        @on-ok="paasModal = false"
        footer-hide
        width="960px"
        class-name="application-center-modal"
        @on-cancel="paasModal = false">
        <Form ref="baseInfo" :model="paasForm" :rules="paasRules">
          <Row :gutter='20'>
            <i-col span="12">
              <FormItem prop="temp" label='组件名称：' :label-width="labelWidth">
                <Select
                    v-model="paasForm.temp"
                    placeholder="请选择组件名称">
                    <Option v-for="(option, index) in cpuList" :value="option.value" :key="index">{{option.label}}</Option>
                </Select>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem prop="file" label='目录：' :label-width="labelWidth">
                <Input v-model="paasForm.file" placeholder="请输入路径，如/filepatn"/>
              </FormItem>
            </i-col>
          </Row>
          <Row :gutter='20'>
            <i-col span="12">
              <FormItem prop="auth" label='权限：' :label-width="labelWidth">
                <Input v-model="paasForm.auth" placeholder="请输入如 read、write、execute"/>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem prop="cpu" label='CPU(核)：' :label-width="labelWidth">
                <Input v-model="paasForm.cpu" placeholder="请输入cpu数量"/>
              </FormItem>
            </i-col>
            <i-col span="24">
              <FormItem prop="isAdd" label='是否新建Hadoop目录、HBase、Namespace、Hive数据库：' :label-width="470">
                <RadioGroup v-model="paasForm.isAdd">
                    <Radio label="是" :value='1'></Radio>
                    <Radio label="否" :value='0'></Radio>
                </RadioGroup>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem prop="memory" label='内存(GB)：' :label-width="labelWidth">
                <Input v-model="paasForm.memory" placeholder="请输入内存大小"/>
              </FormItem>
            </i-col>
            <i-col span="12">
              <FormItem prop="storage" label='存储(TB)：' :label-width="labelWidth">
                <Input v-model="paasForm.storage" placeholder="请输入存储大小"/>
              </FormItem>
            </i-col>
            <i-col span="24">
              <FormItem prop="desc" label='备注说明：' :label-width="labelWidth">
                <Input type="textarea" v-model="paasForm.desc" placeholder="请输入备注说明"/>
              </FormItem>
            </i-col>
          </Row>
          
        </Form>

        <div class="modalFooter">
          <Button 
            @click="paasModal = false"
            class="btn btn-cancel">取消</Button>
          <Button 
            @click="onAdd"
            class="btn btn-ok">确定</Button>
        </div>
    </Modal>
  </div>
</template>
<script>
import Ecs from '@/components/application/resource/daas/content-resource-info/application-info-content/iaas-ecs.vue'
export default {
  components: {
    Ecs
  },
  props: {
    assType: String,
    list   : {
      type   : Array,
      default: () => []
    }
  },
  data () {
    return {
      curId      : '',
      description: '',
      coordinate : [0, 0],
      num        : 0,
      detailModal: false,
      paasModal  : false,
      info       : {},
      columns    : [
        {
          title: '序号',
          type : 'index',
          width: 80
        },
        {
          title: '应用组件',
          type : 'temp'
        },
        {
          title: '规格名称(核/GB)',
          type : 'size'
        },
        {
          title: '数据盘存储(GB)',
          type : 'storage'
        },
        {
          title: '操作系统',
          type : 'system'
        },
        {
          title: '网络',
          type : 'net'
        },
        {
          title: '应用类型',
          type : 'type'
        },
        {
          title: '技术框架',
          type : 'frame'
        },
        {
          title: '申请数量',
          type : 'count'
        },
        {
          title    : '操作',
          width    : 120,
          className: 'table-column-fix',
          render   : (h, params) => {
            return h('div', [
              h('Tooltip', {
                props: {
                  placement: 'bottom',
                  transfer : true
                },
                class: 'editIcon'
              }, ['', h('span', {
                slot : 'content',
                props: {
                  type: 'primary',
                  size: 'small'
                },
                
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.show(params)
                  }
                }
              }, '编辑')
              ]),
              h('Tooltip', {
                props: {
                  placement: 'bottom',
                  transfer : true
                },
                class: 'deleteIcon'
              }, ['', h('span', {
                slot : 'content',
                props: {
                  type: 'primary',
                  size: 'small'
                },
                
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.show(params)
                  }
                }
              }, '删除')
              ])
            ])
            
          }
        }
      ],
      columns1: [
        {
          title: '序号',
          type : 'index',
          width: 80
        },
        {
          title: '组件名称',
          type : 'temp'
        },
        {
          title: '目录',
          type : 'file'
        },
        {
          title: '权限',
          type : 'auth'
        },
        // {
        //   title: '是否新建Hadoop目录、HBaseNamespace、Hive数据库',
        //   type : 'isAdd'
        // },
        {
          title: 'CPU(核)',
          type : 'cpu'
        },
        {
          title: '内存(GB)',
          type : 'memory'
        },
        {
          title: '存储(TB)',
          type : 'storage'
        },
        {
          title    : '操作',
          width    : 120,
          className: 'table-column-fix',
          render   : (h, params) => {
            return h('div', [
              h('Tooltip', {
                props: {
                  placement: 'bottom',
                  transfer : true
                },
                class: 'editIcon'
              }, ['', h('span', {
                slot : 'content',
                props: {
                  type: 'primary',
                  size: 'small'
                },
                
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.show(params)
                  }
                }
              }, '编辑')
              ]),
              h('Tooltip', {
                props: {
                  placement: 'bottom',
                  transfer : true
                },
                class: 'deleteIcon'
              }, ['', h('span', {
                slot : 'content',
                props: {
                  type: 'primary',
                  size: 'small'
                },
                
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.show(params)
                  }
                }
              }, '删除')
              ])
            ])
            
          }
        }
      ],
      dataList : [],
      iaasRules: {
        temp: [
          { required: true, message: '请输入应用组件', trigger: 'blur' }
        ],
        cpu: [
          { required: true, message: '请选择CPU规格', trigger: 'change' }
        ],
        memory: [
          { required: true, message: '请选择内存规格', trigger: 'change' }
        ],
        dbstorage: [
          { required: true, message: '请输入数据盘存储', trigger: 'blur' }
        ],
        sysstorage: [
          { required: true, message: '请输入系统盘存储', trigger: 'blur' }
        ],
        mirror: [
          { required: true, message: '请选择镜像类型', trigger: 'change' }
        ],
        count: [
          { required: true, message: '请输入负责人电话', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择网络类型', trigger: 'change' }
        ]
      },
      paasRules: {
        temp: [
          { required: true, message: '请选择组件名称', trigger: 'change' }
        ],
        file: [
          { required: true, message: '请输入路径，如/filepatn', trigger: 'blue' }
        ],
        auth: [
          { required: true, message: '请输入如 read、write、execute', trigger: 'blue' }
        ],
        cpu: [
          { required: true, message: '请输入cpu数量', trigger: 'blue' }
        ],
        isAdd: [
          { required: true, message: '请选择是否新建', trigger: 'change' }
        ],
        memory: [
          { required: true, message: '请输入内存大小', trigger: 'blue' }
        ],
        storage: [
          { required: true, message: '请输入存储大小', trigger: 'blue' }
        ]
      },
      cpuList   : [],
      iaasForm  : {},
      paasForm  : {},
      labelWidth: 108,
      modalData : {
        applyPermission: false
      },

      curComponent: '',
      viewName    : ''
    }
  },
  mounted () {
    console.log(this.list)
  },
  methods: {
    changeText (value) {
      if (value.length > 42) {
        return value.slice(0, 42) + '...'
      } else {
        return value
      }
    },
    handleClick (item, row, column) {
      this.num = column * 2 + 1
      this.curId = item.id,
      this.coordinate = [row, column]
      this.info = item
    },
    addCart (viewName) {
      this.viewName = viewName || 'ecs'
      this.curComponent = this.viewName
      this.detailModal = true
    },
    //查看详情
    onDetail () {
      const { info } = this
      this.$router.push({ path: '/indexDetail/' + info.id, query: { type: this.assType } })
    },
    ok () {
      this.detailModal = false
    },
    onCancel () {
      this.detailModal = false
    },
    onAdd () {
      console.log('22')
    },

    onClickAdd () {
      const { curComponent } = this.$refs
      if (curComponent) {
        curComponent.onClickRowAction({ type: 'add' })
      }
    },
    
    onSubmit () {
      console.log(this.$refs.curComponent.tableData)
      this.detailModal = false
    }
  }
  
}
</script> 
<style lang="scss">
.aas_content-list-container{
  .aas_content-list-group{
    padding-bottom: 20px;
  }
  .aas_content-list{
    display: flex;
    flex-wrap: wrap;
    position: relative;
    justify-content: space-between;
    .content-item{
      width: 32.5%;
      height: 130px;
      background: #fff;
      overflow: hidden;
      // margin-right: 20px;
      transition: height ease-in-out .5s;
      cursor: pointer;
      &:nth-of-type(3n){
        margin-right: 0;
      }
      &:hover{
        box-shadow:0px 5px 20px 0px rgba(0,45,142,0.2);
        background: rgba(255,255,255,.8);
        .sub-text .title{
          color: $active
        }
      }
      .sub-class-bg{
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin: 25px 0 0 22px;
        position: relative;
        float: left;
        img{
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          margin: auto;
        }
      }
      .sub-text{
        float: left;
        margin: 24px 0 10px 14px;
        width: calc(91% - 102px);
        .title{
          font-size: 20px;
          font-weight: 600;
          color: $baseColor2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .desc{
          font-size: 14px;
          color: $subColor2;
          margin-top: 12px;
          height: 45px;
        }
      }
    
    }
    .indicator-triangle{
      position: absolute;
      bottom: -13px;
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 8px solid #E0E8FB;
      transition: left .3s linear;
      visibility: hidden;
    }
    .active{
      .sub-text .title{
        color: $active
      }
    }
    .active ~.indicator-triangle{
      visibility: visible;
    }
  }
  
  .content-item-detail{
    position: relative;
    margin-top: 12px;
    padding: 20px 20px 14px;
    background:#E0E8FB;
    border-radius:2px;
    // overflow: hidden;
    
    p{
      font-size: 16px;
      color: #3B516A;
      line-height: 28px;
      a{
        color: $active;
        background: url('../../assets/img/detail.png') no-repeat right center;
        padding-right: 14px;
      }
    }
    .apply{
      float: right;
      width: 108px;
      height: 44px;
      line-height: 44px;
      text-align: center;
      font-size: 16px;
      color: #fff;
      background-color: #F66F6A;
      border-radius: 2px;
      border: 0;
      margin-top: 25px;
      &:hover{
        box-shadow: 0 8px 6px -4px rgba(246, 111, 106, 0.5);
        background: #ff8b87
      }
    }
    
  }
}

</style>