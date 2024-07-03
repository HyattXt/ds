<template>
  <div class="label-back">
    <CrudHead title="用户画像" style="border-bottom: 1px solid rgb(239, 239, 245)"/>
    <n-grid :x-gap="12" :y-gap="8" :cols="9">
      <n-grid-item span="2">
        <div>
          <div style="margin: 5px 5px 0 20px; display: flex; align-items: center;">
            <n-icon size="25">
              <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="40" height="40"><path d="M896.512 698.88H132.608c-58.88 0-107.008-48.128-107.008-107.008v-10.24c0-58.88 48.128-107.008 107.008-107.008h763.904c58.88 0 107.008 48.128 107.008 107.008v10.24c0 58.88-48.128 107.008-107.008 107.008zM496.64 201.728h35.84v117.248h-35.84z" fill="#6F8698" p-id="14931"></path><path d="M516.608 223.744h-4.608c-37.888 0-68.096-30.72-68.096-68.096v-6.656c0-37.888 30.72-68.096 68.096-68.096h4.608c37.888 0 68.096 30.72 68.096 68.096v6.656c0.512 37.888-30.208 68.096-68.096 68.096z" fill="#3677FF" p-id="14932"></path><path d="M573.44 944.64H450.56c-181.248 0-327.68-146.432-327.68-327.68v-4.096c0-181.248 146.432-327.68 327.68-327.68h122.88c181.248 0 327.68 146.432 327.68 327.68v4.096c0 180.224-146.432 327.68-327.68 327.68z" fill="#D0D5F1" p-id="14933"></path><path d="M681.984 715.264H347.136c-72.704 0-131.584-58.88-131.584-131.584s58.88-131.584 131.584-131.584h334.336c72.704 0 131.584 58.88 131.584 131.584 0.512 72.704-58.368 131.584-131.072 131.584z" fill="#3677FF"></path><path d="M286.72 583.68a78.336 70.144 90 1 0 140.288 0 78.336 70.144 90 1 0-140.288 0Z" fill="#FFFFFF" p-id="14935"></path><path d="M608.256 583.68a78.336 70.144 90 1 0 140.288 0 78.336 70.144 90 1 0-140.288 0Z" fill="#FFFFFF"></path><path d="M443.392 799.232s2.56 58.88 68.096 58.88c58.88 0 69.632-61.952 69.632-61.952s-27.136 33.28-68.096 33.28c-42.496 0-69.632-30.208-69.632-30.208z" fill="#8896A4"></path></svg>
            </n-icon>
            <CrudSplit :title="labelData.obj.tagName" style="background-color: #FFFFFF; font-size: 18px"/>
          </div>
          <div style="padding: 10px 0 0 20px">
            <n-descriptions label-placement="left" size="large">
              <n-descriptions-item label="户号" label-style="color:grey">
                {{ labelData.obj.tagId }}
              </n-descriptions-item>
              <n-descriptions-item label="类别" label-style="color:grey">
                {{ labelData.obj.tagType }}
              </n-descriptions-item>
              <n-descriptions-item label="电话" label-style="color:grey">
                {{ labelData.obj.tagTel }}
              </n-descriptions-item>
              <n-descriptions-item label="地址" label-style="color:grey">
                {{ labelData.obj.tagAddress }}
              </n-descriptions-item>
            </n-descriptions>
          </div>
          <div style="margin-top: 5px; display: flex; justify-content: flex-end">
            <n-switch v-model:value="tabActive" :rail-style="railStyle">
              <template #checked>
                词云
              </template>
              <template #unchecked>
                列表
              </template>
            </n-switch>
          </div>
          <div style="height: 800px; overflow: hidden; padding-top: 20px">
            <MyChart v-if="tabActive" :option="cloudOption" height="100%"/>
            <n-table v-if="!tabActive" :single-line="false" striped>
              <tbody>
              <tr v-for="item in labelData.data[0]">
                <td>{{ item.labelName }}</td>
                <n-td>{{ item.tagValue }}</n-td>
              </tr>
              </tbody>
            </n-table>
          </div>
        </div>
      </n-grid-item>
      <n-grid-item span="7">
        <n-grid :cols="3">
          <n-grid-item span="3">
            <CrudSplit title="用户生命周期" style="font-size: 16px"/>
          </n-grid-item>
          <n-grid-item span="3">
            <div style="margin-right: 10px; height: 300px">
              <TimeLine :items="itemList"></TimeLine>
            </div>
          </n-grid-item>
          <n-grid-item span="3">
            <CrudSplit title="用户阳光分" style="font-size: 16px"/>
          </n-grid-item>
          <n-grid-item span="1">
            <n-table striped>
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
            </n-table>
          </n-grid-item>
          <n-grid-item span="1">
            <div>
              <MyChart :option="sunOption" height="300px"/>
            </div>
          </n-grid-item>
          <n-grid-item span="1">
            <div style="margin-top: 5px">
              <n-table striped>
                <tbody>
                <tr>
                  <td>阳光信用分</td>
                  <td>{{ totalScore }}</td>
                  <td>{{ gaugeOption.series[0].data[0].name }}</td>
                </tr>
                </tbody>
              </n-table>
              <n-grid :cols="4">
                <n-grid-item span="1">
                  <div class="sun-div">
                    阳光分超过了{{ getTagValueByTagName('用户领先百分比') }}的用户，{{ gaugeOption.series[0].data[0].name }}
                  </div>
                </n-grid-item>
                <n-grid-item span="3">
                  <MyChart :option="gaugeOption" height="250px"/>
                </n-grid-item>
              </n-grid>
            </div>
          </n-grid-item>
          <n-grid-item span="3">
            <CrudSplit title="用户用水分析" style="font-size: 16px"/>
          </n-grid-item>
          <n-grid-item span="3">
            <div style="height: 300px">
              <MyChart :option="waterOption" height="300px"/>
            </div>
          </n-grid-item>
        </n-grid>
      </n-grid-item>
    </n-grid>
  </div>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import CrudHead from "@/components/cue/crud-header.vue";
