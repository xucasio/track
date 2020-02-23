<template>
  <div class="app-container">
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
        <el-table-column label="序号" width="80" align="center">
          <template slot-scope="{row, $index}">
            <span>{{ $index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="动作名称" width="140" align="center">
          <template slot-scope="{row}">
            <span>{{ row.action_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="140" align="center">
          <template slot-scope="{row}">
            <span>{{ row.status_code | statusFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" width="" align="center">
          <template slot-scope="{row}">
            <span>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="text" size="mini" @click="editHandle(row)">
              配置
            </el-button>
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
          <el-form-item label="动作名称" prop="trainNo">
            <el-input v-model="temp.trainNo" />
          </el-form-item>
          <el-form-item label="姓名" prop="deviceName">
            <el-input v-model="temp.deviceName" />
          </el-form-item>
          <el-form-item label="状态" prop="ip">
            <el-select v-model="temp.status" placeholder="请选择">
              <el-option
                v-for="item in [{value: 1, label: '启用'}, {value: 0, label: '禁用'}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="描述" prop="port">
            <el-input v-model="temp.name" type="textarea" />
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
import { list, add, del } from '@/api/setting/actions'
import Pagination from '@/components/Pagination'
export default {
  components: {
    Pagination
  },
  filters: {
    statusFilter(val) {
      return { 1: '启用', 0: '禁用' }[val]
    }
  },
  data() {
    return {
      query: {
        total: 0,
        size: 10,
        current: 1
      },
      list: [{}],
      listLoading: false,
      drawer: false,
      drawerTitle: '新增动作',
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
      this.drawerTitle = '新增动作'
      this.$nextTick(() => {
        this.$refs['submitForm'].clearValidate()
      })
    },
    editHandle(row) {
      this.drawer = true
      this.drawerTitle = '编辑动作'
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
