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
import {
    queryTreeMenu,
    createTreeMenu, queryTreeFolder, renameTreeMenu, renameWorkflow, moveFolder, delFolder, moveWorkflow
} from '@/service/modules/projects'
import type {
    TreeMenuList
} from '@/service/modules/projects/types'
import {deleteByCode} from "@/service/modules/process-definition";

export function useTreemap() {
  const variables = ref({
      treeData:[],
      folderData:[],
      saving: false,
      loading: true,
      taskCode: 1,
      readOnly: false,
      model:{
          parentId: 1,
          titleName: '',
          type: 1,
          projectCode: ''
      },
      renameFolderModel:{
          id: 1,
          name: ''
      },
      renameWorkflowModel:{
          taskCode: 1,
          name: ''
      },
      moveFolderModel:{
          parentId: 1,
          id: 1
      },
      moveWorkflowModel:{
          parentId: 1,
          taskCode: 1
      },
      delFolderModel:{
          id: 1
      },
  })

  const getTreeMenu = (projectCode: number) => {
      variables.value.loading = true
        queryTreeMenu({
        projectCode
      }).then((res: TreeMenuList) => {
          // @ts-ignore
          variables.value.treeData = res
          variables.value.loading = false
      })
  }

    const getTreeFolder = (projectCode: number) => {
        queryTreeFolder({
            projectCode
        }).then((res: TreeMenuList) => {
            // @ts-ignore
            variables.value.folderData = res
        })
    }

    const submitMenuModal = async () => {
        if (variables.value.saving) return
        variables.value.saving = true
        try {
            await createTreeMenu(variables.value.model)
            window.$message.success("创建成功")
            variables.value.saving = false
        } catch (err) {
            variables.value.saving = false
        }
    }

    const renameMenuModal = async (projectCode: number) => {
        if (variables.value.saving) return
        variables.value.saving = true
        try {
            await renameTreeMenu(projectCode, variables.value.renameFolderModel)
            window.$message.success("重命名成功")
            variables.value.saving = false
        } catch (err) {
            variables.value.saving = false
        }
    }

    const renameWorkflowModal = async (projectCode: number) => {
        if (variables.value.saving) return
        variables.value.saving = true
        try {
            await renameWorkflow(projectCode, variables.value.renameWorkflowModel)
            window.$message.success("重命名成功")
            variables.value.saving = false
        } catch (err) {
            variables.value.saving = false
        }
    }

    const moveFolderModal = async (projectCode: number) => {
        if (variables.value.saving) return
        variables.value.saving = true
        try {
            await moveFolder(projectCode, variables.value.moveFolderModel)
            window.$message.success("移动成功")
            variables.value.saving = false
        } catch (err) {
            variables.value.saving = false
        }
    }

    const moveWorkflowModal = async (projectCode: number) => {
        if (variables.value.saving) return
        variables.value.saving = true
        try {
            await moveWorkflow(projectCode, variables.value.moveWorkflowModel)
            window.$message.success("移动成功")
            variables.value.saving = false
        } catch (err) {
            variables.value.saving = false
        }
    }

    const delFolderModal = async () => {
        if (variables.value.saving) return
        variables.value.saving = true
        try {
            await delFolder(variables.value.delFolderModel)
            window.$message.success("删除成功")
            variables.value.saving = false
        } catch (err) {
            variables.value.saving = false
        }
    }

    const deleteWorkflow = async (projectCode: number) => {
        deleteByCode(projectCode, variables.value.taskCode).then(() => {
            window.$message.success('删除成功')
        })
    }


  return { variables, getTreeMenu, submitMenuModal, getTreeFolder, renameMenuModal, renameWorkflowModal, moveFolderModal, moveWorkflowModal, delFolderModal, deleteWorkflow }
}
