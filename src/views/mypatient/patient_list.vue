<template>
  <div id="patientList">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>我的病人</span>
      </div>
      
      <el-table
        :data="patientList"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column
          prop="userName"
          label="姓名"
          min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.userName">{{ scope.row.userName }}</span>
            <span v-else class="no-data">暂无</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="userAge"
          label="年龄"
          min-width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.userAge">{{ scope.row.userAge }}岁</span>
            <span v-else class="no-data">暂无</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="userGender"
          label="性别"
          min-width="80">
          <template slot-scope="scope">
            {{ scope.row.userGender === 1 ? '男' : '女' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="appointmentDate"
          label="预约时间"
          min-width="160">
          <template slot-scope="scope">
            {{ formatDate(scope.row.appointmentDate) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="timeSlot"
          label="就诊时段"
          min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.timeSlot">{{ scope.row.timeSlot }}</span>
            <span v-else class="no-data">暂无</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="症状描述"
          min-width="200">
          <template slot-scope="scope">
            <span v-if="scope.row.description">{{ scope.row.description }}</span>
            <span v-else class="no-data">暂无</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          min-width="100">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          min-width="120">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 0"
              type="primary"
              size="small"
              @click="startDiagnose(scope.row)">
              开始就诊
            </el-button>
            <el-button
              v-else
              type="text"
              size="small"
              @click="viewDetail(scope.row)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      patientList: []
    }
  },

  created() {
    this.getPatientList()
  },

  methods: {
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    },

    getStatusType(status) {
      const types = {
        0: 'warning',
        1: 'success',
        2: 'info'
      }
      return types[status] || 'info'
    },

    getStatusText(status) {
      const texts = {
        0: '待就诊',
        1: '已完成',
        2: '已取消'
      }
      return texts[status] || '未知'
    },

    handleSizeChange(val) {
      this.pageSize = val
      this.getPatientList()
    },

    handleCurrentChange(val) {
      this.currentPage = val
      this.getPatientList()
    },

    async getPatientList() {
      try {
        this.loading = true
        const doctorInfo = JSON.parse(localStorage.getItem('doctorInfo'))
        if (!doctorInfo || !doctorInfo.id) {
          this.$message.error('获取医生信息失败，请重新登录')
          return
        }

        const res = await this.$http(`/appointments/doctor/${doctorInfo.id}`, 'get')
        if (res.code === 200) {
          this.patientList = res.data
          this.total = res.data.length
        } else {
          this.$message.error(res.message || '获取病人列表失败')
        }
      } catch (error) {
        console.error('获取病人列表失败:', error)
        this.$message.error('获取病人列表失败')
      } finally {
        this.loading = false
      }
    },

    startDiagnose(row) {
      this.$router.push(`/doctor/patient/diagnose/${row.id}`)
    },

    viewDetail(row) {
      this.$router.push(`/doctor/patient/detail/${row.id}/view`)
    }
  }
}
</script>

<style lang="scss" scoped>
#patientList {
  padding: 20px;

  .box-card {
    min-height: calc(100vh - 120px);
  }

  .clearfix {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }

  .no-data {
    color: #999;
    font-size: 13px;
  }

  .el-table {
    margin-top: 20px;
    
    ::v-deep .el-table__header th {
      background-color: #f5f7fa;
      color: #606266;
      font-weight: 500;
    }
    
    ::v-deep .el-table__row {
      td {
        padding: 12px 0;
      }
    }
  }
}
</style>
