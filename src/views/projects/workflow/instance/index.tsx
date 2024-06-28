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

import { defineComponent, onMounted, onUnmounted, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  NButton,
  NDataTable,
  NPopconfirm,
  NTooltip
} from 'naive-ui'
import { useTable } from './use-table'
import ProcessInstanceCondition from './components/process-instance-condition'
import { IWorkflowInstanceSearch } from './types'
import CrudForm from "@/components/cue/crud-form.vue";
import CrudHeader from "@/components/cue/crud-header.vue";
import CrudPageDs from "@/components/cue/crud-page-ds.vue";

export default defineComponent({
  name: 'WorkflowInstanceList',
  setup() {
    let setIntervalP: number
    const { variables, createColumns, getTableData, batchDeleteInstance } =
      useTable()

    const requestData = () => {
      getTableData()
    }

    const handlePageChange = (page: number) => {
      variables.page = page
      requestData()
    }

    const handleSearch = (params: IWorkflowInstanceSearch) => {
      variables.searchVal = params.searchVal
      variables.executorName = params.executorName
      variables.host = params.host
      variables.stateType = params.stateType
      variables.startDate = params.startDate
      variables.endDate = params.endDate
      variables.page = 1
      requestData()
    }

    const handleChangePageSize = (pageSize: number) => {
      variables.page = 1
      variables.pageSize = pageSize
      requestData()
    }

    const handleBatchDelete = () => {
      batchDeleteInstance()
    }

    onMounted(() => {
      createColumns(variables)
      requestData()

      // Update timing list data
      setIntervalP = setInterval(() => {
        requestData()
      }, 9000)
    })

    watch(useI18n().locale, () => {
      createColumns(variables)
    })

    onUnmounted(() => {
      clearInterval(setIntervalP)
    })

    return {
      requestData,
      handleSearch,
      handleChangePageSize,
      handlePageChange,
      handleBatchDelete,
      ...toRefs(variables)
    }
  },
  render() {
    const { t } = useI18n()
    const { loadingRef } = this

    return (
        <>
          <CrudForm>
            {{
              header: () => (
                  <CrudHeader title="工作流实例" />
              ),
              condition: () => (
                  <ProcessInstanceCondition onHandleSearch={this.handleSearch} />
              ),
              table: () => (
                    <NDataTable
                        loading={loadingRef}
                        rowKey={(row: any) => row.code}
                        columns={this.columns}
                        data={this.tableData}
                        v-model:checked-row-keys={this.checkedRowKeys}
                        scrollX={this.tableWidth}
                        bordered
                        flex-height
                        single-line={false}
                    />
              ),
              page: () => (
                  <>
                    <NTooltip>
                      {{
                        default: () => t('project.workflow.delete'),
                        trigger: () => (
                            <NButton
                                tag='div'
                                type='primary'
                                disabled={this.checkedRowKeys.length <= 0}
                                style='position: absolute; bottom: 5px; left: 10px;'
                                class='btn-delete-all'
                            >
                              <NPopconfirm onPositiveClick={this.handleBatchDelete}>
                                {{
                                  default: () => t('project.workflow.delete_confirm'),
                                  trigger: () => t('project.workflow.delete')
                                }}
                              </NPopconfirm>
                            </NButton>
                        )
                      }}
                    </NTooltip>
                    <CrudPageDs
                        page={this.page}
                        page-size={this.pageSize}
                        item-count={this.total}
                        onPageChange={this.handlePageChange}
                        onPageSizeChange={this.handleChangePageSize}
                    />
                  </>
              )
            }}
          </CrudForm>
        </>
    )
  }
})
