<template>
  <div class="basesource">
    <div class="base-main">
      <p class="base-title">全省基础设施资源情况</p>
      <div class="base-content">
        <BaseSide :sideList='sideList' :info='physics'/>
        <ChartCityMap
          :count='count'
          :areaSize="['600px','500px']"
          class="map"
        />
        <BaseSide :sideList='sideList' :info='service'/>
      </div>
      <div class="star">
        <img src="../../../assets/img/star_0.png" alt="" class="star0">
        <img src="../../../assets/img/star_1.png" alt="" class="star1">
        <img src="../../../assets/img/star_2.png" alt="" class="star2">
        <img src="../../../assets/img/star_3.png" alt="" class="star3">
        <img src="../../../assets/img/star_4.png" alt="" class="star4">
      </div>
    </div>
  </div>
</template>
<script>
import BaseSide from './baseSide'
import ChartCityMap from '../../../components/chart-city-map'
import pic1 from '../../../assets/img/physics.png'
import pic2 from '../../../assets/img/service.png'
export default {
  data () {
    return {
      sideList: [
        {
          num : 6000,
          name: '服务器'
        }, {
          num : 1500,
          name: '存储设备'
        }, {
          num : 890,
          name: '网络设备'
        }, {
          num : 890,
          name: '网络设备'
        }, {
          num : 890,
          name: '网络设备'
        }, {
          num : 890,
          name: '网络设备'
        }
      ],
      physics: {
        pic : pic1,
        text: '物理设备'
      },
      service: {
        pic : pic2,
        text: '服务实例'
      },
      count: 0
    }
  },
  components: {
    BaseSide,
    ChartCityMap
  }
}
</script>