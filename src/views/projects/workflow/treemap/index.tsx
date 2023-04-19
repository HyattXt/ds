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

import {defineComponent, onMounted, ref, unref, h} from 'vue'
import {NIcon, TreeOption, useMessage} from 'naive-ui'
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
        const { variables, getTreeMenu, submitMenuModal } = useTreemap()
        const route = useRoute()
        const pattern = ref('');
        const expandedKeys = ref([]);
        const theme = useThemeStore()
        const projectCode = Number(route.params.projectCode)
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
        const addMenuOptions = ref([
            {
                label: '添加菜单',
                key: 'menu'
            },
            {
                label: '添加工作流',
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
            }
        }

        onMounted(() => {
            getTreeMenu(projectCode)
            // @ts-ignore
            variables.model.projectCode = projectCode
        })

        function createMenu() {
            submitMenuModal().then(r => {
                message.success("创建成功")
                getTreeMenu(projectCode)
                }
            )
            menuModal.value = false
        }

        function createWorkFlow(){
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
            })
        }

        function packHandle() {
            if (expandedKeys.value.length) {
                expandedKeys.value = [];
            } else {
                expandedKeys.value = unref(variables.treeData).map((item: any) => item.key as string) as [];
            }
        }

        function onExpandedKeys(keys: never[]) {
            expandedKeys.value = keys;
        }

        function ifShowModal(key: string){
            variables.model.titleName = ''
            key == 'menu' ? menuModal.value = true : workflowModal.value = true;
        }

        const menu = ({ option }: { option: TreeOption }) => {
            return {
                onContextmenu() {
                    console.log("右击")
                },
                ondblclick() {
                    //双击事件
                    linkage.value.type = 0
                    linkage.value.code = option.taskCode as number
                    linkage.value.type = option.type as number
                    linkage.value.parentId = option.parentId as number
                    console.log(option.taskCode)
                    console.log("双击")
                    tsxRef.value.refresh(linkage.value.code, projectCode)
                    console.log("双击完毕")
                    }
                }
        }

        const menuIcon = ({ option }: { option: TreeOption }) => {
             switch (option.type){
                 case 1 : return h(NIcon, {color: "#0099FF"}, { default: () => h(FolderTwotone) })
                 case 2 : return h(NIcon, {color: "#0099FF"}, { default: () => h(ApartmentOutlined) })
                 default: switch (option.taskType){
                     case "SQL" : return h(NIcon, null, { default: () => h(ConsoleSqlOutlined) })
                 }
            }
        }


        return () =>
            (
                <div
                    class={[
                        theme.darkTheme ? Styles['dark'] : Styles['light']
                    ]}
                >
                    <n-grid x-gap="2" cols="6">
                        <n-gi span="1">
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
                                <n-tree
                                    class={Styles.container}
                                    block-line
                                    show-irrelevant-nodes={false}
                                    pattern={pattern.value}
                                    data={variables.treeData}
                                    key-field="taskCode"
                                    label-field="titleName"
                                    children-field="children"
                                    onUpdate:expanded-keys={onExpandedKeys}
                                    node-props={menu}
                                    render-prefix={menuIcon}
                                />
                            </n-card>
                        </n-gi>
                        <n-gi span="5">
                            <Detail
                               ref={tsxRef}
                               projectCode={projectCode}
                               code={linkage.value.code}
                               parentId={linkage.value.parentId}
                            />
                        </n-gi>
                    </n-grid>
                    <n-modal
                        v-model:show={menuModal.value}
                        class={Styles.menuModal}
                    >
                        <n-card title="新建文件夹" size="huge">
                            <n-form
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
                                        options={variables.treeData}
                                        key-field="id"
                                        label-field="titleName"
                                        v-model:value={variables.model.parentId}
                                        default-value={1}
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
                        v-model:show={workflowModal.value}
                        class={Styles.workflowModal}
                    >
                        <n-card title="新建工作流" size="huge">
                            <n-space vertical>
                            <n-form
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
                                        options={variables.treeData}
                                        key-field="id"
                                        label-field="titleName"
                                        v-model:value={workflowModel.value.parentId}
                                        default-value={1}
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
                </div>
            )
    }
})
