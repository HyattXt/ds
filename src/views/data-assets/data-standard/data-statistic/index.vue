<template>
  <CrudHead title="标准概览" />
  <div class="FBH mb16">
    <div class="overview-item-2 hover_div FB1 FBV FBJB">
      <div class="FBH FBJB">
        <div>数据元数</div>
        <n-tooltip trigger="hover">
          <template #trigger>
            <NIcon><QuestionCircle28Regular/></NIcon>
          </template>
          所有草稿/已发布/废止状态的基础数据元总数
        </n-tooltip>
      </div>
      <div class="overview-countlast FBV FBAC FBJC">{{ indexData.dataElementNum }}<div class="overview-default">基础</div>
      </div>
    </div>
    <div class="overview-item-2 hover_div FB1 FBV FBJB">
      <div class="FBH FBJB">
        <div>数据模型数</div>
        <n-tooltip trigger="hover">
          <template #trigger>
            <NIcon><QuestionCircle28Regular/></NIcon>
          </template>
          所有草稿/已发布/废止状态的基础和指标数据元总数
        </n-tooltip>
      </div>
      <div class="overview-countlast FBV FBAC FBJC">{{ indexData.modelNum }}<div class="overview-default"></div>
      </div>
    </div>
    <div class="overview-item-2 hover_div FB1 FBV FBJB">
      <div class="FBH FBJB">
        <div>近3个月添加数</div>
        <n-tooltip trigger="hover">
          <template #trigger>
            <NIcon><QuestionCircle28Regular/></NIcon>
          </template>
          所有草稿/已发布/废止状态的数据模型总数
        </n-tooltip>
      </div>
      <div class="overview-countlast FBV FBAC FBJC">{{ indexData.dataElement3Num + '/' +  indexData.model3Num}}<div class="overview-default">数据元/数据模型</div>
      </div>
    </div>
    <div class="overview-item-2 hover_div FB1 FBV FBJB" style="margin-right: 0">
      <div class="FBH FBJB">
        <div>近3个月发布数</div>
        <n-tooltip trigger="hover">
          <template #trigger>
            <NIcon><QuestionCircle28Regular/></NIcon>
          </template>
          近3个月添加的数据元的总数，包括添加后删除的。同一个数据元添加后编辑的，数量仍为1
        </n-tooltip>
      </div>
      <div class="overview-countlast FBV FBAC FBJC">{{ indexData.dataElement3ReleaseStatusNum }}<div class="overview-default">数据元</div>
      </div>
    </div>
  </div>
  <div class="page-statistic FBH">
    <NCard
        hoverable
        size="small"
        :segmented="{
          content: true,
          footer: 'soft'
        }"
        style="margin-right: 12px"
    >
      <template #header>
        热门标准云图
        <n-tooltip trigger="hover">
          <template #trigger>
            <NIcon><QuestionCircle28Regular/></NIcon>
          </template>
          数据元映射至数据模型，按照数据元被引用的次数从高至低排列
        </n-tooltip>
      </template>
      <MyChart :option="cloudOption" height="300px"/>
    </NCard>
    <NCard
        hoverable
        size="small"
        :segmented="{
          content: true,
          footer: 'soft'
        }"
    >
      <template #header>
        数据元落标情况
      </template>
      <div class="FBH FBJB" style="background: rgba(243, 244, 249, 0.5); width: 168px; height: 43px; flex-direction: column">
        <div class="bar-tag">
          <span class="FBH FBAC">
            <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTJweCIgaGVpZ2h0PSIxMnB4IiB2aWV3Qm94PSIwIDAgMTIgMTIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYzLjEgKDkyNDUyKSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT7lvaLnirY8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz4KICAgICAgICA8bGluZWFyR3JhZGllbnQgeDE9Ijk4LjQxMzA4NTklIiB5MT0iNTAlIiB4Mj0iMCUiIHkyPSI1MCUiIGlkPSJsaW5lYXJHcmFkaWVudC0xIj4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzgzQkFGRCIgb2Zmc2V0PSIwJSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjM0Y3NkZCIiBvZmZzZXQ9IjEwMCUiPjwvc3RvcD4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPC9kZWZzPgogICAgPGcgaWQ9Iumhtemdoi0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5qCH5YeG57uf6K6hIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNzkzLjAwMDAwMCwgLTI0OS4wMDAwMDApIiBmaWxsPSJ1cmwoI2xpbmVhckdyYWRpZW50LTEpIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICA8ZyBpZD0i57yW57uEIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3OTMuMDAwMDAwLCAyNDkuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNS44NTQ2NzgxMywxLjUwNDY3ODE0IEw1Ljg1NDY3ODEzLDYuMTU0Njc4MTQgTDEwLjUwNDY3ODEsNi4xNTQ2NzgxNCBMMTAuNTA0Njc4MSw2Ljc1NDY3ODEzIEMxMC41MDQ2NzgxLDkuNjU0MTc4MTQgOC4xNTQxNzgxMywxMi4wMDQ2NzgxIDUuMjU0Njc4MTQsMTIuMDA0Njc4MSBDMi4zNTUxNzgxNiwxMi4wMDQ2NzgxIDAuMDA0Njc4MTM5MDMsOS42NTQxNzgxNCAwLjAwNDY3ODEzOTAzLDYuNzU0Njc4MTMgQzAuMDA0Njc4MTM5MDMsMy44ODgxNzgxNCAyLjMwMjA3ODE0LDEuNTU4MDc4MTQgNS4xNTU5NzgxNCwxLjUwNTU3ODE0IEw1LjI1NDY3ODE0LDEuNTA0Njc4MTQgTDUuODU0Njc4MTMsMS41MDQ2NzgxNCBaIE03LjUwNDY3ODE0LDAuMDA0Njc4MTM5MDMgQzkuOTg5ODc4MTQsMC4wMDQ2NzgxMzkwMyAxMi4wMDQ2NzgxLDIuMDE5NDc4MTQgMTIuMDA0Njc4MSw0LjUwNDY3ODE0IEwxMi4wMDQ2NzgxLDUuMTA0Njc4MTQgTDYuOTA0Njc4MTQsNS4xMDQ2NzgxNCBMNi45MDQ2NzgxNCwwLjAwNDY3ODEzOTAzIEw3LjUwNDY3ODE0LDAuMDA0Njc4MTM5MDMgWiIgaWQ9IuW9oueKtiI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=" class="mr8" alt="img">
            总落标数
          </span>
          <span style="display: flex; align-items: center">{{ total }}</span>
        </div>
        <div class="bar-tag">
          <span class="FBH FBAC">
            <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTJweCIgaGVpZ2h0PSIxMnB4IiB2aWV3Qm94PSIwIDAgMTIgMTIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYzLjEgKDkyNDUyKSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT7lvaLnirY8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz4KICAgICAgICA8bGluZWFyR3JhZGllbnQgeDE9Ijk4LjQxMzA4NTklIiB5MT0iNTAlIiB4Mj0iMCUiIHkyPSI1MCUiIGlkPSJsaW5lYXJHcmFkaWVudC0xIj4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzgzQkFGRCIgb2Zmc2V0PSIwJSI+PC9zdG9wPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjM0Y3NkZCIiBvZmZzZXQ9IjEwMCUiPjwvc3RvcD4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPC9kZWZzPgogICAgPGcgaWQ9Iumhtemdoi0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5qCH5YeG57uf6K6hIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNzkzLjAwMDAwMCwgLTI0OS4wMDAwMDApIiBmaWxsPSJ1cmwoI2xpbmVhckdyYWRpZW50LTEpIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICA8ZyBpZD0i57yW57uEIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3OTMuMDAwMDAwLCAyNDkuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNS44NTQ2NzgxMywxLjUwNDY3ODE0IEw1Ljg1NDY3ODEzLDYuMTU0Njc4MTQgTDEwLjUwNDY3ODEsNi4xNTQ2NzgxNCBMMTAuNTA0Njc4MSw2Ljc1NDY3ODEzIEMxMC41MDQ2NzgxLDkuNjU0MTc4MTQgOC4xNTQxNzgxMywxMi4wMDQ2NzgxIDUuMjU0Njc4MTQsMTIuMDA0Njc4MSBDMi4zNTUxNzgxNiwxMi4wMDQ2NzgxIDAuMDA0Njc4MTM5MDMsOS42NTQxNzgxNCAwLjAwNDY3ODEzOTAzLDYuNzU0Njc4MTMgQzAuMDA0Njc4MTM5MDMsMy44ODgxNzgxNCAyLjMwMjA3ODE0LDEuNTU4MDc4MTQgNS4xNTU5NzgxNCwxLjUwNTU3ODE0IEw1LjI1NDY3ODE0LDEuNTA0Njc4MTQgTDUuODU0Njc4MTMsMS41MDQ2NzgxNCBaIE03LjUwNDY3ODE0LDAuMDA0Njc4MTM5MDMgQzkuOTg5ODc4MTQsMC4wMDQ2NzgxMzkwMyAxMi4wMDQ2NzgxLDIuMDE5NDc4MTQgMTIuMDA0Njc4MSw0LjUwNDY3ODE0IEwxMi4wMDQ2NzgxLDUuMTA0Njc4MTQgTDYuOTA0Njc4MTQsNS4xMDQ2NzgxNCBMNi45MDQ2NzgxNCwwLjAwNDY3ODEzOTAzIEw3LjUwNDY3ODE0LDAuMDA0Njc4MTM5MDMgWiIgaWQ9IuW9oueKtiI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=" class="mr8" alt="img">
            总落标率
          </span>
          <span style="display: flex; align-items: center">{{ rate }}</span>
        </div>
      </div>
      <MyChart :option="barOption" height="300px"/>
    </NCard>
  </div>
  <div class="page-statistic FBH">
    <NCard
        hoverable
        size="small"
        :segmented="{
          content: true,
          footer: 'soft'
        }"
        style="margin-right: 12px"
    >
      <template #header>
        最新30个数据元
      </template>
      <n-data-table
          striped
          :columns="columns"
          :data="data"
          :max-height="300"
          :min-height="300"
      />
    </NCard>
    <NCard
        hoverable
        size="small"
        :segmented="{
          content: true,
          footer: 'soft'
        }"
    >
      <template #header>
        最新30个标准的类型占比
      </template>
      <div style="display: flex">
        <MyChart :option="pieOptionOne" height="300px" width="50%"/>
        <MyChart :option="pieOptionTwo" height="300px" width="50%"/>
      </div>
    </NCard>
  </div>
