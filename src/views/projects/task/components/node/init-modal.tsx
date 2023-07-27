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
  watch,
  nextTick,
  provide,
  computed,
  h,
  Ref, renderSlot, unref
} from 'vue'
import { useI18n } from 'vue-i18n'
import Modal from '@/components/modal'
import Detail from './detail'
import { formatModel } from './format-data'
import {
  HistoryOutlined,
  ProfileOutlined,
  QuestionCircleTwotone,
  BranchesOutlined,
  MenuUnfoldOutlined
} from '@vicons/antd'
import {NIcon, NModal, NCard, NSpace, NButton, NForm, NFormItem, NInput, NSelect} from 'naive-ui'
import { TASK_TYPES_MAP } from '../../constants/task-type'
import {Router, useRoute, useRouter} from 'vue-router'
import { querySubProcessInstanceByTaskCode } from '@/service/modules/process-instances'
import { useTaskNodeStore } from '@/store/project/task-node'
import type {
  ITaskData,
  ITaskType,
  EditWorkflowDefinition,
  IWorkflowTaskInstance,
  WorkflowInstance
} from './types'
import styles from "./index.module.scss";
import ButtonLink from "@/components/button-link";

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
  }
}

const NodeInitModal = defineComponent({
  name: 'NodeInitModal',
  props,
  emits: ['cancel', 'submit', 'viewLog'],
  setup(props, { emit }) {
    const { t, locale } = useI18n()
    const router: Router = useRouter()
    const taskStore = useTaskNodeStore()
    const showModal = unref(props.show)
    const taskName = ref('')
    const taskDescription = ref('')
    const route = useRoute()

    const onCancel = () => {
      emit('cancel')
    }

    const onConfirm = async () => {
      emit('submit',taskName.value,taskDescription.value, !!props.processCode ? props.processCode : Number(route.query.code))
      taskName.value = ''
      taskDescription.value = ''
    }

    return () => (
      <NModal
          v-model={[props.show, 'show']}
          class={ styles.initTaskContainer }
      >
        <NCard title='基本信息'>
          {{
            default: () =>(
                <NForm
                    label-placement="left"
                    size="medium"
                    style={"margin-left: 30px; margin-right: 30px; margin-top: 20px"}
                >
                  <NFormItem label="节点名称">
                    <NInput
                      v-model:value={taskName.value}
                    />
                  </NFormItem>
                  <NFormItem label="节点类型">
                    <NSelect
                        disabled={true}
                        v-model:value={props.type}
                    />
                  </NFormItem>
                  <NFormItem label="描述">
                    <NInput
                        v-model:value={taskDescription.value}
                    />
                  </NFormItem>
                </NForm>),
            footer: () => (
                <NSpace justify='end'>
                      <NButton
                         // class={[this.cancelClassName, 'btn-cancel']}
                          quaternary
                          size='small'
                          onClick={onCancel}
                      >
                        { t('modal.cancel')}
                      </NButton>
                  <NButton
                      //class={[this.confirmClassName, 'btn-submit']}
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
