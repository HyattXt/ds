<template>
  <n-space vertical>
    <n-card size="small">
      <n-space justify="space-between" style="height: 40px">
        <n-button
            type="primary"
            @click="addMetadata"
        >
          添加指标
        </n-button>
        <n-form ref="formRef" :model="pagination">
          <n-grid :cols="21" :x-gap="12">
            <n-form-item-gi
                :span="4"
                :show-label="false"
                path="pagination.assetType"
            >
              <n-select
                  v-model:value="pagination.timeDimension"
                  size="small"
                  :options="timeDimensionOptions"
                  clearable
                  placeholder="时间维度"
              />
            </n-form-item-gi>
            <n-form-item-gi
                :span="4"
                :show-label="false"
                path="pagination.assetName"
            >
              <n-input
                  size="small"
                  v-model:value="pagination.indicatorCode"
                  placeholder="指标编码"
              />
            </n-form-item-gi>
            <n-form-item-gi
                :span="4"
                :show-label="false"
                path="pagination.assetName"
            >
              <n-input
                  size="small"
                  v-model:value="pagination.indicatorName"
                  placeholder="指标名称"
              />
            </n-form-item-gi>
            <n-form-item-gi
                :span="4"
                :show-label="false"
                path="pagination.assetName"
            >
              <n-input
                  size="small"
                  v-model:value="pagination.indicatorTargetTable"
                  placeholder="数据服务表"
              />
            </n-form-item-gi>
            <n-form-item-gi
                :span="4"
                :show-label="false"
                path="pagination.assetName"
            >
              <n-input
                  size="small"
                  v-model:value="pagination.indicatorLatitude"
                  placeholder="指标维度"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="1" :show-label="false">
              <n-button
                  size="small"
                  type="primary"
                  @click="handlePageChange(1)"
              >
                <NIcon :component="SearchOutlined"></NIcon>
              </n-button>
            </n-form-item-gi>
          </n-grid>
        </n-form>
      </n-space>
    </n-card>
    <n-card>
      <n-grid x-gap="2" :cols="6">
        <n-gi span="1">
          <n-card size="small" class="container">
            <n-spin :show="showSpin">
            <n-tree
                class="treeSize"
                block-line
                show-irrelevant-nodes
                :data="treeFolder"
                key-field="id"
                label-field="titleName"
                children-field="children"
                :render-prefix="menuIcon"
                :nodeProps="nodeProps"
                default-expand-all
            />
            </n-spin>
          </n-card>
        </n-gi>
        <n-gi span="5">
          <n-data-table
              ref="table"
              remote
              :columns="columns"
              :data="data"
              size="small"
              :loading="loading"
              :row-key="rowKey"
              :pagination="pagination"
              @update:page="handlePageChange"
              default-expand-all
              :scroll-x="1500"
          />
        </n-gi>
      </n-grid>
    </n-card>
  </n-space>
  <n-drawer v-model:show="active" :width="800">
    <n-drawer-content closable>
      <template #header> 指标{{ indexFormValue.opperate }} </template>
      <n-form
          :size="'small'"
          :model='indexFormValue'
          label-placement="left"
          label-width="auto"
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
        <n-button type="primary" size="small" :disabled="ifUpdate" @click="createIndex">确定</n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
  <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="xRef"
      :y="yRef"
      :options="dropdownOption"
      :show="showDropdownRef"
      :on-clickoutside="onClickOutside"
      :on-select="handleSelect"
      :render-option="dropdownConfirm"
  />
  <n-modal
      v-model:show="showAddRef"
      class="menuModal"
  >
    <n-card title="新建文件夹" size="huge">
      <n-form
          ref="formRef2"
          label-placement="left"
          label-width="auto"
          :rules="rules"
          :model="formValue"
      >
        <n-form-item label="文件夹名称" path="titleName">
          <n-input
              type="text"
              v-model:value="formValue.titleName"
              placeholder="输入文件夹名称"
          />
        </n-form-item>
        <n-form-item label="目标文件夹" path="inputValue">
          <n-tree-select
              :options="treeFolder"
              key-field="id"
              label-field="titleName"
              v-model:value="selectedMenu"
              filterable
          />
        </n-form-item>
      </n-form>
      <n-space justify="end">
        <n-button type="info" :on-click="createMenu" >确定</n-button>
      </n-space>
    </n-card>
  </n-modal>
  <n-modal
      v-model:show="showPubRef"
      class="menuModal"
  >
    <n-card title="指标下架" size="large">
      <n-form
          ref="formRef"
          label-placement="left"
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
        <n-button type="info" :on-click="offIndex" >确定</n-button>
      </n-space>
    </n-card>
  </n-modal>
