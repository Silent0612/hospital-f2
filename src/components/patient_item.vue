<template>
  <div id="patientItem">
    <el-row>
      <el-col :span="12">
        <img src="../assets/img/patient_pic.png" alt="" />
      </el-col>
      <el-col :span="12">
        <ul class="item_con">
          <li>
            <span>姓名：</span>
            <p>{{ info.userName }}</p>
          </li>
          <li>
            <span>性别：</span>
            <p>{{ info.userGender === 1 ? "男" : "女" }}</p>
          </li>
          <li>
            <span>年龄：</span>
            <p>{{ info.userAge }}</p>
          </li>
          <li>
            <span>就诊时间：</span>
            <p>{{ info.diagnoseTime }}</p>
          </li>
          <li>
            <span>状态：</span>
            <p>
              <el-tag :type="getStatusType(info.status)">
                {{ getStatusText(info.status) }}
              </el-tag>
            </p>
          </li>
          <li class="item_icon">
            <i
              class="el-icon-view"
              @click.stop="viewPatient(info)"
              title="查看"
            ></i>
            <i
              class="el-icon-edit"
              @click.stop="startDiagnose(info)"
              :class="{ 'disabled': info.status !== 0 }"
              title="开始就诊"
            ></i>
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ["info"],
  methods: {
    getStatusType(status) {
      const types = {
        0: 'warning',  // 待就诊
        1: 'success',  // 已完成
        2: 'info'      // 已取消
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

    viewPatient(patient) {
      this.$router.push({
        path: `/doctor/patient/detail/${patient.id}/view`
      })
    },

    startDiagnose(patient) {
      if (patient.status === 0) {
        this.$router.push({
          name: 'diagnose',
          params: { id: patient.id }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#patientItem {
  width: 22%;
  padding: 15px;
  background: #fff;
  margin-bottom: 17px;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  margin-right: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px 0 rgba(0,0,0,.15);
  }

  img {
    width: 95px;
    height: 105px;
    object-fit: cover;
    border-radius: 4px;
  }

  .item_con {
    display: flex;
    flex-direction: column;
    gap: 8px;

    li {
      display: flex;
      align-items: center;
      
      span {
        color: #909399;
        width: 70px;
        flex-shrink: 0;
      }
      
      p {
        color: #303133;
        margin: 0;
      }
    }

    .item_icon {
      display: flex;
      justify-content: space-around;
      margin-top: 10px;
      
      i {
        font-size: 18px;
        color: #409EFF;
        cursor: pointer;
        padding: 5px;
        border-radius: 4px;
        transition: all 0.3s ease;
        
        &:hover {
          background-color: #ecf5ff;
        }
        
        &.disabled {
          color: #C0C4CC;
          cursor: not-allowed;
          
          &:hover {
            background-color: transparent;
          }
        }
      }
    }
  }
}
</style>
