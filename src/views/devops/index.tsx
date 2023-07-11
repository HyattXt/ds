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

import { defineAsyncComponent, defineComponent, onMounted, onBeforeMount, ref, toRefs, watch } from 'vue'
import { NGrid, NGi } from 'naive-ui'
import { startOfToday, getTime } from 'date-fns'
import { useI18n } from 'vue-i18n'
import { useTaskState } from './use-task-state'
import { useProcessState } from './use-process-state'
import StateCard from './components/state-card'
//import DefinitionCard from './components/definition-card'
import { getUrlParam } from "@/service/service";
import { login1 } from "@/service/modules/login";
import { SessionIdRes } from "@/service/modules/login/types";
import { UserInfoRes } from "@/service/modules/users/types";
import { getUserInfo } from "@/service/modules/users";
import { useUserStore } from "@/store/user/user";
import { useTimezoneStore } from "@/store/timezone/timezone";
import { useRoute, useRouter } from 'vue-router'
import { useDataList } from '@/layouts/content/use-dataList'
import { createApp, nextTick } from 'vue'
import { useAsyncState } from '@vueuse/core'
import type { Component } from 'vue'
import utils from '@/utils'
import { queryUnauthorizedProject, getDataByProjectCodeAndDate, getStatisticsDataByProjectCodeAndDate } from '@/service/modules/devops-analysis'

const modules = import.meta.glob('/src/views/**/**.tsx')

const components: { [key: string]: Component } = utils.mapping(modules)

const DefinitionCard = defineAsyncComponent(() => import('./components/definition-card'))


