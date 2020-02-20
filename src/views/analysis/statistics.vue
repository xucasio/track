<template>
  <div>
    <div class="filter-container">
      <el-input v-model="queryForm.driver_name" placeholder="司机名" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="queryForm.action_type" class="filter-item" clearable @change="handleFilter">
        <el-option
          v-for="(item, index) in actionOptions"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        v-model="timeRange"
        class="filter-item"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change.native="timeRangeChange"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
    </div>
    <el-table
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
        label="车次"
        align="center"
        prop="train_no"
      />
      <el-table-column
        label="历史视频"
        align="center"
        prop="video_path"
      />
      <el-table-column
        label="帧位置"
        align="center"
        prop="frame"
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
    </el-table>

  </div>
</template>
<script>
import { getList } from '@/api/realtime'
export default {
  data() {
    return {
      records: [],
      queryForm: {
        driver_name: '',
        action_type: '',
        start_date: '',
        end_date: ''
      },
      loading: false,
      actionOptions: [
        { label: '通过', value: '0' },
        { label: '停车', value: '1' },
        { label: '确认', value: '2' },
        { label: '禁止', value: '3' },
        { label: '侧线', value: '4' }
      ],
      timeRange: []
    }
  },
  mounted() {
    this.loadList()
  },
  methods: {
    loadList() {
      this.loading = true
      getList(this.queryForm).then(res => {
        this.loading = false
        this.records = res.data || []
      })
    },
    handleFilter() {
      this.loadList()
    },
    timeRangeChange(arr) {
      console.log('时间范围的值', arr)
      this.queryForm.start_date = arr[0]
      this.queryForm.end_date = arr[1]
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
</style>
