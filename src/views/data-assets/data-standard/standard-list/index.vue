<template>
  <CrudForm :width="'calc(100% - ' + (280+12) + 'px)'">
    <template v-slot:tree>
      <crudTree
          addButton
          @add-event="showAddRef=!showAddRef"
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
          title="标准列表"
          addButton updateButton deleteButton
          :disableUpdate="!currentRow"
          :disableDelete="ifDisableDelete"
          @add-event="addMetadata" @update-event="editMetadata" @delete-event="delConfirm"
      />
    </template>
    <template v-slot:condition>
      <el-form inline>
        <el-form-item label="名称">
          <el-input type="text" style="width: 180px" clearable v-model="paginationReactive.apiName"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
              v-model="paginationReactive.releaseStatus"
              clearable
              style="width: 180px"
              popper-class="form-item-select"
          >
            <el-option label="已发布" :value="1"/>
            <el-option label="未发布" :value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item label="时间" class="el-line-height">
          <NDatePicker
              size='small'
              type='datetimerange'
              clearable
              v-model:value="createDate"
              @update:value="handleDate"
          />
        </el-form-item>
      </el-form>
    </template>
    <template v-slot:query>
      <el-button color="#0099CB" class="cue-crud__header-query" type="primary" size="default"
                 :icon="Search" @click="handlePageChange(1, paginationReactive.pageSize)" >查询
      </el-button>
    </template>
    <template v-slot:table>
      <CrudTable
          :tableData="tableData"
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
  <el-dialog :before-close="metaDialogVisible" v-model="active" append-to-body class="model-form-wrapper">
    <template #header> {{ indexFormValue.opperate }} </template>
    <n-form
        :size="'small'"
        :model='indexFormValue'
        label-placement="left"
        require-mark-placement="left"
        :label-width="110"
        ref="formRef"
        :rules="rules"
        :disabled="ifUpdate"
    >
      <n-form-item label="数据元目录:" path="treeId">
        <n-tree-select
            v-model:value="indexFormValue.treeId"
            :options="treeFolder"
            key-field="id"
            label-field="titleName"
            children-field="children"
            placeholder="选择目标指标目录"
            :render-prefix="menuIcon"
        />
      </n-form-item>
      <n-grid :cols="24" :x-gap="24">
        <n-form-item-gi :span="12" label="中文名称:" path="chineseName">
          <n-input v-model:value="indexFormValue.chineseName" :disabled="ifNameUpdate"/>
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="数据类型:" path="dataType">
          <n-select v-model:value="indexFormValue.dataType" :options="dataTypeOptions" clearable />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="英文名称:" path="englishName">
          <n-input v-model:value="indexFormValue.englishName" :disabled="ifNameUpdate"/>
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="字段类型:" path="dataTypeEn">
          <n-select v-model:value="indexFormValue.dataTypeEn" :options="typeOptions" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="数据定义:" path="dataDefinition">
          <n-input v-model:value="indexFormValue.dataDefinition" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="数据元分类:" path="dataElementClass">
          <n-input v-model:value="indexFormValue.dataElementClass" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="数据元别名:" path="dataElementAlias">
          <n-input v-model:value="indexFormValue.dataElementAlias" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="数据元口径:" path="dataElementCaliber">
          <n-input v-model:value="indexFormValue.dataElementCaliber" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="更新频率:" path="updateFrequency">
          <n-input v-model:value="indexFormValue.updateFrequency" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="单位:" path="company">
          <n-input v-model:value="indexFormValue.company" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="数据元维度:" path="dataElementDimension">
          <n-input v-model:value="indexFormValue.dataElementDimension" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="数据元版本:" path="dataElementVersion">
          <n-input v-model:value="indexFormValue.dataElementVersion" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="数据元来源表:" path="dataElementSourceTable">
          <n-input v-model:value="indexFormValue.dataElementSourceTable" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="数据元创建人:" path="dataElementCreator">
          <n-input v-model:value="indexFormValue.dataElementCreator" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="数据元维护人:" path="dataElementMaintainer">
        <n-input v-model:value="indexFormValue.dataElementMaintainer" />
      </n-form-item-gi>
        <n-form-item-gi :span="24" label="备注:" path="dataElementRemarks">
          <n-input v-model:value="indexFormValue.dataElementRemarks" type="textarea" />
        </n-form-item-gi>

      </n-grid>
    </n-form>
    <template #footer>
      <n-button color="#0099CB" type="primary" size="small"  @click="handleCreateDataElement">确定</n-button>
    </template>
  </el-dialog>
  <el-dialog
      v-model="approvalModalShow"
      width="600px"
  >
    <template #header> {{approvalForm.releaseState ? '上线' : '下线'}}审批 </template>
    <n-form ref="approvalFormRef" :rules="approveRule" :model="approvalForm">
      <n-form-item label="申请理由" label-placement="left" path="reasonForApplication">
        <n-input
            v-model:value="approvalForm.reasonForApplication"
            type="textarea"
        />
      </n-form-item>
    </n-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button color="#0099CB" @click="handleApprovalDefinition" >确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, reactive, onMounted, h} from 'vue'
