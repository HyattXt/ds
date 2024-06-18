<template>
  <div class="m-sql-box">
    <CrudWorkflowTooltip
        @save-event="onTaskSubmit(taskData)"
        @run-event="onTaskRun(taskData)"
        @stop-event="onTaskStop"
        @format-event="formatSql"
        @refresh="initData"
        :version="taskData.version"
        :task-code="props.taskCode"
        :disableRun="disableRun"
        :disableStop="disableStop"
        showFormat
        :showOnline="props.readOnly"
    >
      <template #right>
        <div class="datasource"><span>数据源类型：</span> <span>{{taskData.type}}</span> <span>数据源：</span> <span>{{ dataSourceName }}</span></div>
      </template>
    </CrudWorkflowTooltip>
    <div class="right-bar"><div @click="openTab('first')">任务属性</div><div @click="openTab('second')">参数配置</div><div @click="openTab('third')">数据源配置</div></div>
    <n-split class="split_lower" direction="vertical" v-model:size="logHeight" style="width: calc(100% - 36px)">
      <template #1>
        <div style="height: 100%">
          <Editor
              ref="editorRef"
              :value="taskData.sql"
              :onUpdateValue = "(value) => taskData.sql = value"
              :options="{readOnly: props.readOnly, language: 'sql'}"
              style="height: 100%"
          />
        </div>
      </template>
      <template #2>
          <n-tabs v-model:value="editableTabsValue" type="card"  style="height: 100%" >
            <template #suffix>
              <n-button @click="VerticalLog" text><n-icon size="16"><ArrowMinimizeVertical20Filled/></n-icon></n-button>
              <n-button @click="minimizeLog" text><n-icon size="16"><ArrowMinimize28Filled/></n-icon></n-button>
              <n-button @click="fullScreenLog" text><n-icon size="16"><FullScreenMinimize24Filled/></n-icon></n-button>
            </template>
            <n-tab-pane name="信息" tab="信息">
              <div>执行时间:{{ elapsedTime/50 }}s</div>
              <div>{{ runStatus }}</div>
            </n-tab-pane>
            <n-tab-pane
                v-for="(item, index) in resultData"
                :key="index"
                :name="'结果' + (index + 1)"
                :tab="tabProps(item, index)"
            >
              <div style="height: 100%">
                <el-table :data="item" border show-overflow-tooltip	height="100%">
                  <el-table-column type="index" label="#"/>
                  <el-table-column v-for="key in Object.keys(item[0] || {})" :prop="key" :label="key"/>
                </el-table>
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
              <UseDatasource :disabled="props.readOnly" @updateDatasource="updateTaskTab" ref="datasourceRef"  :formModel="taskData"/>
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
</template>

<script setup>
import {h, inject, nextTick, onMounted, ref, watch} from "vue";
import {queryTaskDefinitionByCode, updateWithUpstream} from "@/service/modules/task-definition";
import CrudWorkflowTooltip from "@/components/cue/crud-workflow-tooltip.vue";
import {queryDataSourceList} from "@/service/modules/data-source";
import UseTaskProperties from "@/views/projects/workflow/components/task/items/use-task-properties.vue";
import UseParameterConfiguration from "@/views/projects/workflow/components/task/items/use-parameter-configuration.vue";
import UseDatasource from "@/views/projects/workflow/components/task/items/use-datasource.vue";
import {NIcon, useMessage} from "naive-ui";
import Editor from '@/components/monaco-editor'
import {formatModel, formatParams as formatData} from "@/views/projects/task/components/node/format-data";
import {useUserStore} from "@/store/user/user";
import {runTask, stopTask} from "@/service/modules/executors";
import { v4 as uuidV4 } from "uuid"
import {
  ArrowMinimize28Filled,
  ArrowMinimizeVertical20Filled,
  Circle24Filled,
  FullScreenMinimize24Filled
} from "@vicons/fluent";
import {useHeightAdjustment} from "@/views/projects/workflow/components/task/useHeightAdjustment";

