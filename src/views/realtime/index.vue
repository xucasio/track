<template>
  <div class="content">
    <el-row>
      <el-col
        :span="12"
        class="videoBox"
      >
        <img
          v-if="imgSrc"
          :src="imgSrc"
          width="100%"
          height="530px"
        >
        <div
          v-else
          style="background:#ccc;height:530px;"
        />
      </el-col>
      <el-col
        :span="12"
      >
        <el-table
          ref="mainTable"
          v-loading="loading"
          :data="records"
          :highlight-current-row="true"
          border
          height="530px"
          size="mini"
          class="list"
          element-loading-text="拼命加载中"
        >
          <el-table-column
            label="序号"
            show-overflow-tooltip
            type="index"
            align="center"
            min-width="50"
          />
          <el-table-column
            label="信号类型"
            prop="class"
            align="center"
            show-overflow-tooltip
            min-width="120"
          />
          <el-table-column
            label="动作时间"
            align="center"
            show-overflow-tooltip
            min-width="60"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.timestamp }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="评分"
            align="center"
            prop="score"
            show-overflow-tooltip
            min-width="80"
          />
        </el-table>
      </el-col>
    </el-row>
    <el-row
      class="bottomRow"
    >
      <el-col :span="6">
        <div class="setting">
          <div class="title">
            视频配置
          </div>
          <el-form
            ref="form"
            :model="form"
            label-width="80px"
            class="settingForm"
            size="mini"
          >
            <el-form-item label="摄像头">
              <el-select
                v-model="form.ip"
                @change="changeName"
              >
                <el-option
                  v-for="(item, index) in ipOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.val"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="分辨率">
              <el-select
                v-model="form.vga"
              >
                <el-option
                  label="480*320"
                  value="480*320"
                />
                <el-option
                  label="640*480"
                  value="640*480"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="帧率">
              <el-select
                v-model="form.fps"
              >
                <el-option
                  label="18"
                  value="18"
                />
                <el-option
                  label="24"
                  value="24"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="存储路径">
              <el-input v-model="form.path" />
            </el-form-item>
          </el-form>
          <div class="form-bottom">
            <el-button
              type="primary"
              @click="onSubmit"
            >
              提交并播放
            </el-button>
            <el-button
              type="primary"
              @click="onClose"
            >
              关闭摄像头
            </el-button>
          </div>
        </div>
      </el-col>
      <el-col
        :span="6"
        style="border-left:1px solid #ccc"
      >
        <div class="setting">
          <div class="title">
            算法配置
          </div>
          <el-form
            ref="numForm"
            :model="numForm"
            label-width="100px"
            class="settingForm"
            size="mini"
          >
            <el-form-item label="动作阈值">
              <el-input v-model="numForm.thresh" />
            </el-form-item>
            <el-form-item label="最小连帧数">
              <el-input v-model="numForm.min_frame_count" />
            </el-form-item>
            <el-form-item label="最大连帧数">
              <el-input v-model="numForm.max_frame_count" />
            </el-form-item>
            <el-form-item label="每帧惩罚系数">
              <el-input v-model="numForm.penalty_per_frame" />
            </el-form-item>
            <el-form-item label="及格分数">
              <el-input v-model="numForm.pass_score" />
            </el-form-item>
          </el-form>
          <div class="form-bottom">
            <el-button
              type="primary"
              @click="onNumSubmit"
            >
              提交配置
            </el-button>
          </div>
        </div>
        <!-- <div class="track">
          <div class="title">
            列车运行图
          </div>
          <div class="stations">
            <div
              v-for="(item, index) in stationData"
              :key="index"
              :class="[{stationLine: true},{oppoLine: index % 2 === 1}]"
            >
              <div
                v-for="(data, _index) in item"
                :key="_index"
                :class="[{item: true}, {active: currentIndex === data.index},{gone: currentIndex > data.index}]"
              >
                <span class="node">
                  <span :class="classArr(data.name, data.index)">{{ data.name }}</span>
                  <span class="point" />
                </span>
                <span :class="[{line: true}, {rotate: (_index + 1) === item.length && index % 2 === 0}, {oppo: index % 2 === 1}, {oppoRotate: (_index + 1) === item.length && index % 2 === 1}, { noBorder: (_index + 1) === item.length&&(index+1)===stationData.length}]" />
              </div>
            </div>
          </div>
        </div> -->

      </el-col>
      <el-col
        :span="12"
      >
        <div class="trackInfo">
          <div class="title">
            司机行为监控
          </div>
          <div class="track-content">
            <el-row>
              <el-col :span="12">
                <div class="info">
                  <p>
                    <img
                      width="30px"
                      :src="siji"
                    >
                    <span> 司机：{{ form.driver_name }}</span>
                  </p>
                  <p>
                    <img
                      width="30px"
                      :src="checi"
                    >
                    <span> 车次：{{ form.train_no }}</span>
                  </p>
                  <p>
                    <img
                      width="30px"
                      :src="riqi"
                    ><span> 日期：{{ new Date() | parseTime('{y}-{m}-{d}') }}</span>
                  </p>
                </div>
              </el-col>
              <el-col :span="12">
                <div
                  ref="score"
                  class="score"
                />
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import siji from '@/assets/image/jingchaliecheyuan.png'
import checi from '@/assets/image/lieche-.png'
import riqi from '@/assets/image/shijianriqi.png'
const echarts = require('echarts')

