<template>
  <div class="n-scrollbar-container">
    <CrudHead class="sticky-top" title="数据详情" defineButton button-title="返回" @click-event="goBack"/>
    <n-card :title=tableName size="large">
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

const route = useRoute()
const message = useMessage()
const iframeSrc = ref("")
const tableName = ref("")
const tableComment = ref("")
const dbType = ref("")
const backName = ref("")
const router = useRouter()

function goBack(){
  router.push({ name: backName.value })
}

onMounted(() => {
  tableName.value = history.state.tableName
  tableComment.value = history.state.tableComment
  dbType.value = history.state.dbType
  backName.value = history.state.backName
  iframeSrc.value = import.meta.env.MODE === 'development'
      ? import.meta.env.VITE_APP_DEV_BLOOD_URL+'/?e='+history.state.tableName
      : window.webConfig.VITE_APP_PROD_BLOOD_URL+'/?e='+history.state.tableName
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

</style>
