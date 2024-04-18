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

import {defineComponent, PropType} from 'vue'
import { NDataTable, NGrid, NGi, NSpace, NSelect } from 'naive-ui'
import LineBox from '@/components/chart/modules/LineBox'
import Card from '@/components/card'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
// @ts-ignore
import CrudHead from "@/components/cue/crud-header.vue"
import {SelectMixedOption} from "naive-ui/lib/select/src/interface";
import {RowData} from "naive-ui/es/data-table/src/interface";

const props = {
  title: {
    type: String as PropType<string>
  },
  date: {
    type: Array as PropType<Array<any>>
  },
  RunSelect: {type: Array as PropType<SelectMixedOption[]>},
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
    const datePickerRange = ref(
      [new Date(new Date().setHours(0, 0, 0, 0)).getTime() - 6 * 24 * 60 * 60 * 1000,
      new Date(new Date().setHours(0, 0, 0, 0)).getTime() + 24 * 60 * 60 * 1000]
    )
    // 在组件挂载时动态生成组件

    return { onUpdategetInterfaceTop10Data, onUpdategetAssetOverviewLineData, t, datePickerRange }
  },

  render() {
    const {
      t,
      RunSelect,
      AssentsSelect,
      ApiSelectCurrent,
      AssentsSelectCurrent,
      ApiTop10Data,
      AssetOverviewData,
      AssetOverviewLineData,
      onUpdategetInterfaceTop10Data,
      onUpdategetAssetOverviewLineData,
      loadingRef,
      datePickerRange
    } = this



    const ApiTop10DataHeader = ref([
      { title: '排名', key: '排名' },
      { title: '接口地址', key: '接口地址' },
      { title: '接口类型', key: '接口类型' },
      { title: '接口访问次数', key: '接口访问次数' },
    ]);
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
                <div style="flex: 1;background-color: #f4f6f9;margin: 0 24px 0 0;padding-top: 16px;padding-left: 16px;padding-bottom: 8px;border-radius: 2px;">
                  <span role="img" class="anticon" style="font-size: 16px; padding-right: 8px">
                    <svg width="25" height="25" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6864"><path d="M512 64C264.704 64 64.256 157.888 64 273.728v476.288C64 865.92 264.576 960 512 960s448-94.08 448-209.984V273.728C959.744 157.888 759.296 64 512 64zM211.008 847.744a35.008 35.008 0 1 1 0-70.016 35.008 35.008 0 0 1 0 70.016z m692.992-165.12a444.736 444.736 0 0 1-51.456 28.16C760.704 753.92 639.68 777.6 512 777.6c-127.68 0-248.704-23.68-340.544-66.752a444.8 444.8 0 0 1-51.456-28.16V613.312c76.416 64.64 223.36 108.224 392 108.224 168.704 0 315.584-43.648 392-108.16v69.248zM176 574.72a35.008 35.008 0 1 1 69.952 0 35.008 35.008 0 0 1-69.952 0z m728-129.664a444.608 444.608 0 0 1-51.456 28.16C760.704 516.288 639.68 539.968 512 539.968c-127.68 0-248.704-23.68-340.544-66.752a444.8 444.8 0 0 1-51.456-28.16V375.744C196.416 440.384 343.36 483.968 512 483.968c168.704 0 315.584-43.648 392-108.16v69.248z" fill="#1296db" p-id="6865"></path></svg>
                  </span>
                  数据源总数
                  <div style="font-size: 24px; "> {AssetOverviewData[0]} </div>
                </div>
                <div style="flex: 1;background-color: #f4f6f9;margin: 0 24px 0 0;padding-top: 16px;padding-left: 16px;padding-bottom: 8px;border-radius: 2px;">
                  <span role="img" class="anticon" style="font-size: 16px; padding-right: 8px">
                    <svg width="25" height="25" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8848"><path d="M0 0h1024v292.608H0z" fill="#1296db" p-id="8849"></path><path d="M0 365.738667h292.608v292.522666H0V365.738667zM0 731.306667h292.608V1024H0V731.392z m365.738667-365.653334h292.522666v292.522667H365.738667V365.738667z m0 365.653334h292.522666V1024H365.738667V731.392zM731.306667 365.738667H1024v292.522666H731.392V365.738667zM731.392 731.392H1024V1024H731.392z" fill="#1296db" p-id="8850"></path></svg>
                  </span>
                  数据表总数
                  <div style="font-size: 24px; ">{AssetOverviewData[1]}</div >
                </div>
                <div style="flex: 1;background-color: #f4f6f9;margin: 0 24px 0 0;padding-top: 16px;padding-left: 16px;padding-bottom: 8px;border-radius: 2px;">
                  <span role="img" class="anticon" style="font-size: 16px; padding-right: 8px">
                    <svg width="25" height="25" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10815"><path d="M446.293333 481.706667c224 0 401.493333-75.093333 401.493334-170.666667v-85.333333c0-97.706667-177.92-170.666667-401.493334-170.666667S44.8 128 44.8 223.573333v85.333334c0 97.706667 178.346667 172.8 401.493333 172.8zM446.293333 820.053333c-154.88 0-309.76-34.56-401.493333-103.253333v79.786667c0 97.706667 178.346667 170.666667 401.493333 170.666666 34.56 0 68.693333 0 102.826667-5.12a354.986667 354.986667 0 0 1-50.346667-145.493333c-17.493333 2.56-34.986667 3.413333-52.48 3.413333zM44.8 464.213333v97.28c0 97.706667 177.92 170.666667 401.493333 170.666667h54.186667a334.506667 334.506667 0 0 1 80.213333-173.653333 1093.12 1093.12 0 0 1-134.4 8.533333c-154.88 0.426667-309.76-33.706667-401.493333-102.826667zM959.146667 612.693333H640c-16.213333 0-22.613333 6.4-22.613333 23.04v279.04c0 16.64 6.4 23.04 22.613333 23.04h317.44c17.92 0 24.32-6.4 24.32-24.746666v-275.626667c1.706667-18.346667-4.693333-24.746667-22.613333-24.746667zM756.48 682.666667h89.6v61.866666h-89.6z m-23.04 232.106666h-90.026667V853.333333h90.026667z m0-85.333333h-90.026667V768h90.026667z m0-83.2h-85.333333a7.68 7.68 0 0 1-6.826667-5.12V682.666667h90.026667z m23.04 23.04h89.6v61.866667h-89.6z m91.306667 147.2h-90.026667V853.333333h90.026667z m112.64 0h-89.6V853.333333h89.6z m0-88.746667s-2.986667 5.12-4.693334 5.12h-85.333333V768h91.306667z m0-79.786666h-89.6V682.666667h89.6zM794.026667 414.293333v79.786667h-76.373334l88.32 113.066667L896 494.08h-76.8V414.293333z m47.786666 105.813334l-35.84 45.226666-35.413333-45.226666z" fill="#1296db" p-id="10816"></path></svg>
                  </span>
                  数据存储量(MB)
                  <div style="font-size: 24px; ">{AssetOverviewData[2]}</div >
                </div >
                <div style="flex: 1;background-color: #f4f6f9;margin: 0 24px 0 0;padding-top: 16px;padding-left: 16px;padding-bottom: 8px;border-radius: 2px;">
                  <span role="img" class="anticon" style="font-size: 16px; padding-right: 8px">
                    <svg width="25" height="25" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12724"><path d="M364.771556 128.284444h290.247111c27.164444 0 49.066667-22.556444 49.066666-50.403555v-27.477333c0-27.875556-22.044444-50.403556-49.066666-50.403556H364.771556c-27.164444 0-49.066667 22.556444-49.066667 50.403556v27.477333c-0.113778 27.875556 21.902222 50.403556 49.066667 50.403555M653.653333 485.319111H322.844444c-28.387556 0-50.915556-23.182222-50.915555-51.399111s22.528-51.370667 50.915555-51.370667h331.946667c28.387556 0 50.915556 23.153778 50.915556 51.370667 0.853333 29.326222-22.641778 51.399111-52.024889 51.399111m-132.124445 222.577778H320.853333c-27.420444 0-49.92-23.182222-49.92-51.399111s22.499556-51.399111 49.92-51.399111h200.675556c27.392 0 49.891556 23.182222 49.891555 51.399111 0.995556 29.212444-21.504 51.399111-49.891555 51.399111M854.442667 67.527111h-82.716445v55.722667c0 39.424-31.203556 71.480889-69.745778 71.480889H312.149333c-38.542222 0-69.745778-32.056889-69.745777-71.480889V67.527111H164.124444C113.208889 67.527111 71.111111 109.795556 71.111111 163.157333v765.212445C71.111111 980.736 112.213333 1024 164.124444 1024h690.204445c52.849778 0 93.013333-42.268444 93.013333-95.630222V163.157333c0.113778-52.337778-41.016889-95.630222-92.899555-95.630222" fill="#1296db" p-id="12725"></path></svg>
                  </span>
                  数据表记录数
                  <div style="font-size: 24px; ">{AssetOverviewData[3]}</div >
                </div >
                <div style="flex: 1;background-color: #f4f6f9;margin: 0 24px 0 0;padding-top: 16px;padding-left: 16px;padding-bottom: 8px;border-radius: 2px;">
                  <span role="img" class="anticon" style="font-size: 16px; padding-right: 8px">
                    <svg width="25" height="25" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14692"><path d="M1021.12 56.064l-53.248-53.184a10.368 10.368 0 0 0-14.272 0l-95.552 95.488A250.048 250.048 0 0 0 717.44 55.296a250.368 250.368 0 0 0-177.6 73.6L411.904 256.832a10.112 10.112 0 0 0 0 14.144l340.992 341.12c1.984 1.984 4.48 2.88 7.168 2.88 2.496 0 5.12-0.96 7.104-2.88l127.936-128a251.392 251.392 0 0 0 30.464-318.208L1021.12 70.4a10.24 10.24 0 0 0 0-14.272V56.064zM595.84 555.584a10.048 10.048 0 0 0-14.208 0L498.176 639.168l-113.344-113.28L468.48 442.048a10.048 10.048 0 0 0 0-14.208l-45.696-45.696a10.112 10.112 0 0 0-14.208 0L324.928 465.92l-53.952-54.016a9.92 9.92 0 0 0-7.104-2.816 10.624 10.624 0 0 0-7.168 2.816L128.896 539.904a251.392 251.392 0 0 0-30.464 318.208L2.944 953.664a10.048 10.048 0 0 0 0 14.208l53.184 53.184c1.984 2.048 4.544 2.944 7.168 2.944a10.368 10.368 0 0 0 7.104-2.88l95.552-95.552c41.536 28.16 90.496 43.136 140.672 43.072a250.24 250.24 0 0 0 177.6-73.6l127.872-127.872a10.048 10.048 0 0 0 0-14.208l-53.952-54.016 83.648-83.712a10.048 10.048 0 0 0 0-14.208l-45.888-45.44z" fill="#1296db" p-id="14693"></path></svg>
                  </span>
                  API服务数
                  <div style="font-size: 24px; ">{AssetOverviewData[4]}</div >
                </div >
              </div>
            </Card>
          </NGi>
          <NGi span={1}>
            <Card title={'数据表总数'} style={{ height: '60vh' }}>
              {AssetOverviewLineData.length > 0 && <LineBox data={AssetOverviewLineData} title='' label='totalTables' />}
            </Card>
          </NGi>
          <NGi span={1}>
            <Card title={'数据存储量'} style={{ height: '60vh' }}>
              {AssetOverviewLineData.length > 0 && <LineBox data={AssetOverviewLineData} title='' label='dataSize' />}
            </Card>
          </NGi>
          <NGi span={1}>
            <Card title={'存储记录数'} style={{ height: '60vh' }}>
              {AssetOverviewLineData.length > 0 && <LineBox data={AssetOverviewLineData} title='' label='totalRecords' />}
            </Card>
          </NGi>
          <NGi span={1}>
            <Card title={'API服务数'} style={{ height: '60vh' }}>
              {AssetOverviewLineData.length > 0 && <LineBox data={AssetOverviewLineData} title='' label='totalApiInterface' />}
            </Card>
          </NGi>
          <NGi span={2}>
            <Card>
              <NSpace justify='space-between' style={{ height: '40px' }}>
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
                  columns={ApiTop10DataHeader.value}
                  data={ApiTop10Data}
                  size='small'
              />

            </Card>
          </NGi>
        </NGrid >
      </div >
    )
  }
})

export default StateCard
