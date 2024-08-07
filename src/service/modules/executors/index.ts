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
  ExecuteReq,
  ProjectCodeReq,
  ProcessDefinitionCodeReq,
  ProcessInstanceReq,
  startTaskInstance
} from './types'

export function execute(data: ExecuteReq, code: number): any {
  return axios({
    url: `/projects/${code}/executors/execute`,
    method: 'post',
    data
  })
}

export function startCheckProcessDefinition(
  data: ProcessDefinitionCodeReq,
  code: ProjectCodeReq
): any {
  return axios({
    url: `/projects/${code}/executors/start-check`,
    method: 'post',
    data
  })
}

export function startProcessInstance(
  data: ProcessInstanceReq,
  code: number
): any {
  return axios({
    url: `/projects/${code}/executors/start-process-instance`,
    method: 'post',
    data
  })
}

export function startTaskInstance(
    code: number,
    projectCode: number,
    data: startTaskInstance,
): any {
  return axios({
    url: `/projects/${projectCode}/process-definition/${code}/execute`,
    method: 'post',
    data
  })
}

export function runTask(
    projectCode: number,
    data: Object,
): any {
  return axios({
    url: `/projects/${projectCode}/task-definition/execute`,
    method: 'post',
    data,
    timeout: 30 * 60 * 1000, // 设置超时为 30 分钟
  })
}

export function stopTask(
    projectCode: number,
    threadName: String,
): any {
  return axios({
    url: `/projects/${projectCode}/task-definition/stopExecute`,
    method: 'post',
    params: {
      threadName
    }
  })
}
