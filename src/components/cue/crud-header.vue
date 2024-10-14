<template>
  <div class="cue-crud__header" >
    <div class="cue-crud__header-title">
      <n-icon class="cue-crud__header-icon">
        <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="25" height="25"><path d="M91.093333 221.013333L455.125333 12.8a97.536 97.536 0 0 1 96.725334 0l364.032 208.213333A95.616 95.616 0 0 1 964.266667 303.872v416.170667a95.573333 95.573333 0 0 1-48.384 82.944l-364.032 208.128c-29.909333 17.109333-66.816 17.109333-96.725334 0l-364.032-208.128A95.573333 95.573333 0 0 1 42.666667 720.085333V303.872C42.666667 269.653333 61.184 238.08 91.093333 220.970667z m414.72 711.125334l366.293334-212.053334-2.304-420.138666-368.64-208.085334-366.293334 212.010667 2.304 420.138667 364.032 208.085333c0.682667 0.426667 1.493333 0.64 2.304 0.64l2.304-0.597333z" fill="#ffffff" p-id="2565"></path><path d="M456.192 454.698667L320.341333 372.266667c-28.885333-17.536-28.885333-61.397333 0-78.933334l135.850667-82.432a41.514667 41.514667 0 0 1 43.349333 0l135.850667 82.432c28.885333 17.536 28.885333 61.397333 0 78.933334l-135.850667 82.432a41.6 41.6 0 0 1-43.349333 0z" fill="#ffffff" p-id="2566"></path><path d="M505.856 365.653333L554.666667 336.426667 505.856 307.2l-48.853333 29.226667 48.853333 29.226666z m-37.248 195.968v161.621334c0 34.389333-35.882667 55.893333-64.597333 38.698666l-134.997334-80.810666a44.970667 44.970667 0 0 1-21.546666-38.698667V480.853333c0-34.389333 35.882667-55.893333 64.597333-38.698666l134.997333 80.810666c13.312 7.978667 21.546667 22.741333 21.546667 38.698667z" fill="#ffffff" p-id="2567"></path><path d="M350.933333 573.013333L298.666667 541.44v63.146667l52.266666 31.573333v-63.146667z m194.986667-69.632l144.426667-87.253333c30.72-18.56 69.12 4.650667 69.12 41.813333v174.506667c0 17.237333-8.789333 33.152-23.04 41.728l-144.426667 87.296c-30.72 18.56-69.12-4.650667-69.12-41.813333v-174.506667c0-17.237333 8.789333-33.152 23.04-41.770667z" fill="#ffffff"></path><path d="M605.866667 597.333333v68.266667l51.2-34.133333v-68.266667z" fill="#ffffff" ></path></svg>
      </n-icon>
      {{ title }}
    </div>
    <div class="cue-crud__header-right">
      <el-button
          v-if="$route.query.back"
          class="show-text el-button--default"
          @click="goBack"
      >
        返回
      </el-button>
      <slot name="button-group"></slot>
      <el-button
          v-if="defineButton"
          class="show-text el-button--default"
          :loading="loadingMeta"
          @click="$emit('clickEvent')"
      >
        {{ buttonTitle }}
      </el-button>
      <el-button title="新增" v-if="addButton" class="el-button--default" @click="$emit('addEvent')">
        <n-icon text><Plus/></n-icon>
      </el-button>
      <el-button title="修改" v-if="updateButton" :disabled="disableUpdate" class="el-button--default" @click="$emit('updateEvent')">
        <n-icon text><PencilAlt/></n-icon>
      </el-button>
      <el-button title="删除" v-if="deleteButton" :disabled="disableDelete" class="el-button--default" @click="$emit('deleteEvent')">
        <n-icon text><TrashAlt/></n-icon>
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { Plus, PencilAlt, TrashAlt } from '@vicons/fa'
import {useRoute, useRouter} from "vue-router";

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

const router = useRouter()
const route = useRoute()

const goBack = () => {
  router.go(-1)
}
</script>

<style lang="scss">
@import '@/components/cue/variables.scss';

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
