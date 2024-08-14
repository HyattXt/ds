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
            <div v-if="true" class="button-item" @click="showAddRef=!showAddRef" title="添加">
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
              :render-suffix="renderSuffix"
              :nodeProps="nodeProps"
          />
          </n-spin>
        </div>
      </div>
      <div class="cue-drag-layout__mainview" :style="{width: 'calc(100% - ' + (280 + 12) + 'px)'}">
        <div class="cue-crud cue-crud-v2">
          <CrudHead
              title="指标中心"
              addButton updateButton deleteButton
              :disableUpdate="!currentRow"
              :disableDelete="ifDisableDelete"
              @add-event="addMetadata" @update-event="editMetadata" @delete-event="delConfirm"
          />
          <div class="crud-v2-condition" >
            <div class="cue-crud__header-condition">
              <div class="cue-crud__header-content">
                <el-form inline>
                  <el-form-item label="编码/名称">
                    <el-input type="text" style="width: 180px" clearable v-model="paginationReactive.indicatorName"/>
                  </el-form-item>
                  <el-form-item label="创建人">
                    <el-input type="text" style="width: 180px" clearable v-model="paginationReactive.indicatorDefiner"/>
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
                <el-table v-loading="loadingRef" :data="dataRef" border resizable highlight-current-row height="100%" show-overflow-tooltip @current-change="handleCurrentChange">
                  <el-table-column type="index" fixed label="序号" width="50" align="center"/>
                  <el-table-column prop="indicatorCode" fixed label="指标编码" align="center"/>
                  <el-table-column prop="indicatorName" fixed label="指标名称" align="center"/>
                  <el-table-column prop="indexClassification" label="指标分类" align="center"/>
                  <el-table-column prop="timeDimension" label="时间维度" width="120" align="center"/>
                  <el-table-column prop="indicatorLatitude" label="指标维度" width="120" align="center"/>
                  <el-table-column prop="indicatorUnit" label="单位" width="120" align="center"/>
                  <el-table-column prop="indicatorTargetTable" label="数据服务表" width="120" align="center"/>
                  <el-table-column prop="updateFrequency" label="更新频率" width="120" align="center"/>
                  <el-table-column prop="indicatorManager" label="指标管理者" width="120" align="center"/>
                  <el-table-column prop="indicatorLogic" label="指标逻辑" width="120" align="center"/>
                  <el-table-column prop="indicatorDefiner" label="创建人" width="120" align="center"/>
                  <el-table-column fixed="right" label="操作" width="120" align="center">
                    <template #default="scope">
                      <el-button class="el-button--text" size="small" @click="pubMetadata(scope.row)">
                        {{ scope.row.indicatorLabels !== '已上架' ? '上架' : '下架' }}
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
    <el-dialog
        v-model="showAddRef"
        :before-close="addDialogVisible"
        width="500px"
    >
      <template #header> 新建文件夹 </template>
      <el-form
          ref="ruleFormRef"
          :rules="rules"
          :model="formValue"
      >
        <el-form-item required label="文件夹名称" prop="titleName">
          <el-input type="text" style="width: 240px" v-model="formValue.titleName"/>
        </el-form-item>
        <el-form-item required style="padding-top: 20px" label="目标文件夹">
          <el-tree-select
              :data="treeFolder"
              node-key="id"
              :props="folderProps"
              v-model="selectedMenu"
              check-strictly
              style="width: 240px"
              popper-class="form-item-select"
              :render-content="renderContent"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button color="#0099CB" @click="createMenu(ruleFormRef)" >确定</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog :before-close="metaDialogVisible" v-model="active" append-to-body class="model-form-wrapper">
      <template #header> {{ indexFormValue.opperate }} </template>
        <n-form
            :size="'small'"
            :model='indexFormValue'
            label-placement="left"
            require-mark-placement="left"
            :label-width="100"
            ref="formRef"
            :rules="rules"
        >
          <n-form-item label="指标目录:" path="treeId">
            <n-tree-select
                v-model:value="indexFormValue.treeId"
                :options="treeFolder"
                key-field="id"
                label-field="titleName"
                children-field="children"
                placeholder="选择目标指标目录"
                :disabled="ifUpdate"
                :default-expanded-keys="[1]"
                :render-prefix="menuIcon"
            />
          </n-form-item>
          <n-grid :cols="24" :x-gap="24">
            <n-form-item-gi :span="12" label="指标名称:" path="indicatorName">
              <n-input v-model:value="indexFormValue.indicatorName" placeholder="请输入指标名称" :disabled="ifUpdate"/>
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="所属系统:" path="indicatorAffiliatedSys">
              <n-input v-model:value="indexFormValue.indicatorAffiliatedSys" placeholder="请输入所属系统" :disabled="ifUpdate"/>
            </n-form-item-gi>
          </n-grid>
          <n-grid :cols="24" :x-gap="24">
            <n-form-item-gi :span="12" label="指标编码:" path="indicatorCode">
              <n-input v-model:value="indexFormValue.indicatorCode" placeholder="请输入指标编码" :disabled="ifUpdate"/>
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="指标定义:" path="indicatorDefinition">
              <n-input v-model:value="indexFormValue.indicatorDefinition" placeholder="请输入指标定义" :disabled="ifUpdate"/>
            </n-form-item-gi>
          </n-grid>
          <n-grid :cols="24" :x-gap="24">
            <n-form-item-gi :span="12" label="指标分类:" path="indexClassification">
              <n-input v-model:value="indexFormValue.indexClassification" placeholder="请输入指标分类" :disabled="ifUpdate"/>
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="指标别名:" path="indicatorAlias">
              <n-input v-model:value="indexFormValue.indicatorAlias" placeholder="请输入指标别名" :disabled="ifUpdate"/>
            </n-form-item-gi>
          </n-grid>
          <n-grid :cols="24" :x-gap="24">
            <n-form-item-gi :span="12" label="指标口径:" path="indicatorCaliber">
              <n-input v-model:value="indexFormValue.indicatorCaliber" placeholder="请输入指标口径" :disabled="ifUpdate"/>
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="更新频率:" path="updateFrequency">
              <n-input v-model:value="indexFormValue.updateFrequency" placeholder="请输入更新频率" :disabled="ifUpdate"/>
            </n-form-item-gi>
          </n-grid>
          <n-grid :cols="24" :x-gap="24">
            <n-form-item-gi :span="12" label="单位:" path="indicatorUnit">
              <n-input v-model:value="indexFormValue.indicatorUnit" placeholder="请输入单位" :disabled="ifUpdate"/>
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="指标维度:" path="indicatorLatitude">
              <n-input v-model:value="indexFormValue.indicatorLatitude" placeholder="多个维度以 、隔开" :disabled="ifUpdate"/>
            </n-form-item-gi>
          </n-grid>
          <n-grid :cols="24" :x-gap="24">
            <n-form-item-gi :span="12" label="指标版本:" path="indicatorVersion">
              <n-input v-model:value="indexFormValue.indicatorVersion" placeholder="请输入指标版本" :disabled="ifUpdate"/>
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="指标来源表:" path="indicatorSourceTable">
              <n-input v-model:value="indexFormValue.indicatorSourceTable" placeholder="请输入指标版本(adm层)" :disabled="ifUpdate"/>
            </n-form-item-gi>
          </n-grid>
          <n-grid :cols="24" :x-gap="24">
            <n-form-item-gi :span="12" label="数据服务表:" path="indicatorTargetTable">
              <n-input v-model:value="indexFormValue.indicatorTargetTable" placeholder="请输入表名" :disabled="ifUpdate"/>
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="时间维度:" path="timeDimension">
              <n-select
                  v-model:value="indexFormValue.timeDimension"
                  size="small"
                  :options="timeDimensionOptions"
                  clearable
                  placeholder="请选择时间维度"
                  :disabled="ifUpdate"
              />
            </n-form-item-gi>
          </n-grid>
          <n-grid :cols="24" :x-gap="24">
            <n-form-item-gi :span="operaSpan" label="指标标签:" path="indicatorLabels">
              <n-select
                  v-model:value="indexFormValue.indicatorLabels"
                  size="small"
                  :options="indicatorLabelsOptions"
                  :disabled="true"
                  placeholder="请选择标签"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="12" label="指标管理者:" path="indicatorManager">
              <n-input v-model:value="indexFormValue.indicatorManager" placeholder="请输入指标管理者" :disabled="ifUpdate"/>
            </n-form-item-gi>
          </n-grid>
          <n-grid :cols="24" :x-gap="24">
            <n-form-item-gi :span="operaSpan" label="生效时间:">
              <n-input :disabled="true" v-model:value="indexFormValue.effectiveDate" />
            </n-form-item-gi>
            <n-form-item-gi :span="operaSpan" label="失效时间:">
              <n-input :disabled="true" v-model:value="indexFormValue.expiringDate" />
            </n-form-item-gi>
          </n-grid>
          <n-grid :cols="24" :x-gap="24">
            <n-form-item-gi :span="operaSpan" label="指标定义者:">
              <n-input :disabled="true" v-model:value="indexFormValue.indicatorDefiner" />
            </n-form-item-gi>
            <n-form-item-gi :span="operaSpan" label="指标维护人:">
              <n-input :disabled="true" v-model:value="indexFormValue.indicatorMaintainer" />
            </n-form-item-gi>
          </n-grid>
          <n-grid :cols="24" :x-gap="24">
            <n-form-item-gi :span="operaSpan" label="指标维护日期:">
              <n-input :disabled="true" v-model:value="indexFormValue.indicatorMaintenanceDate" />
            </n-form-item-gi>
          </n-grid>
          <n-grid :cols="12" :x-gap="24">
            <n-form-item-gi :span="operaOffSpan" label="指标下架原因:">
              <n-input type="textarea" :disabled="true" v-model:value="indexFormValue.indicatorRemovalInfo" />
            </n-form-item-gi>
          </n-grid>
          <n-form-item label="指标逻辑:" path="indicatorLogic">
            <n-input
                v-model:value="indexFormValue.indicatorLogic"
                placeholder="指标逻辑"
                type="textarea"
                :autosize="{
                  minRows: 3,
                  maxRows: 10
              }"
                :disabled="ifUpdate"
            />
          </n-form-item>
        </n-form>
        <template #footer>
          <n-button color="#0099CB" type="primary" size="small" :disabled="ifUpdate" @click="createIndex">确定</n-button>
        </template>
    </el-dialog>
    <el-dialog
        v-model="showUpdateRef"
        :before-close="updateDialogVisible"
        title="修改文件夹"
        width="500px"
    >
      <template #header> 修改文件夹 </template>
      <el-form
          ref="ruleFormRef"
          :rules="rules"
          :model="updateFormValue"
      >
        <el-form-item required label="文件夹名称" prop="titleName">
          <el-input type="text" style="width: 240px" v-model="updateFormValue.titleName"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button color="#0099CB" @click="updateMenu(ruleFormRef)" >确定</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
        v-model="showPubRef"
        width="600px"
    >
      <template #header> 指标下架 </template>
        <n-form
            ref="formRef"
            label-placement="left"
            require-mark-placement="left"
            label-width="auto"
            :rules="rules"
            :model="indexFormValue"
        >
          <n-form-item path="indicatorRemovalInfo">
            <n-input
                type="textarea"
                v-model:value="indexFormValue.indicatorRemovalInfo"
                placeholder="输入下架理由"
                :autosize="{
                  minRows: 3.5,
                  maxRows: 3.5
              }"
            />
          </n-form-item>
        </n-form>
        <n-space justify="end">
          <n-button color="#0099CB" type="info" style="height: 24px;font-size: 12px" :on-click="offIndex" >确定</n-button>
        </n-space>
    </el-dialog>
  </el-config-provider>
