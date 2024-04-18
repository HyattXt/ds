<template>
  <el-config-provider :locale="zhCn">
    <div class="cue-drag-layout flex-row">
      <slot name="tree"></slot>
      <div class="cue-drag-layout__mainview" :style="{width: width}">
        <div class="cue-crud cue-crud-v2">
          <slot name="header"></slot>
          <div class="crud-v2-condition" >
            <div class="cue-crud__header-condition">
              <div class="cue-crud__header-content">
                <slot name="condition"></slot>
                <slot name="query"></slot>
              </div>
            </div>
          </div>
          <div class="cue-crud__body">
            <slot name="table"></slot>
          </div>
          <div class="cue-crud__footer">
            <div class="cue-crud__footer-tab">
            </div>
            <div class="cue-crud__footer-pager">
              <slot name="page"></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-config-provider>
</template>

<style scoped>

</style>
<script setup>
import zhCn from "element-plus/es/locale/lang/zh-cn";

const props = defineProps({
   width: {
    type: String,
    default: '100%',
  },
})
</script>
