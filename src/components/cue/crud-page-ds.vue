<template>
  <el-config-provider :locale="zhCn">
    <el-pagination
        background
        current-page="page"
        page-size="pageSize"
        :default-page-size="defaultPageSizes"
        :page-sizes="pageSizes"
        layout="total, sizes, prev, pager, next"
        :total="itemCount"
        @current-change="changePage"
        @size-change="changePageSize"
        popper-class="page-select"
    >
    </el-pagination>
  </el-config-provider>
</template>

<script setup>
import { computed } from "vue"
import zhCn from "element-plus/es/locale/lang/zh-cn";

const props = defineProps({
  page: Number,
  pageSize: Number,
  itemCount: Number,
  useCustomPageSizes: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['page-change', 'page-size-change'])

const pageSizes = computed(() => {
  return props.useCustomPageSizes ? [10, 30, 90, 180] : [30, 90, 180, 300] ;
})

const defaultPageSizes = computed(() => {
  return props.useCustomPageSizes ? 10 : 30 ;
})

function changePage(page) {
  emit('page-change',page)
}

function changePageSize(pageSize) {
  emit('page-size-change',pageSize)
}
</script>

<style scoped>

</style>
