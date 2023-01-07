<template>
  <n-grid x-gap="12" :cols="4">
    <n-gi span="1">
      <n-card title="配置数据源" size="small">
        <Step></Step>
      </n-card>
    </n-gi>
    <n-gi span="3">
      <n-card title="编写SQL" size="small" style="margin-bottom: 5px">
        <codemirror
          v-model="formValue.codeValue"
          placeholder="sql代码..."
          :extensions="[sql()]"
          :style="{ height: '300px' }"
        />
      </n-card>
      <n-dynamic-input
        v-model:value="kvValue"
        preset="pair"
        key-placeholder="参数名"
        value-placeholder="参数默认值"
      />
    </n-gi>
    <n-gi span="4">
      <div style="margin-left: 300px; margin-top: 30px">
        <n-space>
          <n-button @click="prevStep">上一步</n-button>
          <n-button type="primary" :loading="loading" @click="formSubmit"
            >下一步</n-button
          >
        </n-space>
      </div>
    </n-gi>
  </n-grid>
</template>

<script lang="ts" setup>
import { onMounted, ref} from 'vue'
  import { useMessage } from 'naive-ui'
  import { Codemirror } from 'vue-codemirror'
  import { sql } from '@codemirror/lang-sql'
  import Step from './Step2-1.vue'
  import axios from 'axios'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const message = useMessage()
  const loading = ref(false)
  const kvValue = ref([])
  const SecondDevApiUrl = import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_APP_DEV_API_URL
    : import.meta.env.VITE_APP_PROD_API_URL
  const formValue = ref({
    codeValue: '',
    apiSample: ''
  })

  const rules = {
    code: {
      required: true,
      message: '请输入代码',
      trigger: 'blur'
    }
  }

  const emit = defineEmits(['prevStep', 'nextStep'])

  onMounted(() => {
    let url = SecondDevApiUrl+'/interface/getInterfaceInfoById'
    let params = { apiId: '' }
    params.apiId = route.query.apiId
    console.log(params)
    axios
      .post(url, params)
      .then(function (response) {
        console.log(response.data)
        formValue.value.codeValue = response.data.obj.apiScript
        kvValue.value = Object.entries(
          JSON.parse(JSON.parse(response.data.obj.apiSample).requestBody)
        ).map(([key, value]) => ({
          key,
          value
        }))
      })
      .catch(function (error) {
        console.log(error)
      })
  })

  function prevStep() {
    emit('prevStep')
  }

  function formSubmit() {
    loading.value = true
    let list = kvValue.value
    let requestBody: any = {}
    let sample = {
      requestHeader: [],
      requestBody: {},
      responseHeader: [],
      responseBody: {}
    }
    for (let i = 0; i < list.length; i++) {
      requestBody[list[i].key] = list[i].value
    }
    console.log(requestBody)
    sample.requestBody = JSON.stringify(requestBody, null, 2)
    formValue.value.apiSample = JSON.stringify(sample, null, 2)
    console.log(formValue.value.apiSample)
    emit('nextStep', formValue.value)
  }
</script>
