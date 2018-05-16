<template>
  <div class="nurse-container">
    <el-form :inline="true" :model="searchQuery" class="search-form">
      <el-form-item label="护工编号">
        <el-input v-model="searchQuery.id" placeholder="护工编号"></el-input>
      </el-form-item>
      <el-form-item label="护工姓名">
        <el-input v-model="searchQuery.name" placeholder="护工姓名"></el-input>
      </el-form-item>
      <!-- <el-button type="success" plain @click="newDialog">添加</el-button> -->
    </el-form>
    <el-table border :data="data" style="width: 100%">
      <el-table-column header-align="center" label="编号" prop="id"></el-table-column>
      <el-table-column header-align="center" label="姓名" prop="name"></el-table-column>
      <el-table-column header-align="center" label="性别" prop="sex"></el-table-column>
      <el-table-column header-align="center" label="年龄" prop="age"></el-table-column>
      <el-table-column header-align="center" label="工作经验" prop="time"></el-table-column>
      <el-table-column header-align="center" label="评分" prop="rate"></el-table-column>
      <el-table-column header-align="center" label="操作" :width="roles[0] === 'admin' ? '250' : '150'" align="center">
        <template slot-scope="scope">
          <el-popover ref="refuse" placement="top-start" width="160" v-model="scope.row.visible">
            <p>确定要删除这位护工吗?</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
              <el-button size="mini" type="danger" @click="deleteNurse(scope.$index)">确认</el-button>
            </div>
          </el-popover>  
          <el-button size="mini" @click="retrieveNurse(scope.$index)">查看</el-button>
          <el-button v-if="roles[0] === 'admin'" size="mini" @click="eidtDialog(scope.$index)">编辑</el-button>
          <el-button v-if="roles[0] === 'admin'" size="mini" v-popover:refuse>删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog class="dialog" :title="nurseData[dialogDataIndex].name" center :visible.sync="editDialogVisibel">
      <el-row :gutter="20">
        <el-col :span="2" :offset="2">编号:</el-col>
        <el-col :span="4">{{ nurseData[dialogDataIndex].id }}</el-col>
        <el-col :span="3" :offset="0">姓名:</el-col>
        <el-col :span="4"><el-input size="mini" v-model="nurseData[dialogDataIndex].name"></el-input></el-col>
        <el-col :span="2 " :offset="0">性别:</el-col>
        <el-col :span="4"><el-input size="mini" v-model="nurseData[dialogDataIndex].sex"></el-input></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2" :offset="2">年龄:</el-col>
        <el-col :span="4"><el-input size="mini" v-model.number="nurseData[dialogDataIndex].age"></el-input></el-col>
        <el-col :span="3" :offset="0">工作经验:</el-col>
        <el-col :span="4"><el-input size="mini" v-model.number="nurseData[dialogDataIndex].time"></el-input></el-col>
        <el-col :span="2" :offset="0">评分:</el-col>
        <el-col :span="4"><el-input size="mini" v-model.number="nurseData[dialogDataIndex].rate"></el-input></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4" :offset="2">个人介绍:</el-col>
        <el-col :offset="2">
          <el-input type="textarea" style="width: 70%;" v-model="nurseData[dialogDataIndex].introduction" :autosize="{ minRows: 2, maxRows: 4}">
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2" :offset="2">评价:</el-col>
        <el-col :offset="2">
          <el-input type="textarea" style="width: 70%;" v-model="nurseData[dialogDataIndex].evaluation" :autosize="{ minRows: 2, maxRows: 4}">
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4" :offset="2">上传照片</el-col>
        <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="nurseData[dialogDataIndex].avatar" :src="nurseData[dialogDataIndex].avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-row>

      <span slot="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="updateNurse">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog class="dialog" title="新增护工信息" center :visible.sync="newDialogVisibel">
      <el-row :gutter="20">
        <el-col :span="2" :offset="2">编号:</el-col>
        <el-col :span="4">等待分配</el-col>
        <el-col :span="3" :offset="0">姓名:</el-col>
        <el-col :span="4"><el-input size="mini" v-model="newData.name"></el-input></el-col>
        <el-col :span="2 " :offset="0">性别:</el-col>
        <el-col :span="4"><el-input size="mini" v-model="newData.sex"></el-input></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2" :offset="2">年龄:</el-col>
        <el-col :span="4"><el-input size="mini" v-model.number="newData.age"></el-input></el-col>
        <el-col :span="3" :offset="0">工作经验:</el-col>
        <el-col :span="4"><el-input size="mini" v-model.number="newData.time"></el-input></el-col>
        <el-col :span="2" :offset="0">评分:</el-col>
        <el-col :span="4"><el-input size="mini" v-model.number="newData.rate"></el-input></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4" :offset="2">个人介绍:</el-col>
        <el-col :offset="2">
          <el-input type="textarea" style="width: 70%;" v-model="newData.introduction" :autosize="{ minRows: 2, maxRows: 4}">
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2" :offset="2">评价:</el-col>
        <el-col :offset="2">
          <el-input type="textarea" style="width: 70%;" v-model="newData.evaluation" :autosize="{ minRows: 2, maxRows: 4}">
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4" :offset="2">上传照片</el-col>
        <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="newData.avatar" :src="newData.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-row>

      <span slot="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="updateNurse">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import
