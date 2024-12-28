<template>
  <div id="patientDetail">
    <el-container>
      <el-header class="header">
        <h1>病人信息</h1>
      </el-header>

      <el-divider></el-divider>

      <el-main>
        <el-row>
          <el-col :span="20" :offset="1">
            <el-form
              ref="form"
              :model="patientInfo"
              label-width="120px"
              :disabled="isView"
            >
              <el-form-item label="患者姓名：">
                <el-input v-model="patientInfo.userName" disabled></el-input>
              </el-form-item>
              <el-form-item label="性别：">
                <el-select v-model="patientInfo.userGender" disabled>
                  <el-option label="男" :value="1"></el-option>
                  <el-option label="女" :value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="年龄：">
                <el-input v-model="patientInfo.userAge" disabled></el-input>
              </el-form-item>
              <el-form-item label="就诊时间：">
                <el-input :value="formatDate(patientInfo.appointmentDate)" disabled></el-input>
              </el-form-item>
              <el-form-item label="就诊时段：">
                <el-input v-model="patientInfo.timeSlot" disabled></el-input>
              </el-form-item>
              <el-form-item label="就诊科室：">
                <el-input v-model="patientInfo.departmentName" disabled></el-input>
              </el-form-item>
              <el-form-item label="症状描述：">
                <el-input
                  type="textarea"
                  :rows="3"
                  v-model="patientInfo.description"
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item label="诊断结果：">
                <el-input
                  type="textarea"
                  :rows="4"
                  v-model="patientInfo.diagnoseResult"
                  placeholder="请输入诊断结果"
                  :disabled="isView || patientInfo.status === 1"
                ></el-input>
              </el-form-item>
              <el-form-item label="处方信息：">
                <el-input
                  type="textarea"
                  :rows="4"
                  v-model="patientInfo.prescription"
                  placeholder="请输入处方信息"
                  :disabled="isView || patientInfo.status === 1"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-main>

      <div class="footer" v-if="!isView && patientInfo.status !== 1">
        <el-button type="primary" @click="save">完成就诊</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isView: this.$route.params.from === "view",
      patientInfo: {},
      originalInfo: {}
    }
  },
  created() {
    this.getPatientDetail()
  },
  methods: {
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    },
    
    async getPatientDetail() {
      try {
        const res = await this.$http(`/appointments/${this.$route.params.id}`, 'get')
        if (res.code === 200) {
          this.patientInfo = res.data
          this.originalInfo = JSON.parse(JSON.stringify(res.data))
        } else {
          this.$message.error(res.message || '获取病人信息失败')
        }
      } catch (error) {
        console.error('获取病人信息失败:', error)
        this.$message.error('获取病人信息失败')
      }
    },

    cancel() {
      this.patientInfo = JSON.parse(JSON.stringify(this.originalInfo))
      this.$router.push('/doctor/patient/list')
    },

    async save() {
      try {
        if (!this.patientInfo.diagnoseResult) {
          return this.$message.warning('请输入诊断结果')
        }
        if (!this.patientInfo.prescription) {
          return this.$message.warning('请输入处方信息')
        }

        const res = await this.$http(`/appointments/${this.patientInfo.id}`, 'put', {
          diagnoseResult: this.patientInfo.diagnoseResult,
          prescription: this.patientInfo.prescription,
          status: 1 // 更新为已完成状态
        })
        
        if (res.code === 200) {
          this.$message.success('就诊完成')
          this.$router.push('/doctor/patient/list')
        } else {
          this.$message.error(res.message || '保存失败')
        }
      } catch (error) {
        console.error('保存失败:', error)
        this.$message.error('保存失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#patientDetail {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
  min-height: calc(100vh - 120px);
  
  .header {
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
    
    h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
      color: #333;
    }
  }

  .el-main {
    padding: 30px;
  }

  .footer {
    padding: 20px;
    text-align: center;
    border-top: 1px solid #f0f0f0;
    
    .el-button {
      min-width: 120px;
      margin: 0 10px;
    }
  }

  .el-form {
    max-width: 800px;
    margin: 0 auto;

    .el-form-item {
      margin-bottom: 25px;
    }

    .el-input, .el-select {
      width: 100%;
    }
  }
}
</style>
