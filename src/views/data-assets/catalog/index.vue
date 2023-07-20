<template>
  <n-space vertical>
    <n-card size="small">
      <n-space justify="space-between" style="height: 40px">
        <n-button
            type="primary"
            :loading="loadingMeta"
            @click="handleMetadata()"
        >
          元数据采集
        </n-button>
        <n-form ref="formRef" :model="pagination">
          <n-grid :cols="10" :x-gap="12">
            <n-form-item-gi
              :span="8"
              :show-label="false"
              path="pagination.sqlLineageName"
            >
              <n-input
                size="small"
                v-model:value="pagination.sqlLineageName"
                placeholder="表名或注释"
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
</template>

<script>
import {defineComponent, ref, reactive, onMounted, h} from 'vue'
import axios from 'axios'
import {
  ApartmentOutlined,
  ProfileOutlined,
  SearchOutlined,
  TableOutlined
} from '@vicons/antd'
import {NButton, NIcon, NSpace, NTooltip,NDescriptions,NDescriptionsItem, useMessage} from "naive-ui";
import {useRouter} from "vue-router";

const columns = ({ play }) => {
    return [
      {
        type: 'expand',
        renderExpand: (rowData) => {
          return h(NDescriptions, {labelPlacement: 'left'} , [
            h(NDescriptionsItem,  { label: '数据行数', labelStyle: 'color:grey' } , {default: () => rowData.tableDataRow}),
            h(NDescriptionsItem,  { label: '表大小', labelStyle: 'color:grey' } , {default: () => rowData.tableDataLength}),
            h(NDescriptionsItem,  { label: '创建时间', labelStyle: 'color:grey' } , {default: () => rowData.tableCreateTime}),
            h(NDescriptionsItem,  { label: '更新时间', labelStyle: 'color:grey' } , {default: () => rowData.tableUpdateTime})
          ])

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
        title: '表名',
        key: 'sqlLineageName'
      },
      {
        title: '注释',
        key: 'notes'
      },
      {
        title: '任务流',
        key: 'taskName'
      },
      {
        title: '数据库',
        key: 'dataSourceName'
      },
      {
        title: '数据库类型',
        key: 'dbType'
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
      const router = useRouter()
      const loadingRef = ref(true)
      const loadingMeta = ref(false)
      const message = useMessage()
      const treeFolder = ref([])
      const getApiFolderUrl = import.meta.env.MODE === 'development'
          ? import.meta.env.VITE_APP_DEV_API_URL+'/HDataApi/interface_lineage/getTreeAll'
          : window.webConfig.VITE_APP_PROD_API_URL+'/HDataApi/interface_lineage/getTreeAll'
      const columnsRef = ref(
          columns(
              {
                play(row) {
                  router.push({
                        name: 'assets-detail',
                        state: {tableName: row.sqlLineageName, tableComment: row.notes, dbType: row.dbType, fieldArray: row.fieldArray}
                      }
                  )
                }
              }
          )
      )
      const paginationReactive = reactive({
        page: 1,
        pageCount: 1,
        pageSize: 10,
        sqlLineageName: '',
        apiTreeId: 1,
        prefix({ itemCount }) {
          return `共${itemCount}条`
        }
      })

      function query(
          page,
          pageSize = 10,
          sqlLineageName = '',
          apiTreeId = 1
      ) {
        const url = import.meta.env.MODE === 'development'
            ? import.meta.env.VITE_APP_DEV_ASSETS_URL+'/HDataApi/interface_lineage/getSqlLineageListByParams'
            : window.webConfig.VITE_APP_PROD_ASSETS_URL+'/HDataApi/interface_lineage/getSqlLineageListByParams'
        const params = {
          'pageNum': page,
          'pageSize': pageSize,
          'sqlLineageName': sqlLineageName,
          'apiTreeId': apiTreeId
        }

        axios
            .post(url, params)
            .then(function (response) {

              TableData.tableList = response.data.data
              TableData.totalNum = response.data.totalNum
              TableData.tableList.forEach((item) => {
                if (item.dbType === '0') {
                  item.dbType = 'mysql'
                }
                if (item.dbType === '5') {
                  item.dbType = 'oracle'
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
                paginationReactive.sqlLineageName,
                paginationReactive.apiTreeId
            )
          }
        }
      }

      function handleMetadata() {
        let url = import.meta.env.MODE === 'development'
            ? import.meta.env.VITE_APP_DEV_ASSETS_URL+'/HDataApi/interface_lineage/sqlLineageExcute'
            : window.webConfig.VITE_APP_PROD_ASSETS_URL+'/HDataApi/interface_lineage/sqlLineageExcute'
        axios
            .get(url)
            .then(function (response) {

              loadingMeta.value = true
              message.info('采集中，请稍后查看')
              setTimeout(() => {
                loadingMeta.value = false
              }, 2000)
            })
            .catch(function () {
              message.error('采集数据失败，请咨询管理员')
            })
      }

      function getApiFolder ()  {
        let params ={}
        axios.post(getApiFolderUrl,params).then((res) => {
          treeFolder.value = res.data.data
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
          paginationReactive.sqlLineageName,
          paginationReactive.apiTreeId
        )
      })

      return {
        data: dataRef,
        pagination: paginationReactive,
        loading: loadingRef,
        loadingMeta,
        columns: columnsRef,
        SearchOutlined,
        menuIcon,
        treeFolder,
        nodeProps,
        handleMetadata,
        rowKey(rowData) {
          return rowData.id
        },
        handlePageChange(currentPage) {
          if (!loadingRef.value) {
            loadingRef.value = true
            query(
              currentPage,
              paginationReactive.pageSize,
              paginationReactive.sqlLineageName,
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
    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
    background   : #b9b9b9;
  }
  .container::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background   : #ededed;
  }
</style>
