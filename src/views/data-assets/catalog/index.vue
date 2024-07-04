<template>
  <el-config-provider :locale="zhCn">
    <div class="cue-drag-layout flex-row">
        <div class="cue-drag-layout__mainview" style="width: 280px; margin-right: 12px">
          <div class="tree-container">
            <div class="add-buttons">
              <span class="title">分类</span>
              <div class="button-item-toggle" @click="packHandle" :title="expandedKeys.length ? '收起' : '展开'">
                <n-icon size="16" style="padding-top: 5px"><CaretUp v-if="expandedKeys.length"/><CaretDown v-else /></n-icon>
              </div>
              <div v-if="false" class="button-item" @click="packHandle" title="添加">
                <n-icon size="16"><Add12Filled/></n-icon>
              </div>
            </div>
            <n-input
                type="text"
                placeholder="搜索"
                class="search-input"
                v-model:value="pattern"
            >
              <template #suffix>
                <n-icon :component="SearchOutlined"/>
              </template>
            </n-input>
            <n-spin :show="showSpin" style="height: 100%" content-class="tree-scrollbar">
              <n-tree
                  class="tree-scrollbar"
                  block-line
                  show-irrelevant-nodes
                  :data="treeFolder"
                  key-field="id"
                  label-field="titleName"
                  children-field="children"
                  :pattern="pattern"
                  @update:expanded-keys="onExpandedKeys"
                  :expanded-keys="expandedKeys"
                  :render-prefix="menuIcon"
                  :nodeProps="nodeProps"
              />
            </n-spin>
          </div>
        </div>
        <div class="cue-drag-layout__mainview" :style="{width: 'calc(100% - ' + (280 + 12) + 'px)'}">
          <div class="cue-crud cue-crud-v2">
            <CrudHead title="全部数据" defineButton button-title="元数据采集" :loadingMeta="loadingMeta" @click-event="handleMetadata"/>
            <div class="crud-v2-condition" >
              <div class="cue-crud__header-condition">
                <div class="cue-crud__header-content">
                  <el-form inline>
                    <el-form-item label="表名/注释">
                      <el-input type="text" style="width: 180px" clearable v-model="paginationReactive.sqlLineageName"/>
                    </el-form-item>
                  </el-form>
                </div>
                <el-button color="#0099CB" class="cue-crud__header-query" type="primary" size="default"
                           :icon="Search" @click="handlePageChange(1,paginationReactive.pageSize)" >查询
                </el-button>
              </div>
            </div>
            <div class="cue-crud__body">
              <div class="cue-table">
                <div class="cue-table-container">
                  <el-table v-loading="loadingRef" :data="dataRef" show-overflow-tooltip border resizable highlight-current-row height="100%">
                    <el-table-column type="expand" fixed>
                      <template #default="props">
                        <div style="margin: 6px">
                          <p style="display: inline-block;padding-left: 50px">数据行数: {{ props.row.tableDataRow }}</p>
                          <p style="display: inline-block;padding-left: 50px">表大小: {{ props.row.tableDataLength }}</p>
                          <p style="display: inline-block;padding-left: 50px">创建时间: {{ props.row.tableCreateTime }}</p>
                          <p style="padding: 10px 0 0 50px">更新时间: {{ props.row.tableUpdateTime }}</p>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column type="index" fixed label="序号" width="50" align="center"/>
                    <el-table-column prop="sqlLineageName" label="表名" align="center"/>
                    <el-table-column prop="notes" label="注释" align="center"/>
                    <el-table-column prop="taskName" label="任务流" align="center"/>
                    <el-table-column prop="dataSourceName" label="数据库" width="120" align="center"/>
                    <el-table-column prop="dbType" label="数据库类型" width="120" align="center"/>
                    <el-table-column fixed="right" label="操作" width="120" align="center">
                      <template #default="scope">
                        <el-button class="el-button--text" size="small" @click="play(scope.row)">
                          详情
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
              <div class="cue-crud__body-border-bottom"></div>
            </div>
            <div class="cue-crud__footer">
              <div class="cue-crud__footer-tab">
              </div>
              <div class="cue-crud__footer-pager">
                <el-pagination
                    background
                    :default-page-size="30"
                    :page-sizes="[30, 90, 180, 300]"
                    layout="total, sizes, prev, pager, next"
                    :total="paginationReactive.itemCount"
                    @change="handlePageChange"
                    popper-class="page-select"
                >
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
    </div>
  </el-config-provider>
</template>

<script setup>
import {Search} from '@element-plus/icons-vue'
import { ref, reactive, onMounted, h, unref} from 'vue'
import axios from 'axios'
import zhCn from "element-plus/es/locale/lang/zh-cn";
import {
  ApartmentOutlined,
  SearchOutlined,
  TableOutlined
} from '@vicons/antd'
import { NIcon, useMessage } from "naive-ui";
import {useRouter} from "vue-router";
import { CaretUp, CaretDown } from "@vicons/fa";
import CrudHead from "@/components/cue/crud-header.vue"
import {Add12Filled} from "@vicons/fluent";

