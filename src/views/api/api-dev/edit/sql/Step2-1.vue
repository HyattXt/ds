<template>
  <n-scrollbar style="max-height: 300px">
    <n-form :model="formValue" label-placement="top" :rules="rules" ref="form2Ref">
      <n-form-item label="数据源类型" path="sourceType">
        <n-select
          v-model:value="formValue.sourceType"
          size="small"
          :options="[{ label: 'MYSQL', value: 0 },{ label: 'ORACLE', value: 5 },{ label: 'SQLSERVER', value: 6 }]"
          @update:value="queryDataSource"
        />
      </n-form-item>
      <n-form-item label="数据源" path="source">
        <n-select
          v-model:value="formValue.source"
          label-field="name"
          value-field="id"
          size="small"
          filterable
          :options="sList"
          @update:value="submitValue"
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
            { title: '字段名称', key: 'TABLE_NAME' },
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
import {onMounted, ref} from 'vue'
  import { useMessage } from 'naive-ui'
  import axios from 'axios'
import {useRoute} from "vue-router";

  const emit = defineEmits(['nextStep2_1'])

  const form2Ref = ref(null)
  const route = useRoute()
  const message = useMessage()
  const tList = ref([])
  const sList = ref([])
  const colList = ref([])
  const SecondDevApiUrl = import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_APP_DEV_API_URL
    : import.meta.env.VITE_APP_PROD_API_URL

  const formValue = ref({
    sourceType: '',
    source: '',
    table: ''
  })

  const rules = {
      sourceType: {
          required: true,
          message: '请选择数据源类型',
          trigger: 'blur',
          type: 'number'
      },
      source: {
          required: true,
          message: '请选择数据源',
          trigger: 'blur',
          type: 'number'
      }
  }

  onMounted(() => {
    let url = SecondDevApiUrl+'/HDataApi/interface/getInterfaceInfoById'
    let params = { apiId: '' }
    params.apiId = route.query.apiId
    console.log(params)
    axios
        .post(url, params)
        .then(function (response) {
          console.log(response.data)
          formValue.value.sourceType = response.data.obj.apiDatasourceType
          queryDataSource()
          formValue.value.source = response.data.obj.apiDatasourceId
          queryTab()
          formValue.value.table = response.data.obj.apiDatasourceTable
          console.log("初始值")
          console.log(formValue.value)
          queryCol(formValue.value.table)
        })
        .catch(function (error) {
          console.log(error)
        })
  })
  function queryDataSource() {
    formValue.value.source = ''
    const url = SecondDevApiUrl+'/HDataApi/apiService/getDataSource?type='+formValue.value.sourceType

    axios.get(url).then(function (response) {
      console.log(response)
      sList.value = response.data.data
    })
  }

  function queryTab() {
    const url = SecondDevApiUrl+'/HDataApi/apiService/getTables'
    let params = {
      type : formValue.value.sourceType,
      id : formValue.value.source
    }
    axios.post(url,params).then(function (response) {
      console.log(response)
      tList.value = response.data.data
    })
  }

  function queryCol(table: string) {
    const url = SecondDevApiUrl+'/HDataApi/apiService/getColumnsByTable'
    const params = {
      type : formValue.value.sourceType,
      id : formValue.value.source,
      tableName: table
    }
    axios.post(url, params).then(function (response) {
      console.log(response)
      colList.value = response.data.data
    })
      submitValue()
  }

function submitValue(){
    emit('nextStep2_1', formValue.value)
}
</script>

<style scoped>
  .n-data-table {
    font-size: 5px;
  }
</style>
