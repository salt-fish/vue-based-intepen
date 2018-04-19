<template>
  <div class="roles-container">
    <el-form :inline="true" :model="searchQuery" class="search-form">
      <el-form-item label="角色名称">
        <el-input v-model="searchQuery.name" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-button type="success" plain @click="newRoles.flag = !newRoles.flag">添加</el-button>
      <el-input v-show="newRoles.flag" v-model="newRoles.name" placeholder="新角色名称"></el-input>
      <el-button type="success" plain @click="addRole"></el-button>
    </el-form>
    <el-table border :data="data" style="width: 100%">
      <el-table-column header-align="center" label="编号" prop="id"></el-table-column>
      <el-table-column header-align="center" label="名称" prop="name"></el-table-column>
      <el-table-column header-align="center" label="操作" width="250" align="center">
        <template slot-scope="scope">
          <el-popover ref="refuse" placement="top-start" width="160" v-model="scope.row.visible">
            <p>确定要删除这个角色吗?</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
              <el-button size="mini" type="danger" @click="deleteNurse(scope.$index)">确认</el-button>
            </div>
          </el-popover>  
          <el-button size="mini" @click="retrieve(scope.$index)">查看权限</el-button>
          <el-button size="mini" @click="eidtDialog(scope.$index)">分配权限</el-button>
          <el-button size="mini" v-popover:refuse>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import

export default {
  name: 'auth',
  data() {
    return {
      searchQuery: {
        name: ''
      },
      rolesList: [],
      authList: [],
      newRoles: {
        flag: false,
        name: ''
      }
    }
  },
  created() {
    this.getRolesList()
    this.getAuthList()
  },
  methods: {
    getRolesList() {
      this.rolesList = [
        { id: 1, name: 'admin', haveAuth: '1,2,3,4' },
        { id: 2, name: 'editor', haveAuth: '3,4' }
      ]
    },
    getAuthList() {
      this.authList = [
        { id: 1, name: '' }
      ]
    },
    addRole() {
      this.newRoles.flag = false
      console.log(this.newRoles.name)
      this.newRoles.name = ''
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.roles-container {
  min-height: 100vh;
  padding: 20px 50px 0;
}
</style>
