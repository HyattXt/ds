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

import { defineComponent } from 'vue'
import {
  TaskType,
  TASK_TYPES_MAP,
  TASK_TYPES_MAP_BASIC,
  TASK_TYPES_MAP_REALTIME,
  TASK_TYPES_MAP_OFFLINE
} from '@/views/projects/task/constants/task-type'
import styles from './dag.module.scss'

export default defineComponent({
  name: 'workflow-dag-sidebar',
  emits: ['dragStart'],
  setup(props, context) {
    const allTaskTypes = Object.keys(TASK_TYPES_MAP).map((type) => ({
      type,
      ...TASK_TYPES_MAP[type as TaskType]
    }))
    const allTaskTypesBasic = Object.keys(TASK_TYPES_MAP_BASIC).map((type) => ({
      type,
      ...TASK_TYPES_MAP_BASIC[type as TaskType]
    }))
    const allTaskTypesOffline = Object.keys(TASK_TYPES_MAP_OFFLINE).map((type) => ({
      type,
      ...TASK_TYPES_MAP_OFFLINE[type as TaskType]
    }))
    const allTaskTypesRealtime = Object.keys(TASK_TYPES_MAP_REALTIME).map((type) => ({
      type,
      ...TASK_TYPES_MAP_REALTIME[type as TaskType]
    }))

    return () => (
      <div class={styles.sidebar}>
        <div class={styles.draggable} style={"pointer-events: none; background-color: #0099CB; justify-content: center; color: #ffffff"}>基础任务</div>
        {allTaskTypesBasic.map((task) => (
          <div
            class={[styles.draggable, `task-item-${task.type}`]}
            draggable='true'
            onDragstart={(e) => {
              context.emit('dragStart', e, task.type as TaskType)
            }}
          >
            <em
              class={[
                styles['sidebar-icon'],
                styles['icon-' + task.type.toLocaleLowerCase()]
              ]}
            />
            <span>{task.alias}</span>
          </div>
        ))}
        <div class={styles.draggable} style={"pointer-events: none; background-color: #0099CB; justify-content: center; color: #ffffff"}>离线计算</div>
        {allTaskTypesOffline.map((task) => (
            <div
                class={[styles.draggable, `task-item-${task.type}`]}
                draggable='true'
                onDragstart={(e) => {
                  context.emit('dragStart', e, task.type as TaskType)
                }}
            >
              <em
                  class={[
                    styles['sidebar-icon'],
                    styles['icon-' + task.type.toLocaleLowerCase()]
                  ]}
              />
              <span>{task.alias}</span>
            </div>
        ))}
        <div class={styles.draggable} style={"pointer-events: none; background-color: #0099CB; justify-content: center; color: #ffffff"}>实时计算</div>
        {allTaskTypesRealtime.map((task) => (
            <div
                class={[styles.draggable, `task-item-${task.type}`]}
                draggable='true'
                onDragstart={(e) => {
                  context.emit('dragStart', e, task.type as TaskType)
                }}
            >
              <em
                  class={[
                    styles['sidebar-icon'],
                    styles['icon-' + task.type.toLocaleLowerCase()]
                  ]}
              />
              <span>{task.alias}</span>
            </div>
        ))}
      </div>
    )
  }
})
