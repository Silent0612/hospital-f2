<template>
  <div class="department page-container">
    <h2 class="page-title">科室选择</h2>
    
    <el-row :gutter="20">
      <el-col :span="6" v-for="dept in departmentList" :key="dept.id">
        <el-card class="dept-card" shadow="hover" @click.native="handleSelect(dept)">
          <div class="dept-icon">
            <i class="el-icon-first-aid-kit"></i>
          </div>
          <h3 class="dept-name">{{ dept.name }}</h3>
          <p class="dept-desc">{{ dept.description || '暂无描述' }}</p>
          <div class="dept-info">
            <span>
              <i class="el-icon-user"></i>
              {{ dept.doctorCount || 0 }} 名医生
            </span>
            <span>
              <i class="el-icon-time"></i>
              {{ dept.appointmentCount || 0 }} 次预约
            </span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Department',
  data() {
    return {
      departmentList: []
    }
  },
  created() {
    this.fetchDepartments()
  },
  methods: {
    async fetchDepartments() {
      try {
        const res = await this.$http.get('/department/list')
        if (res.code === 200) {
          this.departmentList = res.data || []
        } else {
          this.$message.error('获取科室列表失败')
        }
      } catch (error) {
        console.error('获取科室列表失败:', error)
        this.$message.error('获取科室列表失败')
      }
    },
    handleSelect(dept) {
      this.$router.push({
        path: '/appointment',
        query: { departmentId: dept.id }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.department {
  .dept-card {
    height: 280px;
    margin-bottom: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      
      .dept-icon {
        transform: scale(1.1);
        
        i {
          color: #409EFF;
        }
      }
    }
    
    .dept-icon {
      text-align: center;
      margin: 20px 0;
      transition: all 0.3s ease;
      
      i {
        font-size: 48px;
        color: #666;
        transition: all 0.3s ease;
      }
    }
    
    .dept-name {
      text-align: center;
      font-size: 18px;
      color: #333;
      margin: 15px 0;
      font-weight: 500;
    }
    
    .dept-desc {
      text-align: center;
      font-size: 14px;
      color: #666;
      margin: 10px 0;
      height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    
    .dept-info {
      display: flex;
      justify-content: space-around;
      margin-top: 20px;
      padding: 0 20px;
      
      span {
        font-size: 14px;
        color: #666;
        display: flex;
        align-items: center;
        
        i {
          margin-right: 5px;
          font-size: 16px;
          color: #409EFF;
        }
      }
    }
  }
}
</style> 