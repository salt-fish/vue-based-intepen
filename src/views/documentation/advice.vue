<template>
  <div class="advice-container">
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
            <el-table border :data="props.row.advice[0].content" style="width: auto;margin: 0 auto;">
              <el-table-column prop="name" label="药名"></el-table-column>
              <el-table-column prop="time" label="吃药时间" ></el-table-column>
              <el-table-column prop="dose" label="剂量" ></el-table-column>
            </el-table>
        </template>
      </el-table-column>
      <el-table-column header-align="center" width="120" label="医嘱日期" prop="advice[0].date"></el-table-column>
      <el-table-column header-align="center" width="80" label="医嘱编号" prop="advice[0].id"></el-table-column>
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

    <el-dialog class="dialog" width="90%" :title="adviceData[dialogDataIndex].name" center :visible.sync="editDialogVisibel">
      <el-row :gutter="20">
        <el-col :span="2" :offset="2">编号:</el-col>
        <el-col :span="4">{{ adviceData[dialogDataIndex].advice[0].id }}</el-col>
        <el-col :span="3" :offset="0">姓名:</el-col>
        <el-col :span="4">{{ adviceData[dialogDataIndex].name }}</el-col>
        <el-col :span="2 " :offset="0">性别:</el-col>
        <el-col :span="4">{{ adviceData[dialogDataIndex].sex }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2" :offset="2">年龄:</el-col>
        <el-col :span="4">{{ age(adviceData[dialogDataIndex].birthday) }}</el-col>
        <el-col :span="4" :offset="0">主治医师:</el-col>
        <el-col :span="4">{{ adviceData[dialogDataIndex].docName }}</el-col>
        <el-col :span="4" :offset="0">记录时间:</el-col>
        <el-col :span="4">{{ adviceData[dialogDataIndex].advice[0].date }}</el-col>
      </el-row>
  
      <el-table border height="250" :data="adviceData[dialogDataIndex].advice[0].content" style="width: auto;margin: 0 auto;">
        <el-table-column label="药名">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.name"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="吃药时间">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="时间范围: 05:30 - 22:30" placement="bottom">
              <el-time-select :clearable="false" size="mini" v-model="scope.row.time" :picker-options="{ start: '05:30', step: '00:30', end: '22:30' }" placeholder="选择时间">
              </el-time-select>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="剂量">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.dose"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope"> 
            <el-button size="mini" @click.prevent="remove(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button @click="add">增加用药</el-button>
        <el-button type="primary" @click="updateRecord">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog class="dialog" width="90%" title="新增医嘱" center :visible.sync="newDialogVisibel">
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
        <el-col :span="4">
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

      <el-table border height="250" :data="newData[0].content" style="width: auto;margin: 0 auto;">
        <el-table-column label="药名">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.name"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="吃药时间">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="时间范围: 05:30 - 22:30" placement="bottom">
              <el-time-select :clearable="false" size="mini" v-model="scope.row.time" :picker-options="{ start: '05:30', step: '00:30', end: '22:30' }" placeholder="选择时间">
              </el-time-select>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="剂量">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.dose"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope"> 
            <el-button size="mini" @click.prevent="remove(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button @click="add">增加用药</el-button>
        <el-button type="primary" @click="updateRecord">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import
import { mapGetters } from 'vuex'
import { deepClone, objectMerge, getNowFormatDate, jsGetAge } from '@/utils'
import { getAdvice, editAdvice, addAdvice, deleteAdvice } from '@/api/documentation'
import { getElder } from '@/api/older'
import { getNurse } from '@/api/nurse'

export default {
  name: 'advice',
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
      adviceData: [],
      doctorList: [],
      elderList: [],
      originData: {},
      newData: [{
        elderId: 0,
        nurseId: 0,

        date: getNowFormatDate().toString(),
        content: [
          { name: '', time: '', dose: '' }
        ],

        visible: false
      }],
      editDialogVisibel: false,
      dialogDataIndex: 0,
      newDialogVisibel: false,
      today: getNowFormatDate()
    }
  },
  created() {
    this.getDoctor()
    this.getElder()
    setTimeout(this.getList(), 1000)
  },
  methods: {
    getList() {
      getAdvice(this.today).then(res => {
        if (res.data.code !== 0) {
          this.$message.error('列表初始化失败')
        }
        this.adviceData = res.data.data
      }).catch(error => {
        console.log(error)
        this.$message.error('列表初始化失败')
      })
      setTimeout(this.dealData, 1000)
      // this.adviceData = [
      //   { name: '吴xx', sex: '男', age: 21, idCard: 610302000000000000, docName: '小明',
      //     advice: [
      //       { id: '000001', elderId: 1, docId: 1, date: '2018-04-12' },
      //       { content: [
      //         { name: '头孢', time: '下午3点', dose: '2' },
      //         { name: 'a', time: '13', dose: '3' },
      //         { name: 'a', time: '13', dose: '3' },
      //         { name: 'a', time: '13', dose: '3' },
      //         { name: 'a', time: '13', dose: '3' }
      //       ]
      //       }
      //     ],
      //     visible: false
      //   }
      // ]
    },
    dealData() {
      function evil(fn) {
        var Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
        return Fn('return ' + fn)()
      }

      this.adviceData.map(v => {
        this.$set(v, 'visible', false)
      })

      this.adviceData.forEach(value => {
        value.advice[0].content = evil('(' + value.advice[0].content + ')')
      })
      console.log(this.adviceData)
      // this.adviceData.forEach(value => {
      //   const t = value.advice[0].content.split('&&')
      //   console.log('t', t)
      //   const n = []
      //   t.forEach(v => {
      //     // v = evil('(' + v + ')')
      //     v = (new Function('', 'return' + '(' + v + ')')())
      //     n.push({
      //       name: v.name,
      //       time: v.time,
      //       dose: v.dose
      //     })
      //   })
      //   value.advice[0].content = n
      // })
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
        if (this.newData[0].content.filter(v => {
          if (v.name === '') {
            alert('药名不能为空!')
            return v
          }
        }).length !== 0) {
          return false
        }
        this.newDialogVisibel = false
        console.log('new')
        console.log(this.newData)
        const tmp = this.newData[0]
        tmp.content = JSON.stringify(tmp.content)
        addAdvice(tmp).then(res => {
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
        const tmp = this.adviceData[this.dialogDataIndex]
        if (tmp.advice[0].content.filter(v => {
          if (v.name === '') {
            alert('药名不能为空!')
            return v
          }
        }).length !== 0) {
          return false
        }
        console.log('update:')
        console.log(tmp)

        // console.log(tmp.advice[0].content)
        tmp.advice[0].content = JSON.stringify(tmp.advice[0].content)
        // console.log(typeof JSON.stringify(tmp.advice[0].content))
        editAdvice(tmp.advice[0]).then(res => {
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
      deleteAdvice(tmp.advice[0].id).then(res => {
        if (res.data.code !== 0) {
          this.$message.error('删除失败')
          console.log(res)
        }
        this.getList()
      }).catch(error => {
        console.log(error)
        this.$message.error('删除失败')
      })
      console.log(this.adviceData)
    },
    cancel() {
      if (this.newDialogVisibel) {
        this.newData = this.originData
      } else {
        objectMerge(this.adviceData[this.dialogDataIndex], this.originData)
      }
      this.editDialogVisibel = false
      this.newDialogVisibel = false
    },
    eidtDialog(dataIndex) {
      this.adviceData.filter((v, index) => {
        if (v.advice[0].id === this.data[dataIndex].advice[0].id) {
          this.dialogDataIndex = index
        }
      })
      this.originData = deepClone(this.adviceData[this.dialogDataIndex])
      this.editDialogVisibel = true
    },
    newDialog() {
      this.newDialogVisibel = true
      this.originData = deepClone(this.newData)
    },
    add() {
      if (this.newDialogVisibel) {
        this.newData[0].content.push({
          name: '',
          time: '',
          dose: ''
        })
      } else {
        this.adviceData[this.dialogDataIndex].advice[0].content.push({
          name: '',
          time: '',
          dose: ''
        })
      }
    },
    remove(index) {
      if (this.newDialogVisibel) {
        this.newData[0].content.splice(index, 1)
      } else {
        this.adviceData[this.dialogDataIndex].advice[0].content.splice(index, 1)
      }
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
          // this.adviceData = []
          this.getList()
        }
      }

      if (query.idCard !== '' && query.name !== '') {
        return this.adviceData.filter(function(value) {
          if (value.idCard.toString().indexOf(query.idCard) >= 0 && value.name.indexOf(query.name) >= 0) {
            return value
          }
        })
      } else if (query.idCard !== '' && query.name === '') {
        return this.adviceData.filter(function(value) {
          if (value.idCard.toString().indexOf(query.idCard) >= 0) {
            return value
          }
        })
      } else if (query.idCard === '' && query.name !== '') {
        return this.adviceData.filter(function(value) {
          if (value.name.indexOf(query.name) >= 0) {
            return value
          }
        })
      } else if (query.idCard === '' && query.name === '') {
        return this.adviceData
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.advice-container {
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
