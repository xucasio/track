<template>
  <div>
    <!-- <el-table
      ref="mainTable"
      v-loading="loading"
      :data="records"
      border
      size="mini"
      class="list"
      element-loading-text="拼命加载中"
      max-height="600"
    >
      <el-table-column
        label="序号"
        show-overflow-tooltip
        type="index"
        align="center"
        min-width="50"
      />
      <el-table-column
        label="动作名称"
        prop="action_name"
        align="center"
      />
      <el-table-column
        label="持续时间"
        align="center"
        prop="action_time"
      />
      <el-table-column
        label="司机"
        align="center"
        prop="driver_name"
      />
      <el-table-column
        label="评分"
        align="center"
        prop="score"
      />
      <el-table-column
        label="动作时间"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>
    </el-table> -->
    <div ref="chart" class="chart" />
  </div>
</template>
<script>
import { getAnalysis } from '@/api/realtime'
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '@/views/dashboard/admin/components/mixins/resize'
export default {
  mixins: [resize],
  data() {
    return {
      records: [],
      queryForm: {
      },
      loading: false,
      actionOptions: [
        { label: '通过', value: '0' },
        { label: '停车', value: '1' },
        { label: '确认', value: '2' },
        { label: '禁止', value: '3' },
        { label: '侧线', value: '4' }
      ],
      timeRange: [],
      options: {
        title: {
          text: '司机动作评分统计',
          left: 100
        },
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: ['driver', '通过', '停车', '确认', '禁止', '侧线'],
          source: []
        },
        xAxis: { type: 'category' },
        yAxis: {
          min: 50
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: []
      }
    }
  },
  async mounted() {
    await this.loadList()
    const options = this.getOptions(this.records)
    this.initChart(options)
  },
  methods: {
    async loadList() {
      this.loading = true
      await getAnalysis({ condition: 'driver_name' }).then(res => {
        this.loading = false
        this.records = res.data || []
      })
    },
    initChart(options) {
      this.chart = echarts.init(this.$refs['chart'])
      this.chart.setOption(options)
    },
    // options处理
    getOptions(arr) {
      this.options.dataset.source = arr.map(item => {
        const obj = { driver: item.driver_name }
        item.action_list.map(item => {
          obj[item.action_name] = item.avg_score
        })
        return obj
      })
      this.options.series = arr.map(item => { return { type: 'bar' } })
      return this.options
    }
  }
}
</script>
<style lang="scss" scoped>
.filter-container{
  padding: 10px;
  .el-input{
    width: 200px;
  }
  .el-select{
    width: 200px;
  }
}
.chart{
  margin: 30px 0;
  width: 100%;
  height: 500px;
}
</style>
