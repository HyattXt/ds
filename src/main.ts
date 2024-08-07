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

import { createApp } from 'vue'
import App from './App'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import i18n from '@/locales'
import * as echarts from 'echarts'
import 'echarts/theme/macarons'
import 'echarts/theme/dark-bold'
import naive from 'naive-ui'
import axios from 'axios'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/styles/default.scss'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)
axios.interceptors.request.use(config => {
    // 为请求头添加x-access-token字段为服务端返回的token
    // @ts-ignore
    config.headers['X-Content-Type-Options'] = 'nosniff'
    // @ts-ignore
    config.headers['X-XSS-Protection'] = '1'
    // @ts-ignore
    config.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self'; frame-ancestors 'self'"
    // return config是固定用法 必须有返回值
    return config
})

app.config.globalProperties.echarts = echarts

axios.interceptors.request.use(config => {
    // 为请求头添加x-access-token字段为服务端返回的token
    // @ts-ignore
    config.headers['X-Content-Type-Options'] = 'nosniff'
    // @ts-ignore
    config.headers['X-XSS-Protection'] = '1'
    // @ts-ignore
    config.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self'; frame-ancestors 'self'"
    // return config是固定用法 必须有返回值
    return config
})


app.use(naive)
app.use(router)
app.use(pinia)
app.use(i18n)
app.use(ElementPlus)
app.mount('#app')
