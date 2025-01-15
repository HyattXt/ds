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
            <CrudHead title="全部数据" defineButton button-title="元数据采集" :loadingMeta="loadingMeta" @click-event="handleMetadata">
              <template v-slot:button-group>
                <div>
                  <el-button
                      class="show-text"
                      :class="{'active-button': paginationReactive.likeState, 'noActive-button': !paginationReactive.likeState}"
                      @click="queryLike"
                  >
                    我的点赞
                  </el-button>
                </div>
                <div>
                  <el-button
                      class="show-text"
                      :class="{'active-button': paginationReactive.collectionState, 'noActive-button': !paginationReactive.collectionState}"
                      @click="queryCollect"
                  >
                    我的收藏
                  </el-button>
                </div>
              </template>
            </CrudHead>
            <div class="crud-v2-condition" >
              <div class="cue-crud__header-condition">
                <div class="cue-crud__header-content">
                  <el-form inline>
                    <el-form-item label="表名">
                      <el-input type="text" style="width: 180px" clearable v-model="paginationReactive.sqlLineageName"/>
                    </el-form-item>
                    <el-form-item label="注释">
                      <el-input type="text" style="width: 180px" clearable v-model="paginationReactive.notes"/>
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
                    <div v-if="dataRef.length === 0" class="no-data">暂无数据</div>
                    <div class="list-item mb16 bgf" v-for="item in dataRef" :key="item.id">
                      <div class="top pb16">
                        <div class="FBH FBJ t-title">
                          <div class="t-left">
                            <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M32 192a128 128 0 0 1 128-128h704a128 128 0 0 1 128 128v192H32V192z" fill="#2399ED"></path><path d="M32 384h320v192h-320z" fill="#E3F2FD"></path><path d="M32 384h320v192h-320z" fill="#E3F2FD" ></path><path d="M32 576h320v192h-320z" fill="#CDE8FF" ></path><path d="M32 768h320v192h-192a128 128 0 0 1-128-128v-64z" fill="#ABD9FF" ></path><path d="M352 384h320v192h-320z" fill="#CDE8FF" ></path><path d="M352 384h320v192h-320z" fill="#CDE8FF" ></path><path d="M352 576h320v192h-320z" fill="#ABD9FF" ></path><path d="M352 768h320v192h-320z" fill="#96D0FF" ></path><path d="M672 384h320v192h-320z" fill="#ABD9FF" ></path><path d="M672 384h320v192h-320z" fill="#ABD9FF" ></path><path d="M672 576h320v192h-320z" fill="#96D0FF" ></path><path d="M672 768h320v64a128 128 0 0 1-128 128h-192v-192z" fill="#7FC6FF" ></path></svg>
                            <a target="_blank" rel="noopener noreferrer" class="ml8 mr48 fs16" :title="item.sqlLineageName" @click="play(item)">{{ item.sqlLineageName }}</a>
                          </div>
                          <div class="FBH FBJ FBAC t-right">
                            <div style="display: flex; align-items: center;">
                              <div class="hand">
                                <svg @click="handleLikeCollection(true, item.likeState, item.collectionState, item.sqlLineageName)" class="icon" viewBox="0 0 1024 1024"  xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M335.008 916.629333c-35.914667 22.314667-82.88 10.773333-104.693333-25.557333a77.333333 77.333333 0 0 1-8.96-57.429333l46.485333-198.24a13.141333 13.141333 0 0 0-4.021333-12.864l-152.16-132.586667c-31.605333-27.52-35.253333-75.648-8.234667-107.733333a75.68 75.68 0 0 1 51.733333-26.752L354.848 339.2c4.352-0.362667 8.245333-3.232 10.026667-7.594667l76.938666-188.170666c16.032-39.2 60.618667-57.92 99.52-41.461334a76.309333 76.309333 0 0 1 40.832 41.461334l76.938667 188.16c1.781333 4.373333 5.674667 7.253333 10.026667 7.605333l199.712 16.277333c41.877333 3.413333 72.885333 40.458667 69.568 82.517334a76.938667 76.938667 0 0 1-26.08 51.978666l-152.16 132.586667c-3.541333 3.082667-5.141333 8.074667-4.021334 12.853333l46.485334 198.24c9.621333 41.013333-15.36 82.336-56.138667 92.224a75.285333 75.285333 0 0 1-57.525333-9.237333l-170.976-106.24a11.296 11.296 0 0 0-12.010667 0l-170.986667 106.24z" :fill="item.collectionState ? '#F0D155' : '#bfbfbf'"></path></svg>
                              </div>
                              <span style="color: rgba(0, 0, 0, 0.15); padding: 0 8px">|</span>
                              <div class="hand">
                                <svg @click="handleLikeCollection(false, item.likeState, item.collectionState, item.sqlLineageName)" class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M948.4 407.2c-29.2-35.5-76.9-35.5-92.6-35.5H730c10.2-55.2 18.9-119.4 0.2-187.1-12.8-46.6-36.3-79.7-72-101.1-18.7-11.2-38.1-16.9-57.8-16.9-51.8 0-90.6 38.4-96.4 95.7-2.2 21.4-4.2 41.7-9.3 59.1-19 63.9-65.4 112.7-108.3 151.8-16 14.4-33.1 40.2-33.3 69.2-0.6 77.6-0.7 155.5-0.7 235.1l-0.1 141.4c-0.2 47.3 25 85.4 67 101.7 22.2 9 45.7 14 70.1 14.7 38.8 0.5 77.8 0.5 114.3 0.5h56.9c37.2 0 74.4 0 111.8 0.4h1.2c43.5 0 77.7-21.7 93.9-59.5l4.8-11.1c11.3-26 22.9-52.9 30.1-82.8 22-90.9 44.9-188.2 63.4-283.8 7.4-37.9 1.6-68.8-17.4-91.8zM216.1 374.5h-11.9c-56.2 0-101.9 45.7-101.9 101.9v348.4c0 56.2 45.7 101.9 101.9 101.9h11.9c56.2 0 101.9-45.7 101.9-101.9V476.4c0.1-56.2-45.7-101.9-101.9-101.9z" :fill="item.likeState ? '#F0D155' : '#bfbfbf'"></path></svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="text-box notesPi">
                          <span class="t-label">描述：</span>
                          <span class="color25">{{ item.notes }}</span>
                        </div>
                        <div class="FBH FBJ">
                          <div class="text-box">
                            <span class="t-label">任务流：</span>
                            <span class="t-content">{{ item.taskName }}</span>
                          </div>
                          <div class="text-box">
                            <span class="t-label">数据库：</span>
                            <span class="t-content">{{ item.dataSourceName }}</span>
                          </div>
                          <div class="text-box">
                            <span class="t-label">数据库类型：</span>
                            <span class="t-content">{{ item.dbType }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="bottom pt16 FBH FBJS">
                        <div class="text-box-4">
                          <span class="t-label">数据行数：</span>
                          <span class="t-content text-break">{{ item.tableDataRow }}</span>
                        </div>
                        <div class="text-box-4">
                          <span class="t-label">表大小：</span>
                          <span class="t-content text-break">{{ item.tableDataLength }}</span>
                        </div>
                        <div class="text-box-4">
                          <span class="t-label">添加时间：</span>
                          <span class="t-content">{{ item.tableCreateTime }}</span>
                        </div>
                        <div class="text-box-4">
                          <span class="t-label">修改时间：</span>
                          <span class="t-content">{{ item.tableUpdateTime }}</span>
                        </div>
                      </div>
                    </div>
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
                    :default-page-size="10"
                    :page-sizes="[10, 30, 90, 180, 300]"
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
import {useRoute, useRouter} from "vue-router";
import { CaretUp, CaretDown } from "@vicons/fa";
import CrudHead from "@/components/cue/crud-header.vue"
import {Add12Filled} from "@vicons/fluent";
import utils from "@/utils";
import {ElButton} from "element-plus";
import {useUserStore} from "@/store/user/user";
import {updateLikeCollection} from "@/service/modules/data-bussiness";

const TableData = reactive({
  tableList: [],
  totalNum: 0
})

const userStore = useUserStore()
const dataRef = ref([])
const router = useRouter()
const loadingRef = ref(true)
const loadingMeta = ref(false)
const showSpin = ref(false)
const message = useMessage()
const treeFolder = ref([])
const expandedKeys = ref([1]);
const pattern = ref('');
const route = useRoute()
const getApiFolderUrl = utils.getUrl('interface_lineage/getTreeAll')
const paginationReactive = reactive({
  page: 1,
  pageSize: 10,
  sqlLineageName: '',
  notes: '',
  apiTreeId: 1,
  userId: userStore.getUserInfo.id,
  likeState: 0,
  collectionState: 0,
  itemCount: 0
})

function query(
    page,
    pageSize = 10,
    sqlLineageName = '',
    notes = '',
    apiTreeId = 1,
    userId,
    likeState,
    collectionState,
) {
  const url = utils.getUrl('interface_lineage/getSqlLineageListByParams')
  const params = {
    'pageNum': page,
    'pageSize': pageSize,
    'sqlLineageName': sqlLineageName,
    'notes': notes,
    'apiTreeId': apiTreeId,
    'userId': userId,
    'likeState': likeState,
    'collectionState': collectionState,
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
          if (item.dbType === '2') {
            item.dbType = 'hive'
          }
          if (item.dbType === '12') {
            item.dbType = 'dm'
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
function queryLike () {
  paginationReactive.likeState = 1 - paginationReactive.likeState
  handlePageChange(1, paginationReactive.pageSize)
}
function queryCollect () {
  paginationReactive.collectionState = 1 - paginationReactive.collectionState
  handlePageChange(1, paginationReactive.pageSize)
}

async function handleLikeCollection(ifCollection, initLike, initCollection, tableName) {
  let params = {
    userId: userStore.getUserInfo.id,
    sqlLineageName: tableName,
    likeState: initLike,
    collectionState: initCollection,
  }
  if (ifCollection) {
    params.collectionState = 1 - initCollection
  } else {
    params.likeState = 1 - initLike
  }
  await updateLikeCollection(params)
  handlePageChange(paginationReactive.page, paginationReactive.pageSize)
}

function handleMetadata() {
  let url = utils.getUrl('interface_lineage/sqlLineageExcute')
  loadingMeta.value = true
  message.info('采集中，请稍后查看')
  axios
      .get(url)
      .then(function () {
        loadingMeta.value = false
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
        paginationReactive.notes,
        paginationReactive.apiTreeId,
        paginationReactive.userId,
        paginationReactive.likeState,
        paginationReactive.collectionState
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
    case 1:
      return h(
          NIcon,
          {
            color: '#0099CB'
          },
          {
            default: () =>
                h(
                    'svg',
                    {
                      xmlns: 'http://www.w3.org/2000/svg',
                      viewBox: '0 0 1260 1024',
                      width: ' 19.688',
                      height: '16'
                    },
                    [
                      h('path', {
                        d: 'M1171.561 157.538H601.797L570.814 61.44A88.222 88.222 0 00486.794 0H88.747A88.747 88.747 0 000 88.747v846.506A88.747 88.747 0 0088.747 1024H1171.56a88.747 88.747 0 0088.747-88.747V246.285a88.747 88.747 0 00-88.747-88.747zm-1082.814 0V88.747h398.047l22.055 68.791z'
                      })
                    ]
                )
          }
      )
    case 2:
      return h(
          NIcon,
          { color: '#0099CB' },
          { default: () => h(ApartmentOutlined) }
      )
    default:
      return h(
          NIcon,
          { color: '#0099CB' },
          { default: () => h(TableOutlined) }
      )
  }
}

onMounted(() => {
  getApiFolder()
  if(route.query.type === 'collect'){
    paginationReactive.collectionState = 1
  } else if(route.query.type === 'like'){
    paginationReactive.likeState = 1
  }
  query(
      paginationReactive.page,
      paginationReactive.pageSize,
      paginationReactive.sqlLineageName,
      paginationReactive.notes,
      paginationReactive.apiTreeId,
      paginationReactive.userId,
      paginationReactive.likeState,
      paginationReactive.collectionState
  )
})
</script>

<style scoped lang="scss">

.button-item-toggle{
  right: 20px !important;
}

.list-item {
  padding: 16px 24px;
  margin: 8px 0;
  border-radius: 15px;
  user-select: none;
  transition: transform 0.3s; /* 添加过渡效果 */

  &:hover {
    /* 悬停特效 */
    transform: scale(1.005); /* 稍微放大 */
    box-shadow: 0 2px 4px rgba(181, 181, 181, 0.3);
  }

  .top {
    border-bottom: 1px solid #e8e8e8;

    .t-title .l-icon {
      width: 16px;
    }
  }

  .bottom {
    flex-wrap: wrap;
  }

  .notesPi {
    padding: 3px 0;
  }

  .text-box {
    width: 33.33%;

    .t-label {
      color: rgba(0, 0, 0, .45);
    }

    .t-content {
      color: rgba(0, 0, 0, .65);
      width: 60%;
      margin-right: 8px;
    }

  }

  .text-box-4 {
    width: 25%;

    .t-label {
      color: rgba(0, 0, 0, .45);
    }

    .t-content {
      color: rgba(0, 0, 0, .65);
      width: 60%;
      margin-right: 8px;
    }

    .t-content.text-break {
      flex: 1;
      word-wrap: break-word;
      word-break: break-all;
    }
  }
}

.bgf {
  background-color: #fff;
}

.pt16 {
  padding-top: 16px;
}

.pb16 {
  padding-bottom: 16px;
}

.FBJ {
  justify-content: space-between;
}

.FBJS {
  justify-content: flex-start;
}

.FBH {
  display: flex;
}

.mr48 {
  margin-right: 48px;
}
.ml8 {
  margin-left: 8px;
}
.fs16 {
  font-size: 16px;
}

.color25 {
  color: rgba(0, 0, 0, .25);
}

a, a:hover {
  color: #2466ff;
}

a {
  text-decoration: none;
  background-color: transparent;
  outline: none;
  cursor: pointer;
  -webkit-transition: color .3s;
  transition: color .3s;
}

.cue-table-container {
  overflow: auto;
  background-color: #e8ecf0;
}

::-webkit-scrollbar {
  display: none;
}

.no-data {
  /* 为“无数据”提示添加样式 */
  height: 100%;
  padding: 16px;
  text-align: center;
  color: #999;
  display: flex;              /* 启用Flexbox布局 */
  justify-content: center;    /* 在水平方向上居中 */
  align-items: center;
}

.active-button {
  color: #4698EBFF !important;
  border-color: #C8E0F9FF !important;
  background-color: #EDF5FDFF !important;
}

.noActive-button {
  color: #000000 !important;
  border-color: #F1F2F4FF !important;
  background-color: #F1F2F4FF !important;
}

.hand {
  cursor: pointer;
}

</style>

