<template>
  <div class="n-scrollbar-container">
    <CrudHead class="sticky-top" title="服务详情" defineButton button-title="返回" @click-event="goBack"/>
    <n-card :title=basicInfo.apiName size="large">
      <n-descriptions label-placement="left">
        <n-descriptions-item label="API类型">
          {{ basicInfo.apiFlag }}
        </n-descriptions-item>
        <n-descriptions-item label="更新时间">
          {{ basicInfo.apiGmtTime }}
        </n-descriptions-item>
        <n-descriptions-item label="描述">
          {{ basicInfo.apiComment }}
        </n-descriptions-item>
        <n-descriptions-item label="创建人">
          {{ basicInfo.apiCreator }}
        </n-descriptions-item>
        <n-descriptions-item label="频次限制">
          {{ basicInfo.apiFrequency }}次/秒
        </n-descriptions-item>
        <n-descriptions-item label="后端超时">
          {{ basicInfo.apiTimeout }}ms
        </n-descriptions-item>
      </n-descriptions>
    </n-card>
    <n-card size="small" style="margin-top: 10px">
      <crudSplit class='titleSplit' title="服务路径"/>
      <n-descriptions label-placement="left" column="1" separator="" style="padding: 18px">
        <n-descriptions-item>
          {{ ip }}{{ basicInfo.apiPath }}
        </n-descriptions-item>
      </n-descriptions>
    </n-card>
    <n-card size="small" style="margin-top: 10px">
      <crudSplit class='titleSplit' title="自定义SQL"/>
      <n-descriptions label-placement="left" column="1" separator="" style="padding: 18px">
        <n-descriptions-item>
          {{ basicInfo.apiScript }}
        </n-descriptions-item>
      </n-descriptions>
    </n-card>
    <n-card size="small" style="margin-top: 10px">
      <crudSplit class='titleSplit' title="授权用户"/>
      <n-descriptions label-placement="left" column="1" style="padding: 18px">
        <n-descriptions-item label="用户列表">
          {{ apiAuthorizerName }}
        </n-descriptions-item>
      </n-descriptions>
    </n-card>
  </div>
</template>

<script setup>

import { onMounted, ref} from "vue";
import { useRoute, useRouter} from "vue-router";
import axios from "axios";
import CrudHead from "@/components/cue/crud-header.vue";
import moment from "moment/moment";
import crudSplit from "@/components/cue/crud-split.vue";

const route = useRoute()
const backName = ref("")
const router = useRouter()
const basicInfo = ref({})
const apiAuthorizer = ref([])
const apiAuthorizerName = ref('')
const userList = ref([])
const ip = ref(import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_APP_DEV_API_URL
    : window.webConfig.VITE_APP_PROD_API_URL)

function queryUser() {
  const listUrl = import.meta.env.MODE === 'development'
      ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/interface/getUser'
      : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/interface/getUser'
  const authListUrl = import.meta.env.MODE === 'development'
      ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/interface/getAuthorizeInfo'
      : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/interface/getAuthorizeInfo'
  axios.get(listUrl).then(function (response) {

    userList.value = response.data.data
    userList.value = userList.value.map((item) => {
      let tempList = {}
      tempList.value = item.id
      tempList.label = item.userName
      return tempList
    })

  })
  let authBody = {
    'apiId': basicInfo.value.apiId
  }

  axios.post(authListUrl, authBody).then(function (response) {


    let list = response.data.data
    apiAuthorizer.value = list.map((item) => {
      let authList = ''
      authList = item.id
      return authList
    })
    apiAuthorizerName.value = list
        .map((item) => {
          let authList = ''
          authList = item.userName
          return authList
        })
        .join(',')
  })
}

function queryBasic(apiName) {
  const url = import.meta.env.MODE === 'development'
      ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/interface/getInterfaceInfoByApiName'
      : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/interface/getInterfaceInfoByApiName'
  let basicPar = {
    apiName: apiName
  }
  axios.post(url, basicPar).then(function (response) {

    basicInfo.value = response.data.obj
    if (basicInfo.value.apiFlag === 1) {
      basicInfo.value.apiFlag = '接口开发'
      basicInfo.value.apiScript = basicInfo.value.apiScript.replace(/.*HD688296/,"")
      basicInfo.value.apiPath = basicInfo.value.apiPath.replace('/api/','/HDataApi/api/')
    }
    if (basicInfo.value.apiFlag === 2) {
      basicInfo.value.apiFlag = '接口注册'
    }
    let date = new Date(parseInt(basicInfo.value.apiGmtTime))
    basicInfo.value.apiGmtTime = moment(date).format('YYYY-MM-DD HH:mm:ss')

    queryUser()
  })
}
function goBack(){
  router.push({ name: backName.value })
}

onMounted(() => {
  queryBasic(history.state.apiName)
  backName.value = history.state.backName
})
</script>

<style scoped>
.n-scrollbar-container {
  width: 100%;
  height: 100%;
  max-height: inherit;
  scrollbar-width: none;
  overflow: auto;
}

.sticky-top {
  position: sticky;
  top: 0; /* 粘在顶部 */
  z-index: 1; /* 确保固定在顶部的div在其他内容之上 */
  padding: 10px; /* 添加一些内边距 */
}

::-webkit-scrollbar {
  display: none;
}

.titleSplit {
  background: white !important;
  font-size: 18px !important;
  padding-left: 0 !important;
}
</style>
