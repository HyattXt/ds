<template>
  <CrudForm>
    <template v-slot:header>
      <CrudHeader
          title="脱敏管理"
          addButton updateButton deleteButton
          :disableUpdate="!currentRow"
          :disableDelete="ifDisableDelete"
          @add-event="addMetadata" @update-event="editMetadata" @delete-event="delConfirm"
      />
    </template>
    <template v-slot:condition>
      <el-form inline>
        <el-form-item label="脱敏规则名称">
          <el-input type="text" style="width: 180px" clearable v-model="paginationReactive.desensitizationRuleName"/>
        </el-form-item>
        <el-form-item label="脱敏方式">
          <el-select
              v-model="paginationReactive.desensitizationMethod"
              clearable
              style="width: 180px"
              popper-class="form-item-select"
          >
            <el-option label="哈希" value="1"/>
            <el-option label="掩盖" value="2"/>
          </el-select>
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
  <el-dialog v-model="active" :before-close="dialogVisible" append-to-body width="600" class="model-form-wrapper">
    <template #header>  {{ detailForm.opperate }} 脱敏规则 </template>
    <n-form
        :size="'small'"
        label-placement="left"
        :label-width="120"
        require-mark-placement="left"
        ref="formRef"
        :model="detailForm"
        :rules="rules"
        :disabled="ifUpdate"
    >
      <n-grid :cols="12" :x-gap="24">
        <n-form-item-gi :span="12" label="脱敏规则名称:" path="desensitizationRuleName">
          <n-input v-model:value="detailForm.desensitizationRuleName" placeholder="请输入" :disabled="ifNameUpdate"/>
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="脱敏方式:" path="desensitizationMethod">
          <n-radio-group v-model:value="detailForm.desensitizationMethod" @update:value="handleDesensitizationMethod">
            <n-space>
              <n-radio value="1">
                哈希
              </n-radio>
              <n-radio value="2">
                掩盖
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item-gi>
        <n-form-item-gi :span="desMethodSpan" key='concealingType' label="掩盖方式:" path="concealingType">
          <n-select
              size="small"
              v-model:value="detailForm.concealingType"
              @update:value="handleDesMethod"
              :options="[
                  { label: '全部掩盖', value: 4 },
                  { label: '掩盖中间', value: 1 },
                  { label: '掩盖头尾', value: 2 },
                  { label: '特殊字符掩盖', value: 3 },
              ]"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="hideSpan" key='d'>
          <n-form :model="wordCount" :rules="detailFormRules" ref="detailFormRef" class="detail-list">
            <div style="display: flex; flex-direction: column; margin-left: 110px">
            <div v-if="ifMiddle" style="display: inline-flex; align-items: center;">
              <n-radio @change="handleConcealingTypeChild" :checked="detailForm.concealingTypeChild === 1" :value=1 >
                头尾均保留
              </n-radio>
              <n-form-item path="n1" :show-feedback="false"	>
                <n-input-number size="tiny" min="1" v-model:value="wordCount.n1" placeholder="" style="width: 75px; margin: 0 6px 0 0;"></n-input-number>
                位
              </n-form-item>
            </div>
            <div v-if="ifMiddle" style="display: inline-flex; align-items: center">
              <n-radio @change="handleConcealingTypeChild" :checked="detailForm.concealingTypeChild === 2" :value="2" >
                头部保留
              </n-radio>
              <n-form-item path="n2" :show-feedback="false">
                <n-input-number size="tiny" min="1" v-model:value="wordCount.n2" placeholder="" style="width: 75px; margin: 0 6px 0 0;"></n-input-number>
                位, 尾部保留
              </n-form-item>
              <n-form-item path="n3" :show-feedback="false">
                <n-input-number size="tiny" min="1" v-model:value="wordCount.n3" placeholder="" style="width: 75px; margin: 0 6px 0 6px;"></n-input-number>
                位
              </n-form-item>
            </div>
            <div v-if="ifBetween" style="display: inline-flex; align-items: center;">
              <n-radio @change="handleConcealingTypeChild" :checked="detailForm.concealingTypeChild === 3" :value="3" >
                保留中间
              </n-radio>
              <n-form-item path="n4" :show-feedback="false"	>
                <n-input-number size="tiny" min="1" v-model:value="wordCount.n4" placeholder="" style="width: 75px; margin: 0 6px 0 0;"></n-input-number>
                位
              </n-form-item>
            </div>
            <div v-if="ifBetween" style="display: inline-flex; align-items: center;">
              <n-radio @change="handleConcealingTypeChild" :checked="detailForm.concealingTypeChild === 4" :value="4" >
                头部掩盖
              </n-radio>
              <n-form-item path="n5" :show-feedback="false"	>
                <n-input-number size="tiny" min="1" v-model:value="wordCount.n5" placeholder="" style="width: 75px; margin: 0 6px 0 0;"></n-input-number>
                位, 尾部掩盖
              </n-form-item>
              <n-form-item path="n6" :show-feedback="false"	>
                <n-input-number size="tiny" min="1" v-model:value="wordCount.n6" placeholder="" style="width: 75px; margin: 0 6px 0 6px;"></n-input-number>
                位
              </n-form-item>
            </div>
            <div v-if="ifSpecial" style="display: inline-flex; align-items: center;">
              <n-radio @change="handleConcealingTypeChild" :checked="detailForm.concealingTypeChild === 5" :value="5" >
                特殊字符
              </n-radio>
              <n-form-item path="n7" :show-feedback="false"	>
                <n-input size="tiny" min="1" v-model:value="wordCount.n7" placeholder="" style="width: 75px; margin: 0 6px 0 0;"></n-input>
                前掩盖
              </n-form-item>
            </div>
            <div v-if="ifSpecial" style="display: inline-flex; align-items: center;">
              <n-radio @change="handleConcealingTypeChild" :checked="detailForm.concealingTypeChild === 6" value=6 >
                特殊字符
              </n-radio>
              <n-form-item path="n8" :show-feedback="false"	>
                <n-input size="tiny" min="1" v-model:value="wordCount.n8" placeholder="" style="width: 75px; margin: 0 6px 0 0;"></n-input>
                后掩盖
              </n-form-item>
            </div>
            <div v-if="ifSpecial" style="display: inline-flex; align-items: center;">
              <n-radio @change="handleConcealingTypeChild" :checked="detailForm.concealingTypeChild === 7" :value="7" >
                只保留特殊字符
              </n-radio>
              <n-form-item path="n9" :show-feedback="false"	>
                <n-input size="tiny" min="1" v-model:value="wordCount.n9" placeholder="" style="width: 75px; margin: 0 6px 0 0;"></n-input>
              </n-form-item>
            </div>
            <div v-if="ifSpecial" style="display: inline-flex; align-items: center;">
              <n-radio @change="handleConcealingTypeChild" :checked="detailForm.concealingTypeChild === 8" :value="8" >
                只掩盖特殊字符
              </n-radio>
              <n-form-item path="n10" :show-feedback="false"	>
                <n-input size="tiny" min="1" v-model:value="wordCount.n10" placeholder="" style="width: 75px; margin: 0 6px 0 0;"></n-input>
              </n-form-item>
            </div>
          </div>
          </n-form>
        </n-form-item-gi>
        <n-form-item-gi :span="desMethodSpan" key='concealingCharacters' label="掩盖字符:" path="concealingCharacters">
          <n-radio-group v-model:value="detailForm.concealingCharacters">
            <n-radio-button value="*" label="*"/>
            <n-radio-button value="·" label="·"/>
            <n-radio-button value="+" label="+"/>
            <n-radio-button value="×" label="×"/>
          </n-radio-group>
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="通用字段特征:" path="fieldCharacteristics">
          <n-input v-model:value="detailForm.fieldCharacteristics"/>
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="样本数据:" path="g">
          <n-input-group>
            <n-input v-model:value="demoData" placeholder="输入样本数据，点击脱敏验证后查看脱敏结果"/>
            <n-button type="info" quaternary @click="handleDesVerify" :disabled="ifUpdate">
              脱敏验证
            </n-button>
          </n-input-group>
        </n-form-item-gi>
        <n-form-item-gi :span="resultSpan" label="验证结果:" path="indicatorAffiliatedSys">
            <n-input v-model:value="verifyValue" disabled placeholder="无结果">
            </n-input>
        </n-form-item-gi>
      </n-grid>
    </n-form>
    <template #footer>
      <n-button color="#0099CB" type="primary" size="small" :disabled="ifUpdate" @click="createRule">确定</n-button>
    </template>
  </el-dialog>
  <el-dialog v-model="listFormModal"  append-to-body width="800" class="model-form-wrapper">
    <template #header> 规则绑定明细 </template>
    <n-data-table
        :columns="listFormColumns"
        :data="listForm"
        :max-height="300"
        :single-line="false"
    />
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
import {NButton, NGrid, useMessage} from "naive-ui";
import {
  deleteDesensitizationRules,
  desensitizationUsed,
  effectiveDesensitizationRules,
  insertDesensitizationRules,
  queryDataSecurityDesensitizationRules,
  queryDesensitizationUsedList,
  ruleNameExists,
  updateDesensitizationRules,
  verifyDesensitizationRules
} from "@/service/modules/desensitization";

