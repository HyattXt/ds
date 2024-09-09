<template>
  <CrudForm>
    <template v-slot:header>
      <CrudHeader title="API管理"/>
    </template>
    <template v-slot:condition>
      <n-form :show-feedback="false" :model="paginationReactive" label-placement="left" style="margin-bottom: 3px">
        <n-grid :cols="22" :x-gap="16">
        <n-form-item-gi label="目录" :span="4">
          <n-tree-select
              v-model:value="paginationReactive.apiTreeId"
              :options="folderData"
              key-field="id"
              label-field="titleName"
              children-field="children"
              placeholder="请选择"
              size="small"
              :default-expanded-keys="[1]"
              :render-prefix="menuIcon"
          />
        </n-form-item-gi>
        <n-form-item-gi
            :span="4"
            label="名称"
            path="pagination.apiName"
        >
          <n-input
              clearable
              size="small"
              v-model:value="paginationReactive.apiName"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="4" label="API类型">
          <n-select
              size="small"
              v-model:value="paginationReactive.apiFlag"
              :options="stateOptions"
              clearable
              placeholder="请选择"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="4" label="API状态">
          <n-select
              size="small"
              v-model:value="paginationReactive.apiStatus"
              :options="statusOptions"
              clearable
              placeholder="请选择"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="4" label="路径">
          <n-input
              clearable
              size="small"
              v-model:value="paginationReactive.apiPath"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="2">
          <el-button color="#0099CB" class="cue-crud__header-query" type="primary" size="default" style="margin-bottom: 0"
                     :icon="Search" @click="handlePageChange(1, paginationReactive.pageSize)" >查询
          </el-button>
        </n-form-item-gi>
        </n-grid>
      </n-form>
    </template>
    <template v-slot:table>
      <n-data-table
          ref="table"
          remote
          bordered
          flex-height
          style="height: 100%"
          :single-line="false"
          size="small"
          :columns="columnsRef"
          :data="dataRef"
          :loading="loadingRef"
          :row-key="rowKey"
          class="cue-table"
      />
    </template>
    <template v-slot:page>
      <CrudPage
          :paginationReactive="paginationReactive"
          @page-change="handlePageChange"
      />
    </template>
  </CrudForm>
  <el-dialog
      v-model="showModal"
      width="600px"
  >
    <template #header> API授权 </template>
    <CrudSplit title="API名称：" style="margin-bottom: 10px; font-size: 14px; background: rgba(255,255,255,0)">
      <template v-slot:default>
        <div style="display: flex; align-items: center">
          <div style="font-size: 14px">API名称：</div>
          <div style="font-size: 16px; margin-left: 10px">{{drawTitle}}</div>
        </div>
      </template>
    </CrudSplit>

    <CrudSplit title="授权用户：" style="margin-top: 10px; font-size: 14px; background: rgba(255,255,255,0)"/>
    <n-form-item :show-label="false" path="user.name">
      <n-transfer
          ref="transfer"
          v-model:value="apiAuthorizer"
          virtual-scroll
          :options="userList"
          filterable
      />
    </n-form-item>
    <template #footer>
      <div class="dialog-footer">
        <el-button color="#0099CB" @click="subAuth" >确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, h} from 'vue'
import axios from 'axios'
import {
  UserOutlined,
  ToTopOutlined,
  ProfileOutlined,
  VerticalAlignBottomOutlined
} from '@vicons/antd'
import {
  NButton,
  NSpace,
  useMessage,
  NTooltip,
  NIcon,
  NPopconfirm
} from 'naive-ui'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import moment from 'moment'
import CrudHeader from "@/components/cue/crud-header.vue";
import {ElButton} from "element-plus";
import {Search} from "@element-plus/icons-vue";
import CrudForm from "@/components/cue/crud-form.vue";
import CrudSplit from "@/components/cue/crud-split.vue";
import router from "@/router";
import CrudPage from "@/components/cue/crud-page.vue";
import utils from "@/utils";

hljs.registerLanguage('javascript', javascript)

