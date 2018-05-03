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
        <el-form-item label="用户密码">
          <el-input v-model="userList[dialogDataIndex].password" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="用户电话">
          <el-input v-model="userList[dialogDataIndex].tel" size="mini" placeholder="用户电话"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-transfer style="text-align: left; display: inline-block" v-model="userList[dialogDataIndex].hasAuth" :props="{ key: 'id', label: 'comment' }" :data="authList" :titles="['权限列表', '已有权限']"></el-transfer>
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
        <el-form-item label="用户密码">
          <el-input v-model="newData.password" size="mini" placeholder="用户密码"></el-input>
        </el-form-item>
        <el-form-item label="用户电话">
          <el-input v-model="newData.tel" size="mini" placeholder="用户电话"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-transfer style="text-align: left; display: inline-block" v-model="newData.hasAuth" :props="{ key: 'id', label: 'comment' }" :data="authList" :titles="['权限列表', '已有权限']"></el-transfer>
      </div>
      <span slot="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone, objectMerge } from '@/utils'

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
      authList: [],
      originData: {},
      newData: {
        name: '',
        password: '',
        tel: 0,
        hasAuth: []
      },
      editDialogVisibel: false,
      dialogDataIndex: 0,
      newDialogVisibel: false
    }
  },
  created() {
    this.getUserList()
    this.getAuthList()
  },
  methods: {
    getUserList() {
      this.userList = [
        { id: 1, name: '小明', password: 'a12345', tel: 110, hasAuth: [1, 2, 3, 4] },
        { id: 2, name: '小红', password: 'a12345', tel: 13030000000, hasAuth: [3, 4] }
      ]
    },
    getAuthList() {
      this.authList = [
        { id: 1, name: 'admin', comment: '超级管理员' },
        { id: 2, name: 'userDetail', comment: '病人信息' },
        { id: 3, name: 'service', comment: '服务' },
        { id: 4, name: 'statistic', comment: '统计信息' },
        { id: 5, name: 'inspection', comment: '巡查结果' },
        { id: 6, name: 'elderManagement', comment: '老人管理' },
        { id: 7, name: 'nurseManagement', comment: '护士管理' },
        { id: 8, name: 'detail', comment: '老人、护士详细信息' },
        { id: 9, name: 'documentation', comment: '健康管理' },
        { id: 10, name: 'relation', comment: '关联家属' },
        { id: 11, name: 'notification', comment: '通知列表' },
        { id: 12, name: 'permission', comment: '权限管理' },
        { id: 13, name: 'settings', comment: '设置' }
      ]
    },
    updateUser() {
      // 在做编辑时 要加入权限判断
      // this.$router.push({ name: 'elderDetail', params: { 2, id } })
      if (this.newDialogVisibel) {
        // new
        this.newDialogVisibel = false
        console.log('new')
        console.log(this.newData)
        this.newData = deepClone(this.originData)
      } else {
        // edit
        const tmp = this.userList[this.dialogDataIndex]
        console.log('update:')
        console.log(tmp)
        this.editDialogVisibel = false
      }
    },
    deleteUser(index) {
      // ajax deleteNurse(this.data[dataIndex].id)
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
