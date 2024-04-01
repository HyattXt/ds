<template>
  <div class="row-split"
       :class="{'split-icon':!$slots.icon}"
       :style="{'--no-padding':padding,'--height':height}"
  >
    <div class="split__left">
      <slot name="icon"></slot>
      <slot>
        {{ title }}
      </slot>
    </div>
    <div class="split__right">
      <slot name="right"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CrudSplit',
  props: {
    title: {
      type: String,
      default: ''
    },
    height:{
      type:String,
      default:'48px'
    },
    noPadding: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    padding() {
      return this.noPadding ? 0 : '16px'
    }
  }
}
</script>
<style scoped lang="less">
.row-split {
  display: flex;
  align-items: center;
  padding: 0 var(--no-padding);
  box-sizing: border-box;
  justify-content: space-between;
  height: 30px ;
  background: #eee;
  font: 12px/1.5 "Microsoft YaHei","Arial","Hiragino Sans GB","PingFang SC","Helvetica","Verdana","微软雅黑","Verdana",sans-serif;
  color: #000000;

  &.split-icon::before {
    content: '';
    background: #2B96EF;
    height: 16px;
    width: 3px;
    margin-right: 10px;
  }

  .split__left, .split__right {
    flex: auto;

  }

  .split__right {
    display: flex;
    justify-content: right;
  }
}
</style>
