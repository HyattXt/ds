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

import { useI18n } from 'vue-i18n'
import { useTaskNodeStore } from '@/store/project/task-node'
import { useRelationCustomParams, useTimeoutAlarm } from '.'
import type { IJsonItem } from '../types'
import {nextTick, onMounted, ref} from "vue";
import {queryProcessDefinitionByCode} from "@/service/modules/process-definition";

export function useConditions(
    model: { [field: string]: any },
    projectCode?: number,
    ProcessName?: number): IJsonItem[] {
  const { t } = useI18n()
  const taskStore = useTaskNodeStore()
  const branchFlowOptions = ref(taskStore.postTaskOptions as any)
  const getOtherTaskDefinitionList = async () => {
    branchFlowOptions.value = []
    if(ProcessName && projectCode){
      const res = await queryProcessDefinitionByCode(
          ProcessName || model.PorcessName,
          projectCode
      )
      res?.taskDefinitionList.forEach((item: any) => {
        if (item.code != model.code) {
          branchFlowOptions.value.push({ label: item.name, value: item.code })
        }
      })
    } else return
  }

  const preTaskOptions = taskStore.preTaskOptions.filter((option) =>
    taskStore.preTasks.includes(Number(option.value))
  )
  const stateOptions = [
    { label: t('project.node.success'), value: 'success' },
    { label: t('project.node.failed'), value: 'failed' }
  ]

  onMounted(async () => {
    await nextTick()
    //clearUselessNode(branchFlowOptions.value)
    getOtherTaskDefinitionList()
  })

  return [
    {
      type: 'select',
      field: 'successNode',
      name: t('project.node.state'),
      span: 12,
      props: {
        disabled: true
      },
      options: stateOptions
    },
    {
      type: 'select',
      field: 'successBranch',
      name: t('project.node.branch_flow'),
      span: 12,
      props: {
        clearable: true
      },
      validate: {
        trigger: ['input', 'blur'],
        validator: (unuse, value) => {
          if (value && value === model.failedBranch) {
            return new Error(t('project.node.branch_tips'))
          }
        }
      },
      options: branchFlowOptions
    },
    {
      type: 'select',
      field: 'failedNode',
      name: t('project.node.state'),
      span: 12,
      props: {
        disabled: true
      },
      options: stateOptions
    },
    {
      type: 'select',
      field: 'failedBranch',
      name: t('project.node.branch_flow'),
      span: 12,
      props: {
        clearable: true
      },
      validate: {
        trigger: ['input', 'blur'],
        validator: (unuse, value) => {
          if (value && value === model.successBranch) {
            return new Error(t('project.node.branch_tips'))
          }
        }
      },
      options: branchFlowOptions
    },
    //...useTimeoutAlarm(model),
    ...useRelationCustomParams({
      model,
      children: {
        type: 'custom-parameters',
        field: 'dependItemList',
        span: 18,
        children: [
          {
            type: 'select',
            field: 'depTaskCode',
            span: 10,
            options: branchFlowOptions
          },
          {
            type: 'select',
            field: 'status',
            span: 10,
            options: [
              {
                value: 'SUCCESS',
                label: t('project.node.success')
              },
              {
                value: 'FAILURE',
                label: t('project.node.failed')
              }
            ]
          }
        ]
      },
      childrenField: 'dependItemList',
      name: 'add_pre_task_check_condition'
    })
  ]
}
