<template>
  <div class="examination-container">
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
            <el-table border height="250" :data="props.row.examination" style="width: auto;margin: 0 auto;">
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
        </template>
      </el-table-column>
      <el-table-column header-align="center" width="120" label="记录日期" prop="examination[0].date"></el-table-column>
      <el-table-column header-align="center" width="80" label="记录编号" prop="examination[0].id"></el-table-column>
      <el-table-column header-align="center" width="50" label="姓名" prop="name"></el-table-column>
      <el-table-column header-align="center" width="50" label="性别" prop="sex"></el-table-column>
      <el-table-column header-align="center" width="50" label="年龄" prop="birthday" :formatter="formatter"></el-table-column>
      <el-table-column header-align="center" label="身份证" prop="idCard"></el-table-column>
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

    <el-dialog class="dialog" width="90%" :title="examinationData[dialogDataIndex].name" center :visible.sync="editDialogVisibel">
      <el-row :gutter="20">
        <el-col :span="2" :offset="2">编号:</el-col>
        <el-col :span="4">{{ examinationData[dialogDataIndex].examination[0].id }}</el-col>
        <el-col :span="3" :offset="0">姓名:</el-col>
        <el-col :span="4">{{ examinationData[dialogDataIndex].name }}</el-col>
        <el-col :span="2 " :offset="0">性别:</el-col>
        <el-col :span="4">{{ examinationData[dialogDataIndex].sex }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2" :offset="2">年龄:</el-col>
        <el-col :span="4">{{ age(examinationData[dialogDataIndex].birthday) }}</el-col>
        <el-col :span="4" :offset="0">记录时间:</el-col>
        <el-col :span="4">{{ examinationData[dialogDataIndex].examination[0].date }}</el-col>
      </el-row>
  
      <el-table border height="250" :data="examinationData[dialogDataIndex].examination" style="width: auto;margin: 0 auto;">
        <el-table-column label="身高">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.height"><template slot="append">米</template></el-input>
          </template>
        </el-table-column>
        <el-table-column label="体重">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.weight"><template slot="append">千克</template></el-input>
          </template>
        </el-table-column>
        <el-table-column label="肝功">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.gangong"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="血糖">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.xuetang"><template slot="append">mg/dl</template></el-input>
          </template>
        </el-table-column>
        <el-table-column label="血脂">
          <el-table-column label="总胆固醇">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.danguchun"><template slot="append">mg/dl</template></el-input>
            </template>
          </el-table-column>
          <el-table-column label="甘油三脂">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.TG"><template slot="append">mg/dl</template></el-input>
            </template>
          </el-table-column>
          <el-table-column label="高密度脂蛋白-胆固醇">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.HDL_Cholesterol"><template slot="append">mg/dl</template></el-input>
            </template>
          </el-table-column>
          <el-table-column label="低密度脂蛋白-胆固醇">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.LDL_Cholesterol"><template slot="append">mg/dl</template></el-input>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="肾功">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.shengong"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="B超">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.bchao"></el-input>
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="updateRecord">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog class="dialog" width="90%" title="新增体检信息" center :visible.sync="newDialogVisibel">
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
      </el-row>

      <el-table border height="250" :data="newData" style="width: auto;margin: 0 auto;">
        <el-table-column label="身高">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.height"><template slot="append">米</template></el-input>
          </template>
        </el-table-column>
        <el-table-column label="体重">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.weight"><template slot="append">千克</template></el-input>
          </template>
        </el-table-column>
        <el-table-column label="肝功">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.gangong"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="血糖">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.xuetang"><template slot="append">mg/dl</template></el-input>
          </template>
        </el-table-column>
        <el-table-column label="血脂">
          <el-table-column label="总胆固醇">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.danguchun"><template slot="append">mg/dl</template></el-input>
            </template>
          </el-table-column>
          <el-table-column label="甘油三脂">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.TG"><template slot="append">mg/dl</template></el-input>
            </template>
          </el-table-column>
          <el-table-column label="高密度脂蛋白-胆固醇">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.HDL_Cholesterol"><template slot="append">mg/dl</template></el-input>
            </template>
          </el-table-column>
          <el-table-column label="低密度脂蛋白-胆固醇">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.LDL_Cholesterol"><template slot="append">mg/dl</template></el-input>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="肾功">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.shengong"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="B超">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.bchao"></el-input>
          </template>
        </el-table-column>
      </el-table>

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
import { getMedicalbydate, getMedicalHistory, editMedical, addMedical, deleteMedical } from '@/api/documentation'
import { getElder } from '@/api/older'

export default {
  name: 'medicallyExamination',
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
      examinationData: [],
      elderList: [],
      originData: {},
      newData: [{
        elderId: 0,

        date: getNowFormatDate().toString(),
        height: 0,
        weight: 0,
        gangong: '',
        xuetang: 0,
        Cholesterol: 0,
        danguchun: 0,
        TG: 0,
        HDL_Cholesterol: 0,
        LDL_Cholesterol: 0,
        shengong: '',
        bchao: '',

        visible: false
      }],
      editDialogVisibel: false,
      dialogDataIndex: 0,
      newDialogVisibel: false,
      today: getNowFormatDate(),

      examination: []
    }
  },
  created() {
    this.getElder()
    setTimeout(this.getList(), 1000)
  },
  methods: {
    getList() {
      getMedicalbydate(this.today).then(res => {
        if (res.data.code !== 0) {
          this.$message.error('列表初始化失败')
        }
        this.examination = res.data.data
      }).catch(error => {
        console.log(error)
        this.$message.error('列表初始化失败')
      })
      setTimeout(this.dealData, 1000)
      // this.examinationData = [
      //   { name: '吴xx', sex: '男', age: 21, idCard: 610302000000000000, docName: '小明', examination: [{ id: '000001', elderId: 1,
      //     docId: 1, date: '2018-04-12', height: '1.70', weight: '67.0', gangong: '正常', xuetang: '100', Cholesterol: '40',
      //     danguchun: '50', TG: '40', HDL_Cholesterol: '40', LDL_Cholesterol: '40', shengong: '正常', bchao: '正常' }],
      //   visible: false },
      //   { name: '吴xx', sex: '男', age: 21, idCard: 555555555, docName: '小明', examination: [{ id: '000002', elderId: 1,
      //     docId: 1, date: '2018-04-12', height: '1.70', weight: '67.0', gangong: '正常', xuetang: '100', Cholesterol: '40',
      //     danguchun: '50', TG: '40', HDL_Cholesterol: '40', LDL_Cholesterol: '40', shengong: '正常', bchao: '正常' }],
      //   visible: false },
      //   { name: '吴xx', sex: '男', age: 21, idCard: 44444, docName: '小明', examination: [{ id: '000003', elderId: 1,
      //     docId: 1, date: '2018-04-12', height: '1.70', weight: '67.0', gangong: '正常', xuetang: '100', Cholesterol: '40',
      //     danguchun: '50', TG: '40', HDL_Cholesterol: '40', LDL_Cholesterol: '40', shengong: '正常', bchao: '正常' }],
      //   visible: false },
      //   { name: '吴xx', sex: '男', age: 21, idCard: 33333333, docName: '小明', examination: [{ id: '000004', elderId: 1,
      //     docId: 1, date: '2018-04-12', height: '1.70', weight: '67.0', gangong: '正常', xuetang: '100', Cholesterol: '40',
      //     danguchun: '50', TG: '40', HDL_Cholesterol: '40', LDL_Cholesterol: '40', shengong: '正常', bchao: '正常' }],
      //   visible: false }
      // ]
    },
    dealData() {
      console.log('deal')
      this.examinationData = []
      this.examination.forEach(value => {
        this.examinationData.push({
          examination: [value]
        })
      })

      this.examinationData.map(v => {
        const t = this.elderList.filter(function(value) {
          if (value.id === v.examination[0].elderId) {
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
      })
    },
    getElder() {
      getElder().then(res => {
        if (res.data.code !== 0) {
          this.$message.error('列表初始化失败')
        }
        this.elderList = res.data.data
        // console.log(this.elderList)
      }).catch(error => {
        console.log(error)
        this.$message.error('列表初始化失败')
      })
    },
    updateRecord() {
      // 在做编辑时 要加入权限判断
      // this.$router.push({ name: 'elderDetail', params: { 2, id } })
      if (this.newDialogVisibel) {
        // new
        this.newDialogVisibel = false
        addMedical(this.newData[0]).then(res => {
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
        const tmp = this.examinationData[this.dialogDataIndex]
        console.log('update:')
        console.log(tmp)
        editMedical(tmp.examination[0]).then(res => {
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
      deleteMedical(tmp.examination[0].id).then(res => {
        if (res.data.code !== 0) {
          this.$message.error('删除失败')
          console.log(res)
        }
        this.getList()
      }).catch(error => {
        console.log(error)
        this.$message.error('删除失败')
      })
      console.log(this.examinationData)
    },
    cancel() {
      if (this.newDialogVisibel) {
        this.newData = this.originData
      } else {
        objectMerge(this.examinationData[this.dialogDataIndex], this.originData)
      }
      this.editDialogVisibel = false
      this.newDialogVisibel = false
    },
    eidtDialog(dataIndex) {
      this.examinationData.filter((v, index) => {
        if (v.examination[0].id === this.data[dataIndex].examination[0].id) {
          this.dialogDataIndex = index
        }
      })
      objectMerge(this.originData, this.examinationData[this.dialogDataIndex])
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
          getMedicalHistory(query.timeRange).then(res => {
            if (res.data.code !== 0) {
              this.$message.error('列表初始化失败')
            }
            this.examination = res.data.data
            console.log('search', this.examination)
            this.searchQuery.timeRange = ''
          }).catch(error => {
            console.log(error)
            this.$message.error('列表初始化失败')
          })
          setTimeout(this.dealData, 1000)
          // this.examinationData = [
          //   { name: '吴xx', sex: '男', age: 21, idCard: 610302000000000000, docName: '小明', examination: [{ id: '000010', elderId: 1,
          //     docId: 1, date: '2018-04-01', height: '1.70', weight: '67.0', gangong: '正常', xuetang: '100', Cholesterol: '40',
          //     danguchun: '50', TG: '40', HDL_Cholesterol: '40', LDL_Cholesterol: '40', shengong: '正常', bchao: '正常' }],
          //   visible: false },
          //   { name: '吴xx', sex: '男', age: 21, idCard: 111111111, docName: '小明', examination: [{ id: '000011', elderId: 1,
          //     docId: 1, date: '2018-04-02', height: '1.70', weight: '67.0', gangong: '正常', xuetang: '100', Cholesterol: '40',
          //     danguchun: '50', TG: '40', HDL_Cholesterol: '40', LDL_Cholesterol: '40', shengong: '正常', bchao: '正常' }],
          //   visible: false },
          //   { name: '吴xx', sex: '男', age: 21, idCard: 111111, docName: '小明', examination: [{ id: '000012', elderId: 1,
          //     docId: 1, date: '2018-04-12', height: '1.70', weight: '67.0', gangong: '正常', xuetang: '100', Cholesterol: '40',
          //     danguchun: '50', TG: '40', HDL_Cholesterol: '40', LDL_Cholesterol: '40', shengong: '正常', bchao: '正常' }],
          //   visible: false },
          //   { name: '吴xx', sex: '男', age: 21, idCard: 21000, docName: '小明', examination: [{ id: '000013', elderId: 1,
          //     docId: 1, date: '2018-04-12', height: '1.70', weight: '67.0', gangong: '正常', xuetang: '100', Cholesterol: '40',
          //     danguchun: '50', TG: '40', HDL_Cholesterol: '40', LDL_Cholesterol: '40', shengong: '正常', bchao: '正常' }],
          //   visible: false }
          // ]
        }
      }

      if (query.idCard !== '' && query.name !== '') {
        return this.examinationData.filter(function(value) {
          if (value.idCard.toString().indexOf(query.idCard) >= 0 && value.name.indexOf(query.name) >= 0) {
            return value
          }
        })
      } else if (query.idCard !== '' && query.name === '') {
        return this.examinationData.filter(function(value) {
          if (value.idCard.toString().indexOf(query.idCard) >= 0) {
            return value
          }
        })
      } else if (query.idCard === '' && query.name !== '') {
        return this.examinationData.filter(function(value) {
          if (value.name.indexOf(query.name) >= 0) {
            return value
          }
        })
      } else if (query.idCard === '' && query.name === '') {
        return this.examinationData
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.examination-container {
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
