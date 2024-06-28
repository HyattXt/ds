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
  NSpace,
  NInput,
  NSelect,
  NDatePicker,
  NButton,
  NIcon,
  NDataTable,
  NPagination,
  NCard, NTooltip, NPopconfirm, NFormItemGi, NGrid, NForm
} from 'naive-ui'
import { SearchOutlined } from '@vicons/antd'
import { useTable } from './use-table'
import { useI18n } from 'vue-i18n'
import Card from '@/components/card'
import LogModal from '@/components/log-modal'
import { useAsyncState } from '@vueuse/core'
import { queryLog } from '@/service/modules/log'
import { stateType } from '@/common/common'
import styles from './index.module.scss'
import CrudForm from "@/components/cue/crud-form.vue";
import CrudHeader from "@/components/cue/crud-header.vue";
import ProcessInstanceCondition from "@/views/projects/workflow/instance/components/process-instance-condition";
import CrudPageDs from "@/components/cue/crud-page-ds.vue";

const TaskInstance = defineComponent({
  name: 'task-instance',
  setup() {
    const { t, variables, getTableData, createColumns } = useTable()

    const requestTableData = () => {
      getTableData({
        pageSize: variables.pageSize,
        pageNo: variables.page,
        searchVal: variables.searchVal,
        processInstanceId: variables.processInstanceId,
        host: variables.host,
        stateType: variables.stateType,
        datePickerRange: variables.datePickerRange,
        executorName: variables.executorName,
        processInstanceName: variables.processInstanceName
      })
    }

    const handlePageChange = (page: number) => {
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

    const onConfirmModal = () => {
      variables.showModalRef = false
    }

    const getLogs = (row: any) => {
      const { state } = useAsyncState(
        queryLog({
          taskInstanceId: Number(row.id),
          limit: variables.limit,
          skipLineNum: variables.skipLineNum
        }).then((res: any) => {
          if (res?.message) {
            variables.logRef += res.message
            variables.limit += 1000
            variables.skipLineNum += res.lineNum
            getLogs(row)
          } else {
            variables.logLoadingRef = false
          }
        }),
        {}
      )

      return state
    }

    const refreshLogs = (row: any) => {
      variables.logRef = ''
      variables.limit = 1000
      variables.skipLineNum = 0
      getLogs(row)
    }

    onMounted(() => {
      createColumns(variables)
      requestTableData()
    })

    watch(useI18n().locale, () => {
      createColumns(variables)
    })

    watch(
      () => variables.showModalRef,
      () => {
        if (variables.showModalRef) {
          getLogs(variables.row)
        } else {
          variables.row = {}
          variables.logRef = ''
          variables.logLoadingRef = true
          variables.skipLineNum = 0
          variables.limit = 1000
        }
      }
    )

    return {
      t,
      ...toRefs(variables),
      requestTableData,
      handlePageChange,
      onUpdatePageSize,
      onSearch,
      onConfirmModal,
      refreshLogs
    }
  },
  render() {
    const {
      t,
      requestTableData,
      onUpdatePageSize,
      onSearch,
      onConfirmModal,
      loadingRef,
      refreshLogs
    } = this


    return (
      <>
        <CrudForm>
            {{
              header: () => (
                  <CrudHeader title="任务实例" />
              ),
              condition: () => (
                  <NForm showFeedback={false} label-placement="left" style="margin-bottom: 3px">
                    <NGrid cols="22" x-gap="16">
                      <NFormItemGi label="任务名称" span="4">
                        <NInput
                            v-model={[this.searchVal, 'value']}
                            size='small'
                            placeholder={t('project.task.task_name')}
                            clearable
                        />
                      </NFormItemGi>
                      <NFormItemGi label="工作流名称" span="4">
                        <NInput
                            v-model={[this.processInstanceName, 'value']}
                            size='small'
                            placeholder={t('project.task.workflow_instance')}
                            clearable
                        />
                      </NFormItemGi>
                      <NFormItemGi label="执行用户" span="3">
                        <NInput
                            v-model={[this.executorName, 'value']}
                            size='small'
                            placeholder={t('project.task.executor')}
                            clearable
                        />
                      </NFormItemGi>
                      <NFormItemGi label="状态" span="3">
                        <NSelect
                            v-model={[this.stateType, 'value']}
                            size='small'
                            options={stateType(t).slice(1)}
                            placeholder={t('project.task.state')}
                            style={{ width: '180px' }}
                            clearable
                        />
                      </NFormItemGi>
                      <NFormItemGi label="时间" span="5">
                        <NDatePicker
                            v-model={[this.datePickerRange, 'value']}
                            type='datetimerange'
                            size='small'
                            start-placeholder={t('project.task.start_time')}
                            end-placeholder={t('project.task.end_time')}
                            clearable
                        />
                      </NFormItemGi>
                      <NFormItemGi span="2">
                        <NButton size='small' color={'#0099CB'} type='primary' onClick={onSearch} style={"padding: 0 15px 0 15px"}>
                          <NIcon>
                            <SearchOutlined />
                          </NIcon>
                          <div style={"font-size: 12px"}>
                            查询
                          </div>
                        </NButton>
                      </NFormItemGi>
                    </NGrid>
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
                  />
              ),
              page: () => (
                    <CrudPageDs
                        page={this.page}
                        page-size={this.pageSize}
                        item-count={this.total}
                        onPageChange={requestTableData}
                        onPageSizeChange={onUpdatePageSize}
                    />
              )
            }}
          </CrudForm>
        <LogModal
          showModalRef={this.showModalRef}
          logRef={this.logRef}
          row={this.row}
          logLoadingRef={this.logLoadingRef}
          onConfirmModal={onConfirmModal}
          onRefreshLogs={refreshLogs}
        />
      </>
    )
  }
})

export default TaskInstance
