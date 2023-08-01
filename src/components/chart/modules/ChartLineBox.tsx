/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { defineComponent, PropType, ref } from 'vue'
import initChart from '@/components/chart'
import type { Ref } from 'vue'

const props = {
  height: {
    type: [String, Number] as PropType<string | number>,
    default: '100%'
  },
  width: {
    type: [String, Number] as PropType<string | number>,
    default: '100%'
  },
  data: {
    type: Array as PropType<Array<any>>
  }
}

const PieChart = defineComponent({
  name: 'PieChart',
  props,
  setup(props) {
    const pieChartRef: Ref<HTMLDivElement | null> = ref(null)
    //console.log(props.data)
    const option = {
      title: {
        show: false,//false
        text: "实例运行时段分布",//主标题文本
        textStyle: {
          color: '#1F2225',
          fontSize: '16',
          fontFamily: 'sans-serif',
        }
      },

      tooltip: {              //设置tip提示
        trigger: 'axis'
      },

      legend: {               //设置区分（哪条线属于什么）
        data: props.data[0].keys,
        icon: 'circle',
        right: 20,
        top: 50,
      },
      color: ['#30CE78', '#FF5D40', '#349EFF', '#BB85B3', '#FFB834'],       //设置区分（每条线是什么颜色，和 legend 一一对应）
      xAxis: {                //设置x轴
        type: 'category',
        boundaryGap: false,     //坐标轴两边不留白
        data: props.data[0].时间,
        name: '时间',           //X轴 name
        nameTextStyle: {        //坐标轴名称的文字样式
          color: '#FA6F53',
          fontSize: 16,
          padding: [0, 0, 0, 20]
        },
        axisLine: {             //坐标轴轴线相关设置。
          lineStyle: {
            color: '#333',
          }
        },
        axisTick: {
          show: false
        }
      },
      yAxis: {
        name: '数量',
        minInterval: 1,
        // min: function(value){
        //   return value.min;
        // },
        // max:function(value){
        //   return value.max;
        // },
        nameTextStyle: {
          color: '#FA6F53',
          fontSize: 16,
          padding: [0, 0, 10, 0]
        },
        axisLine: {
          lineStyle: {
            color: '#333',
          }
        },
        type: 'value'
      },
      series: [
        {
          name: '成功',
          showSymbol: false,
          data: props.data[0].成功,
          type: 'line',               // 类型为折线图
          // smooth: false,
          lineStyle: {                // 线条样式 => 必须使用normal属性
            color: '#30CE78',
          },
        },
        {
          name: '失败',
          showSymbol: false,
          data: props.data[0].失败,
          type: 'line',
          lineStyle: {
            color: '#FF5D40',
          },
        },
        {
          name: '正在运行',
          showSymbol: false,
          data: props.data[0].正在运行,
          type: 'line',
          lineStyle: {
            color: '#349EFF',
          },
        },
        {
          name: '暂停',
          showSymbol: false,
          data: props.data[0].暂停,
          type: 'line',
          lineStyle: {
            color: '#BB85B3',
          },
        },
        {
          name: '停止',
          showSymbol: false,
          data: props.data[0].停止,
          type: 'line',
          lineStyle: {
            color: '#FFB834',
          },
        }
      ],
      grid: {
        x: 30,
        y: 50,
        x2: 30,
        y2: 35
      },
    };

    initChart(pieChartRef, option)

    return { pieChartRef }
  },
  render() {
    const { height, width } = this
    return (
      <div
        ref='pieChartRef'
        style={{
          height: '100%',
          width: typeof width === 'number' ? width + 'px' : width
        }}
      />
    )
  }
})

export default PieChart
