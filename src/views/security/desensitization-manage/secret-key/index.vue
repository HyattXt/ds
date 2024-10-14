<template>
  <CrudForm>
    <template v-slot:header>
      <CrudHeader title="密钥管理"/>
    </template>
    <template v-slot:condition>
      <el-form inline>
        <el-form-item label="加密算法">
          <el-input type="text" style="width: 180px" clearable v-model="paginationReactive.encryptionAlgorithmName"/>
        </el-form-item>
        <el-form-item label="是否国密">
          <el-select
              v-model="paginationReactive.encryptionAlgorithmType"
              clearable
              style="width: 180px"
              popper-class="form-item-select"
          >
            <el-option label="是" value="是"/>
            <el-option label="否" value="否"/>
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

import {Search} from "@element-plus/icons-vue";
import CrudForm from "@/components/cue/crud-form.vue";
import CrudPage from "@/components/cue/crud-page.vue";
import {ElButton} from "element-plus";
import CrudHeader from "@/components/cue/crud-header.vue";
import CrudTable from "@/components/cue/crud-table.vue";
import {ref, onMounted} from "vue";
import {queryDataSecurityEncryption} from "@/service/modules/desensitization";

const active = ref(false)
const loadingRef = ref(false)
const paginationReactive = ref({
  encryptionAlgorithmName: '',
  encryptionAlgorithmType: '',
  page: 1,
  pageSize: 30,
  itemCount: 0
})

const columns =  [
  {
    label: '加密算法',
    prop: 'encryptionAlgorithmName'
  },
  {
    label: '是否国密',
    prop: 'encryptionAlgorithmType'
  },
  {
    label: '创建人',
    prop: 'creator'
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
    label: '加密包',
    prop: 'encryptionPackage',
  }
]

const dataList = ref([])

const query = async (name, type = '', pageNum, pageSize) => {
  let params = {
    encryptionAlgorithmName: name,
    encryptionAlgorithmType: type,
    pageNum: pageNum,
    pageSize: pageSize
  }
  const data = await queryDataSecurityEncryption(params)
  paginationReactive.value.itemCount = data.total
  dataList.value = data.totalList
}

const initData = async () => {
  await query(
      paginationReactive.value.encryptionAlgorithmName,
      paginationReactive.value.encryptionAlgorithmType,
      paginationReactive.value.page,
      paginationReactive.value.pageSize
  )
}

async function handlePageChange(currentPage, pageSize) {
  if (!loadingRef.value) {
    loadingRef.value = true
    paginationReactive.value.page = currentPage
    paginationReactive.value.pageSize = pageSize
    await query(
        paginationReactive.value.encryptionAlgorithmName,
        paginationReactive.value.encryptionAlgorithmType,
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
