<template>
  <div class="n-scrollbar-container">
    <CrudHead class="sticky-top" title="数据详情" defineButton button-title="返回" @click-event="goBack"/>
    <n-card :title=tableName size="large">
      <template #header-extra>
        <div style="display: flex; align-items: center;">
          <div class="hand">
            <svg @click="handleLikeCollection(true, tableDetail?.isCollected ? 1 : 0)" class="icon" viewBox="0 0 1024 1024"  xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M335.008 916.629333c-35.914667 22.314667-82.88 10.773333-104.693333-25.557333a77.333333 77.333333 0 0 1-8.96-57.429333l46.485333-198.24a13.141333 13.141333 0 0 0-4.021333-12.864l-152.16-132.586667c-31.605333-27.52-35.253333-75.648-8.234667-107.733333a75.68 75.68 0 0 1 51.733333-26.752L354.848 339.2c4.352-0.362667 8.245333-3.232 10.026667-7.594667l76.938666-188.170666c16.032-39.2 60.618667-57.92 99.52-41.461334a76.309333 76.309333 0 0 1 40.832 41.461334l76.938667 188.16c1.781333 4.373333 5.674667 7.253333 10.026667 7.605333l199.712 16.277333c41.877333 3.413333 72.885333 40.458667 69.568 82.517334a76.938667 76.938667 0 0 1-26.08 51.978666l-152.16 132.586667c-3.541333 3.082667-5.141333 8.074667-4.021334 12.853333l46.485334 198.24c9.621333 41.013333-15.36 82.336-56.138667 92.224a75.285333 75.285333 0 0 1-57.525333-9.237333l-170.976-106.24a11.296 11.296 0 0 0-12.010667 0l-170.986667 106.24z" :fill="tableDetail?.isCollected ? '#F0D155' : '#bfbfbf'"></path></svg>
            <span style="padding-left: 5px">{{ tableDetail?.totalCollections ? tableDetail.totalCollections : 0 }}</span>
          </div>
          <span style="color: rgba(0, 0, 0, 0.15); padding: 0 8px">|</span>
          <div class="hand">
            <svg @click="handleLikeCollection(false, tableDetail?.isLiked ? 1 : 0)" class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M948.4 407.2c-29.2-35.5-76.9-35.5-92.6-35.5H730c10.2-55.2 18.9-119.4 0.2-187.1-12.8-46.6-36.3-79.7-72-101.1-18.7-11.2-38.1-16.9-57.8-16.9-51.8 0-90.6 38.4-96.4 95.7-2.2 21.4-4.2 41.7-9.3 59.1-19 63.9-65.4 112.7-108.3 151.8-16 14.4-33.1 40.2-33.3 69.2-0.6 77.6-0.7 155.5-0.7 235.1l-0.1 141.4c-0.2 47.3 25 85.4 67 101.7 22.2 9 45.7 14 70.1 14.7 38.8 0.5 77.8 0.5 114.3 0.5h56.9c37.2 0 74.4 0 111.8 0.4h1.2c43.5 0 77.7-21.7 93.9-59.5l4.8-11.1c11.3-26 22.9-52.9 30.1-82.8 22-90.9 44.9-188.2 63.4-283.8 7.4-37.9 1.6-68.8-17.4-91.8zM216.1 374.5h-11.9c-56.2 0-101.9 45.7-101.9 101.9v348.4c0 56.2 45.7 101.9 101.9 101.9h11.9c56.2 0 101.9-45.7 101.9-101.9V476.4c0.1-56.2-45.7-101.9-101.9-101.9z" :fill="tableDetail?.isLiked ? '#F0D155' : '#bfbfbf'"></path></svg>
            <span style="padding-left: 5px">{{ tableDetail?.totalLikes ? tableDetail.totalLikes : 0 }}</span>
          </div>
        </div>
      </template>
      <n-descriptions label-placement="left" >
        <n-descriptions-item label="描述" label-style="color:grey">
          {{ tableComment }}
        </n-descriptions-item>
        <n-descriptions-item label="类型" label-style="color:grey">
          {{ dbType }}
        </n-descriptions-item>
        <n-descriptions-item label="分类" label-style="color:grey">
          -
        </n-descriptions-item>
        <n-descriptions-item label="数据标签" label-style="color:grey">
          -
        </n-descriptions-item>
        <n-descriptions-item label="类别" label-style="color:grey">
          -
        </n-descriptions-item>
      </n-descriptions>
    </n-card>
    <n-card content-style="padding: 0;" style="margin-top: 12px">
      <n-tabs
          type="line"
          size="large"
          :tabs-padding="20"
      >
        <n-tab-pane name="基本信息">
          <basic style="margin-top: 0"/>
        </n-tab-pane>
        <n-tab-pane name="血缘与影响性">
          <div style="height: 60vh;">
          <iframe
              :src="iframeSrc"
              width="100%"
              height="100%">
          </iframe>
          </div>
        </n-tab-pane>
        <n-tab-pane name="数据预览">
          <overview style="margin-top: 0"/>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup>
import basic from './basic.vue'
import overview from './overview.vue'
import { onMounted, ref} from "vue";
import { useRoute, useRouter} from "vue-router";
import {useMessage} from "naive-ui";
import CrudHead from "@/components/cue/crud-header.vue";
import utils from "@/utils";
import axios from "axios";
import {queryListUrl, updateLikeCollection} from "@/service/modules/data-bussiness";
import {useUserStore} from "@/store/user/user";

const iframeSrc = ref("")
const tableName = ref("")
const tableComment = ref("")
const dbType = ref("")
const backName = ref("")
const router = useRouter()
const userStore = useUserStore()
const tableDetail = ref({
  isLiked: 0,
  totalCollections: 0,
  totalLikes: 0,
  sqllineageName: '',
  isCollected: 0
})

function goBack(){
  router.push({ name: backName.value })
}

async function handleLikeCollection(ifCollection, initValue) {
  let params = {
    userId: userStore.getUserInfo.id,
    sqllineageName: tableName.value,
    likeState: tableDetail.value?.isLiked ? 1 : 0,
    collectionState: tableDetail.value?.isCollected ? 1 : 0,
  }
  if (ifCollection) {
    params.collectionState = 1 - initValue
  } else {
    params.likeState = 1 - initValue
  }
  await updateLikeCollection(params)
  await initData()
}

async function initData() {
  let params = {
    userId: userStore.getUserInfo.id,
    sqllineageName: tableName.value,
  }
  const data = await queryListUrl(params)
  tableDetail.value = data.totalList[0]
}

onMounted(() => {
  tableName.value = history.state.tableName
  tableComment.value = history.state.tableComment
  dbType.value = history.state.dbType
  backName.value = history.state.backName
  iframeSrc.value = import.meta.env.MODE === 'development'
      ? import.meta.env.VITE_APP_DEV_BLOOD_URL+'/?e='+history.state.tableName
      : window.webConfig.VITE_APP_PROD_BLOOD_URL+'/?e='+history.state.tableName
  initData()
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

.hand {
  cursor: pointer;
}

</style>