</template>

<script setup>
import { ref, reactive, onMounted, h, unref} from 'vue'
import axios from 'axios'
import {
  ApartmentOutlined,
  SearchOutlined,
  TableOutlined
} from '@vicons/antd'
import {
  NButton,
  NIcon,
  NSpace,
  useMessage,
  NGrid,
  NPopover
} from "naive-ui";
import { useUserStore } from '@/store/user/user'
import CrudHead from "@/components/cue/crud-header.vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import {Search} from "@element-plus/icons-vue";
import {ElMessageBox} from "element-plus";
import {CaretUp, CaretDown, PencilAlt, TrashAlt} from "@vicons/fa";
import {Add12Filled} from "@vicons/fluent";
import utils from '@/utils'

const TableData = reactive({
  tableList: [],
  totalNum: 0
})
const dataRef = ref([])
const formRef = ref(null)
const active = ref(false)
const loadingRef = ref(true)
const showSpin = ref(false)
const message = useMessage()
const treeFolder = ref([])
const selectedMenu = ref(1)
const showDropdownRef = ref(false)
const showPubRef = ref(false)
const showAddRef = ref(false)
const formValue = ref({})
const indexFormValue = ref({})
const operaSpan = ref(0)
const operaOffSpan = ref(0)
const ifUpdate = ref(false)
const expandedKeys = ref([1]);
const pattern = ref('');
const ruleFormRef = ref()
const currentRow = ref()
const ifDisableDelete = ref(true)
const showUpdateRef = ref(false)
const updateFormValue = ref({})
const getCatalogFolderUrl = utils.getUrl('HDataApi/indicatorCenter/getIndicatorCenterTreeFloder')
const addCatalogTreeUrl = utils.getUrl('HDataApi/indicatorCenter/insertIndicatorCenterTree')
const delCatalogTreeUrl = utils.getUrl('HDataApi/indicatorCenter/deleteIndicatorCenterTree')
const updateIndexTreeUrl = utils.getUrl('HDataApi/indicatorCenter/updateIndicatorCenterFloderRename')
const insertIndexUrl = utils.getUrl('HDataApi/indicatorCenter/insert')
const updateIndexUrl = utils.getUrl('HDataApi/indicatorCenter/update')
const deleteIndexUrl = utils.getUrl('HDataApi/indicatorCenter/delete')
const pubIndexUrl = utils.getUrl('HDataApi/indicatorCenter/indicatorOnline')
const offIndexUrl = utils.getUrl('HDataApi/indicatorCenter/indicatorOffline')
const userStore = useUserStore()
const userInfo = userStore.getUserInfo
const  folderProps = {
  children: 'children',
  label: 'titleName',
}
const timeDimensionOptions = [
  {
    label: '分钟',
    value: '1'
  },
  {
    label: '小时',
    value: '2'
  },
  {
    label: '天',
    value: '3'
  },
  {
    label: '周',
    value: '4'
  },
  {
    label: '月',
    value: '5'
  },
  {
    label: '年',
    value: '6'
  }
]
const indicatorLabelsOptions = [
  {
    label: '已共享',
    value: '1'
  },
  {
    label: '已下架',
    value: '2'
  },
  {
    label: '未上架',
    value: '3'
  },
  {
    label: '已上架',
    value: '4'
  }
]

