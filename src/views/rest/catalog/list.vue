<template>
  <n-space vertical>
    <n-card size="small">
      <n-space justify="space-between" style="height: 40px">
        <router-link to="/rest/rest-dev">
        <n-button type="primary" > 新建接口</n-button>
        </router-link>
        <n-form ref="formRef" :model="pagination">
          <n-grid :cols="10" :x-gap="12">
            <n-form-item-gi
                :span="8"
                :show-label="false"
                path="pagination.taskName"
            >
              <n-input
                  size="small"
                  v-model:value="pagination.taskName"
                  placeholder="任务名"
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
      <n-data-table
          ref="table"
          remote
          :columns="columns"
          :data="data"
          :loading="loading"
          :pagination="pagination"
          :row-key="rowKey"
          @update:page="handlePageChange"
      />
    </n-card>
  </n-space>
</template>

<script>
import {defineComponent, ref, reactive, onMounted, h} from 'vue'
import axios from 'axios'
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined
} from '@vicons/antd'
import {NButton, NIcon, NPopconfirm, NSpace, NTooltip, useMessage} from "naive-ui";
import {useRoute, useRouter} from "vue-router";

const columns = ({ edit }, {del}) => {
  return [
    {
      title: 'ID',
      key: 'id'
    },
    {
      title: '任务名',
      key: 'taskName'
    },
    {
      title: '接口URL',
      key: 'dataUrl'
    },
    {
      title: '请求类型',
      key: 'httpType'
    },
    {
      title: '目标表',
      key: 'dataTable'
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
                              edit(row)
                            }
                          },
                          {
                            icon: () =>
                                h(NIcon, null, { default: () => h(EditOutlined) })
                          }
                      ),
                  default: () => '编辑'
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
                                      class: 'delete'
                                    },
                                    {
                                      icon: () =>
                                          h(NIcon, null, {
                                            default: () => h(DeleteOutlined)
                                          })
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

function query(
    page,
    pageSize = 10,
    taskName = ''
) {
  return new Promise((resolve) => {
    const url = import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_APP_DEV_REST_URL+'/httpHandle/getHttpDataListByParams'
        : import.meta.env.VITE_APP_PROD_REST_URL+'/httpHandle/getHttpDataListByParams'
    const params = {
      'pageNum': page,
      'pageSize': pageSize,
      'taskName': taskName
    }

    axios
        .post(url, params)
        .then(function (response) {
          console.log(response)
          TableData.tableList = response.data.data
          TableData.totalNum = response.data.totalNum
          console.log(TableData.tableList)
          console.log(TableData.totalNum)
          const copiedData = TableData.tableList.map((v) => v)
          const total = TableData.totalNum
          const pageCount = Math.ceil(total / pageSize)

          setTimeout(
              () =>
                  resolve({
                    pageCount,
                    data: copiedData,
                    total
                  }),
              300
          )
        })
        .catch(function (error) {
          console.log(error)
        })
  })
}

export default defineComponent({
  setup() {
    const dataRef = ref([])
    const router = useRouter()
    const loadingRef = ref(true)
    const message = useMessage()
    const columnsRef = ref(
        columns(
            {
              edit(row) {
                router.push({
                      path: '/rest/rest-edit',
                      query: {id: row.id}
                    }
                )
              }
            },
            {
              del(row) {
                let urlDel = import.meta.env.MODE === 'development'
                    ? import.meta.env.VITE_APP_DEV_REST_URL+'/httpHandle/deleteHttpDataById'
                    : import.meta.env.VITE_APP_PROD_REST_URL+'/httpHandle/deleteHttpDataById'
                let delPar = {
                  id: null
                }
                delPar.id = row.id
                axios.post(urlDel, delPar).then(function (response) {
                  console.log(response)
                  message.info(response.data.info)
                  refresh(paginationReactive.page)
                })
              }
            }
        )
    )
    const paginationReactive = reactive({
      page: 1,
      pageCount: 1,
      pageSize: 10,
      taskName: '',
      prefix({ itemCount }) {
        return `共${itemCount}条`
      }
    })

    function refresh(currentPage) {
      query(
          currentPage,
          paginationReactive.pageSize,
          paginationReactive.taskName
      ).then((data) => {
        dataRef.value = data.data
        dataRef.value.httpType = dataRef.value.forEach((item) => {
          if (item.httpType === 1) {
            item.httpType = 'POST'
          }
          if (item.httpType === 2) {
            item.httpType = 'GET'
          }
        })
        paginationReactive.pageCount = data.pageCount
        paginationReactive.itemCount = data.total
        loadingRef.value = false
      })
    }

    onMounted(() => {
      query(
          paginationReactive.page,
          paginationReactive.pageSize,
          paginationReactive.taskName
      ).then((data) => {
        dataRef.value = data.data
        dataRef.value.httpType = dataRef.value.forEach((item) => {
          if (item.httpType === 1) {
            item.httpType = 'POST'
          }
          if (item.httpType === 2) {
            item.httpType = 'GET'
          }
        })
        paginationReactive.pageCount = data.pageCount
        paginationReactive.itemCount = data.total
        loadingRef.value = false
      })
    })

    return {
      data: dataRef,
      pagination: paginationReactive,
      loading: loadingRef,
      columns: columnsRef,
      SearchOutlined,
      rowKey(rowData) {
        return rowData.colName
      },
      handlePageChange(currentPage) {
        if (!loadingRef.value) {
          loadingRef.value = true
          query(
              currentPage,
              paginationReactive.pageSize,
              paginationReactive.taskName
          ).then((data) => {
            dataRef.value = data.data
            dataRef.value.httpType = dataRef.value.forEach((item) => {
              if (item.httpType === 1) {
                item.httpType = 'POST'
              }
              if (item.httpType === 2) {
                item.httpType = 'GET'
              }
            })
            paginationReactive.page = currentPage
            paginationReactive.pageCount = data.pageCount
            paginationReactive.itemCount = data.total
            loadingRef.value = false
          })
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
</style>
