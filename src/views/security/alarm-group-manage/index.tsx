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
  NButton,
  NDataTable, NForm, NFormItemGi, NGrid,
  NIcon,
  NInput
} from 'naive-ui'
import { SearchOutlined } from '@vicons/antd'
import { useI18n } from 'vue-i18n'
import { useTable } from './use-table'
import AlarmGroupModal from './components/alarm-group-modal'
import CrudForm from "@/components/cue/crud-form.vue";
import CrudHeader from "@/components/cue/crud-header.vue";
import CrudPageDs from "@/components/cue/crud-page-ds.vue";

const alarmGroupManage = defineComponent({
  name: 'alarm-group-manage',
  setup() {
    const { t } = useI18n()
    const { variables, getTableData, createColumns } = useTable()

    const requestData = () => {
      getTableData({
        pageSize: variables.pageSize,
        pageNo: variables.page,
        searchVal: variables.searchVal
      })
    }

    const onUpdatePage = (page: number) => {
      variables.page = page
      requestData()
    }

    const onUpdatePageSize = (pageSize: number) => {
      variables.page = 1
      variables.pageSize = pageSize
      requestData()
    }

    const onSearch = () => {
      variables.page = 1
      requestData()
    }

    const handleModalChange = () => {
      variables.showModalRef = true
      variables.statusRef = 0
    }

    const onCancelModal = () => {
      variables.showModalRef = false
    }

    const onConfirmModal = () => {
      variables.showModalRef = false
      requestData()
    }

    onMounted(() => {
      createColumns(variables)
      requestData()
    })

    watch(useI18n().locale, () => {
      createColumns(variables)
    })

    return {
      t,
      ...toRefs(variables),
      requestData,
      onCancelModal,
      onConfirmModal,
      onUpdatePage,
      onUpdatePageSize,
      handleModalChange,
      onSearch
    }
  },
  render() {
    const {
      t,
      requestData,
      onUpdatePage,
      onUpdatePageSize,
      onCancelModal,
      onConfirmModal,
      handleModalChange,
      onSearch,
      loadingRef
    } = this

    return (
      <>
        <CrudForm>
          {{
            header: () => (
                <CrudHeader title="告警组管理" addButton onAddEvent={this.handleModalChange}/>
            ),
            condition: () => (
                <NForm showFeedback={false} label-placement="left" style="margin-bottom: 3px">
                  <NGrid cols="22" x-gap="16">
                    <NFormItemGi label="名称" span="4">
                      <NInput
                          size='small'
                          clearable
                          v-model={[this.searchVal, 'value']}
                          placeholder={t('security.alarm_group.search_tips')}
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
        <AlarmGroupModal
          showModalRef={this.showModalRef}
          statusRef={this.statusRef}
          row={this.row}
          onCancelModal={onCancelModal}
          onConfirmModal={onConfirmModal}
        />
      </>
    )
  }
})

export default alarmGroupManage