const active = ref(false)
const hideSpan = ref(0)
const ifMiddle = ref(false)
const ifBetween = ref(false)
const ifSpecial = ref(false)
const resultSpan = ref(0)
const desMethodSpan = ref(0)
const loadingRef = ref(false)
const currentRow = ref()
const verifyValue = ref('')
const demoData = ref('')
const ifDisableDelete = ref(true)
const ifNameUpdate = ref(false)
const ifUpdate = ref(false)
const formRef = ref()
const detailFormRef = ref()
const message = useMessage()
const listForm = ref([])
const listFormModal = ref(false)
const paginationReactive = ref({
  desensitizationRuleName: '',
  desensitizationMethod: '',
  effectiveStatus: '',
  page: 1,
  pageSize: 30,
  itemCount: 0
})

const wordCount = ref({
  n1: null,
  n2: null,
  n3: null,
  n4: null,
  n5: null,
  n6: null,
  n7: null,
  n8: null,
  n9: null,
  n10: null
})

const columns =  [
  {
    label: '脱敏规则名称',
    prop: 'actions',
    slots: (row) => {
      return [h(
          ElButton,
          {
            class: 'el-button--text',
            size: 'small',
            onClick: () => openList(row.id)
          },
          { default: ()=> row.desensitizationRuleName }
      )]
    }
  },
  {
    label: '脱敏方式',
    prop: 'desensitizationMethod',
    slots: (row) => {
      if(row.desensitizationMethod === '1') {
        return '哈希'
      } else {
        switch(row.concealingType){
          case 4:
            return '全部掩盖'
          case 1:
            return '掩盖中间'
          case 2:
            return '掩盖头尾'
          case 3:
            return '特殊字符掩盖'
        }
      }
    }
  },
  {
    label: '掩盖字符',
    prop: 'concealingCharacters'
  },
  {
    label: '通用字段特征',
    prop: 'fieldCharacteristics'
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
    prop: 'createTime',
  }
]

