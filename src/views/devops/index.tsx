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

import { defineAsyncComponent, defineComponent, onMounted, onBeforeMount, ref, toRefs, watch } from 'vue'
import { NGrid, NGi } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { useTaskState } from './use-task-state'
import { useProcessState } from './use-process-state'
import StateCard from './components/state-card'
import { useUserStore } from "@/store/user/user";
import { useTimezoneStore } from "@/store/timezone/timezone";
import { useRoute, useRouter } from 'vue-router'
import { useAsyncState } from '@vueuse/core'
import type { Component } from 'vue'
import utils from '@/utils'
import { queryUnauthorizedProject, getDataByProjectCodeAndDate, getStatisticsDataByProjectCodeAndDate } from '@/service/modules/devops-analysis'

const modules = import.meta.glob('/src/views/**/**.tsx')


export default defineComponent({
  name: 'devops',
  setup() {

    const { t, locale } = useI18n()
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
          new Date(new Date().setHours(0, 0, 0, 0)).getTime() - 1 * 24 * 60 * 60 * 1000,
          new Date(new Date().setHours(23, 59, 59, 999)).getTime() - 1 * 24 * 60 * 60 * 1000
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
    const ProjName = ref()
    const ProjSelect = ref()
    const { getInterfaceTop10Data, getJobRunErrorTop10Data, getJobRuntimeTop10Data, getTaskStatisticsInfoData, getTaskState, taskVariables, getTaskData, getTaskDev, getProjData } = useTaskState()
    const { processVariables } = useProcessState()
    const route = useRoute()
    const router = useRouter()
    const TaskPie = ref()
    const RunTop10 = ref()
    const RunErrorTop10 = ref()
    const ApiTop10 = ref()
    RunTop10.value = getJobRuntimeTop10Data(
      [new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
      new Date(new Date().setHours(23, 59, 59, 999)).getTime()]
      , Proj.value
    )
    RunErrorTop10.value = getJobRunErrorTop10Data(
      [new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
      new Date(new Date().setHours(23, 59, 59, 999)).getTime()]
      , Proj.value
    )
    ApiTop10.value = getInterfaceTop10Data(
      [new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
      new Date(new Date().setHours(23, 59, 59, 999)).getTime()]
      , Proj.value
    )

    Proj.value = route.params.projectCode
    const RunSelectCurrent = ref()
    const RunErrorSelectCurrent = ref()
    const ApiSelectCurrent = ref()

    const handleRunTop10Data = (val: any) => {
      RunTop10.value = getJobRuntimeTop10Data(val, Proj.value)
      RunSelectCurrent.value = RunSelect.value.filter(item => item.value[0] === val[0])[0].label;

    }
    const handleRunErrorTop10Data = (val: any) => {
      RunErrorTop10.value = getJobRunErrorTop10Data(val, Proj.value)
      RunErrorSelectCurrent.value = RunSelect.value.filter(item => item.value[0] === val[0])[0].label;
    }
    const handlegetInterfaceTop10Data = (val: any) => {
      ApiTop10.value = getInterfaceTop10Data(val, Proj.value)
      ApiSelectCurrent.value = RunSelect.value.filter(item => item.value[0] === val[0])[0].label;
    }

    const handleTaskData = (val: any) => {
      taskDataRef.value = getTaskData([val], Proj.value)
      taskDevRef.value = getTaskDev([val], Proj.value)
      TaskPie.value = getTaskStatisticsInfoData([val], Proj.value)

      dateRef.value = [val]
    }
    const handleProjData = (val: any) => {
      taskDataRef.value = getTaskData(dateRef.value, val)
      taskDevRef.value = getTaskDev(dateRef.value, val)
      TaskPie.value = getTaskStatisticsInfoData(dateRef.value, val)

      Proj.value = val
      const currentRoute = router.currentRoute.value; // 复制当前路由对象

      // 修改参数
      currentRoute.params.projectCode = val;
      // 使用 router.replace() 替换当前路由
      router.replace(currentRoute);
      ProjName.value = ProjSelect.value.filter(item => item.value === val).label;

    }

    const initData = () => {


      taskStateRef.value = getTaskState(dateRef.value) || taskStateRef.value

      taskDataRef.value = getTaskData(dateRef.value, Proj.value) || taskDataRef.value
      taskDevRef.value = getTaskDev(dateRef.value, Proj.value) || taskDevRef.value

      TaskPie.value = getTaskStatisticsInfoData(dateRef.value, Proj.value)
    }


    taskDevRef.value = getTaskDev(dateRef.value, Proj.value)
    taskDataRef.value = getTaskData(dateRef.value, Proj.value) || taskDataRef.value

    TaskPie.value = getTaskStatisticsInfoData(dateRef.value, Proj.value)

    const getProjData1 = async () => {

      const { state } = await useAsyncState(
        queryUnauthorizedProject({
          userId: 0
        }).then(function (res) {
          ;

          const table = res.map((item) => {
            return {
              label: item.name,
              value: item.code,
            }
          });
          ProjName.value = table.filter(item => item.value.toString() === route.params.projectCode).map(item => item.label)[0]
          ProjSelect.value = table
          return { table, Proj }
        }),
        { table: [] }
      )

      return state
    }


    getProjData1()

    watch(
      () => locale.value,
      () => initData()


    )
    return {
      t,
      dateRef,
      handleTaskData,
      handleProjData,
      handleRunTop10Data,
      handleRunErrorTop10Data,
      handlegetInterfaceTop10Data,
      taskStateRef,
      processStateRef,
      taskDataRef,
      taskDevRef,
      ProjSelect,
      ProjName,
      RunSelectCurrent,
      RunSelect,
      RunErrorSelectCurrent,
      ApiSelectCurrent,
      TaskPie,
      RunTop10,
      RunErrorTop10,
      ApiTop10,
      ...toRefs(taskVariables),
      ...toRefs(processVariables)
    }
  },
  render() {
    const {
      t,
      dateRef,
      handleTaskData,
      handleProjData,
      handleRunTop10Data,
      handleRunErrorTop10Data,
      handlegetInterfaceTop10Data,
      taskLoadingRef
    } = this



    return (
      <div>
        <NGrid x-gap={12} cols={1}>
          <NGi>
            <StateCard
              title={t('home.task_state_statistics')}
              date={dateRef}
              tableData={this.taskDevRef?.value.header}
              chartData={this.taskDataRef?.value.table}
              tablecount={this.taskDevRef?.value.table}
              ProjSelect={this.ProjSelect}
              ProjFirst={this.ProjName}
              RunSelectCurrent={this.RunSelectCurrent}
              RunSelect={this.RunSelect}
              RunErrorSelectCurrent={this.RunErrorSelectCurrent}
              ApiSelectCurrent={this.ApiSelectCurrent}
              TaskPieData={this.TaskPie?.value}
              RunTop10Data={this.RunTop10?.value.table}
              RunErrorTop10Data={this.RunErrorTop10?.value.table}
              ApiTop10Data={this.ApiTop10?.value.table}
              onUpdateDatePickerValue={handleTaskData}
              onUpdateProjPickerValue={handleProjData}
              onUpdateRunTop10DatePickerValue={handleRunTop10Data}
              onUpdateRunErrorTop10DatePickerValue={handleRunErrorTop10Data}
              onUpdategetInterfaceTop10Data={handlegetInterfaceTop10Data}
              loadingRef={taskLoadingRef}
            />
          </NGi>

        </NGrid>

      </div>
    )
  }
})
