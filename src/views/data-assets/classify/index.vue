<template>
  <el-config-provider :locale="zhCn">
    <div class="cue-drag-layout flex-row">
      <div class="cue-drag-layout__mainview" style="width: 280px; margin-right: 12px">
        <div class="tree-container">
          <div class="add-buttons">
            <span class="title">分类</span>
            <div class="button-item-toggle" @click="packHandle" :title="expandedKeys.length ? '收起' : '展开'">
              <i :class="`iconfont icon-caret-${expandedKeys.length? 'top' : 'bottom'}`"></i>
            </div>
            <div v-if="true" class="button-item" @click="showAddRef=!showAddRef" title="添加">
              <i class="iconfont icon-cart_add"></i>
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
        </div>
      </div>
      <div class="cue-drag-layout__mainview" :style="{width: 'calc(100% - ' + (280 + 12) + 'px)'}">
        <div class="cue-crud cue-crud-v2">
          <CrudHead
              title="数据编目"
              addButton deleteButton
              :disableDelete="ifDisableDelete"
              @add-event="addMetadata"
              @delete-event="delConfirm"
          />
          <div class="crud-v2-condition" >
            <div class="cue-crud__header-condition">
              <div class="cue-crud__header-content">
                <el-form inline>
                  <el-form-item label="资产类型">
                    <el-select
                        v-model="paginationReactive.assetType"
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
                  <el-form-item label="资产名称">
                    <el-input type="text" v-model="paginationReactive.assetName"/>
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
                <el-table v-loading="loadingRef" :data="dataRef" show-overflow-tooltip border resizable highlight-current-row @current-change="handleCurrentChange" height="100%">
                  <el-table-column type="index" fixed label="序号" width="50" align="center"/>
                  <el-table-column prop="assetName" label="资产名称" align="center"/>
                  <el-table-column prop="notes" label="注释" align="center"/>
                  <el-table-column prop="assetType" label="资产类型" width="120" align="center"/>
                  <el-table-column v-if="showAssetOperation" label="已绑定资产运营" width="120" align="center">
                    <template #default="scope">
                      {{ scope.row.addFlag === 1 ? '是' : '否' }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="databaseName" label="数据源" width="120" align="center"/>
                  <el-table-column prop="databaseType" label="数据库类型" width="120" align="center"/>
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
    <el-dialog
        v-model="showAddRef"
        :before-close="addDialogVisible"
        title="新建文件夹"
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
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button color="#0099CB" @click="createMenu(ruleFormRef)" >确定</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
        v-model="showUpdateRef"
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
    <div class="add-dialog">
      <el-dialog title="新增" v-model="active" width="800px" :before-close="dialogVisible">
        <template #header> 新增 </template>
        <el-tabs type="card" v-model="activeName">
          <el-tab-pane label="数据集" name="first">
            <crudSplit title="新增数据集" style="margin-bottom: 10px;">
              <template #right>
                <span>{{ "本次新增资产" + addDataSetRef.length + "个" }}</span>
              </template>
            </crudSplit>
            <el-form
                ref="ruleFormRef"
                :rules="rules"
                :model="detailPaginationReactive"
                inline
            >
              <el-form-item label="资产名称">
                <el-input type="text" v-model="detailPaginationReactive.apiName"/>
              </el-form-item>
              <el-form-item label="资产入库">
                <el-tree-select
                    :data="dataSetFolder"
                    node-key="id"
                    :props="folderProps"
                    v-model="detailPaginationReactive.selectedMenu"
                    @change="handleFolderChange"
                    check-strictly
                    style="width: 240px"
                    popper-class="form-item-select"
                />
              </el-form-item>
              <el-button color="#0099CB" type="primary" size="default" style="height: 24px;font-size: 12px;margin-bottom: 8px;"
                         :icon="Search" @click="refreshDetail(1,detailPaginationReactive.pageSize)" >查询
              </el-button>
              <el-form-item required :show-message="false" label="应用场景" prop="applicationScenarios">
                <el-input type="text" placeholder="请输入对应应用场景" v-model="detailPaginationReactive.applicationScenarios"/>
              </el-form-item>
              <el-checkbox v-model="detailPaginationReactive.tableDataRow" label="存在数据" />
              <el-checkbox v-model="detailPaginationReactive.notes" label="存在注释" />
              <el-checkbox v-model="detailPaginationReactive.tableDataLength" label="存储不为空" />
              <el-checkbox v-model="detailPaginationReactive.tableUpdateTime" label="近7日更新" />
            </el-form>
            <el-table row-key="apiName"	ref="dataSetRef" @selection-change="handleSelectionChange" :data="detailDataRef" border resizable highlight-current-row height="100%">
              <el-table-column type="selection" reserve-selection width="55" />
              <el-table-column type="index" fixed label="序号" width="50" align="center"/>
              <el-table-column prop="apiName" label="资产名称" align="center"/>
              <el-table-column prop="apiComment" label="注释" align="center"/>
              <el-table-column prop="assetName" label="资产类型" width="100" align="center"/>
            </el-table>
                <el-pagination
                    background
                    :default-page-size="10"
                    :page-sizes="[10]"
                    layout="total, sizes, prev, pager, next"
                    :total="detailPaginationReactive.itemCount"
                    @change="handleDetailPageChange"
                    popper-class="page-select"
                    style="justify-content: flex-end;"
                >
                </el-pagination>
          </el-tab-pane>
          <el-tab-pane label="API服务" name="second">
            <crudSplit title="新增API" style="margin-bottom: 10px;">
              <template #right>
                <span>{{ "本次新增资产" + addApiRef.length + "个" }}</span>
              </template>
            </crudSplit>
            <el-form
                ref="ruleApiFormRef"
                :rules="rules"
                :model="apiDetailPaginationReactive"
                inline
            >
              <el-form-item label="资产名称">
                <el-input type="text" v-model="apiDetailPaginationReactive.apiName"/>
              </el-form-item>
              <el-form-item label="资产入库">
                <el-tree-select
                    :data="apiFolder"
                    node-key="id"
                    :props="folderProps"
                    v-model="apiDetailPaginationReactive.selectedMenu"
                    @change="handleApiFolderChange"
                    check-strictly
                    style="width: 240px"
                    popper-class="form-item-select"
                />
              </el-form-item>
              <el-button color="#0099CB" type="primary" size="default" style="height: 24px;font-size: 12px;margin-bottom: 8px;"
                         :icon="Search" @click="refreshApiDetail(1,apiDetailPaginationReactive.pageSize)" >查询
              </el-button>
              <el-form-item required :show-message="false" label="应用场景" prop="applicationScenarios">
                <el-input type="text" placeholder="请输入对应应用场景" v-model="apiDetailPaginationReactive.applicationScenarios"/>
              </el-form-item>
              <el-checkbox v-model="apiDetailPaginationReactive.interfaceNum" label="数据调用次数>10" />
              <el-checkbox v-model="apiDetailPaginationReactive.apiComment" label="存在注释" />
              <el-checkbox v-model="apiDetailPaginationReactive.apiTimeConsuming" label="返回时间小于3S" />
            </el-form>
            <el-table row-key="apiName"	ref="apiRef" @selection-change="handleSelectionChange" :data="apiDetailDataRef" border resizable highlight-current-row height="100%">
              <el-table-column type="selection" reserve-selection width="55" />
              <el-table-column type="index" fixed label="序号" width="50" align="center"/>
              <el-table-column prop="apiName" label="资产名称" align="center"/>
              <el-table-column prop="apiComment" label="注释" align="center"/>
              <el-table-column prop="assetName" label="资产类型" align="center"/>
            </el-table>
            <el-pagination
                background
                :default-page-size="10"
                :page-sizes="[10]"
                layout="total, sizes, prev, pager, next"
                :total="apiDetailPaginationReactive.itemCount"
                @change="handleApiDetailPageChange"
                popper-class="page-select"
                style="justify-content: flex-end;"
            >
            </el-pagination>
          </el-tab-pane>
        </el-tabs>
        <template #footer>
          <div class="dialog-footer">
            <el-button color="#f1f2f4" @click="dialogVisible">取消</el-button>
            <el-button color="#0099CB" type="primary" :disabled="ifChecked" @click="submitSelect(ruleFormRef, ruleApiFormRef)">确定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
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
  NIcon,
  useMessage,
  NPopover, NButton
} from "naive-ui";
import {useRouter} from "vue-router";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import CrudHead from "@/components/cue/crud-header.vue";
import crudSplit from "@/components/cue/crud-split.vue";
import {Search} from "@element-plus/icons-vue";
import {ElMessageBox} from "element-plus";

