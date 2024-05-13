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
const resourcesModel = ref ({
  resourceList: []
})

const json = [ Fields.useResources() ]

const { rules, elements } = getElementByJson(json, resourcesModel.value)
console.log(elements)
console.log("elements")

function save() {
  emit('update-resources', 2, resourcesModel.value);
}

defineExpose({save})

onMounted( () => {
  resourcesModel.value.resourceList = props.formModel.resourceList
})

</script>

<template>
  <NForm :disabled="props.disabled" size="small" label-placement="left" label-align="right" label-width="120" :rules="rules" :model="resourcesModel" ref="formRef">
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