import CrudSplit from "@/components/cue/crud-split.vue";
import MyChart from "@/components/chart/modules/MyChart";
import TimeLine from "@/components/chart/modules/timeLine.vue";
import 'echarts-wordcloud';
import axios from "axios";

const getLabelUrl = import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/dataBaseLabel/userPortrait'
    : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/dataBaseLabel/userPortrait'
const tabActive = ref(false)
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
  color: ['#3bb969', '#0299cb', '#e6824d'],
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
      data: [5, 20, 36, 10, 10, 20],
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
      barWidth: '30%',
      data: [5, 20, 36, 10, 10, 20]
    },
    {
      name: '同期',
      type: 'bar',
      barWidth: '30%',
      data: [5, 20, 36, 10, 10, 20]
    },
    {
      name: '同比',
      type: 'line',
      yAxisIndex: 1, // 指定使用第二个 Y 轴
      data: [0.5, 0.20, 0.36, 0.10, 0.10, 0.20]
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
    // shape: 'circle',
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
            [0.2, '#FF6E76'],
            [0.4, '#FDDD60'],
            [0.6, '#58D9F9'],
            [0.8, '#7CFFB2'],
            [1, '#1cc160'],
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
          if (value === 0.9 ) {
            return '极好';
          } else if (value === 0.7) {
            return '较好';
          } else if (value === 0.5) {
            return '一般';
          } else if (value === 0.3) {
            return '较低';
          } else if (value === 0.1) {
            return '极低';
          }
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
          name: '信用极好'
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
        console.log(labelData.value)

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
        gaugeOption.value.series[0].data[0].name = setNameBasedOnValue(totalScore.value)

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
.label-back {
  background-color: rgb(255, 255, 255);
}
.sun-div {
  margin-top: 20px;
  padding: 0 10px;
  background-color: #5BCA84;
  color: #FFFFFF;
  height: 200px;
  display: flex;
  align-items: center
}
</style>
