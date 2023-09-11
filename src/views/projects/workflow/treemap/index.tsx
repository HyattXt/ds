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

import {defineComponent, onMounted, ref, unref, h, nextTick, VNode} from 'vue'
import {DropdownGroupOption, DropdownOption, NIcon, NPopconfirm, TreeOption, useMessage} from 'naive-ui'
import Detail from '../definition/detail'
import {AlignLeftOutlined, DownOutlined, FolderTwotone, SearchOutlined, ApartmentOutlined, ConsoleSqlOutlined} from '@vicons/antd';
import Styles from "@/views/projects/workflow/treemap/index.module.scss";
import {useThemeStore} from "@/store/theme/theme";
import {useRoute} from "vue-router";
import {useTreemap} from "@/views/projects/workflow/treemap/use-treemap";
import { createProcessDefinition } from '@/service/modules/process-definition'
import {useI18n} from "vue-i18n";

export default defineComponent({
    name: 'WorkflowTreeMap',
    setup() {
        const message = useMessage()
        const { t } = useI18n()
        const { variables, getTreeMenu, submitMenuModal, getTreeFolder, renameMenuModal, renameWorkflowModal, moveFolderModal, moveWorkflowModal, delFolderModal, deleteWorkflow} = useTreemap()
        const route = useRoute()
        const pattern = ref('');
        const expandedKeys = ref([]);
        const theme = useThemeStore()
        const projectCode = Number(route.params.projectCode)
        const formRef: any = ref(null)
        const linkage = ref({
            code: 0,
            type: 0,
            parentId: 0
        })
        const workflowModel = ref({
            parentId: 1,
            type: 2,
            projectCode: projectCode,
            name: ''
        })
        const tsxRef = ref()
        const menuModal = ref(false)
        const workflowModal = ref(false)
        const reFolderModal = ref(false)
        const reWorkflowModal = ref(false)
        const mvFolderModal = ref(false)
        const mvWorkflowModal = ref(false)
        const showDropdownRef = ref(false)
        const xRef = ref(0)
        const yRef = ref(0)
        const dropdownOption = ref([{label: '', key: '',disable: false}])
        const defaultFolder = ref(1)
        const addMenuOptions = ref([
            {
                label: '新建文件夹',
                key: 'menu'
            },
            {
                label: '新建工作流',
                key: 'workflow'
            },
        ]);

        const rules = {
            model:{
                titleName: {
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }
            },
            value:{
                name:{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }
            },
            renameFolderModel:{
                name:{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }
            },
            renameWorkflowModel:{
                name:{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }
            }
        }

        onMounted(() => {
            getTreeMenu(projectCode)
            getTreeFolder(projectCode)
            // @ts-ignore
            variables.model.projectCode = projectCode
            if( typeof(route.query.code) != 'undefined' )tsxRef.value.refresh(route.query.code, projectCode)
        })

        function createMenu() {
            formRef.value.validate((errors: any) => {
                if (!errors) {
                    submitMenuModal().then(r => {
                            getTreeMenu(projectCode)
                            getTreeFolder(projectCode)
                        }
                    )
                    menuModal.value = false
                } else {
                    message.error('验证失败，请填写完整信息')
                }
            })
        }

        function renameMenu() {
            formRef.value.validate((errors: any) => {
                if (!errors) {
                    renameMenuModal(projectCode).then(r => {
                            getTreeMenu(projectCode)
                            getTreeFolder(projectCode)
                        }
                    )
                    reFolderModal.value = false
                } else {
                    message.error('验证失败，请填写完整信息')
                }
            })
        }

        function moveWorkflow() {
            moveWorkflowModal(projectCode).then(r => {
                    getTreeMenu(projectCode)
                    getTreeFolder(projectCode)
                }
            )
            mvWorkflowModal.value = false
        }

        function moveMenu() {
            moveFolderModal(projectCode).then(r => {
                    getTreeMenu(projectCode)
                    getTreeFolder(projectCode)
                }
            )
            mvFolderModal.value = false
        }

        function delMenu() {
            delFolderModal().then(r => {
                    showDropdownRef.value = false
                    getTreeMenu(projectCode)
                    getTreeFolder(projectCode)
                }
            )
        }

        function delWorkflow() {
            deleteWorkflow(projectCode).then(r => {
                    showDropdownRef.value = false
                    getTreeMenu(projectCode)
                    getTreeFolder(projectCode)
                }
            )
        }

        function renameWorkflow() {
            formRef.value.validate((errors: any) => {
                if (!errors) {
                    renameWorkflowModal(projectCode).then(r => {
                            getTreeMenu(projectCode)
                        }
                    )
                    reWorkflowModal.value = false
                } else {
                    message.error('验证失败，请填写完整信息')
                }
            })
        }

        function createWorkFlow(){
            formRef.value.validate((errors: any) => {
                if (!errors) {
                    createProcessDefinition(
                        {
                            parentId: workflowModel.value.parentId,
                            projectCode: workflowModel.value.projectCode,
                            type: workflowModel.value.type,
                            name: workflowModel.value.name,
                        },
                        projectCode
                    ).then((ignored: any) => {
                        message.success(t('project.dag.success'))
                        workflowModal.value = false
                        getTreeMenu(projectCode)
                        getTreeFolder(projectCode)
                    })
                } else {
                    message.error('验证失败，请填写完整信息')
                }
            })
        }

        function packHandle() {
            if (expandedKeys.value.length) {
                expandedKeys.value = [];
            } else {
                // @ts-ignore
                setId(unref(variables.treeData))
                //expandedKeys.value = unref(variables.treeData).map((item: any) => item.id as string) as [];
            }
        }
        function setId(datas: []) { //遍历树  获取id数组
            for (let i in datas) {
                // @ts-ignore
                expandedKeys.value.push(datas[i].id)  // 遍历项目满足条件后的操作
                // @ts-ignore
                if (datas[i].children) {  //存在子节点就递归
                    // @ts-ignore
                    setId(datas[i].children);
                }
            }
        }

        function onExpandedKeys(keys: never[]) {
            expandedKeys.value = keys;
        }

        function ifShowModal(key: string){
            variables.model.titleName = ''
            variables.model.parentId = 1
            workflowModel.value.parentId = 1
            key == 'menu' ? menuModal.value = true : workflowModal.value = true;
        }

        function  onClickoutside () {
            showDropdownRef.value = false
        }
        function handleSelect (key: string,option: TreeOption) {
            if(option.key !== 'deleteMenu' && option.key !== 'deleteWorkflow') {showDropdownRef.value = false}
            switch(option.key){
                case 'menu': {menuModal.value = true } break
                case 'workflow': {workflowModal.value = true } break
                case 'renameMenu': {reFolderModal.value = true } break
                case 'renameWorkflow': {reWorkflowModal.value = true } break
                case 'removeMenu': {mvFolderModal.value = true } break
                case 'removeWorkflow': {mvWorkflowModal.value = true } break
            }
        }
        const menu = ({ option }: { option: TreeOption }) => {
            return {
                onContextmenu(e: MouseEvent) {
                    e.preventDefault()
                    showDropdownRef.value = false
                    variables.delFolderModel.id = variables.moveFolderModel.id = variables.model.parentId = workflowModel.value.parentId = variables.renameFolderModel.id = option.id as number
                    variables.moveWorkflowModel.taskCode = variables.taskCode = variables.renameWorkflowModel.taskCode = option.taskCode as number
                    if(option.type == 1) {
                        dropdownOption.value =[
                            {
                                label: '新建文件夹',
                                key: 'menu',
                                disable: false
                            },
                            {
                                label: '新建工作流',
                                key: 'workflow',
                                disable: false
                            },
                            {
                                label: '重命名',
                                key: 'renameMenu',
                                disable: false
                            },
                            {
                                label: '移动',
                                key: 'removeMenu',
                                disable: false
                            },
                            {
                                label: '删除',
                                key: 'deleteMenu',
                                disable: true
                            },
                        ]
                    }
                    if(option.type == 2){
                        dropdownOption.value = [
                            {
                                label: '重命名',
                                key: 'renameWorkflow',
                                disable: false
                            },
                            /*{
                                label: '复制',
                                key: 'copyWorkflow',
                                disable: false
                            },
                            {
                                label: '导出',
                                key: 'exportWorkflow',
                                disable: false
                            },*/
                            {
                                label: '移动',
                                key: 'removeWorkflow',
                                disable: false
                            },
                            {
                                label: '删除',
                                key: 'deleteWorkflow',
                                disable: true
                            },
                        ];
                    }
                    if(option.type == null){
                        dropdownOption.value = [
                            /*{
                                label: '运行',
                                key: 'run',
                                disable: false
                            },
                            {
                                label: '编辑',
                                key: 'edit',
                                disable: false
                            },
                            {
                                label: '复制',
                                key: 'copyTask',
                                disable: false
                            },
                            {
                                label: '删除',
                                key: 'deleteTask',
                                disable: true
                            },*/
                        ];
                    }
                    nextTick().then(() => {
                        showDropdownRef.value = true
                        xRef.value = e.clientX
                        yRef.value = e.clientY
                    })
                },
                ondblclick() {
                    //双击事件
                    linkage.value.type = 0
                    linkage.value.code = option.taskCode as number
                    linkage.value.type = option.type as number
                    linkage.value.parentId = option.parentId as number
                    if(option.type == 2) {tsxRef.value.refresh(linkage.value.code, projectCode) }
                    if(option.type == null) {}//message.info("打开任务节点还在开发")
                    }
                }
        }

        const menuIcon = ({ option }: { option: TreeOption }) => {
             switch (option.type){
                 case 1 : return h(<svg class="icon" viewBox="0 0 1260 1024" xmlns="http://www.w3.org/2000/svg" width="19.688" height="16"><defs><style/></defs><path d="M1171.561 157.538H601.797L570.814 61.44A88.222 88.222 0 00486.794 0H88.747A88.747 88.747 0 000 88.747v846.506A88.747 88.747 0 0088.747 1024H1171.56a88.747 88.747 0 0088.747-88.747V246.285a88.747 88.747 0 00-88.747-88.747zm-1082.814 0V88.747h398.047l22.055 68.791z" fill="#0099FF"/></svg>)
                 case 2 : return h(<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><g data-name="矩形 256" stroke="#0099FF" fill="none"><rect width="24" height="24" rx="4" stroke="none"/><rect x=".5" y=".5" width="23" height="23" rx="3.5"/></g><path data-name="路径 735" d="M19.008 16.948a.2.2 0 01-.057.145.2.2 0 01-.142.061h-3.6a.2.2 0 01-.2-.2v-2.61a.2.2 0 01.057-.147.2.2 0 01.145-.059h3.59a.2.2 0 01.143.056.2.2 0 01.062.142v2.614zm-8.835-8.916a.2.2 0 01-.14-.058.2.2 0 01-.058-.142V5.215a.2.2 0 01.057-.146.2.2 0 01.142-.061h3.623a.2.2 0 01.141.061.2.2 0 01.055.145v2.618a.2.2 0 01-.053.142.194.194 0 01-.137.062h-3.63zm-1.39 6.09a.2.2 0 01.143.056.2.2 0 01.061.143v2.624a.223.223 0 01-.2.23H5.209a.224.224 0 01-.2-.23v-2.613a.2.2 0 01.056-.145.2.2 0 01.141-.062h3.577zm8.732-1.01v-2.604h-4.949V9.065h1.307c.675 0 1.129-.309 1.129-.992V5.216A1.136 1.136 0 0013.873 4H9.994c-.675 0-1.018.532-1.018 1.216v2.857c0 .683.344.992 1.018.992h1.412v1.443H6.48v2.608H4.988c-.673 0-.987.286-.987.967v2.867c0 .682.314 1.05.987 1.05h4.029c.675 0 .976-.369.976-1.051v-2.866c0-.683-.3-.967-.976-.967H7.5v-1.692h8.993v1.692h-1.6c-.674 0-.868.286-.868.967v2.867c0 .682.194 1.05.868 1.05h4.1A.916.916 0 0020 16.949v-2.866c0-.683-.331-.967-1.007-.967h-1.478z" fill="#0099FF"/></svg>)
                 default: {
                     // @ts-ignore
                     let url= '/HData/ui/images/task-icons/'+option.taskType.toLocaleLowerCase()+'_hover.png'
                     return h(<img src={url} width="24" height="24"/>)
                 }
            }
        }

        const dropdownConfirm = ({ node, option }: { node: VNode, option: DropdownOption|DropdownGroupOption }) => {
            if (option.key !== 'deleteMenu' && option.key !== 'deleteWorkflow') {
                return node
            }else{
                return h(
                    NPopconfirm,
                    {
                        onPositiveClick: () => {
                            if (option.key == 'deleteMenu') {
                                delMenu()
                            } else if (option.key == 'deleteWorkflow') {
                                delWorkflow()
                            }
                        }},
                    {
                        trigger: () => [node],
                        default: () => '确定'+option.label+'?'
                    }
                )
            }
        }


        return () =>
            (
                <div
                    class={[
                        theme.darkTheme ? Styles['dark'] : Styles['light'],
                    ]}
                >
                    <n-grid x-gap="2" cols="5">
                        <n-gi span="1">
                            <div>
                            <n-card
                                v-slots={{
                                    header: () => (
                                        <div>
                                            <n-grid x-gap="2" cols="2">
                                                <n-gi span="1">
                                                    <n-button type="info" ghost icon-placement="left" onClick={packHandle}>
                                                    {expandedKeys.value.length ? '收起' : '展开'}
                                                    <div>
                                                        <n-icon size="14">
                                                            <AlignLeftOutlined/>
                                                        </n-icon>
                                                    </div>
                                                    </n-button>
                                                </n-gi>
                                                <n-gi span="1">
                                                    <n-dropdown trigger="click" options={addMenuOptions.value} onSelect={ifShowModal}>
                                                        <n-button type="info" ghost icon-placement="right">
                                                            新建
                                                            <n-icon size="14">
                                                                <DownOutlined/>
                                                            </n-icon>
                                                        </n-button>
                                                    </n-dropdown>
                                                </n-gi>
                                            </n-grid>
                                        </div>
                                    )
                                }}
                            >
                                <n-input
                                    type="text"
                                    v-model:value={pattern.value}
                                    placeholder="输入菜单名称搜索"
                                    v-slots={{
                                        suffix: () => (
                                            <n-icon size="14">
                                                <SearchOutlined/>
                                            </n-icon>
                                        )
                                    }}
                                />
                                <div class={Styles.container}>
                                    <n-spin show={variables.loading}>
                                    <n-tree
                                        class={Styles.treeSize}
                                        block-line
                                        show-irrelevant-nodes={false}
                                        pattern={pattern.value}
                                        data={variables.treeData}
                                        key-field="id"
                                        label-field="titleName"
                                        children-field="children"
                                        onUpdate:expanded-keys={onExpandedKeys}
                                        expanded-keys={expandedKeys.value}
                                        node-props={menu}
                                        render-prefix={menuIcon}
                                    />
                                    </n-spin>
                                </div>
                                <n-dropdown
                                    placement="bottom-start"
                                    trigger="manual"
                                    x={xRef.value}
                                    y={yRef.value}
                                    options={dropdownOption.value}
                                    show={showDropdownRef.value}
                                    on-clickoutside={onClickoutside}
                                    on-select={handleSelect}
                                    render-option={dropdownConfirm}
                                />
                            </n-card>
                            </div>
                        </n-gi>
                        <n-gi span="4">
                            <div>
                            <Detail
                               ref={tsxRef}
                               projectCode={projectCode}
                               code={Number(linkage.value.code)}
                               parentId={linkage.value.parentId}
                            />
                            </div>
                        </n-gi>
                    </n-grid>
                    <n-modal
                        v-model:show={menuModal.value}
                        class={Styles.menuModal}
                    >
                        <n-card title="新建文件夹" size="huge">
                            <n-form
                                ref={formRef}
                                label-placement="left"
                                label-width="auto"
                                rules={rules}
                                model={variables}
                            >
                                <n-form-item label="文件夹名称" path="model.titleName">
                                    <n-input
                                        type="text"
                                        v-model:value={variables.model.titleName}
                                        placeholder="输入文件夹名称"
                                    />
                                </n-form-item>
                                <n-form-item label="目标文件夹" path="inputValue">
                                    <n-tree-select
                                        options={variables.folderData}
                                        key-field="id"
                                        label-field="titleName"
                                        v-model:value={variables.model.parentId}
                                        filterable
                                    />
                                </n-form-item>
                            </n-form>
                            <n-space justify="end">
                                <n-button type="info" onClick={createMenu} >确定</n-button>
                            </n-space>
                        </n-card>
                    </n-modal>
                    <n-modal
                        v-model:show={reFolderModal.value}
                        class={Styles.reName}
                    >
                        <n-card title="重命名文件夹" size="huge">
                            <n-form
                                ref={formRef}
                                label-placement="left"
                                label-width="auto"
                                rules={rules}
                                model={variables}
                            >
                                <n-form-item label="文件夹名称" path="renameFolderModel.name">
                                    <n-input
                                        type="text"
                                        v-model:value={variables.renameFolderModel.name}
                                        placeholder="输入文件夹名称"
                                    />
                                </n-form-item>
                            </n-form>
                            <n-space justify="end">
                                <n-button type="info" onClick={renameMenu}>确定</n-button>
                            </n-space>
                        </n-card>
                    </n-modal>
                    <n-modal
                        v-model:show={mvFolderModal.value}
                        class={Styles.reName}
                    >
                        <n-card title="移动文件夹" size="huge">
                            <n-form
                                label-placement="left"
                                label-width="auto"
                                rules={rules}
                                model={variables}
                            >
                                <n-form-item label="目标文件夹" path="inputValue">
                                    <n-tree-select
                                        options={variables.folderData}
                                        key-field="id"
                                        label-field="titleName"
                                        v-model:value={variables.moveFolderModel.parentId}
                                        filterable
                                    />
                                </n-form-item>
                            </n-form>
                            <n-space justify="end">
                                <n-button type="info" onClick={moveMenu} >确定</n-button>
                            </n-space>
                        </n-card>
                    </n-modal>
                    <n-modal
                        v-model:show={workflowModal.value}
                        class={Styles.workflowModal}
                    >
                        <n-card title="新建工作流" size="huge">
                            <n-space vertical>
                            <n-form
                                ref={formRef}
                                label-placement="left"
                                label-width="auto"
                                rules={rules}
                                model={workflowModel}
                            >
                                <n-form-item label="工作流名称" path="value.name">
                                    <n-input
                                        type="text"
                                        v-model:value={workflowModel.value.name}
                                        placeholder="输入工作流名称"
                                    />
                                </n-form-item>
                                <n-form-item label="目标文件夹" path="value.parentId">
                                    <n-tree-select
                                        options={variables.folderData}
                                        key-field="id"
                                        label-field="titleName"
                                        v-model:value={workflowModel.value.parentId}
                                        filterable
                                    />
                                </n-form-item>
                            </n-form>
                            </n-space>
                            <n-space justify="end">
                                <n-button type="info" onClick={createWorkFlow} >确定</n-button>
                            </n-space>
                        </n-card>
                    </n-modal>
                    <n-modal
                        v-model:show={reWorkflowModal.value}
                        class={Styles.reName}
                    >
                        <n-card title="重命名工作流" size="huge">
                            <n-form
                                ref={formRef}
                                label-placement="left"
                                label-width="auto"
                                rules={rules}
                                model={variables}
                            >
                                <n-form-item label="工作流名称" path="renameWorkflowModel.name">
                                    <n-input
                                        type="text"
                                        v-model:value={variables.renameWorkflowModel.name}
                                        placeholder="输入工作流名称"
                                    />
                                </n-form-item>
                            </n-form>
                            <n-space justify="end">
                                <n-button type="info" onClick={renameWorkflow}>确定</n-button>
                            </n-space>
                        </n-card>
                    </n-modal>
                    <n-modal
                        v-model:show={mvWorkflowModal.value}
                        class={Styles.reName}
                    >
                        <n-card title="移动工作流" size="huge">
                            <n-form
                                label-placement="left"
                                label-width="auto"
                                rules={rules}
                                model={variables}
                            >
                                <n-form-item label="目标文件夹" path="inputValue">
                                    <n-tree-select
                                        options={variables.folderData}
                                        key-field="id"
                                        label-field="titleName"
                                        v-model:value={variables.moveWorkflowModel.parentId}
                                        filterable
                                    />
                                </n-form-item>
                            </n-form>
                            <n-space justify="end">
                                <n-button type="info" onClick={moveWorkflow} >确定</n-button>
                            </n-space>
                        </n-card>
                    </n-modal>
                </div>
            )
    }
})
