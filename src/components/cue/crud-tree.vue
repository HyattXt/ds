<template>
  <el-config-provider :locale="zhCn">
  <div class="cue-drag-layout__mainview" style="width: 280px; margin-right: 12px">
    <div class="tree-container">
      <div class="add-buttons">
        <span class="title">分类</span>
        <div class="button-item-toggle" @click="packHandle" :title="expandedKeys.length ? '收起' : '展开'">
          <n-icon size="16" style="padding-top: 5px"><CaretUp v-if="expandedKeys.length"/><CaretDown v-else /></n-icon>
        </div>
        <div v-if="addButton" class="button-item" @click="$emit('addEvent')" title="添加">
          <n-icon size="16"><Add12Filled/></n-icon>
        </div>
      </div>
      <n-input
          type="text"
          placeholder="搜索"
          class="search-input"
          v-model:value="pattern"
      >
        <template #suffix>
          <n-icon :component="SearchOutlined"/>
        </template>
      </n-input>
      <n-tree
          class="tree-scrollbar"
          block-line
          show-irrelevant-nodes
          :data="folderData"
          key-field="id"
          label-field="titleName"
          children-field="children"
          :pattern="pattern"
          @update:expanded-keys="onExpandedKeys"
          :expanded-keys="expandedKeys"
          :render-prefix="menuIcon"
          :render-suffix="renderSuffix"
          :nodeProps="nodeProps"
      />
    </div>
  </div>
  <el-dialog
      v-model="showAddRef"
      :before-close="addDialogVisible"
      width="500px"
  >
    <template #header> 新建文件夹 </template>
    <el-form
        ref="ruleFormRef"
        :rules="rules"
        :model="addFormValue"
    >
      <el-form-item required label="文件夹名称" prop="titleName">
        <el-input type="text" style="width: 240px" v-model="addFormValue.titleName"/>
      </el-form-item>
      <el-form-item required style="padding-top: 20px" label="目标文件夹">
        <el-tree-select
            :data="treeFolder"
            node-key="id"
            :props="folderProps"
            v-model="selectedMenu"
            check-strictly
            style="width: 240px"
            popper-class="form-item-select"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button color="#0099CB" @click="createMenu(ruleFormRef)" >确定</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
      v-model="showUpdateRef"
      :before-close="updateDialogVisible"
      title="修改文件夹"
      width="500px"
  >
    <template #header> 修改文件夹 </template>
    <el-form
        ref="ruleFormRef"
        :rules="rules"
        :model="updateFormValue"
    >
      <el-form-item required label="文件夹名称" prop="titleName">
        <el-input type="text" style="width: 240px" v-model="updateFormValue.titleName" @input="handleUpdateInput"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button color="#0099CB" @click="updateMenu(ruleFormRef)" >确定</el-button>
      </div>
    </template>
  </el-dialog>
  </el-config-provider>
</template>

<script setup>

import { SearchOutlined} from "@vicons/antd";
import { Add12Filled } from "@vicons/fluent";
import { CaretUp, CaretDown } from "@vicons/fa";
import { ref, unref} from "vue";
import { NIcon, useMessage} from "naive-ui";
import {ElButton} from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";

const props = defineProps({
  treeFolder: Array,
  folderData: Array,
  selectedMenu: Number,
  menuIcon: Function,
  renderSuffix: Function,
  nodeProps: Function,
  addButton: {
    type: Boolean,
    default: false
  },
  showAddRef: {
    type: Boolean,
    default: false
  },
  showUpdateRef: {
    type: Boolean,
    default: false
  },
  updateFormValue: Object,
  addFormValue: Object
})

const emit = defineEmits([
  'addEvent',
  'updateMenu',
  'createMenu',
  'update:updateFormValue.titleName',
  'update:addFormValue.titleName',
  'update:showUpdateRef',
])

const expandedKeys = ref([]);
const pattern = ref('');
const ruleFormRef = ref()
const message = useMessage()

const  folderProps = {
  children: 'children',
  label: 'titleName',
}

const rules = {
  titleName: {
    required: true,
    message: '请输入名称',
    trigger: 'blur'
  }
}

function addDialogVisible () {
  props.addFormValue.titleName = ''
  emit('update:showAddRef', false)
  emit('update:addFormValue.titleName', props.addFormValue.titleName)
}

function updateDialogVisible () {
  props.updateFormValue.titleName = ''
  emit('update:showUpdateRef', false)
  emit('update:updateFormValue.titleName', props.updateFormValue.titleName)
}
function handleUpdateInput () {
  emit('update:updateFormValue.titleName', props.updateFormValue.titleName)
}

function createMenu(ruleFormRef) {
  ruleFormRef.validate((valid) => {
    if (valid) {
      emit('createMenu')
    } else {
      message.error('验证失败，请填写完整信息')
    }
  })
}

function updateMenu(ruleFormRef) {
  ruleFormRef.validate((valid) => {
    if (valid) {
      emit('updateMenu')
    } else {
      message.error('验证失败，请填写完整信息')
    }
  })
}

function onExpandedKeys(keys) {
  expandedKeys.value = keys;
}
function packHandle() {
  if (expandedKeys.value.length) {
    expandedKeys.value = [];
  } else {
    setId(unref(props.treeFolder))
  }
}

function setId(datas) { //遍历树  获取id数组
  for (let i in datas) {
    expandedKeys.value.push(datas[i].id)  // 遍历项目满足条件后的操作
    if (datas[i].children) {  //存在子节点就递归
      setId(datas[i].children);
    }
  }
}

</script>

<style scoped>

</style>
