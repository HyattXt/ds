<template>
  <CrudForm>
      <template v-slot:header>
        <CrudHeader
            title="台账管理"
            addButton updateButton deleteButton
            :disableUpdate="!currentRow"
            :disableDelete="ifDisableDelete"
            @add-event="addMetadata" @update-event="editMetadata" @delete-event="delConfirm"
        />
      </template>
      <template v-slot:condition>
        <el-form inline>
          <el-form-item label="表名称">
            <el-input type="text" style="width: 180px" clearable v-model="paginationReactive.tableName"/>
          </el-form-item>
          <el-form-item label="表注释">
            <el-input type="text" style="width: 180px" clearable v-model="paginationReactive.tableNotes"/>
          </el-form-item>
          <el-form-item label="生效状态">
            <el-select
                v-model="paginationReactive.effectiveStatus"
                clearable
                style="width: 180px"
                popper-class="form-item-select"
            >
              <el-option label="是" value="1"/>
              <el-option label="否" value="0"/>
            </el-select>
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
            :tableData="dataList"
            :columnData="columns"
            :loading-ref="loadingRef"
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
  <el-dialog v-model="active" :before-close="dialogVisible" append-to-body width="800" class="model-form-wrapper">
    <template #header> {{ detailFrom.opperate }} </template>
    <CrudSplit title="选择字段" style="margin-bottom: 14px"/>
    <n-form
        :size="'small'"
        label-placement="left"
        :label-width="120"
        require-mark-placement="left"
        ref="formRef"
        :model="detailFrom"
        :rules="rules"
        :disabled="ifUpdate"
    >
      <n-grid :cols="12" :x-gap="24">
        <n-form-item-gi :span="6" label="数据源类型:" path="dataSourceType">
          <n-select v-model:value="detailFrom.dataSourceType" @update:value="updateDataSource" :options="datasourceTypes" :disabled="ifNameUpdate"/>
        </n-form-item-gi>
        <n-form-item-gi :span="6" label="数据源:" path="dataSource">
          <n-select v-model:value="detailFrom.dataSource" @update:value="updateSourceTableList" label-field="name" value-field="id" :options="dataSourceList" :disabled="ifNameUpdate"/>
        </n-form-item-gi>
        <n-form-item-gi :span="6" label="表名称:" path="tableName">
          <n-select v-model:value="detailFrom.tableName" @update:value="updateFieldName" label-field="TABLE_NAME" value-field="TABLE_NAME" filterable :options="sourceTableList" :disabled="ifNameUpdate"/>
        </n-form-item-gi>
        <n-form-item-gi :span="6" label="字段:" path="fieldName">
          <NSelect
              v-model:value="detailFrom.fieldName"
              :options="fieldNameOption"
              label-field="TABLE_NAME"
              value-field="TABLE_NAME"
              @click="updateFieldName"
              @update:value="updateComment"
              filterable
          />
        </n-form-item-gi>
        <n-form-item-gi :span="6" label="绑定类型:" path="bindingType">
          <n-select
              size="small"
              placeholder="请选择"
              v-model:value="detailFrom.bindingType"
              @update:value="updateBindingRule"
              :options="[{ label: '脱敏', value: '2' }, { label: '加密', value: '1' }]"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="6" label="绑定规则:" path="bindingRuleId">
          <n-select
              size="small"
              placeholder="请选择"
              label-field="name"
              value-field="id"
              v-model:value="detailFrom.bindingRuleId"
              @update:value="updateBindingRuleId"
              :options="bindRuleList"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="备注:" path="tableNotes">
          <n-input
              size="small"
              placeholder="请选择"
              v-model:value="detailFrom.tableNotes"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="主键字段:" path="keyName">
          <NSelect
              v-model:value="detailFrom.keyName"
              :options="fieldNameOption"
              label-field="TABLE_NAME"
              value-field="TABLE_NAME"
              @click="updateFieldName"
              filterable
              multiple
          />
          <n-tooltip trigger="hover">
            <template #trigger>
              <div style="padding-left: 5px">
                <NIcon>
                  <QuestionCircleTwotone/>
                </NIcon>
              </div>
            </template>
            <p>标识字段进行加密脱敏时每行数据的唯一主键或联合主键，不能重复选择加密字段。</p>
          </n-tooltip>
        </n-form-item-gi>
        <n-form-item-gi :span="6" label="样本数据:" path="h">
          <n-input-group>
            <n-input v-model:value="demoData" placeholder="输入样本数据，点击验证查看"/>
            <n-button type="info" color="#0099CB" quaternary @click="handleDesVerify" :disabled="ifUpdate">
              验证
            </n-button>
          </n-input-group>
        </n-form-item-gi>
        <n-form-item-gi :span="resultSpan" label="验证结果:" path="indicatorAffiliatedSys">
          <n-input v-model:value="verifyValue" disabled placeholder="无结果">
          </n-input>
        </n-form-item-gi>
      </n-grid>
    </n-form>
    <n-button type="info" color="#0099CB" size="small" @click="handleDetailTable" :disabled="ifUpdate">
      添加
    </n-button>
    <CrudSplit title="已添加字段" style="margin: 14px 0">
      <template v-slot:right>
        <n-button type="info" quaternary color="#0099CB" :disabled="!checkedRowKeysRef.length || ifUpdate" size="small" @click="handleDeleteTable">
          移除
        </n-button>
      </template>
    </CrudSplit>
    <n-data-table
        :columns="detailColumns"
        :data="detailTable"
        :row-key="(row) => row.fieldName"
        :max-height="135"
        :single-line="false"
        @update:checked-row-keys="handleCheck"
    />
    <template #footer>
      <n-button color="#0099CB" type="primary" size="small" :disabled="ifUpdate" @click="createDataLedger">确定</n-button>
    </template>
  </el-dialog>
