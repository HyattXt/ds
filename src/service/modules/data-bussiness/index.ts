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
  AuthorizationReq,
  ApprovalConfigReq, ApprovalListReq, UpdateApprovalReq
} from './types'

export function userAuthorization(data: AuthorizationReq): any {
  return axios({
    url: '/Approval/userAuthorization',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function queryApprovalConfig(): any {
  return axios({
    url: '/Approval/queryApprovalConfig',
    method: 'post'
  })
}

export function updateApprovalConfig(data: ApprovalConfigReq): any {
  return axios({
    url: '/Approval/updateApprovalConfig',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function queryApprovalList(data: ApprovalListReq): any {
  return axios({
    url: '/Approval/pageList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function updateApproval(data: UpdateApprovalReq): any {
  return axios({
    url: '/Approval/update',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function insertApproval(data: UpdateApprovalReq): any {
  return axios({
    url: '/Approval/insert',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}