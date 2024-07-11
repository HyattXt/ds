<template>
  <n-form
    ref="form2Ref"
    label-placement="top"
    style="margin: 40px 80px 0 80px"
  >
    <n-grid x-gap="12" :cols="2">
      <n-gi span="2">
          <CrudSplit title="成功返回结果示例" style="background: rgba(255,255,255,0)"/>
            <n-input
                v-model:value="success"
                type="textarea"
                :autosize="{
                  minRows: 5
                }"
            />
      </n-gi>
      <n-gi span="2">
      <CrudSplit title="返回状态码" style="background: rgba(255,255,255,0); margin-top: 30px"/>
        <div style="float: right">
          <n-tooltip>
            <template #trigger>
              <n-button quaternary @click="addStatusArray">
                <n-icon size=20 style="padding-right: 3px">
                  <PlusSquareOutlined color="#1890ff"/>
                </n-icon>
              </n-button>
            </template>
            添加行
          </n-tooltip>
        </div>
        <n-data-table :columns="responseStatusColumns" :data="responseStatusArray" class="table-padding" />
      </n-gi>
    </n-grid>
      <n-space justify="center" style="margin-top: 30px">
        <n-button tertiary @click="prevStep">上一步</n-button>
        <n-button color="#0099CB" type="primary" :loading="loading" @click="formSubmit">提交</n-button>
      </n-space>
  </n-form>
</template>

<script setup>
import {h, onMounted, ref} from 'vue'
import {NButton, NIcon, NInput, NSelect, useMessage} from 'naive-ui'
import {useRoute} from "vue-router";
import axios from "axios";
import CrudSplit from "@/components/cue/crud-split.vue";
import {PlusSquareOutlined} from "@vicons/antd";
import utils from "@/utils";

const form2Ref = ref(null)
const message = useMessage()
const loading = ref(false)
const success =ref('')
const route = useRoute()
const emit = defineEmits(['prevStep', 'nextStep'])
const responseStatusColumns = [
  {
    title: "状态码",
    key: "statusCode",
    align: 'center',
    render(row, index) {
      return h(NInput, {
        value: row.statusCode,
        onUpdateValue(v) {
          responseStatusArray.value[index].statusCode = v;
        }
      });
    }
  },
  {
    title: "状态值",
    key: "statusValue",
    align: 'center',
    render(row, index) {
      return h(NInput, {
        value: row.statusValue,
        onUpdateValue(v) {
          responseStatusArray.value[index].statusValue = v;
        }
      });
    }
  },
  {
    title: "状态说明",
    key: "paramNotes",
    align: 'center',
    render(row, index) {
      return h(NInput, {
        value: row.paramNotes,
        onUpdateValue(v) {
          responseStatusArray.value[index].paramNotes = v;
        }
      });
    }
  },
  {
    title: "操作",
    key: "actions",
    align: 'center',
    render(row, index) {
      return h(NButton,{ quaternary: true, onClick: () => {deleteStatusArray(index)} },
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

const responseStatusArray = ref([])

function addStatusArray () {
  responseStatusArray.value.push({
    demoValue: "",
    paramNotes: "",
    statusValue: "",
    statusCode: ""
  })
}

function deleteStatusArray (index) {
  responseStatusArray.value.splice(index, 1)
}

function prevStep() {
  emit('prevStep')
}

function formSubmit() {
  loading.value = true
  form2Ref.value.validate((errors) => {
    if (!errors) {
      emit('nextStep',success.value, responseStatusArray.value)
    } else {
      message.error('验证失败，请填写完整信息')
    }
  })
}

function getInitData ()  {
  let url = utils.getUrl('HDataApi/interface/getInterfaceInfoById')
  let params = { apiId: '' }
  params.apiId = route.query.apiId

  axios
      .post(url, params)
      .then(function (response) {
        success.value = JSON.parse(response.data.obj.responseDemo)
        responseStatusArray.value = response.data.obj.responseStatusArray
      })
      .catch(function (error) {
        console.log(error)
      })
}

onMounted(() => {
  if (route.query.apiId !== undefined) {
    getInitData();
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