</template>

<script setup>

import {Search} from "@element-plus/icons-vue";
import CrudForm from "@/components/cue/crud-form.vue";
import CrudPage from "@/components/cue/crud-page.vue";
import {ElButton, ElMessageBox, ElSwitch} from "element-plus";
import CrudHeader from "@/components/cue/crud-header.vue";
import CrudTable from "@/components/cue/crud-table.vue";
import {h, onMounted, ref} from "vue";
import {NButton, NGrid, NIcon, useMessage} from "naive-ui";
import CrudSplit from "@/components/cue/crud-split.vue";
import {queryDataSourceList} from "@/service/modules/data-source";
import {find} from "lodash";
import utils from "@/utils";
import axios from "axios";
import {
  dataLedgerExists,
  deleteDataLedger,
  effectiveDataLedger,
  getDataLedgerFiled,
  insertDataLedger,
  queryDataSecurityDataLedger,
  queryDataSecurityDesensitizationRules,
  queryDataSecurityEncryption,
  runDataProcess,
  updateDataLedger,
  verifyDesensitizationRules,
  verifyEncryptionRules
} from "@/service/modules/desensitization";
import {QuestionCircleTwotone} from "@vicons/antd";

const message = useMessage()
const active = ref(false)
const formRef = ref()
const loadingRef = ref(false)
const resultSpan = ref(0)
const currentRow = ref()
const ifDisableDelete = ref(true)
const ifNameUpdate = ref(false)
const ifUpdate = ref(false)
const runFlag = ref(false)
const runFlagId = ref(null)
const demoData = ref('')
const verifyValue = ref('')
const checkedRowKeysRef = ref([])
const dataSourceList = ref([])
const sourceTableList = ref([])
const fieldNameOption = ref([])
const paginationReactive = ref({
  tableName: '',
  tableNotes: '',
  effectiveStatus: '',
  page: 1,
  pageSize: 30,
  itemCount: 0
})
const dataList = ref([])
const detailFrom = ref({
  tableName: null,
  tableNotes: '',
  dataSourceType: null,
  dataSource: null,
  fieldName: null,
  fieldComment: '',
  bindingType: null,
  bindingRuleId: null,
  bindingRuleName: '',
  dataSecurityDataLedgerFields: [],
  effectiveStatus: 0,
  keyName: [],
  updateFieldName: ''
})

const detailTable = ref([])

const columns =  [
  {
    label: '表名称',
    prop: 'tableName'
  },
  {
    label: '备注',
    prop: 'tableNotes'
  },
  {
    label: '创建人',
    prop: 'creator'
  },
  {
    label: '生效状态',
    prop: 'effectiveStatus',
    width: 80,
    slots: (row) => {
      return h(
          ElSwitch,
          {
            modelValue: row.effectiveStatus,
            activeValue: 1,
            inactiveValue: 0,
            style: "--el-switch-on-color: #0099CB",
            onChange: () => handleRelease(row)
          }
      )
    }
  },
  {
    label: '创建时间',
    prop: 'createTime'
  },
  {
    label: '更新时间',
    prop: 'updateTime'
  },
  {
    label: '操作',
    prop: 'actions',
    width: 132,
    slots: (row) => {
      return [h(
          ElButton,
          {
            class: 'el-button--text',
            size: 'small',
            loading: runFlag.value && row.id === runFlagId.value,
            disabled: runFlag.value && row.id !== runFlagId.value,
            onClick: () => runProcess(row)
          },
          { default: ()=> '执行' }
      )]
    }
  }
]

