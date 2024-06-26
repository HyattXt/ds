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
import { queryUnauthorizedProject } from '@/service/modules/devops-analysis'
import { getInterfaceTop10, getAssetOverview, getAssetOverviewLineChart } from '@/service/modules/assets-analysis'
import { reactive, ref } from 'vue'
import {TableDataType} from "@/views/data-assets/types";

export function useTaskState() {
  const taskVariables = reactive({
    taskLoadingRef: ref(false)
  })


  const getProjData = () => {

    const { state } = useAsyncState(
      queryUnauthorizedProject({
        userId: 0
      }).then(function (res: any) {

        const table = res.map((item: any) => {
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

  const getInterfaceTop10Data = (date: Array<any>, projectCode: any) => {
    const { state } = useAsyncState(
      getInterfaceTop10({
        startTime: !date ? '' : format(date[0], 'yyyy-MM-dd HH:mm:ss'),
        endTime: !date ? '' : format(date[1], 'yyyy-MM-dd HH:mm:ss'),
        projectCode: projectCode
      }).then(function (res: any) {
        const table = res.map((item: any, index: any) => {
          return {
            排名: index + 1,
            接口地址: item.interfaceUrl,
            接口类型: item.interfaceUrlType,
            接口访问次数: item.interfaceNum,
          }
        });
        return { table }
      }),
      { table: [] }
    )

    return state
  }
  const getAssetOverviewData = (projectCode: any) => {
    const { state } = useAsyncState(
      getAssetOverview({
        projectCode: projectCode
      }).then(function (res: any) {

        const table = [0, 0, 0, 0, 0]
        if (res[0] != null) {
          let i = 0
          for (i = 0; i < res.length; i++) {
            table[0] = res[i].totalDataSource;
            table[1] = res[i].totalTables;
            table[2] = Number((parseInt(res[i].dataSize) / 1024 / 1024).toFixed(2));
            table[3] = res[i].totalRecords;
            table[4] = res[i].totalApiInterface;
          }
        }
        return { table }
      }),
      { table: [] }
    )

    return state
  }
  const getAssetOverviewLineData = (pageSize: number, projectCode: any) => {
    const { state } = useAsyncState(
      getAssetOverviewLineChart({
        pageSize: pageSize,
        projectCode: projectCode
      }).then(function (res: any) {
        const tableData : TableDataType = {
          totalDataSource: [],
          totalTables: [],
          dataSize: [],
          totalRecords: [],
          totalApiInterface: [],
          time: [],
        }
        let i = 0
        for (i = 0; i < res.length; i++) {
          tableData['totalDataSource'].push(parseInt(res[i].totalDataSource));
          tableData['totalTables'].push(parseInt(res[i].totalTables));
          tableData['dataSize'].push(parseInt(res[i].dataSize) / 1024 / 1024);
          tableData['totalRecords'].push(parseInt(res[i].totalRecords));
          tableData['totalApiInterface'].push(parseInt(res[i].totalApiInterface));
          tableData['time'].push(res[i].createTime.substring(5, 10));

        };
        const table = [tableData]

        return { table }
      }),
      { table: [] }
    )

    return state
  }
  return { taskVariables, getProjData, getInterfaceTop10Data, getAssetOverviewData, getAssetOverviewLineData }
}
