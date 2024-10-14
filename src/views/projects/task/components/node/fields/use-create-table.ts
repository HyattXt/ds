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

import { Ref } from 'vue'
import type { IJsonItem } from '../types'

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

  return [
    {
      type: 'input',
      field: params.tableField,
      //span: params.spanMiddle || 12,
      span: 0,
      props: {
        placeholder: params.tips
      },
      validate: {
        trigger: ['input', 'blur'],
        required: true,
        message: '表名必填'
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
