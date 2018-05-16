<template>
  <div class="app-container">
    <el-form :inline="true" :model="searchQuery" class="search-form">
      <el-form-item label="老人编号">
        <el-input v-model="searchQuery.id" style="width: 100px;" placeholder="老人编号"></el-input>
      </el-form-item>
      <el-form-item label="老人姓名">
        <el-input v-model="searchQuery.name" style="width: 100px;" placeholder="老人姓名"></el-input>
      </el-form-item>
      <el-form-item label="选择时间">
        <el-date-picker v-model="searchQuery.timeRange" :clearable="false" style="width: 300px;" unlink-panels type="daterange" range-separator="-" start-placeholder="开始时间" :picker-options="pickerOption" end-placeholder="结束时间" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-button type="success" plain @click="submitAll">全部提交</el-button>
    </el-form>
    <el-table border :data="data" style="width: 100%">
      <el-table-column header-align="center" width="100" label="编号" prop="id"></el-table-column>
      <el-table-column header-align="center" width="50" label="姓名" prop="name"></el-table-column>
      <el-table-column header-align="center" width="50" label="性别" prop="sex"></el-table-column>
      <el-table-column header-align="center" width="50" label="年龄" prop="birthday" :formatter="formatter"></el-table-column>
      <el-table-column header-align="center" width="80" label="主治医生" prop="nurseName"></el-table-column>
      <el-table-column header-align="center" width="120" label="记录日期" prop="date"></el-table-column>

      <el-table-column header-align="center" width="75" label="体温">
        <template slot-scope="scope">
          <template v-if="scope.row.edit1">
            <el-input @keyup.enter.native="doneEdit(scope.row, 'temperature')" @keyup.esc.native="cancelEdit(scope.row, 'temperature')" @blur="doneEdit(scope.row, 'temperature')" class="edit-input" size="small" v-model="scope.row.temperature"></el-input>
          </template>
          <span @dblclick="scope.row.edit1 = true" v-else>{{ scope.row.temperature }}℃</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" width="100" label="血压">
        <template slot-scope="scope">
          <template v-if="scope.row.edit2">
            <el-input @keyup.enter.native="doneEdit(scope.row, 'bloodPressure')" @keyup.esc.native="cancelEdit(scope.row, 'bloodPressure')" @blur="doneEdit(scope.row, 'bloodPressure')" class="edit-input" size="small" v-model="scope.row.bloodPressure"></el-input>
          </template>
          <span @dblclick="scope.row.edit2 = true" v-else>{{ scope.row.bloodPressure }}汞柱</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" label="身体状况">
        <template slot-scope="scope">
          <el-select v-model="scope.row.illnessId" :placeholder="scope.row.illName" @change="doneEdit(scope.row, 'illness')">
            <el-option v-for="item in illList" :key="item.id" :label="item.illnessName" :value="item.id">
            </el-option>
          </el-select>
        </template>
      </el-table-column>

      <el-table-column header-align="center" label="操作" align="center" width="250">
        <template slot-scope="scope">
          <el-button size="mini" @click="openDialog(scope.$index, false)">查看</el-button>
          <el-button v-if="scope.row.date === today" size="mini" @click="openDialog(scope.$index, true)">更多编辑</el-button>
          <el-button v-if="scope.row.date === today" size="mini" @click="submitOne(scope.$index)">提交</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog class="dialog" :title="'巡查详细信息:'+elderData[dialogDataIndex].date" center :visible.sync="dialogFormVisible">
      <el-form size="mini" :disabled="!dialogEdit" :model="elderData[dialogDataIndex]" style="margin-left: 100px;" :inline="true">
        <el-form-item label="编号" class="display-item">
          <span>{{ elderData[dialogDataIndex].id }}</span>
        </el-form-item>
        <el-form-item label="姓名" class="display-item">
          <span>{{ elderData[dialogDataIndex].name }}</span>
        </el-form-item>
        <el-form-item label="性别" class="display-item">
          <span>{{ elderData[dialogDataIndex].sex }}</span>
        </el-form-item>
        <el-form-item label="年龄" class="display-item">
          <span>{{ age(elderData[dialogDataIndex].birthday) }}</span>
        </el-form-item>
        <el-form-item label="联系电话" class="display-item">
          <span>{{ elderData[dialogDataIndex].tel }}</span>
        </el-form-item>
        <el-form-item label="主治医师" class="display-item">
          <span>{{ elderData[dialogDataIndex].nurseName }}</span>
        </el-form-item>
        
        <el-form-item label="体温" class="edit-item">
          <el-input @keyup.enter.native="doneEdit(elderData[dialogDataIndex], 'temperature')" @keyup.esc.native="cancelEdit(elderData[dialogDataIndex], 'temperature')" @blur="doneEdit(elderData[dialogDataIndex], 'temperature')" v-model="elderData[dialogDataIndex].temperature" :readonly="!dialogEdit">
            <template slot="append">℃</template>
          </el-input>
        </el-form-item>
        <el-form-item label="血压" class="edit-item">
          <el-input @keyup.enter.native="doneEdit(elderData[dialogDataIndex], 'bloodPressure')" @keyup.esc.native="cancelEdit(elderData[dialogDataIndex], 'bloodPressure')" @blur="doneEdit(elderData[dialogDataIndex], 'bloodPressure')" v-model="elderData[dialogDataIndex].bloodPressure" :readonly="!dialogEdit">
            <template slot="append">汞柱</template>
          </el-input>
        </el-form-item>
        <el-form-item label="身体状况" class="edit-item">
          <el-select v-if="dialogEdit" v-model="elderData[dialogDataIndex].illnessId" :placeholder="elderData[dialogDataIndex].illName" @change="doneEdit(elderData[dialogDataIndex], 'illness')">
            <el-option v-for="item in illList" :key="item.id" :label="item.illnessName" :value="item.id">
            </el-option>
          </el-select>
          <span v-else>{{ elderData[dialogDataIndex].illName }}</span>
        </el-form-item>
        <el-form-item label="详情" class="edit-item">
          <el-input type="textarea" v-model="elderData[dialogDataIndex].record" :autosize="{ minRows: 2, maxRows: 4}" :readonly="!dialogEdit">
          </el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getNowFormatDate, jsGetAge } from '@/utils'
