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

import { defineComponent, onMounted, watch, toRefs, ref } from 'vue'
import { NLayout, NSelect, NLayoutContent, NLayoutHeader, useMessage } from 'naive-ui'
import NavBar from './components/navbar'
import SideBar from './components/sidebar'
import { useDataList } from './use-dataList'
import { useLocalesStore } from '@/store/locales/locales'
import { useRouteStore } from '@/store/route/route'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const Content = defineComponent({
  name: 'DSContent',
  setup() {
    window.$message = useMessage()

    const route = useRoute()
    const { locale } = useI18n()
    const localesStore = useLocalesStore()
    const routeStore = useRouteStore()
    const {
      state,
      changeMenuOption,
      changeHeaderMenuOptions,
      changeIconMenuOptions,
      changeUserDropdown
    } = useDataList()
    const sideKeyRef = ref()


    onMounted(() => {
      locale.value = localesStore.getLocales
      changeMenuOption(state)
      changeHeaderMenuOptions(state)
      changeIconMenuOptions(state)
      getSideMenu(state)
      changeUserDropdown(state)
    })

    const getSideMenu = (state: any) => {
      const key = route.meta.activeMenu
      state.sideMenuOptions =
        state.menuOptions.filter((menu: { key: string }) => menu.key === key)[0]
          ?.children || state.menuOptions
      state.isShowSide = route.meta.showSide
      let projectCode = route.params.projectCode
      console.log(route.params.projectCode)


      if ((typeof route.params.projectCode) == 'undefined') {
        projectCode = routeStore.getLastRoute.split('/')[2];
      }
      state.sideMenuOptions.forEach(rot => {
        console.log('route')
        console.log(route)
        if (rot.label === "任务管理") {
          rot.children.forEach(ch => {
            console.log(ch)
            if (ch.label === '任务实例') {
              ch.key = `/devops/${projectCode}/task/instances`
            }
            if (ch.label === "工作流实例") {
              ch.key = `/devops/${projectCode}/workflow/instances`
            }
            console.log(ch)

          });
        }
        if (rot.label === "运维总览") {
          rot.key = `/devops/devops_overview/${projectCode}`
        }
      })
    }

    watch(useI18n().locale, () => {
      changeMenuOption(state)
      changeHeaderMenuOptions(state)
      changeIconMenuOptions(state)
      getSideMenu(state)
      changeUserDropdown(state)
    })

    watch(
      () => ({
        path: route.path,
        // query: route.params
      }),
      () => {
        if (route.path !== '/login') {
          routeStore.setLastRoute(route.path)

          state.isShowSide = route.meta.showSide as boolean
          if (route.matched[1].path === '/projects/:projectCode') {
            changeMenuOption(state)
          }


          getSideMenu(state)

          const currentSide = (
            route.meta.activeSide
              ? route.meta.activeSide
              : route.matched[1].path
          ) as string
          sideKeyRef.value = currentSide.includes(':projectCode')
            ? currentSide.replace(
              ':projectCode',
              route.params.projectCode as string
            )
            : currentSide
        }
      },
      { immediate: true }
    )

    return {
      ...toRefs(state),
      changeMenuOption,
      sideKeyRef,

    }
  },


  render() {

    //console.log(this.ProjSelect)

    return (
      <NLayout style='height: 100%'>
        <NLayoutHeader style='height: 65px'>
          <NavBar
            class='tab-horizontal'
            headerMenuOptions={this.headerMenuOptions}
            localesOptions={this.localesOptions}
            timezoneOptions={this.timezoneOptions}
            userDropdownOptions={this.userDropdownOptions}
            iconOptions={this.iconMenuOptions}


          />

        </NLayoutHeader>


        <NLayout has-sider position='absolute' style='top: 65px'>

          {this.isShowSide && (
            <SideBar
              sideMenuOptions={this.sideMenuOptions}
              sideKey={this.sideKeyRef}
            />
          )}
          <NLayoutContent
            native-scrollbar={false}
            style='padding: 16px 22px'
            contentStyle={'height: 100%'}
          >
            <router-view key={this.$route.fullPath} />
          </NLayoutContent>
        </NLayout>
      </NLayout>
    )
  }
})

export default Content
