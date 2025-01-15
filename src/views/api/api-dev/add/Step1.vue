<template>
  <n-form
    ref="form1Ref"
    :label-width="90"
    :model="formValue"
    :rules="rules"
    label-placement="left"
    require-mark-placement="left"
    style="margin: 40px 80px 0 80px"
  >
    <n-grid :cols="24" :x-gap="24">
    <n-form-item-gi :span="24" label="API名称" path="apiName">
      <n-input v-model:value="formValue.apiName" placeholder="请输入名称" />
    </n-form-item-gi>
    <n-form-item-gi :span="24" label="API路径" path="apiPath">
      <n-input
        v-model:value="formValue.apiPath"
        placeholder="请输入路径 /api/开头"
        :disabled="isDisable"
      />
    </n-form-item-gi>
    <n-form-item-gi :span="12" label="API目录" path="apiMenu">
      <n-tree-select
          v-model:value="formValue.apiTreeId"
          default-value="1"
          :options="folderData"
          key-field="id"
          label-field="titleName"
          children-field="children"
          placeholder="请选择API目录"
          :default-expanded-keys="[1]"
          :render-prefix="menuIcon"
      />
    </n-form-item-gi>
    <n-form-item-gi :span="12" label="请求方式" path="apiMethod">
      <n-select
        v-model:value="formValue.apiMethod"
        placeholder="请选择"
        :options="[{ label: 'POST', value: 'POST' }]"
        default-value="POST"
      />
    </n-form-item-gi>
    <n-form-item-gi :span="12" label="创建人" path="apiCreator">
      <n-input v-model:value="formValue.apiCreator" placeholder="请输入" />
    </n-form-item-gi>
      <n-form-item-gi :span="12" label="频次限制" path="apiFrequency">
        <n-input-group>
          <n-input-number
            v-model:value="formValue.apiFrequency"
            placeholder="请输入"
            :style="{ width: '100%' }"
          />
          <n-input-group-label>次/秒</n-input-group-label>
      </n-input-group>
    </n-form-item-gi>
    <n-form-item-gi :span="24" label="描述" path="apiComment">
      <n-input
        v-model:value="formValue.apiComment"
        type="textarea"
        :rows="2"
        placeholder="描述"
      />
    </n-form-item-gi>
    </n-grid>
  </n-form>
    <n-space justify="center" style="margin-top: 30px">
        <router-link to="/service/api-dev">
          <n-button tertiary >返回</n-button>
        </router-link>
        <n-button color="#0099CB" type="primary" @click="formSubmit">下一步</n-button>
    </n-space>
</template>

<script lang="ts" setup>
  import {useRoute} from "vue-router";

  import {h, onMounted, ref} from 'vue'
  import { useMessage } from 'naive-ui'
  import axios from 'axios'
  import utils from "@/utils";
  const emit = defineEmits(['nextStep'])
  const form1Ref: any = ref(null)
  const folderData = ref([])
  const message = useMessage()
  const isDisable = ref(false)
  const route = useRoute()
  const getApiTreeUrl = utils.getUrl('interface/getApiTreeFloder')

  const menuIcon = () => {
    return h('svg', {
      class: 'icon',
      viewBox: '0 0 1260 1024',
      xmlns: 'http://www.w3.org/2000/svg',
      width: '19.688',
      height: '16'
    }, [
      h('path', {
        d: 'M1171.561 157.538H601.797L570.814 61.44A88.222 88.222 0 00486.794 0H88.747A88.747 88.747 0 000 88.747v846.506A88.747 88.747 0 0088.747 1024H1171.56a88.747 88.747 0 0088.747-88.747V246.285a88.747 88.747 0 00-88.747-88.747zm-1082.814 0V88.747h398.047l22.055 68.791z',
        fill: '#0099CB'
      })
    ])
  }

  let validatePath = (rule: any, value: any, callback: any) => {
    if (!route.query.apiId) {
      return new Promise<void>((resolve, reject) => {
        let url = utils.getUrl('interface/getApiPath')
        let body = { apiPath: value }

        //0存在，1不存在
        axios
            .post(url, body)
            .then(function (response) {

              if (response.data.status == 0) {
                reject(Error('该路径与已有路径重复')) // reject with error message
              } else {
                resolve()
              }
            })
            .catch(function (error) {
              reject(error)
            })
      })
    }
  }

  let validateName = (rule: any, value: any, callback: any) => {
    if (!route.query.apiId) {
      return new Promise<void>((resolve, reject) => {
        let url = utils.getUrl('interface/getInterfaceInfoByApiName')
        let body = { apiName: value }

        //0存在，1不存在
        axios
            .post(url, body)
            .then(function (response) {
              console.log(response.data.obj)
              if (!!response.data.obj) {
                reject(Error('该名称与已有名称重复')) // reject with error message
              } else {
                resolve()
              }
            })
            .catch(function (error) {
              reject(error)
            })
      })
    }
  }

  const formValue = ref({
    apiName: '',
    apiPath: '',
    apiCreator: '',
    apiFrequency: '',
    apiTimeout: '',
    apiMethod: '',
    apiComment: '',
    apiTreeId: 1
  })

  const rules = {
    apiName: [
     {
      required: true,
      message: '请输入名称',
      trigger: 'blur'
     },
     {
       validator: validateName,
       trigger: 'blur'
     }
    ],
    apiPath: [
      {
        required: true,
        message: '请输入路径',
        trigger: 'blur'
      },
      {
        message: '请以/api/开头',
        trigger: 'blur',
        pattern: /\/api\/.*/
      },
      {
        validator: validatePath,
        trigger: 'blur'
      }
    ],
    apiMethod: {
      required: true,
      message: '请选择请求方式',
      trigger: 'blur'
    },
    apiCreator: {
      required: true,
      message: '请输入创建人',
      trigger: 'blur'
    },
    apiFrequency: [
      {
        required: true,
        type:"number",
        message: '请输入频次限制',
        trigger: 'blur'
      }
    ],
    apiComment: [
      {
        required: true,
        message: '请输入描述',
        trigger: 'blur'
      }
    ]
  }

  function formSubmit() {
    form1Ref.value.validate((errors: any) => {
      if (!errors) {
        emit('nextStep', formValue.value)
      } else {
        message.error('验证失败，请填写完整信息')
      }
    })
  }

  function getInitData() {
    let url = utils.getUrl('interface/getInterfaceInfoById')
    let params = { apiId: '' }
    params.apiId = route.query.apiId

    axios
        .post(url, params)
        .then(function (response) {
          formValue.value = response.data.obj
          formValue.value.apiTimeout = parseInt(formValue.value.apiTimeout)
          console.log(formValue.value)
        })
        .catch(function (error) {
          console.log(error)
        })
  }

function getTreeFolder ()  {
  axios.get(getApiTreeUrl).then((res) => {
    folderData.value = res.data.data
  })
}

onMounted(() => {
  getTreeFolder()
    if (!!route.query.apiId) {
      getInitData()
      isDisable.value = true
    }
})
</script>

<style scoped>
  a {
    text-decoration: none;
  }
</style>