import { getInspection, getHistoryInspection, illList, submitOneInspection, submitAllInspection } from '@/api/inspection'

export default {
  data() {
    return {
      searchQuery: {
        id: '',
        name: '',
        timeRange: ''
      },
      pickerOption: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      elderData: [],
      illList: [],
      dialogFormVisible: false,
      dialogEdit: false,
      dialogDataIndex: 0, // 关联elderData的下标，用于组建dialog的内容
      today: getNowFormatDate()
    }
  },
  created() {
    this.getIllList()
    setTimeout(this.getElderList(), 500)
  },
  methods: {
    getElderList() {
      // ajax 获取老人巡查列表
      // 参数 this.today
      getInspection(this.today).then(res => {
        if (res.data.code !== 0) {
          this.$message.error('列表初始化失败')
        }
        this.elderData = res.data.data.map(v => {
          if (v.date === this.today) {
            this.$set(v, 'edit1', false) // https://vuejs.org/v2/guide/reactivity.html
            this.$set(v, 'edit2', false) // https://vuejs.org/v2/guide/reactivity.html
            this.$set(v, 'illName', this.illList.filter(function(value) {
              if (value.id === v.illnessId) {
                return value
              }
            })[0].illnessName
            )

            v.originalTemperature = v.temperature
            v.originalBloodPressure = v.bloodPressure
            v.originalIllness = v.illnessId
          }
          return v
        })
        console.log(this.elderData)
      }).catch(error => {
        console.log(error)
        this.$message.error('列表初始化失败')
      })
      // this.elderData = [
      //   { id: 110, name: '吴xx', sex: '男', age: 233, idCard: 1111111111, birthday: '2000-01-01', date: this.today, temperature: '36', bloodPressure: '70/110', illness: 1, docName: '小明', record: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaa', tel: 13032885319 },
      //   { id: 111, name: '吴xx', sex: '男', age: 233, idCard: 1111111111, birthday: '2000-01-01', date: '2018-04-12', temperature: '36', bloodPressure: '70/110', illness: 2, docName: '小明', record: '', tel: 110 },
      //   { id: 112, name: '吴xx', sex: '男', age: 233, idCard: 1111111111, birthday: '2000-01-01', date: '2018-04-11', temperature: '36', bloodPressure: '70/110', illness: 3, docName: '小明', record: '', tel: 110 },
      //   { id: 113, name: '吴xx', sex: '男', age: 233, idCard: 1111111111, birthday: '2000-01-01', date: '2018-04-11', temperature: '36', bloodPressure: '70/110', illness: 4, docName: '小明', record: '', tel: 110 },
      //   { id: 114, name: '吴xx', sex: '男', age: 233, idCard: 1111111111, birthday: '2000-01-01', date: '2018-04-11', temperature: '36', bloodPressure: '70/110', illness: 1, docName: '小明', record: '', tel: 110 }
      // ].map(v => {
      //   if (v.date === this.today) {
      //     this.$set(v, 'edit1', false) // https://vuejs.org/v2/guide/reactivity.html
      //     this.$set(v, 'edit2', false) // https://vuejs.org/v2/guide/reactivity.html
      //     this.$set(v, 'illName', this.illList.filter(function(value) {
      //       if (value.id === v.illness) {
      //         return value
      //       }
      //     })[0].name
      //     )

      //     v.originalTemperature = v.temperature
      //     v.originalBloodPressure = v.bloodPressure
      //     v.originalIllness = v.illness
      //   }
      //   return v
      // })
    },
    getIllList() {
      // ajax 获取疾病列表
      illList().then(res => {
        if (res.data.code !== 0) {
          this.$message.error('疾病列表加载失败')
          console.log(res)
        }
        this.illList = res.data.data
        console.log(this.illList)
      })
      // this.illList = [
      //   { id: 1, name: '感冒' },
      //   { id: 2, name: '心脏病' },
      //   { id: 3, name: '高血压' },
      //   { id: 4, name: '肠炎' }
      // ]
    },
    doneEdit(row, name) {
      switch (name) {
        case 'temperature': row.originalTemperature = row.temperature; row.edit1 = false; break
        case 'bloodPressure': row.originalBloodPressure = row.bloodPressure; row.edit2 = false; break
        case 'illness': row.illName = this.illList.filter(function(value) {
          if (value.id === row.illnessId) {
            return value
          }
        })[0].name; break
        default: break
      }
      console.log(this.elderData)
    },
    cancelEdit(row, name) {
      switch (name) {
        case 'temperature': row.temperature = row.originalTemperature; row.edit1 = false; break
        case 'bloodPressure': row.bloodPressure = row.originalBloodPressure; row.edit2 = false; break
        default: break
      }
    },
    openDialog(dataIndex, edit) {
      this.dialogFormVisible = true
      this.dialogEdit = edit
      this.elderData.filter((v, index) => {
        if (v.id === this.data[dataIndex].id) {
          this.dialogDataIndex = index
        }
      })
    },
    submitOne(index) {
      // const { id } = this.elderData[index]
      // ajax params id data[]
      const data = this.elderData[index]
      submitOneInspection(data).then(res => {
        if (res.data.code !== 0) {
          this.$message.error('提交失败')
        }
        this.$message.success('修改成功')
      }).catch(error => {
        console.log(error)
        this.$message.error('提交失败')
      })
    },
    submitAll() {
      // ajax elderData
      submitAllInspection(this.elderData).then(res => {
        if (res.data.code !== 0) {
          this.$message.error('提交失败')
        }
        this.$message.success('修改成功')
      }).catch(error => {
        console.log(error)
        this.$message.error('提交失败')
      })
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

      if (query.timeRange !== this.today && query.timeRange !== '') {
        if (query.timeRange[0] !== this.today || query.timeRange[1] !== this.today) {
          // ajax 更新列表
          // 参数 searhQuery.timeRange字符串数组
          getHistoryInspection(query.timeRange).then(res => {
            if (res.data.code !== 0) {
              this.$message.error('列表初始化失败,这一天可能没有信息')
            }
            console.log(res.data.data)
            this.elderData = res.data.data.map(v => {
              if (v.date === this.today) {
                this.$set(v, 'edit1', false) // https://vuejs.org/v2/guide/reactivity.html
                this.$set(v, 'edit2', false) // https://vuejs.org/v2/guide/reactivity.html
                this.$set(v, 'illName', this.illList.filter(function(value) {
                  if (value.id === v.illnessId) {
                    return value
                  }
                })[0].illnessName
                )

                v.originalTemperature = v.temperature
                v.originalBloodPressure = v.bloodPressure
                v.originalIllness = v.illnessId
              } else {
                if (v.illnessId) {
                  this.$set(v, 'illName', this.illList.filter(function(value) {
                    if (value.id === v.illnessId) {
                      return value
                    }
                  })[0].illnessName
                  )
                }
              }
              return v
            })
            this.searchQuery.timeRange = ''
          }).catch(error => {
            console.log(error)
            this.$message.error('列表初始化失败,这一天可能没有信息')
          })
          // this.elderData = [
          //   { id: 110, name: '吴xx', sex: '男', age: 233, idCard: 1111111111, birthday: '2000-01-01', date: '2017-04-10', temperature: '36', bloodPressure: '70/110', illness: 1, docName: '小明', record: '', tel: 110 },
          //   { id: 111, name: '吴xx', sex: '男', age: 233, idCard: 1111111111, birthday: '2000-01-01', date: '2018-01-10', temperature: '36', bloodPressure: '70/110', illness: 1, docName: '小明', record: '', tel: 110 },
          //   { id: 112, name: '吴xx', sex: '男', age: 233, idCard: 1111111111, birthday: '2000-01-01', date: '2018-02-10', temperature: '36', bloodPressure: '70/110', illness: 1, docName: '小明', record: '', tel: 110 },
          //   { id: 113, name: '吴xx', sex: '男', age: 233, idCard: 1111111111, birthday: '2000-01-01', date: '2018-04-10', temperature: '36', bloodPressure: '70/110', illness: 1, docName: '小明', record: '', tel: 110 },
          //   { id: 114, name: '吴xx', sex: '男', age: 233, idCard: 1111111111, birthday: '2000-01-01', date: '2018-03-10', temperature: '36', bloodPressure: '70/110', illness: 1, docName: '小明', record: '', tel: 110 }
          // ].map(v => {
          //   if (v.date === this.today) {
          //     this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
          //   }
          //   return v
          // })
        }
      }

      if (query.id !== '' && query.name !== '') {
        return this.elderData.filter(function(value) {
          if (value.id.toString().indexOf(query.id) >= 0 && value.name.indexOf(query.name) >= 0) {
            return value
          }
        })
      } else if (query.id !== '' && query.name === '') {
        return this.elderData.filter(function(value) {
          if (value.id.toString().indexOf(query.id) >= 0) {
            return value
          }
        })
      } else if (query.id === '' && query.name !== '') {
        return this.elderData.filter(function(value) {
          if (value.name.indexOf(query.name) >= 0) {
            return value
          }
        })
      } else if (query.id === '' && query.name === '') {
        return this.elderData
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  min-height: 100vh;
  padding: 20px 50px 0;
  .search-form {
    padding-left: 20px;
  }

  .dialog {
    .el-form-item {
      margin-bottom: 5px;
    }
    .display-item {
      width: 200px;
    }
    .edit-item {
      width: 100%;
      .el-input,.el-select{
        width: 75px;
      }
      .el-textarea {
        width: 300px;
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