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
  redirect: { name: 'assets-overview' },
  component: () => import('@/layouts/content'),
  children: [
    {
      path: '/data-assets/assets-overview',
      name: 'assets-overview',
      component: () => import('@/views/iframe/index.vue'),
      meta: {
        title: '资产总览-assets-overview',
        activeMenu: 'data-assets',
        frameSrc: 'http://192.168.100.68:1124/webroot/decision/view/form?viewlet=%25E5%2585%2583%25E6%2595%25B0%25E6%258D%25AE%25E7%25AE%25A1%25E7%2590%2586%252F%25E7%2595%258C%25E9%259D%25A2%252F%25E6%2595%25B0%25E6%258D%25AE%25E5%259C%25B0%25E5%259B%25BE_%25E5%25AE%259A%25E5%2588%25B6%25E7%2589%2588_V2.frm',
        showSide: true,
        auth: []
      }
    },
    {
      path: '/data-assets/assets-catalog',
      name: 'assets-catalog',
      component: () => import('@/views/data-assets/catalog/index.vue'),
      meta: {
        title: '资产目录-assets-catalog',
        activeMenu: 'data-assets',
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
        auth: []
      }
    }
  ]
}
