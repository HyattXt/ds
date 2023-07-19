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

import {defineComponent, nextTick, onMounted, PropType, ref} from 'vue'
import { NIcon, NButton, NDropdown} from 'naive-ui'
import {DownOutlined, ProfileOutlined, UserOutlined} from '@vicons/antd'
import { useDropDown } from './use-dropdown'
import styles from './index.module.scss'
import type { ProjectList } from '@/service/modules/projects/types'
import {queryProjectListPaging} from "@/service/modules/projects";
import {ProjectRes} from "@/service/modules/projects/types";


const User = defineComponent({
  name: 'Project',
  setup() {
    const chooseVal = ref('')
    const projectOptions = ref([])
    const { handleSelect } = useDropDown(chooseVal)

    const getProjectList = () => {
      let params ={
        pageNo: 1,
        pageSize: 100
      }
      queryProjectListPaging(params).then((res: ProjectRes) => {
        chooseVal.value = res.totalList[0].name
        // @ts-ignore
        projectOptions.value = res.totalList
      })
    }

    onMounted(() => {
      getProjectList()
    })
    return { handleSelect, chooseVal, projectOptions }
  },
  render() {
    return (
        <NDropdown
            trigger='hover'
            show-arrow
            label-field={"name"}
            key-field={"code"}
            options={this.projectOptions}
            on-select={this.handleSelect}
        >
          <NButton text>
            <NIcon class={styles.icon}>
              <ProfileOutlined />
            </NIcon>
            {this.chooseVal}
            <NIcon class={styles.icon}>
              <DownOutlined />
            </NIcon>
          </NButton>
        </NDropdown>

    )
  }
})

export default User
