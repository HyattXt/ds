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

import { defineComponent, PropType, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import styles from './index.module.scss'
import { NMenu } from 'naive-ui'
import Logo from '../logo'
import Locales from '../locales'
import Timezone from '../timezone'
import User from '../user'
import Project from '../project'
import Theme from '../theme'
import {useProjectStore} from "@/store/route/project";

const Navbar = defineComponent({
  name: 'Navbar',
  props: {
    headerMenuOptions: {
      type: Array as PropType<any>,
      default: []
    },
    localesOptions: {
      type: Array as PropType<any>,
      default: []
    },
    timezoneOptions: {
      type: Array as PropType<any>,
      default: []
    },
    userDropdownOptions: {
      type: Array as PropType<any>,
      default: []
    },
    iconOptions: {
      type: Array as PropType<any>,
      default: []
    },
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const ProjectStore = useProjectStore()

    const menuKey = ref(route.meta.activeMenu as string)

    const handleMenuClick = (key: string) => {
      console.log(key)
      if(key == 'projects'){
        router.push({ path: `/projects/${ProjectStore.getCurrentProject}/workflow/relation` })
      }else if(key == 'devops'){
        router.push({ path: `/${key}/${ProjectStore.getCurrentProject}/devops_overview` })
      }else{
        router.push({ path: `/${key}`})
      }
    }

    watch(
      () => route.path,
      () => {
        menuKey.value = route.meta.activeMenu as string
      }
    )

    return { handleMenuClick, menuKey  }
  },
  render() {
    console.log(this.iconOptions);
    return (
      <div class={styles.container}>
        {window.webConfig.SHOW_LOGO ? <Logo /> :<div/>}
        <div class={styles.nav} >
          <NMenu
            value={this.menuKey}
            mode='horizontal'
            options={this.headerMenuOptions}
            onUpdateValue={this.handleMenuClick}
          />
        </div>

        <div class={styles.settings} >
          <NMenu
            value={this.menuKey}
            mode='horizontal'
            options={this.iconOptions}
            onUpdateValue={this.handleMenuClick}
          />
          <Theme />
          <Project/>
          <User userDropdownOptions={this.userDropdownOptions} />
        </div>
      </div >
    )
  }
})

export default Navbar
