<template>
  <div class="settings-container">
    <el-form :inline="true" :model="settings">
      <el-form-item label="睡觉时间">
        <el-time-picker v-model="settings.sleepingStart" :pick-options="{ selectableRange: '20:00 - 24:00' }">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="起床时间">
        <el-time-picker v-model="settings.sleepingEnd" :pick-options="{ selectableRange: '04:00 - 08:00' }">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="设备脱离时长">
        <el-input v-model="settings.detachTime">
          <template slot="append">小时</template>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import

export default {
  name: 'settings',
  data() {
    return {
      settings: {}
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.settings = {
        sleepingStart: '21:30',
        sleepingEnd: '7:00',
        detachTime: 0.5 // 设备脱离时长 单位：小时
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.settings-container {
  padding: 32px;
  min-height: 100vh;
  background-color: rgb(240, 242, 245);
}
</style>