const TableData = reactive({
  tableList: [],
  totalNum: 0
})
const detailTableData = reactive({
  tableList: [],
  totalNum: 0
})
const apiDetailTableData = reactive({
  tableList: [],
  totalNum: 0
})

const dataRef = ref([])
const ruleFormRef = ref()
const ruleApiFormRef = ref()
const detailDataRef = ref([])
const apiDetailDataRef = ref([])
const dataSetRef = ref()
const apiRef = ref()
const addDataSetRef = ref([])
const addApiRef = ref([])
const ifChecked = ref(true)
const router = useRouter()
const active = ref(false)
const loadingRef = ref(true)
const detailLoadingRef = ref(true)
const showSpin = ref(false)
const message = useMessage()
const treeFolder = ref([])
const apiFolder = ref([])
const dataSetFolder = ref([])
const selectedMenu = ref(1)
const showDropdownRef = ref(false)
const showAddRef = ref(false)
const showUpdateRef = ref(false)
const formValue = ref({ applicationScenarios: '' })
const updateFormValue = ref({})
const expandedKeys = ref([]);
const pattern = ref('');
const activeName = ref('first')
const currentRow = ref()
const showAssetOperation = ref(false)
const ifDisableDelete = ref(true)
const getCatalogFolderUrl = import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/dataCatalog/getDataCatalogTreeFloder'
    : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/dataCatalog/getDataCatalogTreeFloder'
