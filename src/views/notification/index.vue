<template>
  <div class="notification-container">
    <el-button type="success" plain @click="newDialog">添加</el-button>
    <el-container style="border: 1px solid grey">
      <el-main>
        <el-alert v-for="item in notifications" :key="item.id" @close="update(item.id)"
                  :title="item.time + ' ' + item.data"
                  :type="item.flag === 0 ? 'success' : item.flag === 1 ? 'info' : 'error'">
        </el-alert>
      </el-main>
    </el-container>

    <el-dialog class="dialog" title="新增通知信息" center :visible.sync="newDialogVisibel">
      <el-form :model="newData">
        <el-form-item label="提醒时间">
          <el-date-picker v-model="newData.time" type="datetime" size="mini" value-format="yyyy-MM-dd HH-mm" format="yyyy-MM-dd HH-mm" :picker-options="pickerOption" placeholder="选择日期和时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="消息内容">
          <el-input v-model="newData.data" placeholder="消息内容" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="消息级别">
          <el-select v-model="newData.flag" placeholder="请选择" size="mini">
            <el-option label="普通消息" :value="1"></el-option>
            <el-option label="紧急消息" :value="2"></el-option>
            <el-option label="已完成的消息" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'

export default {
  data() {
    return {
      notifications: [],
      pickerOption: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      newDialogVisibel: false,
      newData: {
        time: '',
        data: '',
        flag: 0
      },
      originData: {}
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.notifications = [
        { id: 1, time: '2018-04-15 10:00', data: '吴xx老人摔倒', flag: 2 }, // flag: 消息状态 1.一般消息 2.紧急消息 0.已完成
        { id: 2, time: '2018-04-15 10:20', data: 'xx老人摔倒', flag: 0 },
        { id: 3, time: '2018-04-15 12:00', data: '午餐时间', flag: 1 },
        { id: 4, time: '2018-04-15 13:00', data: '午休时间', flag: 1 },
        { id: 5, time: '2018-04-15 13:00', data: '午休时间', flag: 0 }
      ]
    },
    newDialog() {
      this.newDialogVisibel = true
      this.originData = deepClone(this.newData)
    },
    cancel() {
      this.newData = deepClone(this.originData)
      this.newDialogVisibel = false
    },
    submit() {
      this.newDialogVisibel = false
      console.log('new')
      console.log(this.newData)
      this.notifications.push(this.newData)
      this.newData = deepClone(this.originData)
    },
    update(id) {
      const n = this.notifications.filter(v => {
        if (v.id === id) {
          return v
        }
      })
      n[0].flag = 0
      console.log(n)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.notification-container {
  padding: 32px;
  min-height: 90vh;
  background-color: rgb(240, 242, 245);

  .el-container {
    height: 60vh;
    overflow: scroll;
  }
}
</style>

