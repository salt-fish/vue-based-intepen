<template>
  <div class="record-container">
    <el-form :inline="true" :model="searchQuery" class="search-form">
      <el-form-item label="老人身份证号">
        <el-input v-model="searchQuery.idCard" placeholder="老人身份证号"></el-input>
      </el-form-item>
      <el-form-item label="老人姓名">
        <el-input v-model="searchQuery.name" placeholder="老人姓名"></el-input>
      </el-form-item>
      <el-form-item label="选择时间">
        <el-date-picker v-model="searchQuery.timeRange" :clearable="false" style="width: 260px;" unlink-panels type="daterange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="pickerOption" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-button type="success" plain @click="newDialog">添加</el-button>
    </el-form>
    <el-table border :data="data" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <span>{{ props.row.record[0].content }}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" width="120" label="记录日期" prop="record[0].date"></el-table-column>
      <el-table-column header-align="center" width="80" label="记录编号" prop="record[0].id"></el-table-column>
      <el-table-column header-align="center" width="50" label="姓名" prop="name"></el-table-column>
      <el-table-column header-align="center" width="50" label="性别" prop="sex"></el-table-column>
      <el-table-column header-align="center" width="50" label="年龄" prop="birthday" :formatter="formatter"></el-table-column>
      <el-table-column header-align="center" label="身份证" prop="idCard"></el-table-column>
      <el-table-column header-align="center" width="80" label="主治医师" prop="docName"></el-table-column>
      <el-table-column header-align="center" label="操作" :width="roles.includes('admin') ? '250' : '150'" align="center">
        <template slot-scope="scope">
          <el-popover ref="refuse" placement="top-start" width="160" v-model="scope.row.visible">
            <p>确定要删除这条记录吗?</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
              <el-button size="mini" type="danger" @click="deleteRecord(scope.$index)">确认</el-button>
            </div>
          </el-popover>  
          <el-button v-if="roles.includes('admin')" size="mini" @click="eidtDialog(scope.$index)">编辑</el-button>
          <el-button v-if="roles.includes('admin')" size="mini" v-popover:refuse>删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog class="dialog" width="50%" :title="recordData[dialogDataIndex].name" center :visible.sync="editDialogVisibel">
      <el-row :gutter="20">
        <el-col :span="2" :offset="2">编号:</el-col>
        <el-col :span="4">{{ recordData[dialogDataIndex].record[0].id }}</el-col>
        <el-col :span="3" :offset="0">姓名:</el-col>
        <el-col :span="4">{{ recordData[dialogDataIndex].name }}</el-col>
        <el-col :span="2 " :offset="0">性别:</el-col>
        <el-col :span="4">{{ recordData[dialogDataIndex].sex }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2" :offset="2">年龄:</el-col>
        <el-col :span="4">{{ age(recordData[dialogDataIndex].birthday) }}</el-col>
        <el-col :span="4" :offset="0">主治医师:</el-col>
        <el-col :span="3">{{ recordData[dialogDataIndex].docName }}</el-col>
        <el-col :span="4" :offset="0">记录时间:</el-col>
        <el-col :span="4">{{ recordData[dialogDataIndex].record[0].date }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="2" :offset="2">病历:</el-col>
        <el-col :offset="2">
          <el-input type="textarea" style="width: 70%;" v-model="recordData[dialogDataIndex].record[0].content" :autosize="{ minRows: 2, maxRows: 4}">
          </el-input>
        </el-col>
      </el-row>

      <span slot="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="updateRecord">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog class="dialog" width="50%" title="新增体检信息" center :visible.sync="newDialogVisibel">
      <el-row :gutter="20">
        <el-col :span="2" :offset="2">编号:</el-col>
        <el-col :span="4">等待分配</el-col>
        <el-col :span="2" :offset="0">姓名:</el-col>
        <el-col :span="4">
          <el-select v-model="newData[0].elderId" placeholder="请选择">
            <el-option
              v-for="item in elderList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" :offset="0">主治医师:</el-col>
        <el-col :span="3">
          <el-select v-model="newData[0].nurseId" placeholder="请选择">
            <el-option
              v-for="item in doctorList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2" :offset="2">病历:</el-col>
        <el-col :offset="2">
          <el-input type="textarea" style="width: 70%;" v-model="newData[0].content" :autosize="{ minRows: 2, maxRows: 4}">
          </el-input>
        </el-col>
      </el-row>

      <span slot="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="updateRecord">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import
import { mapGetters } from 'vuex'
import { deepClone, objectMerge, getNowFormatDate, jsGetAge } from '@/utils'
import { getRecord, getRecordHistory, editRecord, addRecord, deleteRecord } from '@/api/documentation'
import { getElder } from '@/api/older'
import { getNurse } from '@/api/nurse'

export default {
  name: 'medicalrecord',
  data() {
    return {
      searchQuery: {
        idCard: '',
        name: '',
        timeRange: ''
      },
      pickerOption: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      recordData: [],
      doctorList: [],
      elderList: [],
      originData: {},
      newData: [{
        elderId: 0,
        nurseId: 0,

        date: getNowFormatDate().toString(),
        content: '',

        visible: false
      }],
      editDialogVisibel: false,
      dialogDataIndex: 0,
      newDialogVisibel: false,
      today: getNowFormatDate(),

      record: []
    }
  },
  created() {
    this.getElder()
    this.getDoctor()
    setTimeout(this.getList(), 1000)
  },
  methods: {
    getList() {
      getRecord(this.today).then(res => {
        if (res.data.code !== 0) {
          this.$message.error('列表初始化失败')
        }
        this.record = res.data.data
        console.log(this.record)
      }).catch(error => {
        console.log(error)
        this.$message.error('列表初始化失败')
      })
      setTimeout(this.dealData, 1000)
      // this.recordData = [
      //   { name: '吴xx', sex: '男', age: 21, idCard: 610302000000000000, docName: '小明', record: [{ id: '000001', elderId: 1,
      //     docId: 1, date: '2018-04-12', content: '---------病历------------' }],
      //   visible: false }
      // ]
    },
    dealData() {
      this.recordData = []
      this.record.forEach(value => {
        this.recordData.push({
          record: [value]
        })
      })

      this.recordData.map(v => {
        const t = this.elderList.filter(function(value) {
          if (value.id === v.record[0].elderId) {
            return value
          }
        })[0]
        if (t) {
          this.$set(v, 'sex', t.sex)
          this.$set(v, 'name', t.name)
          this.$set(v, 'birthady', t.birthady)
          this.$set(v, 'idCard', t.idCard)
          this.$set(v, 'visible', false)
        }

        const n = this.doctorList.filter(function(value) {
          if (value.id === v.record[0].nurseId) {
            return value
          }
        })[0]
        if (n) {
          this.$set(v, 'docName', n.name)
        }
      })
    },
    getDoctor() {
      getNurse().then(res => {
        if (res.data.code !== 0) {
          this.$message.error('列表初始化失败')
        }
        this.doctorList = res.data.data
        console.log(this.doctorList)
      }).catch(error => {
        console.log(error)
        this.$message.error('列表初始化失败')
      })
    },
    getElder() {
      getElder().then(res => {
        if (res.data.code !== 0) {
          this.$message.error('列表初始化失败')
        }
        this.elderList = res.data.data
        console.log(this.elderList)
      }).catch(error => {
        console.log(error)
        this.$message.error('列表初始化失败')
      })
      // this.elderList = [
      //   { name: '吴xx', id: 1 },
      //   { name: '李xx', id: 2 }
      // ]
    },
    updateRecord() {
      // 在做编辑时 要加入权限判断
      // this.$router.push({ name: 'elderDetail', params: { 2, id } })
      if (this.newDialogVisibel) {
        // new
        this.newDialogVisibel = false
        console.log('new')
        console.log(this.newData)
        addRecord(this.newData[0]).then(res => {
          if (res.data.code !== 0) {
            this.$message.error('添加失败')
            console.log(res)
          }
          this.getList()
        }).catch(error => {
          console.log(error)
          this.$message.error('添加失败')
        })
        this.newData = deepClone(this.originData)
      } else {
        // edit
        const tmp = this.recordData[this.dialogDataIndex]
        console.log('update:')
        console.log(tmp)
        editRecord(tmp.record[0]).then(res => {
          if (res.data.code !== 0) {
            this.$message.error('修改失败')
            console.log(res)
          }
          this.getList()
        }).catch(error => {
          console.log(error)
          this.$message.error('修改失败')
        })
        this.editDialogVisibel = false
      }
    },
    deleteRecord(dataIndex) {
      // ajax deleteNurse(this.data[dataIndex].id)
      const tmp = this.data[dataIndex]
      deleteRecord(tmp.record[0].id).then(res => {
        if (res.data.code !== 0) {
          this.$message.error('删除失败')
          console.log(res)
        }
        this.getList()
      }).catch(error => {
        console.log(error)
        this.$message.error('删除失败')
      })
      console.log(this.recordData)
    },
    cancel() {
      if (this.newDialogVisibel) {
        this.newData = this.originData
      } else {
        objectMerge(this.recordData[this.dialogDataIndex], this.originData)
      }
      this.editDialogVisibel = false
      this.newDialogVisibel = false
    },
    eidtDialog(dataIndex) {
      this.recordData.filter((v, index) => {
        if (v.record[0].id === this.data[dataIndex].record[0].id) {
          this.dialogDataIndex = index
        }
      })
      objectMerge(this.originData, this.recordData[this.dialogDataIndex])
      this.editDialogVisibel = true
    },
    newDialog() {
      this.newDialogVisibel = true
      this.originData = deepClone(this.newData)
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
    ...mapGetters([
      'roles'
    ]),
    data: function() {
      var query = this.searchQuery

      if (query.timeRange !== this.today && query.timeRange !== '') {
        if (query.timeRange[0] !== this.today || query.timeRange[1] !== this.today) {
          // ajax 更新列表
          // 参数 searhQuery.timeRange字符串数组
          getRecordHistory(query.timeRange).then(res => {
            if (res.data.code !== 0) {
              this.$message.error('列表初始化失败')
            }
            this.examination = res.data.data
            console.log('search', this.examination)
          }).catch(error => {
            console.log(error)
            this.$message.error('列表初始化失败')
          })
          setTimeout(this.dealData, 1000)
          this.searchQuery.timeRange = ''
        }
      }

      if (query.idCard !== '' && query.name !== '') {
        return this.recordData.filter(function(value) {
          if (value.idCard.toString().indexOf(query.idCard) >= 0 && value.name.indexOf(query.name) >= 0) {
            return value
          }
        })
      } else if (query.idCard !== '' && query.name === '') {
        return this.recordData.filter(function(value) {
          if (value.idCard.toString().indexOf(query.idCard) >= 0) {
            return value
          }
        })
      } else if (query.idCard === '' && query.name !== '') {
        return this.recordData.filter(function(value) {
          if (value.name.indexOf(query.name) >= 0) {
            return value
          }
        })
      } else if (query.idCard === '' && query.name === '') {
        return this.recordData
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.record-container {
  min-height: 100vh;
  padding: 20px 50px 0;
  .search-form {
    padding-left: 20px;
  }

  .dialog {
    .el-row {
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>

<style>
.el-input-group__append {
  padding: 1px 2px;
}
</style>