</template>

<script>
import {defineComponent, ref, reactive, onMounted, h, nextTick} from 'vue'
import axios from 'axios'
import {
  ApartmentOutlined, BarsOutlined,
  DeleteOutlined, EditOutlined, ProfileOutlined,
  SearchOutlined,
  TableOutlined, ToTopOutlined, VerticalAlignBottomOutlined
} from '@vicons/antd'
import {
  NButton,
  NIcon,
  NSpace,
  NTooltip,
  useMessage,
  NCard,
  NGrid,
  NGi,
  NPopconfirm
} from "naive-ui";
import {useRouter} from "vue-router";

const columns = ({ play }, { pub }, { del }) => {
  return [
    {
      title: '#',
      key: 'id',
      width: 30,
      fixed: 'left',
      render: (_, index) => {
        return `${index + 1}`
      }
    },
    {
      title: '指标编码',
      key: 'indicatorCode',
      width: 130,
      fixed: 'left'
    },
    {
      title: '指标名称',
      key: 'indicatorName',
      width: 150,
      fixed: 'left'
    },
    {
      title: '指标分类',
      key: 'indexClassification',
    },
    {
      title: '时间维度',
      key: 'timeDimension',
    },
    {
      title: '指标维度',
      key: 'indicatorLatitude',
    },
    {
      title: '单位',
      key: 'indicatorUnit',
    },
    {
      title: '数据服务表',
      key: 'indicatorTargetTable',
    },
    {
      title: '更新频率',
      key: 'updateFrequency',
    },
    {
      title: '指标状态',
      key: 'indicatorLabels',
    },
    {
      title: '指标管理者',
      key: 'indicatorManager',
    },
    {
      title: '下架原因',
      key: 'indicatorRemovalInfo',
    },
    {
      title: '操作',
      key: 'actions',
      width: 135,
      fixed: 'right',
      render(row) {
        return h(NSpace, null, {
          default: () => [
            h(
                NTooltip,
                {},
                {
                  trigger: () =>
                      h(
                          NButton,
                          {
                            circle: true,
                            type: 'info',
                            size: 'small',
                            class: 'edit',
                            onClick: () => {
                              play(row)
                            }
                          },
                          {
                            icon: () =>
                                h(NIcon, null, { default: () => row.indicatorLabels === '已上架'? h(BarsOutlined): h(EditOutlined)})
                          }
                      ),
                  default: () => row.indicatorLabels === '已上架'? '详情查看': '详情编辑'
                }
            ),
            h(
                NPopconfirm,
                {
                  onPositiveClick: () => {
                    pub(row)
                  }
                },
                {
                  trigger: () =>
                      h(
                          NTooltip,
                          {},
                          {
                            trigger: () =>
                                h(
                                    NButton,
                                    {
                                      circle: true,
                                      type:
                                          row.indicatorLabels !== '已上架' ? 'info' : 'warning',
                                      size: 'small',
                                      class: 'edit'
                                    },
                                    {
                                      icon: () =>
                                          h(NIcon, null, {
                                            default: () =>
                                                row.indicatorLabels !== '已上架'
                                                    ? h(ToTopOutlined)
                                                    : h(VerticalAlignBottomOutlined)
                                          })
                                    }
                                ),
                            default: () =>
                                row.indicatorLabels !== '已上架' ? '上架' : '下架'
                          }
                      ),
                  default: () =>
                      row.indicatorLabels !== '已上架' ? '确定上架吗？' : '确定下架吗？'
                }
            ),
            h(
                NPopconfirm,
                {
                  onPositiveClick: () => {
                    del(row)
                  }
                },
                {
                  trigger: () =>
                      h(
                          NTooltip,
                          {},
                          {
                            trigger: () =>
                                h(
                                    NButton,
                                    {
                                      circle: true,
                                      type: 'error',
                                      size: 'small',
                                      class: 'edit'
                                    },
                                    {
                                      icon: () =>
                                          h(NIcon, null, { default: () => h(DeleteOutlined) })
                                    }
                                ),
                            default: () => '删除'
                          }
                      ),
                  default: () => '确定删除吗？'
                }
            )
          ]
        })
      }
    }
  ]
}
const TableData = reactive({
  tableList: [],
  totalNum: 0
})

