<template>
  <v-chart
    ref="map"
    @geoselectchanged="geoselectchanged" 
    :options="chartOption" 
    :style="`width:${areaSize[0]};height:${areaSize[1]}`"
  />
</template>
<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/lines'
import 'echarts/lib/chart/map'
import 'echarts/lib/chart/effectScatter'
import 'echarts/lib/component/geo'
import China from '../../../../public/china.json'
const regions = [
  { name: '北京', enName: 'ST' },
  { name: '河北', enName: 'hb' },
  { name: '山西', enName: 'sx' },
  { name: '内蒙古', enName: 'nmg' },
  { name: '辽宁', enName: 'ln' },
  { name: '吉林', enName: 'jn' },
  { name: '黑龙江', enName: 'hlj' },
  { name: '江苏', enName: 'js' },
  { name: '浙江', enName: 'zj' },
  { name: '安徽', enName: 'ah' },
  { name: '福建', enName: 'fj' },
  { name: '江西', enName: 'jx' },
  { name: '山东', enName: 'sd' },
  { name: '河南', enName: 'hn' },
  { name: '湖北', enName: 'hub' },
  { name: '湖南', enName: 'hun' },
  { name: '广东', enName: 'gd' },
  { name: '广西', enName: 'gx' },
  { name: '海南', enName: 'han' },
  { name: '四川', enName: 'sc' },
  { name: '贵州', enName: 'gz' },
  { name: '云南', enName: 'yn' },
  { name: '西藏', enName: 'xz' },
  { name: '陕西', enName: 'sax' },
  { name: '甘肃', enName: 'gs' },
  { name: '青海', enName: 'qh' },
  { name: '宁夏', enName: 'nx' },
  { name: '新疆', enName: 'xj' },
  { name: '天津', enName: 'tj' },
  { name: '上海', enName: 'sh' },
  { name: '重庆', enName: 'cq' },
  { name: '香港', enName: 'xg' },
  { name: '澳门', enName: 'am' },
  { name: '台湾', enName: 'tw' }
]
const series = [
  {
    type            : 'effectScatter',
    coordinateSystem: 'geo',
    zlevel          : 1,
    rippleEffect    : {
      brushType: 'stroke'
    },
    symbol    : `image://${require('../assets/img/icon_red-star.png')}`,
    symbolSize: 8,
    data      : [
      {
        name : '省厅',
        value: [116.405285, 39.904989]
      }
    ]
  },
  {
    name  : '线路',
    type  : 'lines',
    effect: {
      show         : true,
      period       : 1,
      trailLength  : 0,
      delay        : 0,
      symbol       : 'triangle',
      constantSpeed: 30,
      color        : '#FEFF00',
      symbolSize   : 10
    },
    lineStyle: {
      normal: {
        width    : 0,
        curveness: 0.2
      }
    },
    data: [
      {
        fromName: '北京',
        toName  : '台湾',
        coords  : [[121.509062, 25.044332], [116.405285, 39.904989]]
      },
      {
        fromName: '北京',
        toName  : '河北',
        coords  : [[114.502461, 38.045474], [116.405285, 39.904989]]
      },
      {
        fromName: '北京',
        toName  : '山西',
        coords  : [[112.549248, 37.857014], [116.405285, 39.904989]]
      },
      {
        fromName: '北京',
        toName  : '\'内蒙古\'',
        coords  : [[111.670801, 40.818311], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '辽宁',
        coords  : [[123.429096, 41.796767], [116.405285, 39.904989]]
      },
      {
        fromName: '北京',
        toName  : '吉林',
        coords  : [[125.3245, 43.886841], [116.405285, 39.904989]]
      },
      {
        fromName: '北京',
        toName  : '黑龙江',
        coords  : [[126.642464, 45.756967], [116.405285, 39.904989]]
      },
      {
        fromName: '北京',
        toName  : '江苏',
        coords  : [[118.767413, 32.041544], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '浙江',
        coords  : [[120.153576, 30.287459], [116.405285, 39.904989]]
      },
      {
        fromName: '北京',
        toName  : '安徽',
        coords  : [[117.283042, 31.86119], [116.405285, 39.904989]]
      },
      {
        fromName: '北京',
        toName  : '福建',
        coords  : [[119.306239, 26.075302], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '江西',
        coords  : [[115.892151, 28.676493], [116.405285, 39.904989]]
      },
      {
        fromName: '北京',
        toName  : '山东',
        coords  : [[117.000923, 36.675807], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '河南',
        coords  : [[113.665412, 34.757975], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '湖北',
        coords  : [[114.298572, 30.584355], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '湖南',
        coords  : [[112.982279, 28.19409], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '广东',
        coords  : [[113.280637, 23.125178], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '广西',
        coords  : [[108.320004, 22.82402], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '海南',
        coords  : [[110.33119, 20.031971], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '四川',
        coords  : [[104.065735, 30.659462], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '贵州',
        coords  : [[106.713478, 26.578343], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '云南',
        coords  : [[102.712251, 25.040609], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '西藏',
        coords  : [[91.132212, 29.660361], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '陕西',
        coords  : [[108.948024, 34.263161], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '甘肃',
        coords  : [[103.823557, 36.058039], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '青海',
        coords  : [[101.778916, 36.623178], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '宁夏',
        coords  : [[106.278179, 38.46637], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '新疆',
        coords  : [[87.617733, 43.792818], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '天津',
        coords  : [[117.190182, 39.125596], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '上海',
        coords  : [[121.472644, 31.231706], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '重庆',
        coords  : [[106.504962, 29.533155], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '香港',
        coords  : [[114.173355, 22.320048], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '澳门',
        coords  : [[113.54909, 22.198951], [116.405285, 39.904989]]
      }
    ]
  },
  {
    type            : 'effectScatter',
    coordinateSystem: 'geo',
    data            : [
      [121.509062, 25.044332],
      [114.502461, 38.045474],
      [112.549248, 37.857014],
      [111.670801, 40.818311],
      [123.429096, 41.796767],
      [125.3245, 43.886841],
      [126.642464, 45.756967],
      [118.767413, 32.041544],
      [120.153576, 30.287459],
      [117.283042, 31.86119],
      [119.306239, 26.075302],
      [115.892151, 28.676493],
      [117.000923, 36.675807],
      [113.665412, 34.757975],
      [114.298572, 30.584355],
      [112.982279, 28.19409],
      [113.280637, 23.125178],
      [108.320004, 22.82402],
      [110.33119, 20.031971],
      [104.065735, 30.659462],
      [106.713478, 26.578343],
      [102.712251, 25.040609],
      [91.132212, 29.660361],
      [108.948024, 34.263161],
      [103.823557, 36.058039],
      [101.778916, 36.623178],
      [106.278179, 38.46637],
      [87.617733, 43.792818],
      [117.190182, 39.125596],
      [121.472644, 31.231706],
      [106.504962, 29.533155],
      [114.173355, 22.320048],
      [113.54909, 22.198951]
    ],
    rippleEffect: {
      brushType: 'stroke'
    },
    label: {
      formatter: '{b}',
      position : 'right',
      show     : true
    },
    itemStyle: {
      color      : '#FEFF00',
      shadowBlur : 10,
      shadowColor: '#FEFF00'
    }
  },
  {
    name            : '线路',
    type            : 'lines',
    coordinateSystem: 'geo',
    large           : true,
    effect          : {
      show         : false,
      constantSpeed: 30,
      symbol       : 'arrow', //ECharts 提供的标记类型包括 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
      symbolSize   : 0,
      trailLength  : 0
    },

    lineStyle: {
      color    : '#FEFF00',
      width    : 2,
      opacity  : 1.0,
      curveness: 0.2
    },
    data: [
      {
        fromName: '北京',
        toName  : '台湾',
        coords  : [[121.509062, 25.044332], [116.405285, 39.904989]]
      },
      {
        fromName: '北京',
        toName  : '河北',
        coords  : [[114.502461, 38.045474], [116.405285, 39.904989]]
      },
      {
        fromName: '北京',
        toName  : '山西',
        coords  : [[112.549248, 37.857014], [116.405285, 39.904989]]
      },
      {
        fromName: '北京',
        toName  : '\'内蒙古\'',
        coords  : [[111.670801, 40.818311], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '辽宁',
        coords  : [[123.429096, 41.796767], [116.405285, 39.904989]]
      },
      {
        fromName: '北京',
        toName  : '吉林',
        coords  : [[125.3245, 43.886841], [116.405285, 39.904989]]
      },
      {
        fromName: '北京',
        toName  : '黑龙江',
        coords  : [[126.642464, 45.756967], [116.405285, 39.904989]]
      },
      {
        fromName: '北京',
        toName  : '江苏',
        coords  : [[118.767413, 32.041544], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '浙江',
        coords  : [[120.153576, 30.287459], [116.405285, 39.904989]]
      },
      {
        fromName: '北京',
        toName  : '安徽',
        coords  : [[117.283042, 31.86119], [116.405285, 39.904989]]
      },
      {
        fromName: '北京',
        toName  : '福建',
        coords  : [[119.306239, 26.075302], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '江西',
        coords  : [[115.892151, 28.676493], [116.405285, 39.904989]]
      },
      {
        fromName: '北京',
        toName  : '山东',
        coords  : [[117.000923, 36.675807], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '河南',
        coords  : [[113.665412, 34.757975], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '湖北',
        coords  : [[114.298572, 30.584355], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '湖南',
        coords  : [[112.982279, 28.19409], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '广东',
        coords  : [[113.280637, 23.125178], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '广西',
        coords  : [[108.320004, 22.82402], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '海南',
        coords  : [[110.33119, 20.031971], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '四川',
        coords  : [[104.065735, 30.659462], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '贵州',
        coords  : [[106.713478, 26.578343], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '云南',
        coords  : [[102.712251, 25.040609], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '西藏',
        coords  : [[91.132212, 29.660361], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '陕西',
        coords  : [[108.948024, 34.263161], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '甘肃',
        coords  : [[103.823557, 36.058039], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '青海',
        coords  : [[101.778916, 36.623178], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '宁夏',
        coords  : [[106.278179, 38.46637], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '新疆',
        coords  : [[87.617733, 43.792818], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '天津',
        coords  : [[117.190182, 39.125596], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '上海',
        coords  : [[121.472644, 31.231706], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '重庆',
        coords  : [[106.504962, 29.533155], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '香港',
        coords  : [[114.173355, 22.320048], [116.405285, 39.904989]]
      }, {
        fromName: '北京',
        toName  : '澳门',
        coords  : [[113.54909, 22.198951], [116.405285, 39.904989]]
      }
    ]
  }
]
export default {
  props: {
    areaSize: {
      type: Array,
      default () {
        return ['800px', '600px']
      }
    }
  },
  data () {
    return {
      geoSelectedNameCache: '',
      series              : series,
      regions             : regions,
      chartOption         : {
        geo: {
          map         : '中国',
          aspectScale : 835 / 590,
          left        : 0,
          top         : 0,
          right       : 0,
          bottom      : 0,
          selectedMode: 'single',
          label       : {
            //区域未激活（鼠标未移入）时字体颜色
            normal: {
              show : true,
              color: '#fff'
            },
            //区域未激活（鼠标未移入）时字体颜色
            emphasis: {
              show : true,
              color: '#fff'
            }
          },
          itemStyle: {
            
            normal: {
              areaColor  : 'rgb(110,180,242)',
              borderColor: '#2184DC',
              borderWidth: 1
            },
            emphasis: {
              areaColor  : '#EAC78F',
              borderColor: '#CB9147',
              borderWidth: 1
            }
          }
          // regions: regions
        },
        series: []
      }
    }
  },
  created () {
    // this.$http.get(process.env.BASE_URL + 'China.json', { external: true }).then(res => {
    //   })
    ECharts.registerMap('中国', China)
    this.chartOption.series = series
    // setTimeout(() => {
    //   dispatchAction
    // }, 3000)
  },
  methods: {
    geoselectchanged (data) {
      const curGeoSelectedName = this.geoSelectedNameCache === data.batch[0].name ? '' : data.batch[0].name
      this.geoSelectedName      = curGeoSelectedName
      this.geoSelectedNameCache = curGeoSelectedName    
    },
    handleClickCanvas () {
      if (!this.geoSelectedName) {   
        this.handleEmit({ name: '省厅', enName: 'ST' })
        this.$refs.map.dispatchAction({
          type: 'geoUnSelect',
          name: this.geoSelectedNameCache
        })
        this.geoSelectedNameCache = ''
      } else {
        this.handleEmit({ name: this.geoSelectedName, enName: regions.filter(city => this.geoSelectedName === city.name)[0].enName })
        this.geoSelectedName = ''
      }
      
    },
    handleEmit (cityInfo) {
      this.$emit('geoSelected', cityInfo)
    }
  },
  components: {
    'v-chart': ECharts
  }
}
</script>