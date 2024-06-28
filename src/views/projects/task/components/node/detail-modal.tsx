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

import {
  defineComponent,
  PropType,
  ref,
  watch,
  nextTick,
  provide,
  computed,
  h,
  Ref, onMounted, watchEffect
} from 'vue'
import { useI18n } from 'vue-i18n'
import Modal from '@/components/modal'
import Detail from './detail'
import { formatModel } from './format-data'
import {
  HistoryOutlined,
  ProfileOutlined,
  PlaySquareOutlined,
  BranchesOutlined,
  MenuUnfoldOutlined
} from '@vicons/antd'
import {
  LogInst,
  NCard,
  NDrawer,
  NDrawerContent,
  NIcon,
  NLog,
  NModal,
  NTable,
  NTabPane,
  NTabs,
  useMessage
} from 'naive-ui'
import { TASK_TYPES_MAP } from '../../constants/task-type'
import {Router, useRoute, useRouter} from 'vue-router'
import { querySubProcessInstanceByTaskCode } from '@/service/modules/process-instances'
import { useTaskNodeStore } from '@/store/project/task-node'
import type {
  ITaskData,
  ITaskType,
  EditWorkflowDefinition,
  IWorkflowTaskInstance,
  WorkflowInstance
} from './types'
import {startTaskInstance} from "@/service/modules/executors";
import styles from "./index.module.scss";
import {getSqlLog, queryLog, startImmediateLog} from "@/service/modules/log";
import {useAsyncState} from "@vueuse/core";

const props = {
  show: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  data: {
    type: Object as PropType<ITaskData>,
    default: { code: 0, taskType: 'SHELL', name: '' }
  },
  projectCode: {
    type: Number as PropType<number>,
    required: true,
    default: 0
  },
  processCode: {
    type: Number as PropType<number>,
    required: true,
    default: 0
  },
  readonly: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  from: {
    type: Number as PropType<number>,
    default: 0
  },
  definition: {
    type: Object as PropType<Ref<EditWorkflowDefinition>>
  },
  processInstance: {
    type: Object as PropType<WorkflowInstance>
  },
  taskInstance: {
    type: Object as PropType<IWorkflowTaskInstance>
  },
  saving: {
    type: Boolean,
    default: false
  }
}

