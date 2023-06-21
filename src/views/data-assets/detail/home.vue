<template>
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
    <n-card content-style="padding: 0;" style="margin-top: 20px">
      <n-tabs
          type="line"
          size="large"
          :tabs-padding="20"
          pane-style="padding: 10px;"
      >
        <n-tab-pane name="基本信息">
          <basic style="margin-top: 0"/>
        </n-tab-pane>
        <n-tab-pane name="血缘与影响性">
          <div style="height: 60vh;">
          <iframe
              :src="iframeSrc"
              width="100%"
              height="100%"
              frameborder="0">
          </iframe>
          </div>
        </n-tab-pane>
        <n-tab-pane name="数据预览">
          <overview style="margin-top: 0"/>
        </n-tab-pane>
      </n-tabs>
    </n-card>
</template>

<script setup>
import basic from './basic.vue'
import overview from './overview.vue'
import { onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";
import {useMessage} from "naive-ui";

const route = useRoute()
const message = useMessage()
const iframeSrc = ref("")
const tableName = ref("")
const tableComment = ref("")
const dbType = ref("")

onMounted(() => {
  tableName.value = route.query.tableName
  tableComment.value = route.query.tableComment
  dbType.value = route.query.dbType
  iframeSrc.value = import.meta.env.MODE === 'development'
      ? import.meta.env.VITE_APP_DEV_BLOOD_URL+'/?e='+route.query.tableName
      : window.webConfig.VITE_APP_PROD_BLOOD_URL+'/?e='+route.query.tableName
})
</script>

<style scoped>

</style>
