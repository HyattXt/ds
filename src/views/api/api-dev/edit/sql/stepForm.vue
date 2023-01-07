<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="编辑API"> </n-card>
    </div>
    <n-card :bordered="false" class="mt-4 proCard">
      <n-space vertical class="steps" justify="center">
        <n-steps :current="currentTab" :status="currentStatus">
          <n-step title="API信息配置" />
          <n-step title="编写查询SQL" />
          <n-step title="定义返回结果" />
          <n-step title="完成修改" />
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
import {defineComponent, provide, ref, onMounted} from 'vue'
  import step1 from './Step1.vue'
  import step2 from './Step2.vue'
  import step3 from './Step3.vue'
  import step4 from './Step4.vue'
  import axios from 'axios'

  const currentTab = ref(1)
  const currentStatus = ref('process')
  const SecondDevApiUrl = import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_APP_DEV_API_URL
    : import.meta.env.VITE_APP_PROD_API_URL
  const params = ref({
    apiId: '',
    apiMethod: '',
    apiName: '',
    apiPath: '',
    apiComment: '',
    apiCreator: '',
    apiFrequency: null,
    apiTimeout: null,
    apiScript: '',
    apiSample: ''
  })

  function nextStep1(value) {
    params.value = value
    console.log(params)
    if (currentTab.value < 4) {
      currentTab.value += 1
    }
  }

  function nextStep2(value) {
    params.value.apiScript = value.codeValue
    params.value.apiSample = value.apiSample
    console.log(params)
    if (currentTab.value < 4) {
      currentTab.value += 1
    }
  }

  function nextStep3() {
    return new Promise((resolve) => {
      const urlUpdate = SecondDevApiUrl+'/interface/update'
      axios
        .post(urlUpdate, params.value)
        .then(function (response) {
          console.log(response)
          resolve({
            status: response.data.status
          })
        })
        .catch(function (error) {
          console.log(error)
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
