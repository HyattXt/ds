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
  path: '/data-examine',
  name: 'data-examine',
  meta: { title: 'data-examine' },
  redirect: { name: 'data-examine-list' },
  component: () => import('@/layouts/content'),
  children: [
    {
      path: '/data-examine/examine-list',
      name: 'data-examine-list',
      component: () => import('@/views/examine/list/index.vue'),
      meta: {
        title: '全部审批-data-examine-list',
        activeMenu: 'data-examine',
        showSide: true,
        auth: []
      }
    },
    {
      path: '/data-examine/my-examine',
      name: 'data-my-examine',
      component: () => import('@/views/examine/my-examine/index.vue'),
      meta: {
        title: '我的审批-data-my-examine',
        activeMenu: 'data-examine',
        showSide: true,
        auth: []
      }
    },
    {
      path: '/data-examine/already-examine',
      name: 'data-already-examine',
      component: () => import('@/views/examine/already-examine/index.vue'),
      meta: {
        title: '我已审批-data-already-examine',
        activeMenu: 'data-examine',
        showSide: true,
        auth: []
      }
    },
    {
      path: '/data-examine/examine-detail',
      name: 'examine-detail',
      component: () => import('@/views/examine/my-examine/detail.vue'),
      meta: {
        title: '审批明细-examine-detail',
        activeMenu: 'data-examine',
        showSide: true,
        auth: []
      }
    },
    {
      path: '/data-examine/my-approval',
      name: 'data-my-approval',
      component: () => import('@/views/examine/my-approval/index.vue'),
      meta: {
        title: '我的申请-data-my-approval',
        activeMenu: 'data-examine',
        showSide: true,
        auth: []
      }
    },
    {
      path: '/data-examine/approve-set',
      name: 'data-approve-set',
      component: () => import('@/views/examine/approve-set/index.vue'),
      meta: {
        title: '审批配置-data-approve-set',
        activeMenu: 'data-examine',
        showSide: true,
        auth: []
      }
    },
  ]
}