const listFormColumns = [
  {
    title: '#',
    key: 'index',
    width: 40,
    render: (row, index) => index + 1
  },
  {
    title: "字段名",
    key: "fieldName",
    width: 150,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: "表名",
    key: "tableName"
  },
  {
    title: "注释",
    key: "tableNotes"
  }
]

const dataList = ref([])

const detailForm = ref({
  desensitizationRuleName: '',
  desensitizationMethod: '1',
  concealingCharacters: '',
  concealingType: null,
  concealingTypeChild: null,
  concealingNumber1: null,
  concealingNumber2: null,
  fieldCharacteristics: '',
  effectiveStatus: 0
})

const rules = ref({
  desensitizationRuleName: [{
    required: true,
    message: '请输入',
    trigger: 'blur'
  }],
  desensitizationMethod: {
    required: true,
    message: '请选择',
    trigger: 'blur'
  },
  concealingCharacters: {
    required: true,
    message: '请选择',
    trigger: 'blur'
  },
  concealingType: {
    required: true,
    type: 'number',
    message: '请选择',
    trigger: 'blur'
  }
})

const detailFormRules = {
  n1 : createValidator(1, 'n1'),
  n2 : createValidator(2, 'n2'),
  n3 : createValidator(2, 'n3'),
  n4 : createValidator(3, 'n4'),
  n5 : createValidator(4, 'n5'),
  n6 : createValidator(4, 'n6'),
  n7 : createValidator(5, 'n7'),
  n8 : createValidator(6, 'n8'),
  n9 : createValidator(7, 'n9'),
  n10 : createValidator(8, 'n10')
}

