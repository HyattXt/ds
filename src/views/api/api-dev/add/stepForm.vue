<template>
  <div class="cue-crud">
    <CrudHeader title="API开发/新建API"/>
    <n-card :bordered="false" style="border-top: solid 1px #e8ecf0;">
      <n-space vertical class="steps" justify="center">
        <n-steps :current="currentTab" :status="currentStatus">
          <n-step title="API信息配置" />
          <n-step title="编写查询SQL" />
          <n-step title="定义返回结果" />
          <n-step title="完成创建" />
        </n-steps>
        <KeepAlive>
        <step1
            v-if="currentTab === 1"
            @nextStep="nextStep1"
        />
        </KeepAlive>
        <KeepAlive>
        <step2
          v-if="currentTab === 2"
          @nextStep="nextStep2"
          @prevStep="prevStep"
        />
        </KeepAlive>
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

<script setup>
  import {ref} from 'vue'
  import step1 from './Step1.vue'
  import step2 from './Step2.vue'
  import step3 from './Step3.vue'
  import step4 from './Step4.vue'
  import axios from 'axios'
  import {useMessage} from "naive-ui";
  import {useRoute} from "vue-router";
  import CrudHeader from "@/components/cue/crud-header.vue";
  import utils from "@/utils";

  const currentTab = ref(1)
  const message = useMessage()
  const currentStatus = ref('process')
  const route = useRoute()
  const params = ref({
    id: -1,
    apiName: '',
    apiPath: '',
    select: null,
    apiComment: '',
    codeType: 'SQL',
    codeValue: '',
    requestBody: '{"message":"Hello DataQL."}',
    headerData: [],
    optionInfo: {
      responseFormat:
        '{\n "success" : "@resultStatus",\n "message" : "@resultMessage",\n "code" : "@resultCode",\n "lifeCycleTime": "@timeLifeCycle",\n "executionTime": "@timeExecution",\n "data" : "@resultData"\n}'
    }
  })
  const params2 = ref({
    apiId: '',
    apiName: '',
    apiFlag: 1,
    apiCreator: '',
    apiFrequency: null,
    apiTimeout: null,
    apiDatasourceId: '',
    apiDatasourceTable: '',
    apiDatasourceType: '',
    apiTreeId: 1,
    apiMethod: '',
    apiPath: '',
    apiComment: '',
    apiScript: '',
    fieldsInfo: [],
    headersArray: [{
      paramTitle: "token",
      paramNotes: "接口token信息",
      paramType: "varchar",
      paramIsNull: "N",
      demoValue: "token test"
    }],
    bodyArray: [],
    requestDemo: [],
    responseDemo: '{\n' +
        '      success: true,\n' +
        '      message: "OK",\n' +
        '      code: 0,\n' +
        '      lifeCycleTime: "@timeLifeCycle",\n' +
        '      executionTime: "@timeExecution",\n' +
        '      data: "@resultData"\n' +
        '    }'
  })

  function nextStep1(value) {
    params2.value.apiName = value.apiName
    params2.value.apiPath = params.value.apiPath = value.apiPath
    params2.value.apiMethod = params.value.select = value.apiMethod
    params2.value.apiComment = params.value.apiComment = value.apiComment
    params2.value.apiCreator = value.apiCreator
    params2.value.apiFrequency = value.apiFrequency
    params2.value.apiTimeout = value.apiTimeout
    params2.value.apiTreeId = value.apiTreeId
    params2.value.apiFlag = history.state.type === '标签API' ? 3 : 1
    if (currentTab.value < 4) {
      currentTab.value += 1
    }
  }

  function nextStep2(value) {
    params2.value.apiScript = params.value.codeValue = value.apiDatasourceId+"HD688296"+value.codeValue
    if (route.query.apiId !== undefined) {
      params2.value.apiSample = value.apiSample
    } else {
      params.value.requestBody = value.requestBody
      delete params2.value['apiSample']
    }
    params2.value.apiDatasourceId = value.apiDatasourceId
    params2.value.apiDatasourceTable = value.apiDatasourceTable
    params2.value.apiDatasourceType = value.apiDatasourceType
    params2.value.dataBaseLabelClassTypeNum = value.dataBaseLabelClassTypeNum
    params2.value.dataBaseLabelId = value.dataBaseLabelId
    params2.value.bodyArray = value.bodyArray
    params2.value.fieldsInfo = value.fieldsInfo
    params2.value.requestDemo = value.requestDemo
    if (currentTab.value < 4) {
      currentTab.value += 1
    }
  }

  function updateApi(apiId) {
    const urlUpdate = utils.getUrl('interface/update')
    params2.value.apiId = apiId
    axios
        .post(urlUpdate, params2.value)
        .then(function (response) {
            response.data.status
        })
        .catch(function (error) {
          message.info(error)
        })
  }

  function nextStep3() {
    return new Promise((resolve) => {
      const url = utils.getUrl('interface-ui/api/save-api?id=-1')
      if (route.query.apiId === undefined) {
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
                updateApi(apiId)
              }
            })
            .catch(function (error) {
              message.error('创建失败，请咨询管理员')
            })
      } else {
        updateApi(route.query.apiId)
      }

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
    margin: 16px 50px;
  }

  .titleSplit {
    background: white !important;
    font-size: 14px !important;
    padding: 0 !important;
  }
</style>
