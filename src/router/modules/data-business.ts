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
  path: '/data-business',
  name: 'data-business',
  meta: { title: 'data-business' },
  redirect: { name: 'property' },
  component: () => import('@/layouts/content'),
  children: [
    {
      path: '/data-business/property',
      name: 'property',
      component: () => import('@/views/iframe/index.vue'),
      meta: {
        title: '资产列表',
        activeMenu: 'data-business',
        frameSrc: window.webConfig.VITE_APP_PROD_BUSINESS_URL+'/#/data/property',
        showSide: true,
        auth: []
      }
    },
    {
      path: '/data-business/dataTags',
      name: 'dataTags',
      component: () => import('@/views/iframe/index.vue'),
      meta: {
        title: '标签列表',
        activeMenu: 'data-business',
        frameSrc: window.webConfig.VITE_APP_PROD_BUSINESS_URL+'/#/dataTags/index',
        showSide: true,
        auth: []
      }
    },
    {
      path: '/data-business/userGroup',
      name: 'userGroup',
      component: () => import('@/views/iframe/index.vue'),
      meta: {
        title: '群组列表',
        activeMenu: 'data-business',
        frameSrc: window.webConfig.VITE_APP_PROD_BUSINESS_URL+'/#/userGroup/index',
        showSide: true,
        auth: []
      }
    },
    {
      path: '/data-business/customAnalyse',
      name: 'customAnalyse',
      component: () => import('@/views/iframe/index.vue'),
      meta: {
        title: '自定义场景',
        activeMenu: 'data-business',
        frameSrc: window.webConfig.VITE_APP_PROD_BUSINESS_URL+'/#/customAnalyse/index',
        showSide: true,
        auth: []
      }
    },
    {
      path: '/data-business/userPortrayal',
      name: 'userPortrayal',
      component: () => import('@/views/iframe/index.vue'),
      meta: {
        title: '用户画像',
        activeMenu: 'data-business',
        frameSrc: window.webConfig.VITE_APP_PROD_BUSINESS_URL+'/#/userPortrayal/index',
        showSide: true,
        auth: []
      }
    },
    {
      path: '/data-business/label/examine-list',
      name: 'label-examine-list',
      component: () => import('@/views/label/examine/list/index.vue'),
      meta: {
        title: '全部审批-label-examine-list',
        activeMenu: 'data-business',
        showSide: true,
        auth: []
      }
    },
    {
      path: '/data-business/label/my-examine',
      name: 'label-my-examine',
      component: () => import('@/views/label/examine/my-examine/index.vue'),
      meta: {
        title: '我的审批-label-my-examine',
        activeMenu: 'data-business',
        showSide: true,
        auth: []
      }
    },
    {
      path: '/data-business/label/already-examine',
      name: 'label-already-examine',
      component: () => import('@/views/label/examine/already-examine/index.vue'),
      meta: {
        title: '我已审批-label-already-examine',
        activeMenu: 'data-business',
        showSide: true,
        auth: []
      }
    },
    {
      path: '/data-business/label/examine-detail',
      name: 'examine-detail',
      component: () => import('@/views/label/examine/my-examine/detail.vue'),
      meta: {
        title: '审批明细-examine-detail',
        activeMenu: 'data-business',
        showSide: true,
        auth: []
      }
    },
    {
      path: '/data-business/label/my-approval',
      name: 'label-my-approval',
      component: () => import('@/views/label/examine/my-approval/index.vue'),
      meta: {
        title: '我的申请-label-my-approval',
        activeMenu: 'data-business',
        showSide: true,
        auth: []
      }
    },
    {
      path: '/data-business/label/approve-set',
      name: 'label-approve-set',
      component: () => import('@/views/label/examine/approve-set/index.vue'),
      meta: {
        title: '审批配置-label-approve-set',
        activeMenu: 'data-business',
        showSide: true,
        auth: []
      }
    },
  ]
}
