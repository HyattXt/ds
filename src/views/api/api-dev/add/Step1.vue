<template>
  <n-form
    ref="form1Ref"
    :label-width="90"
    :model="formValue"
    :rules="rules"
    label-placement="left"
    style="max-width: 800px; margin: 40px auto 0 80px"
  >
    <n-form-item label="API名称" path="apiName">
      <n-input v-model:value="formValue.apiName" placeholder="请输入名称" />
    </n-form-item>
    <n-form-item label="API路径" path="apiPath">
      <n-input
        v-model:value="formValue.apiPath"
        placeholder="请输入路径 /api/开头"
      />
    </n-form-item>
    <n-form-item label="请求方式" path="select">
      <n-select
        v-model:value="formValue.select"
        placeholder="请选择"
        :options="[{ label: 'POST', value: 'POST' }]"
      />
    </n-form-item>
    <n-form-item label="创建人" path="apiCreator">
      <n-input v-model:value="formValue.apiCreator" placeholder="请输入" />
    </n-form-item>
    <n-space justify="space-between">
      <n-input-group>
        <n-form-item label="频次限制" path="apiFrequency">
          <n-input
            v-model:value="formValue.apiFrequency"
            placeholder="请输入"
          />
        </n-form-item>
        <n-input-group-label>次/秒</n-input-group-label>
      </n-input-group>
      <n-input-group>
        <n-form-item label="后端超时" path="apiTimeout">
          <n-input v-model:value="formValue.apiTimeout" placeholder="请输入" />
        </n-form-item>
        <n-input-group-label>ms</n-input-group-label>
      </n-input-group>
    </n-space>
    <n-form-item label="描述" path="comment">
      <n-input
        v-model:value="formValue.comment"
        type="textarea"
        :rows="2"
        placeholder="描述"
      />
    </n-form-item>
    <div style="margin-left: 300px">
      <n-space>
        <router-link to="/service/api-dev">
          <n-button type="tertiary">返回</n-button>
        </router-link>
        <n-button type="primary" @click="formSubmit">下一步</n-button>
      </n-space>
    </div>
  </n-form>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useMessage } from 'naive-ui'
  import axios from 'axios'
  const emit = defineEmits(['nextStep'])
  const form1Ref: any = ref(null)
  const message = useMessage()
  const SecondDevApiUrl = import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_APP_DEV_API_URL
    : import.meta.env.VITE_APP_PROD_API_URL

  let validatePath = (rule: any, value: any, callback: any) => {
    return new Promise<void>((resolve, reject) => {
      let url = SecondDevApiUrl+'/interface/getApiPath'
      let body = { apiPath: value }
      console.log(body)
      //0存在，1不存在
      axios
        .post(url, body)
        .then(function (response) {
          console.log(response.data.status)
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

  const formValue = ref({
    apiName: '',
    apiPath: '',
    apiCreator: '',
    apiFrequency: null,
    apiTimeout: null,
    select: null,
    comment: '',
    sourceType: null,
    source: null
  })

  const rules = {
    apiName: {
      required: true,
      message: '请输入名称',
      trigger: 'blur'
    },
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
    select: {
      required: true,
      message: '请选择请求方式',
      trigger: 'blur'
    },
    sourceType: {
      required: true,
      message: '请选择数据源类型',
      trigger: 'blur'
    },
    source: {
      required: true,
      message: '请选择数据源',
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
        message: '请输入调用频次',
        trigger: 'blur'
      },
      {
        message: '请输入数字格式',
        trigger: 'blur',
        pattern: /^[1-9]\d*$/
      }
    ],
    apiTimeout: [
      {
        required: true,
        message: '请输入超时时间(数字格式)',
        trigger: 'blur'
      },
      {
        message: '请输入数字格式',
        trigger: 'blur',
        pattern: /^[1-9]\d*$/
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
</script>

<style scoped>
  a {
    text-decoration: none;
  }
</style>
