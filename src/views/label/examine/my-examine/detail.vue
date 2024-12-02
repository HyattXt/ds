<template>
  <div class="n-scrollbar-container">
    <CrudHead class="sticky-top" title="审批内容">
      <template v-slot:button-group>
        <div v-if="basicInfo.ifEdit">
          <el-button
              class="show-text el-button--default"
              @click="handleExamine(3)"
          >
            拒绝
          </el-button>
        </div>
        <div v-if="basicInfo.ifEdit">
          <el-button
              class="show-text el-button--primary"
              color="#0099CB"
              @click="handleExamine(1)"
          >
            同意
          </el-button>
        </div>
      </template>
    </CrudHead>
    <n-card size="small" style="height: 200px">
      <CrudSplit title="申请信息"/>
        <n-descriptions label-placement="left" label-style="color: grey;" content-style="width: 250px; border-bottom: 1px solid #ddd;margin-bottom: 10px" style="padding: 20px">
          <n-descriptions-item label="对象名称">
            {{ basicInfo.objName }}
          </n-descriptions-item>
          <n-descriptions-item label="申请类型">
            {{ basicInfo.approvalType }}
          </n-descriptions-item>
          <n-descriptions-item label="审批状态">
            {{ basicInfo.approvalStatus }}
          </n-descriptions-item>
          <n-descriptions-item label="申请时间">
            {{ basicInfo.applicationTime }}
          </n-descriptions-item>
          <n-descriptions-item label="申请人">
            {{ basicInfo.userName }}
          </n-descriptions-item>
        </n-descriptions>
    </n-card>
    <n-card size="small" style="flex: 1">
      <CrudSplit title="审批记录"/>
      <n-timeline size="large" style="padding: 40px">
        <n-timeline-item content="开始" />
        <n-timeline-item
            type="info"
            title="提交申请"
            :content="`申请人：${basicInfo.userName} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;申请理由：${basicInfo.reasonForApplication || '无'}`"
            :time="basicInfo.applicationTime"
        />
        <n-timeline-item
            :type="basicInfo.approvalColor"
            :title="basicInfo.approvalStatus"
            :content="basicInfo.approver ? `审批人：${basicInfo.approver} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;审批意见：${basicInfo.approvalOpinion || '无'}` : null"
            :time="basicInfo.approvalTime"
            :line-type="basicInfo.approvalColor === 'info' ? 'dashed' : 'default'"
        />
        <n-timeline-item content="结束" />
      </n-timeline>
    </n-card>
  </div>
  <el-dialog v-model="ifModel" :before-close="dialogVisible" width="30%" append-to-body class="model-form-wrapper">
    <template #header> 审批确认 </template>
    <n-form
        :size="'small'"
        :model='formValue'
        label-placement="left"
        require-mark-placement="left"
        :label-width="90"
        ref="formRef"
        :rules="rules"
    >
      <n-form-item label="审批结果:" path="approvalStatus">
        <n-select
            v-model:value="formValue.approvalStatus"
            :options="[{ label: '同意', value: 1 }, { label: '拒绝', value: 3 }]"
            disabled
        />
      </n-form-item>
      <n-form-item label="审批意见:" path="approvalOpinion">
        <n-input v-model:value="formValue.approvalOpinion" type="textarea"/>
      </n-form-item>
    </n-form>
    <template #footer>
      <n-button color="#0099CB" type="primary" size="small" @click="handleApproval">确定</n-button>
    </template>
  </el-dialog>
</template>

<script setup>

import {onMounted, ref} from "vue";
import CrudHead from "@/components/cue/crud-header.vue";
import CrudSplit from "@/components/cue/crud-split.vue";
import {ElButton} from "element-plus";
import {NButton, useMessage} from "naive-ui";
import {updateApproval} from "@/service/modules/data-bussiness";
import {useRouter} from "vue-router";

const router = useRouter()
const message = useMessage()
const basicInfo = ref({})
const ifModel = ref(false)
const formRef = ref(null)
const formValue = ref({
  approvalStatus: null,
  approvalOpinion: '',
  objNum: '',
  approvalType: null
})

const handleExamine = (flag) => {
  ifModel.value = true
  formValue.value.approvalStatus = flag
  if(flag === 3) {
    rules.value = {
      approvalOpinion: {
        required: true,
        message: '请输入原因',
        trigger: 'blur'
      }
    }
  }
}

const dialogVisible = () => {
  ifModel.value = false
  rules.value = {}
  formRef.value?.restoreValidation()
}

const handleApproval = async () => {
  formRef.value.validate(async (errors) => {
    if (!errors) {
      let params = {...formValue.value, id: basicInfo.value.id, objNum: basicInfo.value.objNum, approvalType: basicInfo.value.approvalTypeCode }
      await updateApproval(params)
      message.info('成功')
      ifModel.value = false
      formValue.value.approvalOpinion = ''
      router.go(-1)
    } else {
      message.error('验证失败，请填写完整信息')
    }
  })
}

const rules = ref({})

onMounted(() => {
  basicInfo.value = history.state
})
</script>

<style scoped>
.n-scrollbar-container {
  display: flex;
  flex-direction: column; /* 垂直布局 */
  height: 100%; /* 使容器占满整个视口高度 */
}

.sticky-top {
  position: sticky;
  top: 0; /* 粘在顶部 */
  z-index: 10; /* 确保固定在顶部的div在其他内容之上 */
  padding: 10px; /* 添加一些内边距 */
}

::-webkit-scrollbar {
  display: none;
}

</style>
