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

import { defineComponent, PropType } from 'vue'
import { useTable } from '../use-table'
import { NDataTable, NCard, NDatePicker, NGrid, NGi, NSpace, NSelect, NTag } from 'naive-ui'
import ChartLineBox from '@/components/chart/modules/ChartLineBox'
import Card from '@/components/card'
import type { StateTableData, StateChartData } from '../types'
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const props = {
  title: {
    type: String as PropType<string>
  },
  date: {
    type: Array as PropType<Array<any>>
  },
  tableData: {
    type: Array as PropType<Array<StateTableData>>,
    default: () => []
  },
  chartData: {
    type: Array,
    default: () => []
  },
  tablecount: {
    type: Array,
    default: () => []
  },
  ProjSelect: {
    type: Array,
    default: () => []
  },
  ProjFirst: {
  },
  loadingRef: {
    type: Boolean as PropType<boolean>,
    default: false
  }
}

const StateCard = defineComponent({
  name: 'StateCard',
  props,
  emits: ['updateDatePickerValue', 'updateProjPickerValue'],
  setup(props, ctx) {
    const onUpdateDatePickerValue = (dateP: any) => {
      ctx.emit('updateDatePickerValue', dateP)
    }
    const onUpdateProjPickerValue = (val: any) => {
      ctx.emit('updateProjPickerValue', val)
    }
    const { t } = useI18n()
    const datePickerRange = ref(
      [new Date(new Date().setHours(0, 0, 0, 0)).getTime() - 6 * 24 * 60 * 60 * 1000,
      new Date(new Date().setHours(0, 0, 0, 0)).getTime() + 24 * 60 * 60 * 1000]
    )
    return { onUpdateDatePickerValue, onUpdateProjPickerValue, t, datePickerRange }
  },
  render() {
    const {
      t,
      date,
      tableData,
      chartData,
      tablecount,
      ProjSelect,
      ProjFirst,
      onUpdateDatePickerValue,
      onUpdateProjPickerValue,
      loadingRef,
      datePickerRange
    } = this
    const { columnsRef } = useTable()
    console.log(tableData)
    console.log(chartData)
    console.log(tablecount[0])
    console.log(ProjFirst)
    const route = useRoute()
    const ALL = `/devops/${route.params.projectCode}/task/instances?timeRange=${this.datePickerRange}`
    const SUCCESS = `/devops/${route.params.projectCode}/task/instances?stateType=SUCCESS&timeRange=${this.datePickerRange}`
    const FAILURE = `/devops/${route.params.projectCode}/task/instances?stateType=FAILURE&timeRange=${this.datePickerRange}`
    const RUNNING_EXECUTION = `/devops/${route.params.projectCode}/task/instances?stateType=RUNNING_EXECUTION&timeRange=${this.datePickerRange}`
    const STOP = `/devops/${route.params.projectCode}/task/instances?stateType=STOP&timeRange=${this.datePickerRange}`
    const PAUSE = `/devops/${route.params.projectCode}/task/instances?stateType=PAUSE&timeRange=${this.datePickerRange}`


    return (

      <Card title={' '} style={{ height: '80vh' }}>
        {{
          default: () => (

            <NGrid x-gap={12} cols={1}>
              <NGi>
                <Card title={'任务状态统计'} style={{ height: '20vh' }}>

                  <NSpace justify="space-between">
                    <router-link to={ALL} style="text-decoration: none;">
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
                        实例总数
                        <div> {tablecount[0]} </div>
                      </Card>
                    </router-link>
                    <router-link to={SUCCESS} style="text-decoration: none;">
                      <Card
                        // loading={loadingRef}
                        title=''
                        embedded
                        style={{ width: '20vh' }}
                        // data={tablecount}
                        // striped
                        size={'medium'}
                      >
                        <span role="img" class="anticon" style="font-size: 14px;"><svg width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false" class=""><title>Icon / ChenggongSolid</title><desc>Created with Sketch.</desc><g id="Icon-/-ChenggongSolid" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="chenggongSolid" fill-rule="nonzero"><circle id="Oval" fill="#30CE78" cx="10" cy="10" r="10"></circle><path d="M8.465,13.8400266 C8.27330307,13.8329524 8.09275479,13.7480947 7.965,13.605 L7.38,13.05 L7.305,12.965 L4.765,10.425 C4.62653729,10.2948544 4.54557756,10.1149439 4.54,9.925 C4.54274754,9.54035472 4.85534491,9.22999019 5.24,9.23 C5.40989313,9.22836228 5.57415529,9.29085332 5.7,9.405 L5.75,9.45 L8.5,12.165 L14.25,6.415 C14.3810497,6.25128028 14.5803092,6.15718553 14.79,6.15993861 C15.083905,6.1610639 15.3453673,6.34688851 15.4430093,6.62410198 C15.5406513,6.90131545 15.4533612,7.20997998 15.225,7.395 L8.965,13.625 C8.83589282,13.7636617 8.65445424,13.8416803 8.465,13.8400266 L8.465,13.8400266 Z" id="Path" fill="#FFFFFF"></path></g></g></svg></span>
                        成功

                        <div>{tablecount[1]}</div >
                      </Card>
                    </router-link>
                    <router-link to={FAILURE} style="text-decoration: none;">
                      <Card
                        // loading={loadingRef}
                        title=''
                        embedded
                        style={{ width: '20vh' }}
                        // data={tablecount}
                        // striped
                        size={'medium'}
                      >
                        <span role="img" class="anticon" style="font-size: 14px;"><svg width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false" class=""><title>Icon / ShibaiSolid</title><desc>Created with Sketch.</desc><g id="Icon-/-ShibaiSolid" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="\u5931\u8D25"><path d="M10.0000116,20.0000248 C15.5228696,20.0000248 20.0000233,15.5228711 20.0000233,10.0000131 C20.0000233,4.47715516 15.5228696,1.50995879e-06 10.0000116,1.50995879e-06 C4.47715365,1.50995879e-06 0,4.47715516 0,10.0000131 C0,15.5228711 4.47715365,20.0000248 10.0000116,20.0000248 Z" id="Path" fill="#FF5D40" fill-rule="nonzero"></path><path d="M13.8473171,6.79853659 C13.8473171,6.58536585 13.7639024,6.38536585 13.6136585,6.23560976 C13.4639024,6.08390244 13.2634146,6 13.0492683,6 C12.8360976,6 12.6356098,6.08341463 12.484878,6.23463415 L9.92341463,8.79609756 L7.36243902,6.23463415 C7.21170732,6.08341463 7.01121951,6 6.79804878,6 C6.58439024,6 6.38390244,6.08341463 6.23414634,6.23463415 C6.08341463,6.38536585 6,6.58536585 6,6.79853659 C6,7.01170732 6.08341463,7.21170732 6.23414634,7.36243902 L8.79560976,9.92439024 L6.23414634,12.4853659 C6.08341463,12.6365854 6,12.8370732 6,13.0497561 C6,13.2629268 6.08341463,13.4629268 6.23414634,13.6141463 C6.38439024,13.7643902 6.58439024,13.8478049 6.79804878,13.8478049 C7.01073171,13.8478049 7.21121951,13.7643902 7.36243902,13.6141463 L9.92341463,11.0531707 L12.484878,13.6141463 C12.6356098,13.7643902 12.8356098,13.8478049 13.0492683,13.8478049 C13.2629268,13.8478049 13.4629268,13.7643902 13.6136585,13.6141463 C13.7639024,13.4629268 13.8473171,13.2629268 13.8473171,13.0497561 C13.8473171,12.8370732 13.7639024,12.6365854 13.6136585,12.4853659 L11.0521951,9.92439024 L13.6136585,7.36243902 C13.7639024,7.21170732 13.8473171,7.01170732 13.8473171,6.79853659" id="Fill-4" fill="#FFFFFF"></path></g></g></svg></span>
                        失败
                        <div>{tablecount[2]}</div >
                      </Card>
                    </router-link>
                    <router-link to={RUNNING_EXECUTION} style="text-decoration: none;">
                      <Card
                        // loading={loadingRef}
                        title=''
                        embedded
                        style={{ width: '20vh' }}
                        // data={tablecount}
                        // striped
                        size={'medium'}
                      >
                        <svg width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false" class=""><title>Icon / YunxingzhongSolid</title><desc>Created with Sketch.</desc><g id="Icon-/-YunxingzhongSolid" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="yunxingzhongSolid" fill-rule="nonzero"><circle id="Oval" fill="#349EFF" cx="10" cy="10" r="10"></circle><path d="M7.195,15.44 C6.82817224,15.453163 6.49780925,15.2194806 6.38805739,14.8692087 C6.27830553,14.5189368 6.41625012,14.138518 6.725,13.94 L11.95,10.29 L6.725,6.625 C6.41625012,6.42648204 6.27830553,6.04606321 6.38805739,5.69579131 C6.49780925,5.34551942 6.82817224,5.11183697 7.195,5.125 C7.36115694,5.12480267 7.52340475,5.17539607 7.66,5.27 L13.83,9.6 C13.9998567,9.71836877 14.1179412,9.89728465 14.16,10.1 C14.162438,10.1382946 14.162438,10.1767054 14.16,10.215 L14.16,10.27 L14.005,10.295 L14.155,10.325 C14.1571024,10.3616365 14.1571024,10.3983635 14.155,10.435 C14.1144079,10.6383219 13.995991,10.8177414 13.825,10.935 L7.66,15.29 C7.52506413,15.3885088 7.3620643,15.4410894 7.195,15.44 Z" id="Path" fill="#FFFFFF"></path></g></g></svg>                      正在运行
                        <div>{tablecount[3]}</div >
                      </Card>
                    </router-link>
                    <router-link to={PAUSE} style="text-decoration: none;">
                      <Card
                        // loading={loadingRef}
                        title=''
                        embedded
                        style={{ width: '20vh' }}
                        // data={tablecount}
                        // striped
                        size={'medium'}
                      >
                        <span role="img" class="anticon" style="font-size: 14px;"><svg width="1em" height="1em" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true" focusable="false" class=""><title>tingzhiSolid</title><g id="\u9875\u9762-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="1-\u53D1\u5E03\u8FD0\u7EF4-\u8FD0\u7EF4\u4E2D\u5FC3-\u8FD0\u7EF4\u6982\u89C8-\u79BB\u7EBF\u5F00\u53D1" transform="translate(-1244.000000, -242.000000)" fill-rule="nonzero"><g id="\u7F16\u7EC4-20" transform="translate(224.000000, 160.000000)"><g id="Group23" transform="translate(1004.000000, 64.000000)"><g id="GroupCopy2" transform="translate(16.000000, 16.000000)"><g id="tingzhiSolid" transform="translate(0.000000, 2.000000)"><circle id="Oval" fill="#BB85B3" cx="7" cy="7" r="7"></circle><rect id="Rectangle" fill="#FFFFFF" x="3.5" y="6.475" width="7" height="1.05" rx="0.525"></rect></g></g></g></g></g></g></svg></span>                      暂停
                        <div>{tablecount[4]}</div >
                      </Card>
                    </router-link>
                    <router-link to={STOP} style="text-decoration: none;">
                      <Card
                        // loading={loadingRef}
                        title=''
                        embedded
                        style={{ width: '20vh' }}
                        // data={tablecount}
                        // striped
                        size={'medium'}
                      >
                        <span role="img" class="anticon" style="font-size: 14px;"><svg width="1em" height="1em" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true" focusable="false" class=""><title>ZantingSolid</title><desc>Created with Sketch.</desc><g id="\u53D1\u5E03\u8FD0\u7EF4" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="16-\u8FD0\u7EF4\u4E2D\u5FC3\u4FA7\u8FB9\u680F\u6536\u8D77\u5DF2\u9009\u4E2D\u672A\u70B9\u5F00" transform="translate(-1315.000000, -244.000000)" fill-rule="nonzero"><g id="ZantingSolid" transform="translate(1315.000000, 244.000000)"><circle id="Oval" fill="#FFB834" cx="7" cy="7" r="7"></circle><path d="M5.719,4.2525 C5.45266489,4.23442633 5.22151281,4.43434164 5.201,4.7005 L5.201,9.1735 C5.22152378,9.43820653 5.45048611,9.63757509 5.7155,9.6215 C5.98183511,9.63957367 6.21298719,9.43965836 6.2335,9.1735 L6.2335,4.697 C6.21118225,4.43224195 5.98057689,4.23435763 5.7155,4.2525 L5.719,4.2525 Z M8.2845,4.2525 C8.01816489,4.23442633 7.78701281,4.43434164 7.7665,4.7005 L7.7665,9.1735 C7.8032292,9.43038899 8.02324858,9.62118816 8.28275,9.62118816 C8.54225142,9.62118816 8.7622708,9.43038899 8.799,9.1735 L8.799,4.697 C8.77849241,4.43277279 8.5489045,4.23442133 8.2845,4.2525 L8.2845,4.2525 Z" id="Shape" fill="#FFFFFF"></path></g></g></g></svg></span>
                        停止
                        <div>{tablecount[5]}</div >

                      </Card>
                    </router-link>
                  </NSpace>
                </Card>
              </NGi>


              <NGi >
                <Card title={'实例运行时段分布'} style={{ height: '60vh' }}>
                  {chartData.length > 0 && <ChartLineBox data={chartData} />}
                </Card>
              </NGi>

            </NGrid>

          ),
          'header-extra': () => (
            <NSpace>
              <p style="display:none">项目名称：</p>
              <NSelect
                size='small'
                value={ProjFirst}
                defaultValue={ProjFirst}
                options={ProjSelect}
                style="width:150px;display:none"
                onUpdateValue={onUpdateProjPickerValue}
              />
              日期：
              {/* <NDatePicker
                default-value={date[0]}
                onUpdateValue={onUpdateDatePickerValue}
                size='small'
                type='date'
                clearable
              /> */}
              <NDatePicker
                v-model={[this.datePickerRange, 'value']}
                type='datetimerange'
                size='small'
                start-placeholder={t('project.task.start_time')}
                end-placeholder={t('project.task.end_time')}
                onUpdateValue={onUpdateDatePickerValue}
                clearable
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
