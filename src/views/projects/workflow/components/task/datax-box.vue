<template>
  <div class="m-datax-box">
    <CrudWorkflowTooltip
        @save-event="onTaskSubmit(taskData)"
        @run-event="onTaskRun"
        @stop-event="onTaskStop"
        @refresh="initData"
        :version="taskData.version"
        :task-code="props.taskCode"
        :disableRun="logLoadingRef"
        :disableStop="disableStop"
        :showOnline="props.readOnly"
    >
    </CrudWorkflowTooltip>
    <div class="right-bar"><div @click="openTab('first')">任务属性</div><div @click="openTab('second')">参数配置</div></div>
    <n-split class="split_lower" direction="vertical" v-model:size="logHeight" @drag-move="handleOnDragMove" style="width: calc(100% - 36px)">
      <template #1>
        <div class="build-form">
          <NForm :disabled="props.readOnly" size="small" label-placement="left" label-align="right" label-width="100" :model="taskData" :rules="rules" ref="formRef">
            <n-collapse :default-expanded-names="['1', '2', '3', '4']">
              <n-collapse-item  name="1">
                <template #header>
                  <n-text type="info">
                    1 选择数据源
                  </n-text>
                </template>
                <template #header-extra>
                  <div class="box">
                    <p>数据来源</p>
                  </div>
                  <div class="box">
                    <p>数据去向</p>
                  </div>
                </template>
                <div style="padding: 0 15px">
                  <NGrid :cols="2">
                    <NGi>
                      <NGrid :cols="12" :x-gap="10">
                        <n-form-item-gi :span="6" label="数据源" path="dsType" key="dsType">
                          <n-select v-model:value="taskData.dsType" @update:value="updateDataSource" :options="datasourceTypes"/>
                        </n-form-item-gi>
                        <n-form-item-gi :span="6" path="dataSource" key="dataSource">
                          <n-select v-model:value="taskData.dataSource" @update:value="updateSourceTableList" label-field="name" value-field="id" :options="dataSourceList"/>
                        </n-form-item-gi>
                        <n-form-item-gi :span="datasourceSpan" label="表名" path="sourceTable" key="sourceTable">
                          <n-select v-model:value="taskData.sourceTable" @update:value="updateSplitPk" label-field="TABLE_NAME" value-field="TABLE_NAME" filterable :options="sourceTableList"/>
                        </n-form-item-gi>
                        <n-form-item-gi :span="12" label="读取模式" key="executeMode">
                          <n-radio-group v-model:value="taskData.executeMode" @update:value="initConstants">
                            <n-space>
                              <n-radio key="0" value="0">
                                表
                              </n-radio>
                              <n-radio key="1" value="1">
                                查询
                              </n-radio>
                            </n-space>
                          </n-radio-group>
                        </n-form-item-gi>
                        <n-form-item-gi :span="sqlEditorSpan" label="SQL语句" path="sql" key="sql">
                          <Editor
                              ref="editorRef"
                              :value="taskData.sql"
                              :onUpdateValue = "(value) => taskData.sql = value"
                              :options="{readOnly: props.readOnly, language: 'sql' }"
                          />
                        </n-form-item-gi>
                        <n-form-item-gi :span="datasourceSpan" label="数据过滤" key="where">
                          <NInput
                              type="textarea"
                              v-model:value="taskData.where"
                              placeholder="请参考相关SQL语法填写where过滤语句(不要填写where关键字)"
                          />
                        </n-form-item-gi>
                        <n-form-item-gi :span="splitPkSpan" label="切分键" key="splitPk">
                          <NSelect
                              v-model:value="taskData.splitPk"
                              :options="splitPkOption"
                              label-field="TABLE_NAME"
                              value-field="TABLE_NAME"
                              @click="updateSplitPk"
                              filterable
                          />
                          <n-tooltip trigger="hover">
                            <template #trigger>
                              <NIcon style="padding-left: 10px">
                                <QuestionCircleTwotone/>
                              </NIcon>
                            </template>
                            <p>如果指定splitPk，表示用户希望使用splitPk代表的字段进行数据分片，DataX因此会启动并发任务进行数据同步，这样可以大大提供数据同步的效能。</p>
                            <p>推荐splitPk用户使用表主键，因为表主键通常情况下比较均匀，因此切分出来的分片也不容易出现数据热点。</p>
                            <p>目前splitPk仅支持整形数据切分，不支持浮点、字符串、日期等其他类型。如果用户指定其他非支持类型，DataX将报错！</p>
                            <p>如果splitPk不填写，包括不提供splitPk或者splitPk值为空，DataX视作使用单通道同步该表数据。</p>
                          </n-tooltip>
                        </n-form-item-gi>
                      </NGrid>
                    </NGi>
                    <NGi>
                      <NGrid :cols="12" :x-gap="10">
                        <n-form-item-gi :span="6" label="数据源" path="dtType" key="dtType">
                          <n-select v-model:value="taskData.dtType" @update:value="updateDataTarget" :options="datasourceTypes"/>
                        </n-form-item-gi>
                        <n-form-item-gi :span="6" path="dataTarget" key="dataTarget">
                          <n-select v-model:value="taskData.dataTarget" @update:value="updateTargetTableList" label-field="name" value-field="id" :options="dataTargetList"/>
                        </n-form-item-gi>
                        <n-form-item-gi :span="12" label="表名" path="targetTable" key="targetTable">
                          <n-select v-model:value="taskData.targetTable" label-field="TABLE_NAME" value-field="TABLE_NAME" filterable :options="targetTableList"/>
                        </n-form-item-gi>
                        <n-form-item-gi :span="writeModeSpan" label="写入模式" key="writeMode">
                          <n-radio-group v-model:value="taskData.writeMode">
                            <n-space>
                              <n-radio key="insert" value="insert">
                                insert
                              </n-radio>
                              <n-radio key="replace" value="replace">
                                replace
                              </n-radio>
                              <n-radio key="update" value="update">
                                update
                              </n-radio>
                            </n-space>
                          </n-radio-group>
                          <n-tooltip trigger="hover">
                            <template #trigger>
                              <NIcon>
                                <QuestionCircleTwotone/>
                              </NIcon>
                            </template>
                            <p>控制写入数据到目标表采用 insert into 或者 replace into 或者 ON DUPLICATE KEY UPDATE 语句。</p>
                          </n-tooltip>
                        </n-form-item-gi>
                        <n-form-item-gi :span="12-writeModeSpan"  key="createTable" style="display: flex; justify-content: flex-end;">
                          <div>
                            <n-button quaternary type="info" @click="getTableSql">生成目标表</n-button>
                          </div>
                        </n-form-item-gi>
                        <n-form-item-gi :span="12" label="前置SQL" key="preSql">
                          <NInput
                              type="textarea"
                              v-model:value="taskData.preSql"
                              placeholder="请输入导入数据前执行的SQL脚本"
                          />
                        </n-form-item-gi>
                        <n-form-item-gi :span="12" label="后置SQL" key="postSql">
                          <NInput
                              type="textarea"
                              v-model:value="taskData.postSql"
                              placeholder="请输入导入数据后执行的SQL脚本"
                          />
                        </n-form-item-gi>
                      </NGrid>
                    </NGi>
                  </NGrid>
                </div>
              </n-collapse-item>
              <n-collapse-item name="2">
                <template #header>
                  <n-text type="info">
                    2 字段映射
                  </n-text>
                </template>
                <div style="padding: 0 30px">
                  <NGrid :cols="12" :x-gap="20">
                    <n-form-item-gi :span="12">
                      <NSpace justify="start">
                        <NButton :disabled="props.readOnly" type="info" size="small" @click="getTableColumn">获取字段</NButton>
                        <NButton :disabled="props.readOnly" type="info" size="small" @click="sameLine">同行关联</NButton>
                        <NButton :disabled="props.readOnly" type="info" size="small" @click="sameName">同名关联</NButton>
                        <NButton :disabled="props.readOnly" type="info" size="small" @click="disassociate">取消关联</NButton>
                      </NSpace>
                    </n-form-item-gi>
                    <n-gi :span="12">
                      <UseColumnJsplumb
                          ref="jsplumbRef"
                          :leftData="taskData.leftData"
                          :rightData="taskData.rightData"
                          :leftList="taskData.leftList"
                          :rightList="taskData.rightList"
                          :dataSource="taskData.dataSource"
                          :dataTarget="taskData.dataTarget"
                          :dsType="taskData.dsType"
                          :dtType="taskData.dtType"
                          :taskCode="props.taskCode"
                          :disabled="props.readOnly"
                          @save-jsplumb="saveJsplumb"
                      />
                    </n-gi>
                  </NGrid>
                </div>
              </n-collapse-item>
              <n-collapse-item name="3">
                <template #header>
                  <n-text type="info">
                    3 通道控制
                  </n-text>
                </template>
                <div style="padding: 0 30px">
                  <NGrid :cols="12" :x-gap="20">
                    <n-form-item-gi label-width="150" :span="4" label="限流(字节数)" key="jobSpeedByte">
                      <NSelect
                          v-model:value="taskData.jobSpeedByte"
                          :options="jobSpeedByteOptions"
                      />
                    </n-form-item-gi>
                    <n-form-item-gi label-width="150" :span="8" label="错误记录数超过" key="record">
                      <NInputNumber
                          v-model:value="taskData.record"
                          :min="0"
                      />
                      <span style="padding-left: 10px">条, 任务自动结束</span>
                    </n-form-item-gi>
                  </NGrid>
                  <NGrid :cols="12" :x-gap="20">
                    <n-form-item-gi label-width="150" :span="4" label="限流(记录数)" key="jobSpeedRecord">
                      <NSelect
                          v-model:value="taskData.jobSpeedRecord"
                          :options="jobSpeedRecordOptions"
                      />
                    </n-form-item-gi>
                    <n-form-item-gi label-width="150" :span="8" label="错误记录数超过" key="percentage">
                      <NInputNumber
                          v-model:value="taskData.percentage"
                          :min="0"
                          :max="100"
                      />
                      <span style="padding-left: 10px">%, 任务自动结束</span>
                    </n-form-item-gi>
                    <n-form-item-gi label-width="150" :span="12" label="作业并发数" key="channel">
                      <NInputNumber
                          v-model:value="taskData.channel"
                          :min="1"
                          :max="20"
                      />
                    </n-form-item-gi>
                  </NGrid>
                </div>
              </n-collapse-item>
              <n-collapse-item name="4">
                <template #header>
                  <n-text type="info">
                    4 虚拟机配置
                  </n-text>
                </template>
                <div style="padding: 0 30px 30px">
                  <NGrid :cols="12" :x-gap="20">
                    <n-form-item-gi label-width="150" :span="4" label="最小内存" key="xms">
                      <NSelect
                          v-model:value="taskData.xms"
                          :options="memoryLimitOptions"
                      />
                    </n-form-item-gi>
                    <n-form-item-gi label-width="150" :span="4" label="最大内存" key="xmx">
                      <NSelect
                          v-model:value="taskData.xmx"
                          :options="memoryLimitOptions"
                      />
                    </n-form-item-gi>
                  </NGrid>
                </div>
              </n-collapse-item>
            </n-collapse>
          </NForm>
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
  <NModal v-model:show="showSqlModal">
    <NCard title="建表SQL" size="small" style="width: 800px">
      <Editor
          :value="taskData.createSql"
          :onUpdateValue = "(value) => taskData.createSql = value"
          :options="{ language: 'sql' }"
      />
      <template #footer>
        <n-space justify="end">
          <NButton @click="showSqlModal = false">取消</NButton>
          <NButton type="info" @click="executeTableSql">执行</NButton>
        </n-space>
      </template>
    </NCard>
  </NModal>
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
import {computed, inject, nextTick, onMounted, ref, watch, watchEffect} from "vue";
import {
  querySqlColum,
  queryTaskConnect,
  queryTaskDefinitionByCode,
  updateWithUpstream
} from "@/service/modules/task-definition";
import CrudWorkflowTooltip from "@/components/cue/crud-workflow-tooltip.vue";
import UseTaskProperties from "@/views/projects/workflow/components/task/items/use-task-properties.vue";
import UseParameterConfiguration from "@/views/projects/workflow/components/task/items/use-parameter-configuration.vue";
import UseColumnJsplumb from "@/views/projects/workflow/components/task/items/use-column-jsplumb.vue";
import {NIcon, useMessage} from "naive-ui";
import {formatModel, formatParams as formatData} from "@/views/projects/task/components/node/format-data";
import {execute, startTaskInstance} from "@/service/modules/executors";
import {queryLog, startImmediateLog} from "@/service/modules/log";
import {useAsyncState} from "@vueuse/core";
import {
  ArrowMinimize28Filled,
  ArrowMinimizeVertical20Filled,
  FullScreenMinimize24Filled
} from "@vicons/fluent";
import {
  QuestionCircleTwotone
} from "@vicons/antd";
import {
  queryDataSourceList
} from "@/service/modules/data-source";
import {find, lowerCase} from "lodash";
import Editor from "@/components/monaco-editor";
import axios from "axios";
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
const jsplumbRef = ref(null)
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
const dataSourceList = ref()
const dataTargetList = ref()
const sourceTableList = ref()
const targetTableList = ref()
const splitPkOption = ref()
const sqlEditorSpan = ref(0)
const datasourceSpan = ref(12)
const splitPkSpan = ref(12)
const writeModeSpan = computed(() => (taskData.value.dtType === 'MYSQL' && taskData.value.dataTarget ? 8 : 0))
const showSqlModal = ref(false)
const jdbcConnectInfo = ref({
   sourceConnect : {
     jdbcUrl: '',
     password: '',
     user: '',
     database: ''
   },
   targetConnect : {
     jdbcUrl: '',
     password: '',
     user: '',
     database: ''
   }
})
const SecondDevCreateUrl = import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_APP_DEV_API_URL
    : window.webConfig.VITE_APP_PROD_API_URL
