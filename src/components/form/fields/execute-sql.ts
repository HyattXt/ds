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
import {NButton, NTooltip,useMessage} from 'naive-ui'
import { isFunction } from 'lodash'
import type { IJsonItem } from '../types'
import axios from "axios";

export function renderExecuteSql( item: IJsonItem, fields: { [field: string]: any }) {
    const { props } = isFunction(item) ? item() : item
    const message = useMessage()
    const formValue = ref({
        id: '',
        sqlStr: ''
    })

    function execute() {
        let getSql = utils.getUrl('createTable/excuteSql')
        formValue.value.id = fields.dataTarget
        formValue.value.sqlStr = fields.tableSql
            axios
            .post(getSql, formValue.value)
            .then(function (response) {
                if(response.data.status ==0 ){
                    message.error(response.data.error)
                }else{
                    message.info(response.data.info)
                }

            })
            .catch(function (error) {
                message.error(error)
            })
    }

    function onClick(){
        if(typeof(fields.dataTarget) == 'undefined'){message.error('请选择目标源')}else execute()
    }

    return  h(NTooltip, {
        placement:'bottom',
        trigger:'hover'
    }, {
        default: () => h( 'span', null, '支持mysql建表'),
        trigger: () => h(NButton, {type: 'info',onClick: () => onClick()},'执行SQL'),
    })
}
