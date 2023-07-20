<template>
  <n-space vertical>
    <n-card size="small">
      <n-space justify="space-between" style="height: 40px">
        <n-button type="primary" @click="showModal = true"> 新建服务</n-button>
        <n-modal v-model:show="showModal">
          <n-card
              style="width: 700px"
              title="选择API类型"
              aria-modal="true"
              size="huge"
          >
            <n-space vertical>
              <n-space inline>
                <router-link to="/service/api-dev-step">
                  <n-button strong type="info"> 自定义API </n-button>
                </router-link>
                <n-gradient-text :size="18">
                  支持通过自定义SQL方式发布数据服务API
                </n-gradient-text>
              </n-space>
              <n-space inline>
                <router-link to="/service/api-register">
                  <n-button strong type="info"> 注册API </n-button>
                </router-link>
                <n-gradient-text :size="18">
                  支持将已有Web服务注册到平台进行统一管理
                </n-gradient-text>
              </n-space>
            </n-space>
          </n-card>
        </n-modal>
        <n-form ref="formRef" :model="pagination">
          <n-grid :cols="26" :x-gap="12">
            <n-form-item-gi
                :span="6"
                :show-label="false"
                path="pagination.apiName"
            >
              <n-input
                  v-model:value="pagination.apiName"
                  size="small"
                  placeholder="名称"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="6" :show-label="false">
              <n-select
                  v-model:value="pagination.apiFlag"
                  size="small"
                  :options="stateOptions"
                  clearable
                  placeholder="API类型"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="6" :show-label="false">
              <n-select
                  v-model:value="pagination.apiStatus"
                  size="small"
                  :options="statusOptions"
                  clearable
                  placeholder="API状态"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="6" :show-label="false">
              <n-input
                  v-model:value="pagination.apiPath"
                  size="small"
                  placeholder="路径"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="2" :show-label="false">
              <n-button
                  size="small"
                  type="primary"
                  @click="handlePageChange(1)"
              >
                <NIcon :component="SearchOutlined"></NIcon>
              </n-button>
            </n-form-item-gi>
          </n-grid>
        </n-form>
      </n-space>
    </n-card>
    <n-card>
      <n-grid x-gap="2" :cols="6">
        <n-gi span="1">
          <n-card size="small" class="container">
            <n-tree
                block-line
                show-irrelevant-nodes
                :data="folderData"
                key-field="id"
                label-field="titleName"
                children-field="children"
                :render-prefix="menuIcon"
                :nodeProps="nodeProps"
            />
          </n-card>
        </n-gi>
        <n-gi span="5">
          <n-data-table
              ref="table"
              remote
              :columns="columns"
              :data="data"
              :loading="loading"
              :pagination="pagination"
              :row-key="rowKey"
              @update:page="handlePageChange"
          />
        </n-gi>
      </n-grid>
    </n-card>
  </n-space>
  <n-drawer v-model:show="active" :width="602">
    <n-drawer-content closable>
      <template #header> API调试: {{ drawTitle }} </template>
      <n-form-item label="调试url" path="apiIpaddr">
        <n-input v-model:value="drawPath" />
      </n-form-item>
      <n-card title="body参数" size="small">
        <n-table :single-line="false" size="small">
          <thead>
          <tr>
            <th>参数名称</th>
            <th>参数值</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in paramList">
            <td>{{ item.key }}</td>
            <n-input v-model:value="item.value" size="large"></n-input>
          </tr>
          </tbody>
        </n-table>
      </n-card>
      <n-button type="primary" style="margin-top: 10px" @click="debugApi"
      >开始调试</n-button
      >
      <n-card title="调试结果" style="margin-top: 10px">
        <div>
          <n-scrollbar style="max-height: 300px">
            <n-config-provider :hljs="hljs">
              <n-code :code="code" language="javascript" />
            </n-config-provider>
          </n-scrollbar>
        </div>
      </n-card>
    </n-drawer-content>
  </n-drawer>
  <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="xRef"
      :y="yRef"
      :options="dropdownOption"
      :show="showDropdownRef"
      :on-clickoutside="onClickOutside"
      :on-select="handleSelect"
      :render-option="dropdownConfirm"
  />
  <n-modal
      v-model:show="showAddRef"
      class="menuModal"
  >
    <n-card title="新建文件夹" size="huge">
      <n-form
          ref="formRef2"
          label-placement="left"
          label-width="auto"
          :rules="rules"
          :model="formValue"
      >
        <n-form-item label="文件夹名称" path="titleName">
          <n-input
              type="text"
              v-model:value="formValue.titleName"
              placeholder="输入文件夹名称"
          />
        </n-form-item>
        <n-form-item label="目标文件夹" path="inputValue">
          <n-tree-select
              :options="treeFolder"
              key-field="id"
              label-field="titleName"
              v-model:value="selectedMenu"
              filterable
          />
        </n-form-item>
      </n-form>
      <n-space justify="end">
        <n-button type="info" :on-click="createMenu" >确定</n-button>
      </n-space>
    </n-card>
  </n-modal>
