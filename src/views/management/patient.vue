<template>
  <div class="elder-container">
    <el-form :inline="true" :model="searchQuery" class="search-form">
      <el-form-item label="老人身份证号">
        <el-input v-model="searchQuery.idCard" placeholder="老人身份证号"></el-input>
      </el-form-item>
      <el-form-item label="老人姓名">
        <el-input v-model="searchQuery.name" placeholder="老人姓名"></el-input>
      </el-form-item>
      <el-button type="success" plain @click="newDialog">添加</el-button>
    </el-form>
    <el-table border :data="data" style="width: 100%">
      <el-table-column header-align="center" width="70" label="编号" prop="id"></el-table-column>
      <el-table-column header-align="center" width="50" label="姓名" prop="name"></el-table-column>
      <el-table-column header-align="center" width="50" label="性别" prop="sex"></el-table-column>
      <el-table-column header-align="center" width="50" label="年龄" prop="birthday" :formatter="formatter"></el-table-column>
      <el-table-column header-align="center" label="身份证" prop="idCard"></el-table-column>
      <el-table-column header-align="center" width="116" label="家属联系方式" prop="tel"></el-table-column>
      <el-table-column header-align="center" width="100" label="生日" prop="birthday"></el-table-column>
      <el-table-column header-align="center" width="100" label="入院时间" prop="inHospital"></el-table-column>
      <el-table-column header-align="center" width="80" label="主治医师" prop="docName"></el-table-column>
      <el-table-column header-align="center" label="床位" prop="bed"></el-table-column>
      <el-table-column header-align="center" label="操作" :width="roles.includes('admin') ? '250' : '150'" align="center">
        <template slot-scope="scope">
          <el-popover ref="refuse" placement="top-start" width="160" v-model="scope.row.visible">
            <p>确定要删除这位老人吗?</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
              <el-button size="mini" type="danger" @click="deleteElder(scope.$index)">确认</el-button>
            </div>
          </el-popover>  
          <el-button size="mini" @click="retrieveElder(scope.$index)">查看</el-button>
          <el-button v-if="roles.includes('admin')" size="mini" @click="eidtDialog(scope.$index)">编辑</el-button>
          <el-button v-if="roles.includes('admin')" size="mini" v-popover:refuse>删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog class="dialog" :title="elderData[dialogDataIndex].name" center :visible.sync="editDialogVisibel">
      <el-row :gutter="20">
        <el-col :span="2" :offset="2">编号:</el-col>
        <el-col :span="4">{{ elderData[dialogDataIndex].id }}</el-col>
        <el-col :span="3" :offset="0">姓名:</el-col>
        <el-col :span="4"><el-input size="mini" v-model="elderData[dialogDataIndex].name"></el-input></el-col>
        <el-col :span="2 " :offset="0">性别:</el-col>
        <el-col :span="4"><el-input size="mini" v-model="elderData[dialogDataIndex].sex"></el-input></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2" :offset="2">年龄:</el-col>
        <el-col :span="4">{{ age(elderData[dialogDataIndex].birthday) }}</el-col>
        <el-col :span="3" :offset="0">身份证:</el-col>
        <el-col :span="10"><el-input size="mini" v-model.number="elderData[dialogDataIndex].idCard"></el-input></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2" :offset="2">电话:</el-col>
        <el-col :span="5"><el-input size="mini" v-model.number="elderData[dialogDataIndex].tel"></el-input></el-col>
        <el-col :span="4" :offset="0">主治医师:</el-col>
        <el-col :span="4"><el-input size="mini" v-model="elderData[dialogDataIndex].docName"></el-input></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2" :offset="2">生日:</el-col>
        <el-col :span="6"><el-date-picker style="width: 100%;" size="mini" type="date" value-format="yyyy-MM-dd" v-model="elderData[dialogDataIndex].birthday" placeholder="选择日期"></el-date-picker></el-col>
        <el-col :span="4" :offset="0">入院时间:</el-col>
        <el-col :span="6"><el-date-picker style="width: 100%;" size="mini" type="date" value-format="yyyy-MM-dd" v-model="elderData[dialogDataIndex].inHospital" placeholder="选择日期"></el-date-picker></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2" :offset="2">床位:</el-col>
        <el-col :span="12"><el-input size="mini" v-model="elderData[dialogDataIndex].bed"></el-input></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4" :offset="2">上传照片</el-col>
        <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="elderData[dialogDataIndex].avatar" :src="elderData[dialogDataIndex].avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-row>

      <span slot="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="updateElder">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog class="dialog" title="新增老人信息" center :visible.sync="newDialogVisibel">
      <el-row :gutter="20">
        <el-col :span="2" :offset="2">编号:</el-col>
        <el-col :span="4">等待分配</el-col>
        <el-col :span="3" :offset="0">姓名:</el-col>
        <el-col :span="4"><el-input size="mini" v-model="newData.name"></el-input></el-col>
        <el-col :span="2 " :offset="0">性别:</el-col>
        <el-col :span="4">
          <el-select v-model="newData.sex" placeholder="选择">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3" :offset="0">身份证:</el-col>
        <el-col :span="10"><el-input size="mini" v-model.number="newData.idCard"></el-input></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2" :offset="2">电话:</el-col>
        <el-col :span="5"><el-input size="mini" v-model.number="newData.tel"></el-input></el-col>
        <el-col :span="4" :offset="0">主治医师:</el-col>
        <el-col :span="4"><el-input size="mini" v-model="newData.docName"></el-input></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2" :offset="2">生日:</el-col>
        <el-col :span="6"><el-date-picker style="width: 100%;" size="mini" type="date" value-format="yyyy-MM-dd" v-model="newData.birthday" placeholder="选择日期"></el-date-picker></el-col>
        <el-col :span="4" :offset="0">入院时间:</el-col>
        <el-col :span="6"><el-date-picker style="width: 100%;" size="mini" type="date" value-format="yyyy-MM-dd" v-model="newData.inHospital" placeholder="选择日期"></el-date-picker></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2" :offset="2">床位:</el-col>
        <el-col :span="12"><el-input size="mini" v-model="newData.bed"></el-input></el-col>
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
        <el-button type="primary" @click="updateElder">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import
