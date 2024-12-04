<template>
  <CrudForm :showPage="false">
    <template v-slot:header>
      <CrudHeader title="资源规划">
        <template v-slot:button-group>
          <div>
            <el-button
                class="show-text el-button--default"
                @click="save"
            >
              保存
            </el-button>
          </div>
        </template>
      </CrudHeader>
    </template>
    <template v-slot:table>
        <n-data-table
            remote
            bordered
            flex-height
            style="height: 100%"
            size="small"
            :columns="columns"
            :data="data"
            :single-line="false"
            class="input-table"
        />
    </template>
  </CrudForm>
</template>

<script setup>
import { onMounted, ref, h } from 'vue'
import CrudHeader from "@/components/cue/crud-header.vue";
import CrudForm from "@/components/cue/crud-form.vue";
import {NInput, NSelect, useMessage} from "naive-ui";
import {resourcePlanningList, resourcePlanningUpdate} from "@/service/modules/resources";

const data = ref([])
const message = useMessage()

const columns = [
  {
    title: "序号",
    key: "systemName",
    width: 80,
    render: (_, index) => {
      return `${index + 1}`
    }
  },
  {
    title: "系统名称",
    key: "systemName",
    width: 300,
    render(row, index) {
      return h(NInput, {
        value: row.systemName,
        onUpdateValue(v) {
          data.value[index].systemName = v;
        }
      })
    }
  },
  {
    title: "是否对接",
    key: "abutmentStatus",
    width: 300,
    render(row, index) {
      return h(NSelect, {
        value: row.abutmentStatus,
        options: [{value: '1', label: '是'},{value: '0', label: '否'}],
        onUpdateValue(v) {
          data.value[index].abutmentStatus = v;
        }
      })
    }
  },
  {
    title: "备注",
    key: "remarks",
    render(row, index) {
      return h(NInput, {
        value: row.remarks,
        onUpdateValue(v) {
          data.value[index].remarks = v;
        }
      })
    }
  }
]

const save = async () => {
  await resourcePlanningUpdate({ resourcePlanningList: data.value })
  message.info('成功')
  await initData()
}

const initData = async () => {
  const list = await resourcePlanningList({})
  if(list.length) {
    data.value = list
  } else {
    data.value = [
      { systemName: "档案系统", abutmentStatus: '1', remarks: '' },
      { systemName: "企业管理域", abutmentStatus: '1', remarks: '' },
      { systemName: "协调办公", abutmentStatus: '1', remarks: '' },
      { systemName: "仓储管理", abutmentStatus: '1', remarks: '' },
      { systemName: "设备管理", abutmentStatus: '1', remarks: '' },
      { systemName: "水力模型", abutmentStatus: '1', remarks: '' },
      { systemName: "生产调度", abutmentStatus: '1', remarks: '' },
      { systemName: "应急指挥", abutmentStatus: '1', remarks: '' },
      { systemName: "科学调度", abutmentStatus: '1', remarks: '' },
      { systemName: "热线服务", abutmentStatus: '1', remarks: '' },
      { systemName: "二供管理系统", abutmentStatus: '1', remarks: '' },
      { systemName: "营业服务", abutmentStatus: '1', remarks: '' },
      { systemName: "地理信息系统", abutmentStatus: '1', remarks: '' },
      { systemName: "表务管理", abutmentStatus: '1', remarks: '' },
      { systemName: "漏损管理系统", abutmentStatus: '1', remarks: '' },
      { systemName: "工程报表", abutmentStatus: '1', remarks: '' },
      { systemName: "管网管理域", abutmentStatus: '1', remarks: '' },
      { systemName: "工单管理系统", abutmentStatus: '1', remarks: '' }
    ]
  }
}


onMounted(() => {
  initData()
})
</script>

<style lang="scss" scoped>
.input-table {
  :deep(.n-data-table-td) {
    padding: 0
  }
}
</style>
