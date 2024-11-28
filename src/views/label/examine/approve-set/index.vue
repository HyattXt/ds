<template>
  <CrudForm>
    <template v-slot:header>
      <CrudHeader
          title="我的申请 "
          :disableUpdate="!currentRow"
          :disableDelete="ifDisableDelete"
      >
        <template v-slot:button-group>
          <div>
            <el-button
                class="show-text el-button--default"
                @click="handleSet"
            >
              审批配置
            </el-button>
          </div>
        </template>
      </CrudHeader>
    </template>
    <template v-slot:condition>
      <el-form inline>
        <el-form-item label="用户名称">
          <el-input
              v-model="paginationReactive.searchVal"
              clearable
              style="width: 180px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="角色类型">
          <el-select
              v-model="paginationReactive.approvalUserType"
              clearable
              style="width: 180px"
              popper-class="form-item-select"
          >
            <el-option label="管理员" :value="1"/>
            <el-option label="开发" :value="2"/>
          </el-select>
        </el-form-item>
        <el-button color="#0099CB" class="cue-crud__header-query" type="primary" size="default"
                   :icon="Search" @click="handlePageChange(1, paginationReactive.pageSize)" >查询
        </el-button>
      </el-form>
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
  <el-dialog :before-close="metaDialogVisible" v-model="active" width="30%" append-to-body class="model-form-wrapper">
    <template #header> 角色赋权 </template>
    <n-form
        :size="'small'"
        :model='formValue'
        label-placement="left"
        require-mark-placement="left"
        :label-width="80"
        ref="formRef"
    >
      <n-form-item label="用户名称:" path="userName">
        <n-input v-model:value="formValue.userName" disabled/>
      </n-form-item>
      <n-form-item label="用户角色:" path="approvalUserType">
        <n-select v-model:value="formValue.approvalUserType" :options="[{label: '开发', value: 2 },{label: '管理员', value: 1 }]"/>
      </n-form-item>
      <n-form-item label="备注:" path="approvalAuthorizationRemarks">
        <n-input v-model:value="formValue.approvalAuthorizationRemarks" type="textarea"/>
      </n-form-item>
    </n-form>
    <template #footer>
      <n-button color="#0099CB" type="primary" size="small"  @click="handleUserAuthorization">确定</n-button>
    </template>
  </el-dialog>
  <el-dialog :before-close="metaDialogVisible" v-model="ifShowSet" width="30%" append-to-body class="model-form-wrapper">
    <template #header> 选择需审批对象 </template>
    <n-data-table
        bordered
        :single-line="false"
        :columns="[
        { type: 'selection' },
        { title: '对象类型', key: 'type' },
        { title: '描述', key: 'comment' }
      ]"
        :data="[
        {
          key: 1,
          type: '数据标签',
          comment: '支持多种新建标签形式，创建用户需求标签'
        },
        {
          key: 2,
          type: '用户群组',
          comment: '根据标签处理对应用户群组'
        },
        {
          key: 3,
          type: '自定义分析',
          comment: '根据对应标签以及用户群组，处理用户用水分析'
        }
      ]"
        v-model:checked-row-keys="checkedRowKeys"
        @update:checked-row-keys="handleCheck"
        style="margin-top: 10px"
    />
    <template #footer>
      <n-button color="#0099CB" type="primary" size="small" @click="handleApprovalConfig">确定</n-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, reactive, onMounted, h} from 'vue'
import {
  NButton,
  useMessage
} from 'naive-ui'
import CrudTable from "@/components/cue/crud-table.vue";
import {ElButton, ElMessageBox, ElSwitch} from "element-plus";
import CrudForm from "@/components/cue/crud-form.vue";
import CrudHeader from "@/components/cue/crud-header.vue";
import CrudPage from "@/components/cue/crud-page.vue";
import {Search} from "@element-plus/icons-vue";
import {queryUserList} from "@/service/modules/users";
import {queryApprovalConfig, updateApprovalConfig, userAuthorization} from "@/service/modules/data-bussiness";