const detailColumns = [
  {
    type: "selection"
  },
  {
    title: '#',
    key: 'index',
    width: 40,
    render: (row, index) => index + 1
  },
  {
    title: "字段名",
    key: "fieldName"
  },
  {
    title: "注释",
    key: "fieldComment"
  },
  {
    title: "绑定类型",
    key: "bindingType",
    render: (row) => {
      return row.bindingType === '1' ? '加密' : '脱敏'
    }
  },
  {
    title: "规则名称",
    key: "bindingRuleName"
  }
]

const bindRuleList = ref([])

const rules = ref({
  tableName: [{
    key: 'create',
    required: true,
    message: '请选择',
    trigger: 'blur'
  }],
  dataSource: {
    key: 'create',
    required: true,
    type: 'number',
    message: '请选择',
    trigger: 'blur'
  },
  dataSourceType: {
    key: 'create',
    required: true,
    type: 'number',
    message: '请选择',
    trigger: 'blur'
  },
  bindingType: {
    required: true,
    message: '请选择',
    trigger: 'blur'
  },
  fieldName: {
    required: true,
    message: '请选择',
    trigger: 'blur'
  },
  keyName: [
    {
      key: 'create',
      required: true,
      type: 'array',
      validator(rule, value) {
        if (!value.length) {
          return new Error("请选择");
        } else {
          const charSet = new Set(detailFrom.value.keyName);

          // 遍历对象数组
          for (let obj of detailTable.value) {
            // 如果对象的fieldName字段的值在charSet中，返回true
            if (charSet.has(obj['fieldName'])) {
              return new Error("不得与脱敏加密字段重复");
            }
          }
          // 如果没有找到匹配项，返回false
          return true;
        }
      },
      trigger: ["input", "blur"]
    }
  ],
  bindingRuleId: {
    required: true,
    type: 'number',
    message: '请选择',
    trigger: 'blur'
  },
  tableNotes: {
    key: 'create',
    required: true,
    message: '请填写',
    trigger: 'blur'
  }
})

const datasourceTypes = [
  {
    id: 0,
    label: 'MYSQL',
    value: 0
  },
  {
    id: 1,
    label: 'POSTGRESQL',
    value: 1
  },
  {
    id: 2,
    label: 'HIVE',
    value: 2
  },
  {
    id: 3,
    label: 'SPARK',
    value: 3
  },
  {
    id: 4,
    label: 'CLICKHOUSE',
    value: 4
  },
  {
    id: 5,
    label: 'ORACLE',
    value: 5
  },
  {
    id: 6,
    label: 'SQLSERVER',
    value: 6
  }
]

const handleCheck = (rowKeys) => {
  checkedRowKeysRef.value = rowKeys
}

const handleDeleteTable = () => {
  detailTable.value = detailTable.value.filter(item => !checkedRowKeysRef.value.includes(item.fieldName))
  checkedRowKeysRef.value = []
}

async function updateDataSource(type) {
  dataSourceList.value = await queryDataSourceList({type: datasourceTypes.find(datasource => datasource.value === type)?.label || 'MYSQL'})
  if (!dataSourceList.value.length && detailFrom.value.dataSource) {
    detailFrom.value.dataSource = null
    detailFrom.value.tableName = null
  }
  if (dataSourceList.value.length && detailFrom.value.dataSource) {
    const item = find(dataSourceList.value, { id: detailFrom.value.dataSource })
    if (!item) {
      detailFrom.value.dataSource = null
      detailFrom.value.tableName = null
      detailFrom.value.fieldName = null
    }
  }
}

async function updateSourceTableList(dataSource) {
  if(dataSource) {
    try {
      sourceTableList.value = await getDatasourceTables(dataSource, detailFrom.value.dataSourceType)
    } catch (err) {
      sourceTableList.value = []
    }
  }
  if (!sourceTableList.value.length && detailFrom.value.tableName) {
    detailFrom.value.tableName = null
    detailFrom.value.fieldName = null
  }
  if (sourceTableList.value.length && detailFrom.value.tableName) {
    const item = sourceTableList.value.find(item => item.TABLE_NAME === detailFrom.value.tableName)
    if (!item) {
      detailFrom.value.tableName = null
      detailFrom.value.fieldName = null
    }
  }
}

