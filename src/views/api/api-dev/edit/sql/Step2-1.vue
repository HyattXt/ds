<template>
  <n-scrollbar style="max-height: 300px">
    <n-form :model="formValue" label-placement="top">
      <n-form-item label="数据源类型" path="sourceType">
        <n-select
          v-model:value="formValue.sourceType"
          size="small"
          :options="[{ label: 'MYSQL', value: 'MYSQL' }]"
        />
      </n-form-item>
      <n-form-item label="数据源" path="source">
        <n-select
          v-model:value="formValue.source"
          size="small"
          :options="[{ label: 'API服务', value: 'API服务' }]"
        />
      </n-form-item>
      <n-form-item label="数据表" path="table">
        <n-select
          v-model:value="formValue.table"
          label-field="TABLE_NAME"
          value-field="TABLE_NAME"
          size="small"
          filterable
          :options="tList"
          @click="queryTab"
          @update:value="queryCol(formValue.table)"
        />
      </n-form-item>
      <n-form-item label="字段预览">
        <n-data-table
          size="small"
          :single-line="false"
          :columns="[
            { title: '字段名称', key: 'COLUMN_NAME' },
            { title: '字段类型', key: 'COLUMN_TYPE' }
          ]"
          :data="colList"
        >
        </n-data-table>
      </n-form-item>
    </n-form>
  </n-scrollbar>
</template>

<script lang="ts" setup>
import { ref} from 'vue'
  import { useMessage } from 'naive-ui'
  import axios from 'axios'

  const emit = defineEmits(['nextStep'])

  const form1Ref = ref(null)
  const message = useMessage()
  const tList = ref([])
  const colList = ref([])
  const SecondDevApiUrl = import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_APP_DEV_API_URL
    : import.meta.env.VITE_APP_PROD_API_URL

  const formValue = ref({
    sourceType: '',
    source: '',
    table: ''
  })

  function queryTab() {
    const url = SecondDevApiUrl+'/interface/getTables'

    axios.get(url).then(function (response) {
      console.log(response)
      tList.value = response.data.data
    })
  }

  function queryCol(table: string) {
    const url = SecondDevApiUrl+'/interface/getColumnsByTable'
    const params = {
      tableName: table
    }
    axios.post(url, params).then(function (response) {
      console.log(response)
      colList.value = response.data.data
    })
  }
</script>

<style scoped>
  .n-data-table {
    font-size: 5px;
  }
</style>
