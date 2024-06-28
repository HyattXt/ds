<template>
  <n-form
    ref="form1Ref"
    :label-width="90"
    :model="formValue"
    :rules="rules"
    label-placement="left"
    style="margin: 40px 80px 0 80px"
  >
    <n-form-item label="服务名称" path="apiName">
      <n-input
        v-model:value="formValue.apiName"
        placeholder="请输入"
      />
    </n-form-item>
    <n-form-item label="服务Host" path="apiIpaddr">
      <n-input
        v-model:value="formValue.apiIpaddr"
        :disabled="isDisable"
        placeholder="以http://开头，且不包含path"
      />
    </n-form-item>
    <n-form-item label="服务Path" path="apiPath">
      <n-input
        v-model:value="formValue.apiPath"
        :disabled="isDisable"
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
      <n-input
        v-model:value="formValue.apiCreator"
        placeholder="请输入"
      />
    </n-form-item>
    <n-form-item label="描述" path="apiComment">
      <n-input
        v-model:value="formValue.apiComment"
        type="textarea"
        :rows="2"
        placeholder="描述"
      />
    </n-form-item>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane name="请求参数" label="请求参数">
        <div style="float: right">
          <n-tooltip>
            <template #trigger>
              <n-button quaternary @click="addRequest">
                <n-icon size=20 style="padding-right: 3px">
                  <PlusSquareOutlined color="#1890ff"/>
                </n-icon>
              </n-button>
            </template>
            添加行
          </n-tooltip>
        </div>
        <n-data-table :columns="requestColumns" :data="requestParams" class="table-padding" />
      </el-tab-pane>
      <el-tab-pane name="返回参数" label="返回参数">
        <div style="float: right">
          <n-tooltip>
            <template #trigger>
              <n-button quaternary @click="addReturn">
                <n-icon size=20 style="padding-right: 3px">
                  <PlusSquareOutlined color="#1890ff"/>
                </n-icon>
              </n-button>
            </template>
            添加行
          </n-tooltip>
        </div>
        <n-data-table :columns="returnColumns" :data="returnParams" class="table-padding" />
      </el-tab-pane>
    </el-tabs>
    <n-space justify="center" style="margin-top: 30px">
        <router-link to="/service/api-dev">
          <n-button tertiary>返回</n-button>
        </router-link>
        <n-button color="#0099CB" type="primary"  @click="formSubmit">下一步</n-button
        >
    </n-space>
  </n-form>
</template>

<script setup>
import {h, onMounted, ref} from 'vue'
import {NButton, NCheckbox, NIcon, NInput, NSelect, useMessage} from 'naive-ui'
import axios from 'axios'
import {useRoute} from "vue-router";
import {PlusSquareOutlined} from "@vicons/antd";

const form1Ref = ref(null)
const message = useMessage()
const isDisable = ref(false)
const folderData = ref([])
const emit = defineEmits(['nextStep'])
const route = useRoute()
const activeName = ref('请求参数')
const returnParams = ref([])
const requestParams = ref([])
const SecondDevApiUrl = import.meta.env.MODE === 'development' ? import.meta.env.VITE_APP_DEV_API_URL : window.webConfig.VITE_APP_PROD_API_URL
const getApiTreeUrl = import.meta.env.MODE === 'development' ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/interface/getApiTreeFloder' : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/interface/getApiTreeFloder'
const formValue = ref({
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
  responseDemo: ''
})

const returnColumns = [
  {
    title: '序号',
    key: 'key',
    align: 'center',
    width: 60,
    render: (_, index) => {
      return `${index + 1}`
    }
  },
  {
    title: "名称",
    key: "paramTitle",
    align: 'center',
    render(row, index) {
      return h(NInput, {
        value: row.paramTitle,
        onUpdateValue(v) {
          returnParams.value[index].paramTitle = v;
        }
      });
    }
  },
  {
    title: "类型",
    key: "paramType",
    align: 'center',
    render(row, index) {
      return h(NInput, {
        value: row.paramType,
        onUpdateValue(v) {
          returnParams.value[index].paramType = v;
        }
      });
    }
  },
  {
    title: "示例值",
    key: "demoValue",
    align: 'center',
    render(row, index) {
      return h(NInput, {
        value: row.demoValue,
        onUpdateValue(v) {
          returnParams.value[index].demoValue = v;
        }
      });
    }
  },
  {
    title: "描述",
    key: "paramNotes",
    align: 'center',
    render(row, index) {
      return h(NInput, {
        value: row.paramNotes,
        onUpdateValue(v) {
          returnParams.value[index].paramNotes = v;
        }
      });
    }
  },
  {
    title: "操作",
    key: "actions",
    align: 'center',
    render(row, index) {
      return h(NButton,{ quaternary: true, onClick: () => {deleteReturn(index)} },
          h(NIcon,{color:"#d3482f", size: 20, style: { paddingRight: '3px' } },
              [
                h('svg', {
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: '0 0 28 28',
                  width: ' 19.688',
                  height: '16'
                }, [
                  h('path', {
                    d: 'M14 2.25a3.75 3.75 0 0 1 3.745 3.55l.005.2h5.5a.75.75 0 0 1 .102 1.493l-.102.007h-1.059l-1.22 15.053A3.75 3.75 0 0 1 17.233 26h-6.466a3.75 3.75 0 0 1-3.738-3.447L5.808 7.5H4.75a.75.75 0 0 1-.743-.648L4 6.75a.75.75 0 0 1 .648-.743L4.75 6h5.5A3.75 3.75 0 0 1 14 2.25zm6.687 5.25H7.313l1.211 14.932a2.25 2.25 0 0 0 2.243 2.068h6.466a2.25 2.25 0 0 0 2.243-2.068L20.686 7.5zm-8.937 3.75a.75.75 0 0 1 .743.648L12.5 12v8a.75.75 0 0 1-1.493.102L11 20v-8a.75.75 0 0 1 .75-.75zm4.5 0a.75.75 0 0 1 .743.648L17 12v8a.75.75 0 0 1-1.493.102L15.5 20v-8a.75.75 0 0 1 .75-.75zM14 3.75a2.25 2.25 0 0 0-2.245 2.096L11.75 6h4.5l-.005-.154A2.25 2.25 0 0 0 14 3.75z',
                    fill: 'currentColor'
                  })
                ])
              ]
          )
      )
    }
  }
]

