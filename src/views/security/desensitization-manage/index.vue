<template>
  <CrudForm>
    <template v-slot:header>
      <CrudHeader addButton @add-event="active = true" title="脱敏管理"/>
    </template>
    <template v-slot:condition>
      <n-form :show-feedback="false" model="" label-placement="left" style="margin-bottom: 3px">
        <n-grid :cols="22" :x-gap="16">
          <n-form-item-gi label="关联类别" :span="4">
            <n-select
                size="small"
                placeholder="请选择"
                :options="[{ label: '全部', value: '全部' }]"
            />
          </n-form-item-gi>
          <n-form-item-gi :span="4" label="脱敏方式">
            <n-select
                size="small"
                placeholder="请选择"
                :options="[{ label: '全部', value: '全部' },{ label: '哈希', value: '哈希' },{ label: '掩盖', value: '掩盖' }]"
            />
          </n-form-item-gi>
          <n-form-item-gi :span="4" label="脱敏规则名称">
            <n-input
                clearable
                size="small"
            />
          </n-form-item-gi>
          <n-form-item-gi :span="2">
            <el-button color="#0099CB" class="cue-crud__header-query" type="primary" size="default" style="margin-bottom: 0"
                       :icon="Search" @click="handlePageChange(1, paginationReactive.pageSize)" >查询
            </el-button>
          </n-form-item-gi>
        </n-grid>
      </n-form>
    </template>
    <template v-slot:table>
      <CrudTable
          :tableData="data"
          :columnData="columns"
      />
    </template>
    <template v-slot:page>
      <CrudPage
          :paginationReactive="paginationReactive"
      />
    </template>
  </CrudForm>
  <el-dialog v-model="active" append-to-body width="600" class="model-form-wrapper">
    <template #header> 新增脱敏规则 </template>
    <n-form
        :size="'small'"
        label-placement="left"
        :label-width="120"
        ref="formRef"
    >
      <n-grid :cols="12" :x-gap="24">
        <n-form-item-gi :span="12" label="脱敏规则名称:" path="indicatorName">
          <n-input placeholder="请输入指标名称" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="脱敏方式:" path="indicatorAffiliatedSys">
          <n-radio-group v-model:value="desMethod">
            <n-space>
              <n-radio value="哈希">
                哈希
              </n-radio>
              <n-radio value="掩盖">
                掩盖
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item-gi>
        <n-form-item-gi :span="desMethod === '哈希' ? 0 : 12" label="掩盖字符:" path="indicatorAffiliatedSys">
          <n-radio-group >
            <n-radio-button value="*" label="*"/>
            <n-radio-button value="·" label="·"/>
            <n-radio-button value="+" label="+"/>
            <n-radio-button value="×" label="×"/>
          </n-radio-group>
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="通用字段特征:" path="indicatorAffiliatedSys">
          <n-dynamic-tags />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="样本数据:" path="indicatorAffiliatedSys">
          <n-input-group>
            <n-input placeholder="输入样本数据，点击脱敏验证后查看脱敏结果"/>
            <n-button type="info" quaternary >
              脱敏验证
            </n-button>
          </n-input-group>
        </n-form-item-gi>
      </n-grid>
    </n-form>
    <template #footer>
      <n-button color="#0099CB" type="primary" size="small" :disabled="ifUpdate" @click="createIndex">确定</n-button>
    </template>
  </el-dialog>
</template>

<script setup>

import {Search} from "@element-plus/icons-vue";
import CrudForm from "@/components/cue/crud-form.vue";
import CrudPage from "@/components/cue/crud-page.vue";
import {ElButton, ElSwitch} from "element-plus";
import CrudHeader from "@/components/cue/crud-header.vue";
import CrudTable from "@/components/cue/crud-table.vue";
import {h, ref} from "vue";
import {NButton, NGrid, NIcon, NPopconfirm, NTooltip} from "naive-ui";
import {ToTopOutlined, VerticalAlignBottomOutlined} from "@vicons/antd";

const active = ref(false)
const desMethod = ref('哈希')
const paginationReactive = {
  itemCount: 3
}

const columns =  [
  {
    label: '脱敏规则名称',
    prop: 'apiId'
  },
  {
    label: '关联类别',
    prop: 'apiName'
  },
  {
    label: '脱敏方式',
    prop: 'apiMethod'
  },
  {
    label: '掩盖字符',
    prop: 'apiPath'
  },
  {
    label: '适用字段特征',
    prop: 'apiFlag'
  },
  {
    label: '生效状态',
    prop: 'apiStatus',
    width: 80,
    slots: (row) => {
      return h(
          ElSwitch,
          {
            modelValue: row.apiStatus,
            onChange: () => console.log(row)
          }
      )
    }
  },
  {
    label: '创建时间',
    prop: 'apiCreateTime',
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
            onClick: () => {active.value = !active.value}
          },
          { default: ()=> '编辑' }
      ),
        h(NPopconfirm, {onPositiveClick: () => {""}}, {trigger: () =>
             h(ElButton,
                 {
                   class: 'el-button--text',
                   size: 'small',
                   onClick: () => {}
                 },
                 { default: ()=> '删除' }
             ), default: () => '确定删除吗？'}
        )]
    }
  }
]

const data = [
  {apiId:'用户名',apiName:'-',apiMethod:'哈希',apiPath:'-',apiFlag:'个人信息',apiCreateTime:'2024-07-10 14:21:42'},
  {apiId:'手机号',apiName:'-',apiMethod:'掩盖',apiPath:'*',apiFlag:'个人信息',apiCreateTime:'2024-07-10 14:21:42'},
  {apiId:'家庭地址',apiName:'-',apiMethod:'掩盖',apiPath:'*',apiFlag:'个人信息',apiCreateTime:'2024-07-10 14:21:42'}
]

</script>

<style scoped lang="scss">

</style>