export default defineComponent({
  setup() {
    const dataRef = ref([])
    const formRef2 = ref(null)
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
    const xRef = ref(0)
    const yRef = ref(0)
    const formValue = ref({})
    const indexFormValue = ref({})
    const dropdownOption = ref([{label: '添加', key: '添加'},{label: '删除', key: '删除'}])
    const operaSpan = ref(0)
    const operaOffSpan = ref(0)
    const ifUpdate = ref(false)
    const getCatalogFolderUrl = import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/indicatorCenter/getIndicatorCenterTreeFloder'
        : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/indicatorCenter/getIndicatorCenterTreeFloder'
    const addCatalogTreeUrl = import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/indicatorCenter/insertIndicatorCenterTree'
        : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/indicatorCenter/insertIndicatorCenterTree'
    const delCatalogTreeUrl = import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/indicatorCenter/deleteIndicatorCenterTree'
        : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/indicatorCenter/deleteIndicatorCenterTree'
    const insertIndexUrl = import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/indicatorCenter/insert'
        : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/indicatorCenter/insert'
    const updateIndexUrl = import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/indicatorCenter/update'
        : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/indicatorCenter/update'
    const deleteIndexUrl = import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/indicatorCenter/delete'
        : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/indicatorCenter/delete'
    const pubIndexUrl = import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/indicatorCenter/indicatorOnline'
        : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/indicatorCenter/indicatorOnline'
    const offIndexUrl = import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/indicatorCenter/indicatorOffline'
        : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/indicatorCenter/indicatorOffline'
    const columnsRef = ref(
        columns(
            {
              play(row) {
                indexFormValue.value = row
                indexFormValue.value.treeId = Number(row.treeId)
                row.indicatorLabels === '已上架' ? indexFormValue.value.opperate = '查看' : indexFormValue.value.opperate = '编辑'
                operaSpan.value = 12
                row.indicatorLabels === '已下架' ? operaOffSpan.value = 12 : operaOffSpan.value = 0
                row.indicatorLabels === '已上架' ? ifUpdate.value = true : ifUpdate.value = false
                active.value = true
              }
            },
            {
              pub(row) {
                if(row.indicatorLabels !== '已上架')
                {
                  pubIndex(row.id)
                } else {
                  indexFormValue.value.indicatorRemovalInfo = null
                  showPubRef.value = true
                  indexFormValue.value.id = row.id
                }

              }
            },
            {
              del(row) {
                deleteIndex(row.id)
              }
            }
        )
    )

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

    const rules = {
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
    }

    const paginationReactive = reactive({
      page: 1,
      pageCount: 1,
      pageSize: 10,
      timeDimension: null,
      indicatorName: '',
      indicatorCode: '',
      indicatorTargetTable: '',
      indicatorLatitude: '',
      apiTreeId: 1,
      prefix({ itemCount }) {
        return `共${itemCount}条`
      }
    })

    function query(
        page,
        pageSize = 10,
        timeDimension = '',
        indicatorName = '',
        indicatorCode = '',
        indicatorTargetTable = '',
        indicatorLatitude = '',
        apiTreeId = 1
    ) {
      const url = import.meta.env.MODE === 'development'
          ? import.meta.env.VITE_APP_DEV_ASSETS_URL+'/HDataApi/indicatorCenter/getList'
          : window.webConfig.VITE_APP_PROD_ASSETS_URL+'/HDataApi/indicatorCenter/getList'
      const params = {
        'pageNum': page,
        'pageSize': pageSize,
        'timeDimension': timeDimension,
        'indicatorName': indicatorName,
        'indicatorCode': indicatorCode,
        'indicatorTargetTable': indicatorTargetTable,
        'indicatorLatitude': indicatorLatitude,
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
            paginationReactive.pageCount = Math.ceil(TableData.totalNum / pageSize)
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
          paginationReactive.page = 1
          query(
              paginationReactive.page,
              paginationReactive.pageSize,
              paginationReactive.timeDimension,
              paginationReactive.indicatorName,
              paginationReactive.indicatorCode,
              paginationReactive.indicatorTargetTable,
              paginationReactive.indicatorLatitude,
              paginationReactive.apiTreeId
          )
        },
        onContextmenu (e)  {
          e.preventDefault()
          selectedMenu.value = option.id
          if(option.children.length !== 0) {
            dropdownOption.value = [{label: '添加', key: '添加'},{label: '删除', key: '删除', disabled: true}]
          }else {
            dropdownOption.value = [{label: '添加', key: '添加'},{label: '删除', key: '删除'}]
          }

          nextTick().then(() => {
            showDropdownRef.value = true
            xRef.value = e.clientX
            yRef.value = e.clientY
          })
        }
      }
    }

    function onClickOutside () {
      showDropdownRef.value = false
    }
    function handleSelect (key, option) {
      if(option.key !== '删除') {
        showDropdownRef.value = false
        showAddRef.value = true
      }
    }

    const dropdownConfirm = ({ node, option }) => {
      if (option.key !== '删除' || option.disabled ) {
        return node
      }else{
        return h(
            NPopconfirm,
            {
              onPositiveClick: () => {
                delMenu(selectedMenu.value)
              }},
            {
              trigger: () => [node],
              default: () => '确定'+option.label+'?'
            }
        )
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

    function createMenu() {
      formRef2.value.validate((errors) => {
        if (!errors) {
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
      indexFormValue.value = {}
      indexFormValue.value.treeId = paginationReactive.apiTreeId
      indexFormValue.value.opperate = '新增'
      operaSpan.value = 0
      active.value = true
    }

    function getApiFolder ()  {
      showSpin.value = true
      let params ={}
      axios.post(getCatalogFolderUrl,params).then((res) => {
        treeFolder.value = res.data.data
        showSpin.value = false
      })
    }

    function createIndex () {
      formRef.value.validate((errors) => {
        if (!errors) {
          let params = indexFormValue.value
          let url = indexFormValue.value.opperate === '新增' ? insertIndexUrl : updateIndexUrl
          axios.post(url, params).then((res) => {
            message.info(res.data.info)
            query(
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
          color: '#1890ff'
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
        case 2 : return h(NIcon, {color: '#1890ff'}, { default: () => h(ApartmentOutlined) })
        default : return h(NIcon, {color: '#1890ff'}, { default: () => h(TableOutlined) })
      }
    }

    onMounted(() => {
      getApiFolder()
      query(
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

    return {
      data: dataRef,
      pagination: paginationReactive,
      loading: loadingRef,
      columns: columnsRef,
      SearchOutlined,
      menuIcon,
      treeFolder,
      active,
      timeDimensionOptions,
      indicatorLabelsOptions,
      showDropdownRef,
      xRef,
      yRef,
      dropdownOption,
      addMetadata,
      onClickOutside,
      handleSelect,
      dropdownConfirm,
      createMenu,
      offIndex,
      showSpin,
      selectedMenu,
      showAddRef,
      showPubRef,
      formValue,
      indexFormValue,
      formRef2,
      formRef,
      operaSpan,
      operaOffSpan,
      ifUpdate,
      rules,
      nodeProps,
      createIndex,
      rowKey(rowData) {
        return rowData.id
      },
      handlePageChange(currentPage) {
        if (!loadingRef.value) {
          loadingRef.value = true
          query(
              currentPage,
              paginationReactive.pageSize,
              paginationReactive.timeDimension,
              paginationReactive.indicatorName,
              paginationReactive.indicatorCode,
              paginationReactive.indicatorTargetTable,
              paginationReactive.indicatorLatitude,
              paginationReactive.apiTreeId
          )
          paginationReactive.page = currentPage
        }
      }
    }
  }
})
</script>

<style scoped>
a {
  text-decoration: none;
}

.container {
  width: 100%;
  min-height: calc(100vh - 230px);
  height: 100%;
  overflow: auto;
  white-space: nowrap
}

.container::-webkit-scrollbar {
  /*滚动条整体样式*/
  width : 10px;  /*高宽分别对应横竖滚动条的尺寸*/
  height: 5px;
}
.container::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
}
.container:hover::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow   : inset 0 0 5px rgb(179, 179, 179);
  background   : #b3b3b3;
}

.menuModal {
  width: 600px;
  height: 250px;
}

.treeSize {
  font-size: 13px;
}
</style>
