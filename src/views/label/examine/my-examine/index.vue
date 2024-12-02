<template>
  <CrudForm>
    <template v-slot:header>
      <CrudHeader
          title="待我审批"
      />
    </template>
    <template v-slot:condition>
      <el-form inline>
        <el-form-item label="审批类型">
          <el-select
              v-model="paginationReactive.approvalType"
              clearable
              style="width: 180px"
              popper-class="form-item-select"
          >
            <el-option label="数据标签" :value="1"/>
            <el-option label="用户群组" :value="2"/>
            <el-option label="自定义分析" :value="3"/>
          </el-select>
        </el-form-item>
        <el-form-item label="申请人">
          <el-input
              v-model="paginationReactive.userName"
              style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="对象名称">
          <el-input
              v-model="paginationReactive.objName"
              style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="申请时间" class="el-line-height">
          <NDatePicker
              size='small'
              type='datetimerange'
              clearable
              v-model:value="applicationDate"
              @update:value="handleApplicationDate"
          />
        </el-form-item>
        <el-form-item label="审批时间" class="el-line-height">
          <NDatePicker
              size='small'
              type='datetimerange'
              clearable
              v-model:value="approvalDate"
              @update:value="handleApprovalDate"
          />
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
</template>

<script setup>
import {ref, reactive, onMounted, h} from 'vue'
import { useRouter } from 'vue-router'
import {
  useMessage,
  NTag
} from 'naive-ui'
import CrudTable from "@/components/cue/crud-table.vue";
import {ElButton} from "element-plus";
import CrudForm from "@/components/cue/crud-form.vue";
import CrudHeader from "@/components/cue/crud-header.vue";
import CrudPage from "@/components/cue/crud-page.vue";
import utils from "@/utils";
import {Search} from "@element-plus/icons-vue";
import {queryApprovalList} from "@/service/modules/data-bussiness";

const loadingRef = ref(false)
const currentRow = ref()
const ifDisableDelete = ref(true)
const ifDisableUpdate = ref(true)
const router = useRouter()
const tableData = ref([])
const applicationDate = ref(null)
const approvalDate = ref(null)
const paginationReactive = reactive({
  page: 1,
  pageCount: 1,
  pageSize: 10,
  itemCount: 0,
  approvalStatus: '',
  approvalType: '',
  userName: '',
  objName: '',
  applicationTimeStart: '',
  applicationTimeEnd: '',
  approvalTimeStart: '',
  approvalTimeEnd: '',
  approvalMenu: '3'
})

const columns =  [
  {
    label: '对象名称',
    prop: 'objName'
  },
  {
    label: '审批类型',
    prop: 'approvalType',
    slots: (row) => {
      switch (row.approvalType) {
        case '1': return h("div",'数据标签')
        case '2': return h("div",'用户群组')
        case '3' : return h("div",'自定义分析')
      }
    }
  },
  {
    label: '审批状态',
    prop: 'approvalStatus',
    width: 100,
    slots: (row) => {
      let approvalStatus
      let approvalColor
      switch (row.approvalStatus) {
        case 1: {approvalStatus = '已同意'; approvalColor = 'success'} break
        case 2: {approvalStatus = '审批中'; approvalColor = 'info'} break
        case 3: {approvalStatus = '已拒绝'; approvalColor = 'error'} break
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
    label: '申请人',
    prop: 'userName',
  },
  {
    label: '申请日期',
    prop: 'applicationTime',
  },
  {
    label: '审批用户',
    prop: 'approver',
    width: 100
  },
  {
    label: '审批日期',
    prop: 'approvalTime'
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
            onClick: () => editDetail(row)
          },
          { default: ()=> '审批' }
      )
    }
  }
]

const handleApplicationDate = () => {
  if(!!applicationDate.value) {
    paginationReactive.applicationTimeStart = utils.formatTimestamp(applicationDate.value[0])
    paginationReactive.applicationTimeEnd = utils.formatTimestamp(applicationDate.value[1])
  } else {
    paginationReactive.applicationTimeStart = paginationReactive.applicationTimeEnd = ''
  }
}

const handleApprovalDate = () => {
  if(!!applicationDate.value) {
    paginationReactive.approvalTimeStart = utils.formatTimestamp(approvalDate.value[0])
    paginationReactive.approvalTimeEnd = utils.formatTimestamp(approvalDate.value[1])
  } else {
    paginationReactive.approvalTimeStart = paginationReactive.approvalTimeEnd = ''
  }
}

const editDetail = (row) => {
  let approvalType
  let approvalStatus
  let approvalColor
  switch (row.approvalType) {
    case '1': {approvalType = '数据标签'} break
    case '2': {approvalType = '用户群组'} break
    case '3': {approvalType = '自定义分析'} break
  }
  switch (row.approvalStatus) {
    case 1: {approvalStatus = '已同意'; approvalColor = 'success'} break
    case 2: {approvalStatus = '审批中'; approvalColor = 'info'} break
    case 3: {approvalStatus = '已拒绝'; approvalColor = 'error'} break
  }
  router.push({
        name: 'examine-detail',
        state: {
          id: row.id,
          objName: row.objName,
          approvalType: approvalType,
          approvalTypeCode: row.approvalType,
          objNum: row.objNum,
          approvalStatus: approvalStatus,
          approvalColor: approvalColor,
          applicationTime: row.applicationTime,
          userName: row.userName,
          approver: row.approver,
          approvalTime: row.approvalTime,
          reasonForApplication: row.reasonForApplication,
          approvalOpinion: row.approvalOpinion,
          ifEdit: true,
        },
        query: {back: true}
      }
  )
}

async function query(
    approvalStatus,
    pageNum,
    pageSize,
    approvalType,
    userName,
    objName,
    applicationTimeStart,
    applicationTimeEnd,
    approvalTimeStart,
    approvalTimeEnd,
    approvalMenu
) {
  const params = {
    approvalStatus: approvalStatus,
    pageNum: pageNum,
    pageSize: pageSize,
    approvalType: approvalType,
    userName: userName,
    objName: objName,
    applicationTimeStart: applicationTimeStart,
    applicationTimeEnd: applicationTimeEnd,
    approvalTimeStart: approvalTimeStart,
    approvalTimeEnd: approvalTimeEnd,
    approvalMenu: approvalMenu
  }
  const data = await queryApprovalList(params)
  tableData.value = data.totalList
  paginationReactive.itemCount = data.total
}

async function handlePageChange(currentPage, pageSize) {
  if (!loadingRef.value) {
    loadingRef.value = true
    paginationReactive.page = currentPage
    paginationReactive.pageSize = pageSize
    await query(
        paginationReactive.approvalStatus,
        paginationReactive.page,
        paginationReactive.pageSize,
        paginationReactive.approvalType,
        paginationReactive.userName,
        paginationReactive.objName,
        paginationReactive.applicationTimeStart,
        paginationReactive.applicationTimeEnd,
        paginationReactive.approvalTimeStart,
        paginationReactive.approvalTimeEnd,
        paginationReactive.approvalMenu
    )
    loadingRef.value = false
  }
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

onMounted(() => {
  handlePageChange(1, 30)
})
</script>

<style lang="scss" scoped>

.el-line-height {
  :deep(.el-form-item__content) {
    line-height: 28px;
  }
}

</style>
