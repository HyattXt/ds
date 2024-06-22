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

import { defineComponent, onMounted, ref, toRefs, watch } from 'vue'
import {
  NButton,
  NInput,
  NIcon,
  NDataTable,
  NPagination,
  NSpace, NForm, NGrid, NFormItemGi
} from 'naive-ui'
import Card from '@/components/card'
import DetailModal from './detail'
import { SearchOutlined } from '@vicons/antd'
import { useI18n } from 'vue-i18n'
import { useColumns } from './use-columns'
import { useTable } from './use-table'
import styles from './index.module.scss'
import type { TableColumns } from './types'
import { DefaultTableWidth } from '@/common/column-width-config'
import axios from "axios";
import CrudForm from "@/components/cue/crud-form.vue";
import CrudHeader from "@/components/cue/crud-header.vue";
import CrudPageDs from "@/components/cue/crud-page-ds.vue";

const list = defineComponent({
  name: 'list',
  setup() {
    const { t } = useI18n()
    const showDetailModal = ref(false)
    const selectId = ref()
    const chat2DbId = ref()
    const columns = ref({
      columns: [] as TableColumns,
      tableWidth: DefaultTableWidth
    })
    const { data, changePage, changePageSize, deleteRecord, updateList } =
      useTable()

    const { getColumns } = useColumns((id: number, type: 'edit' | 'delete') => {
      if (type === 'edit') {
        showDetailModal.value = true
        selectId.value = id
      } else {
        deleteRecord(id)
      }
    })

    const onCreate = () => {
      selectId.value = null
      showDetailModal.value = true
    }

    onMounted(() => {
      changePage(1)
      columns.value = getColumns()
    })

    watch(useI18n().locale, () => {
      columns.value = getColumns()
    })

    return {
      t,
      showDetailModal,
      id: selectId,
      columns,
      ...toRefs(data),
      changePage,
      changePageSize,
      onCreate,
      onUpdatedList: updateList
    }
  },
  render() {
    const {
      t,
      id,
      showDetailModal,
      columns,
      list,
      page,
      pageSize,
      itemCount,
      loading,
      changePage,
      changePageSize,
      onCreate,
      onUpdatedList
    } = this

    return (
      <>
        <CrudForm>
          {{
            header: () => (
                <CrudHeader title="数据源管理" addButton onAddEvent={onCreate}/>
            ),
            condition: () => (
                <NForm showFeedback={false} label-placement="left" style="margin-bottom: 3px">
                  <NGrid cols="22" x-gap="12">
                    <NFormItemGi label="名称" span="4">
                      <NInput
                          size='small'
                          v-model={[this.searchVal, 'value']}
                          placeholder={`${t('datasource.search_input_tips')}`}
                          clearable
                      />
                    </NFormItemGi>
                    <NFormItemGi span="2">
                      <NButton size='small' color={'#0099CB'} type='primary' onClick={onUpdatedList} style={"padding: 0 15px 0 15px"}>
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
                    columns={columns.columns}
                    data={list}
                    loading={loading}
                    bordered
                    flex-height
                    single-line={false}
                    scrollX={columns.tableWidth}
                    class={"cue-table"}
                />
            ),
            page: () => (
                <CrudPageDs
                    page={page}
                    page-size={pageSize}
                    item-count={itemCount}
                    onPageChange={changePage}
                    onPageSizeChange={changePageSize}
                />
            )
          }}
        </CrudForm>
        <DetailModal
          show={showDetailModal}
          id={id}
          onCancel={() => void (this.showDetailModal = false)}
          onUpdate={onUpdatedList}
        />
      </>
    )
  }
})
export default list