</template>

<script setup>
import CrudHead from '@/components/cue/crud-header.vue'
import { QuestionCircle28Regular } from '@vicons/fluent'
import MyChart from "@/components/chart/modules/MyChart";
import 'echarts-wordcloud';
import {onMounted, ref} from "vue";
import {
  queryModelIndexLatest, queryModelIndexLineChart,
  queryModelIndexNephogram,
  queryModelIndexNum,
  queryModelIndexRate
} from "@/service/modules/data-standard";

const total = ref()
const rate = ref()
const barOption = ref({
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
        if (param.seriesIndex === 1) { // 假设'同比'系列是第二个系列
          result += `${param.seriesName}: ${(param.value * 100).toFixed(2)} %<br/>`; // 转换为百分比并保留两位小数
        } else {
          result += `${param.seriesName}: ${param.value}<br/>`; // 其他系列直接显示原始值
        }
      });
      return result;
    },
  },
  legend: {
    data: ['落标数','落标率'],
    icon: 'circle',
    right: 20,
    top: '-1%',
  },
  color: ['#3bb969', '#e6824d'],
  grid: {
    top: '8%',
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
      data: [],
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
      name: '落标数',
      type: 'bar',
      barWidth: '30%',
      itemStyle: {
        borderRadius: [5, 5, 0, 0]
      },
      data: []
    },
    {
      name: '落标率',
      type: 'line',
      yAxisIndex: 1,
      data: []
    }
  ]
})

