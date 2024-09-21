<template>
  <div class="container">
    <!-- 第一个div -->
    <div class="left-panel">
      <div style="flex: 1">
        <div style="flex: 1; width: 100%; display: flex">
          <div style="margin-top: 5px;">
            <n-icon size="70">
              <svg t="1726816857696" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="70" height="70"><path d="M700.8 349.6c-12.9-4.25-29.3 10.4-36.65 32.7-7.35 22.3-2.85 43.8 10.05 48.05s29.3-10.4 36.65-32.7c7.35-22.25 2.85-43.8-10.05-48.05zM323.85 349.6c12.9-4.25 29.3 10.4 36.65 32.7 7.35 22.3 2.85 43.8-10.05 48.05s-29.3-10.4-36.65-32.7c-7.35-22.25-2.85-43.8 10.05-48.05z" fill="#FFD7A3"></path><path d="M580.2 586.4c150.75 66.1 196 101.3 213.85 117.15 27.55 24.4 42.8 115.25 59.05 192.4H170.95c16.25-77.15 31.5-168 59.05-192.4 17.85-15.8 61.45-50.15 212.2-116.25l138-0.9z" fill="#FFDDCC"></path><path d="M580.2 586.4c150.75 66.1 195.95 101.3 213.85 117.15 27.55 24.4 42.8 115.25 59.05 192.4H170.95c16.25-77.15 31.5-168 59.05-192.4 17.85-15.8 61.45-50.15 212.2-116.25l138-0.9z" fill="#B0BEC5"></path><path d="M438.8 454.65v167.1c40.25 49.3 106.15 47.6 146.4 0V454.65c0-90.2-146.4-90.2-146.4 0z" fill="#FFD7A3"></path><path d="M438.8 454.65v111.9c27.7 20.2 54.4 31.5 73.2 31.5 18.8 0 45.5-11.3 73.2-31.5V454.65c0-90.2-146.4-90.2-146.4 0z" fill="#E9C596"></path><path d="M512 154.65c245.65 0 157.3 296.85 141.25 320.45-17.7 26.05-101.6 95.15-141.25 95.15-39.7 0-123.55-69.05-141.25-95.15C354.7 451.5 266.35 154.65 512 154.65z" fill="#FFD7A3"></path><path d="M624.3 254c14.25 77.85 49.95 70.6 47.1 161.95 19.7-144 37.15-281.05-169.75-287.9-31.1 1.2-64.95 10.05-101.25 33.1-60.25 38.25-92.35 118.6-49.35 242.1 6.55-43.55 5.7-76.9 35.65-106.5 31.35-30.85 101.85 53.05 237.6-42.75z" fill="#6D4C41"></path><path d="M511.6 658.1s102.15 24.4 102.15 30.55c0 6.2-38.85 207.25-38.85 207.25H436.2l-15.9-206.35 91.3-31.45z" fill="#B0BEC5"></path><path d="M585.2 588.6v33.2l-31.8 274.15h54.65l60.15-122.1-57.4-38.3 70.15-32.8-64.5-100.1zM438.8 588.8v33l32.1 274.15H416.25l-60.15-122.1 57.4-38.3-70.15-32.8 57.35-97.05z" fill="#ECEFF1"></path><path d="M585.2 566.55l6.4 24.9-17.9 129.6-62.1-62.95z" fill="#FFFFFF"></path><path d="M543.45 692l-17.75 27.45h-27.5L480.5 692l31.1-33.9 31.85 33.9z" fill="#0D47A1"></path><path d="M525.75 719.5l25.25 176.45H473l25.25-176.45z" fill="#1976D2" p-id="1905"></path><path d="M438.8 566.55l-5.05 24.5 16.85 131.3 61-64.25z" fill="#FFFFFF"></path><path d="M714.05 895.95h-11.7c0.5-51.95 0.5-89.35 0.5-89.35s5.25 38.85 11.2 89.35zM309.95 895.95h11.7c-0.5-51.95-0.5-89.35-0.5-89.35s-5.25 38.85-11.2 89.35z" fill="#546E7A"></path><path d="M586.4 465.4c-49.4 17.7-106.75 14.8-148.8 0 13.7 63.2 122.55 64.75 148.8 0z" fill="#E9C596"></path></svg>
            </n-icon>
          </div>
          <div style="padding: 10px 0 0 0; flex-grow: 1">
            <span style="background-color: #FFFFFF; font-size: 18px; font-weight: bold">
              {{labelData.obj.tagName}}
            </span>
            <n-descriptions label-placement="left" size="large" style="margin-top: 5px">
              <n-descriptions-item label="户号" label-style="color:grey">
                {{ labelData.obj.tagId }}
              </n-descriptions-item>
              <n-descriptions-item label="类别" label-style="color:grey">
                {{ labelData.obj.tagType }}
              </n-descriptions-item>
            </n-descriptions>
            <n-descriptions label-placement="left" size="large" style="margin-top: 5px">
              <n-descriptions-item label="电话" label-style="color:grey">
                {{ labelData.obj.tagTel }}
              </n-descriptions-item>
            </n-descriptions>
            <n-descriptions label-placement="left" size="large" style="margin-top: 5px">
              <n-descriptions-item label="地址" label-style="color:grey">
                {{ labelData.obj.tagAddress }}
              </n-descriptions-item>
            </n-descriptions>
          </div>
        </div>
        <div style="flex: 1">
          <NTabs type="line">
            <NTabPane name="列表" tab="列表">
              <n-table :single-line="false" striped size="small">
                <thead>
                <tr>
                  <th>标签</th>
                  <th>数据值</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in labelData.data[0]">
                  <td>{{ item.labelName }}</td>
                  <n-td>{{ item.tagValue }}</n-td>
                </tr>
                </tbody>
              </n-table>
            </NTabPane>
            <NTabPane name="词云" tab="词云">
                <MyChart :option="cloudOption" height="600px"/>
            </NTabPane>
          </NTabs>
        </div>
      </div>
    </div>
    <!-- 后三个div的容器，用于分配剩余75%的宽度 -->
    <div class="right-panels">
      <div class="right-panel">
        <div style="height: 10%">
          <CrudSplit title="生命周期" style="font-size: 16px; background:white"/>
        </div>
        <div style="height: 90%">
          <TimeLine :items="itemList"></TimeLine>
        </div>
      </div>
      <div class="right-panel">
        <div style="height: 10%">
          <CrudSplit title="阳光分" style="font-size: 16px; background:white"/>
        </div>
        <div style="display: flex; height: 90%; flex-direction: row;">
          <div style="width: calc(23% - 10px); height: 100%; padding-left: 10px">
            <table class="custom-table">
              <tbody>
              <tr v-for="item in score">
                <td>{{ item.labelName }}</td>
                <td>
                  <span v-if="item.labelName === '还款能力' && !!item.tagValue">
                    <!-- 如果labelName是'还款能力'，则根据tagValue渲染五角星 -->
                    <span v-for="n in parseInt(item.tagValue)">★</span>
                  </span>
                  <span v-else>
                    <!-- 否则显示tagValue的原值 -->
                    {{ item.tagValue }}
                 </span>
                </td>
                <td>{{ item.labelScore }}分</td>
              </tr>
              </tbody>
            </table>
          </div>
          <div style="width: calc(40% - 10px); height: 100%; padding-left: 10px">
            <MyChart :option="sunOption" height="100%" width="100%"/>
          </div>
          <div style="width: calc(25% - 10px); height: 100%; padding-left: 10px">
            <MyChart :option="gaugeOption" height="100%" width="100%"/>
          </div>
          <div style="width: calc(12% - 10px); height: 100%; padding-left: 10px">
            <div class="sun-div">
              <!-- 第一行，使用<strong>标签使字体加粗 -->
              <strong class="center-text">{{ totalScore }}</strong>
              <!-- 第二行，同样使用<strong>标签 -->
              <strong class="center-text">{{ gaugeOption.series[0].data[0].tag }}</strong><br>
              <!-- 第三行，直接使用文本，不改变字体粗细 -->
              <span class="bottom-text">阳光分超过了{{ getTagValueByTagName('用户领先百分比') }}的用户，{{ gaugeOption.series[0].data[0].tag }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="right-panel">
        <div style="height: 10%">
          <CrudSplit title="用户用水分析" style="font-size: 16px; background:white"/>
        </div>
        <div style="height: 90%">
          <MyChart :option="waterOption" height="300px"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import CrudSplit from "@/components/cue/crud-split.vue";
import MyChart from "@/components/chart/modules/MyChart";
import TimeLine from "@/components/chart/modules/timeLine.vue";
import 'echarts-wordcloud';
import axios from "axios";
import utils from "@/utils";

const getLabelUrl = utils.getUrl('dataBaseLabel/userPortrait')
const route = useRoute()
const tagId = route.query.tagId
const labelData = ref({
  data: [[],[],[]],
  obj: {}
})

const scoreDict = [
  {'1' : 4},
  {'2' : 8},
  {'3' : 12},
  {'4' : 16},
  {'5' : 20},
  {'预存' : 20},
  {'1天' : 16},
  {'2-3天' : 12},
  {'4-10天' : 8},
  {'10天以上' : 4},
  {'1%-20%' : 4},
  {'21%-40%' : 8},
  {'41%-60%' : 12},
  {'61%-80%' : 16},
  {'81%-100%' : 20},
  {'一级' : 4},
  {'二级' : 8},
  {'三级' : 12},
  {'四级' : 16},
  {'五级' : 20},
  {'是' : 20},
  {'否' : 0}
]

const score = ref([
   {
     labelName: "还款能力",
     tagValue: "",
     labelScore: 0
   },
  {
    labelName: "缴费及时性",
    tagValue: "",
    labelScore: 0
  },
   {
     labelName: "缴费可能性",
     tagValue: "",
     labelScore: 0
   },
   {
     labelName: "欠费等级",
     tagValue: "",
     labelScore: 0
   },
   {
     labelName: "阳光名单",
     tagValue: "",
     labelScore: 0
   }
  ]
)

const totalScore = computed(() => {
  return score.value.reduce((sum, item) => sum + item.labelScore, 0);
});

const waterOption = {
  title: {
    show: true,
    text: "供水量分析(单位:m³)",
    textStyle: {
      color: '#09477d',
      fontSize: '12',
      fontFamily: 'sans-serif',
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    backgroundColor: '#fff',
    formatter: function (params) {
      let result = '';
      params.forEach((param) => {
        // 检查数据点所属的系列是否是第二个 Y 轴对应的系列
        if (param.seriesIndex === 2) { // 假设'同比'系列是第二个系列
          result += `${param.seriesName}: ${(param.value * 100).toFixed(2)} %<br/>`; // 转换为百分比并保留两位小数
        } else {
          result += `${param.seriesName}: ${param.value}<br/>`; // 其他系列直接显示原始值
        }
      });
      return result;
    },
  },
  legend: {
    data: ['本期','同期','同比'],
    icon: 'circle',
    right: 20,
    top: 20,
  },
  color: ['#73d1b7', '#52a2f2', '#f2bf64'],
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
    backgroundColor: 'rgba(255, 255, 255, 0)', // 设置为透明或其他颜色
    borderColor: 'transparent', // 边框色设置为透明
  },
  xAxis: [
    {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月','7月','8月','9月'],
      axisTick: {
        alignWithLabel: true
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      splitArea: {
        show: false // 确保 splitArea 是显示的
      }
    },
    {
      type: 'value',
      position: 'right', // 放置在右侧
      splitArea: {
        show: false // 确保 splitArea 是显示的
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        formatter: function (value, index) {
          return (value * 100).toFixed(0) + ' %'; // 乘以100并保留两位小数
        }
      }
    }
  ],
  series: [
    {
      name: '本期',
      type: 'bar',
      barWidth: '15%',
      data: [5, 20, 36, 10, 10, 20, 36, 10, 22]
    },
    {
      name: '同期',
      type: 'bar',
      barWidth: '15%',
      data: [6, 23, 31, 15, 13, 27, 6, 23, 31, 15]
    },
    {
      name: '同比',
      type: 'line',
      yAxisIndex: 1, // 指定使用第二个 Y 轴
      data: [0.5, 0.20, 0.36, 0.10, 0.10, 0.20, 0.20, 0.36, 0.10]
    }
  ]
}

const sunOption = ref({
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#fff'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
    backgroundColor: 'rgba(255, 255, 255, 0)', // 设置为透明或其他颜色
    borderColor: 'transparent', // 边框色设置为透明
  },
  color: ['#0299cb'],
  radar: {
    indicator: [
      { name: '还款能力', max: 20 },
      { name: '缴费及时性', max: 20 },
      { name: '缴费可能性', max: 20 },
      { name: '欠费等级', max: 20 },
      { name: '阳光名单', max: 20 }
    ]
  },
  series: [
    {
      name: '分数',
      type: 'radar',
      tooltip: {
        trigger: 'item'
      },
      areaStyle: {},
      data: [
        {
          value: []
        }
      ]
    }
  ]
})

const gaugeOption = ref({
  series: [
    {
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      center: ['50%', '75%'],
      radius: '90%',
      min: 0,
      max: 1,
      splitNumber: 10,
      axisLine: {
        lineStyle: {
          width: 6,
          color: [
            [0.2, '#58D9F9'],
            [0.4, '#58D9F9'],
            [0.6, '#58D9F9'],
            [0.8, '#58D9F9'],
            [1, '#58D9F9'],
          ]
        }
      },
      pointer: {
        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
        length: '12%',
        width: 20,
        offsetCenter: [0, '-60%'],
        itemStyle: {
          color: 'auto'
        }
      },
      axisTick: {
        length: 12,
        lineStyle: {
          color: 'auto',
          width: 2
        }
      },
      splitLine: {
        length: 20,
        lineStyle: {
          color: 'auto',
          width: 5
        }
      },
      axisLabel: {
        color: '#464646',
        fontSize: 20,
        distance: -60,
        rotate: 'tangential',
        formatter: function (value) {
          return '';
        }
      },
      title: {
        offsetCenter: [0, '-10%'],
        fontSize: 20
      },
      detail: {
        fontSize: 30,
        offsetCenter: [0, '-35%'],
        valueAnimation: true,
        formatter: function (value) {
          return Math.round(value * 100) + '';
        },
        color: 'inherit'
      },
      data: [
        {
          value: 0,
          name: '阳光信誉分',
          tag: '信用极好'
        }
      ]
    }
  ],
  graphic: [
    {
      type: 'rect',
      left: 'center',
      top: 0, // 调整此值以控制方框的竖直位置
      z: 100, // 确保总是在图表元素之前
      shape: {
        width: 300,
        height: 50,
        r: 5
      },
      style: {
        fill: '#f1f1f1'
      },
      silent: true
    },
    {
      type: 'group', // 使用 group 组件来包含多个文本元素
      left: 'center',
      top: 10,
      children: [
        {
          type: 'text',
          left: 0, // 或者使用像素值，比如 '50px'，但需要知道容器确切尺寸
          top: 0,
          z: 200,
          style: {
            text: '极低:<20',
            textAlign: 'center',
            fill: '#333',
            fontSize: 14
          },
          silent: false
        },
        {
          type: 'text',
          left: 85, // 或者更精确地计算 left 值
          top: 0,
          z: 200,
          style: {
            text: '较低:20-40',
            textAlign: 'center',
            fill: '#333',
            fontSize: 14
          },
          silent: true
        },
        {
          type: 'text',
          left: 170, // 注意不要超出图表边界
          top: 0,
          z: 200,
          style: {
            text: '一般:40-60',
            textAlign: 'center',
            fill: '#333',
            fontSize: 14
          },
          silent: true
        },
        {
          type: 'text',
          left: 0, // 注意不要超出图表边界
          top: 18,
          z: 200,
          style: {
            text: '较好:60-80',
            textAlign: 'center',
            fill: '#333',
            fontSize: 14
          },
          silent: true
        },
        {
          type: 'text',
          left: 85, // 注意不要超出图表边界
          top: 18,
          z: 200,
          style: {
            text: '极好:>80',
            textAlign: 'center',
            fill: '#333',
            fontSize: 14
          },
          silent: true
        }
      ]
    }
  ]
})

const cloudOption = ref({
  tooltip: {
    backgroundColor: '#fff',
    formatter: function (params) {
        return params.data.name + '：' + params.data.tag
    },
  },
  series: [{
    type: 'wordCloud',
    gridSize: 20,
    sizeRange: [12, 50],
    rotationRange: [-90, 90],
    drawOutOfBound:true,
    textStyle: {
        color: function () {
          return 'rgb(' +
              Math.round(Math.random() * 255) + ',' +
              Math.round(Math.random() * 255) + ',' +
              Math.round(Math.random() * 255) + ')';
        },
      emphasis: {
        shadowBlur: 10,
        shadowColor: '#333'
      }
    },
    data: []
  }]
})

const itemList = ref([
  {
    labelName: '首次装表日期',
    tagValue: '',
  },
  {
    labelName: '月最低用水量',
    tagValue: '',
  },
  {
    labelName: '首次抄表日期',
    tagValue: '',
  },
  {
    labelName: '月平均用水量',
    tagValue: '',
  },
  {
    labelName: '首次缴费日期',
    tagValue: '',
  },
  {
    labelName: '月最高用水量',
    tagValue: '',
  },
  {
    labelName: '累计抄表次数',
    tagValue: '',
  },
  {
    labelName: '近一个月用水量',
    tagValue: '',
  },
  {
    labelName: '最近抄表日期',
    tagValue: '',
  },
  {
    labelName: '近半年用水量',
    tagValue: '',
  },
  {
    labelName: '最新缴费日期',
    tagValue: '',
  },
  {
    labelName: '近一年用水量',
    tagValue: '',
  }
])

const railStyle = ({
  focused,
  checked
}) => {
  const style = {};
  if (checked) {
    style.background = "#2080f0";
    if (focused) {
      style.boxShadow = "0 0 0 2px #2080f040";
    }
  } else {
    style.background = "#2080f0";
    if (focused) {
      style.boxShadow = "0 0 0 2px #2080f040";
    }
  }
  return style;
}

function initData() {
  const params = {
    'tagId': tagId,
  }

  axios
      .post(getLabelUrl, params)
      .then(function (response) {
        labelData.value = response.data
        labelData.value.data[0].forEach(label => {
          const newDataItem = {
            name: label.labelName,
            value: Math.floor(Math.random() * (16 - 12 + 1)) + 12,
            tag: label.tagValue
          };
          cloudOption.value.series[0].data.push(newDataItem);
        })

        updateItemListWithData(itemList.value, labelData.value.data[2])

        updateItemListWithData(score.value, labelData.value.data[1])
        setTagValues()

        gaugeOption.value.series[0].data[0].value = totalScore.value/100
        gaugeOption.value.series[0].data[0].tag = setNameBasedOnValue(totalScore.value)

        sunOption.value.series[0].data[0].value = score.value.map(item => item.labelScore)
      })
      .catch(function (error) {
        console.log(error)
      })
}

function updateItemListWithData(tList, list) {
  list.forEach(dataItem => {
    const itemToUpdate = tList.find(item => item.labelName === dataItem.labelName);
    if (itemToUpdate) {
      itemToUpdate.tagValue = dataItem.tagValue;
    }
  });
}

function setTagValues() {
  // 更新 labelScore
  score.value.forEach(item => {
    const scoreValue = scoreDict.find(entry => Object.keys(entry) == item.tagValue)?.[item.tagValue];
    if (scoreValue) {
      item.labelScore = scoreValue;
    }
  });
}

function setNameBasedOnValue(value) {
  if (value >= 80) {
    return '信用极好';
  } else if (value >= 60 && value < 80) {
    return '信用较好';
  } else if (value >= 40 && value < 60) {
    return '信用一般';
  } else if (value >= 20 && value < 40) {
    return '信用较低';
  } else if ( value < 20) {
    return '信用极低';
  }
  return '';
}

function getTagValueByTagName(labelName) {
  const foundItem = labelData.value.data[1].find(item => item.labelName === labelName);
  return foundItem ? foundItem.tagValue : null; // 如果未找到，返回 null 或其他默认值
}

onMounted(()=>{
  initData()
})

</script>

<style scoped>
.container {
  display: flex; /* 使用flex布局 */
}

.left-panel {
  width: 18%; /* 宽度为25% */
  background-color: white; /* 背景色仅作区分 */
  padding: 0 10px;
}

.right-panels {
  flex: 1; /* 右侧div占据剩余宽度 */
  display: flex; /* 设置为flex容器，以便子div排成一列 */
  flex-direction: column; /* 指定子项垂直排列 */
  padding-left: 12px;
}

.right-panel {
  margin-top: 12px;
  background-color: white; /* 背景色仅作区分 */
  height: auto;
}

/* 使用 :first-child 选择器移除第一个 .right-panel 的上边距 */
.right-panels > .right-panel:first-child {
  margin-top: 0;
  padding-bottom: 10px;
}

.custom-table {
  width: 100%; /* 根据需要调整宽度 */
  border-collapse: separate; /* 边框分开，以支持圆角 */
  border-spacing: 0; /* 确保没有间距 */
  margin: 20px auto; /* 可选：居中显示并添加外边距 */
  background: #d6f6f6; /* 背景色 */
  color: #0099cb; /* 字体颜色 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  border-radius: 10px; /* 圆角边框 */
  overflow: hidden; /* 确保子元素不超出圆角区域 */
}

.custom-table th, .custom-table td {
  padding: 15px; /* 内边距 */
  text-align: center; /* 居中对齐 */
  border: none; /* 去掉单元格的边框 */
}

/* 交替行颜色 */
.custom-table tr:nth-child(even) {
  background-color: #f0f8f8; /* 偶数行颜色 */
}

.custom-table tr:nth-child(odd) {
  background-color: #d6f6f6; /* 奇数行颜色 */
}

.sun-div {
  padding: 10px;
  background: linear-gradient(to bottom, rgb(205, 243, 255), #effdfd);
  height: 80%;
  width: 80%;
  display: flex;
  flex-direction: column; /* 确保子项垂直排列 */
  justify-content: flex-end; /* 第三行放在最下面 */
  align-items: center; /* 水平中心对齐 */
  text-align: center; /* 确保文本居中对齐 */
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

.center-text {
  display: block;
  width: 100%;
  margin-bottom: 20px;
}

.bottom-text {
  text-align: center;
  padding-top: 10px;
}

strong {
  font-weight: bold; /* 这通常是默认的，但为了清晰起见还是写出来 */
  font-size: 23px;
  color: rgba(24,215,227);
}

</style>
