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

import { defineComponent, computed, onMounted, watch, toRefs, ref } from 'vue'
import { NLayout, NSelect, NLayoutContent, NLayoutHeader, useMessage } from 'naive-ui'
import NavBar from './components/navbar'
import SideBar from './components/sidebar'
import { useDataList } from './use-dataList'
import { useLocalesStore } from '@/store/locales/locales'
import { useRouteStore } from '@/store/route/route'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import {useProjectStore} from "@/store/route/project";

const Content = defineComponent({
  name: 'DSContent',
  setup() {
    window.$message = useMessage()

    const route = useRoute()
    const { locale } = useI18n()
    const localesStore = useLocalesStore()
    const routeStore = useRouteStore()
    const ProjectStore = useProjectStore()
    const {
      state,
      changeMenuOption,
      changeHeaderMenuOptions,
      changeIconMenuOptions,
      changeUserDropdown
    } = useDataList()
    const sideKeyRef = ref()
    const customStyle = computed(() => {
      if (window.webConfig.VITE_APP_PROD_IS_IFRAME) {
        // 如果 isIframe 为 true，则返回一个不包含 top 属性的样式对象
        return {};
      } else {
        // 否则，返回一个包含 top: 65px 的样式对象
        return {
          top: '65px',
        };
      }
    });


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
      }),
      () => {
        if (route.path !== '/login') {
          routeStore.setLastRoute(route.path)
          state.isShowSide = route.meta.showSide as boolean
          if (route.matched[1].path === '/projects/:projectCode/workflow/relation' || route.matched[1].path === '/devops/:projectCode/devops_overview') {
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
      customStyle
    }
  },


  render() {

    return (
      <NLayout style='height: 100%'>
        {!window.webConfig.VITE_APP_PROD_IS_IFRAME &&
          (<NLayoutHeader style='height: 65px'>
            <NavBar
              class='tab-horizontal'
              headerMenuOptions={this.headerMenuOptions}
              localesOptions={this.localesOptions}
              timezoneOptions={this.timezoneOptions}
              userDropdownOptions={this.userDropdownOptions}
              iconOptions={this.iconMenuOptions}
            />
          </NLayoutHeader>)
        }
        <NLayout has-sider position='absolute'  style={this.customStyle} >
          {/*<NLayout has-sider position='absolute'>*/}
          {this.isShowSide && !window.webConfig.VITE_APP_PROD_IS_IFRAME && (
            <SideBar
              sideMenuOptions={this.sideMenuOptions}
              sideKey={this.sideKeyRef}
            />
          )}
          <NLayoutContent
            native-scrollbar={false}
            style='padding: 6px'
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