const cloudOption = ref({
  tooltip: {
    backgroundColor: '#fff',
    formatter: function (params) {
      return params.data.name + '：' + params.data.value
    },
  },
  series: [{
    type: 'wordCloud',
    gridSize: 20,
    sizeRange: [20, 60],
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

const pieOptionOne = ref({
  graphic: [
     {
      type: 'text',
      top: '45%',
      left: 'center',
      style: {
        text: '基础数据元',
        textAlign: 'center',
        fontSize: 15,
        color: '#666666'
    }
    },
    {
      type: 'text',
      top: '55%',
      left: 'center',
      style: {
        text: '0%',
        textAlign: 'center',
        fontSize: 20,
        color: '#666666'
      }
    },
  ],
  series: [{
    type: 'pie',
    radius: ['50%', '70%'],
    label: {
      show: false,
      position: 'center'
    },
    data: []
  }]
})
const pieOptionTwo = ref({
  graphic: [
    {
      type: 'text',
      top: '45%',
      left: 'center',
      style: {
        text: '数据模型',
        textAlign: 'center',
        fontSize: 15,
        color: '#666666'
      }
    },
    {
      type: 'text',
      top: '55%',
      left: 'center',
      style: {
        text: '0%',
        textAlign: 'center',
        fontSize: 20,
        color: '#666666'
      }
    },
  ],
  series: [{
    type: 'pie',
    radius: ['50%', '70%'],
    label: {
      show: false,
      position: 'center'
    },
    data: []
  }]
})

const columns = [
  {
    title: '序号',
    key: 'index',
    render: (unused, rowIndex) => rowIndex + 1,
    width: 60
  },
  {
    title: '数据元名称',
    key: 'chinese_name'
  },
  {
    title: '所属叶子类目',
    key: 'title_name'
  }
]

const data = ref([{}])
const indexData = ref({
  dataElement3Num: 0,
  dataElement3ReleaseStatusNum: 0,
  dataElementNum: 0,
  model3Num: 0,
  modelNum: 0
})

const initData = async () => {
  indexData.value = await queryModelIndexNum({})

  const cloudData = await queryModelIndexNephogram({})
  cloudOption.value.series[0].data = cloudData.map(item => ({
    name: item.chineseName,
    value: item.fieldNum
  }));

  data.value = await queryModelIndexLatest({})

  const pieData = await queryModelIndexRate({})
  pieOptionOne.value.series[0].data = [
      { value: pieData.modelDataElementNum/(pieData.modelNum + pieData.modelDataElementNum)*100, itemStyle: { color: '#13aad3' } },
      { value: pieData.modelNum/(pieData.modelNum + pieData.modelDataElementNum)*100, itemStyle: { color: '#f1f1f1' } }
  ]
  pieOptionOne.value.graphic[1].style.text = (pieData.modelDataElementNum/(pieData.modelNum + pieData.modelDataElementNum)*100).toFixed(2) + '%'

  pieOptionTwo.value.series[0].data = [
    { value: pieData.modelNum/(pieData.modelNum + pieData.modelDataElementNum)*100, itemStyle: { color: '#13aad3' } },
    { value: pieData.modelDataElementNum/(pieData.modelNum + pieData.modelDataElementNum)*100, itemStyle: { color: '#f1f1f1' } }
  ]
  pieOptionTwo.value.graphic[1].style.text = (pieData.modelNum/(pieData.modelNum + pieData.modelDataElementNum)*100).toFixed(2) + '%'

  const chartData = await queryModelIndexLineChart({})
  barOption.value.xAxis[0].data = chartData[3]
  barOption.value.series[0].data = chartData[0]
  barOption.value.series[1].data = chartData[1]

  total.value = chartData[0].reduce((acc, current) => acc + current, 0);
  const sum = chartData[2].reduce((acc, current) => acc + current, 0);
  if (sum !== 0) {
    rate.value = (total.value / sum * 100).toFixed(2) + '%';
  } else {
    rate.value = '0%'
  }

}

onMounted(() => {
  initData()
})
</script>

<style scoped>
.FBH, .FBV {
  display: flex;
}

.mb16 {
  margin-bottom: 12px;
}

.overview-item-2 {
  padding: 16px;
  height: 160px;
  background-color: #fff;
  border: 1px solid #e8e8e8;
  margin: 12px 12px 0 0;

  .overview-countlast {
    height: 120px;
    font-size: 30px;
    color: rgba(0, 0, 0, .85);
  }

  .overview-default {
    font-size: 12px;
    color: rgba(0,0,0,.65);
  }
}

.FB1 {
  flex: 1;
}

.FBJ, .FBJB {
  justify-content: space-between;
}

html .FBV {
  display: flex;
  flex-direction: column;
}

.FBJC {
  justify-content: center;
}

.FBAC {
  align-items: center;
}

.page-statistic {
  margin-bottom: 12px;
}

.mr8 {
  margin-right: 8px;
}

.bar-tag {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 10px
}
</style>
