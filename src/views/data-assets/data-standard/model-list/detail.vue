<template>
  <CrudForm :show-page="false" >
    <template v-slot:header>
      <CrudHeader :title="tableName"/>
    </template>
    <template v-slot:table>
      <NTabs
          type="line"
          size="large"
          :tabs-padding="20"
          class="n-tab-tips"
      >
        <n-tab-pane name="字段配置" display-directive="show" style="height: 100%; overflow: auto; padding-top: 8px">
          <div style="padding: 0 0 8px 8px">
            <NButton type="primary" size="small" color="#0099CB" @click="showEdit = !showEdit">新建字段</NButton>
            <NButton type="primary" size="small" color="#0099CB" @click="handleSqlModel" style="margin-left: 8px">DDL语句</NButton>
          </div>
          <el-table :data="tableData" row-key="englishName" id="dragTable" border class="my-custom-table">
            <el-table-column type="index" label="序号" width="50" align="center" />
            <el-table-column prop="englishName" label="英文名称" align="center" show-overflow-tooltip	/>
            <el-table-column prop="chineseName" label="中文名称" align="center" show-overflow-tooltip	/>
            <el-table-column prop="dataType" label="数据类型"  align="center"/>
            <el-table-column prop="fieldLength" label="长度"  align="center"/>
            <el-table-column prop="fieldAccuracy" label="精度"  align="center"/>
            <el-table-column prop="" label="数据标准"  align="center"/>
            <el-table-column prop="createTime" label="创建时间"  align="center"/>
            <el-table-column prop="updateTime" label="更新时间"  align="center"/>
            <el-table-column label="操作" align="center">
              <template #default="scope">
                <el-button size="small" @click="handleEdit(scope.row)">
                  编辑
                </el-button>
                <n-popconfirm
                    @positive-click="handlePositiveClick(scope.row)"
                    @negative-click="handleNegativeClick"
                >
                  <template #trigger>
                    <el-button
                        size="small"
                        type="danger"
                    >
                      删除
                    </el-button>
                  </template>
                  确定删除吗
                </n-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </n-tab-pane>
        <n-tab-pane name="可视化" style="height: 100%; display: grid; place-items: center ;overflow: auto">
          <div class="list-container">
            <div class="header">
              <NIcon size="22px" style="margin-right: 5px">
                <TableFreezeRow24Regular/>
              </NIcon>
              {{tableName}}
            </div>
            <ul class="list-items">
              <li v-for="item in tableData" :key="item.englishName" :title="item.englishName+dataTypeDisplay(item)" class="flex-container">
                <div class="info-left">
                  {{ item.englishName }}
                  <span class="type-color">{{ dataTypeDisplay(item) }}</span>
                </div>
                <div class="info-right" :title="item.chineseName">
                  <div class="ellipsis">{{ item.chineseName }}</div>
                </div>
              </li>
            </ul>
          </div>
        </n-tab-pane>
        <template #suffix>
          <div style="font-size: 12px; color: #757575; padding-right: 5px">
            <NIcon size="16px"><ArrowMove24Filled/></NIcon>
            拖动调整顺序
          </div>
        </template>
      </NTabs>
    </template>
  </CrudForm>
  <el-dialog v-model="showEdit" :width="700">
    <template #header> 字段配置 </template>
    <crudSplit class="titleSplit" title="选择字段创建类型" />
    <n-data-table
        bordered
        :single-line="false"
        :columns="[
          { type: 'selection', multiple: false },
          { title: '创建类型', key: 'API类型' }
        ]"
        :data="[
          {
            key: '手工创建',
            API类型: '手工创建'
          },
          {
            key: '从数据元中添加',
            API类型: '从数据元中添加'
          }
        ]"
        @update:checked-row-keys="handleCheck"
        :default-checked-row-keys="['手工创建']"
        style="margin-top: 10px"
    />
    <template #footer>
      <n-button color="#0099CB" type="primary" size="small" @click="openCheck">确定</n-button>
    </template>
  </el-dialog>
  <el-dialog v-model="showSqlModal">
    <template #header> 建表SQL </template>
    <Editor
        :value="taskData.createSql"
        :onUpdateValue = "(value) => taskData.createSql = value"
        :options="{ language: 'sql' }"
    />
    <template #footer>
      <n-space justify="end">
        <NButton size="small" @click="showSqlModal = false">取消</NButton>
        <NButton size="small" color='#3783c0' type="info" @click="executeTableSql">执行</NButton>
      </n-space>
    </template>
  </el-dialog>
  <el-dialog v-model="showEditArt" :before-close="metaDialogVisible" :width="600">
    <template #header> 手工{{ elementFormValue.operate }}字段 </template>
    <n-form
        :size="'small'"
        :model='elementFormValue'
        label-placement="left"
        require-mark-placement="left"
        :label-width="90"
        ref="formRef"
        :rules="rules"
    >
      <n-grid :cols="24" :x-gap="24">
        <n-form-item-gi :span="24" label="中文名称:" path="chineseName">
          <n-input v-model:value="elementFormValue.chineseName"/>
        </n-form-item-gi>
        <n-form-item-gi :span="24" label="英文名称:" path="englishName">
          <n-input v-model:value="elementFormValue.englishName"/>
        </n-form-item-gi>
        <n-form-item-gi :span="24" label="字段类型:" path="dataType">
          <n-select v-model:value="elementFormValue.dataType" :options="typeOptions"/>
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="长度:" path="fieldLength">
          <n-input-number v-model:value="elementFormValue.fieldLength" :min="0"/>
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="小数:" path="fieldAccuracy">
          <n-input-number v-model:value="elementFormValue.fieldAccuracy" :min="0"/>
        </n-form-item-gi>
      </n-grid>
    </n-form>
    <template #footer>
      <n-button color="#0099CB" type="primary" size="small" @click="createColumn(0)">确定</n-button>
    </template>
  </el-dialog>
  <el-dialog v-model="showEditElement" :before-close="metaDialogVisible" :width="600">
    <template #header> 数据元{{ elementFormValue.operate }}字段 </template>
    <n-form
        :size="'small'"
        :model='elementFormValue'
        label-placement="left"
        require-mark-placement="left"
        :label-width="90"
        ref="formRef"
        :rules="rules"
    >
      <n-grid :cols="24" :x-gap="24">
        <n-form-item-gi :span="24" label="中文名称:" path="chineseName">
          <n-select
              v-model:value="elementFormValue.chineseName"
              filterable
              placeholder="输入关键字后,才会进行搜索"
              :options="elementOptions"
              :loading="elementLoading"
              value-field	="chineseName"
              label-field="chineseName"
              clearable
              remote
              @search="handleElementSearch"
              @update:value="handleElementUpdate"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="24" label="英文名称:" path="englishName" >
          <n-input v-model:value="elementFormValue.englishName" :disabled="true"/>
        </n-form-item-gi>
        <n-form-item-gi :span="24" label="数据类型:" path="dataType">
          <n-select v-model:value="elementFormValue.dataType" :options="typeOptions" :disabled="true"/>
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="长度:" path="fieldLength">
          <n-input-number v-model:value="elementFormValue.fieldLength" :min="0"/>
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="小数:" path="fieldAccuracy">
          <n-input-number v-model:value="elementFormValue.fieldAccuracy" :min="0"/>
        </n-form-item-gi>
      </n-grid>
    </n-form>
    <template #footer>
      <n-button color="#0099CB" type="primary" size="small" @click="createColumn(1)">确定</n-button>
    </template>
  </el-dialog>