const requestColumns = [
  {
    title: '序号',
    key: 'key',
    align: 'center',
    width: 60,
    render: (_, index) => {
      return `${index + 1}`
    }
  },
  {
    title: "名称",
    key: "paramTitle",
    align: 'center',
    render(row, index) {
      return h(NInput, {
        value: row.paramTitle,
        onUpdateValue(v) {
          requestParams.value[index].paramTitle = v;
        }
      });
    }
  },
  {
    title: "类型",
    key: "paramType",
    align: 'center',
    render(row, index) {
      return h(NInput, {
        value: row.paramType,
        onUpdateValue(v) {
          requestParams.value[index].paramType = v;
        }
      });
    }
  },
  {
    title: "参数位置",
    key: "paramPosition",
    align: 'center',
    width: 140,
    render(row, index) {
      return h(NSelect, {
        value: row.paramPosition,
        defaultValue: 'BODY',
        options: [{ label: 'BODY', value: 'BODY' }, { label: 'HEADER', value: 'HEADER' }],
        onUpdateValue(v) {
          requestParams.value[index].paramPosition = v;
        }
      });
    }
  },
  {
    title: "是否必填",
    key: "paramIsNull",
    width: 100,
    align: 'center',
    render(row, index) {
      return h(NCheckbox, {
        checkedValue: "N",
        uncheckedValue: "Y",
        checked: row.paramIsNull,
        onUpdateChecked(v) {
          requestParams.value[index].paramIsNull = v;
        }
      });
    }
  },
  {
    title: "示例值",
    key: "demoValue",
    align: 'center',
    render(row, index) {
      return h(NInput, {
        value: row.demoValue,
        onUpdateValue(v) {
          requestParams.value[index].demoValue = v;
        }
      });
    }
  },
  {
    title: "描述",
    key: "paramNotes",
    align: 'center',
    render(row, index) {
      return h(NInput, {
        value: row.paramNotes,
        onUpdateValue(v) {
          requestParams.value[index].paramNotes = v;
        }
      });
    }
  },
  {
    title: "操作",
    key: "actions",
    align: 'center',
    render(row, index) {
      return h(NButton,{ quaternary: true, onClick: () => {deleteRequest(index)} },
                h(NIcon,{color:"#d3482f", size: 20, style: { paddingRight: '3px' } },
                    [
                      h('svg', {
                        xmlns: "http://www.w3.org/2000/svg",
                        viewBox: '0 0 28 28',
                        width: ' 19.688',
                        height: '16'
                      }, [
                        h('path', {
                          d: 'M14 2.25a3.75 3.75 0 0 1 3.745 3.55l.005.2h5.5a.75.75 0 0 1 .102 1.493l-.102.007h-1.059l-1.22 15.053A3.75 3.75 0 0 1 17.233 26h-6.466a3.75 3.75 0 0 1-3.738-3.447L5.808 7.5H4.75a.75.75 0 0 1-.743-.648L4 6.75a.75.75 0 0 1 .648-.743L4.75 6h5.5A3.75 3.75 0 0 1 14 2.25zm6.687 5.25H7.313l1.211 14.932a2.25 2.25 0 0 0 2.243 2.068h6.466a2.25 2.25 0 0 0 2.243-2.068L20.686 7.5zm-8.937 3.75a.75.75 0 0 1 .743.648L12.5 12v8a.75.75 0 0 1-1.493.102L11 20v-8a.75.75 0 0 1 .75-.75zm4.5 0a.75.75 0 0 1 .743.648L17 12v8a.75.75 0 0 1-1.493.102L15.5 20v-8a.75.75 0 0 1 .75-.75zM14 3.75a2.25 2.25 0 0 0-2.245 2.096L11.75 6h4.5l-.005-.154A2.25 2.25 0 0 0 14 3.75z',
                          fill: 'currentColor'
                        })
                      ])
                    ]
                )
      )
    }
  }
]