import { mapGetters } from 'vuex'
import { deepClone, objectMerge, jsGetAge } from '@/utils'
import { getElder, addElder, editElder, deleteElder } from '@/api/older'

export default {
  data() {
    return {
      searchQuery: {
        idCard: '',
        name: ''
      },
      elderData: [],
      originData: {},
      newData: {
        name: '',
        sex: '',
        age: 0,
        idCard: '',
        birthday: '',
        inHospital: '',
        bed: '',
        docName: '',
        tel: 0,
        avatar: '',
        visible: false
      },
      editDialogVisibel: false,
      dialogDataIndex: 0,
      newDialogVisibel: false
    }
  },
  created() {
    this.getElderList()
  },
  methods: {
    getElderList() {
      getElder().then(res => {
        if (res.data.code !== 0) {
          this.$message.error('列表初始化失败')
        }
        this.elderData = res.data.data
      }).catch(error => {
        console.log(error)
        this.$message.error('列表初始化失败')
      })
    },
    retrieveElder(index) {
      // params: { markDoneType, id }
      // markDoneType: 1.查看 2.编辑 3.新建
      const id = this.elderData[index].id
      this.$router.push({ name: 'elderDetail', params: { elderId: id }})
    },
    updateElder() {
      // 在做编辑时 要加入权限判断
      // this.$router.push({ name: 'elderDetail', params: { 2, id } })
      if (this.newDialogVisibel) {
        // new
        this.newDialogVisibel = false
        console.log('new')
        console.log(this.newData)
        addElder(this.newData).then(res => {
          if (res.data.code !== 0) {
            this.$message.error('添加失败')
            console.log(res)
          }
          this.getElderList()
        }).catch(error => {
          console.log(error)
          this.$message.error('添加失败')
        })
        this.newData = deepClone(this.originData)
      } else {
        // edit
        const tmp = this.elderData[this.dialogDataIndex]
        console.log('update:')
        console.log(tmp)
        editElder(tmp).then(res => {
          if (res.data.code !== 0) {
            this.$message.error('修改失败')
            console.log(res)
          }
          this.getElderList()
        }).catch(error => {
          console.log(error)
          this.$message.error('修改失败')
        })
        this.editDialogVisibel = false
      }
    },
    deleteElder(index) {
      // ajax deleteNurse(this.data[dataIndex].id)
      deleteElder(this.data[index].id).then(res => {
        if (res.data.code !== 0) {
          this.$message.error('删除失败')
          console.log(res)
        }
        this.data[index].visible = false
        this.getElderList()
      }).catch(error => {
        console.log(error)
        this.$message.error('删除失败')
      })
    },
    cancel() {
      if (this.newDialogVisibel) {
        this.newData = this.originData
      } else {
        objectMerge(this.elderData[this.dialogDataIndex], this.originData)
      }
      this.editDialogVisibel = false
      this.newDialogVisibel = false
    },
    eidtDialog(dataIndex) {
      this.elderData.filter((v, index) => {
        if (v.id === this.data[dataIndex].id) {
          this.dialogDataIndex = index
        }
      })
      objectMerge(this.originData, this.elderData[this.dialogDataIndex])
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
        this.elderData[this.dialogDataIndex].avatar = URL.createObjectURL(file.raw)
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
.elder-container {
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

