<template>
  <div class="app-container">
<!--     <div style="margin-bottom:15px;">你的权限 ： {{roles}}</div>
    切换权限：
    <el-radio-group v-model="switchRoles">
      <el-radio-button label="editor"></el-radio-button>
    </el-radio-group>
 -->
    <el-form :inline="true" :model="searchQuery" class="search-form">
      <el-form-item label="用户名称">
        <el-input v-model="searchQuery.name" placeholder="用户名称"></el-input>
      </el-form-item>
      <el-form-item label="用户电话">
        <el-input v-model="searchQuery.tel" placeholder="用户电话"></el-input>
      </el-form-item>
      <el-button type="success" plain @click="newDialog">添加</el-button>
    </el-form>
    <el-table border :data="data" style="width: 100%">
      <el-table-column header-align="center" label="编号" prop="id"></el-table-column>
      <el-table-column header-align="center" label="名称" prop="name"></el-table-column>
      <el-table-column header-align="center" label="联系电话" prop="tel"></el-table-column>
      <el-table-column header-align="center" label="操作" width="250" align="center">
        <template slot-scope="scope">
          <el-popover ref="refuse" placement="top-start" width="160" v-model="scope.row.visible">
            <p>确定要删除这个用户吗?</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
              <el-button size="mini" type="danger" @click="deleteUser(scope.$index)">确认</el-button>
            </div>
          </el-popover>  
          <el-button size="mini" @click="eidtDialog(scope.$index)">分配权限</el-button>
          <el-button size="mini" v-popover:refuse>删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog class="dialog" :title="userList[dialogDataIndex].name" center :visible.sync="editDialogVisibel">
      <el-form :inline="true" :model="userList[dialogDataIndex]" style="left: 5%; position: relative;">
        <el-form-item label="用户名称">
          <el-input v-model="userList[dialogDataIndex].name" size="mini" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="用户电话">
          <el-input v-model="userList[dialogDataIndex].tel" size="mini" placeholder="用户电话"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-transfer style="text-align: left; display: inline-block" v-model="userList[dialogDataIndex].hasAuth" :props="{ key: 'id', label: 'description' }" :data="rolesList" :titles="['权限列表', '已有权限']"></el-transfer>
      </div>
      <span slot="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog class="dialog" title="新增用户" center :visible.sync="newDialogVisibel">
      <el-form :inline="true" :model="newData" style="left: 5%; position: relative;">
        <el-form-item label="用户名称">
          <el-input v-model="newData.name" size="mini" placeholder="用户姓名"></el-input>
        </el-form-item>
        <el-form-item label="用户账号">
          <el-input v-model="newData.account" size="mini" placeholder="用户账号"></el-input>
        </el-form-item>
        <el-form-item label="用户密码">
          <el-input v-model="newData.password" size="mini" placeholder="用户密码"></el-input>
        </el-form-item>
        <el-form-item label="用户电话">
          <el-input v-model="newData.tel" size="mini" placeholder="用户电话"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="newData.flags" placeholder="请选择">
            <el-option label="用户(家属)" value="1"></el-option>
            <el-option label="护工" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone, objectMerge } from '@/utils'
import { getRolesList, getUserList, addUser, distribute, deleteUser } from '@/api/permission'
import { addNurse } from '@/api/nurse'

