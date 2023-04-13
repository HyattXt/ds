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

import {defineComponent, ref, unref} from 'vue'
import { TreeOption } from 'naive-ui'
import Detail from '../definition/detail'
import {AlignLeftOutlined, SearchOutlined} from '@vicons/antd';
import Styles from "@/views/projects/workflow/treemap/index.module.scss";
import {useThemeStore} from "@/store/theme/theme";

export default defineComponent({
    name: 'WorkflowTreeMap',
    setup() {
        const pattern = ref('');
        const expandedKeys = ref([]);
        const theme = useThemeStore()
        const projectCode =ref(8166609622112)
        const code = ref(8166777162720)

        function packHandle() {
            if (expandedKeys.value.length) {
                expandedKeys.value = [];
            } else {
                expandedKeys.value = unref(data).map((item: any) => item.key as string) as [];
            }
        }

        function onExpandedKeys(keys: never[]) {
            expandedKeys.value = keys;
        }

        function click(keys: never[]){
            //code = keys[0]
            self.location.href="/projects/8166609622112/workflow/definitions/8166777162720"
            console.log(keys[0])
        }

        const data: TreeOption[] = [
            {
                label: '0',
                key: '0',
                children: [
                    {
                        label: '0-0',
                        key: '0-0',
                        children: [
                            { label: 'GIS', key: '8166777162720' },
                            { label: '0-0-1', key: '0-0-1' }
                        ]
                    },
                    {
                        label: '0-1',
                        key: '0-1',
                        children: [
                            { label: '0-1-0', key: '0-1-0' },
                            { label: '0-1-1', key: '0-1-1' }
                        ]
                    }
                ]
            },
            {
                label: '1',
                key: '1',
                children: [
                    {
                        label: '1-0',
                        key: '1-0',
                        children: [
                            { label: '1-0-0', key: '1-0-0' },
                            { label: '1-0-1', key: '1-0-1' }
                        ]
                    },
                    {
                        label: '1-1',
                        key: '1-1',
                        children: [
                            { label: 'a', key: 'a' },
                            { label: '1-1-1', key: '1-1-1' }
                        ]
                    }
                ]
            }
        ]

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
                                        <n-button type="info" ghost icon-placement="left" onClick={packHandle}>
                                            全部{expandedKeys.value.length ? '收起' : '展开'}
                                            <div>
                                                <n-icon size="14">
                                                    <AlignLeftOutlined/>
                                                </n-icon>
                                            </div>
                                        </n-button>
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
                                    expand-on-click={true}
                                    virtual-scroll={true}
                                    pattern={pattern.value}
                                    data={data}
                                    expandedKeys={expandedKeys}
                                    onUpdate:expanded-keys={onExpandedKeys}
                                    onUpdate:selected-keys={click}
                                />
                            </n-card>
                        </n-gi>
                        <n-gi span="5">
                            <Detail
                                projectCode={projectCode.value}
                                code={code.value}
                            />
                        </n-gi>
                    </n-grid>
                </div>
            )
    }
})