const props = defineProps({
  taskCode: {
    type: Number,
    default: ''
  },
  projectCode: {
    type: Number,
    default: ''
  },
  processCode: {
    type: Number,
    default: ''
  },
  readOnly: {
    type: Boolean,
    default: false
  }
})
useHeightAdjustment(true)
//src/views/projects/workflow/treemap/index.tsx
const updateTab = inject('updateTab')
const updateEdited = inject('updateEdited')
const userStore = useUserStore()
const userInfo = userStore.getUserInfo
const message = useMessage()
const configTabsVisible = ref(false)
const activeTabName = ref(1)
const logHeight = ref('calc(100% - 90px)')
const dataSourceList = ref()
const dataSourceName = ref ('')
const taskProperRef = ref(null)
const paramConfigRef = ref(null)
const datasourceRef = ref(null)
const editorRef = ref()
const tabData = ref([])
const initTag = ref(false)
const limit = ref()
const skipLineNum = ref()
const disableStop = ref(true)
const disableRun = ref(false)
const elapsedTime = ref(0)
const timerId = ref(0)
const resultData = ref([])
const editableTabsValue = ref('信息')
const runStatus = ref('')
const uuid = ref('')
const stopStatus = ref(false)
const taskData = ref({
  code: '',
  name: '',
  description: '',
  taskType: 'SQL',
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
  type: '',
  datasource: '',
  sql: '',
  sqlType: '1',
  preStatements: [],
  postStatements: [],
  segmentSeparator: '',
  displayRows: 1000,
  indicatorStatus: null,
  indicatorCode: ''
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
    return true
  } catch (err) {
    return false
  }
}

const startTimer = () => {
  runStatus.value = ''
  elapsedTime.value = 0
  timerId.value = setInterval(() => {
    elapsedTime.value++;
  }, 20);
};

const stopTimer = () => {
  clearInterval(timerId.value);
  timerId.value = 0;
};

const onTaskRun = async (data) => {
  let runData = JSON.parse(JSON.stringify(data))
  if(editorRef.value.getSelectionVal()){
    runData.sql = editorRef.value.getSelectionVal()
  }
  startTimer()
  resultData.value = []
  editableTabsValue.value = '信息'
  if(logHeight.value === 'calc(100% - 90px)') {
    logHeight.value = 'calc(100% - 360px)'
  }
  disableStop.value = false
  disableRun.value = true
  stopStatus.value = false
  uuid.value = uuidV4()
  try {
    resultData.value = await runTask(props.projectCode, {taskDefinitionJson: '[' + JSON.stringify(formatData(runData).taskDefinitionJsonObj) + ']', threadName: uuid.value})
    runStatus.value = 'ok'
  } catch (error) {
    if(stopStatus.value){
      runStatus.value = 'cancel'
    } else {
      message.error( error.message)
      runStatus.value = 'error'
    }
  } finally {
    stopTimer()
    disableStop.value = true
    disableRun.value = false
  }
}

const onTaskStop = async () => {
  stopStatus.value = false
  let res = await stopTask(props.projectCode, uuid.value)
  if(res) {
    message.info("停止成功")
    runStatus.value = 'cancel'
  }
  stopTimer()
  stopStatus.value = true
  disableStop.value = true
}

const tabProps = (item, index) => {
  return h('span',  [
    h(NIcon, {
      color: item[0].status === '失败' ? 'red' : 'green'
    }, () => h(Circle24Filled) ),
    h('span', ' 结果' + (index + 1))
  ])
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

function formatSql () {
  editorRef.value.sqlFormat()
}

function openTab (tab) {
  configTabsVisible.value = !configTabsVisible.value
  activeTabName.value = tab
}

function findNameById(id, dataSource) {
  // 使用 find 方法在 dataSource 中查找第一个满足条件的对象
  let foundObject = dataSource.find(obj => obj.id === id);

  // 如果找到了对应的对象，返回它的 name 属性，否则返回 null
  return foundObject ? foundObject.name : null;
}

function confirmTaskProperties() {
  tabData.value = []
  taskProperRef.value.save()
  paramConfigRef.value.save();
  datasourceRef.value.save();
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
    updateDatasource()
    configTabsVisible.value = !configTabsVisible.value
  }
}

function cancelTaskProperties () {
  configTabsVisible.value = !configTabsVisible.value
}

async function updateDatasource() {
  dataSourceList.value = await queryDataSourceList({type: taskData.value.type || 'MYSQL'})
  dataSourceName.value = findNameById(taskData.value.datasource, dataSourceList.value)
}

async function initData() {
  initTag.value = false
  const params = formatModel(await queryTaskDefinitionByCode(props.taskCode, props.projectCode))
  taskData.value = {
    ...taskData.value,
    ...params
  }
  if(!taskData.value.sql){
    taskData.value.sql = '-- '+taskData.value.type+'\n' +
        '-- *****************************************************************************\n' +
        '-- author: '+userInfo.userName+'\n' +
        '-- create_time: '+taskData.value.createTime+'\n' +
        '-- *****************************************************************************'
  }
  await updateDatasource()
  initTag.value = true
}

watch(taskData, () => {
  if(initTag.value) {
    updateEdited(taskData.value.code, true)
  }
},{deep: true} );

onMounted( () => {
  initData()
})

</script>

<style lang="scss" scoped>

.m-sql-box {
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

.datasource {
  margin-right: 15px;

  & span:nth-child(2n) {
    font-weight: 700;
    margin-right: 15px;
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

  :deep(.n-tabs-tab-pad) {
    width: 0
  }
}

</style>
