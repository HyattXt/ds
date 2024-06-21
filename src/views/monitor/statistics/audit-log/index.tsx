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
  NCard, NForm, NGrid, NFormItemGi
} from 'naive-ui'
import { SearchOutlined } from '@vicons/antd'
import { useTable } from './use-table'
import { useI18n } from 'vue-i18n'
import Card from '@/components/card'
import styles from './index.module.scss'
import CrudForm from "@/components/cue/crud-form.vue";
import CrudHeader from "@/components/cue/crud-header.vue";
import CrudPageDs from "@/components/cue/crud-page-ds.vue";

const AuditLog = defineComponent({
  name: 'audit-log',
  setup() {
    const { t, variables, getTableData, createColumns } = useTable()

    const requestTableData = () => {
      getTableData({
        pageSize: variables.pageSize,
        pageNo: variables.page,
        resourceType: variables.resourceType,
        operationType: variables.operationType,
        userName: variables.userName,
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
      requestTableData,
      onUpdatePage,
      onUpdatePageSize,
      onSearch
    }
  },
  render() {
    const { t, requestTableData,onUpdatePage, onUpdatePageSize, onSearch, loadingRef } = this

    return (
      <>
        <CrudForm>
          {{
            header: () => (
                <CrudHeader title="审计日志"/>
            ),
            condition: () => (
                <NForm showFeedback={false} label-placement="left" style="margin-bottom: 3px">
                  <NGrid cols="18" x-gap="16">
                    <NFormItemGi label="用户" span="3">
                      <NInput
                          v-model={[this.userName, 'value']}
                          size='small'
                          placeholder={t('monitor.audit_log.user_name')}
                          clearable
                      />
                    </NFormItemGi>
                    <NFormItemGi label="操作类型" span="3">
                      <NSelect
                          v-model={[this.operationType, 'value']}
                          size='small'
                          options={[
                            { value: 'CREATE', label: t('monitor.audit_log.create') },
                            { value: 'UPDATE', label: t('monitor.audit_log.update') },
                            { value: 'DELETE', label: t('monitor.audit_log.delete') },
                            { value: 'READ', label: t('monitor.audit_log.read') }
                          ]}
                          placeholder={t('monitor.audit_log.operation_type')}
                          style={{ width: '180px' }}
                          clearable
                      />
                    </NFormItemGi>
                    <NFormItemGi label="资源类型" span="3">
                      <NSelect
                          v-model={[this.resourceType, 'value']}
                          size='small'
                          options={[
                            {
                              value: 'USER_MODULE',
                              label: t('monitor.audit_log.user_audit')
                            },
                            {
                              value: 'PROJECT_MODULE',
                              label: t('monitor.audit_log.project_audit')
                            }
                          ]}
                          placeholder={t('monitor.audit_log.resource_type')}
                          style={{ width: '180px' }}
                          clearable
                      />
                    </NFormItemGi>
                    <NFormItemGi label="时间" span="5">
                      <NDatePicker
                          v-model={[this.datePickerRange, 'value']}
                          type='datetimerange'
                          size='small'
                          start-placeholder={t('monitor.audit_log.start_time')}
                          end-placeholder={t('monitor.audit_log.end_time')}
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

export default AuditLog
