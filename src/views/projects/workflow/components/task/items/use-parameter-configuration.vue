<script setup >

import * as Fields from "@/views/projects/task/components/node/fields";
import getElementByJson from "@/components/form/get-elements-by-json";
import {onMounted, ref, unref} from 'vue';
import {useMessage} from "naive-ui";

const props = defineProps({
  formModel: {
    type: Object,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  isSimple: {
    type: Boolean,
    default: false
  }
})

const formRef = ref()
const message = useMessage()
const emit = defineEmits(['update-param-config'])
const paramModel = ref ({
  localParams: []
})

const json = [  ...Fields.useCustomParams({ model: paramModel.value, field: 'localParams', isSimple: props.isSimple })]

const { rules, elements } = getElementByJson(json, paramModel.value)

function save() {
  formRef.value.validate((errors) => {
    if (!errors) {
      emit('update-param-config', 1, paramModel.value);
    } else {
      message.error('验证失败，请填写完整参数配置')
    }
  })
}

defineExpose({save})

onMounted( () => {
  paramModel.value.localParams = props.formModel.localParams.slice()
})

</script>

<template>
  <NForm :disabled="props.disabled" size="small" label-placement="left" label-align="right" label-width="120" :rules="rules" :model="paramModel" ref="formRef">
  <NGrid x-gap="10">
    <NFormItemGi
        v-for="element in elements"
        :key="element.path || String(Date.now() + Math.random())"
        :span="unref(element.span) === void 0 ? 24 : unref(element.span)"
        :path="element.path"
        :showLabel="element.showLabel"
        :label="element.label"
        :type="element.type"
        :class="element.class"
    >
      <component :is="element.widget" />
    </NFormItemGi>
  </NGrid>
  </NForm>
</template>

<style scoped>

</style>
