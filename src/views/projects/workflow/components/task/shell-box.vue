<template>
  <NSpin :show="!initTag">
  <div class="m-shell-box">
    <CrudWorkflowTooltip
        @save-event="onTaskSubmit(taskData)"
        @run-event="onTaskRun"
        @stop-event="onTaskStop"
        @refresh="initData"
        :version="taskData.version"
        :task-code="props.taskCode"
        :disableRun="logLoadingRef"
        :disableStop="disableStop"
        :readOnly="props.readOnly"
        :releaseState="props.releaseState"
    >
    </CrudWorkflowTooltip>
    <div class="right-bar"><div @click="openTab('first')">任务属性</div><div @click="openTab('second')">参数配置</div><div @click="openTab('third')">资源源配置</div></div>
    <n-split class="split_lower" direction="vertical" v-model:size="logHeight" @drag-move="handleOnDragMove" style="width: calc(100% - 36px)">
      <template #1>
        <div style="height: 100%">
          <Editor
              ref="editorRef"
              :value="taskData.rawScript"
              :onUpdateValue = "(value) => taskData.rawScript = value"
              :options="{readOnly: props.readOnly, language: 'shell' }"
              style="height: 100%"
          />
        </div>
      </template>
      <template #2>
          <n-tabs v-model:value="editableTabsValue" type="card" style="height: 100%;" >
            <template #suffix>
              <n-button @click="VerticalLog" text><n-icon size="16"><ArrowMinimizeVertical20Filled/></n-icon></n-button>
              <n-button @click="minimizeLog" text><n-icon size="16"><ArrowMinimize28Filled/></n-icon></n-button>
              <n-button @click="fullScreenLog" text><n-icon size="16"><FullScreenMinimize24Filled/></n-icon></n-button>
            </template>
            <n-tab-pane name="信息" tab="运行日志">
              <div style="height: 100%" ref="logRowsRef">
                <n-log ref="logInst" :log="logMessage" :loading="logLoadingRef" :rows="logRows"/>
              </div>
            </n-tab-pane>
          </n-tabs>
      </template>
    </n-split>
  </div>
  <div :id="`config-${props.taskCode}`" class="drawer-container" style="z-index: 2004;">
    <n-drawer v-model:show="configTabsVisible" show-mask="transparent" :to="`#config-${props.taskCode}`" :width="700" style="top: 41px">
      <n-drawer-content style="padding: 0">
        <el-tabs v-model="activeTabName" tab-position="right" class="config-tabs">
          <el-tab-pane label="任务属性" name="first" >
            <div style="padding: 30px 20px; overflow: auto">
              <UseTaskProperties :disabled="props.readOnly" @updateTaskProper="updateTaskTab" ref="taskProperRef" :formModel="taskData"/>
            </div>
          </el-tab-pane>
          <el-tab-pane label="参数配置" name="second" >
            <div style="padding: 30px 20px; overflow: auto">
              <UseParameterConfiguration :disabled="props.readOnly" @updateParamConfig="updateTaskTab" ref="paramConfigRef" :formModel="taskData"/>
            </div>
          </el-tab-pane>
          <el-tab-pane label="数据源配置" name="third" >
            <div style="padding: 30px 20px; overflow: auto">
              <UseResources :disabled="props.readOnly" @updateResources="updateTaskTab" ref="resourcesRef"  :formModel="taskData"/>
            </div>
          </el-tab-pane>
        </el-tabs>
        <template #footer>
          <n-button @click="cancelTaskProperties" >
            <span> 取消</span>
          </n-button>
          <n-button :disabled="props.readOnly" type="info" @click="confirmTaskProperties" style="margin-left: 15px">
            <span>
            确认
            </span>
          </n-button>
        </template>
      </n-drawer-content>
    </n-drawer>
  </div>
  </NSpin>
</template>

