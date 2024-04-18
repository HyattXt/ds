<template>
  <el-config-provider :locale="zhCn">
    <div class="cue-crud__body">
      <div class="cue-table">
        <div class="cue-table-container">
          <el-table v-loading="loadingRef" :data="tableData" border resizable highlight-current-row height="100%" @current-change="handleCurrentChange">
            <el-table-column type="index" fixed label="序号" width="50" align="center"/>
            <el-table-column
                v-for="column in columnData"
                :key="column.prop"
                :prop="column.prop"
                :label="column.label"
                :width="column.width"
                :min-width="column.minWidth"
                :type="column.type"
                :fixed="column.fixed"
                :align="column.align || 'center'"
                show-overflow-tooltip
            >
              <template #default="scope">
                <template v-if="!column.slots && !column.formatter">
                  {{ scope.row[column.prop] }}
                </template>
                <template v-if="column.slots">
                  <node-renderer :node="column.slots(scope.row)" />
                </template>
                <template v-if="column.formatter">
                  {{ column.formatter(scope.row[column.prop], scope.row) }}
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="cue-crud__body-border-bottom"></div>
    </div>
  </el-config-provider>
</template>

<script setup>

import NodeRenderer from "@/components/cue/NodeRenderer";
import zhCn from "element-plus/es/locale/lang/zh-cn";

const props = defineProps({
  paginationReactive: Object,
  tableData: {
    type: Array,
    default: () => [],
  },
  columnData: {
  type: Array,
  default: () => []
  },
  loadingRef: {
    type: Boolean,
    default: false
  },
  disablePage: {
  type: Boolean,
  default: false
}
})
const emit = defineEmits(['current-change'])

function handleCurrentChange(currentRow) {
  emit('current-change', currentRow)
}
</script>

<style scoped>

</style>
