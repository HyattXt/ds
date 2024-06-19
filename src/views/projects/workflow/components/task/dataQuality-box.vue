<template>
  <NSpin :show="!initTag">
  <div class="m-data-quality-box">
    <CrudWorkflowTooltip
        @save-event="onTaskSubmit(taskData)"
        @refresh="initData"
        :version="taskData.version"
        :task-code="props.taskCode"
        :showOnline="props.readOnly"
        :showRun="false"
        :showStop="false"
    >
    </CrudWorkflowTooltip>
    <div class="right-bar"><div @click="openTab('first')">任务属性</div><div @click="openTab('second')">参数配置</div></div>
        <div style="height: calc(100% - 90px); margin: 30px 100px; overflow: auto;">
          <NForm :disabled="props.readOnly" size="small" label-placement="left" label-align="right" label-width="150" :rules="rules" :model="taskData" ref="formRef">
            <NGrid x-gap="10">
              <NFormItemGi
                  v-for="element in elements"
                  :key="element.path || String(Date.now() + Math.random())"
                  :span="unref(element.span) === void 0 ? 24 : unref(element.span)"
                  :path="element.path"
                  :showLabel="element.showLabel"
                  :label="element.label"
                  :type="element.type"
                  :class="element.class"
              >
                <component :is="element.widget" />
              </NFormItemGi>
            </NGrid>
          </NForm>
        </div>
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
              <UseParameterConfiguration :disabled="props.readOnly" :is-simple="true" @updateParamConfig="updateTaskTab" ref="paramConfigRef" :formModel="taskData"/>
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
import {computed, inject, onMounted, ref, unref, watch} from "vue";
import {queryTaskDefinitionByCode, updateWithUpstream} from "@/service/modules/task-definition";
import CrudWorkflowTooltip from "@/components/cue/crud-workflow-tooltip.vue";
import UseTaskProperties from "@/views/projects/workflow/components/task/items/use-task-properties.vue";
import {useMessage} from "naive-ui";
import {formatModel, formatParams as formatData} from "@/views/projects/task/components/node/format-data";
import * as Fields from "@/views/projects/task/components/node/fields";
import getElementByJson from "@/components/form/get-elements-by-json";
import UseParameterConfiguration from "@/views/projects/workflow/components/task/items/use-parameter-configuration.vue";
import {getDatasourceOptionsById, getRuleFormCreateJson, queryRuleList} from "@/service/modules/data-quality";
import {useI18n} from 'vue-i18n'
import {getDatasourceTableColumnsById, getDatasourceTablesById} from "@/service/modules/data-source";
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
useHeightAdjustment(false)
//src/views/projects/workflow/treemap/index.tsx
const updateTab = inject('updateTab')
const updateEdited = inject('updateEdited')
const message = useMessage()
const formRef = ref()
const { t } = useI18n()
const configTabsVisible = ref(false)
const activeTabName = ref(1)
const taskProperRef = ref(null)
const paramConfigRef = ref(null)
const tabData = ref([])
const initTag = ref(false)
const rulesOption = ref([])
const srcDatasourceOptions = ref([])
const srcTableOptions = ref([])
const srcTableColumnOptions = ref([])
const targetDatasourceOptions = ref([])
const targetTableOptions = ref([])
const targetTableColumnOptions = ref([])
const writerDatasourceOptions = ref([])
const fixValueSpan = computed(() => (taskData.value.comparison_type === 1 ? 24 : 0))
let preItemLen = 0
const jsonRef = ref([])
const taskData = ref({
  code: '',
  name: '',
  description: '',
  taskType: 'DATA_QUALITY',
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
  ruleId: 1,
  deployMode: 'cluster',
  driverCores: 1,
  driverMemory: '512M',
  numExecutors: 2,
  executorMemory: '2G',
  executorCores: 2,
  others: '--conf spark.yarn.maxAppAttempts=1'
})

const json = computed(() => {
  return [
    {
      type: 'select',
      field: 'ruleId',
      name: t('project.node.rule_name'),
      options: rulesOption,
      props: {
        onUpdateValue: getRuleById
      }
    },
    ...jsonRef.value,
    {
      type: 'input',
      field: 'comparison_name',
      name: t('project.node.fix_value'),
      props: {
        placeholder: t('project.node.fix_value')
      },
      span: fixValueSpan
    },
    Fields.useDeployMode(),
    Fields.useDriverCores(),
    Fields.useDriverMemory(),
    Fields.useExecutorNumber(),
    Fields.useExecutorMemory(),
    Fields.useExecutorCores(),
    {
      type: 'input',
      field: 'others',
      name: '选项参数',
      props: {
        type: 'textarea',
        placeholder: '提示'
      }
    }
  ]
});

const elements = computed(() => {
  return getElementByJson(json.value, taskData.value).elements;
})

const rules = computed(() => {
  return getElementByJson(json.value, taskData.value).rules;
})

const getRuleList = async () => {
  const result = await queryRuleList()
  rulesOption.value = result.map((item) => {
    let name = ''
    if (item.name) {
      name = item.name.replace('$t(', '').replace(')', '')
    }
    return {
      value: item.id,
      label: name ? t(`project.node.${name}`) : ''
    }
  })
}

const getRuleById = async (ruleId) => {
  const result = await getRuleFormCreateJson(ruleId)
  const items = JSON.parse(result).map((item) =>
      formatResponseJson(item)
  )
  jsonRef.value.splice(0, preItemLen, ...items)
  //updateRules(items, preItemLen)
  preItemLen = items.length
}

