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

import {
  defineComponent,
  PropType,
  ref,
  Ref,
  onMounted
} from 'vue'
import { useI18n } from 'vue-i18n'
import {NModal, NCard, NSpace, NButton, NForm, NFormItem, NInput, NSelect, useMessage} from 'naive-ui'
import { useRoute} from 'vue-router'
import type {
  ITaskData,
  EditWorkflowDefinition,
  IWorkflowTaskInstance,
  WorkflowInstance
} from './types'
import type {TypeReq} from "@/service/modules/data-source/types";
import {queryDataSourceList} from "@/service/modules/data-source";
import {find} from "lodash";
import {taskNameExist} from "@/service/modules/task-definition";

const props = {
  show: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  data: {
    type: Object as PropType<ITaskData>,
    default: { code: 0, taskType: 'SHELL', name: '' }
  },
  projectCode: {
    type: Number as PropType<number>,
    required: true,
    default: 0
  },
  processCode: {
    type: Number as PropType<number>,
    required: true,
    default: 0
  },
  type: {
    type: String,
    required: true,
    default: 0
  },
  readonly: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  from: {
    type: Number as PropType<number>,
    default: 0
  },
  definition: {
    type: Object as PropType<Ref<EditWorkflowDefinition>>
  },
  processInstance: {
    type: Object as PropType<WorkflowInstance>
  },
  taskInstance: {
    type: Object as PropType<IWorkflowTaskInstance>
  },
  saving: {
    type: Boolean,
    default: false
  },
  parentId: {
    type: Number,
    default: 0
  }
}

const NodeInitModal = defineComponent({
  name: 'NodeInitModal',
  props,
  emits: ['cancel', 'submit', 'viewLog'],
  setup(props, { emit }) {
    const { t, locale } = useI18n()
    const fromRef = ref()
    const message = useMessage()
    const initForm = ref({
      taskName: '',
      datasourceType: 'MYSQL',
      taskDescription: '',
      datasource: null
    })
    const route = useRoute()
    const datasourceOptions = ref([] as { label: string; value: number }[])
    const rules = {
      taskName: {
        required: true,
        message: '请输入名称',
        trigger: 'blur'
      },
      taskDescription: {
        required: true,
        message: '请输入描述',
        trigger: 'blur'
      },
      datasource: {
        required: true,
        type:"number",
        message: '请选择数据源',
        trigger: 'blur'
      }
    }
    const datasourceTypes = [
      {
        label: 'MYSQL',
        value: 'MYSQL'
      },
      {
        label: 'POSTGRESQL',
        value: 'POSTGRESQL',
      },
      {
        label: 'HIVE',
        value: 'HIVE',
      },
      {
        label: 'SPARK',
        value: 'SPARK',
      },
      {
        label: 'CLICKHOUSE',
        value: 'CLICKHOUSE',
      },
      {
        label: 'ORACLE',
        value: 'ORACLE',
      },
      {
        label: 'SQLSERVER',
        value: 'SQLSERVER',
      },
      {
        label: 'DB2',
        value: 'DB2',
      },
      {
        label: 'PRESTO',
        value: 'PRESTO',
      },
      {
        label: 'REDSHIFT',
        value: 'REDSHIFT',
      },
      {
        label: 'DM',
        value: 'DM',
      }
    ]

    const refreshOptions = async (type: String) => {
      const parameters = { type: type } as TypeReq
      const res = await queryDataSourceList(parameters)
      datasourceOptions.value = res.map((item: any) => ({
        label: item.name,
        value: item.id
      }))
      if (!res.length && initForm.value.datasource ) initForm.value.datasource = null
      if (res.length && initForm.value.datasource) {
        const item = find(res, { id: initForm.value.datasource })
        if (!item) {
          initForm.value.datasource = null
        }
      }
    }

    const onChange = (type : String) => {
      refreshOptions(type)
    }

    const onCancel = () => {
      emit('cancel')
      setTimeout(()=>{
        initForm.value.taskName = ''
        initForm.value.taskDescription = ''
        initForm.value.datasourceType = 'MYSQL'
        initForm.value.datasource = null
      },500)
    }

    const onConfirm = async () => {
      fromRef.value.validate(async (errors: any) => {
        if (!errors) {
          let code = await taskNameExist(props.projectCode, initForm.value.taskName)
          if (!code) {
            emit('submit', initForm.value.taskName, initForm.value.taskDescription, !!props.processCode ? props.processCode : Number(route.query.code), initForm.value.datasourceType, initForm.value.datasource)
            setTimeout(() => {
              initForm.value.taskName = ''
              initForm.value.taskDescription = ''
              initForm.value.datasourceType = 'MYSQL'
              initForm.value.datasource = null
            }, 500)
          }
        } else {
          message.error('验证失败，请填写完整信息')
        }
      })

    }

    onMounted( () => {
      refreshOptions(initForm.value.datasourceType)
    })

    return () => (
      <NModal
          v-model={[props.show, 'show']}
          style={"width: 600px"}
      >
        <NCard title='基本信息'>
          {{
            default: () =>(
                <NForm
                    label-placement="left"
                    label-align="right"
                    label-width="100"
                    size="medium"
                    style={"margin-left: 30px; margin-right: 30px; margin-top: 20px"}
                    ref={fromRef}
                    model={initForm.value}
                    rules={rules}
                >
                  <NFormItem label="节点名称" path={"taskName"}>
                    <NInput
                      v-model:value={initForm.value.taskName}
                    />
                  </NFormItem>
                  <NFormItem label="节点类型">
                    <NSelect
                        disabled={true}
                        v-model:value={props.type}
                    />
                  </NFormItem>
                  {props.data.taskType === 'SQL' && (
                      <div>
                        <NFormItem label="数据源类型">
                          <NSelect
                              v-model:value={initForm.value.datasourceType}
                              options={datasourceTypes}
                              onUpdateValue={onChange}
                          />
                        </NFormItem>
                        <NFormItem label="数据源实例" path={"datasource"}>
                          <NSelect
                              v-model:value={initForm.value.datasource}
                              options={datasourceOptions.value}
                          />
                        </NFormItem>
                      </div>
                  )}
                  <NFormItem label="描述" path={"taskDescription"}>
                    <NInput
                        v-model:value={initForm.value.taskDescription}
                    />
                  </NFormItem>
                </NForm>),
            footer: () => (
                <NSpace justify='end'>
                      <NButton
                          quaternary
                          size='small'
                          onClick={onCancel}
                      >
                        { t('modal.cancel')}
                      </NButton>
                  <NButton
                      type='info'
                      size='small'
                      onClick={onConfirm}
                  >
                    { t('modal.confirm')}
                  </NButton>
                </NSpace>
            )
          }}
        </NCard>

      </NModal>
    )
  }
})

export default NodeInitModal
