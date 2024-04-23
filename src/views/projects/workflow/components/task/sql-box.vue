<template>
  <codemirror
      v-model="task.taskData.taskParams.sql"
      placeholder="sql代码..."
      :extensions="[sql()]"
      :style="{ height: '300px' }"
  />
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {queryTaskDefinitionByCode} from "@/service/modules/task-definition";
import {sql} from "@codemirror/lang-sql";
import {Codemirror} from "vue-codemirror";

const props = defineProps({
  taskCode: {
    type: Number,
    default: ''
  },
  projectCode: {
    type: Number,
    default: ''
  },
})

const task = ref({
  taskShow: false,
  taskData: {
    taskParams: {
      sql: ''
    }
  },
  taskSaving: false,
  taskReadonly: false
})

onMounted(async () => {
  const result = await queryTaskDefinitionByCode(props.taskCode, props.projectCode)
  task.value.taskData = {...result}
  console.log(task.value)
})
</script>

<style scoped>

</style>
