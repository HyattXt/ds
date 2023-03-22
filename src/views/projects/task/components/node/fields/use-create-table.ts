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

import { ref, onMounted, nextTick, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { queryDataSourceList } from '@/service/modules/data-source'
import { indexOf, find } from 'lodash'
import type { IJsonItem } from '../types'
import type { TypeReq } from '@/service/modules/data-source/types'
import {useMessage} from "naive-ui";
import {renderCreateSql} from "@/components/form/fields";
import {useDatasource} from "@/views/projects/task/components/node/fields/use-datasource";

export function useCreateTable(
  model: { [field: string]: any },
  params: {
    tableField?: string
    sqlField?: string,
    createField?: string,
    tips?: Ref | string,
    spanShort?: Ref | number
    spanMiddle?: Ref | number
    spanLong?: Ref | number
  } = {}
): IJsonItem[] {
  const { t } = useI18n()
  const message = useMessage()
  const getDatasourceTypes = async () => {

  }

  const refreshOptions = async () => {

  }

  const onClick = (val) => {
    console.log('调试------', val)
    console.log(model[params.tableField])
    model[params.sqlField] = model[params.tableField] + '的建表语句'
    console.log('调试------')
  }

  onMounted(async () => {
    console.log(model[params.tips])
    console.log(params.tips)
  })
  return [
    {
      type: 'input',
      field: params.tableField,
      span: params.spanMiddle || 12,
      props: {
        placeholder: params.tips
      },
      validate: {
        trigger: ['input', 'blur'],
        required: true,
        message: '必须填写表名以获取建表语句'
      }
    },
    {
      type: 'create-sql',
      field: 'create-sql',
      //item: getDatasourceTypes(),
      span: params.spanShort || 5
    },
    {
      type: 'execute-sql',
      field: 'execute-sql',
      span: params.spanShort || 5
    },
    {
      type: 'editor',
      field: params.sqlField,
      name: '建表语句',
      span: params.spanLong || 24
    }
  ]
}
