<template>
  <div class="cue-crud__header" >
    <div class="cue-crud__header-title">
      <i class="cue-crud__header-icon iconfont icon-yingyong01"/>
      {{ title }}
    </div>
    <div class="cue-crud__header-right">
      <el-button
          v-if="defineButton"
          class="show-text el-button--default"
          :loading="loadingMeta"
          @click="$emit('clickEvent')"
      >
        {{ buttonTitle }}
      </el-button>
      <el-button title="新增" v-if="addButton" class="el-button--default" @click="$emit('addEvent')">
        <i class="iconfont fa-plus" aria-hidden="true"/>
      </el-button>
      <el-button title="修改" v-if="updateButton" :disabled="disableUpdate" class="el-button--default" @click="$emit('updateEvent')">
        <i class="iconfont fa-pencil" aria-hidden="true"/>
      </el-button>
      <el-button title="删除" v-if="deleteButton" :disabled="disableDelete" class="el-button--default" @click="$emit('deleteEvent')">
        <i class="iconfont fa-trash" aria-hidden="true"/>
      </el-button>
    </div>
  </div>
</template>

<script setup>

defineProps({
  title: String,
  buttonTitle: String,
  loadingMeta: Boolean,
  defineButton: {
    type: Boolean,
    default: false
  },
  addButton: {
    type: Boolean,
    default: false
  },
  updateButton: {
    type: Boolean,
    default: false
  },
  disableUpdate: {
    type: Boolean,
    default: true
  },
  deleteButton: {
    type: Boolean,
    default: false
  },
  disableDelete: {
    type: Boolean,
    default: true
  },
})

</script>

<style lang="scss">
@import '@/components/cue/variables.scss';
@import '@/assets/fonts/iconfont.css';

.cue-crud__header {
  justify-content: space-between;
  padding: 8px 16px;
  align-items: center;
  min-height: 44px;
  background: $background-base;
  color: $color-common;
  display: flex;

  .cue-crud__header-icon {
    font-size: 15px;
    width: 25px;
    height: 25px;
    background: #FF884A;
    color: #ffffff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
    margin-right: 8px;
  }

  .cue-crud__header-title {
    line-height: unset;
    height: auto;
    margin:0;
    border: 0;
    padding: 0;
    font: 16px/1.5 "Microsoft YaHei","Arial","Hiragino Sans GB","PingFang SC","Helvetica","Verdana","微软雅黑","Verdana",sans-serif;
  }

  .cue-crud__header-right {
    display: inline-flex;
    padding-left: 20px;
    padding-bottom:6px;
    flex-shrink: 0;

    .el-button {
      margin-left: 8px;
      border: 0;
      height: 28px;
      width: 28px;


      &.el-button--default {
        background-color: $button-background-color;
        color: #000000;
        &:active {
          color: $color-primary;
          border-color: $color-primary;
          outline: none;
        }

        &:hover, &:focus {
          color: $color-primary;
          border-color: $button-hover-border-color;
          background-color: $button-hover-background-color;
        }

        &.is-disabled{
          color: $button-disabled-color;
          background-color: $button-disabled-background-color;
          border-color: $button-disabled-border-color;
        }

      }

      // iconfont 字体边距微调
      .iconfont {
        font-size: 13px;
        display: inline-block;
        height: 16px;
        line-height: 16px;
      }

      &.show-text {
        padding: 0 10px;
        width: auto;
        margin-left: 10px;
        font-size: 12px;
        background-color: $button-disabled-background-color;

        &.el-button--primary{
          border-color: $color-primary;
          background-color: $color-primary;
          color: #fff;
        }

        .handle-text {
          display: inline-block;
        }
        i {
          display: none;
        }
      }
    }
  }
}
</style>
