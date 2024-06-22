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
  NForm, NGrid, NFormItemGi
} from 'naive-ui'
import DetailModal from './detail'
import { SearchOutlined } from '@vicons/antd'
import { useI18n } from 'vue-i18n'
import { useUserInfo } from './use-userinfo'
import { useColumns } from './use-columns'
import { useTable } from './use-table'
import type { IRecord } from './types'

import CrudHeader from "@/components/cue/crud-header.vue";
import CrudForm from "@/components/cue/crud-form.vue";
import CrudPageDs from "@/components/cue/crud-page-ds.vue";

const AlarmInstanceManage = defineComponent({
  name: 'alarm-instance-manage',
  setup() {
    const { t } = useI18n()
    const showDetailModal = ref(false)
    const currentRecord = ref()
    const columns = ref()
    const { IS_ADMIN } = useUserInfo()
    const { data, changePage, changePageSize, deleteRecord, updateList } =
      useTable()

    const { getColumns } = useColumns(
      (record: IRecord, type: 'edit' | 'delete') => {
        if (type === 'edit') {
          showDetailModal.value = true
          currentRecord.value = record
        } else {
          deleteRecord(record.id)
        }
      }
    )

    const onCreate = () => {
      currentRecord.value = null
      showDetailModal.value = true
    }

    const onCloseModal = () => {
      showDetailModal.value = false
      currentRecord.value = {}
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
      IS_ADMIN,
      showDetailModal,
      currentRecord: currentRecord,
      columns,
      ...toRefs(data),
      changePage,
      changePageSize,
      onCreate,
      onCloseModal,
      onUpdatedList: updateList
    }
  },
  render() {
    const {
      t,
      IS_ADMIN,
      currentRecord,
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
      onUpdatedList,
      onCloseModal
    } = this

    return (
      <>
        <CrudForm>
          {{
            header: () => (
                <CrudHeader title="告警实例管理" addButton={IS_ADMIN} onAddEvent={onCreate}/>
            ),
            condition: () => (
                    <NForm showFeedback={false} label-placement="left" style="margin-bottom: 3px">
                      <NGrid cols="22" x-gap="16">
                        <NFormItemGi label="名称" span="4">
                          <NInput
                              size='small'
                              v-model={[this.searchVal, 'value']}
                              clearable
                              placeholder={`${t(
                                  'security.alarm_instance.search_input_tips'
                              )}`}
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
                      columns={columns}
                      data={list}
                      loading={loading}
                      bordered
                      flex-height
                      single-line={false}
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
        {IS_ADMIN && (
          <DetailModal
            show={showDetailModal}
            currentRecord={currentRecord}
            onCancel={onCloseModal}
            onUpdate={onUpdatedList}
          />
        )}
      </>
    )
  }
})
export default AlarmInstanceManage
