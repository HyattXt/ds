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

import { ref, defineComponent, toRefs, reactive, onMounted } from 'vue'
import {
  NButton,
  NIcon,
  NInput,
  NDataTable,
  NForm, NGrid, NFormItemGi
} from 'naive-ui'
import { SearchOutlined } from '@vicons/antd'
import { useI18n } from 'vue-i18n'
import { useTable } from './use-table'
import FormModal from './components/form-modal'
import CrudForm from "@/components/cue/crud-form.vue";
import CrudHeader from "@/components/cue/crud-header.vue";
import CrudPageDs from "@/components/cue/crud-page-ds.vue";

const taskGroupOption = defineComponent({
  name: 'taskGroupOption',
  setup() {
    const { t } = useI18n()
    const { variables, getTableData } = useTable()
    const showModalRef = ref(false)
    const modelStatusRef = ref(0)

    const searchParamRef = ref()

    const updateItemData = reactive({
      id: 0,
      name: '',
      projectCode: 0,
      groupSize: 0,
      status: 1,
      description: ''
    })

    const requestData = () => {
      getTableData({
        pageSize: variables.pageSize,
        pageNo: variables.page,
        name: variables.name
      })
    }

    const resetTableData = () => {
      getTableData({
        pageSize: variables.pageSize,
        pageNo: variables.page,
        name: variables.name
      })
    }

    const onUpdatePage = (page: number) => {
      variables.page = page
      requestData()
    }

    const onCancel = () => {
      showModalRef.value = false
    }

    const onConfirm = () => {
      showModalRef.value = false
      resetTableData()
    }

    const onUpdatePageSize = (pageSize: number) => {
      variables.page = 1
      variables.pageSize = pageSize
      resetTableData()
    }

    const updateItem = (
      id: number,
      name: string,
      projectCode: number,
      groupSize: number,
      description: string
    ) => {
      modelStatusRef.value = 1
      showModalRef.value = true
      updateItemData.id = id
      updateItemData.name = name
      updateItemData.projectCode = projectCode
      updateItemData.groupSize = groupSize
      updateItemData.description = description
    }

    const onSearch = () => {
      resetTableData()
    }

    const onCreate = () => {
      modelStatusRef.value = 0
      showModalRef.value = true
    }

    onMounted(() => {
      requestData()
    })

    return {
      ...toRefs(variables),
      t,
      onCreate,
      onSearch,
      searchParamRef,
      resetTableData,
      onUpdatePage,
      onUpdatePageSize,
      updateItem,
      showModalRef,
      modelStatusRef,
      onCancel,
      onConfirm,
      updateItemData
    }
  },
  render() {
    const {
      t,
      showModalRef,
      modelStatusRef,
      onCancel,
      onConfirm,
      updateItemData,
      resetTableData,
      onUpdatePage,
      onUpdatePageSize,
      updateItem,
      onSearch,
      loadingRef
    } = this

    const { columns } = useTable(updateItem, resetTableData)

    return (
      <>
        <CrudForm>
          {{
            header: () => (
                <CrudHeader title="任务组配置" addButton onAddEvent={() => this.onCreate()}/>
            ),
            condition: () => (
                <NForm showFeedback={false} label-placement="left" style="margin-bottom: 3px">
                  <NGrid cols="18" x-gap="16">
                    <NFormItemGi label="名称" span="3">
                      <NInput
                          size='small'
                          clearable
                          v-model={[this.name, 'value']}
                          placeholder={t(
                              'resource.task_group_option.please_enter_keywords'
                          )}
                      ></NInput>
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
                    columns={columns}
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
        {showModalRef && (
          <FormModal
            show={showModalRef}
            onCancel={onCancel}
            onConfirm={onConfirm}
            data={updateItemData}
            status={modelStatusRef}
          />
        )}
      </>
    )
  }
})

export default taskGroupOption
