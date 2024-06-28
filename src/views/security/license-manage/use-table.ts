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

import { useAsyncState } from '@vueuse/core'
import { reactive, h, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { queryLicense } from '@/service/modules/license'
import { LicenseRes } from '@/service/modules/license/types'


export function useTable() {
  const { t } = useI18n()

  const variables = reactive({
    tableData: {
      productVersion: '',
      licenseStatus: 0,
      licenseDate: '',
      productName: '',
      licenseErrorInfo: '',
      macAddr: '',
      dayDiff: 0,
    },
    showModalRef: ref(false),
    loadingRef: ref(false)
  })

  const getTableData = () => {
    if (variables.loadingRef) return
    variables.loadingRef = true
    const { state } = useAsyncState(
        queryLicense().then((res: LicenseRes) => {
        variables.tableData = res
        variables.loadingRef = false
      }),
      {}
    )

    return state
  }

  return {
    variables,
    getTableData
  }
}
