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

import {h, ref} from 'vue'
import {NButton, useMessage} from 'naive-ui'
import { isFunction } from 'lodash'
import type { IJsonItem } from '../types'
import axios from "axios";

export function renderCreateSql( item: IJsonItem, fields: { [field: string]: any }) {
    const { props } = isFunction(item) ? item() : item
    const message = useMessage()
    const SecondDevCreateUrl = import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_APP_DEV_API_URL
        : import.meta.env.VITE_APP_PROD_API_URL
    const formValue = ref({
        id: '',
        type: 0,
        tableName: ''
    })

    function execute() {
        let getSql = SecondDevCreateUrl+'/HDataApi/createTable/getCreateSql'
        formValue.value.id = fields.dataSource
        formValue.value.type = parseInt(fields.dsType.replace('MYSQL',0).replace('ORACLE',5))
        formValue.value.tableName = fields.dsType=='ORACLE' || fields.dsType=='SQLSERVER' ? fields.sourceDatabase+'.'+fields.sourceTable : fields.sourceTable
        axios
        .post(getSql, formValue.value)
        .then(function (response) {
            console.log(response)
            if(response.data.status ==0 ){
                message.error(response.data.error)
            }else{
                fields['tableSql'] = response.data.info
            }

        })
        .catch(function (error) {
            message.error(error)
        })

    }
    function onClick(){
        console.log(fields.dataSource)
        if(typeof(fields.dataSource) == 'undefined') {
            message.error('请选择来源库')
        }
        else if(!fields.sourceTable){
            message.error('请输入来源表')
        }
          else  execute()
    }

  return  h(NButton, {
        ...props,
        type:'info',
        onClick: () => onClick()
      },
      {
        default: ()=> {
            return '生成SQL'
        }
      })
}