</template>

<script setup>

import CrudHeader from "@/components/cue/crud-header.vue";
import {onMounted, ref} from "vue";
import CrudForm from "@/components/cue/crud-form.vue";
import {ElButton} from "element-plus";
import Sortable from 'sortablejs';
import {TableFreezeRow24Regular, ArrowMove24Filled} from '@vicons/fluent'
import {NButton, NGrid, useMessage} from "naive-ui";
import CrudSplit from "@/components/cue/crud-split.vue";
import Editor from "@/components/monaco-editor";
import {
  createModelColumn, deleteModelColumn, modelTableCreate, modelTableExists,
  queryModelColumn, queryModelDataType, queryModelElementByName,
  queryStandardList, sortModelField, updateModelColumn
} from "@/service/modules/data-standard";

const message = useMessage()
const formRef = ref(null)
const showEdit = ref(false)
const showSqlModal = ref(false)
const checkRow = ref(['手工创建'])
const showEditArt = ref(false)
const showEditElement = ref(false)
const tableName = ref(history.state.tableName)
const elementOptions = ref([])
const elementLoading = ref(false)
const dataType = ref(0)

const elementFormValue = ref({
  chineseName: null,
  englishName: null,
  fieldLength: null,
  fieldAccuracy: null,
  dataType: null,
  modelId: history.state.modelId,
  fieldType: 0,
  operate: ''
})