</template>

<script>
import {defineComponent, ref, reactive, onMounted, h, nextTick} from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  CodeOutlined,
  BoxPlotOutlined
} from '@vicons/antd'
import {
  NButton,
  NSpace,
  useMessage,
  NPopconfirm,
  NTooltip,
  NIcon
} from 'naive-ui'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import moment from 'moment'

hljs.registerLanguage('javascript', javascript)

const columns = ({ play }, { del }, { editApi }) => {
  return [
    {
      title: 'ID',
      key: 'apiId'
    },
    {
      title: '名称',
      key: 'apiName'
    },
    {
      title: '方式',
      key: 'apiMethod',
      width: 61
    },
    {
      title: '路径',
      key: 'apiPath'
    },
    {
      title: '状态',
      key: 'apiStatus',
      width: 66
    },
    {
      title: 'API类型',
      key: 'apiFlag',
      width: 80
    },
    {
      title: '创建时间',
      key: 'apiCreateTime'
    },
    {
      title: '操作',
      key: 'actions',
      width: 132,
      render(row) {
        return h(NSpace, null, {
          default: () => [
            h(
                NTooltip,
                {},
                {
                  trigger: () =>
                      h(
                          NButton,
                          {
                            circle: true,
                            type: 'info',
                            size: 'small',
                            class: 'edit',
                            onClick: () => {
                              play(row)
                            }
                          },
                          {
                            icon: () =>
                                h(NIcon, null, { default: () => h(CodeOutlined) })
                          }
                      ),
                  default: () => '调试'
                }
            ),
            h(
                NTooltip,
                {},
                {
                  trigger: () =>
                      h(
                          NButton,
                          {
                            disabled: row.apiStatus === '发布',
                            circle: true,
                            type: 'info',
                            size: 'small',
                            class: 'edit',
                            onClick: () => {
                              editApi(row)
                            }
                          },
                          {
                            icon: () =>
                                h(NIcon, null, { default: () => h(EditOutlined) })
                          }
                      ),
                  default: () => '编辑'
                }
            ),
            h(
                NPopconfirm,
                {
                  onPositiveClick: () => {
                    del(row)
                  }
                },
                {
                  trigger: () =>
                      h(
                          NTooltip,
                          {},
                          {
                            trigger: () =>
                                h(
                                    NButton,
                                    {
                                      disabled: row.apiStatus === '发布',
                                      circle: true,
                                      type: 'error',
                                      size: 'small',
                                      class: 'delete'
                                    },
                                    {
                                      icon: () =>
                                          h(NIcon, null, {
                                            default: () => h(DeleteOutlined)
                                          })
                                    }
                                ),
                            default: () => '删除'
                          }
                      ),
                  default: () => '确定删除吗？'
                }
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

function query(
    page,
    pageSize = 10,
    apiName = '',
    apiFlag = '',
    apiStatus = '',
    apiPath = '',
    apiTreeId= 1
) {
  return new Promise((resolve) => {
    const url = import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/interface/getList'
        : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/interface/getList'
    const params = {
      pageNum: page,
      pageSize: pageSize,
      apiName: apiName,
      apiFlag: apiFlag,
      apiStatus: apiStatus,
      apiPath: apiPath,
      apiTreeId: apiTreeId,
      order: 'api_create_time',
      sort: 'desc'
    }

    axios
        .post(url, params)
        .then(function (response) {

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
        })
        .catch(function (error) {
          console.log(error)
        })
  })
}

export default defineComponent({
  setup() {
    const formRef2 = ref(null)
    const dataRef = ref([])
    const loadingRef = ref(true)
    const active = ref(false)
    const drawTitle = ref('')
    const drawPath = ref('')
    const drawParam = ref({})
    const drawId = ref('')
    const drawScript = ref('')
    const drawMethod = ref('')
    const paramList = ref([])
    const code = ref('')
    const folderData = ref([])
    const treeFolder = ref([])
    const showDropdownRef = ref(false)
    const showAddRef = ref(false)
    const xRef = ref(0)
    const yRef = ref(0)
    const dropdownOption = ref([{label: '添加', key: '添加'},{label: '删除', key: '删除'}])
    const selectedMenu = ref(1)
    const formValue = ref({ titleName: '' })
    const getApiTreeUrl = import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/interface/getApiTree'
        : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/interface/getApiTree'
    const addApiTreeUrl = import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/interface/insertApiTree'
        : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/interface/insertApiTree'
    const delApiTreeUrl = import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/interface/deleteApiTree'
        : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/interface/deleteApiTree'
    const getApiFolderUrl = import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/interface/getApiTreeFloder'
        : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/interface/getApiTreeFloder'
    const router = useRouter()

    const rules = {
      titleName: {
        required: true,
        message: '请输入名称',
        trigger: 'blur'
      }
    }

    const activate = (row) => {
      code.value = ''
      active.value = true
      drawTitle.value = row.apiName
      drawPath.value = row.apiPath
      drawId.value = row.apiId
      drawScript.value = row.apiScript
      drawMethod.value = row.apiMethod
      drawParam.value = JSON.parse(row.apiSample)
      drawParam.value = JSON.parse(drawParam.value.requestBody)
      paramList.value = Object.entries(drawParam.value).map(
          ([key, value]) => ({
            key,
            value
          })
      )
    }
    const message = useMessage()

    function getTreeFolder ()  {
      axios.get(getApiTreeUrl).then((res) => {
        folderData.value = res.data.data
      })
    }

    function getApiFolder ()  {
      axios.get(getApiFolderUrl).then((res) => {
        treeFolder.value = res.data.data
      })
    }

    function menuIcon({ option }) {
      switch (option.type) {
        case 1 : return  h(NIcon, {
          color: '#1890ff'
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
        case 2 : return h(NIcon, {color: '#1890ff'}, { default: () => h(BoxPlotOutlined) })
      }
    }

    function nodeProps ({option}) {
      return {
        onClick() {
          paginationReactive.apiTreeId = option.id
          refresh(1)
        },
        onContextmenu (e)  {
          e.preventDefault()
          selectedMenu.value = option.id
          if(option.children.length !== 0) {
            dropdownOption.value = [{label: '添加', key: '添加'},{label: '删除', key: '删除', disabled: true}]
          }else {
            dropdownOption.value = [{label: '添加', key: '添加'},{label: '删除', key: '删除'}]
          }

          nextTick().then(() => {
            showDropdownRef.value = true
            xRef.value = e.clientX
            yRef.value = e.clientY
          })
        }
      };
    }

    function  onClickOutside () {
      showDropdownRef.value = false
    }
    function handleSelect (key, option) {
      if(option.key !== '删除') {
        showDropdownRef.value = false
        showAddRef.value = true
      }
    }

    const dropdownConfirm = ({ node, option }) => {
      if (option.key !== '删除' || option.disabled ) {
        return node
      }else{
        return h(
            NPopconfirm,
            {
              onPositiveClick: () => {
                delMenu(selectedMenu.value)
              }},
            {
              trigger: () => [node],
              default: () => '确定'+option.label+'?'
            }
        )
      }
    }

    function delMenu(id) {
      let params ={
        id: id,
      }
      axios.post(delApiTreeUrl, params).then((res) => {
        message.info(res.data.info)
        showDropdownRef.value = false
        getTreeFolder()
        getApiFolder()
      })
    }

    function createMenu() {
      formRef2.value.validate((errors) => {
        if (!errors) {
          let params ={
            parentId: selectedMenu.value,
            titleName: formValue.value.titleName,
            type:1
          }
          axios.post(addApiTreeUrl, params).then((res) => {
            message.info(res.data.info)
            showAddRef.value = false
            getTreeFolder()
            getApiFolder()
          })
          showDropdownRef.value = false
        } else {
          message.error('验证失败，请填写完整信息')
        }
      })

    }

    function refresh(currentPage) {
      query(
          currentPage,
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
      })
    }
    const columnsRef = ref(
        columns(
            {
              play(row) {
                activate(row)
              }
            },
            {
              del(row) {
                let urlDel = import.meta.env.MODE === 'development'
                    ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/interface/deleteByApiId'
                    : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/interface/deleteByApiId'
                let delPar = {
                  apiId: ''
                }
                delPar.apiId = row.apiId
                axios.post(urlDel, delPar).then(function (response) {

                  message.info(`成功删除 ${row.apiName}`)
                  refresh(paginationReactive.page)
                })
              }
            },
            {
              editApi(row) {
                if (row.apiFlag === '接口开发') {
                  router.push({
                    path: '/service/api-dev-step-edit',
                    query: { apiId: row.apiId }
                  })
                } else {
                  router.push({
                    path: '/service/api-register-edit',
                    query: { apiId: row.apiId }
                  })
                }
                message.info(`编辑 ${row.apiName}`)
              }
            }
        )
    )
    const paginationReactive = reactive({
      page: 1,
      pageCount: 1,
      pageSize: 10,
      apiName: '',
      apiFlag: null,
      apiStatus: null,
      apiPath: '',
      apiTreeId: '',
      prefix({ itemCount }) {
        return `共${itemCount}条`
      }
    })

    onMounted(() => {
      getTreeFolder()
      getApiFolder()
      query(
          paginationReactive.page,
          paginationReactive.pageSize,
          paginationReactive.apiName,
          paginationReactive.apiFlag,
          paginationReactive.apiStatus,
          paginationReactive.apiPath,
          paginationReactive.apiTreeId,
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
        paginationReactive.pageCount = data.pageCount
        paginationReactive.itemCount = data.total
        loadingRef.value = false
      })
    })

    return {
      data: dataRef,
      columns: columnsRef,
      folderData,
      treeFolder,
      menuIcon,
      nodeProps,
      showDropdownRef,
      xRef,
      yRef,
      dropdownOption,
      onClickOutside,
      handleSelect,
      dropdownConfirm,
      selectedMenu,
      showAddRef,
      formValue,
      formRef2,
      createMenu,
      rules,
      pagination: paginationReactive,
      loading: loadingRef,
      SearchOutlined,
      showModal: ref(false),
      active,
      activate,
      drawParam,
      drawId,
      paramList,
      drawPath,
      drawTitle,
      drawScript,
      drawMethod,
      rowKey(rowData) {
        return rowData.apiId
      },
      code,
      hljs,
      stateOptions: [
        {
          label: '接口开发',
          value: '1'
        },
        {
          label: '接口注册',
          value: '2'
        }
      ],
      statusOptions: [
        {
          label: '删除',
          value: '-1'
        },
        {
          label: '待发布',
          value: '0'
        },
        {
          label: '发布',
          value: '1'
        },
        {
          label: '有变更',
          value: '2'
        },
        {
          label: '禁用',
          value: '3'
        }
      ],
      handlePageChange(currentPage) {
        if (!loadingRef.value) {
          loadingRef.value = true
          query(
              currentPage,
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
      },
      debugApi() {
        let url = drawPath.value
        let list = paramList.value
        let requestBody = {}
        for (let i = 0; i < list.length; i++) {
          requestBody[list[i].key] = list[i].value
        }
        if (url.indexOf('proxy') > 0) {
          if (drawMethod.value === 'GET') {
            let regUrl = import.meta.env.MODE === 'development'
                ? import.meta.env.VITE_APP_DEV_API_URL+url.replace('/proxy', '/debug/proxy')
                : window.webConfig.VITE_APP_PROD_API_URL+url.replace('/proxy', '/debug/proxy')


            axios
                .get(regUrl)
                .then(function (response) {

                  code.value = JSON.stringify(response.data, null, 2)
                })
                .catch(function (error) {
                  code.value = JSON.stringify(error, null, 2)
                  console.log(error)
                })
          } else {
            let regUrl = import.meta.env.MODE === 'development'
                ? import.meta.env.VITE_APP_DEV_API_URL+url.replace('/proxy', '/debug/proxy')
                : window.webConfig.VITE_APP_PROD_API_URL+url.replace('/proxy', '/debug/proxy')


            axios
                .post(regUrl, requestBody)
                .then(function (response) {

                  code.value = JSON.stringify(response.data, null, 2)
                })
                .catch(function (error) {
                  code.value = JSON.stringify(error, null, 2)
                  console.log(error)
                })
          }
        } else {
          let sqlUrl = import.meta.env.MODE === 'development'
              ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/interface-ui/api/perform?id=' + drawId.value
              : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/interface-ui/api/perform?id=' + drawId.value
          let sqlBody = {
            id: drawId.value,
            select: 'POST',
            apiPath: drawPath.value,
            codeType: 'SQL',
            codeValue: drawScript.value,
            requestBody: requestBody,
            optionInfo: {
              resultStructure: true,
              responseFormat:
                  '{\n "success" : "@resultStatus",\n "message" : "@resultMessage",\n "code" : "@resultCode",\n "lifeCycleTime": "@timeLifeCycle",\n "executionTime": "@timeExecution",\n "value" : "@resultData"\n}'
            }
          }
          axios
              .post(sqlUrl, sqlBody)
              .then(function (response) {

                code.value = JSON.stringify(response.data, null, 2)
              })
              .catch(function (error) {
                code.value = JSON.stringify(error, null, 2)
                console.log(error)
              })
        }
      }
    }
  }
})
</script>

<style scoped>
a {
  text-decoration: none;
}
.n-gradient-text {
  color: #555555;
}
.container {
  width: 100%;
  min-height: calc(100vh - 230px);
  height: 100%;
  overflow: auto;
  white-space: nowrap
}

.container::-webkit-scrollbar {
  /*滚动条整体样式*/
  width : 10px;  /*高宽分别对应横竖滚动条的尺寸*/
  height: 5px;
}
.container::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
  background   : #b9b9b9;
}
.container::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background   : #ededed;
}

.menuModal {
  width: 600px;
  height: 250px;
}

</style>
