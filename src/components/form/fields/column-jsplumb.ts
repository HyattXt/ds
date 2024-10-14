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

import {h} from 'vue'
import { isFunction } from 'lodash'
import type { IJsonItem } from '../types'
import styles from '../index.module.scss'

export function renderColumnJsplumb( item: IJsonItem, fields: { [field: string]: any }) {
    const { props, field, fieldLeft, fieldRight } = isFunction(item) ? item() : item

    return h('div',[
        h('div', { class: styles.content,  id: 'plumbContent'  }, [
            h('div', { class: styles.cols }, [
                h('div', { class: styles.top }, '来源表字段'),
                h('ul', { class: styles.bottom }, [
                    field.map((item, index) =>
                        h('li', { key: index, title: item.label }, item.label)
                    )
                ])
            ]),
            h('div', { class: styles.cols }, [
                h('div', { class: styles.top }, '字段类型'),
                h('ul', { class: styles.bottom,  id: 'leftBottom'  }, [
                    field.map((item, index) =>
                        h('li', { key: index,  id: item.id, name: 'source'  }, item.type)
                    )
                ])
            ]),
            h('div', { class: styles.cols }),
            h('div', { class: styles.cols }),
            h('div', { class: styles.cols }, [
                h('div', { class: styles.top }, '写入表字段'),
                h('ul', { class: styles.bottom, id: 'rightBottom'  }, [
                    fieldRight.map((item, index) =>
                        h('li', { key: index, id: item.id, name: 'target', title: item.label  }, item.label)
                    )
                ])
            ]),
            h('div', { class: styles.cols }, [
                h('div', { class: styles.top }, '字段类型'),
                h('ul', { class: styles.bottom }, [
                    fieldRight.map((item, index) =>
                        h('li', { key: index }, item.type)
                    )
                ])
            ]),
        ])])
}