import { useRouter } from 'vue-router'
import {BoxPlotOutlined} from '@vicons/antd'
import {
  NButton,
  useMessage,
  NIcon,
  NPopover, NGrid, NTag
} from 'naive-ui'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import CrudTree from "@/components/cue/crud-tree.vue";
import CrudTable from "@/components/cue/crud-table.vue";
import {ElButton, ElMessageBox, ElSwitch} from "element-plus";
import CrudForm from "@/components/cue/crud-form.vue";
import CrudHeader from "@/components/cue/crud-header.vue";
import CrudPage from "@/components/cue/crud-page.vue";
import {PencilAlt, TrashAlt} from "@vicons/fa";
import utils from "@/utils";
import {
  queryStandardTreeFolder,
  queryStandardList,
  updateStandardTreeFolder,
  createStandardTreeFolder,
  deleteStandardTreeFolder,
  releaseStandard,
  createDataElement,
  updateDataElement,
  deleteDataElement,
  queryElementByName,
  queryModelElementByName, queryModelDataType
} from "@/service/modules/data-standard";
import {Search} from "@element-plus/icons-vue";
import {insertApproval, queryApprovalConfig} from "@/service/modules/data-bussiness";

hljs.registerLanguage('javascript', javascript)

const formRef = ref(null)
const loadingRef = ref(false)
const showSpin = ref(false)
const active = ref(false)
const treeFolder = ref([])
const showDropdownRef = ref(false)
const showAddRef = ref(false)
const currentRow = ref()
const ifDisableDelete = ref(true)
const ifDisableUpdate = ref(true)
const ifUpdate = ref(false)
const ifNameUpdate = ref(false)
const operaOffSpan = ref(0)
const indexFormValue = ref({})
const approvalModalShow = ref(false)
const showUpdateRef = ref(false)
const updateFormValue = ref({})
const selectedMenu = ref(1)
const addFormValue = ref({ titleName: '' })
const approvalFormRef = ref()
const approvalForm = ref({
  objNum: 0,
  objName: '',
  approvalType: 6,
  approvalStatus: 2,
  releaseState: 1,
  reasonForApplication: ''
})
const tableData = ref([])
const createDate = ref(null)
const paginationReactive = reactive({
  page: 1,
  pageCount: 1,
  pageSize: 10,
  chineseName: '',
  startTime: '',
  endTime: '',
  apiTreeId: 1,
  itemCount: 0,
  releaseStatus: ''
})

const columns =  [
  {
    label: '中文名称',
    prop: 'chineseName'
  },
  {
    label: '英文名称',
    prop: 'englishName'
  },
  {
    label: '标准类型',
    prop: 'dataElementStandardType'
  },
  {
    label: '数据格式',
    prop: 'dataType'
  },
  {
    label: '字段格式',
    prop: 'dataTypeEn'
  },
  {
    label: '发布状态',
    prop: 'releaseStatus',
    width: 80,
    slots: (row) => {
      let approvalStatus
      let approvalColor
      switch (row.releaseStatus) {
        case 0: {approvalStatus = '未发布'; approvalColor = 'info'} break
        case 1: {approvalStatus = '已发布'; approvalColor = 'success'} break
        case 2: {approvalStatus = '审批中'; approvalColor = 'warning'} break
      }
      return h(
          NTag,
          {
            bordered: false,
            type: approvalColor,
            size: 'small',
          },
          { default: ()=> h("div",approvalStatus) }
      )
    }
  },
  {
    label: '添加人',
    prop: 'dataElementCreator',
    width: 100
  },
  {
    label: '添加日期',
    prop: 'dataElementAddDate',
  },
  {
    label: '更新日期',
    prop: 'dataElementUpdateDate'
  },
  {
    label: '操作',
    prop: 'actions',
    width: 100,
    slots: (row) => {
      return h(
          ElButton,
          {
            disabled: row.releaseStatus === 2,
            class: 'el-button--text',
            size: 'small',
            onClick: () => handleRelease(row)
          },
          { default: ()=> row.releaseStatus ? '下线' : '上线' }
      )
    }
  }
]

