<template>
  <div class="userDetail-container">
    <!-- 快速选择栏 适用于关联多个老人的情况 -->
    <el-row class="qucik-select" :gutter="20">
      <el-col><img :src="avatar"></el-col>
      <el-col><img :src="avatar"></el-col>
    </el-row>

    <!-- 个人信息 -->
    <el-row>
      <el-col>
        <el-container class="resume">
          <el-aside width="40%">
            <img class="avatar" :src="avatar">
          </el-aside>
          <el-main>
            <el-row>
                <el-col :span="4" :offset="0">姓名:</el-col>
                <el-col :span="8">吴XX</el-col>
            </el-row>
            <el-row>
                <el-col :span="4" :offset="0">性别:</el-col>
                <el-col :span="8">男</el-col>
            </el-row>
            <el-row>
                <el-col :span="4" :offset="0">年龄:</el-col>
                <el-col :span="8">233</el-col>
            </el-row>
            <el-row>
                <el-col :span="4" :offset="0">生日:</el-col>
                <el-col :span="8">2000-01-01</el-col>
            </el-row>
            <el-row>
                <el-col :span="4" :offset="0">入院时间:</el-col>
                <el-col :span="8">2017-10-01</el-col>
            </el-row>
            <el-row>
                <el-col :span="4" :offset="0">主治医师:</el-col>
                <el-col :span="8">小明</el-col>
            </el-row>
            <el-row>
                <el-col :span="4" :offset="0">床位信息:</el-col>
                <el-col :span="8">2楼222室2床</el-col>
            </el-row>
            <el-row>
                <el-col :span="6" :offset="0">家属联系方式:</el-col>
                <el-col :span="12">111111111111</el-col>
            </el-row>
            <el-row>
                <el-col :span="4" :offset="0">健康评估:</el-col>
                <el-col :span="4">感冒</el-col>
                <el-col :span="4" :offset="0">跌倒统计:</el-col>
                <el-col :span="4">0</el-col>
            </el-row>
          </el-main>
        </el-container>
      </el-col>
    </el-row>

    <!-- 病历 -->
    <el-row>
      <el-col>
        <el-container class="medical-record">
          <el-header>
            病历
          </el-header>
          <el-main>
            现病史：患者缘于3天前劳累后出现解黑色软便，无粘液脓血，无血块，每日1次，每次约50-150g左右，前天患者出现呕吐咖啡色胃内容物2次，每次量在100g左右，遂于昨日在我院门诊就诊，查大便OB++，血常规：HGB66g /L,RBC2.6×1012/L,遂拟“上消化道出血”收入我科，当时患者未立即住院，于今日上午又解黑便1次，感头昏、乏力明显，病程中无发热、盗汗，无咳嗽、咳痰，无尿频、尿急、尿痛，无头痛、胸闷等症状，遂来我科住院治疗。近期内患者精神、食欲、睡眠偏差，小便正常，体重下降几斤。   既往史：既往体健，否认“高血压、冠心病、糖尿病”病史；否认“乙肝、结核”等传染病史；预防接种史不详；否认外伤史；无手术史；无输血史，无药物、食物过敏史。
          </el-main>
        </el-container>
      </el-col>
    </el-row>

    <!-- 个人统计 -->
    <el-row>
      <el-col>
        <el-container>
          <el-header>
            个人健康统计
          </el-header>
          <el-main>
            <el-row :gutter="20">
              <el-col :span="8">
                <gauge-chart :chartName="elder.dailyStatistic[0].name" :gaugeData="elder.dailyStatistic[0].value" :min="500" :max="3500"></gauge-chart>
              </el-col>
              <el-col :span="8">
                <gauge-chart :chartName="elder.dailyStatistic[1].name" :gaugeData="elder.dailyStatistic[1].value" :min="0" :max="22000"></gauge-chart>
              </el-col>
              <el-col :span="8">
                <gauge-chart :chartName="elder.dailyStatistic[2].name" :gaugeData="elder.dailyStatistic[2].value" :min="1" :max="10"></gauge-chart>
              </el-col>
            </el-row>
          </el-main>
        </el-container>
      </el-col>
    </el-row>

    <!-- 医嘱 -->
    <el-row>
      <el-col>
        <el-container class="advice">
          <el-header>
            医嘱
          </el-header>
          <el-main>
            <el-table border :data="elder.doctorAdvice" style="width: auto;margin: 0 auto;">
              <el-table-column prop="name" label="药名"></el-table-column>
              <el-table-column prop="time" label="吃药时间" ></el-table-column>
              <el-table-column prop="dose" label="剂量" ></el-table-column>
            </el-table>
          </el-main>
        </el-container>
      </el-col>
    </el-row>

    <!-- 定位 -->
    <el-row>
      <el-col>
        <el-container class="map">
          <el-header>
            定位
          </el-header>
          <el-main>
            <el-row :gutter="32">
              <el-col :span="14">
                <b-map :name="elder.name" :lng="elder.center.lng" :lat="elder.center.lat" :mapType="1"></b-map>
              </el-col>
              <el-col :span="10">
                <el-card>
                  <div v-for="(item, index) in elder.activityData" :key="index">{{ item.time }} &nbsp;&nbsp;&nbsp;&nbsp; {{ item.value }}</div>
                </el-card>
              </el-col>
            </el-row>
          </el-main>
        </el-container>
      </el-col>
    </el-row>

    <!-- 体检记录 -->
    <el-row>
      <el-col>
        <el-container class="medically-examin">
          <el-header>
            体检记录
          </el-header>
          <el-main>
            <el-table border :data="elder.examination" style="width: auto;margin: 0 auto;">
              <el-table-column fixed prop="date" label="体检时间"></el-table-column>
              <el-table-column prop="height" label="身高(米)"></el-table-column>
              <el-table-column prop="weight" label="体重(千克)"></el-table-column>
              <el-table-column prop="gangong" label="肝功"></el-table-column>
              <el-table-column prop="xuetang" label="血糖(mg/dl)"></el-table-column>
              <el-table-column label="血脂">
                <el-table-column prop="danguchun" label="总胆固醇(mg/dl)"></el-table-column>
                <el-table-column prop="TG" label="甘油三脂(mg/dl)"></el-table-column>
                <el-table-column prop="HDL_Cholesterol" label="高密度脂蛋白-胆固醇(mg/dl)"></el-table-column>
                <el-table-column prop="LDL_Cholesterol" label="低密度脂蛋白-胆固醇(mg/dl)"></el-table-column>
              </el-table-column>
              <el-table-column prop="shengong" label="肾功"></el-table-column>
              <el-table-column prop="bchao" label="B超"></el-table-column>
            </el-table>
          </el-main>
        </el-container>
      </el-col>
    </el-row>

    <!-- 计步、心率、血糖信息 -->
    <el-row>
      <el-col>
        <el-container class="real-time-data">
          <el-header>
            计步、心率、血糖信息
          </el-header>
          <el-main>
            <line-chart height='500px' width='100%' chartName='计步、心率、血糖信息' :realTimeData="elder.realTimeData"></line-chart>
          </el-main>
        </el-container>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import BMap from '@/components/BaiduMap'
