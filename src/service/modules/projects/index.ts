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
  ProjectsReq,
  UserIdReq,
  UpdateProjectsReq,
  TreeMenuReq,
  TreeMenuCreate,
  TreeMenuRename,
  WorkflowRename,
  FolderMove, FolderDel, WorkflowMove
} from './types'

export function queryProjectListPaging(params: ListReq): any {
  return axios({
    url: '/projects',
    method: 'get',
    params
  })
}

export function createProject(data: ProjectsReq): any {
  return axios({
    url: '/projects',
    method: 'post',
    data
  })
}

export function queryAuthorizedProject(params: UserIdReq): any {
  return axios({
    url: '/projects/authed-project',
    method: 'get',
    params
  })
}

export function queryProjectCreatedAndAuthorizedByUser(): any {
  return axios({
    url: '/projects/created-and-authed',
    method: 'get'
  })
}

export function queryAllProjectList(): any {
  return axios({
    url: '/projects/list',
    method: 'get'
  })
}

export function queryUnauthorizedProject(params: UserIdReq): any {
  return axios({
    url: '/projects/unauth-project',
    method: 'get',
    params
  })
}

export function queryProjectByCode(code: number): any {
  return axios({
    url: `/projects/${code}`,
    method: 'get'
  })
}

export function updateProject(data: UpdateProjectsReq, code: number): any {
  return axios({
    url: `/projects/${code}`,
    method: 'put',
    data
  })
}

export function deleteProject(code: number): any {
  return axios({
    url: `/projects/${code}`,
    method: 'delete'
  })
}

export function queryTreeMenu(data: TreeMenuReq): any {
  return axios({
    url: '/tree/getTreeAll',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function queryTreeFolder(data: TreeMenuReq): any {
  return axios({
    url: '/tree/getTreeFloder',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function createTreeMenu(data: TreeMenuCreate): any {
  return axios({
    url: '/tree/insert',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}

export function renameTreeMenu(code: number,data: TreeMenuRename): any {
  return axios({
    url: `/projects/${code}/process-definition/folderRename`,
    method: 'post',
    data
  })
}

export function renameWorkflow(code: number,data: WorkflowRename): any {
  return axios({
    url: `/projects/${code}/process-definition/rename`,
    method: 'post',
    data
  })
}

export function moveFolder(code: number,data: FolderMove): any {
  return axios({
    url: `/projects/${code}/process-definition/folderMove`,
    method: 'post',
    data
  })
}

export function moveWorkflow(code: number,data: WorkflowMove): any {
  return axios({
    url: `/projects/${code}/process-definition/move`,
    method: 'post',
    data
  })
}

export function delFolder(data: FolderDel): any {
  return axios({
    url: `/tree/delete`,
    method: 'delete',
    data,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: (params) => JSON.stringify(params)
  })
}
