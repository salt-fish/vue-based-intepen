<template>
  <div class="relation-container">
    <el-form :inline="true" :model="searchQuery" class="search-form">
      <el-form-item label="老人身份证号">
        <el-input v-model="searchQuery.idCard" placeholder="老人身份证号"></el-input>
      </el-form-item>
      <el-form-item label="老人姓名">
        <el-input v-model="searchQuery.name" placeholder="老人姓名"></el-input>
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
                <el-form label-position="right" class="relation-table-expand">
                  <el-form-item label="姓名">
                    <span>{{ props.row.name }}</span>
                  </el-form-item>
                  <el-form-item label="性别">
                    <span>{{ props.row.sex }}</span>
                  </el-form-item>
                  <el-form-item label="年龄">
                    <span>{{ age(props.row.birthday) }}岁</span>
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
      <el-table-column label="年龄" prop="birthday" :formatter="formatter"></el-table-column>
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

    <el-dialog class="dialog" title="关联" center :visible.sync="editDialogVisibel">
      <el-form :inline="true" :model="relationList" style="left: 5%; position: relative;">
        <el-form-item label="老人名称">
          <el-input v-model="elderData[dialogDataIndex].name" size="mini" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="关联家属">
          <el-select v-model="relationList.userId" placeholder="请选择">
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联设备">
          <el-select v-model="relationList.watchId" placeholder="请选择">
            <el-option
              v-for="item in watchList"
              :key="item.id"
              :label="item.mac"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      
      <span slot="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import
import { getElder } from '@/api/older'
import { getFamilyList, getRelation } from '@/api/relation'
import { jsGetAge } from '@/utils'

export default {
  data() {
    return {
      elderData: [],
      userList: [],
      watchList: [],
      searchQuery: {
        idCard: '',
        name: ''
      },
      editDialogVisibel: false,
      dialogDataIndex: 0,
      relationList: {
        elderId: 0,
        userId: 0,
        watchId: 0
      }
    }
  },
  created() {
    this.getElderList()
    this.getUserList()
    this.getWatchList()
  },
  methods: {
    getElderList() {
      getElder().then(res => {
        if (res.data.code !== 0) {
          this.$message.error('列表初始化失败')
        }
        this.elderData = res.data.data
        this.elderData.map(v => {
          this.$set(v, 'visible', false)
          this.$set(v, 'flag', 0)
        })
        console.log(this.elderData)
      }).catch(error => {
        console.log(error)
        this.$message.error('列表初始化失败')
      })
      // this.elderData = [
      //   { id: 110, name: '吴xx', sex: '男', age: 233, idCard: 1111111111, birthday: '2000-01-01', inHospital: '2017-10-01', bed: '2楼222室2床', avatar: require('../../assets/images/avatar.jpg'), flag: 0, visible: false },
      //   { id: 111, name: '吴xx', sex: '男', age: 233, idCard: 1111111111, birthday: '2000-01-01', inHospital: '2017-10-01', bed: '2楼222室2床', avatar: require('../../assets/images/avatar.jpg'), flag: 0, visible: false }
      // ]
    },
    getUserList() {
      getFamilyList().then(res => {
        if (res.data.code !== 0) {
          this.$message.error('列表初始化失败')
        }
        this.userList = res.data.data
        console.log(this.userList)
      }).catch(error => {
        console.log(error)
        this.$message.error('列表初始化失败')
      })
      // this.userList = [
      //   { id: 1, name: '小刚' },
      //   { id: 2, name: '小hong' }
      // ]
    },
    getWatchList() {
      this.watchList = [
        { id: 1, mac: 'werwrwerwr' },
        { id: 2, mac: 'aaaaaaaaaaa' }
      ]
    },
    applyRelation(dataIndex) {
      // ajax applyNurse(id)
      // var id = this.elderData[index].id
      this.elderData.filter((v, index) => {
        if (v.id === this.data[dataIndex].id) {
          this.dialogDataIndex = index
        }
      })
      this.editDialogVisibel = true
    },
    submit() {
      this.relationList.elderId = this.elderData[this.dialogDataIndex].id
      console.log(this.relationList)
      this.editDialogVisibel = false
      getRelation(this.relationList.elderId, this.relationList.userId).then(res => {
        if (res.data.code !== 0) {
          this.$message.error(res.data.error)
          console.log(res)
        } else {
          this.$message.success('关联成功')
          this.relationList.elderId = 0
          this.relationList.userId = 0
        }
        console.log(this.relationList)
      }).catch(error => {
        console.log(error)
        this.$message.error('关联失败')
      })
      // this.relationList.elderId = 0
      // this.relationList.userId = 0
      // this.relationList.watchId = 0
    },
    cancel() {
      this.editDialogVisibel = false
      this.relationList.elderId = 0
      this.relationList.userId = 0
      this.relationList.watchId = 0
    },
    refuseNurse(index) {
      // ajax refuseNurse(id)
      this.elderData[index].flag = 2
      this.elderData[index].visible = false
      console.log(this.elderData)
    },
    age(birthday) {
      return jsGetAge(birthday)
    },
    formatter(row, column, cellValue) {
      if (cellValue) {
        return jsGetAge(cellValue)
      }
    }
  },
  computed: {
    data: function() {
      var query = this.searchQuery
      if (query.idCard !== '' && query.name !== '') {
        return this.elderData.filter(function(value) {
          if (value.idCard.toString().indexOf(query.idCard) >= 0 && value.name.indexOf(query.name) >= 0) {
            return value
          }
        })
      } else if (query.idCard !== '' && query.name === '') {
        return this.elderData.filter(function(value) {
          if (value.idCard.toString().indexOf(query.idCard) >= 0) {
            return value
          }
        })
      } else if (query.idCard === '' && query.name !== '') {
        return this.elderData.filter(function(value) {
          if (value.name.indexOf(query.name) >= 0) {
            return value
          }
        })
      } else if (query.idCard === '' && query.name === '') {
        return this.elderData
      }
    }
  }
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

