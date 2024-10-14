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

import { defineComponent, PropType, toRefs } from 'vue'
import Modal from '@/components/modal'
import { NForm, NFormItem, NInput } from 'naive-ui'
import { useModal } from './use-modal'
import { useI18n } from 'vue-i18n'

const LicenseModal = defineComponent({
  name: 'LicenseModal',
  props: {
    showModalRef: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },
  emits: ['cancelModal', 'confirmModal'],
  setup(props, ctx) {
    const { variables, handleValidate } = useModal(props, ctx)
    const { t } = useI18n()

    const cancelModal = () => {
        variables.licenseInfo = ''
      ctx.emit('cancelModal', props.showModalRef)
    }

    const confirmModal = () => {
      handleValidate()
    }

    return { t, ...toRefs(variables), cancelModal, confirmModal }
  },
  render() {
    const { t } = this
    return (
      <div>
        <Modal
          title={t('security.license.input_license')}
          show={this.showModalRef}
          onCancel={this.cancelModal}
          onConfirm={this.confirmModal}
          confirmDisabled={!this.licenseInfo }
          confirmClassName='btn-submit'
          cancelClassName='btn-cancel'
          confirmLoading={this.saving}
        >
          {{
            default: () => (
              <NForm
                rules={this.rules}
                ref='LicenseFormRef'
              >
                <NFormItem
                  label={"License"}
                  path='licenseInfo'
                >
                  <NInput
                    type="textarea"
                    class='input-queue-name'
                    placeholder={t('security.license.input_license')}
                    v-model={[this.licenseInfo, 'value']}
                  />
                </NFormItem>
              </NForm>
            )
          }}
        </Modal>
      </div>
    )
  }
})

export default LicenseModal
