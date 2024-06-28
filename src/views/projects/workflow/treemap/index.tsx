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

import {defineComponent, onMounted, ref, unref, h, nextTick, VNode, provide, markRaw} from 'vue'
import {DropdownGroupOption, DropdownOption, NPopconfirm, TreeOption, useMessage, NSplit} from 'naive-ui'
import Detail from '../definition/detail'
import {SqlBox, DataXBox, ShellBox, PythonBox, SubProcessBox, DependentBox, DataQualityBox, HttpBox, SwitchBox, ConditionsBox, FlinkBox, SqoopBox} from '../components/task'
import { SearchOutlined } from '@vicons/antd';
import {Circle24Filled, Add12Filled} from "@vicons/fluent";
import { CaretUp, CaretDown } from "@vicons/fa";
import Styles from "./index.module.scss";
import {useRoute} from "vue-router";
import {useTreemap} from "@/views/projects/workflow/treemap/use-treemap";
import { createProcessDefinition } from '@/service/modules/process-definition'
import {useI18n} from "vue-i18n";
import {useLogin} from "@/views/login/use-login";
import {ElTabs, ElTabPane} from 'element-plus'
import {workflowBoxType, componentRefType} from "@/views/projects/workflow/treemap/types";

export default defineComponent({
    name: 'WorkflowTreeMap',
    setup() {
        const message = useMessage()
        const { t } = useI18n()
        const { variables, getTreeMenu, submitMenuModal, getTreeFolder, renameMenuModal, renameWorkflowModal, moveFolderModal, moveWorkflowModal, delFolderModal, deleteWorkflow} = useTreemap()
        const route = useRoute()
        const pattern = ref('');
        const expandedKeys = ref([1]);
        const projectCode = Number(route.params.projectCode)
        const formRef: any = ref(null)
        const activeTab = ref(0)
        const contextMenuTab = ref(0)
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
        const closeTabModal = ref(false)
        const closeTabName = ref(0)
        const showDropdownRef = ref(false)
        const xRef = ref(0)
        const yRef = ref(0)
        const contextMenuVisible = ref(false);
        const menuTop = ref(0);
        const menuLeft = ref(0);
        const dropdownOption = ref([{label: '', key: '',disable: false}])
        const tabDropdownOption = [
            {label: '关闭当前标签', key: '关闭当前标签'},
            {label: '关闭其他标签', key: '关闭其他标签'},
            {label: '关闭所有标签', key: '关闭所有标签'}
        ]
        const { loginNew } = useLogin('')
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

        const workflowBox: any = ref([])
        const componentRefs =  ref<Record<number, componentRefType>>({});

        const taskDictionary : Record<string, object> = {
            'SQL': markRaw(SqlBox),
            'DATAX': markRaw(DataXBox),
            'SHELL': markRaw(ShellBox),
            'PYTHON': markRaw(PythonBox),
            'SUB_PROCESS': markRaw(SubProcessBox),
            'DEPENDENT': markRaw(DependentBox),
            'DATA_QUALITY': markRaw(DataQualityBox),
            'HTTP': markRaw(HttpBox),
            'SWITCH': markRaw(SwitchBox),
            'CONDITIONS': markRaw(ConditionsBox),
            'FLINK': markRaw(FlinkBox),
            'SQOOP': markRaw(SqoopBox)
        };

        const rules = {
            value:{
                name:{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                },
                model:{
                    titleName: {
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
            },
        }

        const ssoLogin = async () => {
            await loginNew()
            refreshTree()
            // @ts-ignore
            variables.value.model.projectCode = projectCode
            if( typeof(route.query.code) != 'undefined' )tsxRef.value.refresh(route.query.code, projectCode)
        }

        const refreshTree = () => {
            getTreeMenu(projectCode)
            getTreeFolder(projectCode)
        }

        const updateTab = (taskCode: Number, taskName: string) => {
                refreshTree()
                updateLabel(taskCode, taskName)
        }
        const updateEdited = (taskCode: Number, tag: Boolean) => {
            for (let i = 0; i < workflowBox.value.length; i++) {
                if (workflowBox.value[i].key === taskCode) {
                    workflowBox.value[i].edited = tag;
                    break;
                }
            }
        }

        function updateLabel( key: Number, newLabel: string) {
            for (let i = 0; i < workflowBox.value.length; i++) {
                if (workflowBox.value[i].key === key) {
                    workflowBox.value[i].label = newLabel;
                    break;
                }
            }
        }

        onMounted(() => {
            ssoLogin()
        })

        function createMenu() {
            formRef.value.validate((errors: any) => {
                if (!errors) {
                    submitMenuModal().then(() => {
                        setTimeout(()=>{
                            getTreeMenu(projectCode)
                            getTreeFolder(projectCode)
                        },200)
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
                    renameMenuModal(projectCode).then(() => {
                        setTimeout(()=>{
                            getTreeMenu(projectCode)
                            getTreeFolder(projectCode)
                        },200)
                        }
                    )
                    reFolderModal.value = false
                } else {
                    message.error('验证失败，请填写完整信息')
                }
            })
        }

        function moveWorkflow() {
            moveWorkflowModal(projectCode).then(() => {
                setTimeout(()=>{
                    getTreeMenu(projectCode)
                    getTreeFolder(projectCode)
                },200)
                }
            )
            mvWorkflowModal.value = false
        }

        function moveMenu() {
            moveFolderModal(projectCode).then(() => {
                setTimeout(()=>{
                    getTreeMenu(projectCode)
                    getTreeFolder(projectCode)
                },200)
                }
            )
            mvFolderModal.value = false
        }

        function delMenu() {
            delFolderModal().then(() => {
                    showDropdownRef.value = false
                setTimeout(()=>{
                    getTreeMenu(projectCode)
                    getTreeFolder(projectCode)
                },200)
                }
            )
        }

        function delWorkflow() {
            deleteWorkflow(projectCode).then(() => {
                    showDropdownRef.value = false
                    setTimeout(()=>{
                        getTreeMenu(projectCode)
                        getTreeFolder(projectCode)
                    },200)
                }
            )
        }

        function renameWorkflow() {
            formRef.value.validate((errors: any) => {
                if (!errors) {
                    renameWorkflowModal(projectCode).then(() => {
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
                    ).then(() => {
                        message.success(t('project.dag.success'))
                        workflowModal.value = false
                        setTimeout(()=>{
                            getTreeMenu(projectCode)
                            getTreeFolder(projectCode)
                        },200)
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
                setId(unref(variables.value.treeData))
                //expandedKeys.value = unref(variables.value.treeData).map((item: any) => item.id as string) as [];
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
            variables.value.model.titleName = ''
            variables.value.model.parentId = 1
            workflowModel.value.parentId = 1
            key == 'menu' ? menuModal.value = true : workflowModal.value = true;
        }

        function  onClickOutside () {
            showDropdownRef.value = false
            contextMenuVisible.value = false
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
        function handleTabSelect (key: string,option: TreeOption) {
            switch(option.key){
                case '关闭当前标签': {contextMenuVisible.value = false; removeTab(contextMenuTab.value) } break
                case '关闭其他标签': {contextMenuVisible.value = false; removeOtherTab(contextMenuTab.value) } break
                case '关闭所有标签': {contextMenuVisible.value = false; removeAllTab() } break
            }
        }
        const menu = ({ option }: { option: TreeOption }) => {
            return {
                onContextmenu(e: MouseEvent) {
                    e.preventDefault()
                    showDropdownRef.value = false
                    variables.value.delFolderModel.id = variables.value.moveFolderModel.id = variables.value.model.parentId = workflowModel.value.parentId = variables.value.renameFolderModel.id = option.id as number
                    variables.value.moveWorkflowModel.taskCode = variables.value.taskCode = variables.value.renameWorkflowModel.taskCode = option.taskCode as number
                    if(option.type == 1 ) {
                        if(option.id === 57 || option.id === 58){
                            dropdownOption.value =[
                                {
                                    label: '新建工作流',
                                    key: 'workflow',
                                    disable: false
                                }
                            ]
                        } else {
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

                    }
                    if(option.type == 2){
                        dropdownOption.value = [
                            {
                                label: '重命名',
                                key: 'renameWorkflow',
                                disable: false
                            },
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
                    if(option.type !== 1){
                        pushComponent(option.type as number, Number(option.taskCode), option.titleName as string, option.taskType as string, !!option.state, option.parentId as number)
                    }
                    }
                }
        }

        const menuIcon = ({ option }: { option: TreeOption }) => {
             switch (option.type){
                 case 1 : return h(<svg class="icon" viewBox="0 0 1260 1024" xmlns="http://www.w3.org/2000/svg" width="19.688" height="16"><defs><style/></defs><path d="M1171.561 157.538H601.797L570.814 61.44A88.222 88.222 0 00486.794 0H88.747A88.747 88.747 0 000 88.747v846.506A88.747 88.747 0 0088.747 1024H1171.56a88.747 88.747 0 0088.747-88.747V246.285a88.747 88.747 0 00-88.747-88.747zm-1082.814 0V88.747h398.047l22.055 68.791z" fill="#0099CB"/></svg>)
                 case 2 : return h(<svg class="icon" viewBox="0 0 1260 1024" xmlns="http://www.w3.org/2000/svg" width="19.688" height="16"><defs><style/></defs><path d="M543.872 480h268.224c52.416 0 94.848 43.008 94.848 96v160h52.8a64 64 0 0 1 64 64V960a64 64 0 0 1-64 64H803.2a64 64 0 0 1-64-64v-160a64 64 0 0 1 64-64h40.512V576c0-17.664-14.144-32-31.616-32h-268.16v192h46.528a64 64 0 0 1 64 64V960a64 64 0 0 1-64 64H433.92a64 64 0 0 1-64-64v-160a64 64 0 0 1 64-64h46.72v-192H211.328a31.808 31.808 0 0 0-31.616 32v160h40.832a64 64 0 0 1 64 64V960a64 64 0 0 1-64 64H64a64 64 0 0 1-64-64v-160a64 64 0 0 1 64-64h52.48V576c0-52.992 42.496-96 94.848-96H480.64v-192h-46.72a64 64 0 0 1-64-64V64a64 64 0 0 1 64-64h156.544a64 64 0 0 1 64 64v160a64 64 0 0 1-64 64h-46.592v192z" fill="#0099CB"/></svg>)
                 default: {
                     let url= '/HData/ui/images/task-icons/'+(option.taskType as string).toLocaleLowerCase()+'_hover.png'
                     return h(<img src={url} width="24" height="24" />)
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

        function getEditedByName(jsonData: workflowBoxType[], name: number) {
            const item = jsonData.find((item: workflowBoxType) => item.name == name); // 使用 find 方法在数组中查找符合条件的第一个元素
            if (item) {
                return item.edited;
            }
            return null; // 若在数组中找不到，则返回 null
        }

        const removeOtherTab = (targetName: number) => {
            const tabs = workflowBox.value
            for (const tab of tabs) {
                if (tab.name != targetName) {
                    if(getEditedByName(tabs, tab.name)){
                        closeTabModal.value = true
                        closeTabName.value = tab.name
                        break
                    } else {
                        delTab(workflowBox.value, tab.name)
                    }
                }
            }
        }

        const removeAllTab = () => {
            const tabs = workflowBox.value
            for (const tab of tabs) {
                if(tab.edited){
                    closeTabModal.value = true
                    closeTabName.value = tab.name
                    break
                } else {
                     delTab(workflowBox.value, tab.name)
                }
            }
        }

        const removeTab = (targetName: number) => {
            const tabs = workflowBox.value
            if(getEditedByName(tabs, targetName)){
                closeTabModal.value = true
                closeTabName.value = targetName
            } else {
                delTab(tabs, targetName)
            }
        }

        const forceRemoveTab = () => {
            const tabs = workflowBox.value
            delTab(tabs, closeTabName.value)
            closeTabModal.value = false
        }

        function delTab(tabs: workflowBoxType[], targetName: number) {
            let activeName = activeTab.value
            if (activeName == targetName) {
                tabs.forEach((tab: workflowBoxType, index: number) => {
                    if (tab.name == targetName) {
                        const nextTab = tabs[index + 1] || tabs[index - 1]
                        if (nextTab) {
                            activeName = nextTab.name
                        }
                    }
                })
            }
            activeTab.value = activeName
            if (typeof componentRefs.value[activeTab.value].refresh === 'function') {
                (componentRefs.value[activeTab.value] as { refresh: (taskCode: number, projectCode: number) => void }).refresh(activeTab.value, projectCode)
            }
            workflowBox.value = tabs.filter((tab: workflowBoxType) => tab.name != targetName)
        }

        function refresh(name: number) {
            if (typeof componentRefs.value[name].refresh === 'function') {
                (componentRefs.value[name] as { refresh: (taskCode: number, projectCode: number) => void }).refresh(name, projectCode)
            }
            setTimeout(()=>{
                if (typeof componentRefs.value[activeTab.value].repaintPlumb === 'function') {
                    (componentRefs.value[name] as { repaintPlumb: () => void }).repaintPlumb()
                }
            },100)
        }

        function handleOnDragMove() {
            if (typeof componentRefs.value[activeTab.value].repaintPlumb === 'function') {
                (componentRefs.value[activeTab.value] as { repaintPlumb: () => void }).repaintPlumb()
            }
        }

        const showContextMenu = (event: MouseEvent) => {
            const targetElement = event.target as HTMLElement;
            if(targetElement?.offsetParent?.id.startsWith("tab-")){
                contextMenuTab.value = Number(targetElement.offsetParent.id.split("-")[1]);
                event.preventDefault(); // 手动阻止默认行为
                contextMenuVisible.value = true;
                menuTop.value = event.clientY;
                menuLeft.value = event.clientX;
            }
        };

        const pushComponent = (type: number, taskCode: number, taskName: string, taskType: string, state: boolean, processCode: number)=> {
            const newItem = {
                label: taskName,
                name: taskCode,
                component: type === 2 ? Detail : taskDictionary[taskType], // 2任务流 null节点
                key: taskCode,
                type: type,
                taskType: taskType,
                edited: false,
                props: {
                    projectCode: projectCode,
                    taskCode: taskCode,
                    processCode: processCode,
                    readOnly: state
                }
            };

            if (workflowBox.value.length === 0 || !workflowBox.value.some((item: workflowBoxType) => item.key === taskCode)) {
                if(workflowBox.value.length>=15) {
                    message.info('打开窗口过多，请关掉一些')
                } else {
                    workflowBox.value.push(newItem);
                    componentRefs.value[taskCode] = {};
                    activeTab.value = taskCode
                }
            } else activeTab.value = taskCode

        }

        provide('pushComponent', pushComponent);
        provide('updateTab', updateTab);
        provide('updateEdited', updateEdited);


        return () =>
            (
                <div style={"height:100%; border: 0px"}>
                            <div class="cue-drag-layout flex-row">
                                <NSplit default-size={0.15} min={0.07} max={0.9} onDragMove={handleOnDragMove}
                                        v-slots={{
                                        1: () => (
                                            <div class="cue-drag-layout__mainview" style={"height: 100%"}>
                                                <div class="tree-container" style={"width: 100%"}>
                                                    <div class="add-buttons">
                                                        <span class="title">分类</span>
                                                        <div class="button-item-toggle" onClick={packHandle} title={expandedKeys.value.length ? '收起' : '展开'}>
                                                            <n-icon size="16" style={"padding-top: 5px"}>{expandedKeys.value.length ? (<CaretUp/>) : (<CaretDown/>)}</n-icon>
                                                        </div>
                                                        <n-dropdown trigger="click" options={addMenuOptions.value} onSelect={ifShowModal}>
                                                            <div class="button-item" title="添加">
                                                                <n-icon size="16"><Add12Filled/></n-icon>
                                                            </div>
                                                        </n-dropdown>

                                                    </div>
                                                    <n-input
                                                        type="text"
                                                        placeholder="搜索"
                                                        class="search-input"
                                                        v-model:value={pattern.value}
                                                        v-slots={{
                                                            suffix: () => (
                                                                <div>
                                                                    <n-icon component={SearchOutlined}/>
                                                                </div>
                                                            )
                                                        }}
                                                    >
                                                    </n-input>
                                                    <n-spin show={variables.value.loading} content-class={"tree-scrollbar"} style={"height: 100%"}>
                                                    <n-tree
                                                        class="tree-scrollbar"
                                                        block-line
                                                        show-irrelevant-nodes={false}
                                                        pattern={pattern.value}
                                                        data={variables.value.treeData}
                                                        key-field="id"
                                                        label-field="titleName"
                                                        children-field="children"
                                                        onUpdate:expanded-keys={onExpandedKeys}
                                                        expanded-keys={expandedKeys.value}
                                                        node-props={menu}
                                                        render-prefix={menuIcon}
                                                    />
                                                    </n-spin>
                                                    <n-dropdown
                                                        placement="bottom-start"
                                                        trigger="manual"
                                                        x={xRef.value}
                                                        y={yRef.value}
                                                        options={dropdownOption.value}
                                                        show={showDropdownRef.value}
                                                        on-clickoutside={onClickOutside}
                                                        on-select={handleSelect}
                                                        render-option={dropdownConfirm}
                                                    />
                                                </div>
                                            </div>
                                        ),
                                        2: () => (
                                            <div class="cue-drag-layout__mainview" style={"height: 100%"}>
                                                {workflowBox.value.length === 0 ? (
                                                    <div class={Styles.backgroundDiv}/>
                                                ) : (
                                                    // @ts-ignore
                                                    <ElTabs v-model={activeTab.value} closable type={"card"} onTabRemove={removeTab} onTabChange={refresh} onContextmenu={showContextMenu}>
                                                        {workflowBox.value.map((item: any) => (
                                                            <ElTabPane
                                                                key={item.name}
                                                                label={item.label}
                                                                name={item.name}
                                                                lazy={true}
                                                                v-slots={{
                                                                    label: () => {
                                                                        switch (item.type){
                                                                            case 2 : return h(<div>
                                                                                                <svg class="icon" viewBox="0 0 1260 1024" xmlns="http://www.w3.org/2000/svg" width="19.688" height="16"><defs><style/></defs><path d="M543.872 480h268.224c52.416 0 94.848 43.008 94.848 96v160h52.8a64 64 0 0 1 64 64V960a64 64 0 0 1-64 64H803.2a64 64 0 0 1-64-64v-160a64 64 0 0 1 64-64h40.512V576c0-17.664-14.144-32-31.616-32h-268.16v192h46.528a64 64 0 0 1 64 64V960a64 64 0 0 1-64 64H433.92a64 64 0 0 1-64-64v-160a64 64 0 0 1 64-64h46.72v-192H211.328a31.808 31.808 0 0 0-31.616 32v160h40.832a64 64 0 0 1 64 64V960a64 64 0 0 1-64 64H64a64 64 0 0 1-64-64v-160a64 64 0 0 1 64-64h52.48V576c0-52.992 42.496-96 94.848-96H480.64v-192h-46.72a64 64 0 0 1-64-64V64a64 64 0 0 1 64-64h156.544a64 64 0 0 1 64 64v160a64 64 0 0 1-64 64h-46.592v192z" fill="#0099CB"/></svg>
                                                                                                <span>{item.label}</span>
                                                                                              </div>
                                                                                             )
                                                                            default: {
                                                                                let url= '/HData/ui/images/task-icons/'+item.taskType.toLocaleLowerCase()+'_hover.png'
                                                                                return h(<div style={"display: flex; align-items: center"}><img src={url} width="24" height="24"/>
                                                                                            <span>{item.label}</span>
                                                                                    {item.edited && (<n-icon style={"margin: 0 -8px 0 16px"} color={"#ffd192"}><Circle24Filled/></n-icon>)}
                                                                                        </div>)
                                                                            }
                                                                        }
                                                                }}}
                                                            >
                                                                <item.component ref={(ref: componentRefType) => { componentRefs.value[item.name] = ref }} {...item.props} />
                                                            </ElTabPane>
                                                        ))}
                                                    </ElTabs>
                                                )}
                                                    <n-dropdown
                                                        style={"z-index: 1000; position: fixed"}
                                                        placement="bottom-start"
                                                        trigger="manual"
                                                        x={menuLeft.value}
                                                        y={menuTop.value}
                                                        options={tabDropdownOption}
                                                        show={contextMenuVisible.value}
                                                        on-clickoutside={onClickOutside}
                                                        on-select={handleTabSelect}
                                                    />
                                            </div>
                                        )
                                    }}
                                />
                            </div>
                    <el-dialog
                        v-model={menuModal.value}
                        width={"600px"}
                        v-slots={{header: () => (
                                "新建文件夹"
                            )}}
                    >
                        <n-form
                            ref={formRef}
                            label-placement="left"
                            label-width="auto"
                            rules={rules}
                            model={variables}
                        >
                            <n-form-item label="文件夹名称" path="value.model.titleName">
                                <n-input
                                    type="text"
                                    v-model:value={variables.value.model.titleName}
                                    placeholder="输入文件夹名称"
                                />
                            </n-form-item>
                            <n-form-item label="目标文件夹" path="value.model.parentId">
                                <n-tree-select
                                    options={variables.value.folderData}
                                    key-field="id"
                                    label-field="titleName"
                                    v-model:value={variables.value.model.parentId}
                                    filterable
                                />
                            </n-form-item>
                        </n-form>
                        <n-space justify="end">
                            <n-button type="info" onClick={createMenu} >确定</n-button>
                        </n-space>
                    </el-dialog>
                    <el-dialog
                        v-model={reFolderModal.value}
                        width={"600px"}
                        v-slots={{header: () => (
                                "重命名文件夹"
                            )}}
                    >
                            <n-form
                                ref={formRef}
                                label-placement="left"
                                label-width="auto"
                                rules={rules}
                                model={variables}
                            >
                                <n-form-item label="文件夹名称" path="value.renameFolderModel.name">
                                    <n-input
                                        type="text"
                                        v-model:value={variables.value.renameFolderModel.name}
                                        placeholder="输入文件夹名称"
                                    />
                                </n-form-item>
                            </n-form>
                            <n-space justify="end">
                                <n-button type="info" onClick={renameMenu}>确定</n-button>
                            </n-space>
                    </el-dialog>
                    <el-dialog
                        v-model={mvFolderModal.value}
                        width={"600px"}
                        v-slots={{header: () => (
                                "移动文件夹"
                            )}}
                    >
                            <n-form
                                label-placement="left"
                                label-width="auto"
                                rules={rules}
                                model={variables}
                            >
                                <n-form-item label="目标文件夹" path="value.moveFolderModel.parentId">
                                    <n-tree-select
                                        options={variables.value.folderData}
                                        key-field="id"
                                        label-field="titleName"
                                        v-model:value={variables.value.moveFolderModel.parentId}
                                        filterable
                                    />
                                </n-form-item>
                            </n-form>
                            <n-space justify="end">
                                <n-button type="info" onClick={moveMenu} >确定</n-button>
                            </n-space>
                    </el-dialog>
                    <el-dialog
                        v-model={workflowModal.value}
                        width={"600px"}
                        v-slots={{header: () => (
                                "新建工作流"
                            )}}
                    >
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
                                        options={variables.value.folderData}
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
                    </el-dialog>
                    <el-dialog
                        v-model={reWorkflowModal.value}
                        width={"600px"}
                        v-slots={{header: () => (
                                "重命名工作流"
                            )}}
                    >
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
                                        v-model:value={variables.value.renameWorkflowModel.name}
                                        placeholder="输入工作流名称"
                                    />
                                </n-form-item>
                            </n-form>
                            <n-space justify="end">
                                <n-button type="info" onClick={renameWorkflow}>确定</n-button>
                            </n-space>
                    </el-dialog>
                    <el-dialog
                        v-model={mvWorkflowModal.value}
                        width={"600px"}
                        v-slots={{header: () => (
                                "移动工作流"
                            )}}
                    >
                            <n-form
                                label-placement="left"
                                label-width="auto"
                                rules={rules}
                                model={variables}
                            >
                                <n-form-item label="目标文件夹" path="inputValue">
                                    <n-tree-select
                                        options={variables.value.folderData}
                                        key-field="id"
                                        label-field="titleName"
                                        v-model:value={variables.value.moveWorkflowModel.parentId}
                                        filterable
                                    />
                                </n-form-item>
                            </n-form>
                            <n-space justify="end">
                                <n-button type="info" onClick={moveWorkflow} >确定</n-button>
                            </n-space>
                    </el-dialog>
                    <el-dialog
                        v-model={closeTabModal.value}
                        width={"600px"}
                        v-slots={{header: () => (
                                "提示"
                            )}}
                    >
                        <div>当前任务未保存，强制关闭会丢失所做的操作！</div>
                        <br/>
                        <n-space justify="end">
                            <n-button  onClick={() => (closeTabModal.value = !closeTabModal.value)}>取消</n-button>
                            <n-button type="warning" onClick={forceRemoveTab}>强制关闭</n-button>
                        </n-space>
                    </el-dialog>
                </div>
            )
    }
})
