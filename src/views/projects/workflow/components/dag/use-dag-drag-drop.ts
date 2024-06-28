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

import { ref } from 'vue'
import type { Ref } from 'vue'
import type { Graph } from '@antv/x6'
import { genTaskCodeList, saveInit } from '@/service/modules/task-definition'
import { Coordinate, Dragged } from './types'
import { TaskType } from '@/views/projects/task/constants/task-type'
import { useRoute } from 'vue-router'

interface Options {
  readonly: Ref<boolean>
  graph: Ref<Graph | undefined>
  appendTask: (code: number, type: TaskType, coor: Coordinate) => void
  initTaskData: (code: number, type: TaskType, coor: Coordinate, name: string, description: string) => void
}

/**
 * Sidebar item drag && drop in canvas
 */
export function useDagDragAndDrop(options: Options) {
  const { readonly, graph, appendTask, initTaskData } = options

  const route = useRoute()
  const projectCode = Number(route.params.projectCode)

  // The element currently being dragged up
  const dragged = ref<Dragged>({
    x: 0,
    y: 0,
    type: 'SHELL'
  })

  const taskCode = ref()
  const location = ref({
    x: 0,
    y: 0
  })

  function onDragStart(e: DragEvent, type: TaskType) {
    if (readonly.value) {
      e.preventDefault()
      return
    }
    dragged.value = {
      x: e.offsetX,
      y: e.offsetY,
      type: type
    }
  }
  function onDrop(e: DragEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (readonly.value) {
      return
    }
    if (dragged.value && graph.value && projectCode) {
      const { type, x: eX, y: eY } = dragged.value
      const { x, y } = graph.value.clientToLocal(e.clientX, e.clientY)
      const genNums = 1
      genTaskCodeList(genNums, projectCode).then((res) => {
        const [code] = res
        taskCode.value = code
        location.value.x = x - eX
        location.value.y = y - eY
        appendTask(code, type, { x: x - eX, y: y - eY })
      })
    }
  }

  async function commitInitTask(name: string, description: string, processCode: number, datasourceType: String, datasource: Number) {
    let locations = {
      taskCode: taskCode.value,
      x: location.value.x,
      y: location.value.y
    }
    let taskDefinitionJsonObj = {
      "code": taskCode.value,
      "delayTime": "0",
      "description": description,
      "environmentCode": -1,
      "failRetryInterval": "1",
      "failRetryTimes": "0",
      "flag": "YES",
      "name": name,
      "taskParams": {
        "localParams": [],
        "resourceList": [],
        "type": datasourceType,
        "datasource": datasource
      },
      "taskPriority": "MEDIUM",
      "taskType": dragged.value.type,
      "timeout": 0,
      "timeoutFlag": "CLOSE",
      "timeoutNotifyStrategy": "",
      "workerGroup": "default"
    }
    let data = {
      processDefinitionCode: processCode,
      upstreamCodes: '',
      taskDefinitionJsonObj: JSON.stringify(taskDefinitionJsonObj),
      locations: JSON.stringify(locations)
    }
    const res = await saveInit(projectCode, data)
    if(res) {
      window.$message.success('创建成功')
      initTaskData(taskCode.value, dragged.value.type, { x: location.value.x, y: location.value.y }, name, description)
    }
  }

  const preventDefault = (e: DragEvent) => {
    e.preventDefault()
  }

  return {
    dragged,
    onDragStart,
    onDrop,
    commitInitTask,
    onDragenter: preventDefault,
    onDragover: preventDefault,
    onDragleave: preventDefault
  }
}