const taskData = ref({
  code: '',
  name: '',
  description: '',
  taskType: 'DATAX',
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
  customConfig: 1,
  dsType: null,
  dataSource: null,
  dtType: null,
  dataTarget: null,
  executeMode: '0',
  writeMode: 'insert',
  sql: '',
  sourceTable: null,
  targetTable: null,
  splitPk: null,
  where: '',
  leftList: [],
  rightList: [],
  leftData: [],
  rightData: [],
  targetDatabase: '',
  jobSpeedByte: 0,
  jobSpeedRecord: 1000,
  channel: 1,
  record: 0,
  percentage: 0,
  preStatements: [],
  postStatements: [],
  preSql: '',
  postSql: '',
  jsonConfig: false,
  json: '',
  xms: 1,
  xmx: 1,

  createSql: ''
})

const rules = {
  dsType: {
    required: true,
    trigger: 'blur',
    message: '请选择数据源'
  },
  dtType: {
    required: true,
    trigger: 'blur',
    message: '请选择数据源'
  },
  dataSource: {
    required: true,
    trigger: 'blur',
    type: 'number',
    message: '请选择数据源'
  },
  dataTarget: {
    required: true,
    trigger: 'blur',
    type: 'number',
    message: '请选择数据源'
  },
  sourceTable: {
    required: true,
    trigger: 'blur',
    message: '请选择来源表'
  },
  targetTable: {
    required: true,
    trigger: 'blur',
    message: '请选择去向表'
  },
  sql: {
    required: true,
    trigger: 'blur',
    message: '请输入SQL'
  },
}