const dataTypeOptions = [
  {
    label: '字符型',
    value: '字符型'
  },
  {
    label: '数值型',
    value: '数值型'
  },
  {
    label: '日期型',
    value: '日期型'
  },
  {
    label: '日期时间型',
    value: '日期时间型'
  },
  {
    label: '时间型',
    value: '时间型'
  },
  {
    label: '布尔型',
    value: '布尔型'
  },
  {
    label: '二进制型',
    value: '二进制型'
  },
  {
    label: 'JSON型',
    value: 'JSON型'
  }
]

const rules = ref({
  chineseName: {
    required: true,
    message: '请输入名称',
    trigger: 'blur'
  },
  englishName: [
    {
      required: true,
      message: '请输入名称',
      trigger: 'blur'
    }
  ],
  dataType: {
    required: true,
    message: '请输入数据类型',
    trigger: 'blur'
  },
  dataTypeEn: {
    required: true,
    message: '请选择字段类型',
    trigger: 'blur'
  },
  dataDefinition: {
    required: true,
    message: '请输入数据定义',
    trigger: 'blur'
  },
  dataElementClass: {
    required: true,
    message: '请输入数据元分类',
    trigger: 'blur'
  },
  updateFrequency: {
    required: true,
    message: '请输入更新频率',
    trigger: 'blur'
  },
  dataElementVersion: {
    required: true,
    message: '请输入数据元版本',
    trigger: 'blur'
  },
  dataElementCreator: {
    required: true,
    message: '请输入创建人',
    trigger: 'blur'
  },
  dataElementMaintainer: {
    required: true,
    message: '请输入维护人',
    trigger: 'blur'
  }
})

const approveRule = {
  reasonForApplication: {
    required: true,
    message: '请输入理由',
    trigger: 'blur'
  }
}

const typeOptions = ref([
  {label: 'varchar', value: 'varchar'},
  {label: 'int', value: 'int'},
  {label: 'double', value: 'double'},
  {label: 'decimal', value: 'decimal'},
  {label: 'datetime', value: 'datetime'},
  {label: 'timestamp', value: 'timestamp'},
  {label: 'char', value: 'char'},
  {label: 'text', value: 'text'},
  {label: 'longtext', value: 'longtext'},
  {label: 'blob', value: 'blob'},
  {label: 'json', value: 'json'}
])

const message = useMessage()

const handleDate = () => {
  if(!!createDate.value) {
    paginationReactive.startTime = utils.formatTimestamp(createDate.value[0])
    paginationReactive.endTime = utils.formatTimestamp(createDate.value[1])
  } else {
    paginationReactive.startTime = paginationReactive.endTime = ''
  }
}

const handleRelease = async (row) => {
  let modelParam = {
    englishName: row.englishName,
  }
  await queryModelElementByName(modelParam)

  const approvalConfig = await queryApprovalConfig()
  if (approvalConfig[5].configurationStatus === 1) {
    approvalForm.value.reasonForApplication = ''
    approvalForm.value.objNum = row.id
    approvalForm.value.objName = row.chineseName
    approvalForm.value.releaseState = row.releaseStatus === 0 ? 1 : 0
    approvalModalShow.value = true
  } else {
    let param = {
      releaseStatus: !row.releaseStatus,
      id: row.id
    }
    await releaseStandard(param)
    await query(
        paginationReactive.chineseName,
        paginationReactive.page,
        paginationReactive.pageSize,
        paginationReactive.startTime,
        paginationReactive.endTime,
        paginationReactive.apiTreeId,
        paginationReactive.releaseStatus
    )
  }
}

