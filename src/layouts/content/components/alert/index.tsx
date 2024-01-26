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

import {defineComponent, onMounted, ref} from 'vue'
import {NIcon, NButton, NPopselect, NBadge, NListItem, NThing, NTag, NList} from 'naive-ui'
import {AlertOutlined} from '@vicons/antd'
import { usePopSelect } from './use-popSelect'
import styles from './index.module.scss'
import {queryProjectListPaging} from "@/service/modules/projects";
import {ProjectRes} from "@/service/modules/projects/types";
import { useProjectStore } from '@/store/route/project'


const Alert = defineComponent({
  name: 'Alert',
  setup() {
    const projectOptions = ref([])
    const { handleSelect } = usePopSelect()
    const ProjectStore = useProjectStore()
    const showModal =ref(false)

    const getProjectList = () => {
      let params ={
        pageNo: 1,
        pageSize: 100
      }
      queryProjectListPaging(params).then((res: ProjectRes) => {
        ProjectStore.setCurrentProjectName(res.totalList[0].name)
        ProjectStore.setCurrentProject(res.totalList[0].code)
        // @ts-ignore
        projectOptions.value = res.totalList
      })
    }

    const test = () => {
      showModal.value = !showModal.value
    }

    onMounted(() => {
      setTimeout(()=> { getProjectList() }, 500)
    })
    return { handleSelect, projectOptions, ProjectStore, test, showModal }
  },
  render() {
    return (
          <NPopselect trigger={"click"} options={[]} class={styles.nBaseSelectMenu}>
            {{
              default: ()=> (
                  <NBadge class={styles.alert}
                          value={100}
                          max={99}
                  >
                    <NButton text style="font-size:22px" onClick={this.test}>
                      <NIcon>
                        <AlertOutlined/>
                      </NIcon>
                    </NButton>
                  </NBadge>
              ),
              empty: ()=> (
                  <NList hoverable class={styles.nList}>
                    {{
                      header: ()=> (
                          <NTag bordered={false} type={"info"} size={"large"}>
                            消息提醒
                          </NTag>
                      ),
                      default: ()=> (
                          <NListItem class={styles.nList}>
                            <NThing>
                              {{
                                default: ()=> (
                                    '[系统公告]您的产品将于2024年1月1日(13天后)过期，请及时联系管理员'
                                )
                              }}
                            </NThing>
                          </NListItem>
                      )
                    }}
                  </NList>
              )
            }}
          </NPopselect>

    )
  }
})

export default Alert
