<template>
  <v-chart
    ref="chart"
    :options="chartOption"
    :style="`width:${areaSize[0]};height:${areaSize[1]}`"
  />
</template> 
<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/bar'
export default {
  props: {
    areaSize: {
      type: Array,
      default () {
        return ['366px', '340px']
      }
    },
    title     : String,
    optionData: {
      type: Object,
      default () {
        return {
          xAxis              : [],
          series             : [],
          yAxisUnit          : '',
          seriesNormalColor  : [],
          seriesEmphasisColor: []
        }
      }
    }
  },
  data () {
    // this.handleData(this.optionData)
    const option = {
      title: {
        text     : this.title,
        textStyle: {
          'color'   : '#303133',
          'fontSize': '14px'
        },
        left: '20px'
      },
      color  : ['#1890FF'],
      tooltip: {
        trigger    : 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        top   : 70,
        left  : 60,
        right : 10,
        bottom: 30
      },
      legend: {
        icon      : 'rect',
        itemWidth : 11,
        itemHeight: 11,
        textStyle : {
          fontSize: 12,
          color   : '#3378FF'
        },
        data: this.optionData.xAxis
      },
      dataZoom: {
        type: 'inside'
      },
      xAxis: {
        type    : 'category',
        data    : this.optionData.xAxis,
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#E8E8E8'
          }
        },
        nameGap  : 0,
        axisLabel: {
          color: '#606266'
        }
      },
      yAxis: {
        type     : 'value',
        min      : 0,
        max      : 1000,
        splitLine: {
          lineStyle: {
            type : 'dashed',
            color: '#E8E8E8'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        axisLabel: {
          color : '#606266',
          margin: 4
        }
      },
      series: this.handleData(this.optionData)
      // series: this.optionData.series
    }
    return {
      chartOption: option
    }
  },
  watch: {
    'optionData.series' (newValue) {
      console.log(newValue)
      this.$refs.chart.clear()
      this.chartOption.legend.data = this.optionData.xAxis
      this.chartOption.xAxis.data = this.optionData.xAxis
      this.chartOption.yAxisUnit = this.optionData.yAxisUnit
      this.chartOption.series = this.handleData(this.optionData)
      console.log(this.chartOption.series, 'this.chartOption.series')
    }
  },
  mounted () {
    console.log(this.chartOption)
  },
  methods: {
    handleData (newValue) {
      return [
        {
          name    : '',
          type    : 'bar',
          barWidth: '60%',
          data    : newValue.series
          // itemStyle: {
          //   normal: {
          //     color: new ECharts.graphic.LinearGradient(0, 0, 0, 1, [
          //       {
          //         offset: 0,
          //         color: newValue.seriesNormalColor[0]
          //       },
          //       {
          //         offset: 0.5,
          //         color: newValue.seriesNormalColor[1]
          //       },
          //       {
          //         offset: 1,
          //         color: newValue.seriesNormalColor[2]
          //       }
          //     ])
          //   },
          //   emphasis: {
          //     color: new ECharts.graphic.LinearGradient(0, 0, 0, 1, [
          //       {
          //         offset: 0,
          //         color: newValue.seriesEmphasisColor[0]
          //       },
          //       {
          //         offset: 0.7,
          //         color: newValue.seriesEmphasisColor[1]
          //       },
          //       {
          //         offset: 1,
          //         color: newValue.seriesEmphasisColor[2]
          //       }
          //     ])
          //   }
          // }
        }
      ]
    }
  },
  components: {
    'v-chart': ECharts
  }
}
</script>