async function getDatasourceTables(dataSource ,type) {
  let url = utils.getUrl('apiService/getTableByDataSourceId')
  let params = {
    type: type,
    id: dataSource
  }
  try {
    const response = await axios.post(url, params);
    return response.data.data;
  } catch (error) {
    message.error(error);
  }
}

async function getDatasourceTableColumns(dataSource, table) {
  const url = utils.getUrl('apiService/getColumnsByTable')
  const params = {
    type: detailFrom.value.dataSourceType,
    id: dataSource,
    tableName: table
  }
  try {
    const response = await axios.post(url, params);
    return response.data.data;
  } catch (error) {
    message.error(error);
  }
}

async function updateFieldName() {
  if(detailFrom.value.tableName){
    fieldNameOption.value = await getDatasourceTableColumns(
        detailFrom.value.dataSource,
        detailFrom.value.tableName
    )
  }
  if (!fieldNameOption.value.length && detailFrom.value.fieldName) {
    fieldNameOption.value.fieldName = null
  }
  if (fieldNameOption.value.length && detailFrom.value.fieldName) {
    const item = fieldNameOption.value.find(item => item.TABLE_NAME === detailFrom.value.fieldName)
    if (!item) {
      detailFrom.value.fieldName = null
    }
  }
}

const updateComment = () => {
  const item = fieldNameOption.value.find(item => item.TABLE_NAME === detailFrom.value.fieldName)
  detailFrom.value.fieldComment = item.COLUMN_COMMENT
}

const updateBindingRule = async (value) => {
  if (value === '1') {
    let params = {
      encryptionAlgorithmName: '',
      encryptionAlgorithmType: '',
      pageNum: 1,
      pageSize: 999
    }
    const data = await queryDataSecurityEncryption(params)
    bindRuleList.value = data.totalList.map(item => ({
      ...item,
      name: item.encryptionAlgorithmName,
      bindingRuleId: item.id
    }))
  } else {
    let params = {
      desensitizationRuleName: '',
      desensitizationMethod: '',
      effectiveStatus: 1,
      pageNum: 1,
      pageSize: 999
    }
    const data = await queryDataSecurityDesensitizationRules(params)
    bindRuleList.value = data.totalList.map(item => ({
      ...item,
      name: item.desensitizationRuleName,
    }))
  }
  detailFrom.value.bindingRuleId = null
}

const updateBindingRuleId = () => {
  const item = bindRuleList.value.find(item => item.id === detailFrom.value.bindingRuleId)
  detailFrom.value.bindingRuleName = item.name
}

const runProcess = async (row) => {
  let params = {
    id: row.id
  }
  if(row.effectiveStatus) {
    runFlag.value = true
    runFlagId.value = row.id
    message.info('开始执行')
    await runDataProcess(params)
    runFlag.value = false
    runFlagId.value = null
    message.success('执行成功')
  } else {
    message.warning('执行前需处于生效状态')
  }
}


const createDataLedger = () => {
  formRef.value.validate(async (errors) => {
    if (!errors) {
      if(detailTable.value.length) {
        detailFrom.value.dataSecurityDataLedgerFields = detailTable.value
        detailFrom.value.updateFieldName = detailFrom.value.keyName.join(',')
        let params = {...detailFrom.value}
        detailFrom.value.opperate === '新增' ? await insertDataLedger(params) : await updateDataLedger(params)
        message.info('成功')
        dialogVisible()
        await query(
            paginationReactive.value.tableName,
            paginationReactive.value.tableNotes,
            paginationReactive.value.effectiveStatus,
            paginationReactive.value.page,
            paginationReactive.value.pageSize
        )
      } else {
        message.error('请先添加字段')
      }
    } else {
      message.error('验证失败，请填写完整信息')
    }
  },
    (rule) => {
      return rule?.key === "create";
    }
  )
}

const dialogVisible = () => {
  active.value = false
  resultSpan.value = 0
  detailFrom.value = {
    tableName: null,
    tableNotes: '',
    dataSourceType: null,
    dataSource: null,
    fieldName: null,
    fieldComment: '',
    bindingType: null,
    bindingRuleId: '',
    bindingRuleName: '',
    dataSecurityDataLedgerFields: [],
    effectiveStatus: 0,
    keyName: [],
    updateFieldName: ''
  }
  detailTable.value = []
  dataSourceList.value = []
  sourceTableList.value = []
  fieldNameOption.value = []
  formRef.value?.restoreValidation()
  demoData.value = ''
}

