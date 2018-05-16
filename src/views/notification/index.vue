<template>
  <div class="notification-container">
    <el-button type="success" plain @click="newDialog">添加</el-button>
    <el-container style="border: 1px solid grey">
      <el-main>
        <el-alert v-for="item in notifications" :key="item.id" @close="update(item.id)"
                  :title="item.timestamp + ' ' + item.eventName"
                  :type="item.status === 1 ? 'success' : item.priority === 9 ? 'error' : 'info'">
        </el-alert>
      </el-main>
    </el-container>

    <el-dialog class="dialog" title="新增通知信息" center :visible.sync="newDialogVisibel">
      <el-form :model="newData">
        <el-form-item label="提醒时间">
          <el-date-picker v-model="newData.timestamp" type="datetime" size="mini" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH-mm" :picker-options="pickerOption" placeholder="选择日期和时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="消息内容">
          <el-input v-model="newData.eventName" placeholder="消息内容" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="消息级别">
          <el-select v-model="newData.priority" placeholder="请选择" size="mini">
            <el-option label="普通消息" :value="1"></el-option>
            <el-option label="紧急消息" :value="2"></el-option>
            <el-option label="非常紧急" :value="9"></el-option>
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
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      // notifications: [],
      pickerOption: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000
        }
      },
      newDialogVisibel: false,
      newData: {
        timestamp: '',
        eventName: '',
        priority: 0,
        status: 0
      },
      originData: {}
    }
  },
  mounted() {
    // this.getData()
  },
  computed: {
    ...mapGetters([
      'notifications'
    ])
  },
  methods: {
    // getData() {
    //   this.notifications = [
    //     { id: 1, time: '2018-04-15 10:00', data: '吴xx老人摔倒', flag: 2 }, // flag: 消息状态 1.一般消息 2.紧急消息 0.已完成
    //     { id: 2, time: '2018-04-15 10:20', data: 'xx老人摔倒', flag: 0 },
    //     { id: 3, time: '2018-04-15 12:00', data: '午餐时间', flag: 1 },
    //     { id: 4, time: '2018-04-15 13:00', data: '午休时间', flag: 1 },
    //     { id: 5, time: '2018-04-15 13:00', data: '午休时间', flag: 0 }
    //   ]
    // },
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
      this.$store.dispatch('AddNotification', this.newData).then(res => {
        console.log('添加成功')
        this.$store.dispatch('GetNotification').then(res => {
          console.log('通知列表已更新')
        }).catch(() => {
          console.log('通知列表获取失败')
        })
      }).catch((error) => {
        console.log(error)
        console.log('添加失败')
      })
      this.newData = deepClone(this.originData)
    },
    update(id) {
      console.log(id)
      this.$store.dispatch('DeleteNotification', id).then(res => {
        this.$store.dispatch('GetNotification').then(res => {
          console.log('通知列表已更新')
        }).catch(() => {
          console.log('通知列表获取失败')
        })
      }).catch((error) => {
        console.log(error)
        console.log('删除失败')
      })
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

