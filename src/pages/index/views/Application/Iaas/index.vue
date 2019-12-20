<template>
  <div class="application-iaas">
    <div style="padding-top:20px">
      <AssContent :list='handleData(list)' ass-type='iaas'></AssContent>
    </div>
    <Page :total="total" :page-size="page.size" class-name='pagination' @on-change="changepage"/>
  </div>
</template>
<script>
import AssContent from '../assContent'
import { fetchAssUseTokenData } from '_index/api/index.js'
export default {
  components: {
    AssContent
  },
  data () {
    return {
      list: [
        { id: 1, name: '弹性云服务器申请变更', description: '弹性云服务器申请变更：虚拟机支持Windows（未激活）和Linux操作系统...' },
        { id: 2, name: '容器服务', description: '容器服务：虚拟机支持Windows（未激活）和Linux操作系统...' },
        { id: 3, name: 'BMS（裸金属服务器）', description: 'BMS（Bare Metal Server），即裸金属服务器，提供单租户专属的物理服务器，通过卓越的计算性能，满足核心应用场景对高性能及稳定性的需求，同时和虚拟私有云等其他云服务灵活结合使用，结合了传统托管主机带来的稳定性能与云上资源高度弹性的优势。功能说明：以独占单台物理服务器的CPU、内存、磁盘等资源的形式发放资源。当前使用：腾讯的移动警务和巨龙的数据治理在使用技术接口人：伦应林/13413203480' },
        { id: 4, name: 'ECS（弹性云服务器）', description: '功能说明：提供Linux或未激活的Windows虚拟机的服务 使用情况：各警种应用系统，大数据汇聚、治理、专题服务均在使用云主机服务 接口人：伦应林/13413203480' },
        { id: 5, name: 'SFS文件服务', description: '弹性文件服务（Scalable File Service）为用户的弹性云服务器（ECS）提供一个完全托管的共享文件存储，符合标准文件协议（NFS），能够弹性伸缩至PB规模，具备可扩展的性能，为海量数据、高带宽型应用提供有力支持。' },
        { id: 11, name: '弹性云服务器申请变更', description: '弹性云服务器申请变更：虚拟机支持Windows（未激活）和Linux操作系统...' },
        { id: 22, name: '容器服务', description: '容器服务：虚拟机支持Windows（未激活）和Linux操作系统...' },
        { id: 33, name: 'BMS（裸金属服务器）', description: 'BMS（Bare Metal Server），即裸金属服务器，提供单租户专属的物理服务器，通过卓越的计算性能，满足核心应用场景对高性能及稳定性的需求，同时和虚拟私有云等其他云服务灵活结合使用，结合了传统托管主机带来的稳定性能与云上资源高度弹性的优势。功能说明：以独占单台物理服务器的CPU、内存、磁盘等资源的形式发放资源。当前使用：腾讯的移动警务和巨龙的数据治理在使用技术接口人：伦应林/13413203480' },
        { id: 44, name: 'ECS（弹性云服务器）', description: '功能说明：提供Linux或未激活的Windows虚拟机的服务 使用情况：各警种应用系统，大数据汇聚、治理、专题服务均在使用云主机服务 接口人：伦应林/13413203480' },
        { id: 55, name: 'SFS文件服务', description: '弹性文件服务（Scalable File Service）为用户的弹性云服务器（ECS）提供一个完全托管的共享文件存储，符合标准文件协议（NFS），能够弹性伸缩至PB规模，具备可扩展的性能，为海量数据、高带宽型应用提供有力支持。' }
      ],
      page: {
        current : 1,
        size    : 10,
        subclass: '',
        name    : '',
        state   : 1
      },
      total: 0
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    handleData (stateType) {
      return stateType.reduce((ret, cur, index) => {
        const coordinate_0 = ~~(index / 3)
        ret[coordinate_0] = ret[coordinate_0] || []
        ret[coordinate_0].push(cur)
        return ret
      }, [])
    },
    //获取IaaS列表
    getData () {
      fetchAssUseTokenData(this.page, 'iaas').then(res => {
        if (res.code === 0) {
          this.list = res.data.records.map(item => {
            return {
              id         : item.id,
              name       : item.shortName,
              image      : item.imageUrl,
              description: item.description
            }
          })
          console.log(this.list, 'list')
          this.total = res.data.total
        } else {
          this.list = []
        }
      })
    },
    changepage (index) {
      this.page.current = index
      this.getData()
    }
  }
  
}
</script> 