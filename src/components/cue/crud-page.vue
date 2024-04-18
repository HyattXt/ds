<template>
  <el-config-provider :locale="zhCn">
    <el-pagination
        background
        :default-page-size="30"
        :page-sizes="[30, 90, 180, 300]"
        layout="total, sizes, prev, pager, next"
        :total="paginationReactive.itemCount"
        @change="handlePageChange"
        popper-class="page-select"
    >
    </el-pagination>
  </el-config-provider>
</template>

<script setup>
import zhCn from "element-plus/es/locale/lang/zh-cn";

const props = defineProps({
  paginationReactive: Object
})
const emit = defineEmits(['page-change'])

function handlePageChange(page, pageSize) {
  emit('page-change',page, pageSize)
}
</script>

<style scoped>

</style>