const NodeDetailModal = defineComponent({
  name: 'NodeDetailModal',
  props,
  emits: ['cancel', 'submit', 'viewLog', 'saveBeforeRun'],
  setup(props, { emit }) {
    const { t, locale } = useI18n()
    const router: Router = useRouter()
    const taskStore = useTaskNodeStore()
    const route = useRoute()
    const logInstRef = ref<LogInst | null>(null)
    const message = useMessage()

    const renderIcon = (icon: any) => {
      return () => h(NIcon, null, { default: () => h(icon) })
    }
    const detailRef = ref()
    const showDialog = ref(false)
    const logMessage =ref('')
    const showSql = ref(false)
    const skipLineNum = ref(0)
    const limit = ref(1000)
    const logLoadingRef = ref(false)
    const dataInfo = ref([])
    const diaPx =ref(251)

    const onConfirm = async () => {
      logLoadingRef.value = false
      await detailRef.value.value.validate()
      if(!!detailRef.value.value.getValues().leftList && detailRef.value.value.getValues().leftList.length === 0) { message.error('字段必须选择映射关系') }
      else {
        emit('submit', { data: detailRef.value.value.getValues() })
      }
    }
    const onCancel = () => {
      logLoadingRef.value = false
      emit('cancel')
    }
    const onSaveBeforeRun = async () => {
      await detailRef.value.value.validate()
      if(!props.readonly) emit('saveBeforeRun', { data: detailRef.value.value.getValues() })
    }

    const headerLinks = ref([] as any)

    const handleViewLog = () => {
      if (props.taskInstance) {
        emit('viewLog', props.taskInstance.id, props.taskInstance.taskType)
      }
    }

    const getLogs = (row: any) => {
      const { state } = useAsyncState(
          queryLog({
            taskInstanceId: Number(row.id),
            limit: limit.value,
            skipLineNum: skipLineNum.value
          }).then((res: any) => {
            if (!'35679'.includes(res.state)) {
              if(res?.message){
              logMessage.value += res.message
              limit.value += 100
              skipLineNum.value += res.lineNum
              }
              setTimeout(()=>getLogs(row),3000)
            } else {
              logMessage.value += res.message
              logLoadingRef.value = false
              if(detailRef.value.value.getValues().sqlType == '0')
              {showSql.value = true
               getSqlLog(!!props.processCode ? props.processCode : Number(route.query.code), props.projectCode, {instanceId: row.id})
                    .then((res: any) => {dataInfo.value = JSON.parse(res)})}
            }
          }),
          {}
      )

      return state
    }

    const initHeaderLinks = (processInstance: any, taskType?: ITaskType) => {
      headerLinks.value = [
        {
          text: '运行',
          show: !props.taskInstance,
          icon: renderIcon(PlaySquareOutlined),
          action: () => {
            if(!!detailRef.value.value.getValues().leftList && detailRef.value.value.getValues().leftList.length === 0){ message.error('字段必须选择映射关系') }
              else {
            onSaveBeforeRun().then(r => {
              setTimeout(()=>startTaskInstance(!!props.processCode ? props.processCode : Number(route.query.code), props.projectCode, {taskDefinitionCode: detailRef.value.value.getValues().code}),1000)
              showDialog.value = true
              showSql.value = false
              logMessage.value = ''
              logLoadingRef.value = true
              limit.value = 1000
              skipLineNum.value = 0
              setTimeout(()=>
                startImmediateLog(!!props.processCode ? props.processCode : Number(route.query.code), props.projectCode, {taskCode: detailRef.value.value.getValues().code})
                    .then((res: any) => {
                      getLogs(res)
                    }),5000)
              })
            }
          }
        },
        {
          text: '任务属性',
          show: !!(taskType && !TASK_TYPES_MAP[taskType]?.helperLinkDisable),
          icon: renderIcon(MenuUnfoldOutlined),
          action: () => {
            detailRef.value.value.showDra()
          }
        },
        {
          text: t('project.node.view_history'),
          show: !!props.taskInstance,
          action: () => {
            router.push({
              name: 'task-instance',
              params: { processInstanceId: processInstance.id }
            })
          },
          icon: renderIcon(HistoryOutlined)
        },
        {
          text: t('project.node.view_log'),
          show: !!props.taskInstance,
          action: () => {
            handleViewLog()
          },
          icon: renderIcon(ProfileOutlined)
        },
        {
          text: t('project.node.enter_this_child_node'),
          show: props.data.taskType === 'SUB_PROCESS',
          disabled:
            !props.data.id ||
            (router.currentRoute.value.name === 'workflow-instance-detail' &&
              !props.taskInstance),
          action: () => {
            if (router.currentRoute.value.name === 'workflow-instance-detail') {
              querySubProcessInstanceByTaskCode(
                { taskId: props.taskInstance?.id },
                { projectCode: props.projectCode }
              ).then((res: any) => {
                router.push({
                  name: 'workflow-instance-detail',
                  params: { id: res.subProcessInstanceId },
                  query: { code: props.data.taskParams?.processDefinitionCode }
                })
              })
            } else {
              router.push({
                name: 'workflow-definition-detail',
                params: { code: props.data.taskParams?.processDefinitionCode }
              })
            }
          },
          icon: renderIcon(BranchesOutlined)
        }
      ]
    }

    const onTaskTypeChange = (taskType: ITaskType) => {
      // eslint-disable-next-line vue/no-mutating-props
      props.data.taskType = taskType
      initHeaderLinks(props.processInstance, props.data.taskType)
    }

    const resize = (height: number)=>{
      diaPx.value = height
    }

    provide(
      'data',
      computed(() => ({
        projectCode: props.projectCode,
        data: props.data,
        from: props.from,
        readonly: props.readonly,
        definition: props.definition
      }))
    )

    watch(
      () => [props.show, props.data],
      async () => {
        if (!props.show) return
        initHeaderLinks(props.processInstance, props.data.taskType)
        taskStore.init()
        await nextTick()
        detailRef.value.value.setValues(formatModel(props.data))
      }
    )

    onMounted(() => {
      watchEffect(() => {
        if (logMessage.value) {
          nextTick(() => {
            logInstRef.value?.scrollTo({ position: 'bottom', silent: true })
          })
        }
      })
    })

    return () => (
      <div>
      <Modal
        id={"drawer-target"}
        show={props.show}
        title={
          props.from === 1
            ? `${t('project.task.current_task_settings')}`
            : `${t('project.node.current_node_settings')}`
        }
        onConfirm={onConfirm}
        confirmLoading={props.saving}
        confirmDisabled={props.readonly}
        onCancel={onCancel}
        headerLinks={headerLinks}
        disRun={logLoadingRef.value}
      >
        <Detail
          ref={detailRef}
          onTaskTypeChange={onTaskTypeChange}
          key={props.data.taskType}
        />
        <NDrawer
            id={'ttD'}
            v-model:show={showDialog.value}
            placement={'bottom'}
            mask-closable={false}
            show-mask={false}
            resizable
            onUpdateHeight={resize}
            to={"#drawer-target"}
        >
          <NDrawerContent
              header-style={{ padding: '2px' }}
              body-content-style={{ padding: '0px' }}
              closable
          >
            <NTabs
                type={"card"}
                animated
                //closable
                tab-style={"min-width: 70px"}
                default-value={"信息"}
            >
              <NTabPane
                  name={"信息"}
                  tab={"信息"}
              >
                <NLog
                    ref={logInstRef}
                    rows={Math.trunc((diaPx.value-76)/17.5)}
                    log={logMessage.value}
                    loading={logLoadingRef.value}
                    //style={{ height: isFullscreen ? 'calc(100vh - 140px)' : '525px' }}
                />

              </NTabPane>
              {showSql.value&&(<NTabPane
                  //v-for={"panel in panels"}
                  name={"结果"}
                  tab={"结果"}
              >
                <div class={styles.dialog} style={{height: (diaPx.value-80+'px')}}>
                  <NTable single-line={false} style="margin-top: 10px">
                  <thead>
                  <tr>
                    {Object.entries(dataInfo.value[0]).map(([key, value]) => (
                        <th class="tableWidth">{key}</th>
                    ))}
                  </tr>
                  </thead>
                    <tbody>
                    {dataInfo.value.map((item) => (
                        <tr>
                          {Object.values(item).map((value) => (
                              <td class="tableWidth">{value}</td>
                          ))}
                        </tr>
                    ))}
                    </tbody>
                  </NTable>
                </div>
              </NTabPane>)}
            </NTabs>
          </NDrawerContent>
        </NDrawer>
      </Modal>
      </div>
    )
  }
})

export default NodeDetailModal
