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
import {
  NIcon,
  NButton,
  NBadge,
  NListItem,
  NThing,
  NList,
  NPopover,
  NCard,
  NTabs,
  NTabPane
} from 'naive-ui'
import {AlertOutlined} from '@vicons/antd'
import {queryLicense} from "@/service/modules/license";
import styles from './index.module.scss'



const Alert = defineComponent({
  name: 'Alert',
  setup() {
    const message = ref({})
    const number = ref(0)

    const getProjectList = () => {
      queryLicense().then((res:any)=>{
        message.value = res.licenseErrorInfo
        number.value = res.licenseStatus
      })
    }

    onMounted(() => {
      setTimeout(()=> { getProjectList() }, 500)
    })
    return { message, number }
  },
  render() {
    return (
        <NPopover trigger={"click"} placement={"bottom"} style="padding: 0">
          {{
            trigger: ()=> (
                <NBadge class={styles.alert}
                        value={this.number}
                        max={99}
                >
                  <NButton text style="font-size:22px">
                    <NIcon>
                      <AlertOutlined/>
                    </NIcon>
                  </NButton>
                </NBadge>
            ),
            default: ()=> (
                <NCard title="" style="margin-bottom: 16px">
                  <NTabs type="line" animated>
                    <NTabPane name="the beatles" tab="消息">
                      <NList hoverable clickable style="width: 300px">
                        <NListItem>
                          <NThing>
                            {{
                              default: ()=> (
                                  this.message
                              )
                            }}
                          </NThing>
                        </NListItem>
                      </NList>
                    </NTabPane>
                  </NTabs>
                </NCard>
            )
          }}
        </NPopover>
    )
  }
})

export default Alert