export default {
  data() {
    return {
      records: [],
      loading: false,
      socket: null,
      chart: null,
      currentIndex: 0, // 当前站点的下标
      firstClick: true, // 初次点击连socket
      siji: siji, // 司机icon,
      checi: checi, // 车次icon,
      riqi: riqi, // 日期icon
      stations: [
        '梅溪湖西',
        '麓云路',
        '文化艺术中心',
        '梅溪湖东',
        '望城坡站',
        '金星路',
        '西湖公园',
        '溁湾镇',
        '橘子洲',
        '湘江中路',
        '五一广场',
        '芙蓉广场',
        '迎宾路口',
        '袁家岭',
        '长沙火车站',
        '锦泰广场',
        '万家丽广场',
        '人民东路',
        '长沙大道',
        '沙湾公园',
        '杜花路',
        '杜花路',
        '长沙火车南站',
        '光达'],
      stationData: [],
      option: {
        tooltip: {
          formatter: '{a} <br/>{b} : {c}'
        },
        series: [
          {
            name: '姿态分数',
            type: 'gauge',
            data: [{ value: 50, name: '分数' }],
            itemStyle: {
              color: '#666'
            },
            pointer: {
              length: '70%',
              width: 6
            },
            axisLine: { // 仪表盘轴线相关配置
              show: true,
              lineStyle: {
                color: [ // 仪表盘背景颜色渐变
                  [1, new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    {
                      offset: 0.1,
                      color: '#fd2100'
                    },
                    {
                      offset: 0.6,
                      color: '#d09f00'
                    },
                    {
                      offset: 1,
                      color: '#26fd00'
                    }
                  ])
                  ]
                ],
                width: 20 // 轴线宽度
              }
            }
          }
        ]
      },
      form: {
        name: 'Camera01',
        ip: 'rtsp://admin:byb123456@192.168.1.64:554/Streaming/channels/1/',
        vga: '480*320',
        fps: '18',
        path: '/storage/',
        train_no: 101,
        driver_name: '李某某'
      },
      imgSrc: '',
      ipOptions: [
        { label: 'Camera01', val: 'rtsp://admin:byb123456@192.168.1.64:554/Streaming/channels/1/' },
        { label: 'Camera02', val: 'rtsp://admin:byb123456@192.168.1.65:554/Streaming/channels/1/' }
      ],
      numForm: {
        thresh: 0.60,
        min_frame_count: 10,
        max_frame_count: 30,
        penalty_per_frame: 0.01,
        pass_score: 0.6
      }
    }
  },
  watch: {
  },
  mounted() {
    const array = this.stations.map((item, index) => {
      return { name: item, index: index }
    })
    this.stationData = this.splitStations(array) // 切分成数组
    this.$socket.client.on('feedback', this.getData)
    this.$socket.client.on('server_response')
    this.$socket.client.on('disconnect', this.errorCab)
    this.initChart()
    // socket初始化
  },
  methods: {
    getData(data) {
      console.log('feedback的回调', data)
      switch (data.action) {
        case 'connect':
          this.connectCab()
          break
        case 'start':
          this.startCab(data)
          break
        case 'check_status':
          this.checkStatusCab(data)
          break
        case 'video_info':
          this.videoInfoCab(data)
          break
        case 'score':
          this.scoreCab(data)
          break
        case 'stop':
          this.stopCab(data)
          break
        case 'set_algo_params':
          this.setAlgoCab(data)
          break
        default:
          break
      }
    },
    error(er) {
      this.$message({
        message: 'socket连接失败！',
        type: 'error'
      })
    },
    // 初始化刻度盘
    initChart() {
      this.chart = echarts.init(this.$refs['score'])
      this.chart.setOption(this.option, true)
    },
    // 检查重复数据
    checkRepeat(data) {
      const arr = this.records.filter(item => {
        return item.timestamp === data.timestamp
      })
      return arr.length
    },
    getStationIndex(data) {
      if (!data.station) return this.currentIndex
      const index = this.stations.indexOf(data.station) + 1
      if (index < 0) return this.currentIndex
      return index
    },
    classArr(name, index) { // name标签的样式
      const arr = []
      arr.push({ name: true })
      arr.push({ gone: this.currentIndex > index })
      if (name) {
        arr[2] = {}
        arr[2]['left_' + name.length] = true
      }
      if (index % 2 === 1) {
        arr.push({ top_txt: true })
      } else {
        arr.push({ bom_txt: true })
      }
      return arr
    },
    // 根据站点数量向上取整
    splitStations(arr) {
      const ln = Math.floor(arr.length / 3)
      return [[...arr.slice(0, ln)], [...arr.slice(ln, 2 * ln)], [...arr.slice(2 * ln, 3 * ln)]]
    },
    // 提交配置参数
    onSubmit() {
      console.log('发出emit start')
      this.$socket.client.emit('start', this.form)
    },
    changeName(val) {
      const row = this.ipOptions.find(item => { return item.val === val }) || {}
      this.form.name = row.label
    },
    connectCab() {
      // this.$message({ type: 'success', message: '连接成功' })
      console.log('socket连接成功')
    },
    startCab(data) {
      if (data.succeed) {
        console.log('start的回调数据', data)
        this.$message({ type: 'success', message: '配置成功' })
      } else {
        // this.$message({ type: 'warning', message: data.msg })
      }
      this.imgSrc = 'http://192.168.10.130:6001/video_feed/' + this.form.name + '?t=' + (Math.random() + '').slice(2, 10)
    },
    checkStatusCab(data) {
      console.log('checkStatus获得的data', data)
      // if (data.succeed) {
      //   // 判断是否存在
      // }
    },
    videoInfoCab(data) {
      console.log('videoInfoCab获得的data', data)
    },
    scoreCab(obj) {
      const data = obj.data || {}
      console.log('score获取到的数据', data)
      this.option.series[0].data[0].value = parseInt(data.score || 0) || 0
      this.chart.setOption(this.option, true)
      this.currentIndex = this.getStationIndex(data)
      if (!this.checkRepeat(data) && data.timestamp !== null) {
        this.records.unshift(data || {})
        this.$refs.mainTable.setCurrentRow(data, true)
      }
    },
    stopCab(data) {
      if (data.succeed) {
        this.$message({ type: 'success', message: data.msg })
      } else {
        this.$message({ type: 'warning', message: data.msg })
      }
    },
    errorCab(data) {
      this.$message({ type: 'danger', message: '断开连接了' })
    },
    onClose() {
      this.$confirm('是否关闭当前所选摄像头？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '关闭',
        cancelButtonText: '取消'
      }).then(() => {
        this.$socket.client.emit('stop', { 'name': this.form.name })
      })
    },
    // 设置算法配置的回调
    setAlgoCab(data) {
      if (data.succeed) {
        this.$message({ type: 'success', message: data.msg })
      }
    },
    // 算法提交配置
    onNumSubmit() {
      this.$socket.client.emit('set_algo_params', this.numForm)
    }
  }
}
</script>