import LineChart from './components/lineMarker'
import gaugeChart from './components/gaugeChart'

export default {
  name: 'userDetail',
  components: { BMap, LineChart, gaugeChart },
  data() {
    return {
      avatar: require('../../assets/images/avatar.jpg'),
      elder: {
        name: '吴XX',
        doctorAdvice: [
          { name: '头孢', time: '下午3点', dose: '2' },
          { name: 'a', time: '13', dose: '3' },
          { name: 'a', time: '13', dose: '3' },
          { name: 'a', time: '13', dose: '3' },
          { name: 'a', time: '13', dose: '3' }
        ],
        center: {
          lng: 104.108133,
          lat: 30.680945
        },
        examination: [
          { date: '2010-01-01', height: '1.70', weight: '67.0', gangong: '正常', xuetang: '100', Cholesterol: '40',
            danguchun: '50', TG: '40', HDL_Cholesterol: '40', LDL_Cholesterol: '40', shengong: '正常', bchao: '正常' },
          { date: '2010-01-01', height: '1.70', weight: '67.0', gangong: '正常', xuetang: '100', Cholesterol: '40',
            danguchun: '50', TG: '40', HDL_Cholesterol: '40', LDL_Cholesterol: '40', shengong: '正常', bchao: '正常' },
          { date: '2010-01-01', height: '1.70', weight: '67.0', gangong: '正常', xuetang: '100', Cholesterol: '40',
            danguchun: '50', TG: '40', HDL_Cholesterol: '40', LDL_Cholesterol: '40', shengong: '正常', bchao: '正常' }
        ],
        realTimeData: [
          { date: '2017-04-12 1:00', step: 0, heartRate: 70, bloodGlucose: 4.00 },
          { date: '2017-08-01 2:00', step: 0, heartRate: 70, bloodGlucose: 4.00 },
          { date: '2017-11-22 3:00', step: 0, heartRate: 70, bloodGlucose: 4.00 },
          { date: '2018-01-02 4:00', step: 30, heartRate: 85, bloodGlucose: 4.00 },
          { date: '2018-02-02 5:00', step: 80, heartRate: 85, bloodGlucose: 4.00 },
          { date: '2018-03-02 6:00', step: 200, heartRate: 85, bloodGlucose: 6.00 },
          { date: '2018-04-02 7:00', step: 500, heartRate: 85, bloodGlucose: 5.00 }
        ],
        activityData: [
          { time: '2018-04-13 07:00', value: '吃早饭' },
          { time: '2018-04-13 10:00', value: '公园散步' },
          { time: '2018-04-13 12:00', value: '吃午饭' },
          { time: '2018-04-13 13:30', value: '午休' },
          { time: '2018-04-13 17:30', value: '吃完饭' },
          { time: '2018-04-13 19:00', value: '吃药' },
          { time: '2018-04-13 19:30', value: '跳广场舞' },
          { time: '2018-04-13 21:30', value: '睡觉' }
        ],
        dailyStatistic: [
          { name: '饮水量', value: 2200 },
          { name: '运动量', value: 5000 },
          { name: '睡眠时间', value: 2 }
        ]
      }
    }
  },
  computed: {
    // ...mapGetters([
    //   'name',
    //   // 'avatar',
    //   'roles'
    // ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .userDetail-container {
    background-color: #C0D9D9;
    min-height: 100vh;

    .qucik-select {
      background-color: #fff;
      border-bottom: 1px solid #d8dce5;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
      &:first-child {
        padding-left: 20px;
      }
      .el-col{
        height: 110px;
        width: 110px;
        overflow: hidden;
        img {
          height: 100px;
          width: 100px;
          margin: 5px 0;
          width: expression(this.width > 100 ? 100:true);
          height: expression(this.height > 100 ? 100:true);
          border-radius: 50px;
          // vertical-align: middle;
        }
      }
    }

    .resume {
      .avatar {
        display: block;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        position: relative;
      }
      .el-row {
        margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .el-container{
      margin: 0 60px;
      .el-header {
        font: 24px "Microsoft YaHei",微软雅黑;
        margin-top: 10px;
        line-height: 60px;
        border-bottom: 1px solid #000;
      }
    }
  }
</style>