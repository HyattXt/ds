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
  }
})

const formRef = ref()
const message = useMessage()
const emit = defineEmits(['update-datasource'])
const datasourceModel = ref ({
  type: 'MYSQL',
  datasource: 0
})

const json = [ ...Fields.useDatasource(datasourceModel.value) ]

const { rules, elements } = getElementByJson(json, datasourceModel.value)

function save() {
  formRef.value.validate((errors) => {
    if (!errors) {
      emit('update-datasource', 2, datasourceModel.value);
    } else {
      message.error('验证失败，请填写完整数据源配置')
    }
  })
}

defineExpose({save})

onMounted( () => {
  datasourceModel.value.type = props.formModel.type
  datasourceModel.value.datasource = props.formModel.datasource
})

</script>

<template>
  <NForm :disabled="props.disabled" size="small" label-placement="left" label-align="right" label-width="120" :rules="rules" :model="datasourceModel" ref="formRef">
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
