<template>
  <div id="checkReport">
    <div class="cyber-container">
      <div class="search-panel">
        <div class="panel-header">
          <span class="cyber-text">医疗数据检索系统</span>
        </div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item>
            <el-input
              v-model="formInline.userName"
              placeholder="输入患者姓名"
              class="cyber-input"
            >
              <i slot="prefix" class="el-icon-user"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="formInline.date"
              type="date"
              :value="null ? '' : formInline.date"
              placeholder="选择就诊日期"
              value-format="yyyy-MM-dd"
              class="cyber-input"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch" class="cyber-button">
              <span class="button-text">搜索</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="data-panel">
        <div class="panel-header">
          <span class="cyber-text">患者数据列表</span>
        </div>
        <el-table 
          :data="reportData" 
          style="width: 100%"
          class="cyber-table"
          :header-cell-style="{ background: '#1a1f3d', color: '#00ffff' }"
          :cell-style="{ background: '#0d1117', color: '#fff' }"
        >
          <el-table-column prop="id" label="序号" width="60">
            <template slot-scope="scope">
              <span class="cyber-id">#{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userinfo.username" label="姓名" width="90">
            <template slot-scope="scope">
              <span class="cyber-name">{{ scope.row.userinfo.username }}</span>
            </template>
          </el-table-column>
          <el-table-column label="性别" width="60">
            <template slot-scope="scope">
              <span class="cyber-gender">{{ scope.row.userinfo.gender }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机号" width="120">
            <template slot-scope="scope">
              <span class="cyber-phone">{{ scope.row.phone }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="departmentinfo.departmentname" label="就诊科室">
            <template slot-scope="scope">
              <span class="cyber-dept">{{ scope.row.departmentinfo.departmentname }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="diagnostictype" label="诊断类型">
            <template slot-scope="scope">
              <span class="cyber-type" :class="scope.row.diagnostictype == 1 ? 'type-init' : 'type-follow'">
                {{ scope.row.diagnostictype == 1 ? "初诊" : "复诊" }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="seektime" label="就诊时间" width="180">
            <template slot-scope="scope">
              <span class="cyber-time">{{ scope.row.seektime }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="diagnosis" label="诊断结果" width="220">
            <template slot-scope="scope">
              <span class="cyber-diagnosis">{{ scope.row.diagnosis }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="done" label="操作">
            <template slot-scope="scope">
              <el-button 
                size="mini" 
                type="primary" 
                class="cyber-button-small"
                @click="$router.push({path:'/medicalrecord/report/check',query:{recordId:scope.row.id}})">
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          class="cyber-pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          background
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formInline: {
        userName: "",
        date: "",
      },
      reportData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  mounted() {
    this.getReportList();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getReportList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getReportList();
    },
    getReportList() {
      this.$http("/medicalrecord/list", "get", {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        username: this.formInline.userName || undefined,
        seektime: this.formInline.date || undefined
      }).then((res) => {
        if (res.suc) {
          this.reportData = res.result.list || [];
          this.total = res.result.total || 0;
        } else {
          this.$message.error(res.msg || "获取报告列表失败");
        }
      });
    },
    handleSearch() {
      this.currentPage = 1;
      this.getReportList();
    }
  }
};
</script>

<style lang="scss">
#checkReport {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a192f 0%, #0d1117 100%);
  padding: 20px;

  .cyber-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  .search-panel, .data-panel {
    background: rgba(13, 17, 23, 0.8);
    border: 1px solid #1c2538;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.1);
  }

  .panel-header {
    margin-bottom: 20px;
    border-bottom: 2px solid #00ffff;
    padding-bottom: 10px;
  }

  .cyber-text {
    color: #00ffff;
    font-size: 1.2em;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  }

  .cyber-input {
    .el-input__inner {
      background: #1a1f3d;
      border: 1px solid #00ffff;
      color: #fff;
      border-radius: 4px;
      &:focus {
        box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
      }
    }
    .el-input__prefix {
      color: #00ffff;
    }
  }

  .cyber-button {
    background: linear-gradient(45deg, #00ffff 0%, #0066ff 100%);
    border: none;
    color: #fff;
    padding: 10px 20px;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
    transition: all 0.3s ease;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
    }
  }

  .cyber-button-small {
    @extend .cyber-button;
    padding: 5px 15px;
    font-size: 12px;
  }

  .cyber-table {
    background: transparent;
    border: 1px solid #1c2538;
    border-radius: 8px;
    overflow: hidden;

    .el-table__row {
      transition: all 0.3s ease;
      &:hover {
        background: rgba(26, 31, 61, 0.5) !important;
      }
    }
  }

  .cyber-id {
    color: #00ffff;
    font-family: monospace;
  }

  .cyber-name {
    color: #fff;
    font-weight: bold;
  }

  .cyber-gender {
    color: #7f7fff;
  }

  .cyber-phone {
    color: #00ff99;
    font-family: monospace;
  }

  .cyber-dept {
    color: #ff66cc;
  }

  .cyber-type {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    &.type-init {
      background: rgba(0, 255, 255, 0.2);
      color: #00ffff;
    }
    &.type-follow {
      background: rgba(255, 102, 204, 0.2);
      color: #ff66cc;
    }
  }

  .cyber-time {
    color: #ffff00;
    font-family: monospace;
  }

  .cyber-diagnosis {
    color: #00ff99;
  }

  .cyber-pagination {
    margin-top: 20px;
    text-align: center;
    .el-pagination {
      .btn-prev, .btn-next {
        background: #1a1f3d;
        color: #00ffff;
      }
      .el-pager li {
        background: #1a1f3d;
        color: #fff;
        &.active {
          background: #00ffff;
          color: #1a1f3d;
        }
      }
    }
  }

  // 添加霓虹灯效果
  @keyframes neon {
    0% {
      box-shadow: 0 0 5px rgba(0, 255, 255, 0.2),
                 0 0 10px rgba(0, 255, 255, 0.2),
                 0 0 15px rgba(0, 255, 255, 0.2);
    }
    50% {
      box-shadow: 0 0 10px rgba(0, 255, 255, 0.4),
                 0 0 20px rgba(0, 255, 255, 0.4),
                 0 0 30px rgba(0, 255, 255, 0.4);
    }
    100% {
      box-shadow: 0 0 5px rgba(0, 255, 255, 0.2),
                 0 0 10px rgba(0, 255, 255, 0.2),
                 0 0 15px rgba(0, 255, 255, 0.2);
    }
  }

  .search-panel, .data-panel {
    animation: neon 2s infinite;
  }
}
</style>