export default defineComponent({
  name: 'devops',
  setup() {
    const userStore = useUserStore()
    const timezoneStore = useTimezoneStore()

    const { t, locale } = useI18n()
    const dateRef = ref([getTime(startOfToday()), Date.now()])
    const taskStateRef = ref()
    const processStateRef = ref()
    const taskDataRef = ref()
    const taskDevRef = ref()
    const Proj = ref()
    const ProjName = ref()
    const ProjSelect = ref()
    const { getTaskState, taskVariables, getTaskData, getTaskDev, getProjData } = useTaskState()
    const { getProcessState, processVariables } = useProcessState()
    const route = useRoute()
    const router = useRouter()

    console.log('-------------sss------')
    console.log(route.params.projectCode)
    Proj.value = route.params.projectCode
    //route.path.split('/')[2]
    const {
      state,
      changeMenuOption,
      changeHeaderMenuOptions,
      changeIconMenuOptions,
      changeUserDropdown
    } = useDataList()

    const handleTaskDate = (val: any) => {
      taskStateRef.value = getTaskState(val)
    }
    const handleTaskData = (val: any) => {
      taskDataRef.value = getTaskData([val], Proj.value)
      taskDevRef.value = getTaskDev([val], Proj.value)
      dateRef.value = [val]
    }
    const handleProjData = (val: any) => {
      taskDataRef.value = getTaskData(dateRef.value, val)
      taskDevRef.value = getTaskDev(dateRef.value, val)
      Proj.value = val

      const currentRoute = router.currentRoute.value; // 复制当前路由对象

      // 修改参数
      currentRoute.params.projectCode = val;

      // 使用 router.replace() 替换当前路由
      router.replace(currentRoute);

      // router.replace({
      //   path: `/devops/devops_overview`,
      //   query: { projectCode: val }
      // })
      console.log('-------------sss------')
      console.log(route.query.projectCode)
      console.log(ProjSelect)

      ProjName.value = ProjSelect.value.filter(item => item.value === val).label;
      console.log(route.params)
      console.log(route.query)
      // const key = route.meta.activeMenu
      // console.log(key)

      // state.sideMenuOptions =
      //   state.menuOptions.filter((menu: { key: string }) => menu.key === 'devops')[0]
      //     ?.children
      // state.isShowSide = route.meta.showSide
      // state.sideMenuOptions.forEach(rot => {
      //   console.log('route')
      //   console.log(route)
      //   if (rot.label === "任务") {
      //     rot.children.forEach(ch => {
      //       console.log(ch)
      //       if (ch.label === '任务实例') {
      //         ch.key = `/devops/${val}/task/instances`
      //       }
      //       if (ch.label === "工作流实例") {
      //         ch.key = `/devops/${val}/workflow/instances`
      //       }
      //       console.log(ch)

      //     });
      //   }
      //   // if (rot.label === "运维总览") {
      //   //   rot.key = `/devops/devops_overview`
      //   // }
      // })
    }
    const handleProcessDate = (val: any) => {
      processStateRef.value = getProcessState(val)
    }



    const initData = () => {


      taskStateRef.value = getTaskState(dateRef.value) || taskStateRef.value
      processStateRef.value =
        getProcessState(dateRef.value) || processStateRef.value
      taskDataRef.value = getTaskData(dateRef.value, Proj.value) || taskDataRef.value
      taskDevRef.value = getTaskDev(dateRef.value, Proj.value) || taskDevRef.value

      console.log(ProjSelect.value)
      //router.push({ path: `/devops/${ProjSelect.value.proj}/devops_overview` })

    }

    //taskDevRef.value = getTaskDev(dateRef.value)
    // console.log('项目名称：')
    // console.log(ProjSelect.value)
    // const pp = typeof (ProjSelect.value.table)
    // console.log('------1-')
    // console.log(pp)

    // Proj.value = toRefs(ProjSelect).value
    // console.log('------0-')
    // console.log(Proj.value)
    // taskDataRef.value = getTaskData(dateRef.value, ProjSelect.value) || taskDataRef.value

    //ProjSelect.value = getProjData()
    taskDevRef.value = getTaskDev(dateRef.value, Proj.value)
    taskDataRef.value = getTaskData(dateRef.value, Proj.value) || taskDataRef.value

    // async function newMessage() {
    //   ProjSelect.value = await getProjData()
    //   // 这里获取DOM的value是旧值
    //   await nextTick()
    //   // nextTick 后获取DOM的value是更新后的值
    //   console.log('Now DOM is updated')
    //   router.push({ path: `/devops/${ProjSelect.value.proj}/devops_overview` })
    // }
    const getProjData1 = async () => {

      const { state } = await useAsyncState(
        queryUnauthorizedProject({
          userId: 0
        }).then(function (res) {
          console.log(res);

          const table = res.map((item) => {
            return {
              label: item.name,
              value: item.code,
            }
          });
          const proj = table[0].value
          console.log(table);
          console.log(proj);
          console.log('typeof Proj')
          console.log(route.params.projectCode)
          if (route.params.projectCode == '123') {
            console.log('typeof Proj')
            console.log(route)
            console.log(Proj)
            const currentRoute = router.currentRoute.value; // 复制当前路由对象
            console.log(currentRoute)

            // 修改参数
            currentRoute.params.projectCode = table[0].value;

            // 使用 router.replace() 替换当前路由
            router.replace(currentRoute);
            console.log(currentRoute)

            // router.push({
            //   path: `/devops/devops_overview?projectCode=${Proj.value}`,
            //   // query: { projectCode: Proj.value }

            // })
            Proj.value = table[0].value;
            ProjName.value = table[0].label
          }
          else {
            console.log('ProjName.value1')
            console.log(ProjName.value)
            console.log(table)
            ProjName.value = table.filter(item => item.value.toString() === route.params.projectCode).map(item => item.label)[0]
            console.log('ProjName.value1')
            console.log(table.filter(item => item.value === route.params.projectCode).map(item => item.label))
            console.log(ProjName.value)
          }


          ProjSelect.value = table
          //Proj.value = table[0].value

          // initData()
          return { table, Proj }
        }),
        { table: [] }
      )

      return state
    }
    console.log('ProjName.value')
    console.log(ProjName.value)
    getProjData1()

    onMounted(() => {
      // getProjData1()

    })

    watch(
      () => locale.value,
      () => initData()


    )
    return {
      t,
      dateRef,
      handleTaskDate,
      handleTaskData,
      handleProcessDate,
      handleProjData,
      taskStateRef,
      processStateRef,
      taskDataRef,
      taskDevRef,
      ProjSelect,
      ProjName,
      ...toRefs(taskVariables),
      ...toRefs(processVariables)
    }
  },
  render() {
    const {
      t,
      dateRef,
      taskDevRef,
      handleTaskDate,
      handleTaskData,
      handleProcessDate,
      handleProjData,
      taskLoadingRef,
      processLoadingRef
    } = this
    console.log('this.ProjSelect.value')
    console.log(this.ProjName)

    return (
      <div>
        <NGrid x-gap={12} cols={1}>
          <NGi>
            <StateCard
              title={t('home.task_state_statistics')}
              date={dateRef}
              tableData={this.taskDevRef?.value.header}
              chartData={this.taskDataRef?.value.table}
              tablecount={this.taskDevRef?.value.table}
              ProjSelect={this.ProjSelect}
              ProjFirst={this.ProjName}
              onUpdateDatePickerValue={handleTaskData}
              onUpdateProjPickerValue={handleProjData}

              loadingRef={taskLoadingRef}
            />
          </NGi>

        </NGrid>

      </div>
    )
  }
})
