<template>
  <div class="service-container">
    <el-select v-model="elderId" placeholder="请选择老人">
      <el-option v-for="item in elderData" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
    <el-table :data="serviceLevel" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
            <el-container class="resume">
              <el-aside width="40%">
                <img class="avatar" :src="props.row.avatar">
              </el-aside>
              <el-main>
                <el-form label-position="right" class="service-table-expand">
                  <el-form-item label="名称">
                    <span>{{ props.row.name }}</span>
                  </el-form-item>
                  <el-form-item label="价格">
                    <span>{{ props.row.price }}</span>
                  </el-form-item>
                  <el-form-item label="有效时长">
                    <span>{{ props.row.duration }}</span>
                  </el-form-item>
                  <el-form-item label="描述">
                    <span>{{ props.row.description }}</span>
                  </el-form-item>
                </el-form>
              </el-main>
            </el-container>
        </template>
      </el-table-column>
      <el-table-column label="编号" prop="id"></el-table-column>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="价格" prop="price"></el-table-column>
      <el-table-column label="有效时长" prop="duration"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <!-- flag： 0. 未申请 1. 已申请 2. 审批中 -->
          <el-popover ref="refuse" placement="top-start" width="160" v-model="scope.row.visible">
            <p>确定要退订该服务吗?</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
              <el-button size="mini" type="danger" @click="refuseNurse(scope.$index)">确认</el-button>
            </div>
          </el-popover>  
          <el-button v-if="scope.row.flag === 0" style="width: 100px;" size="mini" @click="applyService(scope.$index)">申请</el-button>
          <el-button v-else-if="scope.row.flag === 2" style="width: 100px;" size="mini" type="warning" disabled>审批中</el-button>
          <el-button v-else="scope.row.flag === 1" style="width: 100px;" size="mini" type="danger" v-popover:refuse>退订</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import

export default {
  data() {
    return {
      elderId: '',
      serviceLevel: [],
      elderData: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      // ajax serviceLevel
      this.serviceLevel = [
        { id: 110, name: '普通轮椅', price: 100, duration: '7天', description: 'XXXX厂家 轮椅', avatar: require('../../assets/images/avatar.jpg'), visible: false, flag: 0 },
        { id: 111, name: '电动轮椅', price: 200, duration: '7天', description: 'XXXX厂家 电动轮椅，续航时间5公里', avatar: require('../../assets/images/avatar.jpg'), visible: false, flag: 0 },
        { id: 112, name: '双人间', price: 400, duration: '1年', description: '标准双人间，有厕所，厨房', avatar: require('../../assets/images/avatar.jpg'), visible: false, flag: 0 },
        { id: 113, name: '单人间', price: 600, duration: '1年', description: '豪华单人间，有厕所，厨房，客厅', avatar: require('../../assets/images/avatar.jpg'), visible: false, flag: 0 },
        { id: 114, name: '套餐A', price: 1200, duration: '1年', description: '豪华套餐，内含 豪华单人间，营养套餐，优秀护工服务', avatar: require('../../assets/images/avatar.jpg'), visible: false, flag: 0 }
      ]

      // ajax user--elder
      this.elderData = [
        { id: 1, name: '吴' },
        { id: 2, name: '王' }
      ]
    },
    applyService(index) {
      if (this.elderId) {
      // ajax applyService(id, elderId)
      } else {
        this.$message({
          message: '请先选择要办理业务的老人',
          type: 'error'
        })
      }
    },
    refuseNurse(index) {
      // ajax refuseNurse(this.data[dataIndex].id)
      this.serviceLevel[index].flag = 2
      this.serviceLevel[index].visible = false
      console.log(this.serviceLevel)
    }
  },
  computed: {}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.service-container {
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
  .service-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
  }
}

</style>

