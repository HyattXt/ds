<template>
  <div class="cue-crud">
    <CrudHeader title="API开发/新建API"/>
    <n-card :bordered="false" class="mt-4 proCard" style="border-top: solid 1px #e8ecf0;">
      <n-space vertical class="steps" justify="center">
        <n-steps :current="currentTab" :status="currentStatus">
          <n-step title="API信息配置" />
          <n-step title="定义返回结果" />
          <n-step title="完成创建" />
        </n-steps>
        <KeepAlive>
          <step1 v-if="currentTab === 1" @nextStep="nextStep1" />
        </KeepAlive>
        <KeepAlive>
          <step2 v-if="currentTab === 2" @prevStep="prevStep" @nextStep="nextStep2" />
        </KeepAlive>
        <step3 v-if="currentTab === 3" @prevStep="prevStep" @finish="finish" />
      </n-space>
    </n-card>
  </div>
</template>

<script setup>
  import {  ref } from 'vue'
  import step1 from './Step1.vue'
  import step2 from './Step2.vue'
  import step3 from './Step3.vue'
  import axios from 'axios'
  import CrudHeader from "@/components/cue/crud-header.vue";
  import {useRoute} from "vue-router";
  import {useMessage} from "naive-ui";
  import utils from "@/utils";

  const currentTab = ref(1)
  const currentStatus = ref('process')
  const message = useMessage()
  const params = ref({
    apiName: '',
    apiPath: '',
    apiCreator: '',
    apiMethod: null,
    apiComment: '',
    apiIpaddr: '',
    apiFlag: 2,
    apiSample: '',
    apiTreeId: 1,
    apiId: '',
    apiScript: '',
    fieldsInfo: [],
    headersArray: [],
    bodyArray: [],
    requestDemo: [],
    responseDemo: {}
  })
  const route = useRoute()

  function nextStep1(value) {
    params.value = value
    if(route.query.apiId === undefined){
      params.value.apiPath = '/HDataApi/proxy' + params.value.apiPath
    }
    if (currentTab.value < 2) {
      currentTab.value += 1
    }
  }

  function nextStep2(responseDemo, responseStatusArray) {
    let insUrl = utils.getUrl( (!!route.query.apiId ? '/HDataApi/interface/update' : '/HDataApi/interface/insert') )
    params.value.responseDemo = responseDemo
    params.value.responseStatusArray = responseStatusArray

    axios.post(insUrl, params.value).then(function (response) {
      message.info(response.data.info)
      if (currentTab.value < 3) {
        currentTab.value += 1
      }
    }).catch(function (error) {
      message.error('注册失败，请咨询管理员')
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
  margin: 16px 100px;
}
</style>
