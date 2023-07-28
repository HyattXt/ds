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

import { defineComponent, PropType, onMounted, h } from 'vue'
import { NDataTable, NGrid, NGi, NSpace, NSelect, NTag } from 'naive-ui'

import LineBox from '@/components/chart/modules/LineBox'


import Card from '@/components/card'
import type { StateTableData, StateChartData } from '../types'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const props = {
  title: {
    type: String as PropType<string>
  },
  date: {
    type: Array as PropType<Array<any>>
  },
  RunSelect: {},
  AssentsSelect: {},
  RunErrorSelectCurrent: {},
  ApiSelectCurrent: {},
  AssentsSelectCurrent: {},
  loadingRef: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  ApiTop10Data: {},
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

      <Card title={' '} style={{ minHeight: '1820px' }}>
        {{
          default: () => (

            <NGrid x-gap={12} cols={2} >
              <NGi span={2}>
                <Card title={'基础概况'} style={{ height: '20vh' }}>

                  <NSpace justify="space-between">
                    <Card
                      // loading={loadingRef}
                      title=''
                      embedded
                      style={{ width: '20vh' }}
                      // data={tablecount}
                      // striped
                      size={'medium'}
                    >
                      <span role="img" class="anticon" style="font-size: 14px;"><svg width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false" class=""><title>Icon / ZongshuSolid</title><desc>Created with Sketch.</desc><g id="Icon-/-ZongshuSolid" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="zongshuSolid" fill-rule="nonzero"><circle id="Oval" fill="#9171EE" cx="10" cy="10" r="10"></circle><path d="M14.75,14.01 L14.05,14.01 L14.05,10.75 C14.05,10.3357864 13.7142136,10 13.3,10 C12.8857864,10 12.55,10.3357864 12.55,10.75 L12.55,14 L10.815,14 L10.815,7.25 C10.815,6.83578644 10.4792136,6.5 10.065,6.5 C9.65078644,6.5 9.315,6.83578644 9.315,7.25 L9.315,14 L7.585,14 L7.585,4.75 C7.585,4.33578644 7.24921356,4 6.835,4 C6.42078644,4 6.085,4.33578644 6.085,4.75 L6.085,14 L5.25,14 C4.83578644,14 4.5,14.3357864 4.5,14.75 C4.5,15.1642136 4.83578644,15.5 5.25,15.5 L14.75,15.5 C15.1642136,15.5 15.5,15.1642136 15.5,14.75 C15.5,14.3357864 15.1642136,14 14.75,14 L14.75,14.01 Z" id="Path" fill="#FFFFFF"></path></g></g></svg></span>
                      数据源总数
                      <div> {AssetOverviewData[0]} </div>
                    </Card>
                    <Card
                      // loading={loadingRef}
                      title=''
                      embedded
                      style={{ width: '20vh' }}
                      // data={tablecount}
                      // striped
                      size={'medium'}
                    >
                      <span role="img" class="anticon" style="font-size: 14px;"><svg width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false" class=""><title>Icon / ZongshuSolid</title><desc>Created with Sketch.</desc><g id="Icon-/-ZongshuSolid" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="zongshuSolid" fill-rule="nonzero"><circle id="Oval" fill="#9171EE" cx="10" cy="10" r="10"></circle><path d="M14.75,14.01 L14.05,14.01 L14.05,10.75 C14.05,10.3357864 13.7142136,10 13.3,10 C12.8857864,10 12.55,10.3357864 12.55,10.75 L12.55,14 L10.815,14 L10.815,7.25 C10.815,6.83578644 10.4792136,6.5 10.065,6.5 C9.65078644,6.5 9.315,6.83578644 9.315,7.25 L9.315,14 L7.585,14 L7.585,4.75 C7.585,4.33578644 7.24921356,4 6.835,4 C6.42078644,4 6.085,4.33578644 6.085,4.75 L6.085,14 L5.25,14 C4.83578644,14 4.5,14.3357864 4.5,14.75 C4.5,15.1642136 4.83578644,15.5 5.25,15.5 L14.75,15.5 C15.1642136,15.5 15.5,15.1642136 15.5,14.75 C15.5,14.3357864 15.1642136,14 14.75,14 L14.75,14.01 Z" id="Path" fill="#FFFFFF"></path></g></g></svg></span>
                      数据表总数

                      <div>{AssetOverviewData[1]}</div >
                    </Card>
                    <Card
                      // loading={loadingRef}
                      title=''
                      embedded
                      style={{ width: '20vh' }}
                      // data={tablecount}
                      // striped
                      size={'medium'}
                    >
                      <span role="img" class="anticon" style="font-size: 14px;"><svg width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false" class=""><title>Icon / ZongshuSolid</title><desc>Created with Sketch.</desc><g id="Icon-/-ZongshuSolid" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="zongshuSolid" fill-rule="nonzero"><circle id="Oval" fill="#9171EE" cx="10" cy="10" r="10"></circle><path d="M14.75,14.01 L14.05,14.01 L14.05,10.75 C14.05,10.3357864 13.7142136,10 13.3,10 C12.8857864,10 12.55,10.3357864 12.55,10.75 L12.55,14 L10.815,14 L10.815,7.25 C10.815,6.83578644 10.4792136,6.5 10.065,6.5 C9.65078644,6.5 9.315,6.83578644 9.315,7.25 L9.315,14 L7.585,14 L7.585,4.75 C7.585,4.33578644 7.24921356,4 6.835,4 C6.42078644,4 6.085,4.33578644 6.085,4.75 L6.085,14 L5.25,14 C4.83578644,14 4.5,14.3357864 4.5,14.75 C4.5,15.1642136 4.83578644,15.5 5.25,15.5 L14.75,15.5 C15.1642136,15.5 15.5,15.1642136 15.5,14.75 C15.5,14.3357864 15.1642136,14 14.75,14 L14.75,14.01 Z" id="Path" fill="#FFFFFF"></path></g></g></svg></span>
                      数据存储量(MB)
                      <div>{AssetOverviewData[2]}</div >
                    </Card>
                    <Card
                      // loading={loadingRef}
                      title=''
                      embedded
                      style={{ width: '20vh' }}
                      // data={tablecount}
                      // striped
                      size={'medium'}
                    >
                      <span role="img" class="anticon" style="font-size: 14px;"><svg width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false" class=""><title>Icon / ZongshuSolid</title><desc>Created with Sketch.</desc><g id="Icon-/-ZongshuSolid" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="zongshuSolid" fill-rule="nonzero"><circle id="Oval" fill="#9171EE" cx="10" cy="10" r="10"></circle><path d="M14.75,14.01 L14.05,14.01 L14.05,10.75 C14.05,10.3357864 13.7142136,10 13.3,10 C12.8857864,10 12.55,10.3357864 12.55,10.75 L12.55,14 L10.815,14 L10.815,7.25 C10.815,6.83578644 10.4792136,6.5 10.065,6.5 C9.65078644,6.5 9.315,6.83578644 9.315,7.25 L9.315,14 L7.585,14 L7.585,4.75 C7.585,4.33578644 7.24921356,4 6.835,4 C6.42078644,4 6.085,4.33578644 6.085,4.75 L6.085,14 L5.25,14 C4.83578644,14 4.5,14.3357864 4.5,14.75 C4.5,15.1642136 4.83578644,15.5 5.25,15.5 L14.75,15.5 C15.1642136,15.5 15.5,15.1642136 15.5,14.75 C15.5,14.3357864 15.1642136,14 14.75,14 L14.75,14.01 Z" id="Path" fill="#FFFFFF"></path></g></g></svg></span>

                      数据表记录数
                      <div>{AssetOverviewData[3]}</div >
                    </Card>
                    <Card
                      // loading={loadingRef}
                      title=''
                      embedded
                      style={{ width: '20vh' }}
                      // data={tablecount}
                      // striped
                      size={'medium'}
                    >
                      <span role="img" class="anticon" style="font-size: 14px;"><svg width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false" class=""><title>Icon / ZongshuSolid</title><desc>Created with Sketch.</desc><g id="Icon-/-ZongshuSolid" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="zongshuSolid" fill-rule="nonzero"><circle id="Oval" fill="#9171EE" cx="10" cy="10" r="10"></circle><path d="M14.75,14.01 L14.05,14.01 L14.05,10.75 C14.05,10.3357864 13.7142136,10 13.3,10 C12.8857864,10 12.55,10.3357864 12.55,10.75 L12.55,14 L10.815,14 L10.815,7.25 C10.815,6.83578644 10.4792136,6.5 10.065,6.5 C9.65078644,6.5 9.315,6.83578644 9.315,7.25 L9.315,14 L7.585,14 L7.585,4.75 C7.585,4.33578644 7.24921356,4 6.835,4 C6.42078644,4 6.085,4.33578644 6.085,4.75 L6.085,14 L5.25,14 C4.83578644,14 4.5,14.3357864 4.5,14.75 C4.5,15.1642136 4.83578644,15.5 5.25,15.5 L14.75,15.5 C15.1642136,15.5 15.5,15.1642136 15.5,14.75 C15.5,14.3357864 15.1642136,14 14.75,14 L14.75,14.01 Z" id="Path" fill="#FFFFFF"></path></g></g></svg></span>
                      API服务数
                      <div>{AssetOverviewData[4]}</div >
                    </Card>

                  </NSpace>
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
                <Card style={{ height: '60vh' }}>
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


          ),
          'header-extra': () => (
            <NSpace>

              <NSelect
                size='small'
                value={AssentsSelectCurrent}
                defaultValue='近7天'
                options={AssentsSelect}
                style="width:150px;border: none; outline: none;"
                onUpdateValue={onUpdategetAssetOverviewLineData}
              />
            </NSpace>
          )
        }
        }
      </Card >
    )
  }
})

export default StateCard
