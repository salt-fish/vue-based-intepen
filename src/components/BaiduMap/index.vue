<template>
    <!--百度地图容器-->
    <baidu-map class='bm-view' ak="fxySVKbOfhpeUiRFwpEFbyjOkpBFwak4" :center="{ lng: lng, lat: lat }" :zoom="zoom" :scroll-wheel-zoom="false" :dragging="true" :double-click-zoom="false" :keyboard="true">
      <!-- <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation> -->
      <bm-control v-if="roles[0] === 'editor' || mapType === 1" :offset="{ width: 20, height: 10 }">
        <button @click="change(1)">查看定位</button>
        <button @click="change(2)">查看活动热区</button>
      </bm-control>
      <bm-marker v-if="flag === 1 && mapType === 1" :position="{ lng: lng, lat: lat }">
        <bm-label :content="'姓名：'+name" :offset="{ width: -35, height: 30 }" />
      </bm-marker> 
      <bml-heatmap v-if="flag === 2 && mapType === 1" :data="heatData" :max="100" :radius="20"></bml-heatmap>

      <!-- 散点图 -->
      <bm-point-collection
      v-if="roles[0] === 'admin' && mapType === 2"
      :points="points" color="red" @click="clickHandler">
      </bm-marker> 
      </bm-point-collection>
    </baidu-map>
</template>

<script>
// import { MP } from '@/map'
// import BMap from 'BMap'
import { mapGetters } from 'vuex'
import { BaiduMap, BmNavigation, BmMarker, BmControl,
  BmLabel, BmPointCollection, BmlHeatmap
} from 'vue-baidu-map'

export default {
  name: 'BMap',
  components: {
    BaiduMap,
    BmNavigation,
    BmControl,
    BmMarker,
    BmLabel,
    BmPointCollection,
    BmlHeatmap
  },
  data() {
    return {
      zoom: 17,
      flag: 1, // 切换地图插件 1. 定位 2. 热力图 3. 全部人员位置散点图
      heatData: [
        { lng: 104.108133, lat: 30.680945, count: 50 },
        { lng: 104.123133, lat: 30.680945, count: 51 },
        { lng: 104.112133, lat: 30.680945, count: 15 }
      ],
      personPoints: [
        { name: 'a', lng: 104.107912, lat: 30.680498 },
        { name: 'b', lng: 104.107049, lat: 30.68129 },
        { name: 'c', lng: 104.106762, lat: 30.680078 },
        { name: 'd', lng: 104.109888, lat: 30.680467 },
        { name: 'e', lng: 104.106385, lat: 30.681507 }
      ]
    }
  },
  props: {
    mapType: {
      type: Number,
      default: 1 // 地图使用类型： 1. 个人信息地图使用 2. 集体信息地图使用(工作人员)
    },
    name: {
      type: String
    },
    lng: {
      type: Number,
      default: 104.108133
    },
    lat: {
      type: Number,
      default: 30.680945
    }
  },
  methods: {
    change(flag) {
      this.flag = flag
    },
    clickHandler(e) {
      var p = this.personPoints
      for (var i = 0; i < p.length; i++) {
        if (p[i].lng === e.point.lng && p[i].lat === e.point.lat) {
          this.$message({
            message: `姓名：${p[i].name}`,
            type: 'success'
          })
        }
      }
    }
  },
  // mounted() {
  // console.log(this.roles)
  // },
  computed: {
    ...mapGetters([
      'roles'
    ]),
    points: function() {
      var i
      var p = []
      for (i = 0; i < this.personPoints.length; i++) {
        p.push({
          lng: this.personPoints[i].lng,
          lat: this.personPoints[i].lat
        })
      }
      return p
    }
  }
}
</script>

<style>
  .bm-view {
    width: 100%;
    height: 300px;
  }
</style>
