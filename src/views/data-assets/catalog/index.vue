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
                  <div v-if="dataRef.length === 0" class="no-data">暂无数据</div>
                  <div class="list-item mb16 bgf" v-for="item in dataRef" :key="item.id">
                    <div class="top pb16">
                      <div class="FBH FBJ t-title">
                        <div class="t-left">
                          <img class="l-icon" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTNweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTMgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYzLjEgKDkyNDUyKSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT5zLWt1PC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9Iumhtemdoi0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iMDfmlbDmja7lnLDlm74t5pWw5o2u5pCc57SiLee7k+aenOmhtS3mlbDmja7lpIfku70iIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNDkuMDAwMDAwLCAtOTI1LjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0i57yW57uELTYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIyNC4wMDAwMDAsIDI0OC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtM+Wkh+S7vS02IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNC4wMDAwMDAsIDY3Mi4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0icy1rdSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDQuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxnIGlkPSLpobXpnaItMSIgb3BhY2l0eT0iMC40NSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMS44NjA0NjUsIDEuNDg4MzcyKSIgZmlsbD0iIzAwMDAwMCIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxnIGlkPSLnvJbnu4TlpIfku70tNCI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTUuODg2NTExNjMsNi40MTExNjI3OSBDMi42NDkzMDIzMyw2LjQxMTE2Mjc5IDAuMDI2MDQ2NTExNiw0Ljk3NDg4MzcyIDAuMDI2MDQ2NTExNiwzLjIwNzQ0MTg2IEMwLjAyNjA0NjUxMTYsMS40NCAyLjY0OTMwMjMzLDAgNS44ODY1MTE2MywwIEM5LjEyMzcyMDkzLDAgMTEuNzUwNjk3NywxLjQzMjU1ODE0IDExLjc1MDY5NzcsMy4yMDM3MjA5MyBDMTEuNzUwNjk3Nyw0Ljk3NDg4MzcyIDkuMTI3NDQxODYsNi40MTExNjI3OSA1Ljg4NjUxMTYzLDYuNDExMTYyNzkgWiBNMTEuMjAzNzIwOSw5LjIxNjc0NDE5IEMxMS4yMzk4NjY3LDkuMTc0MjI5ODYgMTEuMjk0NDY4LDkuMTUyMDA0OTMgMTEuMzUwMDI5Niw5LjE1NzE5MDY4IEMxMS40MDU1OTEzLDkuMTYyMzc2NDMgMTEuNDU1MTM2Nyw5LjE5NDMyMTcyIDExLjQ4Mjc5MDcsOS4yNDI3OTA3IEMxMS42NTYwMzI5LDkuNTMzMjA0NjggMTEuNzQ4NTI1NCw5Ljg2NDYzNjI4IDExLjc1MDY5NzcsMTAuMjAyNzkwNyBDMTEuNzUwNjk3NywxMS45NzAyMzI2IDkuMTQ2MDQ2NTEsMTMuNDA2NTExNiA1Ljg4NjUxMTYzLDEzLjQwNjUxMTYgQzIuNjI2OTc2NzQsMTMuNDA2NTExNiAwLjAyNjA0NjUxMTYsMTEuOTcwMjMyNiAwLjAyNjA0NjUxMTYsMTAuMjAyNzkwNyBDMC4wMjgyMTg3ODk2LDkuODY0NjM2MjggMC4xMjA3MTEzMyw5LjUzMzIwNDY4IDAuMjkzOTUzNDg4LDkuMjQyNzkwNyBDMC4zMjEzNTQ4MzEsOS4xOTM1MzY1IDAuMzcxNjk3Nzc4LDkuMTYxMzcyOTUgMC40Mjc5MDY5NzcsOS4xNTcyMDkzIEMwLjQ4Mjk2NTIwMSw5LjE1MzAzMjU0IDAuNTM2NzYyMTEyLDkuMTc1MTAzMDcgMC41NzMwMjMyNTYsOS4yMTY3NDQxOSBDMS41MTA2OTc2NywxMC4zMTA2OTc3IDMuNTQ5NzY3NDQsMTEuMDc3MjA5MyA1Ljg4NjUxMTYzLDExLjA3NzIwOTMgQzguMjIzMjU1ODEsMTEuMDc3MjA5MyAxMC4yNjk3Njc0LDEwLjMxMDY5NzcgMTEuMjAzNzIwOSw5LjIxNjc0NDE5IFogTTExLjIwMzcyMDksNS43MjI3OTA3IEMxMS4yMzg4MjAyLDUuNjc5NTU3NjYgMTEuMjkzNDg4MSw1LjY1NzEyOTgyIDExLjM0ODgzNzIsNS42NjMyNTU4MSBDMTEuNDA0MzA1OSw1LjY2NjYyMzY5IDExLjQ1NDQ5LDUuNjk3MjkxNzIgMTEuNDgyNzkwNyw1Ljc0NTExNjI4IEMxMS42NTQxMDc4LDYuMDMzNjM2NDkgMTEuNzQ2NTAyNSw2LjM2MjE1MTE2IDExLjc1MDY5NzcsNi42OTc2NzQ0MiBDMTEuNzUwNjk3Nyw4LjQ2NTExNjI4IDkuMTQ2MDQ2NTEsOS44OTc2NzQ0MiA1Ljg4NjUxMTYzLDkuODk3Njc0NDIgQzIuNjI2OTc2NzQsOS44OTc2NzQ0MiAwLjAyNjA0NjUxMTYsOC40NzYyNzkwNyAwLjAyNjA0NjUxMTYsNi42OTc2NzQ0MiBDMC4wMjg4MDg3OTU4LDYuMzU4NDMwNzQgMC4xMjEyMzU2NDMsNi4wMjU5NTA4MyAwLjI5Mzk1MzQ4OCw1LjczMzk1MzQ5IEMwLjMyMTc1ODE1OSw1LjY4NTY0MjgyIDAuMzcyMjMxOTc3LDUuNjU0Nzk3NyAwLjQyNzkwNjk3Nyw1LjY1MjA5MzAyIEMwLjQ4Mjk2NTIwMSw1LjY0NzkxNjI2IDAuNTM2NzYyMTEyLDUuNjY5OTg2NzkgMC41NzMwMjMyNTYsNS43MTE2Mjc5MSBDMS41MTA2OTc2Nyw2LjgwMTg2MDQ3IDMuNTQ5NzY3NDQsNy41NzIwOTMwMiA1Ljg4NjUxMTYzLDcuNTcyMDkzMDIgQzguMjIzMjU1ODEsNy41NzIwOTMwMiAxMC4yNjk3Njc0LDYuODI3OTA2OTggMTEuMjAzNzIwOSw1LjcxMTYyNzkxIEwxMS4yMDM3MjA5LDUuNzIyNzkwNyBaIiBpZD0i5b2i54q2Ij48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IuefqeW9oiIgeD0iMCIgeT0iMCIgd2lkdGg9IjE1LjYzNTM0ODgiIGhlaWdodD0iMTUuNjM1MzQ4OCI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+" alt="img">
                          <a target="_blank" rel="noopener noreferrer" class="ml8 mr48 fs16" :title="item.sqlLineageName" @click="play(item)">{{ item.sqlLineageName }}</a>
                        </div>
                        <div class="FBH FBJ FBAC t-right"></div>
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
<!--                  <el-table v-loading="loadingRef" :data="dataRef" show-overflow-tooltip border resizable highlight-current-row height="100%">
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
                        <el-button class="el-button&#45;&#45;text" size="small" @click="play(scope.row)">
                          详情
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>-->
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
import {useRouter} from "vue-router";
import { CaretUp, CaretDown } from "@vicons/fa";
import CrudHead from "@/components/cue/crud-header.vue"
import {Add12Filled} from "@vicons/fluent";
import utils from "@/utils";

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
    const expandedKeys = ref([1]);
    const pattern = ref('');
    const getApiFolderUrl = utils.getUrl('interface_lineage/getTreeAll')
    const paginationReactive = reactive({
      page: 1,
      pageSize: 10,
      sqlLineageName: '',
      apiTreeId: 1,
      itemCount: 0
    })

    function query(
        page,
        pageSize = 10,
        sqlLineageName = '',
        apiTreeId = 1
    ) {
      const url = utils.getUrl('interface_lineage/getSqlLineageListByParams')
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

    function handleMetadata() {
      let url = utils.getUrl('interface_lineage/sqlLineageExcute')
      axios
          .get(url)
          .then(function () {

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

</style>

