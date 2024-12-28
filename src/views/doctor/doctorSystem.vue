<template>
  <div class="doctor-system">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="logo">
        <i class="el-icon-s-platform"></i>
        医疗管理系统
      </div>
      <div class="user-info">
        <span class="welcome">欢迎您，{{ doctorInfo.username }}</span>
        <el-button type="text" @click="logout">退出登录</el-button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-container">
      <!-- 水平导航菜单 -->
      <div class="nav-menu">
        <el-menu
          :default-active="$route.path"
          mode="horizontal"
          background-color="transparent"
          text-color="#2c3e50"
          active-text-color="#409EFF"
          router>
          <el-menu-item index="/doctor/patient/list">
            <i class="el-icon-user"></i>
            <span>我的病人</span>
          </el-menu-item>
          <el-menu-item index="/doctor/personal/info">
            <i class="el-icon-s-custom"></i>
            <span>个人信息</span>
          </el-menu-item>
          <el-menu-item index="/doctor/statistics">
            <i class="el-icon-s-data"></i>
            <span>统计信息</span>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 内容展示区 -->
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DoctorSystem",
  data() {
    return {
      doctorInfo: {}
    };
  },
  created() {
    this.getDoctorInfo();
  },
  methods: {
    getDoctorInfo() {
      const info = localStorage.getItem("doctorInfo");
      if (info) {
        this.doctorInfo = JSON.parse(info);
      } else {
        this.$router.push("/login");
      }
    },
    logout() {
      this.$confirm("确认退出登录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          localStorage.removeItem("doctorInfo");
          localStorage.removeItem("isLogin");
          localStorage.removeItem("token");
          this.$router.push("/login");
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.doctor-system {
  min-height: 100vh;
  background: linear-gradient(135deg, #e6f3ff 0%, #ffffff 100%);

  .header {
    height: 60px;
    background: linear-gradient(90deg, #1e90ff 0%, #00bfff 100%);
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    .logo {
      font-size: 20px;
      font-weight: bold;
      display: flex;
      align-items: center;
      
      i {
        margin-right: 10px;
        font-size: 24px;
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      
      .welcome {
        margin-right: 20px;
        font-size: 14px;
      }

      .el-button--text {
        color: #fff;
        font-size: 14px;
        
        &:hover {
          color: #f0f9ff;
        }
      }
    }
  }

  .main-container {
    padding: 20px;
    
    .nav-menu {
      margin-bottom: 20px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
      
      .el-menu {
        border: none;
        
        &.el-menu--horizontal {
          border-bottom: none;
          
          .el-menu-item {
            height: 50px;
            line-height: 50px;
            font-size: 15px;
            
            &:hover {
              background-color: rgba(64, 158, 255, 0.1);
            }
            
            &.is-active {
              color: #409EFF;
              background-color: rgba(64, 158, 255, 0.1);
              border-bottom: 2px solid #409EFF;
            }
            
            i {
              margin-right: 5px;
            }
          }
        }
      }
    }

    .content {
      background: rgba(255, 255, 255, 0.9);
      border-radius: 8px;
      min-height: calc(100vh - 180px);
      padding: 20px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    }
  }
}
</style>