const formatResponseJson = (responseItem) => {
  const item = {
    field: responseItem.field,
    options: responseItem.options,
    validate: responseItem.validate,
    props: responseItem.props,
    value: responseItem.value
  }
  const name = responseItem.name?.replace('$t(', '').replace(')', '')
  item.name = name ? t(`project.node.${name}`) : ''

  if (responseItem.type !== 'group') {
    item.type = responseItem.type
  } else {
    item.type = 'custom-parameters'
    item.children = item.props.rules.map((child) => {
      child.span = Math.floor(22 / item.props.rules.length)
      return child
    })
    taskData.value[item.field] = taskData.value[item.field] || []
    delete item.props.rules
  }
  if (responseItem.emit) {
    responseItem.emit.forEach((emit) => {
      if (emit === 'change') {
        item.props.onUpdateValue = (value) => {
          onFieldChange(value, item.field, true)
        }
      }
    })
  }
  if (responseItem.props.placeholder) {
    item.props.placeholder = t(
        'project.node.' +
        responseItem.props.placeholder
            .split(' ')
            .join('_')
            .split(',')
            .join('')
            .toLowerCase()
    )
  }
  if (item.field === 'src_datasource_id') {
    item.options = srcDatasourceOptions
  }
  if (item.field === 'target_datasource_id') {
    item.options = targetDatasourceOptions
  }
  if (item.field === 'writer_datasource_id') {
    item.options = writerDatasourceOptions
  }
  if (item.field === 'src_table') {
    item.options = srcTableOptions
  }
  if (item.field === 'target_table') {
    item.options = targetTableOptions
  }
  if (item.field === 'src_field') {
    item.options = srcTableColumnOptions
  }
  if (item.field === 'target_field') {
    item.options = targetTableColumnOptions
  }

  if (taskData.value[item.field] !== void 0) {
    onFieldChange(taskData.value[item.field], item.field, false)
    item.value = taskData.value[item.field]
  }

  return item
}
const onFieldChange = async (
    value,
    field,
    reset
) => {
  if (field === 'src_connector_type' && typeof value === 'number') {
    const result = await getDatasourceOptionsById(value)
    srcDatasourceOptions.value = result || []
    if (reset) {
      srcTableOptions.value = []
      taskData.value.src_datasource_id = null
      taskData.value.src_table = null
      taskData.value.src_field = null
    }
    return
  }
  if (field === 'target_connector_type' && typeof value === 'number') {
    const result = await getDatasourceOptionsById(value)
    targetDatasourceOptions.value = result || []
    if (reset) {
      targetTableOptions.value = []
      taskData.value.target_datasource_id = null
      taskData.value.target_table = null
      taskData.value.target_field = null
    }
    return
  }
  if (field === 'writer_connector_type' && typeof value === 'number') {
    const result = await getDatasourceOptionsById(value)
    writerDatasourceOptions.value = result || []
    if (reset) {
      taskData.value.writer_datasource_id = null
    }
    return
  }
  if (field === 'src_datasource_id' && typeof value === 'number') {
    const result = await getDatasourceTablesById(value)
    srcTableOptions.value = result || []
    if (reset) {
      taskData.value.src_table = null
      taskData.value.src_field = null
    }
  }
  if (field === 'target_datasource_id' && typeof value === 'number') {
    const result = await getDatasourceTablesById(value)
    targetTableOptions.value = result || []
    if (reset) {
      taskData.value.target_table = null
      taskData.value.target_field = null
    }
  }
  if (field === 'src_table' && typeof value === 'string') {
    const result = await getDatasourceTableColumnsById(
        taskData.value.src_datasource_id,
        value
    )
    srcTableColumnOptions.value = result || []
    if (reset) {
      taskData.value.src_field = null
    }
  }
  if (field === 'target_table' && typeof value === 'string') {
    const result = await getDatasourceTableColumnsById(
        taskData.value.target_datasource_id,
        value
    )
    targetTableColumnOptions.value = result || []
    if (reset) {
      taskData.value.target_field = null
    }
  }
}

const onTaskSubmit = async (data) => {
  formRef.value.validate(async (errors) => {
    if (!errors) {
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
    } else {
      message.error('验证失败，请填写完整任务属性')
    }
  })
}

function confirmTaskProperties() {
  tabData.value = []
  taskProperRef.value.save()
  paramConfigRef.value.save();
}

function updateTaskTab(index, val) {
  tabData.value[index] = val
  ifSave()
}

function openTab (tab) {
  configTabsVisible.value = !configTabsVisible.value
  activeTabName.value = tab
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
  if(actualValues.length === 1) {
    updateJsonObject(taskData.value, tabData.value[0])
    updateJsonObject(taskData.value, tabData.value[1])
    configTabsVisible.value = !configTabsVisible.value
  }
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
  await getRuleList()
  await getRuleById(taskData.value.ruleId)
  setTimeout(()=>{
    initTag.value = true
  },0)

}

watch(taskData, () => {
  if(initTag.value) {
    updateEdited(taskData.value.code, true)
  }
},{deep: true} );

onMounted( () => {
  initData()
  //json.value = Fields.useRules(taskData.value, taskData.value.ruleId); // 更新响应式引用
})

</script>

<style lang="scss" scoped>

.m-data-quality-box {
  width: 100%;
  height: calc(100vh - var(--save-box-height-adjustment));
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

</style>
