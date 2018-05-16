<template>
  <div class="dashboard-editor-container">
    <!-- 快速选择栏 适用于关联多个老人的情况 -->
    <el-row class="quick-select" :gutter="20">
      <el-col v-for="item in ids" :key="item.id">
        <router-link :to="{ name: 'userDetail', params: { elderId: item.id }}"><img :src="item.avatar"></router-link>
      </el-col>
      <!-- <el-col><router-link :to="{ name: 'userDetail', params: { elderId: 1 }}"><img :src="avatar"></router-link></el-col> -->
    </el-row>
    
    <!-- 个人信息 -->
    <el-row>
      <el-col>
        <el-container class="resume">
          <el-aside width="40%">
            <img class="avatar" :src="elderDetail[0].avatar">
          </el-aside>
          <el-main>
            <el-row>
                <el-col :span="4" :offset="0">姓名:</el-col>
                <el-col :span="8">{{ elderDetail[0].name }}</el-col>
                <el-col :span="4" :push="8"><router-link :to="{ name: 'userDetail', params: { elderId: elderDetail[0].id }}">详情</router-link></el-col>
            </el-row>
            <el-row>
                <el-col :span="4" :offset="0">性别:</el-col>
                <el-col :span="8">{{ elderDetail[0].sex }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4" :offset="0">年龄:</el-col>
                <el-col :span="8"><span v-text="age(elderDetail[0].birthday)"></span></el-col>
            </el-row>
            <el-row>
                <el-col :span="4" :offset="0">生日:</el-col>
                <el-col :span="8">{{ elderDetail[0].birthday }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4" :offset="0">入院时间:</el-col>
                <el-col :span="8">{{ elderDetail[0].inHospital }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4" :offset="0">主治医师:</el-col>
                <el-col :span="8">{{ elderDetail[0].nurseName }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4" :offset="0">床位信息:</el-col>
                <el-col :span="8">{{ elderDetail[0].bed }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="6" :offset="0">家属联系方式:</el-col>
                <el-col :span="12">{{ elderDetail[0].tel }}</el-col>
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
                <b-map :name="elderDetail.name" :lng="elder.center.lng" :lat="elder.center.lat" :mapType="1"></b-map>
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
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
// import PanThumb from '@/components/PanThumb'
import BMap from '@/components/BaiduMap'
import { medicalrecord, advice, activityData } from '@/api/detail'
import { getFamilyElders } from '@/api/relation'
import { jsGetAge } from '@/utils'

export default {
  name: 'dashboard-editor',
  components: { BMap },
  data() {
    return {
      elderDetail: [],
      doctorAdvice: [],
      medicalrecord: {},
      activityData: [],
      elder: {
        center: {
          lng: 104.108133,
          lat: 30.680945
        }
      },
      ids: []
    }
  },
  computed: {
  },
  created() {
    this.getElderDetail()
    setTimeout(this.getMedicalRecord, 2000)
    setTimeout(this.getAdvice, 2000)
    setTimeout(this.getActivityData, 2000)
  },
  methods: {
    getElderDetail() {
      getFamilyElders().then(res => {
        if (res.data.code !== 0) {
          this.$message.error('基本信息加载失败')
          console.log(res)
        }
        this.elderDetail = res.data.data
        this.elderDetail.forEach(v => {
          this.ids.push({
            id: v.id,
            avatar: v.avatar
          })
        })
        this.$store.dispatch('GetFamilyElders', this.ids).then().catch(error => {
          console.log('store', error)
        })
        console.log(this.elderDetail)
      })
    },
    getMedicalRecord() {
      if (this.ids) {
        medicalrecord(this.ids[0].id).then(res => {
          if (res.data.code !== 0) {
            this.$message.error('医嘱加载失败')
            console.log(res)
          }
          this.medicalrecord = res.data.data
        })
      }
    },
    getAdvice() {
      function evil(fn) {
        var Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
        return Fn('return ' + fn)()
      }
      if (this.ids) {
        advice(this.ids[0].id).then(res => {
          if (res.data.code !== 0) {
            this.$message.error('医嘱加载失败')
            console.log(res)
          }
          this.doctorAdvice = evil('(' + res.data.data + ')')
        })
      }
    },
    getActivityData() {
      if (this.ids) {
        activityData(this.ids[0].id).then(res => {
          if (res.data.code !== 0) {
            this.$message.error('运动事件加载失败')
            console.log(res)
          }
          this.activityData = res.data.data
        })
      }
    },
    age(birthday) {
      return jsGetAge(birthday)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    background-color: #C0D9D9;
    min-height: 100vh;
    // padding: 0 50px;

    .quick-select {
      background-color: #fff;
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

    .el-container {
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