import { mapGetters } from 'vuex'
import { deepClone, objectMerge } from '@/utils'
import { getNurse, addNurse, editNurse, deleteNurse } from '@/api/nurse'

export default {
  data() {
    return {
      searchQuery: {
        id: '',
        name: ''
      },
      nurseData: [],
      originData: {},
      newData: {
        name: '',
        sex: '',
        age: 0,
        rate: 0,
        time: '',
        introduction: '',
        evaluation: '',
        avatar: '',
        visible: false
      },
      editDialogVisibel: false,
      dialogDataIndex: 0,
      newDialogVisibel: false
    }
  },
  created() {
    this.getNurseList()
  },
  methods: {
    getNurseList() {
      getNurse().then(res => {
        if (res.data.code !== 0) {
          this.$message.error('列表初始化失败')
        }
        this.nurseData = res.data.data
        console.log(this.nurseData)
      }).catch(error => {
        console.log(error)
        this.$message.error('列表初始化失败')
      })
      // this.nurseData = [
      //   { id: 110, name: 'a', sex: 'man', age: 12, rate: 10, time: 10, avatar: require('../../assets/images/avatar.jpg'), introduction: '------------ 个人介绍 --------------', evaluation: '------------ 评价 -------------', visible: false },
      //   { id: 111, name: 'a', sex: 'female', age: 22, rate: 4, time: 3, avatar: require('../../assets/images/avatar.jpg'), introduction: '------------ 个人介绍 --------------', evaluation: '------------ 评价 -------------', visible: false },
      //   { id: 112, name: 'c', sex: 'man', age: 12, rate: 10, time: 10, avatar: require('../../assets/images/avatar.jpg'), introduction: '------------ 个人介绍 --------------', evaluation: '------------ 评价 -------------', visible: false },
      //   { id: 113, name: 'd', sex: 'man', age: 12, rate: 10, time: 10, avatar: require('../../assets/images/avatar.jpg'), introduction: '------------ 个人介绍 --------------', evaluation: '------------ 评价 -------------', visible: false },
      //   { id: 114, name: 'e', sex: 'man', age: 12, rate: 10, time: 10, avatar: require('../../assets/images/avatar.jpg'), introduction: '------------ 个人介绍 --------------', evaluation: '------------ 评价 -------------', visible: false }
      // ]
    },
    retrieveNurse(index) {
      var id = this.nurseData[index].id
      this.$router.push({ name: 'nurseDetail', params: { nurseId: id }})
    },
    updateNurse() {
      if (this.newDialogVisibel) {
        // new
        this.newDialogVisibel = false
        console.log('new')
        console.log(this.newData)
        addNurse(this.newData).then(res => {
          if (res.data.code !== 0) {
            this.$message.error('添加失败')
            console.log(res)
          }
          this.getNurseList()
        }).catch(error => {
          console.log(error)
          this.$message.error('添加失败')
        })
        this.newData = deepClone(this.originData)
      } else {
        // edit
        const tmp = this.nurseData[this.dialogDataIndex]
        console.log('update:')
        console.log(tmp)
        editNurse(tmp).then(res => {
          if (res.data.code !== 0) {
            this.$message.error('修改失败')
            console.log(res)
          }
          this.getNurseList()
        }).catch(error => {
          console.log(error)
          this.$message.error('修改失败')
        })
        this.editDialogVisibel = false
      }
    },
    deleteNurse(index) {
      // ajax deleteNurse(this.data[dataIndex].id)
      deleteNurse(this.data[index].id).then(res => {
        if (res.data.code !== 0) {
          this.$message.error('删除失败')
          console.log(res)
        }
        this.data[index].visible = false
        this.getNurseList()
      }).catch(error => {
        console.log(error)
        this.$message.error('删除失败')
      })
    },
    cancel() {
      if (this.newDialogVisibel) {
        this.newData = this.originData
      } else {
        objectMerge(this.nurseData[this.dialogDataIndex], this.originData)
      }
      this.editDialogVisibel = false
      this.newDialogVisibel = false
    },
    eidtDialog(dataIndex) {
      this.nurseData.filter((v, index) => {
        if (v.id === this.data[dataIndex].id) {
          this.dialogDataIndex = index
        }
      })
      objectMerge(this.originData, this.nurseData[this.dialogDataIndex])
      this.editDialogVisibel = true
    },
    newDialog() {
      this.newDialogVisibel = true
      this.originData = deepClone(this.newData)
    },
    handleAvatarSuccess(res, file) {
      if (this.newDialogVisibel) {
        this.newData.avatar = URL.createObjectURL(file.raw)
      } else {
        this.nurseData[this.dialogDataIndex].avatar = URL.createObjectURL(file.raw)
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ]),
    data: function() {
      var query = this.searchQuery
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
.avatar-uploader .el-upload {
    border: 1px dashed #000;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