const handleDesVerify = () => {
  formRef.value.validate(async (errors) => {
    if (!errors) {
      const item = bindRuleList.value.find(item => item.id === detailFrom.value.bindingRuleId)
      let params = {...item, demoData: demoData.value}
      verifyValue.value = detailFrom.value.bindingType === '1' ? await verifyEncryptionRules(params) : await verifyDesensitizationRules(params)
      resultSpan.value = 12
    } else {
      message.error('验证失败，请填写完整信息')
    }
  })
}

const handleDetailTable = () => {
  formRef.value.validate(async (errors) => {
    if (!errors) {
      const newDetail = {
        fieldName: detailFrom.value.fieldName,
        fieldComment: detailFrom.value.fieldComment,
        bindingType: detailFrom.value.bindingType,
        bindingRuleId: detailFrom.value.bindingRuleId,
        bindingRuleName: detailFrom.value.bindingRuleName
      };

      const index = detailTable.value.findIndex(item => item.fieldName === newDetail.fieldName);

      if (index !== -1) {
        detailTable.value[index] = { ...detailTable.value[index], ...newDetail };
      } else {
        detailTable.value.push(newDetail);
      }
    } else {
      message.error('验证失败，请填写完整信息')
    }
  })
}

const handleRelease = async (row) => {
  let params = {
    id: row.id,
    effectiveStatus: !row.effectiveStatus
  }
  await effectiveDataLedger(params)
  await query(
      paginationReactive.value.tableName,
      paginationReactive.value.tableNotes,
      paginationReactive.value.effectiveStatus,
      paginationReactive.value.page,
      paginationReactive.value.pageSize
  )
}

const query = async (name, note, status = '', pageNum, pageSize) => {
  let params = {
    tableName: name,
    tableNotes: note,
    effectiveStatus: status,
    pageNum: pageNum,
    pageSize: pageSize
  }
  const data = await queryDataSecurityDataLedger(params)
  paginationReactive.value.itemCount = data.total
  dataList.value = data.totalList
}

const initData = async () => {
  await query(
      paginationReactive.value.tableName,
      paginationReactive.value.tableNotes,
      paginationReactive.value.effectiveStatus,
      paginationReactive.value.page,
      paginationReactive.value.pageSize
  )
}

const delConfirm = () => {
  ElMessageBox.confirm(
      '您将删除' + currentRow.value.tableName + '，是否继续？',
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

function addMetadata() {
  ifUpdate.value = false
  ifNameUpdate.value = false
  detailFrom.value.opperate = '新增'
  rules.value.tableName[1] = {
    async validator(validator, value) {
      let param = {
        tableName: value
      }
      await dataLedgerExists(param)
    },
    trigger: 'blur'
  }
  active.value = true
}

async function editMetadata() {
  detailFrom.value = {...currentRow.value, keyName: currentRow.value.updateFieldName?.split(',')}
  let params = {
    DataLedgerId: currentRow.value.id
  }
  detailTable.value = await getDataLedgerFiled(params) || []
  await updateDataSource(datasourceTypes.find(datasource => datasource.value === currentRow.value.dataSourceType)?.label)
  await updateSourceTableList(currentRow.value.dataSource)
  ifNameUpdate.value = true
  currentRow.value.effectiveStatus ? detailFrom.value.opperate = '查看' : detailFrom.value.opperate = '编辑'
  currentRow.value.effectiveStatus ? ifUpdate.value = true : ifUpdate.value = false
  rules.value.tableName[1] = {}
  active.value = true
}

async function deleteApi(row) {
  await deleteDataLedger({},row.id)
  message.info('删除成功')
  await query(
      paginationReactive.value.tableName,
      paginationReactive.value.tableNotes,
      paginationReactive.value.effectiveStatus,
      paginationReactive.value.page,
      paginationReactive.value.pageSize
  )
}

function handleCurrentChange(val) {
  currentRow.value = val
  ifDisableDelete.value = !(currentRow.value && currentRow.value.effectiveStatus === 0)
}

async function handlePageChange(currentPage, pageSize) {
  if (!loadingRef.value) {
    loadingRef.value = true
    paginationReactive.value.page = currentPage
    paginationReactive.value.pageSize = pageSize
    await query(
        paginationReactive.value.tableName,
        paginationReactive.value.tableNotes,
        paginationReactive.value.effectiveStatus,
        paginationReactive.value.page,
        paginationReactive.value.pageSize
    )
    loadingRef.value = false
  }
}

onMounted(() => {
  initData()
})

</script>

<style scoped lang="scss">

</style>