const handleDesensitizationMethod = (value) => {
  switch (value) {
    case '1' :
      ifMiddle.value = false
      ifBetween.value = false
      ifSpecial.value = false
      hideSpan.value = 0
      desMethodSpan.value = 0
      break;
    case '2' :
      ifMiddle.value = false
      ifBetween.value = false
      ifSpecial.value = false
      hideSpan.value = 0
      desMethodSpan.value = 12
      break;
  }
}

const handleConcealingTypeChild = (e) => {
  detailForm.value.concealingTypeChild = Number(e.target.value)
}

const handleDesMethod = (value) => {
  switch (value) {
    case 4 :
      ifMiddle.value = false
      ifBetween.value = false
      ifSpecial.value = false
      hideSpan.value = 0
      detailForm.value.concealingTypeChild = 9
      break;
    case 1 :
      ifMiddle.value = true
      ifBetween.value = false
      ifSpecial.value = false
      hideSpan.value = 12
      detailForm.value.concealingTypeChild = null
      break;
    case 2 :
      ifMiddle.value = false
      ifBetween.value = true
      ifSpecial.value = false
      hideSpan.value = 12
      detailForm.value.concealingTypeChild = null
      break;
    case 3 :
      ifMiddle.value = false
      ifBetween.value = false
      ifSpecial.value = true
      hideSpan.value = 12
      detailForm.value.concealingTypeChild = null
      break;
  }
}

const handleInitDesMethod = (value) => {
  switch (value) {
    case 4 :
      ifMiddle.value = false
      ifBetween.value = false
      ifSpecial.value = false
      hideSpan.value = 0
      break;
    case 1 :
      ifMiddle.value = true
      ifBetween.value = false
      ifSpecial.value = false
      hideSpan.value = 12
      break;
    case 2 :
      ifMiddle.value = false
      ifBetween.value = true
      ifSpecial.value = false
      hideSpan.value = 12
      break;
    case 3 :
      ifMiddle.value = false
      ifBetween.value = false
      ifSpecial.value = true
      hideSpan.value = 12
      break;
  }
}