const TableData = reactive({
  tableList: [],
  totalNum: 0
})

    const dataRef = ref([])
    const router = useRouter()
    const loadingRef = ref(true)
    const loadingMeta = ref(false)
    const showSpin = ref(false)
    const message = useMessage()
    const treeFolder = ref([])
    const expandedKeys = ref([]);
    const pattern = ref('');
    const getApiFolderUrl = import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/interface_lineage/getTreeAll'
        : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/interface_lineage/getTreeAll'
    const paginationReactive = reactive({
      page: 1,
      pageSize: 30,
      sqlLineageName: '',
      apiTreeId: 1,
      itemCount: 0
    })

    function query(
        page,
        pageSize = 30,
        sqlLineageName = '',
        apiTreeId = 1
    ) {
      const url = import.meta.env.MODE === 'development'
          ? import.meta.env.VITE_APP_DEV_ASSETS_URL+'/HDataApi/interface_lineage/getSqlLineageListByParams'
          : window.webConfig.VITE_APP_PROD_ASSETS_URL+'/HDataApi/interface_lineage/getSqlLineageListByParams'
      const params = {
        'pageNum': page,
        'pageSize': pageSize,
        'sqlLineageName': sqlLineageName,
        'apiTreeId': apiTreeId
      }

      axios
          .post(url, params)
          .then(function (response) {

            TableData.tableList = response.data.data
            TableData.totalNum = response.data.totalNum
            TableData.tableList.forEach((item) => {
              if (item.dbType === '0') {
                item.dbType = 'mysql'
              }
              if (item.dbType === '5') {
                item.dbType = 'oracle'
              }
            })
            dataRef.value = TableData.tableList.map((v) => v)
            paginationReactive.itemCount = TableData.totalNum
            loadingRef.value = false
          })
          .catch(function (error) {
            console.log(error)
          })
    }

    function nodeProps ({option}) {
      return {
        onClick() {
          paginationReactive.apiTreeId = option.id
          handlePageChange(1, paginationReactive.pageSize)
        }
      }
    }

    function handleMetadata() {
      let url = import.meta.env.MODE === 'development'
          ? import.meta.env.VITE_APP_DEV_ASSETS_URL+'/HDataApi/interface_lineage/sqlLineageExcute'
          : window.webConfig.VITE_APP_PROD_ASSETS_URL+'/HDataApi/interface_lineage/sqlLineageExcute'
      axios
          .get(url)
          .then(function (response) {

            loadingMeta.value = true
            message.info('采集中，请稍后查看')
            setTimeout(() => {
              loadingMeta.value = false
            }, 2000)
          })
          .catch(function () {
            message.error('采集数据失败，请咨询管理员')
          })
    }

    function getApiFolder ()  {
      showSpin.value = true
      let params ={}
      axios.post(getApiFolderUrl,params).then((res) => {
        treeFolder.value = res.data.data
        showSpin.value = false
      })
    }

    function handlePageChange(currentPage, pageSize) {
      if (!loadingRef.value) {
        loadingRef.value = true
        paginationReactive.page = currentPage
        paginationReactive.pageSize = pageSize
        query(
            paginationReactive.page,
            paginationReactive.pageSize,
            paginationReactive.sqlLineageName,
            paginationReactive.apiTreeId
        )
      }
    }

    function play(row) {
      router.push({
            name: 'assets-detail',
            state: {tableName: row.sqlLineageName, tableComment: row.notes, dbType: row.dbType, fieldArray: row.fieldArray, backName: 'assets-catalog'}
          }
      )
    }

    function onExpandedKeys(keys) {
      expandedKeys.value = keys;
    }

    function packHandle() {
      if (expandedKeys.value.length) {
        expandedKeys.value = [];
      } else {
        setId(unref(treeFolder.value))
      }
    }

    function setId(datas) { //遍历树  获取id数组
      for (let i in datas) {
        expandedKeys.value.push(datas[i].id)  // 遍历项目满足条件后的操作
        if (datas[i].children) {  //存在子节点就递归
          setId(datas[i].children);
        }
      }
    }

    function menuIcon({ option }) {
      switch (option.type) {
        case 1 : return  h(NIcon, {
          color: '#0099CB'
        }, [
          h('svg', {
            xmlns: 'http://www.w3.org/2000/svg',
            viewBox: '0 0 1260 1024',
            width: ' 19.688',
            height: '16'
          }, [
            h('path', {
              d: 'M1171.561 157.538H601.797L570.814 61.44A88.222 88.222 0 00486.794 0H88.747A88.747 88.747 0 000 88.747v846.506A88.747 88.747 0 0088.747 1024H1171.56a88.747 88.747 0 0088.747-88.747V246.285a88.747 88.747 0 00-88.747-88.747zm-1082.814 0V88.747h398.047l22.055 68.791z'
            })
          ])
        ])
        case 2 : return h(NIcon, {color: '#0099CB'}, { default: () => h(ApartmentOutlined) })
        default : return h(NIcon, {color: '#0099CB'}, { default: () => h(TableOutlined) })
      }
    }

    onMounted(() => {
      getApiFolder()
      query(
          paginationReactive.page,
          paginationReactive.pageSize,
          paginationReactive.sqlLineageName,
          paginationReactive.apiTreeId
      )
    })
</script>

<style scoped lang="scss">

.button-item-toggle{
  right: 20px !important;
}

</style>

