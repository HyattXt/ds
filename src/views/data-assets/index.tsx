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

import { defineComponent, onMounted, ref, toRefs } from 'vue'
import { NGrid, NGi } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { useTaskState } from './use-task-state'
import StateCard from './components/state-card'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'assets',
  setup() {
    const { t } = useI18n()
    const dateRef = ref(
      [[new Date(new Date().setHours(0, 0, 0, 0)).getTime() - 6 * 24 * 60 * 60 * 1000,
      new Date(new Date().setHours(0, 0, 0, 0)).getTime() + 24 * 60 * 60 * 1000]]
    )
    const RunSelect = ref([
      {
        label: '今天',
        value: [
          new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
          new Date(new Date().setHours(23, 59, 59, 999)).getTime()
        ]
      },
      {
        label: '昨天',
        value: [
          new Date(new Date().setHours(0, 0, 0, 0)).getTime() - 24 * 60 * 60 * 1000,
          new Date(new Date().setHours(23, 59, 59, 999)).getTime() - 24 * 60 * 60 * 1000
        ]
      },
      {
        label: '近7天',
        value: [
          new Date(new Date().setHours(0, 0, 0, 0)).getTime() - 6 * 24 * 60 * 60 * 1000,
          new Date(new Date().setHours(23, 59, 59, 999)).getTime()
        ]
      },
      {
        label: '近15天',
        value: [
          new Date(new Date().setHours(0, 0, 0, 0)).getTime() - 14 * 24 * 60 * 60 * 1000,
          new Date(new Date().setHours(23, 59, 59, 999)).getTime()
        ]
      },
      {
        label: '近30天',
        value: [
          new Date(new Date().setHours(0, 0, 0, 0)).getTime() - 29 * 24 * 60 * 60 * 1000,
          new Date(new Date().setHours(23, 59, 59, 999)).getTime()
        ]
      }
    ]);

    const taskStateRef = ref()
    const processStateRef = ref()
    const taskDataRef = ref()
    const taskDevRef = ref()
    const Proj = ref()

    const { getAssetOverviewLineData, getAssetOverviewData, getInterfaceTop10Data, taskVariables } = useTaskState()
    const route = useRoute()
    const ApiTop10 = ref()
    const AssetOverview = ref()
    const AssetOverviewLineData = ref()
    Proj.value = route.params.projectCode


    const AssentsSelect = ref([{
      label: '近7天',
      value: 7
    },
    {
      label: '近30天',
      value: 30
    }
    ])
    const RunSelectCurrent = ref()
    const RunErrorSelectCurrent = ref()
    const ApiSelectCurrent = ref()
    const AssentsSelectCurrent = ref()
    const initData = () =>{
      ApiTop10.value = getInterfaceTop10Data(
          [new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
            new Date(new Date().setHours(23, 59, 59, 999)).getTime()]
          , Proj.value
      )
      AssetOverview.value = getAssetOverviewData(Proj.value)
      AssetOverviewLineData.value = getAssetOverviewLineData(7, Proj.value)
    }

    const handlegetInterfaceTop10Data = (val: any) => {
      ApiTop10.value = getInterfaceTop10Data(val, Proj.value)
      ApiSelectCurrent.value = RunSelect.value.filter(item => item.value[0] === val[0])[0].label;
    }
    const handlegetAssetOverviewLineData = (val: any) => {
      AssetOverviewLineData.value = getAssetOverviewLineData(val, Proj.value)
      AssentsSelectCurrent.value = AssentsSelect.value.filter(item => item.value === val)[0].label;
    }

    onMounted(() => {
      initData()
    })


    return {
      t,
      dateRef,
      taskStateRef,
      processStateRef,
      taskDataRef,
      taskDevRef,
      RunSelectCurrent,
      RunSelect,
      AssentsSelect,
      RunErrorSelectCurrent,
      ApiSelectCurrent,
      AssentsSelectCurrent,
      ApiTop10,
      AssetOverview,
      AssetOverviewLineData,
      handlegetInterfaceTop10Data,
      handlegetAssetOverviewLineData,
      ...toRefs(taskVariables),
    }
  },
  render() {
    const {
      t,
      taskLoadingRef,
      handlegetInterfaceTop10Data,
      handlegetAssetOverviewLineData,
    } = this


    return (
      <div>
        <NGrid x-gap={12} cols={1}>
          <NGi>
            <StateCard
              title={t('home.task_state_statistics')}
              RunSelect={this.RunSelect}
              AssentsSelect={this.AssentsSelect}
              ApiSelectCurrent={this.ApiSelectCurrent}
              AssentsSelectCurrent={this.AssentsSelectCurrent}
              ApiTop10Data={this.ApiTop10?.value.table}
              AssetOverviewData={this.AssetOverview?.value.table}
              AssetOverviewLineData={this.AssetOverviewLineData?.value.table}
              onUpdategetInterfaceTop10Data={handlegetInterfaceTop10Data}
              onUpdategetAssetOverviewLineData={handlegetAssetOverviewLineData}
              loadingRef={taskLoadingRef}
            />
          </NGi>

        </NGrid>

      </div>
    )
  }
})
