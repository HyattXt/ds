<template>
  <div>
    <n-result
      status="success"
      title="提交成功"
      description="请前往API管理查看"
      class="step-result"
    >
      <template #footer>
        <div
          class="flex justify-center"
          style="margin-left: 150px; margin-top: 180px"
        >
          <n-space>
            <router-link to="/service/api-dev-step">
              <n-button color="#0099CB" type="primary" class="mr-4">继续</n-button>
            </router-link>
            <router-link to="/service/api-dev">
              <n-button tertiary>退出</n-button>
            </router-link>
          </n-space>
        </div>
      </template>
    </n-result>
  </div>
</template>

<script lang="ts" setup>
  const emit = defineEmits(['finish', 'prevStep'])
  function prevStep() {
    emit('prevStep')
  }

  function finish() {
    emit('finish')
  }
</script>

<style lang="less" scoped>
  .step-result {
    max-width: 560px;
    margin: 40px auto 0;

    :deep(.n-result-content) {
      background-color: #fafafa;
      padding: 24px 40px;
    }

    .information {
      line-height: 22px;

      .ant-row:not(:last-child) {
        margin-bottom: 24px;
      }
    }

    .money {
      font-family: 'Helvetica Neue', sans-serif;
      font-weight: 500;
      font-size: 20px;
      line-height: 14px;
    }
  }
  a {
    text-decoration: none;
  }
</style>