const handleApprovalDefinition = () => {
  approvalFormRef.value.validate(async (errors) => {
    if (!errors) {
      await insertApproval(approvalForm.value)
      window.$message.success('提交成功')
      approvalModalShow.value = false
      await query(
          paginationReactive.chineseName,
          paginationReactive.page,
          paginationReactive.pageSize,
          paginationReactive.startTime,
          paginationReactive.endTime,
          paginationReactive.apiTreeId,
          paginationReactive.releaseStatus
      )
    } else {
      message.error('验证失败，请填写完整信息')
    }
  })

}

const handleCreateDataElement = () => {
  formRef.value.validate(async (errors) => {
    if (!errors) {
      let params = {...indexFormValue.value, dataElementStandardType: '基础数据标准'}
      indexFormValue.value.opperate === '新增' ? await createDataElement(params) : await updateDataElement(params)
      message.info('成功')
      metaDialogVisible()
      await query(
          paginationReactive.chineseName,
          paginationReactive.page,
          paginationReactive.pageSize,
          paginationReactive.startTime,
          paginationReactive.endTime,
          paginationReactive.apiTreeId,
          paginationReactive.releaseStatus
      )
    } else {
      message.error('验证失败，请填写完整信息')
    }
  })
}

async function query(
    chineseName,
    pageNum,
    pageSize,
    startTime,
    endTime,
    apiTreeId = 1,
    releaseStatus = ''
) {
  const params = {
    chineseName: chineseName,
    pageNum: pageNum,
    pageSize: pageSize,
    startTime: startTime,
    endTime: endTime,
    apiTreeId: apiTreeId,
    releaseStatus: releaseStatus
  }
  const data = await queryStandardList(params)
  tableData.value = data.totalList
  paginationReactive.itemCount = data.total
}

async function getTreeFolder ()  {
  showSpin.value = true
  treeFolder.value = await queryStandardTreeFolder({})
  showSpin.value = false
}

async function queryDataType() {
  const data = await queryModelDataType()
  if (data.dataWareType === 12) {
    typeOptions.value = [
      {label: 'VARCHAR', value: 'VARCHAR'},
      {label: 'INT', value: 'INT'},
      {label: 'DOUBLE', value: 'DOUBLE'},
      {label: 'DECIMAL', value: 'DECIMAL'},
      {label: 'TIMESTAMP', value: 'TIMESTAMP'},
      {label: 'CHAR', value: 'CHAR'},
      {label: 'CLOB', value: 'CLOB'}
    ]
  } else if (data.dataWareType === 2) {
    typeOptions.value = [
      {label: 'STRING', value: 'STRING'},
      {label: 'DECIMAL', value: 'DECIMAL'}
    ]
  }
}

function metaDialogVisible () {
  active.value = false
  formRef.value?.restoreValidation()
  Object.keys(indexFormValue.value).forEach(key => {
    indexFormValue.value[key] = ''; // 将表单的所有响应式属性设置为空字符串
  });
}

function menuIcon({ option }) {
  switch (option.type) {
    case 1 : return  h(NIcon, {
          color: '#0099CB'
        }, () =>
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
    )
    case 2 : return h(NIcon, {color: '#0099CB'}, { default: () => h(BoxPlotOutlined) })
  }
}
function nodeProps ({option}) {
  return {
    onClick() {
      paginationReactive.apiTreeId = option.id
      selectedMenu.value = option.id
      handlePageChange(1, paginationReactive.pageSize)
    },
    onContextmenu (e)  {
      e.preventDefault()
    }
  };
}
function renderSuffix({ option }) {
  if (option.id === selectedMenu.value) {
    return h(
        NPopover,
        {trigger: "hover", placement: "bottom", style: {padding: 0,width: '100px'}},
        {
          trigger: () =>
              h(
                  NButton,
                  { text: true, type: "primary", color: "#000" },
                  { default: () => "┄" }
              ),
          default: () =>
              h('div', [
                h('div', h(NButton, { onClick: () => updateTree(option.id, option.parentId), quaternary: true, style: {width: '100px', 'font-size': '12px', 'justify-content': 'left'}},{icon: () => h(NIcon,{ text: true ,size: '12'}, {default: () => h(PencilAlt)} ),default: () =>"修改"} )),
                h('div', h(NButton, { onClick: () => delTreeConfirm(option.id, option.titleName), disabled: option.children.length !== 0, quaternary: true, style: {width: '100px', 'font-size': '12px', 'justify-content': 'left'}},{icon: () => h(NIcon,{ text: true ,size: '12'}, {default: () => h(TrashAlt)} ),default: () =>"删除"} ))
              ])
        }
    )
  }
}

