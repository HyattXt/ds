<template>
  <n-form
    ref="form1Ref"
    :label-width="90"
    :model="formValue"
    :rules="rules"
    label-placement="left"
    style="max-width: 800px; margin: 40px auto 0 80px"
  >
    <n-form-item label="服务名称" path="apiName">
      <n-input v-model:value="formValue.apiName" placeholder="请输入" />
    </n-form-item>
    <n-form-item label="服务Host" path="apiIpaddr">
      <n-input
        v-model:value="formValue.apiIpaddr"
        :disabled="true"
        placeholder="以http://开头，且不包含path"
      />
    </n-form-item>
    <n-form-item label="服务Path" path="apiPath">
      <n-input
        v-model:value="formValue.apiPath"
        :disabled="true"
        placeholder="以/开头"
      />
    </n-form-item>
    <n-form-item label="API目录" path="apiMenu">
      <n-tree-select
          v-model:value="formValue.apiTreeId"
          default-value="1"
          :options="folderData"
          key-field="id"
          label-field="titleName"
          children-field="children"
          placeholder="请选择API目录"
      />
    </n-form-item>
    <n-form-item label="请求方式" path="apiMethod">
      <n-select
        v-model:value="formValue.apiMethod"
        placeholder="请选择"
        :options="[
          { label: 'POST', value: 'POST' },
          { label: 'GET', value: 'GET' }
        ]"
      />
    </n-form-item>
    <n-form-item label="创建人" path="apiCreator">
      <n-input v-model:value="formValue.apiCreator" placeholder="请输入" />
    </n-form-item>
    <n-form-item label="描述" path="comment">
      <n-input
        v-model:value="formValue.comment"
        type="textarea"
        :rows="2"
        placeholder="描述"
      />
    </n-form-item>
    <n-form-item label="请求header参数" path="comment" label-placement="top">
      <n-dynamic-input
        v-model:value="kvValue"
        preset="pair"
        key-placeholder="参数名"
        value-placeholder="参数值"
      />
    </n-form-item>
    <n-form-item label="请求body参数" path="comment" label-placement="top">
      <n-dynamic-input
        v-model:value="bodyValue"
        preset="pair"
        key-placeholder="参数名"
        value-placeholder="参数值"
      />
    </n-form-item>
    <div style="margin-left: 300px">
      <n-space>
        <router-link to="/service/api-dev">
          <n-button type="tertiary">返回</n-button>
        </router-link>
        <n-button type="primary" :disabled="isDisable" @click="formSubmit"
          >确定</n-button
        >
      </n-space>
    </div>
  </n-form>
</template>

<script lang="ts" setup>
import { onMounted, ref} from 'vue'
  import { useMessage } from 'naive-ui'
  import axios from 'axios'
  import { useRoute } from 'vue-router'

  const form1Ref: any = ref(null)
  const message = useMessage()
  const isDisable = ref(false)
  const kvValue = ref([])
  const bodyValue = ref([])
  const folderData = ref([])
  const emit = defineEmits(['nextStep'])
  const route = useRoute()
  const SecondDevApiUrl = import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_APP_DEV_API_URL
    : window.webConfig.VITE_APP_PROD_API_URL
  const getApiTreeUrl = import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/interface/getApiTreeFloder'
    : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/interface/getApiTreeFloder'
  const formValue = ref({
    apiName: '',
    apiPath: '',
    apiCreator: '',
    apiMethod: null,
    comment: '',
    apiIpaddr: '',
    apiFlag: 2,
    apiSample: '',
    apiTreeId: ''
  })

  const rules = {
    apiName: {
      required: true,
      message: '请输入名称',
      trigger: 'blur'
    },
    apiIpaddr: {
      required: true,
      message: '请输入Host',
      trigger: 'blur'
    },
    apiPath: {
      required: true,
      message: '请输入路径',
      trigger: 'blur'
    },
    apiMethod: {
      required: true,
      message: '请选择请求方式',
      trigger: 'blur'
    },
    apiCreator: {
      required: true,
      message: '请输入创建人',
      trigger: 'blur'
    }
  }

  function formSubmit() {
    form1Ref.value.validate((errors: any) => {
      if (!errors) {
        let insUrl = SecondDevApiUrl+'/HDataApi/interface/update'
        let sample = {
          requestHeader: [],
          requestBody: {},
          responseHeader: [],
          responseBody: {}
        }
        let list = kvValue.value
        let requestHeader = list.map((item) => {
          let tempHeader = {}
          tempHeader.checked = 'true'
          tempHeader.name = item.key
          tempHeader.value = item.value
          return tempHeader
        })
        let bodyList = bodyValue.value
        let requestBody: any = {}
        for (let i = 0; i < bodyList.length; i++) {
          requestBody[bodyList[i].key] = bodyList[i].value
        }

        sample.requestHeader = requestHeader
        sample.requestBody = requestBody
        formValue.value.apiSample = JSON.stringify(sample, null, 2)

        axios
          .post(insUrl, formValue.value)
          .then(function (response) {

            message.info('修改成功！')
            isDisable.value = true
            formValue.value.apiPath = formValue.value.apiPath.replace(
              '/proxy',
              ''
            )
            emit('nextStep')
          })
          .catch(function (error) {
            message.error('修改失败，请咨询管理员')
          })
      } else {
        message.error('验证失败，请填写完整信息')
      }
    })
  }

function getTreeFolder ()  {
  axios.get(getApiTreeUrl).then((res) => {
    folderData.value = res.data.data
  })
}

  onMounted(() => {
    getTreeFolder()
    let url = SecondDevApiUrl+'/HDataApi/interface/getInterfaceInfoById'
    let params = { apiId: '' }
    params.apiId = route.query.apiId

    axios
      .post(url, params)
      .then(function (response) {

        formValue.value = response.data.obj
        bodyValue.value = Object.entries(
          JSON.parse(JSON.parse(formValue.value.apiSample).requestBody)
        ).map(([key, value]) => ({
          key,
          value
        }))
        kvValue.value = JSON.parse(
          JSON.parse(formValue.value.apiSample).requestHeader
        ).map((item) => {
          return {
            key: item.name,
            value: item.value
          }
        })
      })
      .catch(function (error) {
        console.log(error)
      })
  })
</script>

<style scoped>
  a {
    text-decoration: none;
  }
</style>
