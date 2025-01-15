<template>
  <n-grid x-gap="12" :cols="14">
    <n-gi span="4">
      <n-card size="small">
        <crudSplit class="titleSplit" title="配置数据源"/>
        <component :is="currentStepComponent" @nextStep2_1="nextStep2_1"/>
      </n-card>
    </n-gi>
    <n-gi span="10">
      <n-card size="small" style="margin-bottom: 5px">
        <crudSplit class="titleSplit" title="编写SQL">
          <template #right>
            <n-button text size="small" @click="analysisSql">
                <n-icon style="padding-right: 3px">
                  <PlayCircleOutlined />
                </n-icon>
                解析
            </n-button>
          </template>
        </crudSplit>
        <codemirror
          v-model="formValue.codeValue"
          placeholder="sql代码..."
          :extensions="[sql()]"
          :style="{ height: '300px' }"
        />
      </n-card>
      <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane name="请求参数" label="请求参数">
          <n-data-table :columns="requestColumns" :data="requestParams" :max-height="122" class="table-padding" />
      </el-tab-pane>
      <el-tab-pane name="返回参数" label="返回参数">
          <n-data-table :columns="returnColumns" :data="returnParams" :max-height="122" class="table-padding" />
      </el-tab-pane>
      </el-tabs>
    </n-gi>
    <n-gi span="14">
      <n-space justify="center" style="margin-top: 30px">
          <n-button tertiary @click="prevStep">上一步</n-button>
          <n-button  color="#0099CB" type="primary" @click="formSubmit">下一步</n-button>
      </n-space>
    </n-gi>
  </n-grid>
</template>

<script setup>
import {onMounted, ref, h } from 'vue'
import {NInput, NCheckbox, useMessage} from 'naive-ui'
import { Codemirror } from 'vue-codemirror'
import { sql } from '@codemirror/lang-sql'
import StepSql from './Step2-1.vue'
import StepLabel from './Step2-1-label.vue'
import { PlayCircleOutlined } from '@vicons/antd'
import {useRoute} from "vue-router";
import axios from "axios";
import CrudSplit from "@/components/cue/crud-split.vue";
import {querySqlColum} from "@/service/modules/task-definition";
import utils from "@/utils";

const message = useMessage()
const loading = ref(false)
const route = useRoute()
const activeName = ref('请求参数')
const returnParams = ref([])
const requestParams = ref([])
const currentStep = ref('step1')
const componentMap = {
  自定义SQL: StepSql,
  标签API: StepLabel,
};
const currentStepComponent = ref(componentMap[history.state.type])
const formValue = ref({
  codeValue: '',
  requestBody: '',
  apiSample: '',
  apiDatasourceId: '',
  apiDatasourceTable: '',
  apiDatasourceType: ''
})
const rules = {
  code: {
    required: true,
    message: '请输入代码',
    trigger: 'blur'
  }
}
const emit = defineEmits(['prevStep', 'nextStep'])
const returnColumns = [
  {
    title: "名称",
    align: 'center',
    key: "paramTitle"
  },
  {
    title: "类型",
    align: 'center',
    key: "paramType",
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
    align: 'center',
    key: "demoValue",
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
    align: 'center',
    key: "paramNotes",
    render(row, index) {
      return h(NInput, {
        value: row.paramNotes,
        onUpdateValue(v) {
          returnParams.value[index].paramNotes = v;
        }
      });
    }
  }
]

const requestColumns = [
  {
    title: "名称",
    align: 'center',
    key: "paramTitle"
  },
  {
    title: "类型",
    align: 'center',
    key: "paramType",
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
    align: 'center',
    key: "demoValue",
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
    align: 'center',
    key: "paramNotes",
    render(row, index) {
      return h(NInput, {
        value: row.paramNotes,
        onUpdateValue(v) {
          requestParams.value[index].paramNotes = v;
        }
      });
    }
  }
]

function prevStep() {
  emit('prevStep')
}
function nextStep2_1(value) {
  formValue.value.apiDatasourceId = value.apiDatasourceId
  formValue.value.apiDatasourceType = value.apiDatasourceType
  formValue.value.apiDatasourceTable = value.apiDatasourceTable
  if(history.state.type === "标签API") {
    formValue.value.codeValue = 'SELECT tag_id,tag_value,dw FROM ' + value.apiDatasourceTable
  }
}

async function analysisSql() {
  let sql = formValue.value.codeValue
  let body = {
    sql: sql.replace(/\#\{.*?\}/g, '1')
  }
  returnParams.value = []
  requestParams.value = []
  returnParams.value = await querySqlColum(body)
  returnParams.value = returnParams.value.map(value => ({
    paramTitle: value.TABLE_NAME,
    paramNotes: '',
    paramType: value.COLUMN_TYPE,
    paramIsNull: 'N',
    demoValue: ''
  }))
  requestParams.value = findTextInsideHashBrackets(sql).map(value => ({
    paramTitle: value,
    paramNotes: '',
    paramType: 'string',
    paramIsNull: 'Y',
    demoValue: ''
  }))
}

function formSubmit() {
  if(formValue.value.apiDatasourceId === ''){message.error('请先选择数据源!')}
  else{
    loading.value = true
    let tmpRequestBody = requestParams.value.reduce((obj, item) => {
      obj[item.paramTitle] = item.demoValue
      return obj;
    }, {})
    if (route.query.apiId !== undefined) {
      let sample = {
        requestHeader: [],
        requestBody: {},
        responseHeader: [],
        responseBody: {}
      }
      sample.requestBody = JSON.stringify(tmpRequestBody, null, 2)
      formValue.value.apiSample = JSON.stringify(sample, null, 2)
    } else {
      formValue.value.requestBody = JSON.stringify(tmpRequestBody, null, 2)
    }
    formValue.value.bodyArray = requestParams.value
    formValue.value.requestDemo = tmpRequestBody
    formValue.value.fieldsInfo = returnParams.value
    emit('nextStep', formValue.value)
  }
}

function getInitData() {
  let url = utils.getUrl('interface/getInterfaceInfoById')
  let params = { apiId: '' }
  params.apiId = route.query.apiId
  axios
      .post(url, params)
      .then(function (response) {
        formValue.value.codeValue = response.data.obj.apiScript.substring(response.data.obj.apiScript.indexOf("HD688296")+8)
        requestParams.value = response.data.obj.bodyArray
        returnParams.value = response.data.obj.fieldsInfo
      })
      .catch(function (error) {
        console.log(error)
      })
}

function findTextInsideHashBrackets(text) {
  // 正则表达式匹配被#{}包裹的文本
  const regex = /#\{(.*?)\}/g;
  let matches = text.match(regex);

  // matches数组包含了所有匹配的结果，但是它们还包含了#{}。我们需要去掉这些字符。
  matches = matches.map(match => match.slice(2, -1)); // 从第三个字符开始，到倒数第二个字符结束（不包括#{}）
  return matches;
}

onMounted(() => {
  if (route.query.apiId !== undefined) {
    getInitData()
  }
  console.log(history.state.type)
  console.log(currentStep.value)
})
</script>

<style lang="scss" scoped>

.titleSplit {
  background: white !important;
  font-size: 14px !important;
  padding:0 0 15px !important;
}

.table-padding {
  :deep(.n-data-table-td) {
    padding: 0 0 0 12px;
  }
}


</style>