const columns = ({ play }, { pub }, { auth }) => {
  return [
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
      title: 'ID',
      key: 'apiId',
      align: 'center',
      width: 250,
    },
    {
      title: '名称',
      key: 'apiName',
      align: 'center'
    },
    {
      title: '方式',
      key: 'apiMethod',
      width: 61,
      align: 'center'
    },
    {
      title: '路径',
      key: 'apiPath',
      align: 'center',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '状态',
      key: 'apiStatus',
      width: 66,
      align: 'center'
    },
    {
      title: 'API类型',
      key: 'apiFlag',
      width: 80,
      align: 'center'
    },
    {
      title: '创建时间',
      key: 'apiCreateTime',
      align: 'center'
    },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      width: 132,
      render(row) {
        return h(NSpace, {justify: "center"}, {
          default: () => [
            h(NTooltip, {}, {trigger: () =>
                  h(NButton, {circle: true, type: row.apiAuthorizer === null ? 'warning' : 'info', size: 'small', class: 'edit', onClick: () => {auth(row)}}, {icon: () =>
                        h(NIcon, null, { default: () => h(UserOutlined) })}
                  ), default: () => '授权'}
            ),
            h(NTooltip, {}, {trigger: () =>
                  h(NButton, {circle: true, type: 'info', size: 'small', class: 'edit', onClick: () => {play(row)}}, {icon: () =>
                        h(NIcon, null, { default: () => h(ProfileOutlined) })}
                  ), default: () => '查看'}
            ),
            h(NPopconfirm, {onPositiveClick: () => {pub(row)}}, {trigger: () =>
                  h(NTooltip, {}, {trigger: () =>
                        h(NButton, {disabled: row.apiAuthorizer === null, circle: true, type: row.apiStatus === '待发布' ? 'info' : 'warning', size: 'small', class: 'edit'}, {icon: () =>
                              h(NIcon, null, {
                                default: () => row.apiStatus === '待发布'
                                    ? h(ToTopOutlined)
                                    : h(VerticalAlignBottomOutlined)
                              })}
                        ), default: () =>
                        row.apiStatus === '待发布' ? '发布' : '下线'}
                  ), default: () =>
                  row.apiStatus === '待发布' ? '确定发布吗？' : '确定下线吗？'}
            )
          ]
        })
      }
    }
  ]
}
const TableData = reactive({
  apiList: [],
  totalNum: 0
})

const rowKey = (rowData) => {
  return rowData.apiId
}

const stateOptions = [
  {
    label: '接口开发',
    value: '1'
  },
  {
    label: '接口注册',
    value: '2'
  }
]
const statusOptions = [
  {
    label: '待发布',
    value: '0'
  },
  {
    label: '发布',
    value: '1'
  }
]

const getApiTreeUrl = utils.getUrl('interface/getApiTreeFloder')
const dataRef = ref([])
const loadingRef = ref(false)
const showModal = ref(false)
const drawTitle = ref('')
const drawId = ref('')
const userList = ref([])
const apiAuthorizer = ref([])
const apiAuthorizerName = ref('')
const folderData = ref([])
const actAuth = (row) => {
  showModal.value = true
  drawTitle.value = row.apiName
  drawId.value = row.apiId
  queryUser()
}
const message = useMessage()

const menuIcon = () => {
  return h('svg', {
    class: 'icon',
    viewBox: '0 0 1260 1024',
    xmlns: 'http://www.w3.org/2000/svg',
    width: '19.688',
    height: '16'
  }, [
    h('path', {
      d: 'M1171.561 157.538H601.797L570.814 61.44A88.222 88.222 0 00486.794 0H88.747A88.747 88.747 0 000 88.747v846.506A88.747 88.747 0 0088.747 1024H1171.56a88.747 88.747 0 0088.747-88.747V246.285a88.747 88.747 0 00-88.747-88.747zm-1082.814 0V88.747h398.047l22.055 68.791z',
      fill: '#0099CB'
    })
  ])
}

function queryUser() {
  const listUrl = utils.getUrl('interface/getUser')
  const authListUrl = utils.getUrl('interface/getAuthorizeInfo')
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
    'apiId': ''
  }
  authBody.apiId = drawId.value
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

function handlePageChange(currentPage, pageSize) {
  if (!loadingRef.value) {
    loadingRef.value = true
    paginationReactive.page = currentPage
    paginationReactive.pageSize = pageSize
    query(
        paginationReactive.page,
        paginationReactive.pageSize,
        paginationReactive.apiName,
        paginationReactive.apiFlag,
        paginationReactive.apiStatus,
        paginationReactive.apiPath,
        paginationReactive.apiTreeId
    ).then((data) => {
      dataRef.value = data.data
      dataRef.value.apiCreateTime = dataRef.value.forEach((item) => {
        let date = new Date(parseInt(item.apiCreateTime))
        item.apiCreateTime = moment(date).format('YYYY-MM-DD HH:mm:ss')
      })
      dataRef.value.apiStatus = dataRef.value.forEach((item) => {
        if (item.apiStatus === '-1') {
          item.apiStatus = '删除'
        }
        if (item.apiStatus === '0') {
          item.apiStatus = '待发布'
        }
        if (item.apiStatus === '1') {
          item.apiStatus = '发布'
        }
        if (item.apiStatus === '2') {
          item.apiStatus = '有变更'
        }
        if (item.apiStatus === '3') {
          item.apiStatus = '禁用'
        }
      })
      dataRef.value.apiFlag = dataRef.value.forEach((item) => {
        if (item.apiFlag === 1) {
          item.apiFlag = '接口开发'
        }
        if (item.apiFlag === 2) {
          item.apiFlag = '接口注册'
        }
      })
      paginationReactive.page = currentPage
      paginationReactive.pageCount = data.pageCount
      paginationReactive.itemCount = data.total
      loadingRef.value = false
    })
  }
}

