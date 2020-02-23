<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input v-model="query.name" />
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="options-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="addHandle">新增</el-button>
    </div>
    <div class="table-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="序号" width="60" align="center">
          <template slot-scope="{row, $index}">
            <span>{{ $index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户名" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.trainNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.deviceName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="工号" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.ip }}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.port }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出生日期" width="120" align="center">
          <template slot-scope="{row}">
            <span>{{ row.deviceType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="入职日期" width="120" align="center">
          <template slot-scope="{row}">
            <span>{{ row.status | statusFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="部门" align="center">
          <template slot-scope="{row}">
            <span>{{ row.lineInfo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="{row}">
            <span>{{ row.lineInfo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <!-- <el-button type="text" size="mini" @click="editHandle(row)">
              编辑
            </el-button> -->
            <el-button v-if="row.status!='deleted'" size="mini" type="text" @click="deleteHandle(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="query.total>0" size="mini" :total="query.total" :page.sync="query.page" :limit.sync="query.limit" @pagination="getList" />
    </div>
    <el-drawer
      :title="drawerTitle"
      :visible.sync="drawer"
      custom-class="demo-drawer"
      :destroy-on-close="true"
      :wrapper-closable="false"
    >
      <div class="demo-drawer__content">
        <el-form ref="submitForm" :model="temp" size="mini" :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="trainNo">
            <el-input v-model="temp.trainNo" />
          </el-form-item>
          <el-form-item label="姓名" prop="deviceName">
            <el-input v-model="temp.deviceName" />
          </el-form-item>
          <el-form-item label="工号" prop="ip">
            <el-input v-model="temp.ip" />
          </el-form-item>
          <el-form-item label="性别" prop="port">
            <el-select v-model="temp.status" placeholder="请选择">
              <el-option
                v-for="item in [ {value: 1, label: '男'}, {value: 0, label: '女'}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="出生日期" prop="deviceNo">
            <el-date-picker
              v-model="temp.value1"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="入职日期" prop="deviceType">
            <el-date-picker
              v-model="temp.value1"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="temp.status" placeholder="请选择">
              <el-option
                v-for="item in [{value: 1, label: '在职'}, {value: 0, label: '离职'}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="线路信息" prop="lineInfo">
            <el-date-picker
              v-model="temp.value1"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm">取消</el-button>
          <el-button type="primary" @click="submitHandle()">确定</el-button>
        </div>
      </div>

    </el-drawer>
  </div>
</template>
<script>
import { list, add, del } from '@/api/system/equipment'
import Pagination from '@/components/Pagination'
export default {
  components: {
    Pagination
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        2: '全部',
        1: '在线',
        0: '离线'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      query: {
        total: 0,
        size: 10,
        current: 1,
        status: 2
      },
      list: [],
      listLoading: false,
      drawer: false,
      drawerTitle: '新增用户',
      rules: {},
      temp: {
        trainNo: '',
        deviceName: '',
        ip: '',
        port: '',
        deviceNo: '',
        deviceType: '',
        online: '',
        lineInfo: ''
      }
    }
  },
  methods: {
    handleFilter() {
      this.getList()
    },
    addHandle() {
      this.resetTemp()
      this.drawer = true
      this.drawerTitle = '新增用户'
      this.$nextTick(() => {
        this.$refs['submitForm'].clearValidate()
      })
    },
    editHandle(row) {
      this.drawer = true
      this.drawerTitle = '编辑用户'
      this.temp = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs['submitForm'].clearValidate()
      })
    },
    submitHandle() {
      this.$refs['submitForm'].validate((valid) => {
        if (valid) {
          add().then(res => {
            this.$message({
              message: '操作Success',
              type: 'success'
            })
          })
        }
      })
    },
    deleteHandle(row) {
      this.$confirm('是否删除该条记录?', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(_ => {
        del(row.id).then(res => {
          this.$message({
            message: '操作Success',
            type: 'success'
          })
        })
      })
        .catch(_ => {
          this.$message({
            message: '操作取消',
            type: 'info'
          })
        })
    },
    getList() {
      list(this.query).then(res => {
        this.list = res.data.records
      })
    },
    cancelForm() {
      this.drawer = false
    },
    resetTemp() {
      this.temp = {
        trainNo: '',
        deviceName: '',
        ip: '',
        port: '',
        deviceNo: '',
        deviceType: '',
        online: '',
        lineInfo: ''
      }
    }
  }
}
</script>
