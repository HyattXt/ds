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

import { reactive, ref } from 'vue'
import { useAsyncState } from '@vueuse/core'
import {
    queryTreeMenu,
    createTreeMenu
} from '@/service/modules/projects'
import type {
    TreeMenuList,
    TreeMenuCreate
} from '@/service/modules/projects/types'

export function useTreemap() {
  const variables = reactive({
      treeData:[],
      saving: false,
      model:{
          parentId: 1,
          titleName: '',
          type: 1,
          projectCode: ''
      }
  })

  const getTreeMenu = (projectCode: number) => {
        queryTreeMenu({
        projectCode
      }).then((res: TreeMenuList) => {
          // @ts-ignore
          variables.treeData = res
      })
  }

    const submitMenuModal = async () => {
        if (variables.saving) return
        variables.saving = true
        try {
            await createTreeMenu(variables.model)
            variables.saving = false
            //resetForm()
            //ctx.emit('confirmModal', props.showModalRef)
        } catch (err) {
            variables.saving = false
        }
    }


  return { variables, getTreeMenu, submitMenuModal }
}
