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

import {defineComponent, onMounted, PropType} from 'vue'
import { NDataTable, NGrid, NGi, NSpace, NSelect } from 'naive-ui'
import LineBox from '@/components/chart/modules/LineBox'
import Card from '@/components/card'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import CrudHead from "@/components/cue/crud-header.vue"
import {SelectMixedOption} from "naive-ui/lib/select/src/interface";
import {RowData} from "naive-ui/es/data-table/src/interface";
import utils from "@/utils";
import axios from "axios";
import {useUserStore} from "@/store/user/user";
import {queryListUrl} from "@/service/modules/data-bussiness";
import styles from './index.module.scss'

const props = {
  title: {
    type: String as PropType<string>
  },
  date: {
    type: Array as PropType<Array<any>>
  },
  RunSelect: {type: Array },
  AssentsSelect: {type: Array as PropType<SelectMixedOption[]>},
  RunErrorSelectCurrent: {type: String},
  ApiSelectCurrent: {type: String},
  AssentsSelectCurrent: {type: String},
  loadingRef: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  ApiTop10Data: {type: Array as PropType<RowData[]>},
  AssetOverviewData: {
    type: Array,
    default: () => []
  },
  AssetOverviewLineData: {
    type: Array,
    default: () => []
  },
}

const StateCard = defineComponent({
  name: 'StateCard',
  props,
  emits: ['UpdategetInterfaceTop10Data', 'UpdategetAssetOverviewLineData'],
  setup(props, ctx) {

    const onUpdategetInterfaceTop10Data = (top10: any) => {
      ctx.emit('UpdategetInterfaceTop10Data', top10)
    }
    const onUpdategetAssetOverviewLineData = (top10: any) => {
      ctx.emit('UpdategetAssetOverviewLineData', top10)
    }

    const { t } = useI18n()
    const userStore = useUserStore()
    const likeData = ref([])
    const collectData: any = ref([])

    async function initData(likeState: number, collectionState: number) {
      let params = {
        userId: (userStore.getUserInfo as any).id,
        sqlLineageName: '',
        likeState: likeState,
        collectionState: collectionState
      }
      const data = await queryListUrl(params)
      if(likeState) {
        likeData.value = data.totalList
      } else {
        collectData.value = data.totalList
      }
    }

    onMounted( () => {
      initData(1, 0)
      initData(0, 1)
    })

    return { onUpdategetInterfaceTop10Data, onUpdategetAssetOverviewLineData, t, collectData, likeData}
  },

  render() {
    const {
      RunSelect,
      AssentsSelect,
      ApiSelectCurrent,
      AssentsSelectCurrent,
      ApiTop10Data,
      AssetOverviewData,
      AssetOverviewLineData,
      onUpdategetInterfaceTop10Data,
      onUpdategetAssetOverviewLineData,
      collectData,
      likeData
    } = this

    const ApiTop10DataHeader = [
      { title: '排名', key: '排名', width: 60 },
      { title: '接口地址', key: '接口地址' },
      { title: '接口类型', key: '接口类型' },
      { title: '接口访问次数', key: '接口访问次数' },
    ]

    const collectCol = [
      {
        title: '#',
        key: 'key',
        width: 40,
        render: (_: any, index: any) => {
          return `${index + 1}`;
        }
      },
      { title: '表名', key: 'sqlLineageName'},
      { title: '收藏时间', key: 'collectionTime' },
      { title: '收藏数', key: 'totalCollections', width: 100  }
    ]

    const likeCol = [
      {
        title: '#',
        key: 'key',
        width: 40,
        render: (_: any, index: any) => {
          return `${index + 1}`;
        }
      },
      { title: '表名', key: 'sqlLineageName'},
      { title: '点赞时间', key: 'likeTime' },
      { title: '点赞数', key: 'totalLikes', width: 100 },
    ]


    return (

      <div>
        <CrudHead
            title={"资产概览"}
        />
        <div style={"background: #fff; padding: 10px; display: flex; align-items: center"}>
          统计周期:
          <NSelect
              size='small'
              value={AssentsSelectCurrent}
              defaultValue='近7天'
              options={AssentsSelect}
              style="width:150px;border: none; outline: none; margin-left: 10px"
              onUpdateValue={onUpdategetAssetOverviewLineData}
          />
        </div>
        <NGrid x-gap={0} cols={2} >
          <NGi span={2}>
            <Card title={'基础概况'} >
              <div style="display: flex;padding: 10px; height: 90px">
                <div class="hover_div" style="flex: 1;background-color: #f4f6f9;margin: 0 24px 0 0;padding-top: 16px;padding-left: 16px;padding-bottom: 8px;border-radius: 2px;">
                  <span role="img" class="anticon" style="font-size: 16px; padding-right: 8px">
                    <svg width="25" height="25" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" ><path d="M512 64C264.704 64 64.256 157.888 64 273.728v476.288C64 865.92 264.576 960 512 960s448-94.08 448-209.984V273.728C959.744 157.888 759.296 64 512 64zM211.008 847.744a35.008 35.008 0 1 1 0-70.016 35.008 35.008 0 0 1 0 70.016z m692.992-165.12a444.736 444.736 0 0 1-51.456 28.16C760.704 753.92 639.68 777.6 512 777.6c-127.68 0-248.704-23.68-340.544-66.752a444.8 444.8 0 0 1-51.456-28.16V613.312c76.416 64.64 223.36 108.224 392 108.224 168.704 0 315.584-43.648 392-108.16v69.248zM176 574.72a35.008 35.008 0 1 1 69.952 0 35.008 35.008 0 0 1-69.952 0z m728-129.664a444.608 444.608 0 0 1-51.456 28.16C760.704 516.288 639.68 539.968 512 539.968c-127.68 0-248.704-23.68-340.544-66.752a444.8 444.8 0 0 1-51.456-28.16V375.744C196.416 440.384 343.36 483.968 512 483.968c168.704 0 315.584-43.648 392-108.16v69.248z" fill="#1296db" ></path></svg>
                  </span>
                  数据源总数
                  <div style="font-size: 24px; "> {AssetOverviewData[0]} </div>
                </div>
                <div class="hover_div" style="flex: 1;background-color: #f4f6f9;margin: 0 24px 0 0;padding-top: 16px;padding-left: 16px;padding-bottom: 8px;border-radius: 2px;">
                  <span role="img" class="anticon" style="font-size: 16px; padding-right: 8px">
                    <svg width="25" height="25" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" ><path d="M0 0h1024v292.608H0z" fill="#1296db" ></path><path d="M0 365.738667h292.608v292.522666H0V365.738667zM0 731.306667h292.608V1024H0V731.392z m365.738667-365.653334h292.522666v292.522667H365.738667V365.738667z m0 365.653334h292.522666V1024H365.738667V731.392zM731.306667 365.738667H1024v292.522666H731.392V365.738667zM731.392 731.392H1024V1024H731.392z" fill="#1296db" ></path></svg>
                  </span>
                  数据表总数
                  <div style="font-size: 24px; ">{AssetOverviewData[1]}</div >
                </div>
                <div class="hover_div" style="flex: 1;background-color: #f4f6f9;margin: 0 24px 0 0;padding-top: 16px;padding-left: 16px;padding-bottom: 8px;border-radius: 2px;">
                  <span role="img" class="anticon" style="font-size: 16px; padding-right: 8px">
                    <svg width="25" height="25" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" ><path d="M446.293333 481.706667c224 0 401.493333-75.093333 401.493334-170.666667v-85.333333c0-97.706667-177.92-170.666667-401.493334-170.666667S44.8 128 44.8 223.573333v85.333334c0 97.706667 178.346667 172.8 401.493333 172.8zM446.293333 820.053333c-154.88 0-309.76-34.56-401.493333-103.253333v79.786667c0 97.706667 178.346667 170.666667 401.493333 170.666666 34.56 0 68.693333 0 102.826667-5.12a354.986667 354.986667 0 0 1-50.346667-145.493333c-17.493333 2.56-34.986667 3.413333-52.48 3.413333zM44.8 464.213333v97.28c0 97.706667 177.92 170.666667 401.493333 170.666667h54.186667a334.506667 334.506667 0 0 1 80.213333-173.653333 1093.12 1093.12 0 0 1-134.4 8.533333c-154.88 0.426667-309.76-33.706667-401.493333-102.826667zM959.146667 612.693333H640c-16.213333 0-22.613333 6.4-22.613333 23.04v279.04c0 16.64 6.4 23.04 22.613333 23.04h317.44c17.92 0 24.32-6.4 24.32-24.746666v-275.626667c1.706667-18.346667-4.693333-24.746667-22.613333-24.746667zM756.48 682.666667h89.6v61.866666h-89.6z m-23.04 232.106666h-90.026667V853.333333h90.026667z m0-85.333333h-90.026667V768h90.026667z m0-83.2h-85.333333a7.68 7.68 0 0 1-6.826667-5.12V682.666667h90.026667z m23.04 23.04h89.6v61.866667h-89.6z m91.306667 147.2h-90.026667V853.333333h90.026667z m112.64 0h-89.6V853.333333h89.6z m0-88.746667s-2.986667 5.12-4.693334 5.12h-85.333333V768h91.306667z m0-79.786666h-89.6V682.666667h89.6zM794.026667 414.293333v79.786667h-76.373334l88.32 113.066667L896 494.08h-76.8V414.293333z m47.786666 105.813334l-35.84 45.226666-35.413333-45.226666z" fill="#1296db" ></path></svg>
                  </span>
                  数据存储量(MB)
                  <div style="font-size: 24px; ">{AssetOverviewData[2]}</div >
                </div >
                <div class="hover_div" style="flex: 1;background-color: #f4f6f9;margin: 0 24px 0 0;padding-top: 16px;padding-left: 16px;padding-bottom: 8px;border-radius: 2px;">
                  <span role="img" class="anticon" style="font-size: 16px; padding-right: 8px">
                    <svg width="25" height="25" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" ><path d="M364.771556 128.284444h290.247111c27.164444 0 49.066667-22.556444 49.066666-50.403555v-27.477333c0-27.875556-22.044444-50.403556-49.066666-50.403556H364.771556c-27.164444 0-49.066667 22.556444-49.066667 50.403556v27.477333c-0.113778 27.875556 21.902222 50.403556 49.066667 50.403555M653.653333 485.319111H322.844444c-28.387556 0-50.915556-23.182222-50.915555-51.399111s22.528-51.370667 50.915555-51.370667h331.946667c28.387556 0 50.915556 23.153778 50.915556 51.370667 0.853333 29.326222-22.641778 51.399111-52.024889 51.399111m-132.124445 222.577778H320.853333c-27.420444 0-49.92-23.182222-49.92-51.399111s22.499556-51.399111 49.92-51.399111h200.675556c27.392 0 49.891556 23.182222 49.891555 51.399111 0.995556 29.212444-21.504 51.399111-49.891555 51.399111M854.442667 67.527111h-82.716445v55.722667c0 39.424-31.203556 71.480889-69.745778 71.480889H312.149333c-38.542222 0-69.745778-32.056889-69.745777-71.480889V67.527111H164.124444C113.208889 67.527111 71.111111 109.795556 71.111111 163.157333v765.212445C71.111111 980.736 112.213333 1024 164.124444 1024h690.204445c52.849778 0 93.013333-42.268444 93.013333-95.630222V163.157333c0.113778-52.337778-41.016889-95.630222-92.899555-95.630222" fill="#1296db" ></path></svg>
                  </span>
                  数据表记录数
                  <div style="font-size: 24px; ">{AssetOverviewData[3]}</div >
                </div >
                <div class="hover_div" style="flex: 1;background-color: #f4f6f9;margin: 0 24px 0 0;padding-top: 16px;padding-left: 16px;padding-bottom: 8px;border-radius: 2px;">
                  <span role="img" class="anticon" style="font-size: 16px; padding-right: 8px">
                    <svg width="25" height="25" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" ><path d="M1021.12 56.064l-53.248-53.184a10.368 10.368 0 0 0-14.272 0l-95.552 95.488A250.048 250.048 0 0 0 717.44 55.296a250.368 250.368 0 0 0-177.6 73.6L411.904 256.832a10.112 10.112 0 0 0 0 14.144l340.992 341.12c1.984 1.984 4.48 2.88 7.168 2.88 2.496 0 5.12-0.96 7.104-2.88l127.936-128a251.392 251.392 0 0 0 30.464-318.208L1021.12 70.4a10.24 10.24 0 0 0 0-14.272V56.064zM595.84 555.584a10.048 10.048 0 0 0-14.208 0L498.176 639.168l-113.344-113.28L468.48 442.048a10.048 10.048 0 0 0 0-14.208l-45.696-45.696a10.112 10.112 0 0 0-14.208 0L324.928 465.92l-53.952-54.016a9.92 9.92 0 0 0-7.104-2.816 10.624 10.624 0 0 0-7.168 2.816L128.896 539.904a251.392 251.392 0 0 0-30.464 318.208L2.944 953.664a10.048 10.048 0 0 0 0 14.208l53.184 53.184c1.984 2.048 4.544 2.944 7.168 2.944a10.368 10.368 0 0 0 7.104-2.88l95.552-95.552c41.536 28.16 90.496 43.136 140.672 43.072a250.24 250.24 0 0 0 177.6-73.6l127.872-127.872a10.048 10.048 0 0 0 0-14.208l-53.952-54.016 83.648-83.712a10.048 10.048 0 0 0 0-14.208l-45.888-45.44z" fill="#1296db" ></path></svg>
                  </span>
                  API服务数
                  <div style="font-size: 24px; ">{AssetOverviewData[4]}</div >
                </div >
              </div>
            </Card>
          </NGi>
          <NGi span={1}>
            <Card style={{height: '300px'}}>
              <NSpace justify='space-between' style={{height: '40px'}}>
                <p style="font-size:16px;">我的收藏</p>
                <router-link to="/data-assets/assets-catalog?type=collect&back=true"
                             style={{'text-decoration': 'none', 'color': '#0974f1'}}>
                  更多 &gt;
                </router-link>
              </NSpace>
              <div style={{height: '260px', 'overflow-y': 'auto'}} class={styles['scrollable-div']}>
                {
                  collectData.map((item: any) =>
                      <div style="padding: 16px; border-bottom: 1px solid rgb(240, 240, 240);"
                           class={styles['ant-card-body']}>
                        <div class={[styles.FBH, styles.mb8]}>
                          <svg style="position: relative; top: 2px" class="icon" viewBox="0 0 1024 1024" version="1.1"
                               xmlns="http://www.w3.org/2000/svg" p-id="7015" width="20" height="20">
                            <path
                                d="M102.4 179.2a76.8 76.8 0 0 1 76.8-76.8h665.6a76.8 76.8 0 0 1 76.8 76.8v665.6a76.8 76.8 0 0 1-76.8 76.8H179.2a76.8 76.8 0 0 1-76.8-76.8V179.2z"
                                fill="#1677FF" p-id="7016"></path>
                            <path
                                d="M102.4 332.8a76.8 76.8 0 0 1 76.8-76.8h665.6a76.8 76.8 0 0 1 76.8 76.8v512a76.8 76.8 0 0 1-76.8 76.8H179.2a76.8 76.8 0 0 1-76.8-76.8V332.8z"
                                fill="#FFFFFF" fill-opacity=".35" p-id="7017"></path>
                            <path d="M332.8 256h358.4v51.2H332.8v-51.2z" fill="#FFFFFF" p-id="7018"></path>
                            <path
                                d="M320 588.8V384h-51.2v204.8H102.4v51.2h166.4v281.6h51.2V640h166.4v281.6h51.2V640h166.4v281.6h51.2V640h166.4v-51.2H320z"
                                fill="#FFFFFF" p-id="7019"></path>
                          </svg>
                          <div class={[styles.FBH, styles.FBJB, styles.FB1]}>
                    <span class={[styles.color65, styles.pr16, styles.omit, styles.ml8]}
                          style="width: 220px;">{item.sqlLineageName}</span>
                            <span class={[styles.color45, styles.nowrap]}>{'收藏时间: ' + item.collectionTime}</span>
                          </div>
                        </div>
                        <div>
                          <div class={[styles.FBH, styles.FBJB, styles.FBAC]}>
                            <div style="height: 22px; overflow: hidden; padding-right: 160px;"></div>
                            <div class="color45 nowrap mb4 FBH FBAC">
                              <svg style="position: relative; top: 2px" class="icon" viewBox="0 0 1024 1024"
                                   xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                                <path
                                    d="M335.008 916.629333c-35.914667 22.314667-82.88 10.773333-104.693333-25.557333a77.333333 77.333333 0 0 1-8.96-57.429333l46.485333-198.24a13.141333 13.141333 0 0 0-4.021333-12.864l-152.16-132.586667c-31.605333-27.52-35.253333-75.648-8.234667-107.733333a75.68 75.68 0 0 1 51.733333-26.752L354.848 339.2c4.352-0.362667 8.245333-3.232 10.026667-7.594667l76.938666-188.170666c16.032-39.2 60.618667-57.92 99.52-41.461334a76.309333 76.309333 0 0 1 40.832 41.461334l76.938667 188.16c1.781333 4.373333 5.674667 7.253333 10.026667 7.605333l199.712 16.277333c41.877333 3.413333 72.885333 40.458667 69.568 82.517334a76.938667 76.938667 0 0 1-26.08 51.978666l-152.16 132.586667c-3.541333 3.082667-5.141333 8.074667-4.021334 12.853333l46.485334 198.24c9.621333 41.013333-15.36 82.336-56.138667 92.224a75.285333 75.285333 0 0 1-57.525333-9.237333l-170.976-106.24a11.296 11.296 0 0 0-12.010667 0l-170.986667 106.24z"
                                    fill="#bfbfbf"></path>
                              </svg>
                              <span style="padding-left: 4px">{item.totalCollections}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                  )
                }
              </div>
            </Card>
          </NGi>
          <NGi span={1}>
            <Card style={{height: '300px'}}>
              <NSpace justify='space-between' style={{height: '40px'}}>
                <p style="font-size:16px;">我的点赞</p>
                <router-link to="/data-assets/assets-catalog?type=like&back=true"
                             style={{'text-decoration': 'none', 'color': '#0974f1'}}>
                  更多 &gt;
                </router-link>
              </NSpace>
              <div style={{height: '260px', 'overflow-y': 'auto'}} class={styles['scrollable-div']}>
                {
                  likeData.map((item: any) =>
                      <div style="padding: 16px; border-bottom: 1px solid rgb(240, 240, 240);" class={styles['ant-card-body']}>
                        <div class={[styles.FBH, styles.mb8]}>
                          <svg style="position: relative; top: 2px" class="icon" viewBox="0 0 1024 1024" version="1.1"
                               xmlns="http://www.w3.org/2000/svg" p-id="7015" width="20" height="20">
                            <path
                                d="M102.4 179.2a76.8 76.8 0 0 1 76.8-76.8h665.6a76.8 76.8 0 0 1 76.8 76.8v665.6a76.8 76.8 0 0 1-76.8 76.8H179.2a76.8 76.8 0 0 1-76.8-76.8V179.2z"
                                fill="#1677FF" p-id="7016"></path>
                            <path
                                d="M102.4 332.8a76.8 76.8 0 0 1 76.8-76.8h665.6a76.8 76.8 0 0 1 76.8 76.8v512a76.8 76.8 0 0 1-76.8 76.8H179.2a76.8 76.8 0 0 1-76.8-76.8V332.8z"
                                fill="#FFFFFF" fill-opacity=".35" p-id="7017"></path>
                            <path d="M332.8 256h358.4v51.2H332.8v-51.2z" fill="#FFFFFF" p-id="7018"></path>
                            <path
                                d="M320 588.8V384h-51.2v204.8H102.4v51.2h166.4v281.6h51.2V640h166.4v281.6h51.2V640h166.4v281.6h51.2V640h166.4v-51.2H320z"
                                fill="#FFFFFF" p-id="7019"></path>
                          </svg>
                          <div class={[styles.FBH, styles.FBJB, styles.FB1]}>
                            <span class={[styles.color65, styles.pr16, styles.omit, styles.ml8]} style="width: 220px;">{item.sqlLineageName}</span>
                            <span class={[styles.color45, styles.nowrap]}>{'点赞时间: ' + item.likeTime}</span>
                          </div>
                        </div>
                        <div>
                          <div class={[styles.FBH, styles.FBJB, styles.FBAC]}>
                            <div style="height: 22px; overflow: hidden; padding-right: 160px;"></div>
                            <div class="color45 nowrap mb4 FBH FBAC">
                              <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="15" height="15">
                                <path d="M948.4 407.2c-29.2-35.5-76.9-35.5-92.6-35.5H730c10.2-55.2 18.9-119.4 0.2-187.1-12.8-46.6-36.3-79.7-72-101.1-18.7-11.2-38.1-16.9-57.8-16.9-51.8 0-90.6 38.4-96.4 95.7-2.2 21.4-4.2 41.7-9.3 59.1-19 63.9-65.4 112.7-108.3 151.8-16 14.4-33.1 40.2-33.3 69.2-0.6 77.6-0.7 155.5-0.7 235.1l-0.1 141.4c-0.2 47.3 25 85.4 67 101.7 22.2 9 45.7 14 70.1 14.7 38.8 0.5 77.8 0.5 114.3 0.5h56.9c37.2 0 74.4 0 111.8 0.4h1.2c43.5 0 77.7-21.7 93.9-59.5l4.8-11.1c11.3-26 22.9-52.9 30.1-82.8 22-90.9 44.9-188.2 63.4-283.8 7.4-37.9 1.6-68.8-17.4-91.8zM216.1 374.5h-11.9c-56.2 0-101.9 45.7-101.9 101.9v348.4c0 56.2 45.7 101.9 101.9 101.9h11.9c56.2 0 101.9-45.7 101.9-101.9V476.4c0.1-56.2-45.7-101.9-101.9-101.9z" fill="#bfbfbf"></path>
                              </svg>
                              <span style="padding-left: 4px">{item.totalLikes}</span>
                            </div>
                          </div>
                        </div>
                  </div>
                  )
                }
              </div>
            </Card>
          </NGi>
          <NGi span={1}>
            <Card title={'数据表总数'} style={{height: '300px'}}>
              {AssetOverviewLineData.length > 0 && <LineBox data={AssetOverviewLineData} title='' label='totalTables'/>}
            </Card>
          </NGi>
          <NGi span={1}>
            <Card title={'数据存储量'} style={{height: '300px'}}>
              {AssetOverviewLineData.length > 0 && <LineBox data={AssetOverviewLineData} title='' label='dataSize'/>}
            </Card>
          </NGi>
          <NGi span={1}>
            <Card title={'存储记录数'} style={{height: '300px'}}>
              {AssetOverviewLineData.length > 0 &&
                  <LineBox data={AssetOverviewLineData} title='' label='totalRecords'/>}
            </Card>
          </NGi>
          <NGi span={1}>
            <Card title={'API服务数'} style={{height: '300px'}}>
              {AssetOverviewLineData.length > 0 &&
                  <LineBox data={AssetOverviewLineData} title='' label='totalApiInterface'/>}
            </Card>
          </NGi>
          <NGi span={2}>
            <Card>
              <NSpace justify='space-between' style={{height: '40px'}}>
                <p style="font-size:16px;">API调用次数TOP10</p>
                <NSelect
                    size='small'
                    value={ApiSelectCurrent}
                    defaultValue='今天'
                    options={RunSelect}
                    style="width:150px;border: none; outline: none;"
                    onUpdateValue={onUpdategetInterfaceTop10Data}
                />
              </NSpace>
              <NDataTable
                  columns={ApiTop10DataHeader}
                  data={ApiTop10Data}
                  size='small'
                  striped
                  single-line={false}
                  min-height={"150"}
                  max-height={"150"}
              />

            </Card>
          </NGi>
        </NGrid>
      </div>
    )
  }
})

export default StateCard