const setNumber = () => {
  switch (detailForm.value.concealingType) {
    case 1 :
      switch (detailForm.value.concealingTypeChild) {
        case 1 :
          detailForm.value.concealingNumber1 = wordCount.value.n1
          detailForm.value.concealingNumber2 = null
          break
        case 2 :
          detailForm.value.concealingNumber1 = wordCount.value.n2
          detailForm.value.concealingNumber2 = wordCount.value.n3
          break
      }
      break
    case 2 :
      switch (detailForm.value.concealingTypeChild) {
        case 3 :
          detailForm.value.concealingNumber1 = wordCount.value.n4
          detailForm.value.concealingNumber2 = null
          break
        case 4 :
          detailForm.value.concealingNumber1 = wordCount.value.n5
          detailForm.value.concealingNumber2 = wordCount.value.n6
          break
      }
      break
    case 3 :
      switch (detailForm.value.concealingTypeChild) {
        case 5 :
          detailForm.value.concealingNumber1 = wordCount.value.n7
          detailForm.value.concealingNumber2 = null
          break
        case 6 :
          detailForm.value.concealingNumber1 = wordCount.value.n8
          detailForm.value.concealingNumber2 = null
          break
        case 7 :
          detailForm.value.concealingNumber1 = wordCount.value.n9
          detailForm.value.concealingNumber2 = null
          break
        case 8 :
          detailForm.value.concealingNumber1 = wordCount.value.n10
          detailForm.value.concealingNumber2 = null
          break
      }
      break
  }
}

const setWordCount = () => {
  switch (detailForm.value.concealingType) {
    case 1 :
      switch (detailForm.value.concealingTypeChild) {
        case 1 :
          wordCount.value.n1 = detailForm.value.concealingNumber1
          break
        case 2 :
          wordCount.value.n2 = detailForm.value.concealingNumber1
          wordCount.value.n3 = detailForm.value.concealingNumber2
          break
      }
      break
    case 2 :
      switch (detailForm.value.concealingTypeChild) {
        case 3 :
          wordCount.value.n4 = detailForm.value.concealingNumber1
          break
        case 4 :
          wordCount.value.n5 = detailForm.value.concealingNumber1
          wordCount.value.n6 = detailForm.value.concealingNumber2
          break
      }
      break
    case 3 :
      switch (detailForm.value.concealingTypeChild) {
        case 5 :
          wordCount.value.n7 = detailForm.value.concealingNumber1
          break
        case 6 :
          wordCount.value.n8 = detailForm.value.concealingNumber1
          break
        case 7 :
          wordCount.value.n9 = detailForm.value.concealingNumber1
          break
        case 8 :
          wordCount.value.n10 = detailForm.value.concealingNumber1
          break
      }
      break
  }
}

const createRule = () => {
  formRef.value.validate(async (errors) => {
    if (!errors) {
      if(!!detailForm.value.concealingTypeChild) {
        if(detailForm.value.concealingType === 4) {
          setNumber()
          let params = {...detailForm.value}
          detailForm.value.opperate === '新增' ? await insertDesensitizationRules(params) : await updateDesensitizationRules(params)
          message.info('成功')
          dialogVisible()
          await query(
              paginationReactive.value.desensitizationRuleName,
              paginationReactive.value.desensitizationMethod,
              paginationReactive.value.effectiveStatus,
              paginationReactive.value.page,
              paginationReactive.value.pageSize
          )
        } else {
          detailFormRef.value.validate(async (errors) => {
            if (!errors) {
              setNumber()
              let params = {...detailForm.value}
              detailForm.value.opperate === '新增' ? await insertDesensitizationRules(params) : await updateDesensitizationRules(params)
              message.info('成功')
              dialogVisible()
              await query(
                  paginationReactive.value.desensitizationRuleName,
                  paginationReactive.value.desensitizationMethod,
                  paginationReactive.value.effectiveStatus,
                  paginationReactive.value.page,
                  paginationReactive.value.pageSize
              )
            } else {
              message.error('验证失败，请填写完整信息')
            }
          })
        }
      } else {
        message.error('验证失败，请勾选掩盖方式')
      }
    } else {
      message.error('验证失败，请填写完整信息')
    }
  })
}

const openList = async (id) => {
  let ruleParam = {
    desensitizationRulesId: id,
  }
  listForm.value = await queryDesensitizationUsedList(ruleParam)
  listFormModal.value = true
}

