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
  pageNo: number
  pageSize: number
  searchVal?: string
}

interface ProjectsReq {
  description?: string
  projectName: string
}

interface UserIdReq {
  userId?: number
}

interface UpdateProjectsReq extends ProjectsReq {
  userName?: string
}

interface ProjectList {
  id: number
  userId: number
  userName: string
  code: any
  name: string
  description: string
  createTime: string
  updateTime: string
  perm: number
  defCount: number
  instRunningCount: number
}

interface ProjectRes {
  totalList: ProjectList[]
  total: number
  totalPage: number
  pageSize: number
  currentPage: number
  start: number
}

interface TreeMenuReq {
  projectCode: number
}

interface TreeMenuList {
  titleName: string,
  taskCode: string,
  id: number,
  parentId: number,
  children: []
}

interface TreeMenuCreate {
  parentId: number,
  titleName: string,
  type: number
  projectCode:string
}

interface TreeMenuRename {
  id: number,
  name: string
}

interface WorkflowRename {
  taskCode: number,
  name: string
}

interface FolderMove {
  parentId: number,
  id: number
}

interface WorkflowMove {
  taskCode: number,
  parentId: number
}

interface FolderDel {
  id: number
}

export {
  ListReq,
  ProjectsReq,
  UserIdReq,
  UpdateProjectsReq,
  ProjectRes,
  ProjectList,
  TreeMenuReq,
  TreeMenuList,
  TreeMenuCreate,
  TreeMenuRename,
  WorkflowRename,
  FolderMove,
  WorkflowMove,
  FolderDel
}
