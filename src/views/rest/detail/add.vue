<template>
  <n-card title="选择数据源" :bordered="false" :segmented="{content: true}">
    <n-form
        ref="form1Ref"
        :label-width="120"
        :model="formValue"
        :rules="rules"
        label-placement="left"
        style="max-width: 1000px; margin: 40px auto 0 80px"
    >
      <n-space justify="space-between">
        <n-form-item label="任务名称" path="taskName">
          <n-input
              v-model:value="formValue.taskName"
              placeholder="请输入"
              :style="{ width: '300px' }"
          />
        </n-form-item>
        <n-form-item label="写入数据源类型" path="dataSourceType">
          <n-select v-model:value="formValue.dataSourceType" :options="dataSourceTypeOptions" :style="{ width: '300px' }"/>
        </n-form-item>
      </n-space>
      <n-space justify="space-between">
        <n-form-item label="来源地址" path="dataUrl">
          <n-input
              v-model:value="formValue.dataUrl"
              placeholder="请输入"
              :style="{ width: '300px' }"
          />
        </n-form-item>
        <n-form-item label="写入数据源" path="dataSource">
          <n-select
              v-model:value="formValue.dataSource"
              label-field="name"
              value-field="id"
              @click="queryDataSource"
              :options="listSource"
              :style="{ width: '300px' }"/>
        </n-form-item>
      </n-space>
      <n-space justify="space-between">
        <n-form-item label="请求类型" path="httpType">
          <n-radio-group v-model:value="formValue.httpType" name="httpType">
            <n-space>
              <n-radio v-for="type in httpTypeOptions" :key="type.value" :value="type.value">
                {{ type.label }}
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item label="写入表" path="dataTable">
          <n-input
              v-model:value="formValue.dataTable"
              placeholder="请输入"
              :style="{ width: '300px' }"
          />
        </n-form-item>
      </n-space>
    </n-form>
  </n-card>
  <n-card title="读取配置" :bordered="false" :segmented="{content: true}">
    <n-form
        ref="form1Ref"
        :label-width="120"
        :model="formValue"
        :rules="rules"
        label-placement="left"
        style="max-width: 1000px; margin: 40px auto 0 80px"
    >
      <n-space justify="space-between">
        <n-form-item label="数据类型" path="dataType">
          <n-radio-group v-model:value="formValue.dataType" name="dataType">
            <n-space>
              <n-radio v-for="type in dataTypeOptions" :key="type.value" :value="type.value">
                {{ type.label }}
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item label="数据位置" path="dataAddress">
          <n-input
              v-model:value="formValue.dataAddress"
              placeholder="请输入"
              :style="{ width: '300px' }"
          />
        </n-form-item>
      </n-space>

      <n-form-item label="接口鉴权" path="dataTokenType">
        <n-radio-group v-model:value="formValue.dataTokenType" name="dataTokenType">
          <n-space>
            <n-radio v-for="type in dataTokenTypeOptions" :key="type.value" :value="type.value">
              {{ type.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="鉴权参数" path="dataUser">
        <n-dynamic-input
            v-model:value="dataUserTmp"
            preset="pair"
            key-placeholder="参数名"
            value-placeholder="参数值"
        />
      </n-form-item>
      <n-form-item label="动态参数" path="dynamicParameterStatus">
        <n-switch v-model:value="ifDynamicParameter" />
      </n-form-item>
      <n-form-item label="请求参数" path="dataParam">
        <n-dynamic-input
            v-model:value="dataParamTmp"
            preset="pair"
            key-placeholder="参数名"
            value-placeholder="参数值"
        />
      </n-form-item>
      <n-form-item label="动态参数值" path="dynamicParameter" v-show="ifDynamicParameter">
        <n-dynamic-input
            v-show="ifDynamicParameter"
            v-model:value="dynamicParameterTmp"
            preset="pair"
            key-placeholder="参数名"
            value-placeholder="sql语句"
        />
      </n-form-item>
    </n-form>
  </n-card>
  <n-card title="写入配置" :bordered="false" :segmented="{content: true}">
    <n-form
        ref="form1Ref"
        :label-width="120"
        :model="formValue"
        :rules="rules"
        label-placement="left"
        style="max-width: 1000px; margin: 40px auto 0 80px"
    >
      <n-space justify="space-between">
        <n-form-item label="数据总数字段" path="dataTotal">
          <n-input
              v-model:value="formValue.dataTotal"
              placeholder="请输入"
              :style="{ width: '300px' }"
          />
        </n-form-item>
        <n-form-item label="分页页数字段" path="paginationPageNumKey">
          <n-input
              v-model:value="formValue.paginationPageNumKey"
              placeholder="请输入"
              :style="{ width: '300px' }"
          />
        </n-form-item>
      </n-space>

      <n-form-item label="分页条数字段" path="paginationPageSizeKey">
        <n-input
            v-model:value="formValue.paginationPageSizeKey"
            placeholder="请输入"
            :style="{ width: '300px' }"
        />
      </n-form-item>
    </n-form>
  </n-card>
  <n-card title="字段映射" :bordered="false" :segmented="{content: true}">
    <n-form
        ref="form1Ref"
        :label-width="120"
        :model="formValue"
        :rules="rules"
        label-placement="left"
        style="max-width: 1000px; margin: 40px auto 0 80px"
    >
      <n-form-item path="dataKey">
        <n-dynamic-input
            v-model:value="dataKeyTmp"
            preset="pair"
            key-placeholder="来源"
            value-placeholder="目标"
        />
      </n-form-item>
      <div style="margin-left: 400px">
        <n-space>
          <router-link to="/rest/rest-manager">
            <n-button type="tertiary">返回</n-button>
          </router-link>
          <n-button type="primary" @click="formSubmit">确定</n-button>
        </n-space>
      </div>
    </n-form>
  </n-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import axios from 'axios'
import {keys, values} from "lodash";
import {useRouter} from "vue-router";
const form1Ref: any = ref(null)
const message = useMessage()
const formValue = ref({
  taskName: '',
  dataUrl: '',
  dataSourceType: null,
  dataType: null,
  dataSource: null,
  httpType: null,
  dataTable: '',
  dataAddress: '',
  dataTokenType: 0,
  dataUser: {},
  dataParam: {},
  dynamicParameterStatus: 2,
  dynamicParameter: {},
  dataTotal: '',
  paginationPageNumKey: '',
  paginationPageSizeKey: '',
  dataKey: {}
})
const dataKeyTmp = ref([])
const dataUserTmp = ref([])
const dataParamTmp = ref([])
const dynamicParameterTmp = ref([])
const ifDynamicParameter =ref(false)
const listSource = ref([])
const router = useRouter()
const httpInsertUrl = import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_APP_DEV_REST_URL
    : import.meta.env.VITE_APP_PROD_REST_URL

let validatePath = (rule: any, value: any, callback: any) => {
  return new Promise<void>((resolve, reject) => {
    let url = httpInsertUrl+'/httpHandle/getHttpDataByTaskName'
    let body = { taskName: value }
    console.log(body)
    //0存在，1不存在
    axios
        .post(url, body)
        .then(function (response) {
          console.log(response.data.status)
          if (response.data.status == 0) {
            reject(Error(response.data.info)) // reject with error message
          } else {
            resolve()
          }
        })
        .catch(function (error) {
          reject(error)
        })
  })
}

const rules = {
  taskName: [
    {
    required: true,
    message: '请输入名称',
    trigger: 'blur'
    },
    {
      validator: validatePath,
      trigger: 'blur'
    }
  ]
}
const dataSourceTypeOptions = ref([
  {
    label: "Mysql",
    value: 1,
  },
  {
    label: 'Oracle',
    value: 2
  },
  {
    label: 'SqlServer',
    value: 3
  },
  {
    label: 'PostgreSql',
    value: 4
  }
])
const httpTypeOptions = ref([
  {
    value: 1,
    label: 'POST'
  },
  {
    value: 2,
    label: 'GET'
  }
])
const dataTypeOptions = ref([
  {
    value: 1,
    label: '数组'
  },
  {
    value: 2,
    label: '对象'
  }
])
const dataTokenTypeOptions = ref([
  {
    value: 0,
    label: "无"
  },
  {
    value: 1,
    label: "用户名密码"
  },
  {
    value: 2,
    label: 'Token'
  }
])

function formSubmit() {
  let insUrl = httpInsertUrl+'/httpHandle/insertHttpData'

  for(let i=0;i<dataKeyTmp.value.length; i++){
    formValue.value.dataKey[dataKeyTmp.value[i].value]=dataKeyTmp.value[i].key
  }

  for(let i=0;i<dataUserTmp.value.length; i++){
    formValue.value.dataUser[dataUserTmp.value[i].key]=dataUserTmp.value[i].value
  }

  for(let i=0;i<dataParamTmp.value.length; i++){
    formValue.value.dataParam[dataParamTmp.value[i].key]=dataParamTmp.value[i].value
  }

  for(let i=0;i<dynamicParameterTmp.value.length; i++){
    formValue.value.dynamicParameter[dynamicParameterTmp.value[i].key]=dynamicParameterTmp.value[i].value
  }

  if(ifDynamicParameter.value){
    formValue.value.dynamicParameterStatus=1
  }

  console.log(formValue)

  axios
      .post(insUrl, formValue.value)
      .then(function (response) {
        console.log(response)
        message.info(response.data.info)
        setTimeout(() => {
          if (response.data.info === 'HTTP任务新增成功！') {
            router.push({
              path: '/rest/rest-manager'
            })
          }
        }, 1000)
      })
      .catch(function (error) {
        message.error('新增失败，请咨询管理员')
      })

}


function queryDataSource() {
  let queryUrl = httpInsertUrl+'/httpHandle/getDataSource?type=0'

  axios.get(queryUrl).then(function (response) {
    console.log(response)
    listSource.value = response.data.data
  })
}

</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
