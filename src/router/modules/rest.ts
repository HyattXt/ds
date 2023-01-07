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
const IFrame = () => import('@/views/iframe/index.vue')

// All TSX files under the views folder automatically generate mapping relationship
const modules = import.meta.glob('/src/views/**/**.tsx')
const components: { [key: string]: Component } = utils.mapping(modules)

export default {
  path: '/rest',
  name: 'rest',
  meta: { title: 'rest' },
  redirect: { name: 'rest-manager' },
  component: () => import('@/layouts/content'),
  children: [
    {
      path: '/rest/rest-manager',
      name: 'rest-manager',
      component: () => import('@/views/rest/catalog/list.vue'),
      meta: {
        title: '接口管理-rest-manager',
        activeMenu: 'rest',
        showSide: true,
        auth: []
      }
    },
    {
      path: '/rest/rest-dev',
      name: 'rest-dev',
      component: () => import('@/views/rest/detail/add.vue'),
      meta: {
        title: '接口开发-rest-dev',
        activeMenu: 'rest',
        showSide: true,
        auth: []
      }
    },
    {
      path: '/rest/rest-edit',
      name: 'rest-edit',
      component: () => import('@/views/rest/detail/edit.vue'),
      meta: {
        title: '接口编辑-rest-edit',
        activeMenu: 'rest',
        showSide: true,
        auth: []
      }
    }

  ]
}
