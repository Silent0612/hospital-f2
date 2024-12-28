<template>
  <div class="records page-container">
    <h2 class="page-title">预约记录</h2>
    
    <el-card class="record-card">
      <div class="filter-container">
        <el-input
          v-model="searchQuery"
          placeholder="搜索医生姓名"
          prefix-icon="el-icon-search"
          clearable
          class="filter-item"
          @clear="handleSearch"
          @keyup.enter.native="handleSearch">
        </el-input>
        
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="filter-item"
          value-format="yyyy-MM-dd"
          @change="handleSearch">
        </el-date-picker>
      </div>

      <el-table
        :data="filteredRecords"
        stripe
        border
        class="custom-table"
        v-loading="loading">
        <el-table-column
          prop="doctorName"
          label="医生姓名"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="departmentName"
          label="就诊科室"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="appointmentDate"
          label="预约日期"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="timeSlot"
          label="就诊时段"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="visitType"
          label="就诊类型"
          min-width="100">
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
          label="操作"
          min-width="150"
          fixed="right">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="viewDetails(scope.row)">
              查看
            </el-button>
            <el-button
              v-if="scope.row.status === 0"
              type="danger"
              size="mini"
              @click="handleCancel(scope.row)">
              取消预约
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
  name: 'Records',
  data() {
    return {
      searchQuery: '',
      dateRange: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      records: []
    }
  },
  computed: {
    filteredRecords() {
      let result = this.records

      if (this.searchQuery) {
        result = result.filter(record => 
          record.doctorName.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }

      if (this.dateRange && this.dateRange.length === 2) {
        const startDate = new Date(this.dateRange[0])
        const endDate = new Date(this.dateRange[1])
        result = result.filter(record => {
          const appointmentDate = new Date(record.appointmentDate)
          return appointmentDate >= startDate && appointmentDate <= endDate
        })
      }

      this.total = result.length
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return result.slice(start, end)
    }
  },
  methods: {
    getStatusType(status) {
      const statusMap = {
        0: 'warning',   // 待就诊
        1: 'success',   // 已完成
        2: 'info'       // 已取消
      }
      return statusMap[status] || 'info'
    },
    getStatusText(status) {
      const statusMap = {
        0: '待就诊',
        1: '已完成',
        2: '已取消'
      }
      return statusMap[status] || '未知'
    },
    handleSearch() {
      this.currentPage = 1
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    async fetchRecords() {
      try {
        this.loading = true
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
        const res = await this.$http.get(`/appointments/user/${userInfo.id}`)
        if (res.code === 200) {
          this.records = res.data || []
          this.total = this.records.length
        }
      } catch (error) {
        console.error('获取预约记录失败:', error)
        this.$message.error('获取预约记录失败')
      } finally {
        this.loading = false
      }
    },
    viewDetails(record) {
      this.$router.push(`/records/detail/${record.id}`)
    },
    async handleCancel(record) {
      try {
        await this.$confirm('确定要取消该预约吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        const res = await this.$http.put(`/appointments/${record.id}/cancel`)
        if (res.code === 200) {
          this.$message.success('取消预约成功')
          this.fetchRecords()
        } else {
          this.$message.error(res.message || '取消预约失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('取消预约失败:', error)
          this.$message.error('取消预约失败')
        }
      }
    }
  },
  created() {
    this.fetchRecords()
  }
}
</script>

<style lang="scss" scoped>
.records {
  .filter-container {
    margin-bottom: 24px;
    display: flex;
    gap: 16px;
    background: linear-gradient(135deg, #f6f9fe 0%, #ffffff 100%);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    .filter-item {
      width: 240px;
      
      .el-input__inner {
        border-radius: 4px;
        border: 1px solid #e8f0fc;
        transition: all 0.3s ease;
        height: 40px;
        
        &:hover {
          border-color: #69c0ff;
        }
        
        &:focus {
          border-color: #1890ff;
          box-shadow: 0 0 8px rgba(24, 144, 255, 0.2);
        }
      }
    }
  }

  .record-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    
    .custom-table {
      margin: 0;
      
      ::v-deep {
        .el-table__header-wrapper {
          th {
            background: linear-gradient(90deg, #f0f7ff 0%, #e6f3ff 100%);
            color: #1890ff;
            font-weight: 600;
            height: 50px;
            padding: 8px 16px;
            border-bottom: 2px solid #e8f0fc;
          }
        }
        
        .el-table__row {
          transition: all 0.3s ease;
          
          td {
            padding: 16px;
            color: #333;
          }
          
          &:hover {
            background-color: #f6f9fe !important;
            transform: translateY(-2px);
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            
            td {
              background-color: transparent;
            }
          }
        }
        
        .el-button--mini {
          padding: 8px 16px;
          margin: 0 4px;
          border-radius: 4px;
          font-size: 13px;
          transition: all 0.3s ease;
          
          &.el-button--primary {
            background: linear-gradient(90deg, #1890ff 0%, #69c0ff 100%);
            border: none;
            color: #fff;
            
            &:hover {
              background: linear-gradient(90deg, #40a9ff 0%, #85d1ff 100%);
              transform: translateY(-1px);
            }
          }
          
          &.el-button--danger {
            background: linear-gradient(90deg, #ff4d4f 0%, #ff7875 100%);
            border: none;
            color: #fff;
            
            &:hover {
              background: linear-gradient(90deg, #ff7875 0%, #ffa39e 100%);
              transform: translateY(-1px);
            }
          }
        }
        
        .el-tag {
          border-radius: 4px;
          padding: 0 12px;
          height: 24px;
          line-height: 22px;
          font-size: 13px;
          border: none;
          
          &.el-tag--success {
            background: linear-gradient(90deg, #52c41a 0%, #73d13d 100%);
            color: #fff;
          }
          
          &.el-tag--warning {
            background: linear-gradient(90deg, #faad14 0%, #ffc53d 100%);
            color: #fff;
          }
          
          &.el-tag--info {
            background: linear-gradient(90deg, #8c8c8c 0%, #bfbfbf 100%);
            color: #fff;
          }
        }
      }
    }
    
    .pagination-container {
      padding: 20px;
      text-align: right;
      background: linear-gradient(90deg, #f6f9fe 0%, #ffffff 100%);
      border-top: 1px solid #e8f0fc;
      
      ::v-deep {
        .el-pagination {
          padding: 0;
          font-weight: normal;
          
          .el-pagination__sizes {
            margin-right: 16px;
            
            .el-input__inner {
              border-color: #e8f0fc;
              
              &:hover {
                border-color: #69c0ff;
              }
            }
          }
          
          .el-pager li {
            background: transparent;
            border: 1px solid #e8f0fc;
            margin: 0 4px;
            min-width: 32px;
            border-radius: 4px;
            transition: all 0.3s ease;
            
            &:hover {
              border-color: #69c0ff;
              color: #1890ff;
            }
            
            &.active {
              background: #1890ff;
              color: #fff;
              border-color: #1890ff;
            }
          }
          
          .btn-prev, .btn-next {
            background: transparent;
            border: 1px solid #e8f0fc;
            border-radius: 4px;
            padding: 0 12px;
            margin: 0 4px;
            
            &:hover {
              border-color: #69c0ff;
              color: #1890ff;
            }
            
            &.disabled {
              border-color: #e8f0fc;
              color: #c0c4cc;
            }
          }
        }
      }
    }
  }
}
</style> 