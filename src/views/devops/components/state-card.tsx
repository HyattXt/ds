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

import { defineComponent, PropType, h } from 'vue'
import { NProgress, NDataTable, NDatePicker, NGrid, NGi, NSpace, NSelect } from 'naive-ui'
import ChartLineBox from '@/components/chart/modules/ChartLineBox'
import TaskPie from '@/components/chart/modules/TaskPie'
import CrudHead from "@/components/cue/crud-header.vue"
import Card from '@/components/card'
import type { StateTableData } from '../types'
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import {SelectMixedOption} from "naive-ui/lib/select/src/interface";

const props = {
  title: {
    type: String as PropType<string>
  },
  date: {
    type: Array as PropType<Array<any>>
  },
  tableData: {
    type: Array as PropType<Array<StateTableData>>,
    default: () => []
  },
  chartData: {
    type: Array as PropType<SelectMixedOption[]>,
    default: () => []
  },
  tableCount: {
    type: Array,
    default: () => []
  },
  ProjSelect: {
    type: Array as PropType<SelectMixedOption[]>
  },
  ProjFirst: {
    type: String
  },
  RunSelectCurrent: {
    type: String
  },
  RunSelect: {type: Array},
  RunErrorSelectCurrent: {type: String},
  ApiSelectCurrent: {type: String},
  loadingRef: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  TaskPieData: {
    type: Object,
    default: () => {}
  },
  RunTop10Data: {
    type: Array as PropType<SelectMixedOption[]>
  },
  RunErrorTop10Data: {type: Array as PropType<SelectMixedOption[]>},
  ApiTop10Data: {type: Array as PropType<SelectMixedOption[]>}
}

