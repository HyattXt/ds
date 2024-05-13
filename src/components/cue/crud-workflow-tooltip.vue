<template>
  <div class="cue-workflow__header" >
    <div class="cue-workflow__header-left">
      <el-tooltip content="保存" placement="top">
        <n-button text @click="$emit('saveEvent')">
          <n-icon size="18">
            <Save24Regular />
          </n-icon>
        </n-button>
      </el-tooltip>
      <el-tooltip content="执行" placement="top">
        <n-button text tag="div" :disabled="disableRun" style="margin-right: 20px" @click="$emit('runEvent')">
          <n-icon size="18">
            <PlayCircle20Regular />
          </n-icon>
        </n-button>
      </el-tooltip>
      <el-tooltip content="停止" placement="top">
        <n-button text tag="div" :disabled="disableStop" style="margin-right: 20px" @click="$emit('stopEvent')">
          <n-icon size="18">
            <RecordStop24Regular />
          </n-icon>
        </n-button>
      </el-tooltip>
      <el-tooltip v-if="showFormat" content="格式化" placement="top">
        <n-button text @click="$emit('formatEvent')">
          <n-icon size="18">
            <Broom16Filled />
          </n-icon>
        </n-button>
      </el-tooltip>
      <n-tag v-if="showOnline" type="info">
        已上线
      </n-tag>
    </div>
    <div class="cue-workflow__header-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup>

import { Save24Regular, PlayCircle20Regular, RecordStop24Regular, Broom16Filled } from '@vicons/fluent'

defineProps({
  disableRun: {
    type: Boolean,
    default: false
  },
  disableStop: {
    type: Boolean,
    default: true
  },
  showFormat: {
    type: Boolean,
    default: false
  },
  showOnline: {
    type: Boolean,
    default: false
  }
})

</script>

<style lang="scss">
@import '@/components/cue/variables.scss';

.cue-workflow__header {
  width: 100%;
  border-bottom: 1px solid #ddd;
  padding: 0 20px;
  height: 40px;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  flex-flow: row nowrap;
  -webkit-box-align: center;
  align-items: center;
  background-color: #fff;

  >div {
    width: 50%;
    height: 100%;
  }

  .cue-workflow__header-left {
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    flex-flow: row nowrap;
    -webkit-box-align: center;
    align-items: center;

     button {
      margin-right: 20px;
      cursor: pointer;
    }
  }

  .cue-workflow__header-right {
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    flex-flow: row nowrap;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: end;
    justify-content: flex-end;
    padding-right: 56px;
  }
}
</style>
