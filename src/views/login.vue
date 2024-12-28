<template>
  <div id="login">
    <div class="login_form">
      <h3>医生工作站</h3>
      <el-form :model="form">
        <el-form-item>
          <el-input
            prefix-icon="el-icon-user"
            v-model="form.phone"
            placeholder="请输入手机号码">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            prefix-icon="el-icon-lock"
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="login" type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labelPosition: "right",
      form: {
        phone: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      if (!this.form.phone || !this.form.password) {
        this.$message.error('请输入手机号和密码')
        return
      }
      
      // 发送登录请求
      this.$http('/empinfo/login', 'post', {
        phone: this.form.phone,
        password: this.form.password
      }).then(res => {
        console.log('登录响应:', res)
        if (res.code === 200) {
          const userInfo = res.data
          // 检查用户角色
          if (userInfo.roleId === 1) { // 医生角色
            // 保存用户信息到localStorage
            localStorage.setItem('doctorInfo', JSON.stringify(userInfo))
            // 保存登录状态
            localStorage.setItem('isLogin', 'true')
            // 保存token
            localStorage.setItem('token', userInfo.id)
            
            this.$message({
              message: '登录成功',
              type: 'success'
            })
            
            // 跳转到医生工作台
            setTimeout(() => {
              this.$router.push({
                name: 'doctor'
              })
            }, 1500)
          } else {
            this.$message.error('非医生用户不能登录')
          }
        } else {
          this.$message.error(res.message || '登录失败')
        }
      }).catch(error => {
        console.error('登录错误:', error)
        this.$message.error('登录失败，请稍后重试')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
body,
html {
  width: 100%;
  height: 100%;
}
#login {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 550px;
  min-width: 1200px;
  background: linear-gradient(135deg, #1e90ff 0%, #ffffff 100%);
  
  .login_form {
    width: 400px;
    background: rgba(255, 255, 255, 0.95);
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);

    h3 {
      width: 100%;
      font-size: 24px;
      color: #1e90ff;
      text-align: center;
      margin-bottom: 30px;
      font-weight: 500;
    }

    .el-input {
      margin-bottom: 20px;
      
      .el-input__inner {
        border-radius: 25px;
        height: 45px;
        padding-left: 45px;
        border: 1px solid #e8f0fc;
        
        &:focus {
          border-color: #1e90ff;
          box-shadow: 0 0 8px rgba(30, 144, 255, 0.2);
        }
      }
      
      .el-input__prefix {
        left: 15px;
        color: #1e90ff;
      }
    }

    .el-button.login {
      width: 100%;
      height: 45px;
      border-radius: 25px;
      background: linear-gradient(90deg, #1e90ff 0%, #00bfff 100%);
      border: none;
      font-size: 16px;
      margin-top: 10px;
      
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(30, 144, 255, 0.3);
      }
    }
  }
}
</style>
