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

import { useAsyncState } from '@vueuse/core'
import { format } from 'date-fns'
import { toLower } from 'lodash'
import { useI18n } from 'vue-i18n'
import { countTaskState } from '@/service/modules/projects-analysis'
import type { TaskStateRes } from '@/service/modules/projects-analysis/types'
import { getJobRunErrorTop10, getJobRuntimeTop10, getTaskStatisticsInfo, queryUnauthorizedProject, getDataByProjectCodeAndDate, getStatisticsDataByProjectCodeAndDate } from '@/service/modules/devops-analysis'
import { parseTime, renderTableTime, tasksState } from '@/common/common'

import type { StateData } from './types'
import { reactive, ref } from 'vue'

export function useTaskState() {
  const { t } = useI18n()
  const taskVariables = reactive({
    taskLoadingRef: ref(false)
  })

  const getTaskState = (date: Array<any>) => {
    if (taskVariables.taskLoadingRef) return
    taskVariables.taskLoadingRef = true
    const { state } = useAsyncState(
      countTaskState({
        startDate: !date ? '' : format(date[0], 'yyyy-MM-dd HH:mm:ss'),
        endDate: !date ? '' : format(date[1], 'yyyy-MM-dd HH:mm:ss'),
        projectCode: 0
      }).then((res: TaskStateRes): StateData => {
        const table = res.taskCountDtos.map((item, unused) => {
          return {
            title: t('home.' + toLower(item.taskStateType)),
            key: t('home.' + toLower(item.taskStateType)),
          }
        })
        let tabledata = {}
        let i = 0
        for (i = 0; i < res.taskCountDtos.length; i++) {
          tabledata[t('home.' + toLower(res.taskCountDtos[i].taskStateType))] = res.taskCountDtos[i].count;
        }
        const tablecount = [tabledata]

        const chart = res.taskCountDtos.map((item) => {
          return {
            value: item.count,
            name: t('home.' + toLower(item.taskStateType))
          }
        })
        taskVariables.taskLoadingRef = false

        return { table, chart, tablecount }
      }),
      { table: [], chart: [], tablecount: [] }
    )

    return state
  }
  const getTaskDev = (date: Array<any>, projectCode: any) => {
    // const ProjFirst = queryUnauthorizedProject({ userId: 0 })
    const { state } = useAsyncState(
      getStatisticsDataByProjectCodeAndDate({
        startTime: !date ? '' : format(date[0][0], 'yyyy-MM-dd HH:mm:ss'),
        endTime: !date ? '' : format(date[0][1], 'yyyy-MM-dd HH:mm:ss'),
        projectCode: projectCode
      }).then(function (res) {

        const table = [0, 0, 0, 0, 0, 0]
        if (res[0] != null) {
          let i = 0
          for (i = 0; i < res.length; i++) {
            table[3] = res[i].running;
            table[2] = res[i].fail;
            table[4] = res[i].paused;
            table[5] = res[i].stoped;
            table[1] = res[i].succeed;
            table[0] = res[i].running + res[i].fail + res[i].paused + res[i].stoped + res[i].succeed;
          }
        }
        const header = [
          { title: '实例总数', key: '实例总数' },
          { title: '成功', key: '成功' },
          { title: '失败', key: '失败' },
          { title: '正在运行', key: '正在运行' },
          { title: '暂停', key: '暂停' },
          { title: '停止', key: '停止' }

        ]
        return { table, header }
      }),
      { table: [], header: [] }
    )

    return state
  }


  const getTaskData = (date: Array<any>, projectCode: any) => {
    console.log(date)
    const { state } = useAsyncState(
      getDataByProjectCodeAndDate({
        startTime: !date ? '' : format(date[0][0], 'yyyy-MM-dd HH:mm:ss'),
        endTime: !date ? '' : format(date[0][1], 'yyyy-MM-dd HH:mm:ss'),
        projectCode: projectCode
      }).then(function (res) {

        const tabledata = {}
        tabledata['正在运行'] = [];
        tabledata['失败'] = [];
        tabledata['暂停'] = [];
        tabledata['停止'] = [];
        tabledata['成功'] = [];
        tabledata['时间'] = [];
        let i = 0
        for (i = 0; i < res.length; i++) {
          tabledata['正在运行'].push(res[i].running);
          tabledata['失败'].push(res[i].fail);
          tabledata['暂停'].push(res[i].paused);
          tabledata['停止'].push(res[i].stoped);
          tabledata['成功'].push(res[i].succeed);
          tabledata['时间'].push(res[i].dayTime);

        };
        const table = [tabledata]

        return { table }
      }),
      { table: [] }
    )

    return state
  }
  const getProjData = () => {

    const { state } = useAsyncState(
      queryUnauthorizedProject({
        userId: 0
      }).then(function (res) {

        const table = res.map((item) => {
          return {
            label: item.name,
            value: item.code,
          }
        });
        const proj = table[0].value

        return { table, proj }
      }),
      { table: [] }
    )

    return state
  }
  //获取运维总览的饼图状态统计数据
  const getTaskStatisticsInfoData = (date: Array<any>, projectCode: any) => {
    if (taskVariables.taskLoadingRef) return
    taskVariables.taskLoadingRef = true
    const { state } = useAsyncState(
      getTaskStatisticsInfo({
        startTime: !date ? '' : format(date[0][0], 'yyyy-MM-dd HH:mm:ss'),
        endTime: !date ? '' : format(date[0][1], 'yyyy-MM-dd HH:mm:ss'),
        projectCode: projectCode
      }
      )
        .then(function (res) {
          const table = res.map((item) => {
            return {
              value: item.taskNum,
              name: item.taskType,
              ratio: item.ratio,
              taskTotalNum: item.taskTotalNum
            }
          })

          const chart = res.map((item) => {
            return {
              value: item.taskNum,
              name: item.taskType
            }
          })
          taskVariables.taskLoadingRef = false

          return { table, chart }
        }),
      { table: [], chart: [] }
    )

    return state
  }
  //作业运行时长排行TOP10
  const getJobRuntimeTop10Data = (date: Array<any>, projectCode: any) => {
    const { state } = useAsyncState(
      getJobRuntimeTop10({
        startTime: !date ? '' : format(date[0], 'yyyy-MM-dd HH:mm:ss'),
        endTime: !date ? '' : format(date[1], 'yyyy-MM-dd HH:mm:ss'),
        projectCode: projectCode
      }).then(function (res) {
        const table = res.map((item, index) => {
          return {
            排名: index,
            任务名名称: item.taskName,
            工作流名称: item.processName,
            任务代码: item.taskCode,
            最大运行时长: item.taskRunTime
          }
        });
        return { table }
      }),
      { table: [] }
    )

    return state
  }
  const getJobRunErrorTop10Data = (date: Array<any>, projectCode: any) => {
    const { state } = useAsyncState(
      getJobRunErrorTop10({
        startTime: !date ? '' : format(date[0], 'yyyy-MM-dd HH:mm:ss'),
        endTime: !date ? '' : format(date[1], 'yyyy-MM-dd HH:mm:ss'),
        projectCode: projectCode
      }).then(function (res) {
        const table = res.map((item, index) => {
          return {
            排名: index,
            任务名: item.taskName,
            业务流程: item.NAME,
            出错次数: item.taskError,
          }
        });
        return { table }
      }),
      { table: [] }
    )

    return state
  }

  return { getTaskState, taskVariables, getTaskData, getTaskDev, getProjData, getTaskStatisticsInfoData, getJobRuntimeTop10Data, getJobRunErrorTop10Data }
}
