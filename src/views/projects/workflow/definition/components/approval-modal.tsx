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

import {defineComponent, inject, onMounted, PropType, toRefs, watch} from 'vue'
import { useI18n } from 'vue-i18n'
import Modal from '@/components/modal'
import { useForm } from './use-form'
import { useModal } from './use-modal'
import { NForm, NFormItem, NButton, NUpload, NIcon, NInput } from 'naive-ui'
import { CloudUploadOutlined } from '@vicons/antd'
import type {WorkflowDefinition} from "@/views/projects/workflow/components/dag/types";

const props = {
  show: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  definition: {
    type: Object as PropType<WorkflowDefinition>,
    default: undefined
  },
  row: {
    type: Object,
    default: {}
  },
}

export default defineComponent({
  name: 'workflowDefinitionApproval',
  props,
  emits: ['update:show', 'update:row', 'updateList'],
  setup(props, ctx) {
    const { approvalState } = useForm()
    const { handleApprovalDefinition } = useModal(approvalState, ctx)
    const refreshTree = inject('refreshTree')
    const hideModal = () => {
      ctx.emit('update:show')
    }

    const handleApproval = async () => {
      handleApprovalDefinition()
      await ctx.emit('updateList')
      if (typeof refreshTree === 'function') {
        refreshTree();
      }
    }

    watch(
        () => props.definition,
        () => {
          approvalState.approvalForm.objNum = props.definition?.processDefinition.code as number
          approvalState.approvalForm.objName = props.definition?.processDefinition.name as string
          approvalState.approvalForm.releaseState = props.definition?.processDefinition.releaseState === 'OFFLINE' ? 1 : 0
        }
    )

    watch(
        () => props.row,
        () => {
          approvalState.approvalForm.objNum = props.row?.code as number
          approvalState.approvalForm.objName = props.row?.name as string
          approvalState.approvalForm.releaseState = props.row?.releaseState === 'OFFLINE' ? 1 : 0
        }
    )

    return {
      hideModal,
      handleApproval,
      ...toRefs(approvalState)
    }
  },

  render() {
    const { t } = useI18n()

    return (
        <Modal
            show={this.$props.show}
            title={t('project.workflow.approval')}
            onCancel={this.hideModal}
            onConfirm={this.handleApproval}
            confirmLoading={this.saving}
        >
          <NForm rules={this.approvalRules} ref='approvalFormRef'>
            <NFormItem label={t('project.workflow.reason')} path='reasonForApplication' label-placement={'left'}>
              <NInput
                  v-model={[this.approvalForm.reasonForApplication, 'value']}
                  placeholder={''}
                  type={'textarea'}
              />
            </NFormItem>
          </NForm>
        </Modal>
    )
  }
})