const addCatalogTreeUrl = import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/dataCatalog/insertDataCatalogTree'
    : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/dataCatalog/insertDataCatalogTree'
const updateCatalogTreeUrl = import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/dataCatalog/updateDataCatalogFolderRename'
    : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/dataCatalog/updateDataCatalogFolderRename'
const delCatalogTreeUrl = import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/dataCatalog/deleteDataCatalogTree'
    : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/dataCatalog/deleteDataCatalogTree'
const insertCatalogDetailUrl = import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/dataCatalog/insert'
    : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/dataCatalog/insert'
const delCatalogDetailUrl = import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/dataCatalog/delete'
    : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/dataCatalog/delete'
const  folderProps = {
  children: 'children',
  label: 'titleName',
}

const stateOptions = [
  {
    label: '数据表',
    value: '1'
  },
  {
    label: 'API',
    value: '2'
  }
]
const rules = reactive({
  applicationScenarios: [{
    required: true,
    message: '请输入应用场景',
    trigger: 'blur'
  }],
  titleName: [{
    required: true,
    message: '请输入名称',
    trigger: 'blur'
  }]
})
const paginationReactive = reactive({
  page: 1,
  pageSize: 30,
  assetName: '',
  assetType: '',
  apiTreeId: 1,
  itemCount: 0
})
const detailPaginationReactive = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  apiName: '',
  dataCatalogType: '2',
  notes: '',
  tableDataLength: '',
  tableDataRow: '',
  tableUpdateTime: '',
  applicationScenarios: '',
  selectedMenu: 1
})
const initialDetailPagination = {
  page: 1,
  pageSize: 10,
  itemCount: 0,
  apiName: '',
  dataCatalogType: '2',
  notes: '',
  tableDataLength: '',
  tableDataRow: '',
  tableUpdateTime: '',
  applicationScenarios: '',
  selectedMenu: 1
};
const apiDetailPaginationReactive = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  apiName: '',
  dataCatalogType: '2',
  apiComment: '',
  apiTimeConsuming: '',
  interfaceNum: '',
  applicationScenarios: '',
  selectedMenu: 1
})
const initialApiDetailPagination = {
  page: 1,
  pageSize: 10,
  itemCount: 0,
  apiName: '',
  dataCatalogType: '2',
  apiComment: '',
  apiTimeConsuming: '',
  interfaceNum: '',
  applicationScenarios: '',
  selectedMenu: 1
}
function query(
    page,
    pageSize = 30,
    assetName = '',
    assetType = '',
    apiTreeId = 1
) {
  const url = import.meta.env.MODE === 'development'
      ? import.meta.env.VITE_APP_DEV_ASSETS_URL+'/HDataApi/dataCatalog/getList'
      : window.webConfig.VITE_APP_PROD_ASSETS_URL+'/HDataApi/dataCatalog/getList'
  const params = {
    'pageNum': page,
    'pageSize': pageSize,
    'assetName': assetName,
    'assetType': assetType,
    'apiTreeId': apiTreeId,
    'dataCatalogType': apiTreeId===2 || apiTreeId===3 || apiTreeId===4 ? 1 : 2
}
  loadingRef.value = true
  axios
      .post(url, params)
      .then(function (response) {
        dataRef.value = []
        TableData.tableList = response.data.data
        TableData.totalNum = response.data.totalNum
        TableData.tableList.forEach((item) => {
          if (item.databaseType === 0) {
            item.databaseType = 'mysql'
          }
          if (item.databaseType === 5) {
            item.databaseType = 'oracle'
          }
          if (item.databaseType === 6) {
            item.databaseType = 'SqlServer'
          }
        })
        TableData.tableList.forEach((item) => {
          if (item.assetType === 1) {
            item.assetType = '数据表'
          }
          if (item.assetType === 2) {
            item.assetType = 'API'
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
function detailQuery(
    page,
    pageSize = 10,
    apiName = '',
    dataCatalogType = '2',
    notes = '',
    tableDataLength = '',
    tableDataRow = '',
    tableUpdateTime = ''
) {
  const url = import.meta.env.MODE === 'development'
      ? import.meta.env.VITE_APP_DEV_ASSETS_URL+'/HDataApi/dataCatalog/queryDataSet'
      : window.webConfig.VITE_APP_PROD_ASSETS_URL+'/HDataApi/dataCatalog/queryDataSet'
  const params = {
    'apiName':apiName,
    'tableDataRow':tableDataRow,
    'notes':notes,
    'tableDataLength':tableDataLength,
    'tableUpdateTime':tableUpdateTime,
    'dataCatalogType':dataCatalogType,
    'pageNum': page,
    'pageSize': pageSize
  }
  axios
      .post(url, params)
      .then(function (response) {
        detailDataRef.value = []
        detailTableData.tableList = response.data.data
        detailTableData.totalNum = response.data.totalNum
        detailTableData.tableList.forEach((item) => {
          if (item.dbType === 0) {
            item.dbType = 'mysql'
          }
          if (item.dbType === 5) {
            item.dbType = 'oracle'
          }
          if (item.dbType === 6) {
            item.dbType = 'SqlServer'
          }
        })
        detailTableData.tableList.forEach((item) => {
          if (item.assetType === 1) {
            item.assetName = '数据集'
          }
          if (item.assetType === 2) {
            item.assetName = 'API服务'
          }
        })
        detailDataRef.value = detailTableData.tableList.map((v) => v)
        detailPaginationReactive.itemCount = detailTableData.totalNum
        detailLoadingRef.value = false
      })
      .catch(function (error) {
        console.log(error)
      })
}
function apiDetailQuery(
    page,
    pageSize = 10,
    apiName= '',
    dataCatalogType= '2',
    apiComment='',
    apiTimeConsuming= '',
    interfaceNum= ''
) {
  const url = import.meta.env.MODE === 'development'
      ? import.meta.env.VITE_APP_DEV_ASSETS_URL+'/HDataApi/dataCatalog/queryApiService'
      : window.webConfig.VITE_APP_PROD_ASSETS_URL+'/HDataApi/dataCatalog/queryApiService'
  const params = {
    'apiName': apiName,
    'dataCatalogType': dataCatalogType,
    'apiComment': apiComment,
    'apiTimeConsuming': apiTimeConsuming,
    'interfaceNum': interfaceNum,
    'pageNum': page,
    'pageSize': pageSize
  }
  axios
      .post(url, params)
      .then(function (response) {
        apiDetailDataRef.value = []
        apiDetailTableData.tableList = response.data.data
        apiDetailTableData.totalNum = response.data.totalNum
        apiDetailTableData.tableList.forEach((item) => {
          if (item.assetType === 1) {
            item.assetName = '数据集'
          }
          if (item.assetType === 2) {
            item.assetName = 'API服务'
          }
        })
        apiDetailDataRef.value = apiDetailTableData.tableList.map((v) => v)
        apiDetailPaginationReactive.itemCount = apiDetailTableData.totalNum
        detailLoadingRef.value = false
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
function updateMenu(ruleFormRef) {
  ruleFormRef.validate((valid) => {
    if (valid) {
      let params ={
        id: updateFormValue.value.id,
        titleName: updateFormValue.value.titleName,
        parentId: updateFormValue.value.parentId
      }
      axios.post(updateCatalogTreeUrl, params).then((res) => {
        message.info(res.data.info)
        showUpdateRef.value = false
        getApiFolder()
      })
    } else {
      message.error('验证失败，请填写完整信息')
    }
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
  detailPaginationReactive.page = 1, detailPaginationReactive.apiName= '', detailPaginationReactive.dataCatalogType= '2', detailPaginationReactive.notes= '', detailPaginationReactive.tableDataLength= '', detailPaginationReactive.tableDataRow= '', detailPaginationReactive.tableUpdateTime= ''
  detailQuery(
      detailPaginationReactive.page,
      detailPaginationReactive.pageSize,
      detailPaginationReactive.apiName,
      detailPaginationReactive.dataCatalogType,
      detailPaginationReactive.notes,
      detailPaginationReactive.tableDataLength,
      detailPaginationReactive.tableDataRow,
      detailPaginationReactive.tableUpdateTime
  )
  apiDetailPaginationReactive.page = 1, apiDetailPaginationReactive.apiName= '', apiDetailPaginationReactive.dataCatalogType= '2', apiDetailPaginationReactive.apiComment= '', apiDetailPaginationReactive.apiTimeConsuming= '', apiDetailPaginationReactive.interfaceNum= ''
  apiDetailQuery(
      apiDetailPaginationReactive.page,
      apiDetailPaginationReactive.pageSize,
      apiDetailPaginationReactive.apiName,
      apiDetailPaginationReactive.dataCatalogType,
      apiDetailPaginationReactive.apiComment,
      apiDetailPaginationReactive.apiTimeConsuming,
      apiDetailPaginationReactive.interfaceNum
  )
  active.value = true
}
const delConfirm = () => {
  ElMessageBox.confirm(
      '您将删除' + currentRow.value.assetName + '，是否继续？',
      '提示',
      {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      }
  )
      .then(() => {
        delMetadata(currentRow.value.id, currentRow.value.assetName, currentRow.value.dataCatalogAddFlag, currentRow.value.dataSourceAddFlag)
      })
      .catch(() => {
      })
}
function updateTree (id, parentId) {
  showUpdateRef.value = true
  updateFormValue.value.id = id
  updateFormValue.value.parentId = parentId
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
function delMetadata(id, assetName, dataCatalogAddFlag, dataSourceAddFlag) {
  let params ={
    id: id,
    assetName: assetName,
    dataCatalogAddFlag: dataCatalogAddFlag,
    dataSourceAddFlag: dataSourceAddFlag
  }
  axios.post(delCatalogDetailUrl, params).then((res) => {
    message.info(res.data.info)
    query(
        paginationReactive.page,
        paginationReactive.pageSize,
        paginationReactive.assetName,
        paginationReactive.assetType,
        paginationReactive.apiTreeId
    )
  })
}
function getApiFolder ()  {
  showSpin.value = true
  let params ={}
  axios.post(getCatalogFolderUrl,params).then((res) => {
    treeFolder.value = res.data.data
    // 深拷贝
    let tmpApiFolder = JSON.parse(JSON.stringify(treeFolder.value))
    let tmpDataSetFolder = JSON.parse(JSON.stringify(treeFolder.value))
    showSpin.value = false
    dataSetFolder.value = tmpDataSetFolder.map(item => {
      if (Array.isArray(item.children)) {
        item.children = item.children.filter(child => child.id !== 4);
      }
      return item;
    })
    apiFolder.value = tmpApiFolder.map(item => {
      if (Array.isArray(item.children)) {
        item.children = item.children.filter(child => child.id !== 3);
      }
      return item;
    });
  })
}
function handleFolderChange() {
  if (detailPaginationReactive.selectedMenu === 2 || detailPaginationReactive.selectedMenu === 3 || detailPaginationReactive.selectedMenu === 4) {
    detailPaginationReactive.dataCatalogType = '1'
  } else {
    detailPaginationReactive.dataCatalogType = '2'
  }
  refreshDetail(1,detailPaginationReactive.pageSize)
}
function handleApiFolderChange() {
  if (apiDetailPaginationReactive.selectedMenu === 2 || apiDetailPaginationReactive.selectedMenu === 3 || apiDetailPaginationReactive.selectedMenu === 4) {
    apiDetailPaginationReactive.dataCatalogType = '1'
  } else {
    apiDetailPaginationReactive.dataCatalogType = '2'
  }
  refreshApiDetail(1,apiDetailPaginationReactive.pageSize)
}

function renderSuffix({ option }) {
  if (option.id === selectedMenu.value && option.id !== 2 && option.id !== 3 && option.id !== 4) {
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
                h('div', h(NButton, { onClick: () => updateTree(option.id, option.parentId), quaternary: true, style: {width: '100px', 'font-size': '12px', 'justify-content': 'left'}},{icon: () => h('i',{class:"iconfont fa-pencil", 'aria-hidden':"true", style: {'font-size': '12px'}}),default: () =>"修改"} )),
                h('div', h(NButton, { onClick: () => delTreeConfirm(option.id, option.titleName), disabled: option.children.length !== 0, quaternary: true, style: {width: '100px', 'font-size': '12px', 'justify-content': 'left'}},{icon: () => h('i',{class:"iconfont fa-trash", 'aria-hidden':"true", style: {'font-size': '12px'}}),default: () =>"删除"} ))
              ])
        }
    )
  }
}

function dialogVisible () {
  active.value = false
  ifChecked.value = true
  Object.assign(detailPaginationReactive, initialDetailPagination)
  Object.assign(apiDetailPaginationReactive, initialApiDetailPagination)
  dataSetRef.value.clearSelection()
  apiRef.value.clearSelection()
}
function addDialogVisible () {
  showAddRef.value = false
  formValue.value.titleName = ''
}
function submitSelect(ruleFormRef, ruleApiFormRef) {
  ruleFormRef.validate((valid) => {
    if (addDataSetRef.value.length>0) {
      if (valid) {
        let addDataSetRefTemp = addDataSetRef.value.map(obj => ({ ...obj, applicationScenarios: detailPaginationReactive.applicationScenarios, dataCatalogType: detailPaginationReactive.dataCatalogType, treeId: detailPaginationReactive.selectedMenu }))
        let dataCatalogListPost = {
          dataCatalogList: addDataSetRefTemp
        }
        axios.post(insertCatalogDetailUrl,dataCatalogListPost).then((res) => {
          message.info(res.data.info)
          active.value = false
          Object.assign(detailPaginationReactive, initialDetailPagination)
          dataSetRef.value.clearSelection()
          query(
              paginationReactive.page,
              paginationReactive.pageSize,
              paginationReactive.assetName,
              paginationReactive.assetType,
              paginationReactive.apiTreeId
          )
        }).catch(function (error) {
          message.error(error)
        })
      } else {
        message.error('验证失败，请填写应用场景')
      }
    }
  })
  ruleApiFormRef.validate((valid) => {
    if (addApiRef.value.length>0) {
      if (valid) {
        let addApiRefTemp = addApiRef.value.map(obj => ({ ...obj, applicationScenarios: apiDetailPaginationReactive.applicationScenarios, dataCatalogType: apiDetailPaginationReactive.dataCatalogType, treeId: apiDetailPaginationReactive.selectedMenu }))
        let dataCatalogListPost = {
          dataCatalogList: addApiRefTemp
        }
        axios.post(insertCatalogDetailUrl,dataCatalogListPost).then((res) => {
          message.info(res.data.info)
          active.value = false
          Object.assign(apiDetailPaginationReactive, initialApiDetailPagination)
          apiRef.value.clearSelection()
          query(
              paginationReactive.page,
              paginationReactive.pageSize,
              paginationReactive.assetName,
              paginationReactive.assetType,
              paginationReactive.apiTreeId
          )
        }).catch(function (error) {
          message.error(error)
        })
      } else {
        message.error('验证失败，请填写应用场景')
      }
    }
  })
}
function handleSelectionChange() {
  addDataSetRef.value = dataSetRef.value.getSelectionRows()
  addApiRef.value = apiRef.value.getSelectionRows()
  ifChecked.value = addDataSetRef.value.length === 0 && addApiRef.value.length === 0;
}
function handlePageChange(currentPage, pageSize) {
  if (!loadingRef.value) {
    loadingRef.value = true
    paginationReactive.page = currentPage
    paginationReactive.pageSize = pageSize
    showAssetOperation.value = paginationReactive.apiTreeId===2 || paginationReactive.apiTreeId===3 || paginationReactive.apiTreeId===4 ? true : false
    query(
        paginationReactive.page,
        paginationReactive.pageSize,
        paginationReactive.assetName,
        paginationReactive.assetType,
        paginationReactive.apiTreeId
    )
  }
}
function handleDetailPageChange(currentPage, pageSize) {
  if (!detailLoadingRef.value) {
    detailLoadingRef.value = true
    detailPaginationReactive.page = currentPage
    detailPaginationReactive.pageSize = pageSize
    detailQuery(
        detailPaginationReactive.page,
        detailPaginationReactive.pageSize,
        detailPaginationReactive.apiName,
        detailPaginationReactive.dataCatalogType,
        detailPaginationReactive.notes,
        detailPaginationReactive.tableDataLength,
        detailPaginationReactive.tableDataRow,
        detailPaginationReactive.tableUpdateTime
    )
  }
}
function handleApiDetailPageChange(currentPage, pageSize) {
  if (!detailLoadingRef.value) {
    detailLoadingRef.value = true
    apiDetailPaginationReactive.page = currentPage
    apiDetailPaginationReactive.pageSize = pageSize
    apiDetailQuery(
        apiDetailPaginationReactive.page,
        apiDetailPaginationReactive.pageSize,
        apiDetailPaginationReactive.apiName,
        apiDetailPaginationReactive.dataCatalogType,
        apiDetailPaginationReactive.apiComment,
        apiDetailPaginationReactive.apiTimeConsuming,
        apiDetailPaginationReactive.interfaceNum
    )
  }
}
function refreshDetail(currentPage, pageSize) {
  handleDetailPageChange(currentPage, pageSize)
  dataSetRef.value.clearSelection()
}
function refreshApiDetail(currentPage, pageSize) {
  handleApiDetailPageChange(currentPage, pageSize)
  apiRef.value.clearSelection()
}
function play(row) {
  if(row.assetType === '数据表') {
    router.push({
          name: 'assets-detail',
          state: {tableName: row.assetName, tableComment: row.notes, dbType: row.databaseType, fieldArray: row.fieldArray, backName: 'assets-classify'}
        }
    )
  } else {
    router.push({
          name: 'api-detail',
          state: {apiName: row.assetName, backName: 'assets-classify'}
        }
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
function handleCurrentChange(val) {
  currentRow.value = val
  if(currentRow.value && currentRow.value.addFlag === 0 ) {
    ifDisableDelete.value = false
  } else {
    ifDisableDelete.value = true
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
      paginationReactive.assetName,
      paginationReactive.assetType,
      paginationReactive.apiTreeId
  )
})
</script>

<style scoped lang="scss">
.add-dialog {
  :deep(.el-dialog__body) {
    padding: 12px !important;
  }
}

.el-tabs__content {
  height: 420px;
  border: 1px solid #ccc !important;
}

</style>


