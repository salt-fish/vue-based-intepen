<template>
  <div class="nurse-container">
    <!-- 个人信息 -->
    <el-row>
      <el-col>
        <el-container class="resume">
          <el-aside width="40%">
            <img class="avatar" :src="nurse.avatar">
          </el-aside>
          <el-main>
            <el-row>
                <el-col :span="4" :offset="0">工号:</el-col>
                <el-col :span="8">{{ nurse.id }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4" :offset="0">姓名:</el-col>
                <el-col :span="8">{{ nurse.name }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4" :offset="0">性别:</el-col>
                <el-col :span="8">{{ nurse.sex }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4" :offset="0">年龄:</el-col>
                <el-col :span="8">{{ nurse.age }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4" :offset="0">工作经验:</el-col>
                <el-col :span="8">{{ nurse.time }}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4" :offset="0">评分:</el-col>
                <el-col :span="8">{{ nurse.rate }}</el-col>
            </el-row>
          </el-main>
        </el-container>
      </el-col>
    </el-row>

    <!-- 个人介绍 -->
    <el-row>
      <el-col>
        <el-container>
          <el-header>
            个人介绍
          </el-header>
          <el-main>
            {{ nurse.introduction }}
          </el-main>
        </el-container>
      </el-col>
    </el-row>

    <!-- 评价 -->
    <el-row>
      <el-col>
        <el-container>
          <el-header>
            评价
          </el-header>
          <el-main>
            {{ nurse.evaluation }}
          </el-main>
        </el-container>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import BMap from '@/components/BaiduMap'

export default {
  name: 'nurseDetail',
  components: { BMap },
  data() {
    return {
      nurse: {}
    }
  },
  created() {
    // this.getData(this.$route.params.nurseId)
    this.getData()
  },
  beforeRouteUpdate(to, from, next) {
    this.getData()
    next()
  },
  methods: {
    getData() {
      // const id = this.$route.params.nurseId
      this.nurse = {
        id: 110,
        name: '吴XX',
        sex: '男',
        age: 12,
        rate: 10,
        time: 10,
        avatar: require('../../assets/images/avatar.jpg'),
        introduction: '------------ 个人介绍 --------------',
        evaluation: '------------ 评价 -------------'
      }
    }
  },
  computed: {}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.nurse-container {
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

