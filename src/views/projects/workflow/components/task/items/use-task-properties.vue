<script setup >

import * as Fields from "@/views/projects/task/components/node/fields";
import getElementByJson from "@/components/form/get-elements-by-json";
import {onMounted, ref, unref} from 'vue';
import {useMessage} from "naive-ui";

const props = defineProps({
  formModel: {
    type: Object,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const formRef = ref()
const message = useMessage()
const emit = defineEmits(['update-task-proper'])
const taskProperModel = ref ({
  name: '',
  flag: 0,
  description: '',
  taskPriority: '',
  workerGroup: '',
  failRetryTimes: 0,
  failRetryInterval: 0,
  timeoutFlag: false,
  timeoutNotifyStrategy: [],
  timeout: 0,
  indicatorCode: '',
  indicatorStatus: 2
})

const json = [
  Fields.useName(0),
  Fields.useRunFlag(),
  Fields.useDescription(),
  Fields.useTaskPriority(),
  Fields.useWorkerGroup(),
  ...Fields.useFailed()
]

if(props.formModel.taskType !== 'DEPENDENT'){
  json.push(...Fields.useTimeoutAlarm(taskProperModel.value))
}

if(props.formModel.taskType === 'SQL'){
  json.push(...Fields.useSqlIndicator(taskProperModel.value))
}

const { rules, elements } = getElementByJson(json, taskProperModel.value)

function save() {
  formRef.value.validate((errors) => {
    if (!errors) {
      emit('update-task-proper', 0, taskProperModel.value);
    } else {
      message.error('验证失败，请填写完整任务属性')
    }
  })
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

defineExpose({save})

onMounted( () => {
  updateJsonObject(taskProperModel.value, props.formModel)
})

</script>

<template>
  <NForm :disabled="props.disabled" size="small" label-placement="left" require-mark-placement="left" label-align="right" label-width="120" :rules="rules" :model="taskProperModel" ref="formRef">
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
</template>

<style scoped>

</style>