const formRef = ref(null)
const loadingRef = ref(false)
const active = ref(false)
const ifShowSet = ref(false)
const checkedRowKeys = ref([])
const approvalConfig = ref([
  {
    configurationType: 1,
    configurationStatus: ''
  },
  {
    configurationType: 2,
    configurationStatus: ''
  },
  {
    configurationType: 3,
    configurationStatus: ''
  }
])
const currentRow = ref()
const ifDisableDelete = ref(true)
const ifDisableUpdate = ref(true)
const formValue = ref({
  userId: '',
  userName: '',
  approvalUserType: 2,
  approvalAuthorizationRemarks: ''
})
const tableData = ref([])
const paginationReactive = reactive({
  page: 1,
  pageCount: 1,
  pageSize: 10,
  itemCount: 0,
  searchVal: '',
  approvalUserType: ''
})

const columns =  [
  {
    label: '用户名称',
    prop: 'userName'
  },
  {
    label: '手机',
    prop: 'phone'
  },
  {
    label: '邮箱',
    prop: 'email'
  },
  {
    label: '审批角色',
    prop: 'approvalUserType',
    slots: (row) => {
      switch (row.approvalUserType) {
        case 1: return '管理员'
        case 2: return '开发'
        default: return ''
      }
    }
  },
  {
    label: '创建时间',
    prop: 'createTime'
  },
  {
    label: '授权时间',
    prop: 'updateTime'
  },
  {
    label: '授权用户',
    prop: 'authorizationUser'
  },
  {
    label: '备注',
    prop: 'approvalAuthorizationRemarks',
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
            onClick: () => editMetadata(row)
          },
          { default: ()=> '授权' }
      )
    }
  }
]

const message = useMessage()

const handleUserAuthorization = async () => {
  let params = {...formValue.value}
  await userAuthorization(params)
  message.info('成功')
  metaDialogVisible()
  await query(
      paginationReactive.page,
      paginationReactive.pageSize,
      paginationReactive.searchVal,
      paginationReactive.approvalUserType
  )
}

async function query(
    pageNo,
    pageSize,
    searchVal,
    approvalUserType
) {
  const data = await queryUserList({
    pageNo: pageNo,
    pageSize: pageSize,
    searchVal: searchVal,
    approvalUserType: approvalUserType
  })
  tableData.value = data.totalList
  paginationReactive.itemCount = data.total
}

async function querySet() {
  const data = await queryApprovalConfig()
  data.forEach((item) => {
    if(item.configurationStatus) {
      checkedRowKeys.value.push(item.configurationStatus)
    }
  })
}

function metaDialogVisible () {
  active.value = false
  formRef.value?.restoreValidation()
  Object.keys(formValue.value).forEach(key => {
    formValue.value[key] = ''; // 将表单的所有响应式属性设置为空字符串
  });
}

function handleSet () {
  ifShowSet.value = true
}

async function handlePageChange(currentPage, pageSize) {
  if (!loadingRef.value) {
    loadingRef.value = true
    paginationReactive.page = currentPage
    paginationReactive.pageSize = pageSize
    await query(
        paginationReactive.page,
        paginationReactive.pageSize,
        paginationReactive.searchVal,
        paginationReactive.approvalUserType
    )
    loadingRef.value = false
  }
}

const handleApprovalConfig = async () => {
  let params = {
    approvalArray: approvalConfig.value
  }
  await updateApprovalConfig(params)
  message.info('成功')
  ifShowSet.value = false
}

const handleCheck = (rowKeys) => {
  approvalConfig.value.forEach(item => {
    item.configurationStatus = ''
  })

  rowKeys.forEach(key => {
    const item = approvalConfig.value.find(item => item.configurationType === key);
    if (item) {
      item.configurationStatus = String(key); // 将 configurationStatus 设置为 key 的字符串形式
    }
  })
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

function editMetadata(row) {
  formValue.value.userId = row.id
  formValue.value.userName = row.userName
  formValue.value.approvalUserType = row.approvalUserType
  formValue.value.approvalAuthorizationRemarks = row.approvalAuthorizationRemarks
  active.value = true
}

onMounted(() => {
  handlePageChange(1, 30)
  querySet()
})
</script>

<style lang="scss" scoped>

.el-line-height {
  :deep(.el-form-item__content) {
    line-height: 28px;
  }
}

</style>
