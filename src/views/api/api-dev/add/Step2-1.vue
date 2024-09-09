<template>
  <n-scrollbar  style="height: 526px">
    <n-form :model="formValue" label-placement="top" :rules="rules" ref="form2Ref">
      <n-form-item label="数据源类型" path="apiDatasourceType">
        <n-select
          v-model:value="formValue.apiDatasourceType"
          size="small"
          placeholder="请选择"
          :options="[{ label: 'MYSQL', value: 0 },{ label: 'ORACLE', value: 5 },{ label: 'SQLSERVER', value: 6 }]"
          @update:value="queryDataSource"
        />
      </n-form-item>
      <n-form-item label="数据源" path="apiDatasourceId">
        <n-select
            v-model:value="formValue.apiDatasourceId"
            label-field="name"
            value-field="id"
            size="small"
            filterable
            :options="sList"
            @update:value="submitValue"
        />
      </n-form-item>
      <n-form-item label="数据表" path="apiDatasourceTable">
        <n-select
          v-model:value="formValue.apiDatasourceTable"
          label-field="TABLE_NAME"
          value-field="TABLE_NAME"
          size="small"
          filterable
          :options="tList"
          @click="queryTab"
          @update:value="queryCol(formValue.apiDatasourceTable)"
        />
      </n-form-item>
      <n-form-item label="字段预览">
        <n-data-table
          size="small"
          :single-line="false"
          :columns="[
            { title: '字段名称', key: 'TABLE_NAME', align: 'center', ellipsis: { tooltip: true} },
            { title: '字段类型', key: 'COLUMN_TYPE', align: 'center', ellipsis: { tooltip: true} },
            { title: '字段注释', key: 'COLUMN_COMMENT', align: 'center', ellipsis: { tooltip: true} }
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
  import utils from "@/utils";

  const emit = defineEmits(['nextStep2_1'])
  const route = useRoute()
  const form2Ref: any = ref(null)
  const message = useMessage()
  const tList = ref([])
  const sList = ref([])
  const colList = ref([])

  const formValue = ref({
    apiDatasourceType: '',
    apiDatasourceId: '',
    apiDatasourceTable: ''
  })

  const rules = {
      apiDatasourceType: {
          required: true,
          message: '请选择数据源类型',
          trigger: 'blur',
          type: 'number'
      },
    apiDatasourceId: {
          required: true,
          message: '请选择数据源',
          trigger: 'blur',
          type: 'number'
      }
  }

  function queryDataSource() {
      formValue.value.apiDatasourceId = ''
      const url = utils.getUrl('apiService/getDataSource?type='+formValue.value.apiDatasourceType)
      axios.get(url).then(function (response) {

      sList.value = response.data.data
    })
  }

  function queryTab() {
    const url = utils.getUrl('apiService/getTables')
    let params = {
      type : formValue.value.apiDatasourceType,
      id : formValue.value.apiDatasourceId
    }
    axios.post(url,params).then(function (response) {

      tList.value = response.data.data
    })
  }

  function queryCol(table: string) {
    const url = utils.getUrl('apiService/getColumnsByTable')
    const params = {
      type : formValue.value.apiDatasourceType,
      id : formValue.value.apiDatasourceId,
      tableName: table
    }
    axios.post(url, params).then(function (response) {

      colList.value = response.data.data
    })
      submitValue()
  }

  function submitValue(){
    emit('nextStep2_1', formValue.value)
  }

  function getInitData() {
    let url = utils.getUrl('interface/getInterfaceInfoById')
    let params = { apiId: '' }
    params.apiId = route.query.apiId

    axios
        .post(url, params)
        .then(function (response) {
          formValue.value.apiDatasourceType = response.data.obj.apiDatasourceType
          queryDataSource()
          formValue.value.apiDatasourceId = response.data.obj.apiDatasourceId
          queryTab()
          formValue.value.apiDatasourceTable = response.data.obj.apiDatasourceTable

          queryCol(formValue.value.apiDatasourceTable)
        })
        .catch(function (error) {
          console.log(error)
        })
  }

  onMounted(() => {
    if (route.query.apiId !== undefined) {
      getInitData()
    }
  })
</script>

<style scoped>
  .n-data-table {
    font-size: 12px;
  }
</style>