const jobSpeedByteOptions = [
  {
    label: '0(不限流)',
    value: 0
  },
  {
    label: '1KB',
    value: 1024
  },
  {
    label: '10KB',
    value: 10240
  },
  {
    label: '50KB',
    value: 51200
  },
  {
    label: '100KB',
    value: 102400
  },
  {
    label: '512KB',
    value: 524288
  }
]

const jobSpeedRecordOptions = [
  {
    label: '0(不限流)',
    value: 0
  },
  {
    label: '500',
    value: 500
  },
  {
    label: '1000',
    value: 1000
  },
  {
    label: '1500',
    value: 1500
  },
  {
    label: '2000',
    value: 2000
  },
  {
    label: '2500',
    value: 2500
  },
  {
    label: '3000',
    value: 3000
  }
]

const memoryLimitOptions = [
  {
    label: '1G',
    value: 1
  },
  {
    label: '2G',
    value: 2
  },
  {
    label: '3G',
    value: 3
  },
  {
    label: '4G',
    value: 4
  }
]

const datasourceTypes = [
  {
    id: 0,
    label: 'MYSQL',
    value: 'MYSQL'
  },
  {
    id: 1,
    label: 'POSTGRESQL',
    value: 'POSTGRESQL'
  },
  {
    id: 2,
    label: 'HIVE',
    value: 'HIVE'
  },
  {
    id: 3,
    label: 'SPARK',
    value: 'SPARK'
  },
  {
    id: 4,
    label: 'CLICKHOUSE',
    value: 'CLICKHOUSE'
  },
  {
    id: 5,
    label: 'ORACLE',
    value: 'ORACLE'
  },
  {
    id: 6,
    label: 'SQLSERVER',
    value: 'SQLSERVER'
  },
  {
    id: 7,
    label: 'DB2',
    value: 'DB2'
  },
  {
    id: 8,
    label: 'PRESTO',
    value: 'PRESTO'
  },
  {
    id: 9,
    label: 'REDSHIFT',
    value: 'REDSHIFT'
  },
  {
    id: 12,
    label: 'DM',
    value: 'DM'
  }
]

