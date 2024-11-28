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

interface ListReq {
  pageNum: number
  pageSize: number
  apiTreeId: number
  chineseName?: string
  startTime?: string
  endTime?: string
  tableType?: string
  dataElementName?: string
}

interface modelTreeReq {
  parentId: number,
  titleName: string,
  type: number,
  projectCode: string
}

interface modelTreeId {
  id: number
}

interface modelTreeUpdateReq extends modelTreeId {
  titleName: string
}

interface modelReq {
  chineseName: string,
  englishName: string,
  tableType: number,
  treeId: string
}

interface dataElementReq {
  chineseName: string,
  englishName: string,
  dataType: string,
  dataDefinition: string,
  dataElementClass: string,
  dataElementAlias: string,
  dataElementCaliber: string,
  updateFrequency: string,
  company: string,
  dataElementDimension: string,
  dataElementVersion: string,
  dataElementSourceTable: string,
  dataElementCreator: string,
  dataElementMaintainer: string,
  dataElementRemarks: string,
  dataElementStandardType: string,
  dataElementAddPeople: string,
  fieldLength: string,
  fieldAccuracy: string,
  treeId: string,
}

interface releaseReq {
  releaseStatus: boolean,
  id: number
}

interface modelTableReq {
  sqlStr: string,
}

interface modelColumnReq {
  modelId: number,
  pageNum: number,
  pageSize: number,
  chineseName?: string,
  startTime?: string,
  endTime?: string
}

interface createModelColumnReq {
  fieldLength: number,
  fieldAccuracy: number,
  dataType: string,
  chineseName: string,
  englishName: string,
  modelId: number,
  id?: number
}

interface modelFieldListReq {
  modelFieldList: createModelColumnReq[],
  modelId: number
}

export { ListReq, modelReq, modelTreeUpdateReq, modelTreeId, modelTreeReq, releaseReq, dataElementReq, modelTableReq, modelColumnReq, createModelColumnReq, modelFieldListReq }
