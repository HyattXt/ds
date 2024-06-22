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

import { defineComponent, onMounted, ref, toRefs } from 'vue'
import {
  NSpace,
  NInput,
  NButton,
  NIcon,
  NDataTable,
  NPagination,
  NCard, NForm, NGrid, NFormItemGi, NSelect, NDatePicker
} from 'naive-ui'
import { SearchOutlined } from '@vicons/antd'
import { useTable } from './use-table'
import Card from '@/components/card'
import styles from './index.module.scss'
import RuleModal from './components/rule-modal'
import CrudForm from "@/components/cue/crud-form.vue";
import CrudHeader from "@/components/cue/crud-header.vue";
import CrudPageDs from "@/components/cue/crud-page-ds.vue";

const TaskResult = defineComponent({
  name: 'rule',
  setup() {
    const { t, variables, getTableData } = useTable()

    const showModalRef = ref(false)

    const ruleEntryData = ref('')

    const requestTableData = () => {
      getTableData({
        pageSize: variables.pageSize,
        pageNo: variables.page,
        startDate: '',
        endDate: '',
        searchVal: variables.searchVal
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

    const onCancel = () => {
      showModalRef.value = false
    }

    const onConfirm = () => {
      showModalRef.value = false
    }

    const viewRuleEntry = (ruleJson: string) => {
      showModalRef.value = true
      ruleEntryData.value = ruleJson
    }

    onMounted(() => {
      requestTableData()
    })

    return {
      t,
      ...toRefs(variables),
      requestTableData,
      onUpdatePage,
      onUpdatePageSize,
      showModalRef,
      onCancel,
      onConfirm,
      onSearch,
      ruleEntryData,
      viewRuleEntry
    }
  },
  render() {
    const {
      t,
      showModalRef,
      requestTableData,
      onUpdatePage,
      onUpdatePageSize,
      onSearch,
      onCancel,
      onConfirm,
      viewRuleEntry,
      ruleEntryData,
      loadingRef
    } = this

    const { columns } = useTable(viewRuleEntry)

    return (
      <>
        <CrudForm>
          {{
            header: () => (
                <CrudHeader title="规则管理"/>
            ),
            condition: () => (
                <NForm showFeedback={false} label-placement="left" style="margin-bottom: 3px">
                  <NGrid cols="18" x-gap="16">
                    <NFormItemGi label="名称" span="3">
                      <NInput
                          v-model={[this.searchVal, 'value']}
                          size='small'
                          placeholder={t('data_quality.rule.name')}
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
          <RuleModal
            show={showModalRef}
            onCancel={onCancel}
            onConfirm={onConfirm}
            data={ruleEntryData}
          />
        )}
      </>
    )
  }
})

export default TaskResult
