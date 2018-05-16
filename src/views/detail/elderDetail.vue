<template>
  <div class="elder-container">
    <!-- 个人信息 -->
    <el-row>
      <el-col>
        <el-container class="resume">
          <el-aside width="40%">
            <img class="avatar" :src="elderDetail.avatar">
          </el-aside>
          <el-main>
            <el-row>
                <el-col :span="4" :offset="0">姓名:</el-col>
                <el-col :span="8">{{ elderDetail.name }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4" :offset="0">性别:</el-col>
                <el-col :span="8">{{ elderDetail.sex }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4" :offset="0">年龄:</el-col>
                <el-col :span="8"><span v-text="age(elderDetail.birthday)"></span></el-col>
            </el-row>
            <el-row>
                <el-col :span="4" :offset="0">生日:</el-col>
                <el-col :span="8">{{ elderDetail.birthday }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4" :offset="0">入院时间:</el-col>
                <el-col :span="8">{{ elderDetail.inHospital }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4" :offset="0">主治医师:</el-col>
                <el-col :span="8">{{ elderDetail.nurseName }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4" :offset="0">床位信息:</el-col>
                <el-col :span="8">{{ elderDetail.bed }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="6" :offset="0">家属联系方式:</el-col>
                <el-col :span="12">{{ elderDetail.tel }}</el-col>
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
            {{ medicalrecord.content }}
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
            <el-table border :data="doctorAdvice" style="width: auto;margin: 0 auto;">
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
                  <div v-for="(item, index) in activityData" :key="index">{{ item.time }} &nbsp;&nbsp;&nbsp;&nbsp; {{ item.value }}</div>
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
            <el-table border max-height="300" :data="examination" style="width: auto;margin: 0 auto;">
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
import { elderDetail, medicalrecord, advice, examination, activityData } from '@/api/detail'
import { jsGetAge } from '@/utils'
import BMap from '@/components/BaiduMap'
import LineChart from './components/lineMarker'
import gaugeChart from './components/gaugeChart'

export default {
  name: 'elderDetail',
  components: { BMap, LineChart, gaugeChart },
  data() {
    return {
      elder: {},
      elderDetail: {},
      doctorAdvice: [],
      center: {},
      medicalrecord: {},
      examination: [],
      realTimeData: [],
      activityData: [],
      dailyStatistic: []
    }
  },
  created() {
    // this.getData(this.$route.params.elderId)
    const id = this.$route.params.elderId
    this.getElderDetail(id)
    this.getMedicalRecord(id)
    this.getAdvice(id)
    this.getExamination(id)
    this.getActivityData(id)
    this.getData()
  },
  beforeRouteUpdate(to, from, next) {
    const id = to.params.elderId
    this.getElderDetail(id)
    this.getMedicalRecord(id)
    this.getAdvice(id)
    this.getExamination(id)
    this.getActivityData(id)
    this.getData()
    next()
  },
  methods: {
    getData() {
      // const id = this.$route.params.elderId
      this.elder = {
        center: {
          lng: 104.108133,
          lat: 30.680945
        },
        // examination: [
        //   { date: '2010-01-01', height: '1.70', weight: '67.0', gangong: '正常', xuetang: '100', Cholesterol: '40',
        //     danguchun: '50', TG: '40', HDL_Cholesterol: '40', LDL_Cholesterol: '40', shengong: '正常', bchao: '正常' },
        //   { date: '2010-01-01', height: '1.70', weight: '67.0', gangong: '正常', xuetang: '100', Cholesterol: '40',
        //     danguchun: '50', TG: '40', HDL_Cholesterol: '40', LDL_Cholesterol: '40', shengong: '正常', bchao: '正常' },
        //   { date: '2010-01-01', height: '1.70', weight: '67.0', gangong: '正常', xuetang: '100', Cholesterol: '40',
        //     danguchun: '50', TG: '40', HDL_Cholesterol: '40', LDL_Cholesterol: '40', shengong: '正常', bchao: '正常' },
        //   { date: '2010-01-01', height: '1.70', weight: '67.0', gangong: '正常', xuetang: '100', Cholesterol: '40',
        //     danguchun: '50', TG: '40', HDL_Cholesterol: '40', LDL_Cholesterol: '40', shengong: '正常', bchao: '正常' },
        //   { date: '2010-01-01', height: '1.70', weight: '67.0', gangong: '正常', xuetang: '100', Cholesterol: '40',
        //     danguchun: '50', TG: '40', HDL_Cholesterol: '40', LDL_Cholesterol: '40', shengong: '正常', bchao: '正常' }
        // ],
        realTimeData: [
          { date: '2017-04-12 1:00', step: 0, heartRate: 70, bloodGlucose: 4.00 },
          { date: '2017-08-01 2:00', step: 0, heartRate: 70, bloodGlucose: 4.00 },
          { date: '2017-11-22 3:00', step: 0, heartRate: 70, bloodGlucose: 4.00 },
          { date: '2018-01-02 4:00', step: 30, heartRate: 85, bloodGlucose: 4.00 },
          { date: '2018-02-02 5:00', step: 80, heartRate: 85, bloodGlucose: 4.00 },
          { date: '2018-03-02 6:00', step: 200, heartRate: 85, bloodGlucose: 6.00 },
          { date: '2018-04-02 7:00', step: 500, heartRate: 85, bloodGlucose: 5.00 }
        ],
        // activityData: [
        //   { time: '2018-04-13 07:00', value: '吃早饭' },
        //   { time: '2018-04-13 10:00', value: '公园散步' },
        //   { time: '2018-04-13 12:00', value: '吃午饭' },
        //   { time: '2018-04-13 13:30', value: '午休' },
        //   { time: '2018-04-13 17:30', value: '吃完饭' },
        //   { time: '2018-04-13 19:00', value: '吃药' },
        //   { time: '2018-04-13 19:30', value: '跳广场舞' },
        //   { time: '2018-04-13 21:30', value: '睡觉' }
        // ],
        dailyStatistic: [
          { name: '饮水量', value: 2200 },
          { name: '运动量', value: 5000 },
          { name: '睡眠时间', value: 2 }
        ]
      }
    },
    getElderDetail(id) {
      elderDetail(id).then(res => {
        if (res.data.code !== 0) {
          this.$message.error('基本信息加载失败')
          console.log(res)
        }
        this.elderDetail = res.data.data
        console.log(this.elder)
      })
    },
    getMedicalRecord(id) {
      medicalrecord(id).then(res => {
        if (res.data.code !== 0) {
          this.$message.error('医嘱加载失败')
          console.log(res)
        }
        this.medicalrecord = res.data.data
      })
      // this.medicalrecord = { content: 'aaaa' }
    },
    getAdvice(id) {
      function evil(fn) {
        var Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
        return Fn('return ' + fn)()
      }

      advice(id).then(res => {
        if (res.data.code !== 0) {
          this.$message.error('医嘱加载失败')
          console.log(res)
        }
        this.doctorAdvice = evil('(' + res.data.data + ')')
      })
    },
    getCenter(id) {

    },
    getExamination(id) {
      examination(id).then(res => {
        if (res.data.code !== 0) {
          this.$message.error('医嘱加载失败')
          console.log(res)
        }
        this.examination = res.data.data
      })
    },
    getRealTimeData(id) {

    },
    getActivityData(id) {
      activityData(id).then(res => {
        if (res.data.code !== 0) {
          this.$message.error('运动事件加载失败')
          console.log(res)
        }
        this.activityData = res.data.data
      })
    },
    getDailyStatistic(id) {

    },
    age(birthday) {
      return jsGetAge(birthday)
    }
  },
  computed: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.elder-container {
  min-height: 100vh;
  padding: 20px 50px 0;
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
    .el-header {
      font: 24px "Microsoft YaHei",微软雅黑;
      margin-top: 10px;
      line-height: 60px;
      border-bottom: 1px solid #000;
    }
  }
}
</style>

