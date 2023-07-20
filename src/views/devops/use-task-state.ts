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
import { queryUnauthorizedProject, getDataByProjectCodeAndDate, getStatisticsDataByProjectCodeAndDate } from '@/service/modules/devops-analysis'

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
        dayDate: !date ? '' : format(date[0], 'yyyy-MM-dd'),
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
  const getTaskDev2 = (date, projectCode) => {
    try {
      // 从另一个接口获取 projectCode
      const projectCodeResponse = queryUnauthorizedProject({ userId: 0 });
      // const obtainedProjectCode = projectCodeResponse[0]['code'];

      // ;

      const res = getStatisticsDataByProjectCodeAndDate({
        dayDate: !date ? '' : format(date[0], 'yyyy-MM-dd'),
        projectCode: ''
      });

      const table = [0, 0, 0, 0, 0, 0];
      if (res[0] != null) {
        let i = 0;
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
      ];

      return { table, header };
    } catch (error) {
      console.error(error);
      return { table: [], header: [] };
    }
  };

  const getTaskData = (date: Array<any>, projectCode: any) => {

    const { state } = useAsyncState(
      getDataByProjectCodeAndDate({
        dayDate: !date ? '' : format(date[0], 'yyyy-MM-dd'),
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

        }

        ;
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
        ;

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
  // const getProjData = () => {
  //   const res = queryUnauthorizedProject({ userId: 0 });
  //   ;
  //   ;
  //   ;

  //   const table = res.map((item) => {
  //     return {
  //       label: item.name,
  //       value: item.code,
  //     };
  //   });
  //   const proj = table[0].value
  //   ;

  //   return { table, proj };
  // };


  return { getTaskState, taskVariables, getTaskData, getTaskDev, getProjData }
}
