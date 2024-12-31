<template>
  <NSpin :show="!initTag">
  <div class="m-flink-box">
    <CrudWorkflowTooltip
        @save-event="onTaskSubmit(taskData)"
        @refresh="initData"
        :version="taskData.version"
        :task-code="props.taskCode"
        :readOnly="props.readOnly"
        :releaseState="props.releaseState"
        :showRun="false"
        :showStop="false"
    >
    </CrudWorkflowTooltip>
      <div class="right-bar"><div @click="openTab('first')">任务属性</div></div>
      <div style="height: calc(100% - 90px); margin: 30px 100px; overflow: auto;">
        <NForm :disabled="props.readOnly" size="small" label-placement="left" require-mark-placement="left" label-align="right" label-width="150" :rules="rules" :model="taskData" ref="formRef">
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
import {inject, onMounted, ref, unref, watch, computed } from "vue";
import {queryTaskDefinitionByCode, updateWithUpstream} from "@/service/modules/task-definition";
import CrudWorkflowTooltip from "@/components/cue/crud-workflow-tooltip.vue";
import UseTaskProperties from "@/views/projects/workflow/components/task/items/use-task-properties.vue";
import {useMessage} from "naive-ui";
import {formatModel, formatParams as formatData} from "@/views/projects/task/components/node/format-data";
import * as Fields from "@/views/projects/task/components/node/fields";
import getElementByJson from "@/components/form/get-elements-by-json";
import UseParameterConfiguration from "@/views/projects/workflow/components/task/items/use-parameter-configuration.vue";
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
  },
  releaseState: {
    type: Number
  }
})
useHeightAdjustment(false)
//src/views/projects/workflow/treemap/index.tsx
const updateTab = inject('updateTab')
const updateEdited = inject('updateEdited')
const message = useMessage()
const formRef = ref()
const configTabsVisible = ref(false)
const activeTabName = ref(1)
const taskProperRef = ref(null)
const paramConfigRef = ref(null)
const tabData = ref([])
const initTag = ref(false)
const taskData = ref({
  code: '',
  name: '',
  description: '',
  taskType: 'FLINK',
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
  programType: 'SCALA',
  deployMode: 'cluster',
  initScript: '',
  rawScript: '',
  flinkVersion: '<1.10',
  jobManagerMemory: '1G',
  taskManagerMemory: '2G',
  slot: 1,
  taskManager: 2,
  parallelism: 1
})

const json = computed(() => {
  return [...Fields.useFlink(taskData.value)];
});

const elements = computed(() => {
  return getElementByJson(json.value, taskData.value).elements;
})

const rules = computed(() => {
  return getElementByJson(json.value, taskData.value).rules;
})

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
        message.error('保存出错，请联系系统维护人员')
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
})

</script>

<style lang="scss" scoped>

.m-flink-box {
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