const StateCard = defineComponent({
  name: 'StateCard',
  props,
  emits: ['updateDatePickerValue', 'updateProjPickerValue', 'UpdateRunTop10DatePickerValue', 'UpdateRunErrorTop10DatePickerValue', 'UpdateGetInterfaceTop10Data'],
  setup(props, ctx) {
    const onUpdateDatePickerValue = (dateP: any) => {
      ctx.emit('updateDatePickerValue', dateP)
    }
    const onUpdateProjPickerValue = (val: any) => {
      ctx.emit('updateProjPickerValue', val)
    }
    const onUpdateRunTop10DatePickerValue = (top10: any) => {
      ctx.emit('UpdateRunTop10DatePickerValue', top10)
    }
    const onUpdateRunErrorTop10DatePickerValue = (top10: any) => {
      ctx.emit('UpdateRunErrorTop10DatePickerValue', top10)
    }
    const onUpdateGetInterfaceTop10Data = (top10: any) => {
      ctx.emit('UpdateGetInterfaceTop10Data', top10)
    }

    const { t } = useI18n()
    const datePickerRange = ref(
      [new Date(new Date().setHours(0, 0, 0, 0)).getTime() - 6 * 24 * 60 * 60 * 1000,
      new Date(new Date().setHours(0, 0, 0, 0)).getTime() + 24 * 60 * 60 * 1000]
    )


    // 在组件挂载时动态生成组件

    return { onUpdateDatePickerValue, onUpdateProjPickerValue, onUpdateRunTop10DatePickerValue, onUpdateRunErrorTop10DatePickerValue, onUpdateGetInterfaceTop10Data, t, datePickerRange }
  },

  render() {
    const {
      t,
      chartData,
      tableCount,
      ProjSelect,
      ProjFirst,
      RunSelectCurrent,
      RunSelect,
      RunErrorSelectCurrent,
      ApiSelectCurrent,
      TaskPieData,
      RunTop10Data,
      RunErrorTop10Data,
      ApiTop10Data,
      onUpdateDatePickerValue,
      onUpdateProjPickerValue,
      onUpdateRunTop10DatePickerValue,
      onUpdateRunErrorTop10DatePickerValue,
      onUpdateGetInterfaceTop10Data
    } = this

    const route = useRoute()
    const ALL = `/devops/${route.params.projectCode}/task/instances?timeRange=${this.datePickerRange}`
    const SUCCESS = `/devops/${route.params.projectCode}/task/instances?stateType=SUCCESS&timeRange=${this.datePickerRange}`
    const FAILURE = `/devops/${route.params.projectCode}/task/instances?stateType=FAILURE&timeRange=${this.datePickerRange}`
    const RUNNING_EXECUTION = `/devops/${route.params.projectCode}/task/instances?stateType=RUNNING_EXECUTION&timeRange=${this.datePickerRange}`
    const STOP = `/devops/${route.params.projectCode}/task/instances?stateType=STOP&timeRange=${this.datePickerRange}`
    const PAUSE = `/devops/${route.params.projectCode}/task/instances?stateType=PAUSE&timeRange=${this.datePickerRange}`
    const colors = [
      '#6e40aa', '#c83dac', '#ff5375', '#ff8c38', '#c9d33a',
      '#79f659', '#28ea8d', '#1eb8d0', '#cab2d6', '#6a3d9a',
      '#E6FF33', '#33FFC7', '#FFC733', '#33C7FF', '#C733FF',
      '#FF3357', '#33FF33', '#33FFC7', '#FF33C7', '#33C7FF',
      '#C73333', '#33C733', '#FF57E6', '#E6FF57', '#57E6FF'
    ];
    const progressElements = TaskPieData.table
        // @ts-ignore
      .filter(item => item.ratio !== 0).map((item, index) => {
        const formattedRatio = item.ratio.toFixed(1); // Ensure two decimal places
        const displayRatio =
          formattedRatio.length < 4 ? `${formattedRatio}% | ${item.value}` : `${formattedRatio}% | ${item.value}`;
        const displayNull = ' ';
        return h('div', { key: index, style: { display: 'flex', alignItems: 'center', margin: '1px 0' } }, [
          h('div', {
            style: {
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: colors[index],
              marginRight: '10px',
            },
          }), // Colored dot
          h('p', { style: { width: '25%', marginRight: '5px', textAlign: 'left', flexShrink: 0 } }, { default: () => item.name }), // Left-align 'item.name'
          h(NProgress, { percentage: item.ratio, height: 15, style: { width: '20vw', flexGrow: 1 } }, { default: () => displayNull }), // Use the formatted and concatenated ratio
          h('p', { style: { width: '20%', marginRight: '5px', textAlign: 'left', flexShrink: 0 } }, { default: () => displayRatio }), // Left-align 'item.name'
        ]);
      });



    const RunSelectHeader = ref([
      { title: '排名', key: '排名', width: 60 },
      { title: '任务名名称', key: '任务名名称' },
      { title: '工作流名称', key: '工作流名称' },
      { title: '任务代码', key: '任务代码' },
      { title: '最大运行时长', key: '最大运行时长' }
    ]);

    const RunErrorSelectHeader = ref([
      { title: '排名', key: '排名', width: 60 },
      { title: '任务名', key: '任务名' },
      { title: '业务流程', key: '业务流程' },
      { title: '出错次数', key: '出错次数' },
    ]);

    const ApiTop10DataHeader = ref([
      { title: '排名', key: '排名', width: 60 },
      { title: '接口地址', key: '接口地址' },
      { title: '接口类型', key: '接口类型' },
      { title: '接口访问次数', key: '接口访问次数' },
    ]);
    return (
        <div>
          <CrudHead
              title={"运维概览"}
          />
          <div style={"background: #fff; padding: 10px; display: flex; align-items: center"}>
            <NSelect
                size='small'
                value={ProjFirst}
                defaultValue={ProjFirst}
                options={ProjSelect}
                style="width:150px;display:none"
                onUpdateValue={onUpdateProjPickerValue}
            />
            日期：
            <NDatePicker
                v-model={[this.datePickerRange, 'value']}
                type='datetimerange'
                size='small'
                start-placeholder={t('project.task.start_time')}
                end-placeholder={t('project.task.end_time')}
                onUpdateValue={onUpdateDatePickerValue}
                clearable
            />
          </div>
          <NGrid x-gap={0} cols={2}  >
            <NGi span={2}>
              <Card title={'任务状态统计'}>
                <div style="display: flex;padding: 10px; height: 90px">
                  <div style="flex: 1;background-color: #f4f6f9;margin: 0 24px 0 0;padding-top: 16px;padding-left: 16px;padding-bottom: 8px;border-radius: 2px;">
                  <span role="img" class="anticon" style="font-size: 16px; padding-right: 8px">
                    <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="25" height="25"><path d="M67.1 310.4c-6.7 3.7-6.7 14.1 0 17.7l423.3 239.2c12.2 6.7 27.5 6.7 39.8 0l423.3-239.2c6.7-3.7 6.7-14.1 0-17.7L519.2 65.1c-5.5-3.1-12.2-3.1-17.7 0L67.1 310.4z" fill="#0099CB"></path><path d="M954.1 503.1l-89.3-50.8L563.2 623c-15.9 9.2-34.3 13.5-52 13.5-17.7 0-36.1-4.3-52-13.5L156.5 452.3l-89.3 50.8c-6.7 3.7-6.7 14.1 0 17.7L490.4 760c12.2 6.7 27.5 6.7 39.8 0l423.3-239.2c7.3-4.2 7.3-14 0.6-17.7z" fill="#0099CB"></path><path d="M954.1 697.6L863 646.2 562.6 815.7c-15.9 9.2-34.3 13.5-52 13.5s-36.1-4.3-52-13.5L158.3 646.2l-91.1 51.4c-6.7 3.7-6.7 14.1 0 17.7l423.3 239.2c12.2 6.7 27.5 6.7 39.8 0l423.3-239.2c7.2-4.2 7.2-14 0.5-17.7z" fill="#0099CB"></path></svg>
                  </span>
                    实例总数
                  <router-link to={ALL} style={"text-decoration: none;"}>
                    <div style="font-size: 24px; color: #000000"> {tableCount[0]} </div>
                  </router-link>
                  </div>
                  <div style="flex: 1;background-color: #f4f6f9;margin: 0 24px 0 0;padding-top: 16px;padding-left: 16px;padding-bottom: 8px;border-radius: 2px;">
                  <span role="img" class="anticon" style="font-size: 16px; padding-right: 8px">
                    <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="25" height="25"><path d="M512 41.472c-129.901714 0-247.661714 52.662857-332.8 137.801143A469.211429 469.211429 0 0 0 41.545143 512c0 129.901714 52.662857 247.661714 137.801143 332.726857A469.211429 469.211429 0 0 0 512 982.528c129.901714 0 247.661714-52.662857 332.726857-137.801143A469.211429 469.211429 0 0 0 982.528 512c0-129.901714-52.662857-247.661714-137.801143-332.8A469.211429 469.211429 0 0 0 512 41.545143z" fill="#0099CB" data-spm-anchor-id="a313x.search_index.0.i12.76293a81UD8Rem" class=""></path><path d="M787.382857 384L500.370286 671.012571a43.885714 43.885714 0 0 1-62.098286 0L279.259429 512l62.098285-62.098286 128 128 256-256 62.025143 62.098286z" fill="#ffffff" data-spm-anchor-id="a313x.search_index.0.i11.76293a81UD8Rem" class="selected"></path></svg>
                  </span>
                    成功
                    <router-link to={SUCCESS} style={"text-decoration: none;"}>
                      <div style="font-size: 24px; color: #000000"> {tableCount[1]} </div>
                    </router-link>
                  </div>
                  <div style="flex: 1;background-color: #f4f6f9;margin: 0 24px 0 0;padding-top: 16px;padding-left: 16px;padding-bottom: 8px;border-radius: 2px;">
                  <span role="img" class="anticon" style="font-size: 16px; padding-right: 8px">
                    <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="25" height="25"><path d="M512 41.472a470.528 470.528 0 1 0 0 941.056A470.528 470.528 0 0 0 512 41.472z" fill="#0099CB"></path><path d="M574.025143 512l146.285714-146.285714L658.285714 303.616l-146.285714 146.285714-146.285714-146.285714L303.542857 365.714286l146.285714 146.285714-146.285714 146.285714L365.714286 720.384l146.285714-146.285714 146.285714 146.285714L720.310857 658.285714l-146.285714-146.285714z" fill="#ffffff" data-spm-anchor-id="a313x.search_index.0.i18.76293a81UD8Rem" class="selected"></path></svg>
                  </span>
                    失败
                    <router-link to={FAILURE} style={"text-decoration: none;"}>
                      <div style="font-size: 24px; color: #000000"> {tableCount[2]} </div>
                    </router-link>
                  </div>
                  <div style="flex: 1;background-color: #f4f6f9;margin: 0 24px 0 0;padding-top: 16px;padding-left: 16px;padding-bottom: 8px;border-radius: 2px;">
                  <span role="img" class="anticon" style="font-size: 16px; padding-right: 8px">
                    <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="25" height="25"><path d="M501.94 0A502.121 502.121 0 0 0 0 501.94c0 277.083 224.858 502.002 501.94 502.002s502.002-224.919 502.002-502.001S779.023 0 501.94 0zM401.59 677.647V326.295c0-20.6 23.552-32.648 40.116-20.119l234.436 175.706c13.553 10.06 13.553 30.118 0 40.177L441.705 697.705a25.058 25.058 0 0 1-40.116-20.058z" fill="#0099CB"></path></svg>
                  </span>
                    正在运行
                    <router-link to={RUNNING_EXECUTION} style={"text-decoration: none;"}>
                      <div style="font-size: 24px; color: #000000"> {tableCount[3]} </div>
                    </router-link>
                  </div>
                  <div style="flex: 1;background-color: #f4f6f9;margin: 0 24px 0 0;padding-top: 16px;padding-left: 16px;padding-bottom: 8px;border-radius: 2px;">
                  <span role="img" class="anticon" style="font-size: 16px; padding-right: 8px">
                    <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="25" height="25"><path d="M874.058005 149.941995a510.06838 510.06838 0 1 0 109.740156 162.738976 511.396369 511.396369 0 0 0-109.740156-162.738976z" fill="#0099CB" data-spm-anchor-id="a313x.search_index.0.i43.76293a81UD8Rem" class=""></path><path d="M417.954256 281.533601a41.046923 41.046923 0 0 0-41.77128 40.201839v385.116718a41.892007 41.892007 0 0 0 83.663287 0v-385.116718a41.167649 41.167649 0 0 0-41.892007-40.201839zM606.045744 281.533601a41.046923 41.046923 0 0 0-41.77128 40.201839v385.116718a41.892007 41.892007 0 0 0 83.663287 0v-385.116718a41.167649 41.167649 0 0 0-41.892007-40.201839z" fill="#ffffff" data-spm-anchor-id="a313x.search_index.0.i44.76293a81UD8Rem" class="selected"></path></svg>
                  </span>
                    暂停
                    <router-link to={PAUSE} style={"text-decoration: none;"}>
                      <div style="font-size: 24px; color: #000000"> {tableCount[4]} </div>
                    </router-link>
                  </div>
                  <div style="flex: 1;background-color: #f4f6f9;margin: 0 24px 0 0;padding-top: 16px;padding-left: 16px;padding-bottom: 8px;border-radius: 2px;">
                  <span role="img" class="anticon" style="font-size: 16px; padding-right: 8px">
                    <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="25" height="25"><path d="M510.9 60.7c-245.6 0-446.7 199.8-446.7 446.7C64.2 753 263.9 954 510.8 954s446.6-199.7 446.6-446.6c0.1-245.6-199.6-446.7-446.5-446.7z m139.8 574c0 8.8-7.2 16-16 16H389.3c-8.8 0-16-7.2-16-16V389.3c0-8.8 7.2-16 16-16h245.5c8.8 0 16 7.2 16 16v245.4z" fill="#0099CB"></path></svg>
                  </span>
                    停止
                    <router-link to={STOP} style={"text-decoration: none;"}>
                      <div style="font-size: 24px; color: #000000"> {tableCount[5]} </div>
                    </router-link>
                  </div>
                </div>
              </Card>
            </NGi>
            <NGi span={2}>
              <Card title={'实例运行时段分布'} style={{ height: '60vh', width: '100%', flexWrap: "nowrap" }}>
                {chartData.length > 0 && <ChartLineBox data={chartData} />}
              </Card>
            </NGi>
            <NGi span={2} >
              <Card title={'实例类别占比'} style={{ border: 'none', height: '100%' }}>
                <div style={{ border: 'none', display: 'flex', height: '100%',justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ width: '50%'  }}>
                    {TaskPieData.chart.length > 0 && <TaskPie data={TaskPieData.chart} taskTotalNum={TaskPieData.table[0].taskTotalNum} colors={colors} />}
                  </div>
                  <div style={{ width: '50%' }}>
                    {progressElements}
                  </div>
                </div>
              </Card>
            </NGi>
            <NGi span={1}>
              <Card >
                <NSpace justify='space-between' style={{ height: '40px' }}>
                  <p style="font-size:16px;">作业运行时长排行TOP10</p>
                  <NSelect
                      size='small'
                      value={RunSelectCurrent}
                      defaultValue='今天'
                      options={RunSelect}
                      style="width:150px;border: none; outline: none;"
                      onUpdateValue={onUpdateRunTop10DatePickerValue}
                  />
                </NSpace>
                <NDataTable
                    columns={RunSelectHeader.value}
                    data={RunTop10Data}
                    size='small'
                    striped
                    min-height={"150"}
                    max-height={"150"}
                />
              </Card>
            </NGi>
            <NGi span={1}>
              <Card >
                <NSpace justify='space-between' style={{ height: '40px' }}>
                  <p style="font-size:16px;">作业运行出错排行TOP10</p>
                  <NSelect
                      size='small'
                      value={RunErrorSelectCurrent}
                      defaultValue='今天'
                      options={RunSelect}
                      style="width:150px;border: none; outline: none;"
                      onUpdateValue={onUpdateRunErrorTop10DatePickerValue}
                  />
                </NSpace>
                <NDataTable
                    columns={RunErrorSelectHeader.value}
                    data={RunErrorTop10Data}
                    size='small'
                    striped
                    min-height={"150"}
                    max-height={"150"}
                />
              </Card>
            </NGi>
            <NGi span={2}>
              <Card>
                <NSpace justify='space-between' style={{ height: '40px' }}>
                  <p style="font-size:16px;">API调用次数TOP10</p>
                  <NSelect
                      size='small'
                      value={ApiSelectCurrent}
                      defaultValue='今天'
                      options={RunSelect}
                      style="width:150px;border: none; outline: none;"
                      onUpdateValue={onUpdateGetInterfaceTop10Data}
                  />
                </NSpace>
                <NDataTable
                    columns={ApiTop10DataHeader.value}
                    data={ApiTop10Data}
                    striped
                    size='small'
                    min-height={"150"}
                    max-height={"150"}
                />
              </Card>
            </NGi>
          </NGrid >
        </div>
    )
  }
})

export default StateCard
