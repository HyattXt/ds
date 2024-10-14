<template>
  <CrudForm :width="'calc(100% - ' + (280 + 12) + 'px)'">
    <template v-slot:tree>
      <crudTree
        addButton
        @add-event="showAddRef = !showAddRef"
        :tree-folder="treeFolder"
        :folder-data="treeFolder"
        :show-spin="showSpin"
        :menuIcon="menuIcon"
        :nodeProps="nodeProps"
        :renderSuffix="renderSuffix"
        v-model:showUpdateRef="showUpdateRef"
        v-model:showAddRef="showAddRef"
        v-model:updateFormValue="updateFormValue"
        v-model:addFormValue="addFormValue"
        v-model:selectedMenu="selectedMenu"
        @update-menu="updateMenu"
        @create-menu="createMenu"
      />
    </template>
    <template v-slot:header>
      <CrudHeader
        title="API开发"
        addButton
        updateButton
        deleteButton
        :disableUpdate="ifDisableUpdate"
        :disableDelete="ifDisableDelete"
        @add-event="showModal = !showModal"
        @update-event="editMetadata(currentRow)"
        @delete-event="delConfirm"
      />
    </template>
    <template v-slot:condition>
      <el-form inline>
        <el-form-item label="名称">
          <el-input
            type="text"
            style="width: 180px"
            clearable
            v-model="paginationReactive.apiName"
          />
        </el-form-item>
        <el-form-item label="API类型">
          <el-select
            v-model="paginationReactive.apiFlag"
            clearable
            style="width: 180px"
            popper-class="form-item-select"
          >
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="API状态">
          <el-select
            v-model="paginationReactive.apiStatus"
            clearable
            style="width: 180px"
            popper-class="form-item-select"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="路径">
          <el-input
            type="text"
            style="width: 180px"
            clearable
            v-model="paginationReactive.apiPath"
          />
        </el-form-item>
      </el-form>
    </template>
    <template v-slot:query>
      <el-button
        color="#0099CB"
        class="cue-crud__header-query"
        type="primary"
        size="default"
        @click="handlePageChange(1, paginationReactive.pageSize)"
        >查询
      </el-button>
    </template>
    <template v-slot:table>
      <CrudTable
        :tableData="dataRef"
        :columnData="columns"
        :loadingRef="loadingRef"
        @current-change="handleCurrentChange"
      />
    </template>
    <template v-slot:page>
      <CrudPage
        :paginationReactive="paginationReactive"
        @page-change="handlePageChange"
      />
    </template>
  </CrudForm>
  <el-dialog v-model="active" :before-close="dialogVisible" :width="600">
    <template #header> API调试: {{ drawTitle }} </template>
    <crudSplit class="titleSplit" title="调试URL" />
    <n-input v-model:value="drawPath" style="margin: 10px 0 20px 0" />
    <crudSplit class="titleSplit" title="参数" />
    <n-table :single-line="false" size="small" style="margin: 10px 0 10px 0">
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
    <div
      style="display: flex; justify-content: space-between; align-items: center"
    >
      <n-button
        type="primary"
        color="#0099CB"
        style="margin-right: 10px"
        @click="debugApi"
        >开始调试</n-button
      >
      <div>返回时间：{{ executionTime }}毫秒</div>
    </div>
    <n-card title="调试结果" style="margin-top: 10px">
      <div>
        <n-scrollbar style="max-height: 300px; min-height: 100px">
          <n-config-provider :hljs="hljs">
            <n-code :code="code" language="javascript" />
          </n-config-provider>
        </n-scrollbar>
      </div>
    </n-card>
  </el-dialog>
  <el-dialog v-model="showModal" :width="700">
    <template #header> API新增 </template>
    <crudSplit class="titleSplit" title="选择API类型" />
    <n-data-table
      bordered
      :single-line="false"
      :columns="[
        { type: 'selection', multiple: false },
        { title: 'API类型', key: 'API类型' },
        { title: '描述', key: '描述' }
      ]"
      :data="[
        {
          key: '自定义SQL',
          API类型: '自定义SQL',
          描述: '支持编写自定义查询SQL,直接查询数据源数据，生成数据服务API'
        },
        {
          key: '注册API',
          API类型: '注册API',
          描述: '支持将已有Web服务注册到平台进行统一管理'
        }
      ]"
      @update:checked-row-keys="handleCheck"
      :default-checked-row-keys="['自定义SQL']"
      style="margin-top: 10px"
    />
    <template #footer>
      <n-button color="#0099CB" type="primary" size="small" @click="createApi"
        >确定</n-button
      >
    </template>
  </el-dialog>