function query(page, pageSize = 30, apiName = '', apiFlag = '', apiStatus = '', apiPath = '', apiTreeId = '') {
  return new Promise((resolve) => {
    const url = utils.getUrl('interface/getList')
    const params = {
      pageNum: page, 'pageSize': pageSize, 'apiName': apiName, 'apiFlag': apiFlag, 'apiStatus': apiStatus, 'apiPath': apiPath, 'apiTreeId': apiTreeId,
      order: 'api_create_time', 'sort': 'desc'
    }
    axios.post(url, params).then(function (response) {
      TableData.apiList = response.data.data
      TableData.totalNum = response.data.totalNum
      const copiedData = TableData.apiList.map((v) => v)
      const total = TableData.totalNum
      const pageCount = Math.ceil(total / pageSize)
      resolve({
        pageCount,
        data: copiedData,
        total
      })
    }).catch(function (error) {
      console.log(error)
    })
  })
}

function subAuth() {
  let subUrl = utils.getUrl('interface/insertAuthorizeInfo')
  let requestBody = {
    apiId: drawId.value,
    'authorizeId': apiAuthorizer.value
  }
  axios
      .post(subUrl, requestBody)
      .then(function (response) {
        message.info('授权成功')
        showModal.value = false
        handlePageChange(paginationReactive.page, paginationReactive.pageSize)
      })
      .catch(function (error) {
        message.info('授权失败,请联系管理员')
        console.log(error)
      })
}
const columnsRef = ref(
    columns(
        {
          play(row) {
            router.push({
                  name: 'api-detail',
                  state: {apiId: row.apiId, backName: 'api-manager'}
                }
            )
            }
        },
        {
          pub(row) {
            if (row.apiStatus === '待发布') {
              if (row.apiFlag === '接口开发') {
                let urlPub = utils.getUrl(`interface-ui/api/publish?id=${row.apiId}`)
                let pubPar = {
                  id: ''
                }
                pubPar.id = row.apiId
                axios.post(urlPub, pubPar).then(function (response) {
                  message.info(`成功发布 ${row.apiName}`)
                  handlePageChange(paginationReactive.page, paginationReactive.pageSize)
                }).catch(function (error) {
                  message.info('发布失败,请联系管理员')
                  console.log(error)
                })
              } else {
                let urlPub = utils.getUrl('interface/upAndDownLines')
                let pubPar = {
                  apiId: '',
                  apiStatus: 1
                }
                pubPar.apiId = row.apiId
                axios.post(urlPub, pubPar).then(function (response) {
                  message.info(`成功发布 ${row.apiName}`)
                  handlePageChange(paginationReactive.page, paginationReactive.pageSize)
                }).catch(function (error) {
                  message.info('发布失败,请联系管理员')
                  console.log(error)
                })
              }
            } else {
              let urlPub = utils.getUrl('interface/upAndDownLines')
              let pubPar = {
                apiId: '',
                apiStatus: 0
              }
              pubPar.apiId = row.apiId
              axios.post(urlPub, pubPar).then(function (response) {
                message.info(`成功下线 ${row.apiName}`)
                handlePageChange(paginationReactive.page, paginationReactive.pageSize)
              }).catch(function (error) {
                message.info('下线失败,请联系管理员')
                console.log(error)
              })
            }
          }
        },
        {
          auth(row) {
            actAuth(row)
          }
        }
    )
)
const paginationReactive = reactive({
  page: 1,
  pageCount: 1,
  pageSize: 30,
  apiName: '',
  apiFlag: null,
  apiStatus: null,
  apiPath: '',
  apiTreeId: '',
  itemCount: 0

})
function getTreeFolder ()  {
  axios.get(getApiTreeUrl).then((res) => {
    folderData.value = res.data.data
  })
}
onMounted(() => {
  getTreeFolder()
  handlePageChange(1, 30)
})
</script>

<style lang="scss" scoped>

</style>