export default{
  name: 'permission',
  data() {
    return {
      switchRoles: '',
      searchQuery: {
        name: '',
        tel: ''
      },
      userList: [],
      rolesList: [],
      originData: {},
      newData: {
        name: '',
        password: '',
        tel: 0,
        flags: '1', // 1. 用户（家属）2. 护工
        hasAuth: []
      },
      editDialogVisibel: false,
      dialogDataIndex: 0,
      newDialogVisibel: false
    }
  },
  created() {
    this.getUserList()
    this.getRolesList()
  },
  methods: {
    getUserList() {
      getUserList().then(res => {
        if (res.data.code !== 0) {
          this.$message.error('列表初始化失败')
        }
        this.userList = res.data.data
        this.userList.map(v => {
          this.$set(v, 'visible', false)
        })
        console.log(this.userList)
      }).catch(error => {
        console.log(error)
        this.$message.error('列表初始化失败')
      })
      // this.userList = [
      //   { id: 1, name: '小明', password: 'a12345', tel: 110, hasAuth: [1, 2, 3, 4] },
      //   { id: 2, name: '小红', password: 'a12345', tel: 13030000000, hasAuth: [3, 4] }
      // ]
    },
    getRolesList() {
      getRolesList().then(res => {
        if (res.data.code !== 0) {
          this.$message.error('列表初始化失败')
        }
        this.rolesList = res.data.data
        console.log(this.rolesList)
      }).catch(error => {
        console.log(error)
        this.$message.error('列表初始化失败')
      })
      // this.rolesList = [
      //   { id: 1, role: 'admin', description: '超级管理员' },
      //   { id: 2, role: 'userDetail', description: '病人信息' },
      //   { id: 3, role: 'service', description: '服务' },
      //   { id: 4, role: 'statistic', description: '统计信息' },
      //   { id: 5, role: 'inspection', description: '巡查结果' },
      //   { id: 6, role: 'elderManagement', description: '老人管理' },
      //   { id: 7, role: 'nurseManagement', description: '护士管理' },
      //   { id: 8, role: 'detail', description: '老人、护士详细信息' },
      //   { id: 9, role: 'documentation', description: '健康管理' },
      //   { id: 10, role: 'relation', description: '关联家属' },
      //   { id: 11, role: 'notification', description: '通知列表' },
      //   { id: 12, role: 'permission', description: '权限管理' },
      //   { id: 13, role: 'settings', description: '设置' }
      // ]
    },
    updateUser() {
      // 在做编辑时 要加入权限判断
      // this.$router.push({ name: 'elderDetail', params: { 2, id } })
      if (this.newDialogVisibel) {
        // new
        this.newDialogVisibel = false
        const tmp = this.newData
        console.log(typeof tmp.flags)
        if (tmp.flags === '1') {
          // 增加用户
          addUser(tmp).then(res => {
            if (res.data.code !== 0) {
              this.$message.error('新增用户失败')
            } else {
              this.$message.success('新增用户成功，请继续为其分配权限')
              this.getUserList()
            }
          }).catch(error => {
            console.log(error)
            this.$message.error('新增用户失败')
          })
        } else if (tmp.flags === '2') {
          // 增加护工
          addNurse(tmp).then(res => {
            if (res.data.error) {
              this.$message.error(res.data.error)
            } else {
              this.$message.success('新增护工成功，请继续为其分配权限')
            }
            console.log(res)
            this.getUserList()
          }).catch(error => {
            console.log(error)
            this.$message.error('新增护工失败')
          })
        } else {
          this.$message.error('新增失败')
        }
        this.newData = deepClone(this.originData)
      } else {
        // edit
        const tmp = this.userList[this.dialogDataIndex]
        distribute(tmp.id, tmp.hasAuth).then(res => {
          if (res.data.code !== 0) {
            this.$message.error('分配权限失败')
          } else {
            this.$message.success('分配权限成功')
          }
        }).catch(error => {
          console.log(error)
          this.$message.error('分配权限失败')
        })
        console.log('update:')
        console.log(tmp)
        this.editDialogVisibel = false
      }
    },
    deleteUser(index) {
      // ajax deleteNurse(this.data[dataIndex].id)
      const tmp = this.data[index]
      deleteUser(tmp.id).then(res => {
        if (res.data.code !== 0) {
          this.$message.error('删除角色失败')
        } else {
          this.$message.success('删除角色成功')
          this.getUserList()
        }
        console.log(res)
      }).catch(error => {
        console.log(error)
        this.$message.error('删除角色失败')
      })
      console.log(this.userList)
    },
    cancel() {
      if (this.newDialogVisibel) {
        this.newData = this.originData
      } else {
        objectMerge(this.userList[this.dialogDataIndex], this.originData)
      }
      this.editDialogVisibel = false
      this.newDialogVisibel = false
    },
    eidtDialog(dataIndex) {
      this.userList.filter((v, index) => {
        if (v.id === this.data[dataIndex].id) {
          this.dialogDataIndex = index
        }
      })
      objectMerge(this.originData, this.userList[this.dialogDataIndex])
      this.editDialogVisibel = true
    },
    newDialog() {
      this.newDialogVisibel = true
      this.originData = deepClone(this.newData)
    }
  },
  computed: {
    data: function() {
      var query = this.searchQuery
      if (query.tel !== '' && query.name !== '') {
        return this.userList.filter(function(value) {
          if (value.tel.toString().indexOf(query.tel) >= 0 && value.name.indexOf(query.name) >= 0) {
            return value
          }
        })
      } else if (query.tel !== '' && query.name === '') {
        return this.userList.filter(function(value) {
          if (value.tel.toString().indexOf(query.tel) >= 0) {
            return value
          }
        })
      } else if (query.tel === '' && query.name !== '') {
        return this.userList.filter(function(value) {
          if (value.name.indexOf(query.name) >= 0) {
            return value
          }
        })
      } else if (query.tel === '' && query.name === '') {
        return this.userList
      }
    }
  },
  watch: {
    switchRoles(val) {
      this.$store.dispatch('ChangeRoles', val).then(() => {
        this.$router.push({ path: '/permission/index?' + +new Date() })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.roles-container {
  min-height: 100vh;
  padding: 20px 50px 0;
  .search-form {
    padding-left: 20px;
  }
}
</style>