const tableData = ref([])

const taskData = ref({
  createSql: ''
})

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

const rules = ref({
  chineseName: {
    required: true,
    message: '请输入名称',
    trigger: 'blur',
  },
  englishName: [{
    required: true,
    message: '请输入名称',
    trigger: 'blur'
  }],
  dataType: {
    required: true,
    message: '请选择类型',
    trigger: 'blur'
  },
})

const metaDialogVisible = () => {
  showEditElement.value = false
  showEditArt.value = false
  Object.keys(elementFormValue.value).forEach(key => {
    elementFormValue.value[key] = ''; // 将表单的所有响应式属性设置为空字符串
  });
}

const handleElementSearch = async (query) => {
  if (!query.length) {
    elementOptions.value = [];
    return;
  }

  elementLoading.value = true
  let params = {
    chineseName: query,
    pageNum: 1,
    pageSize: 4096,
    startTime: '',
    endTime: '',
    apiTreeId: 1,
    releaseStatus: 1
  }
  const data = await queryStandardList(params)
  elementOptions.value = data.totalList
  elementLoading.value = false
}

const handleElementUpdate = (value) => {
  elementOptions.value.forEach(option => {
    if (option.chineseName === value) {
      elementFormValue.value.englishName = option.englishName
      elementFormValue.value.dataType = option.dataTypeEn
    }
  })
}

const createColumn = async (flag) => {
  formRef.value.validate(async (errors) => {
    if (!errors) {
      elementFormValue.value.fieldType = flag
      if(elementFormValue.value.operate === '新建'){
        await createModelColumn(elementFormValue.value)
        message.info('成功')
      } else {
        await updateModelColumn(elementFormValue.value)
        message.info('成功')
      }
      metaDialogVisible()
      await initData()
    } else {
      message.error('验证失败，请填写完整信息')
    }
  })
}

const handlePositiveClick = async (row) => {
  let param = {
    id: row.id
  }
  await deleteModelColumn(param)
  message.info('成功')
  await initData()
}

const handleNegativeClick= () => {}

const handleSqlModel = () => {
  taskData.value.createSql = generateCreateTableSQL(tableData.value, history.state.englishName)
  showSqlModal.value= !showSqlModal.value
}

const executeTableSql = async () => {
  let tableName = {
    sqlStr: history.state.englishName
  }
  let tableDDL = {
    sqlStr: taskData.value.createSql
  }
  await modelTableExists(tableName)
  await modelTableCreate(tableDDL)
  message.info('创建成功')
  showSqlModal.value = !showSqlModal.value
}

function dataTypeDisplay(item) {
  let display = ` : ${item.dataType}`;
  if (item.fieldLength !== null && item.fieldLength !== undefined && item.fieldLength !== '') {
    if (item.fieldAccuracy !== null && item.fieldAccuracy !== undefined && item.fieldAccuracy !== '') {
      display += `(${item.fieldLength},${item.fieldAccuracy})`;
    } else {
      display += `(${item.fieldLength})`;
    }
  }
  return display;
}

function generateCreateTableSQL(tableData, tableName) {
  let sql = dataType.value === 0 || dataType.value === 2 ? `CREATE TABLE IF NOT EXISTS ${tableName} (\n` : `CREATE TABLE ${tableName} (\n`;

  tableData.forEach(field => {
    sql += `  ${field.englishName} ${field.dataType}`;

    if ( !!field.fieldLength && !!field.fieldAccuracy) {
      sql += `(${field.fieldLength}, ${field.fieldAccuracy})`;
    }
    // 处理需要长度的类型
    else if (!!field.fieldLength) {
      sql += `(${field.fieldLength})`;
    }

    // 添加注释
    if(dataType.value === 0) sql += ` COMMENT '${field.chineseName}'`;
    sql += ',\n';
  });

  // 移除最后一个逗号和换行符
  sql = sql.slice(0, -2) + '\n';

  dataType.value === 0 || dataType.value === 2 ? sql += `)` : sql += `);`;

  return sql;
}

