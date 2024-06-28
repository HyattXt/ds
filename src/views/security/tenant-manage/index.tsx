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

import { defineComponent, toRefs, onMounted, watch } from 'vue'
import {
  NButton,
  NInput,
  NIcon,
  NDataTable,
  NForm, NGrid, NFormItemGi
} from 'naive-ui'
import { useTable } from './use-table'
import { SearchOutlined } from '@vicons/antd'
import TenantModal from './components/tenant-modal'
import { useI18n } from 'vue-i18n'
import CrudForm from "@/components/cue/crud-form.vue";
import CrudHeader from "@/components/cue/crud-header.vue";
import CrudPageDs from "@/components/cue/crud-page-ds.vue";

const tenementManage = defineComponent({
  name: 'tenement-manage',
  setup() {
    const { variables, getTableData, createColumns } = useTable()
    const { t } = useI18n()

    const requestData = () => {
      getTableData({
        pageSize: variables.pageSize,
        pageNo: variables.page,
        searchVal: variables.searchVal
      })
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

    const handleChangePage = (page: number) => {
      variables.page = page
      requestData()
    }

    const handleChangePageSize = (pageSize: number) => {
      variables.page = 1
      variables.pageSize = pageSize
      requestData()
    }

    const handleSearch = () => {
      variables.page = 1
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
      handleModalChange,
      onCancelModal,
      onConfirmModal,
      handleSearch,
      handleChangePage,
      handleChangePageSize
    }
  },
  render() {
    const { t, loadingRef } = this
    return (
      <>
        <CrudForm>
          {{
            header: () => (
                <CrudHeader title="租户管理" addButton onAddEvent={this.handleModalChange}/>
            ),
            condition: () => (
                <NForm showFeedback={false} label-placement="left" style="margin-bottom: 3px">
                  <NGrid cols="22" x-gap="16">
                    <NFormItemGi label="名称" span="4">
                      <NInput
                          size='small'
                          v-model={[this.searchVal, 'value']}
                          placeholder={t('security.tenant.search_tips')}
                          clearable
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
                    onPageChange={this.handleChangePage}
                    onPageSizeChange={this.handleChangePageSize}
                />
            )
          }}
        </CrudForm>
        <TenantModal
          showModalRef={this.showModalRef}
          statusRef={this.statusRef}
          row={this.row}
          onCancelModal={this.onCancelModal}
          onConfirmModal={this.onConfirmModal}
        />
      </>
    )
  }
})

export default tenementManage
