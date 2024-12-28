<template>
  <div class="cottoms-list">
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="请输入患者姓名"
        prefix-icon="el-icon-search"
        clearable
        @clear="handleSearch"
        @keyup.enter.native="handleSearch"
      >
      </el-input>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        @change="handleSearch"
      >
      </el-date-picker>
    </div>

    <el-table
      :data="filteredAppointments"
      style="width: 100%"
      border
      v-loading="loading"
    >
      <el-table-column
        prop="id"
        label="任务号"
        width="80"
      >
      </el-table-column>
      <el-table-column
        prop="userName"
        label="姓名"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="userGender"
        label="性别"
        width="80"
      >
        <template slot-scope="scope">
          {{ scope.row.userGender === 1 ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="userAge"
        label="年龄"
        width="80"
      >
      </el-table-column>
      <el-table-column
        prop="province"
        label="省"
      >
      </el-table-column>
      <el-table-column
        prop="city"
        label="市"
      >
      </el-table-column>
      <el-table-column
        prop="diagnoseType"
        label="就诊科室"
      >
      </el-table-column>
      <el-table-column
        prop="diagnoseTime"
        label="就诊时间"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleView(scope.row)"
            :disabled="scope.row.status !== 0"
          >开始就诊</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CottomsList',
  data() {
    return {
      loading: false,
      appointments: [],
      searchQuery: '',
      dateRange: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  computed: {
    filteredAppointments() {
      let result = this.appointments
      
      // 搜索过滤
      if (this.searchQuery) {
        result = result.filter(item => 
          item.userName.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }
      
      // 日期过滤
      if (this.dateRange && this.dateRange.length === 2) {
        const startDate = new Date(this.dateRange[0])
        const endDate = new Date(this.dateRange[1])
        result = result.filter(item => {
          const appointmentDate = new Date(item.diagnoseTime)
          return appointmentDate >= startDate && appointmentDate <= endDate
        })
      }
      
      // 更新总数
      this.total = result.length
      
      // 分页
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return result.slice(start, end)
    }
  },
  methods: {
    // 获取预约列表
    async fetchAppointments() {
      this.loading = true
      try {
        const doctorInfo = JSON.parse(localStorage.getItem('doctorInfo'))
        if (!doctorInfo || !doctorInfo.id) {
          this.$message.error('获取医生信息失败，请重新登录')
          return
        }
        
        const res = await this.$http(`/appointments/doctor/${doctorInfo.id}`)
        if (res.code === 200) {
          this.appointments = res.data
        } else {
          this.$message.error(res.message || '获取预约列表失败')
        }
      } catch (error) {
        console.error('获取预约列表失败:', error)
        this.$message.error('获取预约列表失败')
      } finally {
        this.loading = false
      }
    },
    
    // 获取状态类型
    getStatusType(status) {
      const types = {
        0: 'warning',  // 待就诊
        1: 'success',  // 已完成
        2: 'info'      // 已取消
      }
      return types[status] || 'info'
    },
    
    // 获取状态文本
    getStatusText(status) {
      const texts = {
        0: '待就诊',
        1: '已完成',
        2: '已取消'
      }
      return texts[status] || '未知'
    },
    
    // 搜索
    handleSearch() {
      this.currentPage = 1
    },
    
    // 开始就诊
    handleView(row) {
      this.$router.push({
        name: 'diagnose',
        params: { id: row.id }
      })
    },
    
    // 分页相关方法
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
    },
    handleCurrentChange(val) {
      this.currentPage = val
    }
  },
  created() {
    this.fetchAppointments()
  }
}
</script>

<style lang="scss" scoped>
.cottoms-list {
  padding: 20px;
  
  .search-bar {
    margin-bottom: 20px;
    display: flex;
    gap: 20px;
    
    .el-input {
      width: 200px;
    }
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style> 