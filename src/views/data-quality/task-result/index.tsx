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

import { defineComponent, onMounted, toRefs, watch } from 'vue'
import {
  NInput,
  NSelect,
  NDatePicker,
  NButton,
  NIcon,
  NDataTable,
  NForm, NFormItem
} from 'naive-ui'
import { SearchOutlined } from '@vicons/antd'
import { useTable } from './use-table'
import { useI18n } from 'vue-i18n'
import CrudHeader from "@/components/cue/crud-header.vue";
import CrudPageDs from "@/components/cue/crud-page-ds.vue";
import CrudForm from "@/components/cue/crud-form.vue";

const TaskResult = defineComponent({
  name: 'task-result',
  setup() {
    const { t, variables, getTableData, createColumns } = useTable()

    const requestTableData = () => {
      getTableData({
        pageSize: variables.pageSize,
        pageNo: variables.page,
        ruleType: variables.ruleType,
        state: variables.state,
        searchVal: variables.searchVal,
        datePickerRange: variables.datePickerRange
      })
    }

    const onUpdatePage = (page: number) => {
      variables.page = page
      requestTableData()
    }

    const onUpdatePageSize = (pageSize: number) => {
      variables.page = 1
      variables.pageSize = pageSize
      requestTableData()
    }

    const onSearch = () => {
      variables.page = 1
      requestTableData()
    }

    onMounted(() => {
      createColumns(variables)
      requestTableData()
    })

    watch(useI18n().locale, () => {
      createColumns(variables)
    })

    return {
      t,
      ...toRefs(variables),
      onUpdatePage,
      requestTableData,
      onUpdatePageSize,
      onSearch
    }
  },
  render() {
    const { t, requestTableData, onUpdatePage, onUpdatePageSize, onSearch, loadingRef } = this

    return (
      <>
        <CrudForm>
          {{
            header: () => (
                <CrudHeader title="任务结果"/>
            ),
            condition: () => (
                <NForm showFeedback={false} label-placement="left" inline style="margin-bottom: 3px">
                    <NFormItem label="名称">
                      <NInput
                          v-model={[this.searchVal, 'value']}
                          size='small'
                          placeholder={t('data_quality.task_result.task_name')}
                          clearable
                      />
                    </NFormItem>
                    <NFormItem label="规则类型">
                      <NSelect
                          v-model={[this.ruleType, 'value']}
                          size='small'
                          options={[
                            {
                              value: 0,
                              label: t('data_quality.task_result.single_table')
                            },
                            {
                              value: 1,
                              label: t('data_quality.task_result.single_table_custom_sql')
                            },
                            {
                              value: 2,
                              label: t('data_quality.task_result.multi_table_accuracy')
                            },
                            {
                              value: 3,
                              label: t('data_quality.task_result.multi_table_comparison')
                            }
                          ]}
                          placeholder={t('data_quality.task_result.rule_type')}
                          style={{ width: '180px' }}
                          clearable
                      />
                    </NFormItem>
                    <NFormItem label="任务状态">
                      <NSelect
                          v-model={[this.state, 'value']}
                          size='small'
                          options={[
                            {
                              value: 0,
                              label: t('data_quality.task_result.undone')
                            },
                            {
                              value: 1,
                              label: t('data_quality.task_result.success')
                            },
                            {
                              value: 2,
                              label: t('data_quality.task_result.failure')
                            }
                          ]}
                          placeholder={t('data_quality.task_result.state')}
                          style={{ width: '180px' }}
                          clearable
                      />
                    </NFormItem>
                    <NFormItem label="时间">
                      <NDatePicker
                          v-model={[this.datePickerRange, 'value']}
                          type='datetimerange'
                          size='small'
                          start-placeholder={t('monitor.audit_log.start_time')}
                          end-placeholder={t('monitor.audit_log.end_time')}
                          clearable
                      />
                    </NFormItem>
                    <NFormItem>
                      <NButton size='small' color={'#0099CB'} type='primary' onClick={onSearch} style={"padding: 0 15px 0 15px"}>
                        <NIcon>
                          <SearchOutlined />
                        </NIcon>
                        <div style={"font-size: 12px"}>
                          查询
                        </div>
                      </NButton>
                    </NFormItem>
                </NForm>
            ),
            table: () => (
                <NDataTable
                    loading={loadingRef}
                    columns={this.columns}
                    data={this.tableData}
                    scrollX={this.tableWidth}
                    bordered
                    flex-height
                    single-line={false}
                    class={"cue-table"}
                />
            ),
            page: () => (
                <CrudPageDs
                    page={this.page}
                    page-size={this.pageSize}
                    item-count={this.total}
                    onPageChange={onUpdatePage}
                    onPageSizeChange={onUpdatePageSize}
                />
            )
          }}
        </CrudForm>
      </>
    )
  }
})

export default TaskResult