let validatePath = (rule, value, callback) => {
  return new Promise((resolve, reject) => {
    let url = SecondDevApiUrl+'/HDataApi/interface/getApiPath'
    let body = { apiPath: '/HDataApi/proxy' + value }
    //0存在，1不存在
    axios.post(url, body).then(function (response) {
      if (response.data.status == 0) {
        reject(Error('该路径与已有路径重复')) // reject with error message
      } else {
        resolve()
      }
    }).catch(function (error) {
      reject(error)
    })
  })
}

let validateName = (rule, value, callback) => {
  if (route.query.apiId == undefined) {
    return new Promise((resolve, reject) => {
      let url = SecondDevApiUrl+'/HDataApi/interface/getInterfaceInfoByApiName'
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
  apiIpaddr: [
    {
      required: true,
      message: '请输入Host',
      trigger: 'blur'
    },
    {
      message: '请以http://开头',
      trigger: 'blur',
      pattern: /http:\/\/.*/
    }
  ],
  apiPath: [
    {
      required: true,
      message: '请输入路径',
      trigger: 'blur'
    },
    {
      message: '请以/开头',
      trigger: 'blur',
      pattern: /\/.*/
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
  apiComment: [
    {
      required: true,
      message: '请输入描述',
      trigger: 'blur'
    }
  ]
}

function formSubmit() {
  form1Ref.value.validate((errors) => {
    if (!errors) {
      let sample = {
        requestHeader: [],
        requestBody: {},
        responseHeader: [],
        responseBody: {}
      }
      let bodyArray = [...requestParams.value.filter(obj => obj.paramPosition === 'BODY')];
      let headerArray = [...requestParams.value.filter(obj => obj.paramPosition === 'HEADER')];
      if (route.query.apiId !== undefined) {
        headerArray.push({
          paramType: "varchar",
          demoValue: "HDataApiToken信息参数",
          paramNotes: "HDataApiToken信息",
          paramTitle: "HDataApiToken",
          paramIsNull: "N"
        })
        console.log(headerArray)
      }

      let requestHeader = headerArray.map((item) => {
        let tempHeader = {}
        tempHeader.checked = 'true'
        tempHeader.name = item.paramTitle
        tempHeader.value = item.demoValue
        return tempHeader
      })
      let requestBody = bodyArray.reduce((obj, item) => {
        obj[item.paramTitle] = item.demoValue
        return obj;
      }, {})

      sample.requestHeader = requestHeader
      sample.requestBody = requestBody

      formValue.value.apiSample = JSON.stringify(sample, null, 2)
      formValue.value.fieldsInfo = returnParams.value
      formValue.value.bodyArray = bodyArray
      formValue.value.headersArray = headerArray
      formValue.value.requestDemo = requestBody

      emit('nextStep', formValue.value)

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

function getInitData ()  {
  let url = SecondDevApiUrl+'/HDataApi/interface/getInterfaceInfoById'
  let params = { apiId: '' }
  params.apiId = route.query.apiId

  axios
      .post(url, params)
      .then(function (response) {

        formValue.value = response.data.obj

        let tmpBodyParams = response.data.obj.bodyArray.map((item)=>{
          item.paramPosition = 'BODY'
          return item
        })

        let tmpHeaderParams = response.data.obj.headersArray.filter((item) => item.paramTitle !== 'HDataApiToken').map((item)=>{
          item.paramPosition = 'HEADER'
          return item
        })

        requestParams.value = [...tmpBodyParams, ...tmpHeaderParams]
        returnParams.value = response.data.obj.fieldsInfo
      })
      .catch(function (error) {
        console.log(error)
      })
}

function addRequest () {
  requestParams.value.push({
    paramTitle: '',
    paramNotes: '',
    paramType: '',
    paramIsNull: '',
    demoValue: '',
    paramPosition: 'BODY'
  })
}

function addReturn () {
  returnParams.value.push({
    paramTitle: '',
    paramNotes: '',
    paramType: '',
    paramIsNull: '',
    demoValue: '',
  })
}

function deleteRequest (index) {
  requestParams.value.splice(index, 1)
}

function deleteReturn (index) {
  returnParams.value.splice(index, 1)
}

onMounted(() => {
  getTreeFolder()
  if (route.query.apiId !== undefined) {
    getInitData();
    isDisable.value = true
  }
})
</script>

<style lang="scss" scoped>
.table-padding {
  :deep(.n-data-table-td) {
    padding: 0 0 0 12px;
  }
}
</style>
