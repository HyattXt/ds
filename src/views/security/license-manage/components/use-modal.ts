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

import { reactive, ref, SetupContext } from 'vue'
import { useI18n } from 'vue-i18n'
import { updateLicense } from '@/service/modules/license'

export function useModal(
  props: any,
  ctx: SetupContext<('cancelModal' | 'confirmModal')[]>
) {
  const { t } = useI18n()

  const variables = reactive({
    LicenseFormRef: ref(),
    licenseInfo: '',
    saving: false,
    rules: {
      licenseInfo: {
        required: true,
        trigger: ['input', 'blur'],
        validator() {
          if (variables.licenseInfo === '') {
            return new Error(t('security.license.input_license'))
          }
        }
      }
    }
  })

  const handleValidate = async () => {
    await variables.LicenseFormRef.validate()

    if (variables.saving) return
    variables.saving = true

    try {
      submitLicenseModal()
      variables.saving = false
    } catch (err) {
      variables.saving = false
    }
  }

  const submitLicenseModal = () => {
    updateLicense( {licenseInfo: variables.licenseInfo} ).then(() => {
        variables.licenseInfo = ''
        ctx.emit('confirmModal', props.showModalRef)
      })
  }

  return {
    variables,
    handleValidate
  }
}
