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

import {defineComponent, onMounted, PropType, ref} from 'vue'
import { NIcon, NButton, NDropdown} from 'naive-ui'
import {DownOutlined, ProfileOutlined, UserOutlined} from '@vicons/antd'
import { useDropDown } from './use-dropdown'
import styles from './index.module.scss'
import {queryProjectListPaging} from "@/service/modules/projects";
import {ProjectRes} from "@/service/modules/projects/types";
import { useProjectStore } from '@/store/route/project'


const User = defineComponent({
  name: 'Project',
  setup() {
    const projectOptions = ref([])
    const { handleSelect } = useDropDown()
    const ProjectStore = useProjectStore()

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

    onMounted(() => {
      setTimeout(()=> { getProjectList() }, 500)
    })
    return { handleSelect, projectOptions, ProjectStore }
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
                <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1535" width="200" height="200">
                  <path d="M40.704 315.421l-0.219 0.333 456.083 263.324c4.57 2.646 9.765 4.044 15.021 4.044 5.42 0 10.744-1.465 15.344-4.206L979.52 317.619c14.324-8.295 19.229-26.702 10.932-41.031-2.698-4.657-6.597-8.505-11.221-11.096L528.372 4.047C523.803 1.399 518.607 0 513.35 0c-5.917 0-11.646 1.718-16.578 4.97L44.548 266.061c-14.33 8.23-19.291 26.588-11.059 40.924C35.356 310.234 37.809 313.096 40.704 315.421zM513.242 64.688l391.271 226.896L511.614 518.425 119.484 292.02 513.242 64.688z"  p-id="1536"></path>
                  <path d="M979.231 485.93l-84.858-49.209-59.987 34.632 70.128 40.671-392.9 226.839L119.484 512.46l70.28-40.576-59.954-34.615-85.263 49.23c-14.33 8.233-19.291 26.591-11.058 40.923 1.899 3.307 4.406 6.211 7.366 8.558l-0.19 0.321L496.569 799.52c4.57 2.645 9.764 4.042 15.02 4.042 5.42-0.001 10.743-1.464 15.344-4.204L979.52 538.063c14.324-8.3 19.229-26.707 10.932-41.032C987.753 492.37 983.854 488.521 979.231 485.93z"  p-id="1537"></path>
                  <path d="M979.231 706.369l-84.509-49.008-59.985 34.632 69.778 40.467-392.9 226.842L119.484 732.9l69.93-40.377-59.951-34.613-84.915 49.03c-14.331 8.233-19.291 26.591-11.058 40.922 1.877 3.269 4.351 6.146 7.271 8.481l-0.208 0.328 456.015 263.283c4.571 2.647 9.766 4.047 15.023 4.046 5.418 0 10.741-1.463 15.342-4.202L979.521 758.5c14.323-8.301 19.227-26.708 10.931-41.033C987.756 712.812 983.857 708.963 979.231 706.369z"  p-id="1538"></path>
                </svg>
            </NIcon>
            {this.ProjectStore.getCurrentProjectName}
            <NIcon class={styles.icon}>
              <DownOutlined />
            </NIcon>
          </NButton>
        </NDropdown>

    )
  }
})

export default User
