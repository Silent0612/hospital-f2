<template>
  <div class="statistics-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="chart-card" shadow="hover">
          <div slot="header">
            <span>患者性别比例</span>
          </div>
          <div ref="genderChart" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card" shadow="hover">
          <div slot="header">
            <span>患者年龄分布</span>
          </div>
          <div ref="ageChart" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card class="chart-card" shadow="hover">
          <div slot="header">
            <span>就诊类型分布</span>
          </div>
          <div ref="visitTypeChart" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card" shadow="hover">
          <div slot="header">
            <span>每月就诊趋势</span>
          </div>
          <div ref="trendChart" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'Statistics',
  data() {
    return {
      charts: {},
      appointmentData: []
    }
  },
  mounted() {
    this.initCharts()
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        const doctorInfo = JSON.parse(localStorage.getItem('doctorInfo') || '{}')
        if (!doctorInfo.id) {
          this.$message.error('请先登录')
          this.$router.push('/login')
          return
        }
        
        const response = await this.$http('/appointments/doctor/' + doctorInfo.id, 'get')
        console.log('获取到的预约数据:', response)
        
        if (response && response.code === 200) {
          this.appointmentData = response.data || []
          this.updateCharts()
        } else {
          this.$message.error(response?.message || '获取统计数据失败')
        }
      } catch (error) {
        console.error('获取统计数据失败:', error)
        this.$message.error('获取统计数据失败')
      }
    },
    initCharts() {
      // 性别比例图表
      this.charts.gender = echarts.init(this.$refs.genderChart)
      this.charts.gender.setOption({
        title: { 
          text: '性别比例',
          left: 'center',
          textStyle: {
            color: '#2c3e50'
          }
        },
        tooltip: { 
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: { 
          orient: 'horizontal',
          bottom: 'bottom'
        },
        color: ['#91d5ff', '#ff9c6e'],
        series: [{
          name: '性别比例',
          type: 'pie',
          radius: '65%',
          center: ['50%', '50%'],
          data: [
            { value: 0, name: '男' },
            { value: 0, name: '女' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            show: true,
            formatter: '{b}: {d}%'
          }
        }]
      })

      // 年龄分布图表
      this.charts.age = echarts.init(this.$refs.ageChart)
      this.charts.age.setOption({
        title: { 
          text: '年龄分布',
          left: 'center',
          textStyle: {
            color: '#2c3e50'
          }
        },
        tooltip: { 
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: { 
          type: 'category',
          data: ['0-18', '19-30', '31-45', '46-60', '60+'],
          axisLabel: {
            interval: 0,
            color: '#666'
          }
        },
        yAxis: { 
          type: 'value',
          name: '人数',
          axisLabel: {
            color: '#666'
          }
        },
        color: ['#40a9ff'],
        series: [{
          type: 'bar',
          data: [0, 0, 0, 0, 0],
          barWidth: '40%',
          itemStyle: {
            borderRadius: [4, 4, 0, 0]
          }
        }]
      })

      // 就诊类型分布图表
      this.charts.visitType = echarts.init(this.$refs.visitTypeChart)
      this.charts.visitType.setOption({
        title: { 
          text: '就诊类型分布',
          left: 'center',
          textStyle: {
            color: '#2c3e50'
          }
        },
        tooltip: { 
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          bottom: 'bottom'
        },
        color: ['#36cfc9', '#73d13d', '#ffd666'],
        series: [{
          name: '就诊类型',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b}: {d}%'
          },
          data: [
            { value: 0, name: '初诊' },
            { value: 0, name: '复诊' },
            { value: 0, name: '其他' }
          ]
        }]
      })

      // 就诊趋势图表
      this.charts.trend = echarts.init(this.$refs.trendChart)
      this.charts.trend.setOption({
        title: { 
          text: '每月就诊趋势',
          left: 'center',
          textStyle: {
            color: '#2c3e50'
          }
        },
        tooltip: { 
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: '#40a9ff',
              width: 2
            }
          }
        },
        xAxis: { 
          type: 'category',
          boundaryGap: false,
          data: this.getLastSixMonths(),
          axisLabel: {
            color: '#666'
          }
        },
        yAxis: { 
          type: 'value',
          name: '就诊人数',
          axisLabel: {
            color: '#666'
          }
        },
        color: ['#40a9ff'],
        series: [{
          name: '就诊人数',
          type: 'line',
          smooth: true,
          data: [0, 0, 0, 0, 0, 0],
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: 'rgba(64,169,255,0.3)'
              }, {
                offset: 1,
                color: 'rgba(64,169,255,0.1)'
              }]
            }
          },
          lineStyle: {
            width: 3
          },
          emphasis: {
            focus: 'series'
          }
        }]
      })

      window.addEventListener('resize', () => {
        Object.values(this.charts).forEach(chart => chart.resize())
      })
    },
    updateCharts() {
      // 更新性别比例
      const genderStats = this.calculateGenderStats()
      this.charts.gender.setOption({
        series: [{
          data: [
            { value: genderStats.male, name: '男' },
            { value: genderStats.female, name: '女' }
          ]
        }]
      })

      // 更新年龄分布
      const ageStats = this.calculateAgeStats()
      this.charts.age.setOption({
        series: [{
          data: Object.values(ageStats)
        }]
      })

      // 更新就诊类型分布
      const visitTypeStats = this.calculateVisitTypeStats()
      this.charts.visitType.setOption({
        series: [{
          data: [
            { value: visitTypeStats.first, name: '初诊' },
            { value: visitTypeStats.follow, name: '复诊' },
            { value: visitTypeStats.other, name: '其他' }
          ]
        }]
      })

      // 更新就诊趋势
      const trendStats = this.calculateTrendStats()
      this.charts.trend.setOption({
        series: [{
          data: Object.values(trendStats)
        }]
      })
    },
    calculateGenderStats() {
      return {
        male: this.appointmentData.filter(item => item.userGender === 1).length,
        female: this.appointmentData.filter(item => item.userGender === 0).length
      }
    },
    calculateAgeStats() {
      const ageGroups = { '0-18': 0, '19-30': 0, '31-45': 0, '46-60': 0, '60+': 0 }
      this.appointmentData.forEach(item => {
        const age = item.userAge
        if (age <= 18) ageGroups['0-18']++
        else if (age <= 30) ageGroups['19-30']++
        else if (age <= 45) ageGroups['31-45']++
        else if (age <= 60) ageGroups['46-60']++
        else ageGroups['60+']++
      })
      return ageGroups
    },
    calculateVisitTypeStats() {
      return {
        first: this.appointmentData.filter(item => item.visitType === 1).length,
        follow: this.appointmentData.filter(item => item.visitType === 2).length,
        other: this.appointmentData.filter(item => item.visitType === 3).length
      }
    },
    calculateTrendStats() {
      const stats = {}
      const months = this.getLastSixMonths()
      months.forEach(month => { stats[month] = 0 })
      
      this.appointmentData.forEach(item => {
        const date = new Date(item.appointmentDate)
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        if (stats[month] !== undefined) {
          stats[month]++
        }
      })
      return stats
    },
    getLastSixMonths() {
      const months = []
      const now = new Date()
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
      }
      return months
    }
  },
  beforeDestroy() {
    Object.values(this.charts).forEach(chart => chart.dispose())
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style lang="scss" scoped>
.statistics-container {
  padding: 20px;
  
  .chart-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }
    
    ::v-deep .el-card__header {
      padding: 15px 20px;
      border-bottom: 1px solid #f0f0f0;
      
      span {
        font-size: 16px;
        font-weight: 500;
        color: #2c3e50;
      }
    }
  }
}
</style> 