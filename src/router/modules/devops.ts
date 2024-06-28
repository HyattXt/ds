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

import type { Component } from 'vue'
import utils from '@/utils'
//import { useTaskState } from '@/views/devops/use-task-state'
import { useAsyncState } from '@vueuse/core'
import { queryUnauthorizedProject, getDataByProjectCodeAndDate, getStatisticsDataByProjectCodeAndDate } from '@/service/modules/devops-analysis'

const IFrame = () => import('@/views/iframe/index.vue')

// All TSX files under the views folder automatically generate mapping relationship
const modules = import.meta.glob('/src/views/**/**.tsx')

const components: { [key: string]: Component } = utils.mapping(modules)

export default {
    path: '/devops',
    name: 'devops',
    meta: { title: 'devops' },
    redirect: { name: 'devops-overview' },
    component: () => import('@/layouts/content'),
    children: [
        {
            path: '/devops/:projectCode/devops_overview',
            name: 'devops-overview',
            component: components['devops'],
            meta: {
                title: '首页',
                activeMenu: 'devops',
                showSide: true,
                auth: []
            }

        },
        {
            path: '/devops/:projectCode/task/instances',
            name: 'devops-task-instance',
            component: components['projects-task-instance'],
            meta: {
                title: '任务实例',
                activeMenu: 'devops',
                showSide: true,
                auth: []
            }
        }
        ,
        {
            path: '/devops/:projectCode/workflow/instances',
            name: 'devops-workflow-instance-list',
            component: components['projects-workflow-instance'],
            meta: {
                title: '工作流实例',
                activeMenu: 'devops',
                showSide: true,
                auth: []
            }
        },
        {
            path: '/devops/:projectCode/workflow-definition',
            name: 'devops_workflow-definition-list',
            component: components['projects-workflow-definition'],
            meta: {
                title: '工作流管理',
                activeMenu: 'devops',
                showSide: true,
                auth: []
            }
        },
        {
            path: '/devops/service/api-manager',
            name: 'devops-api-manager',
            component: () => import('@/views/api/api-manager/list/index.vue'),
            meta: {
                title: '服务开发-api-manager',
                activeMenu: 'devops',//service
                showSide: true,
                auth: []
            }
        },
        {
            path: '/devops/rest/rest-manager',
            name: 'devops-rest-manager',
            component: () => import('@/views/rest/catalog/list.vue'),
            meta: {
                title: '接口管理-rest-manager',
                activeMenu: 'devops', //rest
                showSide: true,
                auth: []
            }
        },
        {
            path: '/devops/rest/rest-dev',
            name: 'devops-rest-dev',
            component: () => import('@/views/rest/detail/add.vue'),
            meta: {
                title: '接口开发-rest-dev',
                activeMenu: 'devops',
                showSide: true,
                activeSide: '/devops/rest/rest-manager',
                auth: []
            }
        },
        {
            path: '/devops/rest/rest-edit',
            name: 'devops-rest-edit',
            component: () => import('@/views/rest/detail/edit.vue'),
            meta: {
                title: '接口编辑-rest-edit',
                activeMenu: 'devops',
                showSide: true,
                activeSide: '/devops/rest/rest-manager',
                auth: []
            }
        },
        {
            path: '/devops/security/alarm-instance-manage',
            name: 'devops-alarm-instance-manage',
            component: components['security-alarm-instance-manage'],
            meta: {
                title: '告警实例管理',
                activeMenu: 'devops',
                showSide: true,
                auth: ['ADMIN_USER']
            }
        }
    ]
}

