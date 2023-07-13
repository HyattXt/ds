<template>
  <n-card title="字段信息" size="large" :bordered="false" >
    <n-table :single-line="false" size="small">
      <thead>
      <tr>
        <th>字段名</th>
        <th>字段类型</th>
        <th>字段注释</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in fieldInfo">
        <td>{{ item.colName }}</td>
        <td>{{ item.colComment }}</td>
        <td>{{ item.colDataType }}</td>
      </tr>
      </tbody>
    </n-table>
  </n-card>
</template>
<script setup>

import axios from 'axios'
import { onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {useMessage} from "naive-ui";

const fieldInfo =ref([])
const route = useRoute()
const message = useMessage()

onMounted(() => {
  console.log(history.state)
  fieldInfo.value = JSON.parse(history.state.fieldArray)
})
</script>

<style scoped>

</style>