function handleSelect (key, option) {
  if(option.key !== '删除') {
    showDropdownRef.value = false
    showAddRef.value = true
  }
}

async function handlePageChange(currentPage, pageSize) {
  if (!loadingRef.value) {
    loadingRef.value = true
    paginationReactive.page = currentPage
    paginationReactive.pageSize = pageSize
    await query(
        paginationReactive.chineseName,
        paginationReactive.page,
        paginationReactive.pageSize,
        paginationReactive.startTime,
        paginationReactive.endTime,
        paginationReactive.apiTreeId,
        paginationReactive.releaseStatus
    )
    loadingRef.value = false
  }
}

const delTreeConfirm = (id, titleName) => {
  ElMessageBox.confirm(
      '您将删除' + titleName + '，是否继续？',
      '提示',
      {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      }
  )
      .then(() => {
        delMenu(id)
      })
      .catch(() => {
      })
}

function updateTree (id, parentId) {
  showUpdateRef.value = true
  updateFormValue.value.id = id
  updateFormValue.value.parentId = parentId
}

const delConfirm = () => {
  ElMessageBox.confirm(
      '您将删除' + currentRow.value.chineseName + '，是否继续？',
      '提示',
      {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      }
  )
      .then(() => {
        deleteApi(currentRow.value)
      })
      .catch(() => {
      })
}

async function delMenu(id) {
  let params = {
    id: id,
  }
  await deleteStandardTreeFolder(params)
  await getTreeFolder()
}

async function deleteApi(row) {
  let delPar = {
    id: row.id
  }
  await deleteDataElement(delPar)
  message.info('删除成功')
  await query(
      paginationReactive.chineseName,
      paginationReactive.page,
      paginationReactive.pageSize,
      paginationReactive.startTime,
      paginationReactive.endTime,
      paginationReactive.apiTreeId,
      paginationReactive.releaseStatus
  )
}

async function updateMenu(ruleFormRef) {
  let params = {
    id: updateFormValue.value.id,
    titleName: updateFormValue.value.titleName
  }
  await updateStandardTreeFolder(params)
  showUpdateRef.value = false
  await getTreeFolder()
}

async function createMenu() {
  let params = {
    projectCode: window.webConfig.VITE_APP_PROD_PROJECT_ID,
    parentId: selectedMenu.value,
    titleName: addFormValue.value.titleName,
    type: 1
  }
  await createStandardTreeFolder(params)
  showAddRef.value = false
  await getTreeFolder()
}

function handleCurrentChange(val) {
  currentRow.value = val
  if(currentRow.value && currentRow.value.releaseStatus === 0) {
    ifDisableUpdate.value = false
    ifDisableDelete.value = false
  } else {
    ifDisableDelete.value = true
    ifDisableUpdate.value = true
  }
}

function addMetadata() {
  ifUpdate.value = false
  ifNameUpdate.value = false
  operaOffSpan.value = 0
  indexFormValue.value = {}
  indexFormValue.value.treeId = paginationReactive.apiTreeId
  indexFormValue.value.opperate = '新增'
  rules.value.englishName[1] = {
    async validator(validator, value) {
      let param = {
        englishName: value
      }
      await queryElementByName(param)
    },
    trigger: 'blur'
  }
  active.value = true
}

function editMetadata() {
  indexFormValue.value = { ...currentRow.value }
  indexFormValue.value.treeId = Number(currentRow.value.treeId)
  ifNameUpdate.value = true
  currentRow.value.releaseStatus ? indexFormValue.value.opperate = '查看' : indexFormValue.value.opperate = '编辑'
  currentRow.value.releaseStatus ? ifUpdate.value = true : ifUpdate.value = false
  rules.value.englishName[1] = {}
  active.value = true
}

onMounted(() => {
  getTreeFolder()

  handlePageChange(1, 30)
  queryDataType()
})
</script>

<style lang="scss" scoped>

.el-line-height {
  :deep(.el-form-item__content) {
    line-height: 28px;
  }
}

</style>
