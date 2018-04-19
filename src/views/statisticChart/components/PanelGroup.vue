<template>
  <el-row class="panel-group" :gutter="10">

    <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col" v-for="(item, index) in groupData.data" v-if="index <= 4" :key="index">
      <div class='card-panel' @click="handleSetLineChartData(groupData.name[index])">
        <div class="card-panel-description">
          <div class="card-panel-text">{{ item.name }}</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="item.value" :duration="2600"></count-to>
        </div>
      </div>
    </el-col>

    <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
      <div class='card-panel' @click="handleSetLineChartData('all')">
        <div class="card-panel-description" style="margin:0 auto;top: 50%;transform: translateY(-50%);position: relative;">
          <div class="card-panel-text">全部数据</div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  props: {
    groupData: {
      type: Object
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    .card-panel-description {
      font-weight: bold;
      margin: 26px auto;
      .card-panel-text {
        line-height: 18px;
        text-align: center;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        text-align: center;
        font-size: 20px;
        display: block;
      }
    }
  }
}
</style>