const rules = reactive({
  titleName: {
    required: true,
    message: '请输入内容',
    trigger: 'blur'
  },
  indicatorName: {
    required: true,
    message: '请输入内容',
    trigger: 'blur'
  },
  indicatorAffiliatedSys: {
    required: true,
    message: '请输入内容',
    trigger: 'blur'
  },
  indicatorCode: {
    required: true,
    message: '请输入内容',
    trigger: 'blur'
  },
  indicatorDefinition: {
    required: true,
    message: '请输入内容',
    trigger: 'blur'
  },
  indicatorCaliber: {
    required: true,
    message: '请输入内容',
    trigger: 'blur'
  },
  updateFrequency: {
    required: true,
    message: '请输入内容',
    trigger: 'blur'
  },
  indicatorUnit: {
    required: true,
    message: '请输入内容',
    trigger: 'blur'
  },
  indicatorLatitude: {
    required: true,
    message: '请输入内容',
    trigger: 'blur'
  },
  indicatorVersion: {
    required: true,
    message: '请输入内容',
    trigger: 'blur'
  },
  indicatorSourceTable: {
    required: true,
    message: '请输入内容',
    trigger: 'blur'
  },
  indicatorTargetTable: {
    required: true,
    message: '请输入内容',
    trigger: 'blur'
  },
  timeDimension: {
    required: true,
    message: '请选择内容',
    trigger: 'blur'
  },
  indicatorManager: {
    required: true,
    message: '请输入内容',
    trigger: 'blur'
  },
  indicatorLogic: {
    required: true,
    message: '请输入内容',
    trigger: 'blur'
  },
  indicatorRemovalInfo: {
    required: true,
    message: '请输入内容',
    trigger: 'blur'
  }
})
const renderContent = (h, { data }) => {
  return h('div',{style: {display: 'flex', alignItems: 'center'}},[
    h('svg', {
      class: 'icon',
      viewBox: '0 0 1260 1024',
      xmlns: 'http://www.w3.org/2000/svg',
      width: '16',
      height: '16'
    }, [
      h('path', {
        d: 'M1171.561 157.538H601.797L570.814 61.44A88.222 88.222 0 00486.794 0H88.747A88.747 88.747 0 000 88.747v846.506A88.747 88.747 0 0088.747 1024H1171.56a88.747 88.747 0 0088.747-88.747V246.285a88.747 88.747 0 00-88.747-88.747zm-1082.814 0V88.747h398.047l22.055 68.791z',
        fill: '#0099CB'
      })
    ]),
    h(
        'span',
        {
          style: {
            'padding-left': '5px',
          },
        },
        data.titleName
    )
  ])
}
const paginationReactive = reactive({
  indicatorDefiner: '',
  assetName: '',
  page: 1,
  pageSize: 30,
  timeDimension: '',
  indicatorName: '',
  indicatorCode: '',
  indicatorTargetTable: '',
  indicatorLatitude: '',
  apiTreeId: 1,
  itemCount: 0
})
function query(
    indicatorDefiner,
    page,
    pageSize = 30,
    timeDimension = '',
    indicatorName = '',
    indicatorCode = '',
    indicatorTargetTable = '',
    indicatorLatitude = '',
    apiTreeId = 1
) {
  const url = utils.getUrl('HDataApi/indicatorCenter/getList')
  const params = {
    'indicatorDefiner': indicatorDefiner,
    'pageNum': page,
    'pageSize': pageSize,
    'indicatorName': indicatorName,
    'apiTreeId': apiTreeId
  }
  loadingRef.value = true
  axios
      .post(url, params)
      .then(function (response) {
        dataRef.value = []
        TableData.tableList = response.data.data
        TableData.totalNum = response.data.totalNum
        TableData.tableList.forEach((item) => {
          if (item.indicatorLabels === 1) {
            item.indicatorLabels = '已共享'
          }
          if (item.indicatorLabels === 2) {
            item.indicatorLabels = '已下架'
          }
          if (item.indicatorLabels === 3) {
            item.indicatorLabels = '未上架'
          }
          if (item.indicatorLabels === 4) {
            item.indicatorLabels = '已上架'
          }
        })
        TableData.tableList.forEach((item) => {
          if (item.timeDimension === '1') {
            item.timeDimension = '分钟'
          }
          if (item.timeDimension === '2') {
            item.timeDimension = '小时'
          }
          if (item.timeDimension === '3') {
            item.timeDimension = '天'
          }
          if (item.timeDimension === '4') {
            item.timeDimension = '周'
          }
          if (item.timeDimension === '5') {
            item.timeDimension = '月'
          }
          if (item.timeDimension === '6') {
            item.timeDimension = '年'
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
      selectedMenu.value = option.id
      handlePageChange(1, paginationReactive.pageSize)
    },
    onContextmenu (e)  {
      e.preventDefault()
    }
  }
}

function handleSelect (key, option) {
  if(option.key !== '删除') {
    showDropdownRef.value = false
    showAddRef.value = true
  }
}

function delMenu(id) {
  let params ={
    id: id,
  }
  axios.post(delCatalogTreeUrl, params).then((res) => {
    message.info(res.data.info)
    showDropdownRef.value = false
    getApiFolder()
  })
}
function createMenu(ruleFormRef) {
  ruleFormRef.validate((valid) => {
    if (valid) {
      let params ={
        parentId: selectedMenu.value,
        titleName: formValue.value.titleName,
        type:1
      }
      axios.post(addCatalogTreeUrl, params).then((res) => {
        message.info(res.data.info)
        showAddRef.value = false
        getApiFolder()
      })
      showDropdownRef.value = false
    } else {
      message.error('验证失败，请填写完整信息')
    }
  })
}
function addMetadata() {
  ifUpdate.value = false
  operaOffSpan.value = 0
  indexFormValue.value = {}
  indexFormValue.value.treeId = paginationReactive.apiTreeId
  indexFormValue.value.opperate = '新增'
  operaSpan.value = 0
  active.value = true
}
function updateMenu(ruleFormRef) {
  ruleFormRef.validate((valid) => {
    if (valid) {
      let params ={
        id: updateFormValue.value.id,
        titleName: updateFormValue.value.titleName,
        parentId: updateFormValue.value.parentId
      }
      axios.post(updateIndexTreeUrl, params).then((res) => {
        message.info(res.data.info)
        showUpdateRef.value = false
        getApiFolder()
      })
    } else {
      message.error('验证失败，请填写完整信息')
    }
  })
}
function editMetadata() {
  indexFormValue.value = { ...currentRow.value }
  indexFormValue.value.treeId = Number(currentRow.value.treeId)
  currentRow.value.indicatorLabels === '已上架' ? indexFormValue.value.opperate = '查看' : indexFormValue.value.opperate = '编辑'
  operaSpan.value = 12
  currentRow.value.indicatorLabels === '已下架' ? operaOffSpan.value = 12 : operaOffSpan.value = 0
  currentRow.value.indicatorLabels === '已上架' ? ifUpdate.value = true : ifUpdate.value = false
  active.value = true
}

function metaDialogVisible () {
  active.value = false
  formRef.value?.restoreValidation()
  Object.keys(indexFormValue.value).forEach(key => {
    indexFormValue.value[key] = ''; // 将表单的所有响应式属性设置为空字符串
  });
}

function addDialogVisible () {
  showAddRef.value = false
  ruleFormRef.value?.resetFields()
}

function updateDialogVisible () {
  showUpdateRef.value = false
  ruleFormRef.value?.resetFields()
}

function pubMetadata(row) {
  if(row.indicatorLabels !== '已上架')
  {
    pubIndex(row.id)
  } else {
    indexFormValue.value.indicatorRemovalInfo = null
    showPubRef.value = true
    indexFormValue.value.id = row.id
  }
}

const delConfirm = () => {
  ElMessageBox.confirm(
      '您将删除' + currentRow.value.indicatorName + '，是否继续？',
      '提示',
      {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      }
  )
      .then(() => {
        deleteIndex(currentRow.value.id)
      })
      .catch(() => {
      })
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

function handleCurrentChange(val) {
  currentRow.value = val
  ifDisableDelete.value = !(currentRow.value && (currentRow.value.indicatorLabels === '已下架' || currentRow.value.indicatorLabels === '未上架'));
}

function getApiFolder ()  {
  showSpin.value = true
  let params ={}
  axios.post(getCatalogFolderUrl,params).then((res) => {
    treeFolder.value = res.data.data
    showSpin.value = false
  })
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

function handlePageChange(currentPage, pageSize) {
  if (!loadingRef.value) {
    loadingRef.value = true
    paginationReactive.page = currentPage
    paginationReactive.pageSize = pageSize
    query(
        paginationReactive.indicatorDefiner,
        paginationReactive.page,
        paginationReactive.pageSize,
        paginationReactive.timeDimension,
        paginationReactive.indicatorName,
        paginationReactive.indicatorCode,
        paginationReactive.indicatorTargetTable,
        paginationReactive.indicatorLatitude,
        paginationReactive.apiTreeId
    )
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

function updateTree (id, parentId) {
  showUpdateRef.value = true
  updateFormValue.value.id = id
  updateFormValue.value.parentId = parentId
}
function createIndex () {
  formRef.value.validate((errors) => {
    if (!errors) {
      indexFormValue.value.indicatorDefiner = userInfo.userName
      indexFormValue.value.indicatorMaintainer = userInfo.userName
      let params = indexFormValue.value
      let url = indexFormValue.value.opperate === '新增' ? insertIndexUrl : updateIndexUrl
      indexFormValue.value.opperate === '新增' ? delete indexFormValue.value.indicatorMaintainer : delete indexFormValue.value.indicatorDefiner
      switch (params.timeDimension){
        case '分钟' : params.timeDimension = '1'
          break;
        case '小时' : params.timeDimension = '2'
          break;
        case '天' : params.timeDimension = '3'
          break;
        case '周' : params.timeDimension = '4'
          break;
        case '月' : params.timeDimension = '5'
          break;
        case '年' : params.timeDimension = '6'
          break;
      }
      axios.post(url, params).then((res) => {
        message.info(res.data.info)
        query(
            paginationReactive.indicatorDefiner,
            paginationReactive.page,
            paginationReactive.pageSize,
            paginationReactive.timeDimension,
            paginationReactive.indicatorName,
            paginationReactive.indicatorCode,
            paginationReactive.indicatorTargetTable,
            paginationReactive.indicatorLatitude,
            paginationReactive.apiTreeId
        )
      })
      indexFormValue.value = {}
      active.value = false
    } else {
      message.error('验证失败，请填写完整信息')
    }
  })
}

function deleteIndex (id) {
  let params ={
    id: id
  }
  axios.post(deleteIndexUrl, params).then((res) => {
    message.info(res.data.info)
    showDropdownRef.value = false
    query(
        paginationReactive.indicatorDefiner,
        paginationReactive.page,
        paginationReactive.pageSize,
        paginationReactive.timeDimension,
        paginationReactive.indicatorName,
        paginationReactive.indicatorCode,
        paginationReactive.indicatorTargetTable,
        paginationReactive.indicatorLatitude,
        paginationReactive.apiTreeId
    )
  })
}
function pubIndex (id) {
  let params ={
    id: id
  }
  axios.post(pubIndexUrl, params).then((res) => {
    message.info(res.data.info)
    showDropdownRef.value = false
    query(
        paginationReactive.indicatorDefiner,
        paginationReactive.page,
        paginationReactive.pageSize,
        paginationReactive.timeDimension,
        paginationReactive.indicatorName,
        paginationReactive.indicatorCode,
        paginationReactive.indicatorTargetTable,
        paginationReactive.indicatorLatitude,
        paginationReactive.apiTreeId
    )
  })
}
function offIndex () {
  formRef.value.validate((errors) => {
    if (!errors) {
      let params ={
        id: indexFormValue.value.id,
        indicatorRemovalInfo: indexFormValue.value.indicatorRemovalInfo
      }
      axios.post(offIndexUrl, params).then((res) => {
        message.info(res.data.info)
        showDropdownRef.value = false
        showPubRef.value = false
        query(
            paginationReactive.indicatorDefiner,
            paginationReactive.page,
            paginationReactive.pageSize,
            paginationReactive.timeDimension,
            paginationReactive.indicatorName,
            paginationReactive.indicatorCode,
            paginationReactive.indicatorTargetTable,
            paginationReactive.indicatorLatitude,
            paginationReactive.apiTreeId
        )
      })
    } else {
      message.error('验证失败，请填写完整信息')
    }
  })
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
    case 2 : return h(NIcon, {color: '#0099CB'}, { default: () => h(ApartmentOutlined) })
    default : return h(NIcon, {color: '#0099CB'}, { default: () => h(TableOutlined) })
  }
}
onMounted(() => {
  getApiFolder()
  query(
      paginationReactive.indicatorDefiner,
      paginationReactive.page,
      paginationReactive.pageSize,
      paginationReactive.timeDimension,
      paginationReactive.indicatorName,
      paginationReactive.indicatorCode,
      paginationReactive.indicatorTargetTable,
      paginationReactive.indicatorLatitude,
      paginationReactive.apiTreeId
  )
})
</script>

<style scoped lang="scss">

</style>

