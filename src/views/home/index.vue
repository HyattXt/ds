<template>
  <div class="page flex-col">
    <div class="box_3 flex-col">
      <div class="group_5 flex-row">
        <img
            :src="topImagePath.one"
            class="image hover_image"
            referrerpolicy="no-referrer"
        />
        <div class="text-wrapper flex-col justify-between">
          <span class="text_number" @click="handleClick('datasource')">{{ data.dataSourceNum }}</span> <span class="text_title">数据连接</span>
        </div>
        <img
            :src="topImagePath.two"
            class="image hover_image"
            referrerpolicy="no-referrer"
        />
        <div class="text-wrapper flex-col justify-between">
          <span class="text_number" @click="handleClick('api')">{{ data.interfaceNum }}</span> <span class="text_title">数据服务</span>
        </div>
        <img
            :src="topImagePath.three"
            class="image hover_image"
            referrerpolicy="no-referrer"
        />
        <div class="text-wrapper flex-col justify-between">
          <span class="text_number" @click="handleClick('dataElement')">{{ data.dataElementNum }}</span> <span class="text_title">数据元</span>
        </div>
        <img
            :src="topImagePath.four"
            class="image hover_image"
            referrerpolicy="no-referrer"
        />
        <div class="text-wrapper flex-col justify-between">
          <span class="text_number" @click="handleClick('dataModel')">{{ data.dataModel }}</span> <span class="text_title">数据模型</span>
        </div>
        <img
            :src="topImagePath.five"
            class="image hover_image"
            referrerpolicy="no-referrer"
        />
        <div class="text-wrapper flex-col justify-between">
          <span class="text_number" @click="handleClick('workFlow')">{{ data.processNum }}</span> <span class="text_title">任务流</span>
        </div>
        <img
            :src="topImagePath.six"
            class="image hover_image"
            referrerpolicy="no-referrer"
        />
        <div class="text-wrapper flex-col justify-between">
          <span class="text_number" @click="handleClick('workInstance')">{{ data.taskNum }}</span> <span class="text_title">任务实例</span>
        </div>
        <img
            :src="topImagePath.seven"
            class="image hover_image"
            referrerpolicy="no-referrer"
        />
        <div class="text-wrapper flex-col justify-between">
          <span class="text_number" @click="handleClick('dataAsset')">{{ data.assetsNum }}</span> <span class="text_title">数据资产</span>
        </div>
        <div class="box_4 flex-col"></div>
      </div>
      <div class="group_6 flex-row">
        <div class="group_7 flex-col">
          <div class="grid_1 flex-row">
            <div
                v-for="(item, index) in loopData0"
                :key="index"
                :style="{ background: 'url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng1964f580694fe48c7c7d77510a12885aa30e557b31e2f9e6f40daea4f80f5273) 0px -1px no-repeat' }"
                class="image-text_1 flex-row"
            >
              <img
                  :src="item.lanhuimage0"
                  class="label_1 hover_image"
                  referrerpolicy="no-referrer"
              />
              <div
                  v-if="item.slot2 === 2"
                  class="text-group_1 flex-col justify-between"
              >
                <span
                    class="text_29"
                    v-html="item.specialSlot2.lanhutext0"
                ></span>
                <span
                    class="text_30"
                    v-html="item.specialSlot2.lanhutext1"
                ></span>
              </div>
              <div
                  v-if="item.slot1 === 1"
                  class="text-group_1 flex-col justify-between"
              >
                <span
                    class="text_29"
                    v-html="item.specialSlot1.lanhutext0"
                ></span>
                <span
                    class="text_30"
                    v-html="item.specialSlot1.lanhutext1"
                ></span>
              </div>
            </div>
          </div>
        </div>
        <img
            :src='mainImagePath'
            class="image_9 hover_image_large"
            referrerpolicy="no-referrer"
        />
      </div>
      <span style="margin: 28px 0 0 10px;">资源规划</span>
      <div class="group_8 flex-row">
        <div v-for="(item, index) in firstListData" :key="index" :class="{'text-wrapper flex-col hover_div': item.abutmentStatus === '1', 'disable-text-wrapper flex-col hover_div': item.abutmentStatus === '0'}">
          <span :class="{'text': item.abutmentStatus === '1', 'disable-text': item.abutmentStatus === '0'}">{{item.systemName}}</span>
        </div>
      </div>
      <div class="group_8 flex-row">
        <div v-for="(item, index) in secondListData" :key="index" :class="{'text-wrapper flex-col hover_div': item.abutmentStatus === '1', 'disable-text-wrapper flex-col hover_div': item.abutmentStatus === '0'}">
          <span :class="{'text': item.abutmentStatus === '1', 'disable-text': item.abutmentStatus === '0'}">{{item.systemName}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {onMounted, ref} from "vue";
import {useUserStore} from "@/store/user/user";
import {useRouter} from "vue-router";
import {getDatasourceHome} from "@/service/modules/data-source";
import {resourcePlanningList} from "@/service/modules/resources";

const userStore = useUserStore()
const router = useRouter()
const data = ref({})
const firstListData = ref([])
const secondListData = ref([])
const loopData0 = [
  {
    lanhuimage0: `${import.meta.env.BASE_URL}images/home/2-1.png`,
    specialSlot1: {
      lanhutext0: '数据规划',
      lanhutext1: '基于智慧水务数据归集与数据源维护',
    },
    slot1: 1,
  },
  {
    lanhuimage0: `${import.meta.env.BASE_URL}images/home/2-2.png`,
    specialSlot2: {
      lanhutext0: '数据工厂',
      lanhutext1:
          '定义数据标准，对平台模型与元数据，数据质量与数据安全进行管理',
    },
    slot2: 2,
  },
  {
    lanhuimage0: `${import.meta.env.BASE_URL}images/home/2-3.png`,
    specialSlot1: {
      lanhutext0: '数据开发',
      lanhutext1: '基于归集数据进行数据模型开发以及数据处理',
    },
    slot1: 1,
  },
  {
    lanhuimage0: `${import.meta.env.BASE_URL}images/home/2-4.png`,
    specialSlot2: {
      lanhutext0: '资源管理',
      lanhutext1:
          '对资产进行编目统计，指标会聚等操作，数据血缘以及基本信息展示',
    },
    slot2: 2,
  },
  {
    lanhuimage0: `${import.meta.env.BASE_URL}images/home/2-5.png`,
    specialSlot1: {
      lanhutext0: '服务开发',
      lanhutext1: '基于自定义SQL以及封装API低代码服务开发',
    },
    slot1: 1,
  },
  {
    lanhuimage0: `${import.meta.env.BASE_URL}images/home/2-6.png`,
    specialSlot2: {
      lanhutext0: '数据运营',
      lanhutext1: '基于资源管理资源库数据对优质数据进行运营管理',
    },
    slot2: 2,
  },
  {
    lanhuimage0: `${import.meta.env.BASE_URL}images/home/2-5.png`,
    specialSlot1: {
      lanhutext0: '运维中心',
      lanhutext1: '对数据开发以及服务开发的任务进行运维和告警等操作',
    },
    slot1: 1,
  },
  {
    lanhuimage0: `${import.meta.env.BASE_URL}images/home/2-6.png`,
    specialSlot2: {
      lanhutext0: '数据标签',
      lanhutext1: '基于资源管理资源库数据对优质数据进行运营管理',
    },
    slot2: 2,
  },
]
const mainImagePath = `${import.meta.env.BASE_URL}images/home/main.png`
const topImagePath = {
  one: `${import.meta.env.BASE_URL}images/home/1.png`,
  two: `${import.meta.env.BASE_URL}images/home/2.png`,
  three: `${import.meta.env.BASE_URL}images/home/3.png`,
  four: `${import.meta.env.BASE_URL}images/home/4.png`,
  five: `${import.meta.env.BASE_URL}images/home/5.png`,
  six: `${import.meta.env.BASE_URL}images/home/5.png`,
  seven: `${import.meta.env.BASE_URL}images/home/7.png`
}

const initData = async () => {
  data.value = await getDatasourceHome()
  const list = await resourcePlanningList({})
  if(list.length) {
    firstListData.value = list.slice(0, 9)
    secondListData.value = list.slice(9)
  } else {
    firstListData.value = [
      { systemName: "档案系统", abutmentStatus: '1', remarks: '' },
      { systemName: "企业管理域", abutmentStatus: '1', remarks: '' },
      { systemName: "协调办公", abutmentStatus: '1', remarks: '' },
      { systemName: "仓储管理", abutmentStatus: '1', remarks: '' },
      { systemName: "设备管理", abutmentStatus: '1', remarks: '' },
      { systemName: "水利模型", abutmentStatus: '1', remarks: '' },
      { systemName: "生产调度", abutmentStatus: '1', remarks: '' },
      { systemName: "应急指挥", abutmentStatus: '1', remarks: '' },
      { systemName: "科学调度", abutmentStatus: '1', remarks: '' }
    ]
    secondListData.value =[
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

const handleClick = (type) => {
  switch (type) {
    case 'datasource':
      router.push({
        path: '/datasource',
        query: {back: true}
      })
      break
    case 'api':
      router.push({
        path: '/service/api-dev',
        query: {back: true}
      })
      break
    case 'dataElement':
      router.push({
        path: '/data-assets/data-standard/standard-list',
        query: {back: true}
      })
      break
    case 'dataModel':
      router.push({
        path: '/data-assets/data-standard/model-list',
        query: {back: true}
      })
      break
    case 'workFlow':
      router.push({
        path: `/devops/${window.webConfig.VITE_APP_PROD_PROJECT_ID}/workflow-definition`,
        query: {back: true}
      })
      break
    case 'workInstance':
      break
    case 'dataAsset':
      router.push({
        path: '/data-assets/assets-classify',
        query: {back: true}
      })
      break
  }
}

onMounted(() => {
  // @ts-ignore
  console.log(__APP_VERSION__)
  initData()
})

</script>

<style scoped>
.page {
  background-color: rgba(232, 235, 240, 1);
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .box_3 {
    width: 100%;
    height: 100%;
    background-color: white;
    .group_5 {
      background-color: rgba(206, 206, 206, 0.13);
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      height: 88px;
      margin: 16px 16px 0 16px;
      .image {
        width: 50px;
        height: 50px;
        margin: 19px 0 0 30px;
      }
      .text-wrapper {
        width: 56px;
        height: 55px;
        margin: 13px 30px 0 0;
        .text_number {
          width: 29px;
          height: 35px;
          overflow-wrap: break-word;
          color: rgb(50, 166, 238);
          font-size: 24px;
          font-family: SourceHanSansSC-Bold;
          font-weight: 700;
          text-align: left;
          white-space: nowrap;
          line-height: 35px;
          cursor: pointer;
        }
        .text_title {
          width: 56px;
          height: 20px;
          overflow-wrap: break-word;
          color: rgba(34, 34, 34, 1);
          font-size: 16px;
          font-weight: bold;
          text-align: left;
          white-space: nowrap;
          line-height: 20px;
        }
      }
    }
    .group_6 {
      width: 100%;
      height: calc(100% - 300px);
      margin: 19px 0 0 16px;
      .group_7 {
        width: 50%;
        height: 100%;
        margin-top: 4px;
        justify-content: center;
        .grid_1 {
          width: 783px;
          height: 80%;
          flex-wrap: wrap;
          .image-text_1 {
            width: 374px;
            height: 70px;
            background-size: 374px 71px;
            margin: 0 35px 16px 0;
            &:nth-child(2n) {
              margin-right: 0;
            }
            &:nth-last-child(-n + 2) {
              margin-bottom: 0;
            }
            .label_1 {
              width: 40px;
              height: 40px;
              margin: 15px 0 0 10px;
            }
            .text-group_1 {
              width: 360px;
              height: 53px;
              margin: 12px -56px 0 20px;
              .text_29 {
                width: 56px;
                height: 20px;
                overflow-wrap: break-word;
                color: rgb(25, 128, 128);
                font-size: 15px;
                font-family: PingFangSC-Medium;
                font-weight: 600;
                text-align: left;
                white-space: nowrap;
                line-height: 20px;
                margin-left: 1px;
              }
              .text_30 {
                width: 360px;
                height: 32px;
                overflow-wrap: break-word;
                color: rgba(102, 102, 102, 1);
                font-size: 12px;
                font-weight: normal;
                text-align: left;
                line-height: 31px;
                margin-top: 1px;
              }
            }
          }
        }
      }
      .image_9 {
        width: 50%;
        height: 100%;
        margin-left: -20px;
      }
    }
    .group_8 {
      height: 40px;
      margin: 16px 10px 0 10px;
      display: flex;
      justify-content: space-between;
      .text-wrapper {
        background-color: rgba(96, 185, 255, 0.084);
        border-radius: 2px;
        height: 100%;
        border: 1px solid rgba(28, 137, 255, 0.21);
        width: 10%;
        .text {
          height: 100%;
          overflow-wrap: break-word;
          color: rgb(25, 128, 128);
          font-size: 15px;
          font-weight: bold;
          display: flex;
          justify-content: center; /* 水平居中 */
          align-items: center; /* 垂直居中 */
          white-space: nowrap;
          line-height: 17px;
        }
      }
    .disable-text-wrapper {
      border-radius: 4px;
      height: 100%;
      width: 10%;
      .disable-text {
        height: 100%;
        overflow-wrap: break-word;
        font-size: 15px;
        font-weight: bold;
        color: #000000;
        display: flex;
        justify-content: center; /* 水平居中 */
        align-items: center; /* 垂直居中 */
        white-space: nowrap;
        line-height: 17px;
        background: #F7F7F7;
        border-radius: 4px;
        opacity: 0.58;
      }
    }
    }
  }
}

body * {
  box-sizing: border-box;
  flex-shrink: 0;
}
body {
  font-family: PingFangSC-Regular, Roboto, Helvetica Neue, Helvetica, Tahoma,
  Arial, PingFang SC-Light, Microsoft YaHei;
}
input {
  background-color: transparent;
  border: 0;
}
button {
  margin: 0;
  padding: 0;
  border: 1px solid transparent;
  outline: none;
  background-color: transparent;
}

button:active {
  opacity: 0.6;
}
.van-nav-bar__left:active,
.van-nav-bar__right:active {
  opacity: 1;
}
[class*='van-']::after {
  border-bottom: 0;
}
.flex-col {
  display: flex;
  flex-direction: column;
}
.flex-row {
  display: flex;
  flex-direction: row;
}
.justify-between {
  display: flex;
  justify-content: space-between;
}

</style>