<style lang="scss" scoped>
.video-js .vjs-icon-placeholder {
    width: 100%;
    height: 100%;
    display: block;
}
.content{
  overflow: auto;
  padding: 5px 10px;
  height: calc(100vh - 84px);
  .videoBox{
    position: relative;
    cursor: pointer;
    .video{
      width: 100%;
    }
    .operation{
      width: 100%;
      height: 100%;
      position: absolute;
      cursor: pointer;
      background: rgba(0, 0, 0, 0.4);
      top:0;
      left: 0;
      .btn{
        position: absolute;
        top: calc(50% - 10px);
        left: calc(50% - 10px);
        cursor: pointer;
      }
    }
  }
  .list{
    max-height: 570px;
  }
  .bottomRow{
    border: 1px solid #ccc;
    .track{
      overflow-x: auto;
      padding-left: 15px;
      border-left: 1px solid #ccc;
        .title{
          font-weight: 800;
          padding-top: 10px;
          color: #666;
        }
      .stations{
        margin: 50px 0px 0px 70px;
        width:545px;
        height: 256px;
        .stationLine{
          display: flex;
          height: 75px;
        .item{
          position: relative;
          width: 75px;
          height: 16px;
          .node{
            position: absolute;
            z-index: 2;
          .name{
            width: max-content;
            position: absolute;
            left: -25%;
            font-size: 14px;
          }
          .point{
            display: inline-block;
            height: 16px;
            width: 16px;
            border-radius: 100%;
            border: 1px solid #c00;
            background-color: #fff;
          }
          .left_3{
            left: -11px;
          }
          .left_4{
            left: -19px;
          }
          .left_5{
            left: -27px;
          }
          .left_6{
            left: -36px;
          }
          .top_txt{
            top:-20px;
          }
          .bom_txt{
            top:20px;
          }
          }
          .line{
            width: 66px;
            height: 6px;
            background: #666;
            line-height: 15px;
            position: absolute;
            top: 5px;
            left: 14px;
            z-index: 1;
          }
          .noBorder{
            display: none;
          }
          .rotate{
            transform: rotate(90deg);
            top: 46px;
            left: -25px;
          }
          .oppo{
            left: -64px;
          }
          .oppoRotate{
            left: -25px;
            top: 46px;
            // -webkit-transform: rotate(90deg);
            transform: rotate(90deg);
          }
        }
        .active{
          .node{
            .point{
              border: 1px solid orange;
              background: orange;
            }
            .name{
              color: orange;
            }
          }
        }
        .gone{
          .node{
            .point{
              border: 1px solid rgb(39, 189, 1);
            }
          }
          .line{
            background: rgb(39, 189, 1);
          }
        }
        }
        .oppoLine{
          flex-direction: row-reverse;
        }
      }
      }
      .trackInfo{
        border-left: 1px solid #ccc;
        padding-left: 15px;
        .title{
          font-weight: 800;
          padding-top: 10px;
          color: #666;
        }
        .track-content{
          .info{
            //  width: 300px;
            padding-left: 5px;
            p{
              font-size: 18px;
              margin: 40px 0;
              height:50px;
              img{
                float: left;
              }
              span{
                line-height: 20px;
                padding: 8px 0px 0px 10px;
                display: inline-block;
              }
            }
          }
          .score{
            width: 300px;
            height: 300px;
            top:3px !important;
          }
        }
      }
      // 新增配置模块
      .setting{
        height: 335px;
        padding-left: 15px;
        position: relative;
        .title{
          font-weight: 800;
          padding-top: 10px;
          color: #666;
        }
        .settingForm{
          width: 300px;
          padding: 20px 0;
          .el-select{
            width: 100%
          }
        }
        .form-bottom{
          position: absolute;
          bottom: 15px;
        }
      }
    }
  .el-table__body tr.current-row>td{
    background-color:#316ac5
  }
  }

</style>
