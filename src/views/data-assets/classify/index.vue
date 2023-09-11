<template>
  <n-space vertical>
    <n-card size="small">
      <n-space justify="space-between" style="height: 40px">
        <n-button
            type="primary"
            @click="addMetadata"
        >
          添加资产
        </n-button>
        <n-form ref="formRef" :model="pagination">
          <n-grid :cols="18" :x-gap="12">
            <n-form-item-gi
                :span="8"
                :show-label="false"
                path="pagination.assetType"
            >
              <n-select
                  v-model:value="pagination.assetType"
                  size="small"
                  :options="stateOptions"
                  clearable
                  placeholder="资产类型"
              />
            </n-form-item-gi>
            <n-form-item-gi
                :span="8"
                :show-label="false"
                path="pagination.assetName"
            >
              <n-input
                  size="small"
                  v-model:value="pagination.assetName"
                  placeholder="资产名称"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="2" :show-label="false">
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
              :loading="loading"
              :row-key="rowKey"
              :pagination="pagination"
              @update:page="handlePageChange"
              default-expand-all
          />
        </n-gi>
      </n-grid>
    </n-card>
  </n-space>
  <n-drawer v-model:show="active" :width="602">
    <n-drawer-content closable>
      <template #header> 添加资产 </template>
      <n-form :size="'small'">
        <n-grid :cols="18" :x-gap="12">
        <n-form-item-gi :span="9" label="表名称:" label-placement="left" path="sqlLineageName">
          <n-input v-model:value="detailPagination.sqlLineageName" />
        </n-form-item-gi>
        <n-form-item-gi :span="9" label="包含已编目:" label-placement="left" path="assetNameState">
          <n-select
              v-model:value="detailPagination.assetNameState"
              size="small"
              :options="[{label:'是',value:''},{label:'否',value:'1'}]"
              clearable
              placeholder="包含已编目"
          />
        </n-form-item-gi>
        </n-grid>
        <n-form-item label="资产目录:" label-placement="left" path="apiTreeId">
          <n-tree-select
              v-model:value="pagination.apiTreeId"
              :options="treeFolder"
              key-field="id"
              label-field="titleName"
              children-field="children"
              placeholder="选择目标资产目录"
          />
        </n-form-item>
        <n-space justify="end"><n-button type="primary" size="small" style="margin-bottom: 10px" @click="handleDetailPageChange(1)">查询</n-button></n-space>
      </n-form>
      <n-data-table
          remote
          :columns="detailColumns"
          :data="detailData"
          :loading="detailLoading"
          :pagination="detailPagination"
          :row-key="deatilRowKey"
          @update:checked-row-keys="handleCheck"
          @update:page="handleDetailPageChange"
      />
      <template #footer>
        <n-button type="primary" size="small" @click="insertMetadata">确定</n-button>
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
</template>

