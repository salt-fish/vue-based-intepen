<template>
  <div class="relation-container">
    <el-form :inline="true" :model="searchQuery" class="search-form">
      <el-form-item label="老人身份证号">
        <el-input v-model="searchQuery.idCard" placeholder="老人身份证号"></el-input>
      </el-form-item>
      <el-form-item label="老人姓名">
        <el-input v-model="searchQuery.name" placeholder="老人姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="elderData" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
            <el-container class="resume">
              <el-aside width="40%">
                <img class="avatar" :src="props.row.avatar">
              </el-aside>
              <el-main>
                <el-form label-position="right" class="relation-table-expand">
                  <el-form-item label="姓名">
                    <span>{{ props.row.name }}</span>
                  </el-form-item>
                  <el-form-item label="性别">
                    <span>{{ props.row.sex }}</span>
                  </el-form-item>
                  <el-form-item label="年龄">
                    <span>{{ props.row.age }}岁</span>
                  </el-form-item>
                  <el-form-item label="身份证号">
                    <span>{{ props.row.idCard }}</span>
                  </el-form-item>
                  <el-form-item label="生日">
                    <span>{{ props.row.birthday }}</span>
                  </el-form-item>
                  <el-form-item label="入院时间">
                    <span>{{ props.row.inHospital }}</span>
                  </el-form-item>
                  <el-form-item label="床位">
                    <span>{{ props.row.bed }}</span>
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
      <el-table-column label="入院时间" prop="inHospital"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <!-- flag： 0. 未申请 1. 已申请 2. 审批中 -->
          <el-popover ref="refuse" placement="top-start" width="160" v-model="scope.row.visible">
            <p>确定要取消关联这位老人吗?</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
              <el-button size="mini" type="danger" @click="refuseRelation(scope.$index)">确认</el-button>
            </div>
          </el-popover>  
          <el-button v-if="scope.row.flag === 0" style="width: 100px;" size="mini" @click="applyRelation(scope.$index)">关联</el-button>
          <el-button v-else-if="scope.row.flag === 2" style="width: 100px;" size="mini" type="warning" disabled>审批中</el-button>
          <el-button v-else="scope.row.flag === 1" style="width: 100px;" size="mini" type="danger" v-popover:refuse>取消关联</el-button>
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
      elderData: [],
      searchQuery: {
        idCard: '',
        name: ''
      }
    }
  },
  methods: {
    applyRelation(index) {
      // ajax applyNurse(id)
      var id = this.elderData[index].id
      console.log(id)
    },
    refuseNurse(index) {
      // ajax refuseNurse(id)
      this.elderData[index].flag = 2
      this.elderData[index].visible = false
      console.log(this.elderData)
    },
    search() {
      // ajax searchQuery
      this.elderData = [
        { id: 110, name: '吴xx', sex: '男', age: 233, idCard: 1111111111, birthday: '2000-01-01', inHospital: '2017-10-01', bed: '2楼222室2床', avatar: require('../../assets/images/avatar.jpg'), flag: 0, visible: false }
      ]
    }
  },
  computed: {}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.relation-container {
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
  .relation-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
  }
}
</style>

