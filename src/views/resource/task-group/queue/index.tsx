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

import { ref, defineComponent, toRefs, reactive, onMounted, Ref } from 'vue'
import {
  NButton,
  NIcon,
  NInput,
  NDataTable,
  NSelect,
  NForm, NGrid, NFormItemGi
} from 'naive-ui'
import { SearchOutlined } from '@vicons/antd'
import { useI18n } from 'vue-i18n'
import { useTable } from './use-table'
import FormModal from '@/views/resource/task-group/queue/components/form-modal'
import { queryTaskGroupListPaging } from '@/service/modules/task-group'
import { TaskGroupRes } from '@/service/modules/task-group/types'
import { SelectMixedOption } from 'naive-ui/lib/select/src/interface'
import { Router, useRouter } from 'vue-router'
import CrudHeader from "@/components/cue/crud-header.vue";
import CrudPageDs from "@/components/cue/crud-page-ds.vue";
import CrudForm from "@/components/cue/crud-form.vue";

const taskGroupQueue = defineComponent({
  name: 'taskGroupQueue',
  setup() {
    const router: Router = useRouter()
    const { t } = useI18n()
    const { variables, getTableData } = useTable()
    const showModalRef = ref(false)
    const taskGroupOptions: Ref<Array<SelectMixedOption>> = ref([])

    const idRef = ref(Number(router.currentRoute.value.params.id))

    const searchParamRef = reactive({
      groupId: ref<number | null>(),
      processName: '',
      instanceName: '',
      pageSize: 10,
      pageNo: 1
    })

    let updateItemData = reactive({
      queueId: 0,
      priority: 0
    })

    const resetTableData = () => {
      getTableData({
        pageSize: variables.pageSize,
        pageNo: variables.page,
        groupId: searchParamRef.groupId,
        taskInstanceName: searchParamRef.instanceName,
        processInstanceName: searchParamRef.processName
      })
    }

    const onUpdatePage = (page: number) => {
      variables.page = page
      resetTableData()
    }

    const onCancel = () => {
      showModalRef.value = false
    }

    const onConfirm = () => {
      showModalRef.value = false
      updateItemData = {
        queueId: 0,
        priority: 0
      }
      resetTableData()
    }

    const onUpdatePageSize = (pageSize: number) => {
      variables.page = 1
      variables.pageSize = pageSize
      resetTableData()
    }

    const updatePriority = (queueId: number, priority: number) => {
      showModalRef.value = true
      updateItemData.queueId = queueId
      updateItemData.priority = priority
    }

    const onSearch = () => {
      resetTableData()
    }

    onMounted(() => {
      const taskGroupOptionsParams = {
        pageNo: 1,
        pageSize: 2147483647
      }
      if (idRef.value) {
        searchParamRef.groupId = idRef.value
      }
      queryTaskGroupListPaging(taskGroupOptionsParams).then(
        (res: TaskGroupRes) => {
          res.totalList.map((item) => {
            const option: SelectMixedOption = {
              label: item.name,
              value: item.id
            }
            taskGroupOptions.value.push(option)
          })
        }
      )

      resetTableData()
    })

    return {
      ...toRefs(variables),
      t,
      onSearch,
      searchParamRef,
      resetTableData,
      onUpdatePage,
      onUpdatePageSize,
      updatePriority,
      onCancel,
      onConfirm,
      showModalRef,
      updateItemData,
      taskGroupOptions
    }
  },
  render() {
    const {
      t,
      resetTableData,
      onUpdatePage,
      onUpdatePageSize,
      updatePriority,
      onCancel,
      onConfirm,
      onSearch,
      showModalRef,
      updateItemData,
      taskGroupOptions,
      loadingRef
    } = this

    const { columns } = useTable(updatePriority, resetTableData)

    return (
      <>
        <CrudForm>
          {{
            header: () => (
                <CrudHeader title="任务组队列"/>
            ),
            condition: () => (
                <NForm showFeedback={false} label-placement="left" style="margin-bottom: 3px">
                  <NGrid cols="18" x-gap="16">
                    <NFormItemGi label="任务组名称" span="3">
                      <NSelect
                          size='small'
                          options={taskGroupOptions}
                          clearable
                          style={{ width: '180px' }}
                          v-model:value={this.searchParamRef.groupId}
                          placeholder={t('resource.task_group_queue.task_group_name')}
                      />
                    </NFormItemGi>
                    <NFormItemGi label="工作流实例" span="3">
                      <NInput
                          size='small'
                          clearable
                          v-model={[this.searchParamRef.processName, 'value']}
                          placeholder={t(
                              'resource.task_group_queue.workflow_instance_name'
                          )}
                      />
                    </NFormItemGi>
                    <NFormItemGi label="任务实例" span="3">
                      <NInput
                          size='small'
                          clearable
                          v-model={[this.searchParamRef.instanceName, 'value']}
                          placeholder={t('resource.task_group_queue.task_instance_name')}
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
          />
        )}
      </>
    )
  }
})

export default taskGroupQueue
