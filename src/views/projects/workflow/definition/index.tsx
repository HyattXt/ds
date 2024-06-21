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

import { SearchOutlined } from '@vicons/antd'
import {
  NButton,
  NDataTable,
  NIcon,
  NInput,
  NPagination,
  NSpace,
  NTooltip,
  NPopconfirm, NForm, NGrid, NFormItemGi
} from 'naive-ui'
import { defineComponent, onMounted, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTable } from './use-table'
import ImportModal from './components/import-modal'
import StartModal from './components/start-modal'
import TimingModal from './components/timing-modal'
import VersionModal from './components/version-modal'
import CopyModal from './components/copy-modal'
import { useRouter, useRoute } from 'vue-router'
import type { Router } from 'vue-router'
import styles from './index.module.scss'

import CrudHeader from "@/components/cue/crud-header.vue";
import CrudForm from "@/components/cue/crud-form.vue";
import CrudPageDs from "@/components/cue/crud-page-ds.vue";

export default defineComponent({
  name: 'WorkflowDefinitionList',
  setup() {
    const router: Router = useRouter()
    const route = useRoute()
    const projectCode = Number(route.params.projectCode)

    const {
      variables,
      createColumns,
      getTableData,
      batchDeleteWorkflow,
      batchExportWorkflow,
      batchCopyWorkflow
    } = useTable()

    const requestData = () => {
      getTableData({
        pageSize: variables.pageSize,
        pageNo: variables.page,
        searchVal: variables.searchVal
      })
    }

    const handlePageChange = (page: number) => {
      variables.page = page
      requestData()
    }

    const handleUpdateList = () => {
      requestData()
    }

    const handleCopyUpdateList = () => {
      variables.checkedRowKeys = []
      requestData()
    }

    const handleSearch = () => {
      variables.page = 1
      requestData()
    }

    const handleChangePageSize = (pageSize: number) => {
      variables.page = 1
      variables.pageSize = pageSize
      requestData()
    }

    const createDefinition = () => {
      router.push({
        path: `/projects/${projectCode}/workflow/relation`
      })
    }

    watch(useI18n().locale, () => {
      createColumns(variables)
    })

    onMounted(() => {
      createColumns(variables)
      requestData()
    })

    return {
      requestData,
      handleSearch,
      handleUpdateList,
      createDefinition,
      handlePageChange,
      handleChangePageSize,
      batchDeleteWorkflow,
      batchExportWorkflow,
      batchCopyWorkflow,
      handleCopyUpdateList,
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
                  <CrudHeader title="工作流管理" addButton onAddEvent={this.createDefinition}/>
              ),
              condition: () => (
                  <NForm showFeedback={false} label-placement="left" style="margin-bottom: 3px">
                    <NGrid cols="22" x-gap="16">
                      <NFormItemGi label="名称" span="4">
                        <NInput
                            size='small'
                            placeholder={t('resource.function.enter_keyword_tips')}
                            v-model={[this.searchVal, 'value']}
                        />
                      </NFormItemGi>
                      <NFormItemGi span="2">
                        <NButton size='small' color={'#0099CB'} type='primary' onClick={this.handleSearch} style={"padding: 0 15px 0 15px"}>
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
                      rowKey={(row: any) => row.code}
                      columns={this.columns}
                      data={this.tableData}
                      v-model:checked-row-keys={this.checkedRowKeys}
                      scrollX={this.tableWidth}
                      bordered
                      flex-height
                      single-line={false}
                      class={"cue-table"}
                  />
              ),
              page: () => (
                  <>
                    <div class={styles['batch-button']}>
                      <NTooltip>
                        {{
                          default: () => t('project.workflow.delete'),
                          trigger: () => (
                              <NPopconfirm onPositiveClick={this.batchDeleteWorkflow}>
                                {{
                                  default: () => t('project.workflow.delete_confirm'),
                                  trigger: () => (
                                      <NButton
                                          tag='div'
                                          type='primary'
                                          disabled={this.checkedRowKeys.length <= 0}
                                          class='btn-delete-all'
                                      >
                                        {t('project.workflow.delete')}
                                      </NButton>
                                  )
                                }}
                              </NPopconfirm>
                          )
                        }}
                      </NTooltip>
                      <NTooltip>
                        {{
                          default: () => t('project.workflow.export'),
                          trigger: () => (
                              <NButton
                                  tag='div'
                                  type='primary'
                                  disabled={this.checkedRowKeys.length <= 0}
                                  onClick={this.batchExportWorkflow}
                                  class='btn-delete-all'
                              >
                                {t('project.workflow.export')}
                              </NButton>
                          )
                        }}
                      </NTooltip>
                    </div>
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
          <ImportModal
            v-model:show={this.showRef}
            onUpdateList={this.handleUpdateList}
          />
          <StartModal
            v-model:row={this.row}
            v-model:show={this.startShowRef}
            onUpdateList={this.handleUpdateList}
          />
          <TimingModal
            v-model:row={this.row}
            v-model:show={this.timingShowRef}
            onUpdateList={this.handleUpdateList}
          />
          <VersionModal
            v-model:row={this.row}
            v-model:show={this.versionShowRef}
            onUpdateList={this.handleUpdateList}
          />
          <CopyModal
            v-model:codes={this.checkedRowKeys}
            v-model:show={this.copyShowRef}
            onUpdateList={this.handleCopyUpdateList}
          />
        </>
    )
  }
})
