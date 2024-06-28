<template>
  <n-card size="small" :bordered="false">
    <crudSplit class='titleSplit' title="字段信息"/>
    <n-data-table
        :single-line="false"
        size="small"
        :columns="columnsRef"
        :data="fieldInfo"
    />
  </n-card>
</template>
<script setup>

import axios from 'axios'
import { onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {useMessage} from "naive-ui";
import crudSplit from "@/components/cue/crud-split.vue";

const fieldInfo =ref([])
const route = useRoute()
const message = useMessage()
const columnsRef =[
  {
    title: '序号',
    key: 'key',
    align: 'center',
    width: 60,
    render: (_, index) => {
      return `${index + 1}`
    }
  },
  {
    title: '字段名',
    key: 'colName',
    align: 'center',
    width: 300
  },
  {
    title: '类型',
    key: 'colComment',
    align: 'center',
    width: 250
  },
  {
    title: '注释',
    key: 'colDataType',
    align: 'center',
    ellipsis: { tooltip: true}
  },
  ]

onMounted(() => {

  fieldInfo.value = JSON.parse(history.state.fieldArray)
  console.log(fieldInfo.value)
})
</script>

<style scoped>
.titleSplit {
  background: white !important;
  font-size: 18px !important;
  padding: 0 16px 16px 0 !important;
}
</style>
