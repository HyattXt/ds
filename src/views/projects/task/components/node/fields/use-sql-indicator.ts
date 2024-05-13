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

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { IJsonItem } from '../types'

export function useSqlIndicator(model: { [field: string]: any }): IJsonItem[] {
  const { t } = useI18n()
  const span = computed(() => (model.indicatorStatus === 1  ? 12 : 0))

  return [
    {
      type: 'switch',
      field: 'indicatorStatus',
      span: 12,
      props:{
        checkedValue : 1,
        uncheckedValue : 2
      },
      name: t('project.node.if_index')
    },
    {
      type: 'input',
      field: 'indicatorCode',
      name: t('project.node.index_code'),
      props: {
        placeholder: t('project.node.index_code')
      },
      span: span,
      validate: {
        trigger: ['input', 'blur'],
        required: true
      }
    }
  ]
}
