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

import {defineComponent, PropType, toRefs, h, unref, ref} from 'vue'
import { NSpin, NGrid, NForm, NFormItemGi, NDrawer, NButton, NCard, NDrawerContent } from 'naive-ui'
import { useForm } from './use-form'
import type { GridProps, IMeta } from './types'
import {useI18n} from "vue-i18n";
import styles from './index.module.scss'

const props = {
  meta: {
    type: Object as PropType<IMeta>,
    default: {},
    required: true
  },
  layout: {
    type: Object as PropType<GridProps>
  },
  loading: {
    type: Boolean as PropType<boolean>,
    default: false
  }
}

const Form = defineComponent({
  name: 'DSForm',
  props,
  setup(props, { expose }) {
    const { t } = useI18n()
    const { state, ...rest } = useForm()
    const showAttribute = ref(false)
    const showDra = () =>{
      showAttribute.value = showAttribute.value==false
    }
    expose({
      ...rest,
      showDra
    })
    return { ...toRefs(state), t, showAttribute, showDra }
  },
  render(props: { meta: IMeta; layout?: GridProps; loading?: boolean; }) {
    const { t } = useI18n()
    const { loading, layout, meta } = props
    const { elements = [], ...restFormProps } = meta

    const menuHide = [
      t('project.node.task_priority'),
      t('project.node.run_flag'),
      t('project.node.description'),
      t('project.node.worker_group'),
      t('project.node.environment_name'),
      t('project.node.task_group_name'),
      t('project.node.task_group_queue_priority'),
      t('project.node.number_of_failed_retries'),
      t('project.node.failed_retry_interval'),
      t('project.node.delay_execution_time'),
      t('project.node.timeout_alarm'),
      t('project.node.timeout_strategy'),
      t('project.node.timeout_period'),
      t('project.node.pre_tasks')
    ]
    return (
      <NSpin show={loading}>
        <NForm {...restFormProps} ref='formRef'>
          <NDrawer
              v-model:show={this.showAttribute}
              show-mask="transparent"
              defaultWidth="650"
              class={styles.drawer}
              >
            <NDrawerContent
                v-slots={{
                  header: () => (
                      <div>任务属性</div>
                  )}}
            >
                <NGrid {...layout}>
                  {elements.map((element) => {
                    const { span = 24, path, widget, ...formItemProps } = element
                    // @ts-ignore
                    if(menuHide.includes(formItemProps.label) )
                      return (
                          <NFormItemGi
                              {...formItemProps}
                              span={unref(span) === void 0 ? 24 : unref(span)}
                              path={path}
                              key={path || String(Date.now() + Math.random())}
                          >
                            {h(widget)}
                          </NFormItemGi>
                      )
                  })}
                </NGrid>
            </NDrawerContent>
          </NDrawer>
          <NGrid {...layout}>
            {elements.map((element) => {
              const { span = 24, path, widget, ...formItemProps } = element
              // @ts-ignore
              if(!menuHide.includes(formItemProps.label) )
                return (
                  <NFormItemGi
                      {...formItemProps}
                      span={unref(span) === void 0 ? 24 : unref(span)}
                      path={path}
                      key={path || String(Date.now() + Math.random())}
                  >
                    {h(widget)}
                  </NFormItemGi>
              )
            })}
          </NGrid>
        </NForm>
      </NSpin>
    )
  }
})

export default Form