const onTaskSubmit = async (data) => {
  jsplumbRef.value.save()
  taskData.value.json = formatJson()
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
          if(!disableStop.value){
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

const initConstants = () => {
  sqlEditorSpan.value = taskData.value.executeMode === '0' ? 0 : 12
  datasourceSpan.value = taskData.value.executeMode === '0' ? 12 : 0
  splitPkSpan.value = taskData.value.executeMode === '0' ? 12 : 0

  if(taskData.value.executeMode === '0'){
    taskData.value.sql = ''
  }else{
    taskData.value.sourceTable = null
    taskData.value.splitPk = null
  }
}

const getConnect = (id, type)=>{
  queryTaskConnect(id).then(
      (res) => {
        if( type === 'dataSource' ){ jdbcConnectInfo.value.sourceConnect = res } else { jdbcConnectInfo.value.targetConnect = res }
      }
  )
}

async function updateDataSource(type) {
  dataSourceList.value = await queryDataSourceList({type: type || 'MYSQL'})
  if (!dataSourceList.value.length && taskData.value.dataSource) {
    taskData.value.dataSource = null
    taskData.value.sourceTable = null
  }
  if (dataSourceList.value.length && taskData.value.dataSource) {
    const item = find(dataSourceList.value, { id: taskData.value.dataSource })
    if (!item) {
      taskData.value.dataSource = null
      taskData.value.sourceTable = null
      taskData.value.splitPk = null
    }
  }
}

async function updateDataTarget(type) {
  dataTargetList.value = await queryDataSourceList({type: type || 'MYSQL'})
  if (!dataTargetList.value.length && taskData.value.dataTarget) {
    taskData.value.dataTarget = null
    taskData.value.targetTable = null
  }
  if (dataTargetList.value.length && taskData.value.dataTarget) {
    const item = find(dataTargetList.value, { id: taskData.value.dataTarget })
    if (!item) {
      taskData.value.dataTarget = null
      taskData.value.targetTable = null
    }
  }
}

async function getDatasourceTables(dataSource ,type) {
  let url = SecondDevCreateUrl + '/HDataApi/apiService/getTableByDataSourceId'
  let params = {
    type: type,
    id: dataSource
  }
  try {
    const response = await axios.post(url, params);
    return response.data.data;
  } catch (error) {
    message.error(error);
  }
}

async function updateSourceTableList(dataSource) {
  if(dataSource) {
    try {
      sourceTableList.value = await getDatasourceTables(dataSource, datasourceTypes.find(datasource => datasource.value === taskData.value.dsType)?.id)
    } catch (err) {
      sourceTableList.value = []
    }
  }
  if (!sourceTableList.value.length && taskData.value.sourceTable) {
    taskData.value.sourceTable = null
    taskData.value.splitPk = null
  }
  if (sourceTableList.value.length && taskData.value.sourceTable) {
    const item = find(sourceTableList.value, { value: taskData.value.sourceTable })
    if (!item) {
      taskData.value.sourceTable = null
      taskData.value.splitPk = null
    }
  }
  getConnect(dataSource, 'dataSource')
}

async function initSourceTableList(dataSource, type) {
  if(dataSource) {
    try {
      sourceTableList.value = await getDatasourceTables(dataSource, type)
    } catch (err) {
      sourceTableList.value = []
    }
  }
  getConnect(dataSource, 'dataSource')
}

async function updateTargetTableList(dataSource) {
    if(dataSource) {
      try {
        targetTableList.value = await getDatasourceTables(dataSource, datasourceTypes.find(datasource => datasource.value === taskData.value.dtType)?.id)
      } catch (err) {
        targetTableList.value = []
      }
    }
  if (!targetTableList.value.length && taskData.value.targetTable) {
    taskData.value.targetTable = null
  }
  if (targetTableList.value.length && taskData.value.targetTable) {
    const item = find(targetTableList.value, { value: taskData.value.targetTable })
    if (!item) {
      taskData.value.targetTable = null
    }
  }
  getConnect(dataSource, 'dataTarget')
}

async function initTargetTableList(dataSource, type) {
  if(dataSource) {
    try {
      targetTableList.value = await getDatasourceTables(dataSource, type)
    } catch (err) {
      targetTableList.value = []
    }
  }
  getConnect(dataSource, 'dataTarget')
}

async function getDatasourceTableColumns(dataSource, table) {
  const url = SecondDevCreateUrl + '/HDataApi/apiService/getColumnsByTable'
  const params = {
    type: datasourceTypes.find(datasource => datasource.value === taskData.value.dsType)?.id,
    id: dataSource,
    tableName: table
  }
  try {
    const response = await axios.post(url, params);
    return response.data.data;
  } catch (error) {
    message.error(error);
  }
}

async function updateSplitPk() {
  if(taskData.value.sourceTable){
    splitPkOption.value = await getDatasourceTableColumns(
        taskData.value.dataSource,
        taskData.value.sourceTable
    )
  }
  if (!splitPkOption.value.length && taskData.value.splitPk) {
    splitPkOption.value.splitPk = null
  }
  if (splitPkOption.value.length && taskData.value.splitPk) {
    const item = find(splitPkOption.value, { value: taskData.value.splitPk })
    if (!item) {
      taskData.value.splitPk = null
    }
  }
}

function getTableSql() {
  if(!taskData.value.sourceTable) {
    message.error('请选择来源表')
  }
  else if(!taskData.value.dataTarget){
    message.error('请输入去向库')
  }
  else {
    let getSql = SecondDevCreateUrl+'/HDataApi/createTable/getCreateSql'
    let body = {
      id: taskData.value.dataSource,
      type : datasourceTypes.find(datasource => datasource.value === taskData.value.dsType)?.id,
      tableName: taskData.value.sourceTable
    }
    axios
        .post(getSql, body)
        .then(function (response) {
          if(response.data.status === 0 ){
            message.error(response.data.error)
          }else{
            taskData.value.createSql = response.data.info
            showSqlModal.value = true
          }
        })
        .catch(function (error) {
          message.error(error)
        })
  }
}

function executeTableSql() {
  let getSql = SecondDevCreateUrl+'/HDataApi/createTable/excuteSql'
  let body = {
    id: taskData.value.dataTarget,
    sqlStr: taskData.value.createSql
  }
  axios
      .post(getSql, body)
      .then(function (response) {
        if(response.data.status ===0 ){
          message.error(response.data.error)
        }else{
          message.info(response.data.info)
          showSqlModal.value = false
          updateTargetTableList(taskData.value.dataTarget)
        }

      })
      .catch(function (error) {
        message.error(error)
      })
}

function getTableColumn() {
  if( taskData.value.rightData.length) {
    disassociate()
  }
  let getCol = SecondDevCreateUrl + '/HDataApi/apiService/getColumnsByTable'
  let targetBody = {
    id: taskData.value.dataTarget,
    type: datasourceTypes.find(datasource => datasource.value === taskData.value.dtType)?.id,
    tableName: taskData.value.targetTable
  }
  if ( (taskData.value.executeMode === '0' ? !!taskData.value.sourceTable : !!taskData.value.sql) && !!taskData.value.targetTable )
  {
    taskData.value.leftData = []
    taskData.value.rightData = []
    axios
        .post(getCol, targetBody)
        .then(async function (response) {
          if (response.data.status === 0) {
            message.error(response.data.error)
          } else {
            taskData.value.rightData = response.data.data.map(item => {
                  let res = {
                    id: '',
                    label: '',
                    type: ''
                  }
                  res.id = 'T' + props.taskCode + item.TABLE_NAME
                  res.label = item.TABLE_NAME
                  res.type = item.COLUMN_TYPE
                  return res
                }
            )

            if (taskData.value.executeMode === '0') {
              let sourceBody = {
                id: taskData.value.dataSource,
                type: datasourceTypes.find(datasource => datasource.value === taskData.value.dsType)?.id,
                tableName: taskData.value.sourceTable
              }
              axios
                  .post(getCol, sourceBody)
                  .then(function (response) {
                    if (response.data.status === 0) {
                      message.error(response.data.error)
                    } else {
                      taskData.value.leftData = response.data.data.map(item => {
                            let res = {
                              id: '',
                              label: '',
                              type: ''
                            }
                            res.id = 'S' + props.taskCode + item.TABLE_NAME
                            res.label = item.TABLE_NAME
                            res.type = item.COLUMN_TYPE
                            return res
                          }
                      )
                    }
                    setTimeout(()=>{
                      jsplumbRef.value.init()
                    },1)
                  })
                  .catch(function (error) {
                    message.error(error)
                  })
            } else {
              const res = await querySqlColum(taskData.value.sql)
              taskData.value.leftData = res.map((item) => {
                    let res = {
                      id: '',
                      label: '',
                      type: ''
                    }
                    res.id = 'S' + props.taskCode + item.TABLE_NAME
                    res.label = item.TABLE_NAME
                    res.type = item.COLUMN_TYPE
                    return res
                  }
              )
              setTimeout(()=>{
                jsplumbRef.value.init()
              },1)
            }
          }
        })
        .catch(function (error) {
          message.error(error)
        })

  }else message.error('必须填写表名或查询语句以获取字段！')

}

function disassociate() {
  if (jsplumbRef.value) {
    jsplumbRef.value.disassociate();
  } else {
    console.error('jsplumbRef is not available');
  }
}

function sameName() {
  if (jsplumbRef.value) {
    jsplumbRef.value.sameName();
  } else {
    console.error('jsplumbRef is not available');
  }
}

function sameLine() {
  if (jsplumbRef.value) {
    jsplumbRef.value.sameLine();
  } else {
    console.error('jsplumbRef is not available');
  }
}

function repaintPlumb() {
  if (jsplumbRef.value && taskData.value.rightData.length) {
    jsplumbRef.value.repaintPlumb()
  }
}

function saveJsplumb(left, right) {
  taskData.value.leftList = left
  taskData.value.rightList = right
}

function formatJson() {
  let json = {
    "job": {
      "content": [
        {
          "reader": {
            "name": lowerCase(['ORACLE','SQLSERVER','MYSQL','POSTGRESQL'].includes(taskData.value.dsType)? taskData.value.dsType : 'rdbms')+"reader",
            "parameter": {
              "column":  taskData.value.leftList,
              "connection": [
                {
                  "jdbcUrl": [
                    jdbcConnectInfo.value.sourceConnect.jdbcUrl
                  ],
                  "table": [
                    taskData.value.sourceTable
                  ]
                }
              ],
              "password": jdbcConnectInfo.value.sourceConnect.password,
              "splitPk": taskData.value.splitPk,
              "username": jdbcConnectInfo.value.sourceConnect.user,
              "where": taskData.value.where
            }
          },
          "writer": {
            "name": lowerCase(['ORACLE','SQLSERVER','MYSQL','POSTGRESQL'].includes(taskData.value.dtType)? taskData.value.dtType : 'rdbms')+"writer",
            "parameter": {
              "column": taskData.value.rightList,
              "connection": [
                {
                  "jdbcUrl": jdbcConnectInfo.value.targetConnect.jdbcUrl,
                  "table": [
                    taskData.value.targetTable
                  ]
                }
              ],
              "password": jdbcConnectInfo.value.targetConnect.password,
              "username": jdbcConnectInfo.value.targetConnect.user,
              "postSql": [taskData.value.postSql],
              "preSql": [taskData.value.preSql]
            }
          }
        }
      ],
      "setting": {
        "errorLimit": {
          "percentage": taskData.value.percentage,
          "record": taskData.value.record
        },
        "speed": {
          "channel": taskData.value.channel,
          "byte": taskData.value.jobSpeedByte,
          "record": taskData.value.jobSpeedRecord
        }
      }
    }
  }
  if(taskData.value.dtType === 'MYSQL') json.job.content[0].writer.parameter['writeMode'] =  taskData.value.writeMode
  if(taskData.value.executeMode === '1') json.job.content[0].reader.parameter['querySql'] = [ taskData.value.sql ]
  return JSON.stringify(json,null,4)
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
  if(actualValues.length === 2) {
    updateJsonObject(taskData.value, tabData.value[0])
    updateJsonObject(taskData.value, tabData.value[1])
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
  const params = formatModel(await queryTaskDefinitionByCode(props.taskCode, props.projectCode));
  if(params.dataSource){
     await updateDataSource(params.dsType)
     await updateDataTarget(params.dtType)
  }
  if(params.dataSource){
    await initSourceTableList(params.dataSource, datasourceTypes.find(datasource => datasource.value === params.dsType)?.id)
    await initTargetTableList(params.dataTarget, datasourceTypes.find(datasource => datasource.value === params.dtType)?.id)
  }

  taskData.value = {
    ...taskData.value,
    ...params
  }

  initConstants()

  setTimeout(()=>{
    initTag.value = true
  },0)
}

defineExpose({ repaintPlumb })

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

.m-datax-box {
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

  .build-form {
    -webkit-box-flex: 1;
    flex: 1;
    height: 100%;
    overflow: auto;
    width: calc(100% - 36px);
    padding: 20px;

    :deep(.n-collapse-item__header-main) {
      background-color: #f1f1f1;
      height: 35px;
      padding-left: 10px;
    }

    :deep(.n-collapse-item__header-extra) {
      background-color: #f1f1f1;
      height: 35px;
      width: calc(100% - 150px);
      display: flex;
      justify-content: space-between;
      align-items: center;

      .box {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #666666;
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