<script setup>
import {inject, nextTick, onMounted, ref, watch, watchEffect} from "vue";
import {queryTaskDefinitionByCode, updateWithUpstream} from "@/service/modules/task-definition";
import CrudWorkflowTooltip from "@/components/cue/crud-workflow-tooltip.vue";
import UseTaskProperties from "@/views/projects/workflow/components/task/items/use-task-properties.vue";
import UseParameterConfiguration from "@/views/projects/workflow/components/task/items/use-parameter-configuration.vue";
import {NIcon, useMessage} from "naive-ui";
import Editor from '@/components/monaco-editor'
import {formatModel, formatParams as formatData} from "@/views/projects/task/components/node/format-data";
import {execute, startTaskInstance} from "@/service/modules/executors";
import {queryLog, startImmediateLog} from "@/service/modules/log";
import {useAsyncState} from "@vueuse/core";
import UseResources from "@/views/projects/workflow/components/task/items/use-resources.vue";
import {ArrowMinimize28Filled, FullScreenMinimize24Filled, ArrowMinimizeVertical20Filled} from "@vicons/fluent";
import {useHeightAdjustment} from "@/views/projects/workflow/components/task/useHeightAdjustment";

const props = defineProps({
  taskCode: {
    type: Number,
    default: 0
  },
  projectCode: {
    type: Number,
    default: 0
  },
  processCode: {
    type: Number,
    default: 0
  },
  readOnly: {
    type: Boolean,
    default: false
  },
  releaseState: {
    type: Number
  }
})
useHeightAdjustment(true)
//src/views/projects/workflow/treemap/index.tsx
const updateTab = inject('updateTab')
const updateEdited = inject('updateEdited')
const message = useMessage()
const saveBeforeRun = ref(false)
const configTabsVisible = ref(false)
const activeTabName = ref(1)
const logHeight = ref('calc(100% - 90px)')
const logRowsRef = ref()
const logRows = ref(13)
const taskProperRef = ref(null)
const paramConfigRef = ref(null)
const resourcesRef = ref(null)
const editorRef = ref()
const tabData = ref([])
const initTag = ref(false)
const logLoadingRef = ref(false)
const processInstanceId = ref()
const limit = ref()
const skipLineNum = ref()
const logMessage = ref('')
const disableStop = ref(true)
const logInst = ref()
const editableTabsValue = ref('信息')
const taskData = ref({
  code: '',
  name: '',
  description: '',
  taskType: 'SHELL',
  flag: 'YES',
  taskPriority: 'MEDIUM',
  workerGroup: 'default',
  environmentCode: -1,
  failRetryTimes: 0,
  failRetryInterval: 1,
  timeoutFlag: 'CLOSE',
  timeoutNotifyStrategy: ['WARN'],
  timeout: 30,
  delayTime: 0,
  taskGroupId: null,
  taskGroupPriority: null,

  localParams: [],
  resourceList: [],
  rawScript: ''
})

const onTaskSubmit = async (data) => {
  const params = formatData(data)
  try {
    await updateWithUpstream(
        props.projectCode,
        data.code,
        {
          upstreamCodes: params.upstreamCodes,
          taskDefinitionJsonObj: JSON.stringify(params.taskDefinitionJsonObj)
        }
    )
    message.success('成功')
    await initData()
    updateTab(data.code, data.name)
    updateEdited(taskData.value.code, false)
    saveBeforeRun.value = false
    return true
  } catch (err) {
    message.error('保存出错，请联系系统维护人员')
    return false
  }
}

const onTaskRun = () => {
  if(saveBeforeRun.value) {
    message.info('任务处于已编辑状态，请先保存再运行!')
  }else{
    startTaskInstance(props.processCode, props.projectCode, {taskDefinitionCode: props.taskCode})
    if(logHeight.value === 'calc(100% - 90px)') {
      logHeight.value = 'calc(100% - 360px)'
    }
    logMessage.value = ''
    logLoadingRef.value = true
    limit.value = 1000
    skipLineNum.value = 0
    setTimeout(()=>{
      disableStop.value = false
      startImmediateLog(props.processCode, props.projectCode, {taskCode: props.taskCode})
          .then((res) => {
            getLogs(res)
            processInstanceId.value = res.processInstanceId
          })
    },3000)
  }
}

const getLogs = (row) => {
  const { state } = useAsyncState(
      queryLog({
        taskInstanceId: Number(row.id),
        limit: limit.value,
        skipLineNum: skipLineNum.value
      }).then((res) => {
        if (!'35679'.includes(res.state)) {
          if(res?.message){
            logMessage.value += res.message
            limit.value += 100
            skipLineNum.value += res.lineNum
          }
          if(disableStop.value){
            setTimeout(()=>getLogs(row),3000)
          }
        } else {
          logMessage.value += res.message
          logLoadingRef.value = false
          disableStop.value = true
        }
      }),
      {}
  )

  return state
}

function VerticalLog () {
  logHeight.value = 'calc(100% - 360px)'
  nextTick(()=>{
    handleOnDragMove()
  })
}

