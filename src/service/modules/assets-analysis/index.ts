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

import { axios } from '@/service/service'
import {
  StateReq,
  CodeReq,
  LineChartReq
} from './types'

//资产概览接口
export function getInterfaceTop10(data: StateReq): any {
  return axios({
    url: '/taskInstanceStatistics/getInterfaceTop10',
    method: 'post',
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
  })
}

export function getAssetOverview(data: CodeReq): any {
  return axios({
    url: '/taskInstanceStatistics/getAssetOverviewStatistics',
    method: 'post',
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export function getAssetOverviewLineChart(data: LineChartReq): any {
  return axios({
    url: '/taskInstanceStatistics/getAssetOverviewLineChart',
    method: 'post',
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