const dialogVisible = () => {
  active.value = false
  resultSpan.value = 0
  desMethodSpan.value = 0
  hideSpan.value = 0
  detailForm.value = {
    desensitizationRuleName: '',
    desensitizationMethod: '1',
    concealingCharacters: '',
    concealingTypeChild: '',
    concealingNumber1: null,
    concealingNumber2: null,
    fieldCharacteristics: '',
    effectiveStatus: 0
  }
  wordCount.value = {
    n1: null,
    n2: null,
    n3: null,
    n4: null,
    n5: null,
    n6: null,
    n7: null,
    n8: null,
    n9: null,
    n10: null
  }
  formRef.value?.restoreValidation()
  demoData.value = ''
}

const handleDesVerify = () => {
  formRef.value.validate(async (errors) => {
      if (!errors) {
        setNumber()
        let params = {...detailForm.value, demoData: demoData.value}
        verifyValue.value = await verifyDesensitizationRules(params)
        resultSpan.value = 12
      } else {
        message.error('验证失败，请填写完整信息')
      }
    })

}

const handleRelease = async (row) => {
  let ruleParam = {
    desensitizationRulesId: row.id,
  }
  await desensitizationUsed(ruleParam)

  let params = {
    id: row.id,
    effectiveStatus: !row.effectiveStatus
  }
  await effectiveDesensitizationRules(params)
  await query(
      paginationReactive.value.desensitizationRuleName,
      paginationReactive.value.desensitizationMethod,
      paginationReactive.value.effectiveStatus,
      paginationReactive.value.page,
      paginationReactive.value.pageSize
  )
}

const query = async (name, type = '', status = '', pageNum, pageSize) => {
  let params = {
    desensitizationRuleName: name,
    desensitizationMethod: type,
    effectiveStatus: status,
    pageNum: pageNum,
    pageSize: pageSize
  }
  const data = await queryDataSecurityDesensitizationRules(params)
  paginationReactive.value.itemCount = data.total
  dataList.value = data.totalList
}

const initData = async () => {
  await query(
      paginationReactive.value.desensitizationRuleName,
      paginationReactive.value.desensitizationMethod,
      paginationReactive.value.effectiveStatus,
      paginationReactive.value.page,
      paginationReactive.value.pageSize
  )
}

const delConfirm = () => {
  ElMessageBox.confirm(
      '您将删除' + currentRow.value.desensitizationRuleName + '，是否继续？',
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
  detailForm.value.opperate = '新增'
  rules.value.desensitizationRuleName[1] = {
    async validator(validator, value) {
      let param = {
        desensitizationRuleName: value
      }
      await ruleNameExists(param)
    },
    trigger: 'blur'
  }
  active.value = true
}

function editMetadata() {
  detailForm.value = { ...currentRow.value }
  setWordCount()
  ifNameUpdate.value = true
  currentRow.value.effectiveStatus ? detailForm.value.opperate = '查看' : detailForm.value.opperate = '编辑'
  currentRow.value.effectiveStatus ? ifUpdate.value = true : ifUpdate.value = false
  rules.value.desensitizationRuleName[1] = {}
  handleDesensitizationMethod(detailForm.value.desensitizationMethod)
  if(detailForm.value.desensitizationMethod === '2') handleInitDesMethod(detailForm.value.concealingType)
  active.value = true
}

function createValidator(TypeChild, fieldName) {
  return {
    trigger: ['input', 'blur'],
    validator() {
      // 检查concealingTypeChild和对应的wordCount字段是否为空
      if (detailForm.value.concealingTypeChild === TypeChild && !wordCount.value[fieldName]) {
        return new Error('请填写内容');
      }
      return true;
    }
  };
}

async function deleteApi(row) {
  await deleteDesensitizationRules({},row.id)
  message.info('删除成功')
  await query(
      paginationReactive.value.desensitizationRuleName,
      paginationReactive.value.desensitizationMethod,
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
        paginationReactive.value.desensitizationRuleName,
        paginationReactive.value.desensitizationMethod,
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
.detail-list {
  .n-form-item--top-labelled {
    grid-template-rows: 0;
  }
}
</style>
