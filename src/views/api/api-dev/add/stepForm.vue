<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="自定义SQL"> </n-card>
    </div>
    <n-card :bordered="false" class="mt-4 proCard">
      <n-space vertical class="steps" justify="center">
        <n-steps :current="currentTab" :status="currentStatus">
          <n-step title="API信息配置" />
          <n-step title="编写查询SQL" />
          <n-step title="定义返回结果" />
          <n-step title="完成创建" />
        </n-steps>
        <step1 v-if="currentTab === 1" @nextStep="nextStep1" />
        <step2
          v-if="currentTab === 2"
          @nextStep="nextStep2"
          @prevStep="prevStep"
        />
        <step3
          v-if="currentTab === 3"
          @nextStep="nextStep3"
          @prevStep="prevStep"
        />
        <step4 v-if="currentTab === 4" @prevStep="prevStep" @finish="finish" />
      </n-space>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import {defineComponent,  ref} from 'vue'
  import step1 from './Step1.vue'
  import step2 from './Step2.vue'
  import step3 from './Step3.vue'
  import step4 from './Step4.vue'
  import axios from 'axios'
import {useMessage} from "naive-ui";

  const currentTab = ref(1)
  const message = useMessage()
  const currentStatus = ref('process')
  const SecondDevApiUrl = import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_APP_DEV_API_URL
    : window.webConfig.VITE_APP_PROD_API_URL
  const params = ref({
    id: -1,
    apiName: '',
    apiPath: '',
    select: null,
    comment: '',
    codeType: 'SQL',
    codeValue: '',
    requestBody: '{"message":"Hello DataQL."}',
    headerData: [],
    optionInfo: {
      responseFormat:
        '{\n "success" : "@resultStatus",\n "message" : "@resultMessage",\n "code" : "@resultCode",\n "lifeCycleTime": "@timeLifeCycle",\n "executionTime": "@timeExecution",\n "value" : "@resultData"\n}'
    }
  })
  const params2 = ref({
    apiId: '',
    apiName: params.value.apiName,
    apiFlag: 1,
    apiCreator: '',
    apiFrequency: null,
    apiTimeout: null,
    apiDatasourceId: '',
    apiDatasourceTable: '',
    apiDatasourceType: '',
    apiTreeId: 1
  })

  function nextStep1(value: any) {
    params2.value.apiName = value.apiName
    params.value.apiPath = value.apiPath
    params.value.select = value.select
    params.value.comment = value.comment
    params2.value.apiCreator = value.apiCreator
    params2.value.apiFrequency = value.apiFrequency
    params2.value.apiTimeout = value.apiTimeout
    params2.value.apiTreeId = value.apiTreeId


    if (currentTab.value < 4) {
      currentTab.value += 1
    }
  }

  function nextStep2(value: any) {
    params.value.codeValue = value.apiDatasourceId+"HD688296"+value.codeValue
    params.value.requestBody = value.requestBody
    params2.value.apiDatasourceId = value.apiDatasourceId
    params2.value.apiDatasourceTable = value.apiDatasourceTable
    params2.value.apiDatasourceType = value.apiDatasourceType

    if (currentTab.value < 4) {
      currentTab.value += 1
    }
  }

  function nextStep3() {
    return new Promise((resolve) => {
      const url = SecondDevApiUrl+'/HDataApi/interface-ui/api/save-api?id=-1'
      const urlUpdate = SecondDevApiUrl+'/HDataApi/interface/update'
      let apiId = ''
      axios
        .post(url, params.value)
        .then(function (response) {

          if (!response.data.success){message.error(response.data.message)}
          else {
            apiId = response.data.result
            setTimeout(
                () =>
                    resolve({
                      apiId
                    }),
                100
            )
            params2.value.apiId = apiId
            axios
                .post(urlUpdate, params2.value)
                .then(function (response) {

                  resolve({
                    status: response.data.status
                  })
                })
                .catch(function (error) {
                  message.info(error)
                })
          }
        })
        .catch(function (error) {
          message.error('创建失败，请咨询管理员')
        })
      if (currentTab.value < 4) {
        currentTab.value += 1
      }
    })
  }

  function prevStep() {
    if (currentTab.value > 1) {
      currentTab.value -= 1
    }
  }

  function finish() {
    currentTab.value = 1
  }
</script>

<style lang="less" scoped>
  .steps {
    max-width: 1200px;
    margin: 16px auto;
  }
</style>
