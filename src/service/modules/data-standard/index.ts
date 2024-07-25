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
  ListReq,
  modelReq,
  modelTreeReq,
  modelTreeId,
  modelTreeUpdateReq,
  releaseReq,
  modelTableReq,
  modelColumnReq,
  createModelColumnReq, modelFieldListReq
} from './types'

export function queryStandardTreeFolder(data): any {
  return axios({
    url: '/ModelDataElement/getTreeFloder',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function createStandardTreeFolder(data: modelTreeReq): any {
  return axios({
    url: '/ModelDataElement/insertModelDataElementTree',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function updateStandardTreeFolder(data: modelTreeUpdateReq): any {
  return axios({
    url: '/ModelDataElement/updateModelDataElementFloderRename',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function deleteStandardTreeFolder(data: modelTreeId): any {
  return axios({
    url: '/ModelDataElement/deleteModelDataElementTree',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function queryModelTreeFolder(data): any {
  return axios({
    url: '/Model/getTreeFloder',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function createModelTreeFolder(data: modelTreeReq): any {
  return axios({
    url: '/Model/insertModelTree',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function updateModelTreeFolder(data: modelTreeUpdateReq): any {
  return axios({
    url: '/Model/updateModelFloderRename',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function deleteModelTreeFolder(data: modelTreeId): any {
  return axios({
    url: '/Model/deleteModelTree',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function createDataElement(data: dataElementReq): any {
  return axios({
    url: '/ModelDataElement/insert',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function updateDataElement(data: dataElementReq): any {
  return axios({
    url: '/ModelDataElement/update',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function deleteDataElement(data: modelTreeId): any {
  return axios({
    url: '/ModelDataElement/delete',
    method: 'post',
    data
  })
}

export function createModel(data: modelReq): any {
  return axios({
    url: '/Model/insert',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function updateModel(data: modelReq): any {
  return axios({
    url: '/Model/update',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function deleteModel(data: modelTreeId): any {
  return axios({
    url: '/Model/delete',
    method: 'post',
    data
  })
}

export function queryStandardList(data: ListReq): any {
  return axios({
    url: '/ModelDataElement/getList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function queryModelList(data: ListReq): any {
  return axios({
    url: '/Model/getList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function releaseStandard(data: releaseReq): any {
  return axios({
    url: '/ModelDataElement/releaseStatusUpdate',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function modelTableExists(data: modelTableReq): any {
  return axios({
    url: '/Model/tableExists',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function modelTableCreate(data: modelTableReq): any {
  return axios({
    url: '/Model/excuteCreateTable',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function queryModelColumn(data: modelColumnReq): any {
  return axios({
    url: '/ModelField/getList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function createModelColumn(data: createModelColumnReq): any {
  return axios({
    url: '/ModelField/insert',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function updateModelColumn(data: createModelColumnReq): any {
  return axios({
    url: '/ModelField/update',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function deleteModelColumn(data: modelTreeId): any {
  return axios({
    url: '/ModelField/delete',
    method: 'post',
    data
  })
}

export function sortModelField(data: modelFieldListReq): any {
  return axios({
    url: '/ModelField/sortModelField',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function queryModelIndexNum(data): any {
  return axios({
    url: '/Model/queryModelIndexNum',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function queryModelIndexNephogram(data): any {
  return axios({
    url: 'Model/queryModelIndexNephogram',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function queryModelIndexLatest(data): any {
  return axios({
    url: 'Model/queryModelIndexLatest',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function queryModelIndexRate(data): any {
  return axios({
    url: 'Model/queryModelIndexRate',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function queryModelIndexLineChart(data): any {
  return axios({
    url: 'Model/queryModelIndexLineChart',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function queryElementByName(data): any {
  return axios({
    url: 'ModelDataElement/loadDataElementByName',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function queryModelElementByName(data): any {
  return axios({
    url: 'ModelField/loadModelFieldByName',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function queryModelByName(data): any {
  return axios({
    url: 'Model/loadModelByName',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}