</template>

<script setup>
  import { ref, reactive, onMounted, h } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  import { BoxPlotOutlined } from '@vicons/antd'
  import { NButton, useMessage, NIcon, NPopover } from 'naive-ui'
  import hljs from 'highlight.js/lib/core'
  import javascript from 'highlight.js/lib/languages/javascript'
  import moment from 'moment'
  import CrudTree from '@/components/cue/crud-tree.vue'
  import CrudTable from '@/components/cue/crud-table.vue'
  import { ElButton, ElMessageBox } from 'element-plus'
  import CrudSplit from '@/components/cue/crud-split.vue'
  import CrudForm from '@/components/cue/crud-form.vue'
  import CrudHeader from '@/components/cue/crud-header.vue'
  import CrudPage from '@/components/cue/crud-page.vue'
  import { PencilAlt, TrashAlt } from '@vicons/fa'
  import utils from '@/utils'

  hljs.registerLanguage('javascript', javascript)

  const columns = [
    {
      label: 'ID',
      prop: 'apiId'
    },
    {
      label: '名称',
      prop: 'apiName'
    },
    {
      label: '方式',
      prop: 'apiMethod',
      width: 61
    },
    {
      label: '路径',
      prop: 'apiPath'
    },
    {
      label: '状态',
      prop: 'apiStatus',
      width: 66
    },
    {
      label: 'API类型',
      prop: 'apiFlag',
      width: 80
    },
    {
      label: '已绑定资产运营',
      prop: 'addFlag',
      width: 120,
      slots: (row) => {
        return h('span',row.addFlag === 2 ? '否' : '是')
      }
    },
    {
      label: '创建时间',
      prop: 'apiCreateTime'
    },
    {
      label: '操作',
      prop: 'actions',
      width: 132,
      slots: (row) => {
        return h(
          ElButton,
          {
            class: 'el-button--text',
            size: 'small',
            onClick: () => activate(row)
          },
          { default: () => '调试' }
        )
      }
    }
  ]

  const TableData = reactive({
    apiList: [],
    totalNum: 0
  })

  function query(
    page,
    pageSize = 30,
    apiName = '',
    apiFlag = '',
    apiStatus = '',
    apiPath = '',
    apiTreeId = 1
  ) {
    return new Promise((resolve) => {
      const url = utils.getUrl('interface/getList')
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
          loadingRef.value = false
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

  const dataRef = ref([])
  const loadingRef = ref(false)
  const showSpin = ref(false)
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
  const currentRow = ref()
  const ifDisableDelete = ref(true)
  const ifDisableUpdate = ref(true)
  const startTime = ref(0)
  const executionTime = ref(0)
  const showModal = ref(false)
  const checkRow = ref(['自定义SQL'])
  const showUpdateRef = ref(false)
  const updateFormValue = ref({})
  const selectedMenu = ref(1)
  const addFormValue = ref({ titleName: '' })
  const getApiTreeUrl = utils.getUrl('interface/getApiTree')
  const addApiTreeUrl = utils.getUrl('interface/insertApiTree')
  const delApiTreeUrl = utils.getUrl('interface/deleteApiTree')
  const updateApiTreeUrl = utils.getUrl('interface/updateInterfaceFloderRename')
  const getApiFolderUrl = utils.getUrl('interface/getApiTreeFloder')
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
    paramList.value = Object.entries(drawParam.value).map(([key, value]) => ({
      key,
      value
    }))
  }
  const message = useMessage()

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
      label: '删除',
      value: '-1'
    },
    {
      label: '待发布',
      value: '0'
    },
    {
      label: '已发布',
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
  ]
  function getTreeFolder() {
    axios
      .get(getApiTreeUrl)
      .then((res) => {
        folderData.value = res.data.data
      })
      .catch(function (error) {
        console.log(error)
      })
  }
  function getApiFolder() {
    showSpin.value = true
    axios
      .get(getApiFolderUrl)
      .then((res) => {
        treeFolder.value = res.data.data
        showSpin.value = false
      })
      .catch(function (error) {
        console.log(error)
      })
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
          { default: () => h(BoxPlotOutlined) }
        )
    }
  }
  function nodeProps({ option }) {
    return {
      onClick() {
        paginationReactive.apiTreeId = option.id
        selectedMenu.value = option.id
        handlePageChange(1, paginationReactive.pageSize)
      },
      onContextmenu(e) {
        e.preventDefault()
      }
    }
  }
  function renderSuffix({ option }) {
    if (option.id === selectedMenu.value) {
      return h(
        NPopover,
        {
          trigger: 'hover',
          placement: 'bottom',
          style: { padding: 0, width: '100px' }
        },
        {
          trigger: () =>
            h(
              NButton,
              { text: true, type: 'primary', color: '#000' },
              { default: () => '┄' }
            ),
          default: () =>
            h('div', [
              h(
                'div',
                h(
                  NButton,
                  {
                    onClick: () => updateTree(option.id, option.parentId),
                    quaternary: true,
                    style: {
                      width: '100px',
                      'font-size': '12px',
                      'justify-content': 'left'
                    }
                  },
                  {
                    icon: () =>
                      h(NIcon, { text: true, size: '12' }, {default: () => h(PencilAlt)}),
                    default: () => '修改'
                  }
                )
              ),
              h(
                'div',
                h(
                  NButton,
                  {
                    onClick: () => delTreeConfirm(option.id, option.titleName),
                    disabled: option.children.length !== 0,
                    quaternary: true,
                    style: {
                      width: '100px',
                      'font-size': '12px',
                      'justify-content': 'left'
                    }
                  },
                  {
                    icon: () =>
                      h(NIcon, { text: true, size: '12' }, h(TrashAlt)),
                    default: () => '删除'
                  }
                )
              )
            ])
        }
      )
    }
  }

  function handleSelect(key, option) {
    if (option.key !== '删除') {
      showDropdownRef.value = false
      showAddRef.value = true
    }
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
        dataRef.value.forEach((item) => {
          let date = new Date(parseInt(item.apiCreateTime))
          item.apiCreateTime = moment(date).format('YYYY-MM-DD HH:mm:ss')
        })
        dataRef.value.forEach((item) => {
          if (item.apiStatus === '-1') {
            item.apiStatus = '删除'
          }
          if (item.apiStatus === '0') {
            item.apiStatus = '待发布'
          }
          if (item.apiStatus === '1') {
            item.apiStatus = '已发布'
          }
          if (item.apiStatus === '2') {
            item.apiStatus = '有变更'
          }
          if (item.apiStatus === '3') {
            item.apiStatus = '禁用'
          }
        })
        dataRef.value.forEach((item) => {
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
  }

  const delTreeConfirm = (id, titleName) => {
    ElMessageBox.confirm('您将删除' + titleName + '，是否继续？', '提示', {
      cancelButtonText: '取消',
      confirmButtonText: '确定'
    })
      .then(() => {
        delMenu(id)
      })
      .catch(() => {})
  }

  function updateTree(id, parentId) {
    showUpdateRef.value = true
    updateFormValue.value.id = id
    updateFormValue.value.parentId = parentId
  }

  function createApi() {
    if (checkRow.value[0] === '自定义SQL') {
      router.push({ path: '/service/api-dev-step' })
    } else {
      router.push({ path: '/service/api-register' })
    }
  }

  function handleCheck(rowKeys) {
    checkRow.value = rowKeys
  }

  const delConfirm = () => {
    ElMessageBox.confirm(
      '您将删除' + currentRow.value.apiName + '，是否继续？',
      '提示',
      {
        cancelButtonText: '取消',
        confirmButtonText: '确定'
      }
    )
      .then(() => {
        deleteApi(currentRow.value)
      })
      .catch(() => {})
  }

  function delMenu(id) {
    let params = {
      id: id
    }
    axios
      .post(delApiTreeUrl, params)
      .then((res) => {
        message.info(res.data.info)
        showDropdownRef.value = false
        getTreeFolder()
        getApiFolder()
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  function deleteApi(row) {
    let urlDel = utils.getUrl('interface/deleteByApiId')
    let delPar = {
      apiId: row.apiId
    }
    axios
      .post(urlDel, delPar)
      .then(function (response) {
        message.info(`成功删除 ${row.apiName}`)
        handlePageChange(paginationReactive.page, paginationReactive.pageSize)
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  function updateMenu(ruleFormRef) {
    let params = {
      id: updateFormValue.value.id,
      titleName: updateFormValue.value.titleName,
      parentId: updateFormValue.value.parentId
    }
    axios
      .post(updateApiTreeUrl, params)
      .then((res) => {
        message.info(res.data.info)
        showUpdateRef.value = false
        getApiFolder()
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  function createMenu() {
    let params = {
      parentId: selectedMenu.value,
      titleName: addFormValue.value.titleName,
      type: 1
    }
    axios
      .post(addApiTreeUrl, params)
      .then((res) => {
        message.info(res.data.info)
        showAddRef.value = false
        getTreeFolder()
        getApiFolder()
      })
      .catch(function (error) {
        console.log(error)
      })
    showDropdownRef.value = false
  }

  function dialogVisible() {
    active.value = false
    executionTime.value = 0
  }

  function handleCurrentChange(val) {
    currentRow.value = val
    if (currentRow.value && currentRow.value.apiStatus !== '已发布') {
      ifDisableUpdate.value = false
      ifDisableDelete.value = currentRow.value.addFlag !== 2
    } else {
      ifDisableDelete.value = true
      ifDisableUpdate.value = true
    }
  }

  function editMetadata(row) {
    if (row.apiFlag === '接口开发') {
      router.push({
        path: '/service/api-dev-step',
        query: { apiId: row.apiId }
      })
    } else {
      router.push({
        path: '/service/api-register',
        query: { apiId: row.apiId }
      })
    }
  }

  function debugApi() {
    let url = drawPath.value
    let list = paramList.value
    let requestBody = {}
    for (let i = 0; i < list.length; i++) {
      requestBody[list[i].key] = list[i].value
    }
    startTime.value = Date.now()
    if (url.indexOf('proxy') > 0) {
      let regUrl = utils.getUrl(url.replace('/proxy', '/debug/proxy'))
      if (drawMethod.value === 'GET') {
        axios
          .get(regUrl)
          .then(function (response) {
            code.value = JSON.stringify(response.data, null, 2)
            executionTime.value = Date.now() - startTime.value
            updateApiTimeConsuming(drawId.value, executionTime.value)
          })
          .catch(function (error) {
            code.value = JSON.stringify(error, null, 2)
            console.log(error)
          })
      } else {
        axios
          .post(regUrl, requestBody)
          .then(function (response) {
            code.value = JSON.stringify(response.data, null, 2)
            executionTime.value = Date.now() - startTime.value
            updateApiTimeConsuming(drawId.value, executionTime.value)
          })
          .catch(function (error) {
            code.value = JSON.stringify(error, null, 2)
            console.log(error)
          })
      }
    } else {
      let sqlUrl = utils.getUrl('interface-ui/api/perform?id=' + drawId.value)
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
          executionTime.value = response.data.executionTime
          updateApiTimeConsuming(drawId.value, executionTime.value)
        })
        .catch(function (error) {
          code.value = JSON.stringify(error, null, 2)
          console.log(error)
        })
    }
  }

  function updateApiTimeConsuming(id, executeTime) {
    let url = utils.getUrl('interface/updateApiTimeConsuming')
    let param = {
      apiId: id,
      apiTimeConsuming: executeTime
    }
    axios
      .post(url, param)
      .then(function (response) {})
      .catch(function (error) {
        console.log(error)
      })
  }

  const paginationReactive = reactive({
    page: 1,
    pageCount: 1,
    pageSize: 10,
    apiName: '',
    apiFlag: null,
    apiStatus: null,
    apiPath: '',
    apiTreeId: '',
    itemCount: 0
  })
  onMounted(() => {
    getTreeFolder()
    getApiFolder()
    handlePageChange(1, 30)
  })
</script>

<style scoped>
  .titleSplit {
    background: white !important;
    font-size: 14px !important;
    padding: 0 !important;
  }

  a {
    text-decoration: none;
  }
</style>
