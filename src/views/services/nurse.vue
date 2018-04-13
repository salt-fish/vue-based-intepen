<template>
  <div class="nurse-container">
    <el-form :inline="true" :model="searchQuery" class="search-form">
      <el-form-item label="护工编号">
        <el-input v-model="searchQuery.id" placeholder="护工编号"></el-input>
      </el-form-item>
      <el-form-item label="护工姓名">
        <el-input v-model="searchQuery.name" placeholder="护工姓名"></el-input>
      </el-form-item>
      <el-form-item label="老人姓名">
        <el-select v-model="searchQuery.elder" placeholder="请选择老人">
          <el-option v-for="item in elderData" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-table :data="data" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
            <el-container class="resume">
              <el-aside width="40%">
                <img class="avatar" :src="props.row.avatar">
              </el-aside>
              <el-main>
                <el-form label-position="right" class="nurse-table-expand">
                  <el-form-item label="姓名">
                    <span>{{ props.row.name }}</span>
                  </el-form-item>
                  <el-form-item label="性别">
                    <span>{{ props.row.sex }}</span>
                  </el-form-item>
                  <el-form-item label="年龄">
                    <span>{{ props.row.age }}岁</span>
                  </el-form-item>
                  <el-form-item label="已有人数">
                    <span>{{ props.row.workload }}人</span>
                  </el-form-item>
                  <el-form-item label="评分">
                    <span>{{ props.row.rate }}分</span>
                  </el-form-item>
                  <el-form-item label="工作年限">
                    <span>{{ props.row.time }}年</span>
                  </el-form-item>
                  <el-form-item label="个人简介">
                    <span>{{ props.row.resume }}</span>
                  </el-form-item>
                </el-form>
              </el-main>
            </el-container>
        </template>
      </el-table-column>
      <el-table-column label="编号" prop="id"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="性别" prop="sex"></el-table-column>
      <el-table-column label="年龄" prop="age"></el-table-column>
      <el-table-column label="评分" prop="rate"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <!-- flag： 0. 未申请 1. 已申请 2. 审批中 -->
          <el-popover ref="refuse" placement="top-start" width="160" v-model="scope.row.visible">
            <p>确定要退订这位护工吗?</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
              <el-button size="mini" type="danger" @click="refuseNurse(scope.$index)">确认</el-button>
            </div>
          </el-popover>  
          <el-button v-if="scope.row.flag === 0" style="width: 100px;" size="mini" @click="applyNurse(scope.$index)">申请</el-button>
          <el-button v-else-if="scope.row.flag === 2" style="width: 100px;" size="mini" type="warning" disabled>审批中</el-button>
          <el-button v-else="scope.row.flag === 1" style="width: 100px;" size="mini" type="danger" v-popover:refuse>退订</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import

export default {
  data() {
    return {
      searchQuery: {
        id: '',
        name: '',
        elder: ''
      },
      nurseData: [],
      elderData: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      // ajax nurseData
      this.nurseData = [
        { id: 110, name: 'a', sex: 'man', age: 12, workload: 20, rate: 10, time: 10, resume: 'aaaaaaaaaaaaaaaaaaaaaaaa', avatar: require('../../assets/images/avatar.jpg'), flag: 0, visible: false },
        { id: 111, name: 'a', sex: 'female', age: 22, workload: 10, rate: 4, time: 3, resume: 'bbbbbbbbbbb', avatar: require('../../assets/images/avatar.jpg'), flag: 0, visible: false },
        { id: 112, name: 'c', sex: 'man', age: 12, workload: 20, rate: 10, time: 10, resume: 'cccccccccccccc', avatar: require('../../assets/images/avatar.jpg'), flag: 0, visible: false },
        { id: 113, name: 'd', sex: 'man', age: 12, workload: 20, rate: 10, time: 10, resume: 'ddddddddd', avatar: require('../../assets/images/avatar.jpg'), flag: 0, visible: false },
        { id: 114, name: 'e', sex: 'man', age: 12, workload: 20, rate: 10, time: 10, resume: 'eeeeee', avatar: require('../../assets/images/avatar.jpg'), flag: 0, visible: false }
      ]

      // ajax user--elder
      this.elderData = [
        { id: 1, name: '吴' },
        { id: 2, name: '王' }
      ]
    },
    applyNurse(index) {
      // ajax applyNurse(nurseId, elderId)
      var id = this.nurseData[index].id
      if (this.searchQuery.elder) {
        if (this.nurseData.filter(item => item.flag === 1 || item.flag === 2)) {
          const choosenElder = this.elderData.filter(item => item.id === this.searchQuery.elder)[0]
          this.$message({
            message: `您已经为${choosenElder.name}申请了护工，请退订或等待审批结果后再申请`,
            type: 'error'
          })
        }
      } else {
        this.$message({
          message: '请先选择要办理业务的老人',
          type: 'error'
        })
      }
      console.log(id)
    },
    refuseNurse(index) {
      // ajax refuseNurse(this.data[dataIndex].id)
      this.nurseData[index].flag = 2
      this.nurseData[index].visible = false
      console.log(this.nurseData)
    }
  },
  computed: {
    data: function() {
      var query = this.searchQuery

      if (query.elder) {
        // ajax nurse() 刷新护士表
        this.nurseData = [
          { id: 110, name: 'a', sex: 'man', age: 12, workload: 20, rate: 10, time: 10, resume: 'aaaaaaaaaaaaaaaaaaaaaaaa', avatar: require('../../assets/images/avatar.jpg'), flag: 1, visible: false },
          { id: 111, name: 'a', sex: 'female', age: 22, workload: 10, rate: 4, time: 3, resume: 'bbbbbbbbbbb', avatar: require('../../assets/images/avatar.jpg'), flag: 0, visible: false },
          { id: 112, name: 'c', sex: 'man', age: 12, workload: 20, rate: 10, time: 10, resume: 'cccccccccccccc', avatar: require('../../assets/images/avatar.jpg'), flag: 2, visible: false },
          { id: 113, name: 'd', sex: 'man', age: 12, workload: 20, rate: 10, time: 10, resume: 'ddddddddd', avatar: require('../../assets/images/avatar.jpg'), flag: 0, visible: false },
          { id: 114, name: 'e', sex: 'man', age: 12, workload: 20, rate: 10, time: 10, resume: 'eeeeee', avatar: require('../../assets/images/avatar.jpg'), flag: 1, visible: false }
        ]
      }

      if (query.id !== '' && query.name !== '') {
        return this.nurseData.filter(function(value) {
          if (value.id.toString().indexOf(query.id) >= 0 && value.name.indexOf(query.name) >= 0) {
            return value
          }
        })
      } else if (query.id !== '' && query.name === '') {
        return this.nurseData.filter(function(value) {
          if (value.id.toString().indexOf(query.id) >= 0) {
            return value
          }
        })
      } else if (query.id === '' && query.name !== '') {
        return this.nurseData.filter(function(value) {
          if (value.name.indexOf(query.name) >= 0) {
            return value
          }
        })
      } else if (query.id === '' && query.name === '') {
        return this.nurseData
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.nurse-container {
  min-height: 100vh;
  padding: 20px 50px 0;
  .search-form {
    padding-left: 20px;
  }
  .resume {
    .avatar {
      display: block;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      position: relative;
    }
  }
  .nurse-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
  }
}

</style>