<script>
import {defineComponent, ref, reactive, onMounted, h, nextTick} from 'vue'
import axios from 'axios'
import {
  ApartmentOutlined,
  DeleteOutlined, EditOutlined, ProfileOutlined,
  SearchOutlined,
  TableOutlined
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

const columns = ({ play }, { del }) => {
  return [
    {
      title: '#',
      key: 'id',
      render: (_, index) => {
        return `${index + 1}`
      }
    },
    {
      title: '资产名称',
      key: 'assetName'
    },
    {
      title: '注释',
      key: 'notes'
    },
    {
      title: '资产类型',
      key: 'assetType'
    },
    {
      title: '数据源',
      key: 'databaseName'
    },
    {
      title: '数据库类型',
      key: 'databaseType'
    },
    {
      title: '操作',
      key: 'actions',
      width: 132,
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
                                h(NIcon, null, { default: () => h(ProfileOutlined) })
                          }
                      ),
                  default: () => '查看详情'
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
const detailTableData = reactive({
  tableList: [],
  totalNum: 0
})

const detailColumns = () => {
  return [
    {
      type: 'selection',
      disabled(row) {
        return !!(row.assetName);
      }
    },
    {
      title: '#',
      key: 'id',
      render: (_, index) => {
        return `${index + 1}`
      }
    },
    {
      title: '资产名称',
      key: 'sqllineageName'
    },
    {
      title: '注释',
      key: 'notes'
    }
  ]
}

export default defineComponent({
  setup() {
    const dataRef = ref([])
    const formRef2 = ref(null)
    const detailDataRef = ref([])
    const router = useRouter()
    const active = ref(false)
    const loadingRef = ref(true)
    const detailLoadingRef = ref(true)
    const showSpin = ref(false)
    const message = useMessage()
    const treeFolder = ref([])
    const selectedMenu = ref(1)
    const showDropdownRef = ref(false)
    const showAddRef = ref(false)
    const xRef = ref(0)
    const yRef = ref(0)
    const formValue = ref({ titleName: '' })
    const MetadataParams = ref()
    const dropdownOption = ref([{label: '添加', key: '添加'},{label: '删除', key: '删除'}])
    const getCatalogFolderUrl = import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/dataCatalog/getDataCatalogTreeFloder'
        : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/dataCatalog/getDataCatalogTreeFloder'
    const addCatalogTreeUrl = import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/dataCatalog/insertDataCatalogTree'
        : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/dataCatalog/insertDataCatalogTree'
    const delCatalogTreeUrl = import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/dataCatalog/deleteDataCatalogTree'
        : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/dataCatalog/deleteDataCatalogTree'
    const insertCatalogDetailUrl = import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/dataCatalog/insert'
        : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/dataCatalog/insert'
    const delCatalogDetailUrl = import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/dataCatalog/delete'
        : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/dataCatalog/delete'
    const columnsRef = ref(
        columns(
            {
              play(row) {
                router.push({
                      name: 'assets-detail',
                      state: {tableName: row.assetName, tableComment: row.notes, dbType: row.databaseType, fieldArray: row.fieldArray, backName: 'assets-classify'}
                    }
                )
              }
            },
            {
              del(row) {
                delMetadata(row.id, row.assetName)
              }
            }
        )
    )

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

    const rules = {
      titleName: {
        required: true,
        message: '请输入名称',
        trigger: 'blur'
      }
    }

    const paginationReactive = reactive({
      page: 1,
      pageCount: 1,
      pageSize: 10,
      assetName: '',
      assetType: null,
      apiTreeId: 1,
      prefix({ itemCount }) {
        return `共${itemCount}条`
      }
    })

    const detailPaginationReactive = reactive({
      page: 1,
      pageCount: 1,
      pageSize: 10,
      sqlLineageName: '',
      assetNameState: '',
      prefix({ itemCount }) {
        return `共${itemCount}条`
      }
    })

    function query(
        page,
        pageSize = 10,
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
            paginationReactive.pageCount = Math.ceil(TableData.totalNum / pageSize)
            loadingRef.value = false
          })
          .catch(function (error) {
            console.log(error)
          })
    }

    function detailQuery(
        page,
        pageSize = 10,
        sqlLineageName = '',
        assetNameState = '1'
    ) {
      const url = import.meta.env.MODE === 'development'
          ? import.meta.env.VITE_APP_DEV_ASSETS_URL+'/HDataApi/dataCatalog/getMetaDataInfo'
          : window.webConfig.VITE_APP_PROD_ASSETS_URL+'/HDataApi/dataCatalog/getMetaDataInfo'
      const params = {
        'pageNum': page,
        'pageSize': pageSize,
        'sqlLineageName': sqlLineageName,
        'assetNameState': assetNameState
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
            detailDataRef.value = detailTableData.tableList.map((v) => v)
            detailPaginationReactive.itemCount = detailTableData.totalNum
            detailPaginationReactive.pageCount = Math.ceil(detailTableData.totalNum / pageSize)
            detailLoadingRef.value = false
            console.log(detailPaginationReactive)
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
              paginationReactive.assetName,
              paginationReactive.assetType,
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
      detailPaginationReactive.assetNameState = '1'
      detailQuery(
          detailPaginationReactive.page,
          detailPaginationReactive.pageSize,
          detailPaginationReactive.sqlLineageName,
          detailPaginationReactive.assetNameState
      )
      active.value = true
    }

    function insertMetadata() {
      let dataCatalogList = {
        dataCatalogList: MetadataParams.value
      }
      axios.post(insertCatalogDetailUrl,dataCatalogList).then(() => {
        active.value = false
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
    }

    function delMetadata(id, assetName) {
      let params ={
        id: id,
        assetName: assetName
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
        showSpin.value = false
      })
    }

    function handleCheck (rowKeys)  {
      MetadataParams.value = []
      MetadataParams.value =
          rowKeys.map((item)=>{
            return JSON.parse(item)
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
          paginationReactive.assetName,
          paginationReactive.assetType,
          paginationReactive.apiTreeId
      )
    })

    return {
      data: dataRef,
      detailData: detailDataRef,
      pagination: paginationReactive,
      detailPagination: detailPaginationReactive,
      loading: loadingRef,
      detailLoading: detailLoadingRef,
      columns: columnsRef,
      detailColumns: detailColumns(),
      SearchOutlined,
      menuIcon,
      treeFolder,
      active,
      stateOptions,
      showDropdownRef,
      xRef,
      yRef,
      dropdownOption,
      onClickOutside,
      handleSelect,
      dropdownConfirm,
      createMenu,
      handleCheck,
      insertMetadata,
      showSpin,
      selectedMenu,
      showAddRef,
      formValue,
      formRef2,
      rules,
      nodeProps,
      addMetadata,
      rowKey(rowData) {
        return rowData.id
      },
      deatilRowKey(rowData) {
        let ob ={
          treeId: paginationReactive.apiTreeId,
          sqlLineageName: rowData.sqllineageName,
          dataSourceName: rowData.dataSourceName,
          notes: rowData.notes,
          dbType: rowData.dbType
        }
        return JSON.stringify(ob)
      },
      handlePageChange(currentPage) {
        if (!loadingRef.value) {
          loadingRef.value = true
          query(
              currentPage,
              paginationReactive.pageSize,
              paginationReactive.assetName,
              paginationReactive.assetType,
              paginationReactive.apiTreeId
          )
          paginationReactive.page = currentPage
        }
      },
      handleDetailPageChange(currentPage) {
        if (!detailLoadingRef.value) {
          detailLoadingRef.value = true
          detailQuery(
              currentPage,
              detailPaginationReactive.pageSize,
              detailPaginationReactive.sqlLineageName,
              detailPaginationReactive.assetNameState
          )
          detailPaginationReactive.page = currentPage
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
  box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
  background   : #b9b9b9;
}
.container::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background   : #ededed;
}

.menuModal {
  width: 600px;
  height: 250px;
}
</style>