function handleCheck(rowKeys) {
  checkRow.value = rowKeys
}

function openCheck() {
  rules.value.englishName[1] = {
    async validator(validator, value) {
      let param = {
        englishName: value,
        modelId: history.state.modelId
      }
      await queryModelElementByName(param)
    },
    trigger: 'blur'
  }
  elementFormValue.value.operate = '新建'
  elementFormValue.value.modelId = history.state.modelId
  if (checkRow.value[0] === '手工创建') {
    showEditArt.value = true
  } else {
    showEditElement.value = true
  }
}

function handleEdit(row) {
  rules.value.englishName[1] = {}
  elementFormValue.value = {...row}
  elementFormValue.value.operate = '修改'
  if (row.fieldType) {
    showEditElement.value = true
  } else {
    showEditArt.value = true
  }
}

async function queryDataType() {
  const data = await queryModelDataType()
  dataType.value = data.dataWareType || 0
  if (dataType.value === 12) {
    typeOptions.value = [
      {label: 'VARCHAR', value: 'VARCHAR'},
      {label: 'INT', value: 'INT'},
      {label: 'DOUBLE', value: 'DOUBLE'},
      {label: 'DECIMAL', value: 'DECIMAL'},
      {label: 'TIMESTAMP', value: 'TIMESTAMP'},
      {label: 'CHAR', value: 'CHAR'},
      {label: 'CLOB', value: 'CLOB'}
    ]
  } else if (dataType.value === 2) {
    typeOptions.value = [
      {label: 'STRING', value: 'STRING'},
      {label: 'DECIMAL', value: 'DECIMAL'}
    ]
  }
}

async function initData() {
  let params = {
    chineseName: '',
    startTime: '',
    endTime: '',
    pageNum: 1,
    pageSize: 4096,
    modelId: history.state.modelId
  }
  const data = await queryModelColumn(params)
  tableData.value = data.totalList
}

function setSort() {
  const tbody = document.querySelector('#dragTable table tbody');
  new Sortable(tbody, {
    animation: 150,
    sort: true,
    scroll: true,
    scrollSensitivity: 30,
    bubbleScroll: true,
    onEnd: async (e) => {
      const targetRow = tableData.value.splice(e.oldIndex, 1)[0]
      tableData.value.splice(e.newIndex, 0, targetRow)
      let param = {
        modelFieldList: tableData.value,
        modelId: history.state.modelId
      }
      await sortModelField(param)
      await initData()
    }
  });
}

onMounted(async () => {
  await initData()
  await queryDataType()
  setSort()
})
</script>

<style scoped lang="scss">
.my-custom-table {
  margin-bottom: 20px;
  :deep(.el-table__row:hover) {
    cursor: move;
  }
}

.list-container {
  border: 2px solid #3783c0;
  border-radius: 10px 10px 0 0;
  margin-bottom: 30px;
  width: 450px;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #3783c0;
  border-radius: 6px 6px 0 0;
  color: white;
  padding: 10px 0;
}

.list-items {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.list-items li {
  text-align: left;
  color: black;
  padding: 3px 8px;
  background-color: white;
  border-bottom: 1px solid #ccc
}

.type-color {
  color: gray;
}

.flex-container {
  display: flex;
  align-items: center; /* 垂直居中子元素 */
  transition: background-color 0.2s ease;

  &:hover {
    /* hover时的样式 */
    background-color: #f1f1f1; /* 鼠标悬停时的背景色 */
  }
}

.info-left {
  /* 这里可以添加一些内边距或边距来美化布局 */
  padding-right: 10px; /* 右侧内边距，以便与info-right有间隔 */
  width: 250px;
  white-space: nowrap; /* 防止文本换行 */
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
}

.info-right {
  text-align: left; /* 这将把.info-right推向右边 */
  /* 其他样式，如字体大小、颜色等 */
}

.ellipsis {
  width: 200px;
  white-space: nowrap; /* 防止文本换行 */
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
}

::-webkit-scrollbar {
  display: none;
}

.n-tab-tips {
  :deep(.n-tabs-nav__suffix) {
    align-items: end;
  }
}

.titleSplit {
  background: white !important;
  font-size: 14px !important;
  padding: 0 !important;
}

</style>
