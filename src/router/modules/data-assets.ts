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
  path: '/data-assets',
  name: 'data-assets',
  meta: { title: 'data-assets' },
  redirect: { name: 'assets' },
  component: () => import('@/layouts/content'),
  children: [
    {
      path: '/data-assets/assets',
      name: 'assets',
      component: components['data-assets'],
      meta: {
        title: '资产概览',
        activeMenu: 'data-assets',
        showSide: true,
        auth: []
      }
    },
    {
      path: '/data-assets/assets-catalog',
      name: 'assets-catalog',
      component: () => import('@/views/data-assets/catalog/index.vue'),
      meta: {
        title: '全部数据-assets-catalog',
        activeMenu: 'data-assets',
        showSide: true,
        auth: []
      }
    },
    {
      path: '/data-assets/assets-query',
      name: 'assets-query',
      component: () => import('@/views/iframe/index.vue'),
      meta: {
        title: '数据探查-assets-query',
        activeMenu: 'data-assets',
        frameSrc: window.webConfig.VITE_APP_PROD_ASSETS_QUERY_URL,
        showSide: true,
        auth: []
      }
    },
    {
      path: '/data-assets/assets-detail',
      name: 'assets-detail',
      component: () => import('@/views/data-assets/detail/home.vue'),
      meta: {
        title: '资产详情-assets-detail',
        activeMenu: 'data-assets',
        showSide: true,
        activeSide: '/data-assets/assets-catalog',
        auth: []
      }
    },
    {
      path: '/data-assets/assets-classify',
      name: 'assets-classify',
      component: () => import('@/views/data-assets/classify/index.vue'),
      meta: {
        title: '数据编目-assets-classify',
        activeMenu: 'data-assets',
        showSide: true,
        auth: []
      }
    },
    {
      path: '/data-assets/index-center',
      name: 'index-center',
      component: () => import('@/views/data-assets/index/index.vue'),
      meta: {
        title: '指标中心-index-center',
        activeMenu: 'data-assets',
        showSide: true,
        auth: []
      }
    },
    {
      path: '/data-assets/data-standard/data-statistic',
      name: 'data-statistic',
      component: () => import('@/views/data-assets/data-standard/data-statistic/index.vue'),
      meta: {
        title: '标准概览-data-statistic',
        activeMenu: 'data-assets',
        showSide: true,
        auth: []
      }
    },
    {
      path: '/data-assets/data-standard/standard-list',
      name: 'standard-list',
      component: () => import('@/views/data-assets/data-standard/standard-list/index.vue'),
      meta: {
        title: '标准列表-standard-list',
        activeMenu: 'data-assets',
        showSide: true,
        auth: []
      }
    },
    {
      path: '/data-assets/data-standard/model-list',
      name: 'model-list',
      component: () => import('@/views/data-assets/data-standard/model-list/index.vue'),
      meta: {
        title: '模型列表-model-list',
        activeMenu: 'data-assets',
        showSide: true,
        auth: []
      }
    },
    {
      path: '/data-assets/data-standard/model-detail',
      name: 'model-detail',
      component: () => import('@/views/data-assets/data-standard/model-list/detail.vue'),
      meta: {
        title: '模型明细-model-detail',
        activeMenu: 'data-assets',
        activeSide: '/data-assets/data-standard/model-list',
        showSide: true,
        auth: []
      }
    }
  ]
}