function minimizeLog () {
  logHeight.value = 'calc(100% - 90px)'
}

function fullScreenLog () {
  logHeight.value = '0'
  nextTick(()=>{
    handleOnDragMove()
  })
}

function onTaskStop () {
  execute({
    processInstanceId: processInstanceId.value,
    executeType: 'STOP'
  },
  props.projectCode).then(() => {
    disableStop.value = true
    logLoadingRef.value = false
    window.$message.success('成功')
  })
}

function openTab (tab) {
  configTabsVisible.value = !configTabsVisible.value
  activeTabName.value = tab
}

function confirmTaskProperties() {
  tabData.value = []
  taskProperRef.value.save()
  paramConfigRef.value.save();
  resourcesRef.value.save();
}

function updateTaskTab(index, val) {
  tabData.value[index] = val
  ifSave()
}

function updateJsonObject(original, updates) {
  // 遍历更新对象
  for (let key in updates) {
    // 检查原始对象是否包含该属性
    if (original.hasOwnProperty(key)) {
      // 如果存在，则更新属性值
      original[key] = updates[key];
    }
  }
}

function ifSave() {
  let actualValues = tabData.value.filter(value => value !== undefined && value !== null);
  if(actualValues.length === 3) {
    updateJsonObject(taskData.value, tabData.value[0])
    updateJsonObject(taskData.value, tabData.value[1])
    updateJsonObject(taskData.value, tabData.value[2])
    configTabsVisible.value = !configTabsVisible.value
  }
}

function  handleOnDragMove () {
  logRows.value = Math.trunc((logRowsRef.value.offsetHeight)/17.5)
}

function cancelTaskProperties () {
  configTabsVisible.value = !configTabsVisible.value
}

async function initData() {
  initTag.value = false
  const params = formatModel(await queryTaskDefinitionByCode(props.taskCode, props.projectCode))
  taskData.value = {
    ...taskData.value,
    ...params
  }
  setTimeout(()=>{
    initTag.value = true
  },0)

}

watch(taskData, () => {
  if(initTag.value) {
    updateEdited(taskData.value.code, true)
    saveBeforeRun.value = true
  }
},{deep: true} );

onMounted( () => {
  initData()
  watchEffect(() => {
    if (logMessage.value) {
      nextTick(() => {
        logInst.value?.scrollTo({ position: 'bottom', silent: true })
      })
    }
  })
})

</script>

<style lang="scss" scoped>

.m-shell-box {
  width: 100%;
  height: calc(100vh - var(--run-box-height-adjustment));
  position: relative;
  background: #FFFFFF;

  .right-bar {
    position: absolute;
    right: 0;
    top: 40px;
    z-index: 9;
    width: 36px;
    height: 100%;
    border-left: 1px solid #ddd;
    background-color: #fff;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-flow: column nowrap;
    -webkit-box-align: center;
    align-items: center;

    >div {
      writing-mode: vertical-lr;
      padding: 15px 5px;
      cursor: pointer;
      border-left: 2px solid transparent;
      border-right: 3px solid transparent;

      &:hover {
        color: #3790fb;
        border-right-color: #3790fb;
      }
    }
  }

}

.drawer-container {
  :deep(.n-drawer-body-content-wrapper) {
    padding: 0;
  }

  .config-tabs {
    height: 100%;

    :deep(.el-tabs__item) {
      padding: 15px 8px !important;
      height: auto;
      -webkit-writing-mode: tb-rl;
      -ms-writing-mode: tb-rl;
      writing-mode: tb-rl;
    }

    :deep(.el-tabs__content) {
      height: 100%;
      overflow: auto;
    }
  }
}

.n-base-select-menu {
  :deep(.n-base-select-option.n-base-select-option--pending::before) {
    opacity: 0.5;
  }
}

.split_lower {

  .n-split-pane-1 {
    max-height: calc(100% - 90px) !important;
  }

  .n-tab-pane {
    overflow: auto;
    height: calc(100% - 116px);
    padding: 15px;
    width: calc(100% - 36px);
  }

  :deep(.n-tabs-pad) {
    background-color: #F5F7FA;
  }

  :deep(.n-tabs-nav__suffix) {
    background-color: #F5F7FA;

    .n-button:nth-child(1), .n-button:nth-child(3) {
      padding: 0 15px
    }
  }
}


</style>
