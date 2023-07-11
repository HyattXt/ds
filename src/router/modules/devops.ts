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
// const getProjData = () => {

//     const { state } = useAsyncState(
//         queryUnauthorizedProject({
//             userId: 0
//         }).then(function (res) {
//             console.log(res);

//             const table = res.map((item) => {
//                 return {
//                     label: item.name,
//                     value: item.code,
//                 }
//             });
//             const proj = table[0].value
//             console.log(table);
//             console.log(proj);

//             return { table, proj }
//         }),
//         { table: [] }
//     )

//     return state
// }
//const { getProjData } = useTaskState()
//let projectCode = getProjData()
//console.log(projectCode)
export default {
    path: '/devops',
    name: 'devops',
    meta: { title: 'devops' },
    redirect: { name: 'devops_overview', params: { projectCode: '123' } },
    component: () => import('@/layouts/content'),
    children: [
        {
            path: 'devops_overview/:projectCode',
            name: 'devops_overview',
            component: components['devops'],
            meta: {
                title: '首页',
                activeMenu: 'devops',
                showSide: true,
                auth: []
            }
        }
    ]
}

