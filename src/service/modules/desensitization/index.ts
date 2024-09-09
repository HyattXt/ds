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
import type {
  EncryptionReq,
  DesensitizationRulesListReq,
  DesensitizationRulesInsertReq,
  effectiveStatusReq,
  DataLedgerListReq,
  DataLedgerReq
} from './types'
import {modelTableReq} from "@/service/modules/data-standard/types";

export function queryDataSecurityEncryption(data: EncryptionReq): any {
  return axios({
    url: '/DataSecurityEncryption/getList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function queryDataSecurityDesensitizationRules(data: DesensitizationRulesListReq): any {
  return axios({
    url: '/DataSecurityDesensitizationRules/getList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function verifyDesensitizationRules(data: DesensitizationRulesInsertReq): any {
  return axios({
    url: '/DataSecurityDesensitizationRules/desensitization',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function verifyEncryptionRules(data): any {
  return axios({
    url: '/DataSecurityDesensitizationRules/encryption',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function insertDesensitizationRules(data: DesensitizationRulesInsertReq): any {
  return axios({
    url: '/DataSecurityDesensitizationRules/insert',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function updateDesensitizationRules(data: DesensitizationRulesInsertReq): any {
  return axios({
    url: '/DataSecurityDesensitizationRules/update',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function deleteDesensitizationRules(data, id): any {
  return axios({
    url: '/DataSecurityDesensitizationRules/delete',
    method: 'post',
    params:{
      id
    },
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function effectiveDesensitizationRules(data: effectiveStatusReq): any {
  return axios({
    url: '/DataSecurityDesensitizationRules/effectiveStatusUpdate',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function queryDataSecurityDataLedger(data: DataLedgerListReq): any {
  return axios({
    url: '/DataSecurityDataLedger/getList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function insertDataLedger(data: DataLedgerReq): any {
  return axios({
    url: '/DataSecurityDataLedger/insert',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function updateDataLedger(data: DataLedgerReq): any {
  return axios({
    url: 'DataSecurityDataLedger/update',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function deleteDataLedger(data, id): any {
  return axios({
    url: '/DataSecurityDataLedger/delete',
    method: 'post',
    params:{
      id
    },
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function effectiveDataLedger(data: effectiveStatusReq): any {
  return axios({
    url: '/DataSecurityDataLedger/effectiveStatusUpdate',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function getDataLedgerFiled(data): any {
  return axios({
    url: '/DataSecurityDataLedger/getDataLedgerFiled',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function ruleNameExists(data): any {
  return axios({
    url: '/DataSecurityDesensitizationRules/desensitizationRuleNameExists',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function dataLedgerExists(data): any {
  return axios({
    url: '/DataSecurityDataLedger/dataLedgerTableNameExists',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function desensitizationUsed(data): any {
  return axios({
    url: '/DataSecurityDesensitizationRules/queryDataLedgerNumByDesensitizationRulesId',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function queryDesensitizationUsedList(data): any {
  return axios({
    url: '/DataSecurityDesensitizationRules/queryDataLedgerByDesensitizationRulesId',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function runDataProcess(data): any {
  return axios({
    url: '/DataSecurityDataLedger/dataProcessDataLedgerId',
    method: 'post',
    data,
    timeout: 5 * 60 * 1000,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}
