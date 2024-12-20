<script setup >

import jsPlumb from 'jsplumb'
import {onMounted, ref, watch} from 'vue';
import {NIcon, useMessage} from "naive-ui";
import {CancelSharp} from "@vicons/material";

const props = defineProps({
  leftData: {
    type: Array,
    required: true
  },
  rightData: {
    type: Array,
    required: true
  },
  leftList: {
    type: Array,
    required: true
  },
  rightList: {
    type: Array,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  taskCode: {
    type: Number,
    default: false
  }
})

const container = ref(null);
const jsplumb = jsPlumb.jsPlumb
let plumbins = null // 缓存实例化的jsplumb对象
const showDeleteIcon = ref(false);
const deleteIconStyle = ref({ top: '0px', left: '0px' });

const message = useMessage()
const emit = defineEmits(['save-jsplumb'])
const leftList = ref([])
const rightList = ref([])

function save() {
  emit('save-jsplumb', leftList.value, rightList.value);
}

function init()  {
  //   初始化实例
  jsplumb.ready(() => {
    plumbins = jsplumb.getInstance({
      Container: props.taskCode+ '-plumbContent', // 选择器id
      Connector: ["Straight",
        {
          curviness: 70,
          gap: 8,
          cornerRadius: 5,
          alwaysRespectStubs: true,
        },], //直线连接
      ConnectionOverlays: [
        ['Arrow', {
          location: 1,
          visible: true,
          width: 8,
          length: 8,
          id: 'ARROW',
        }]
      ]
    });
    // 点击删除连线
    plumbins.bind("click", (connection, originalEvent) => {
      if(props.disabled) {
        originalEvent.preventDefault();
        originalEvent.stopPropagation();
      } else {
        plumbins.deleteConnection(connection);
        showDeleteIcon.value = false;
        getConnection()
      }
    });
    plumbins.bind("connection", (conn, originEvent) => {
      // 数据存入
      getConnection()
    });

    plumbins.bind("mouseover", (connectionInfo, originalEvent) => {
      if(props.disabled) {
        originalEvent.preventDefault();
        originalEvent.stopPropagation();
      } else {
        connectionInfo.canvas.style.cursor = 'pointer'

        const sourceElement = document.getElementById(connectionInfo.sourceId);
        const targetElement = document.getElementById(connectionInfo.targetId);

        const sourceRect = sourceElement.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();
        console.log("sourceElement",sourceElement)
        console.log("targetElement",targetElement)
        console.log("sourceRect",sourceRect)
        console.log("targetRect",targetRect)


        // 你可以据此计算源和目标的中心位置（clientX, clientY）
        const sourceClientX = sourceRect.right + window.scrollX
        const sourceClientY = sourceRect.top + window.scrollY + sourceRect.height / 2;

        const targetClientX = targetRect.left + window.scrollX
        const targetClientY = targetRect.top + window.scrollY + targetRect.height / 2;

        deleteIconStyle.value.left = `${(sourceClientX+targetClientX-50)/2}px`;
        deleteIconStyle.value.top = `${(sourceClientY+targetClientY-4)/2}px`;
        showDeleteIcon.value = true;

        const wheelHandler = (event) => {
          showDeleteIcon.value = false;
          // 移除滚轮事件监听
          window.removeEventListener('wheel', wheelHandler);
        };
        window.addEventListener('wheel', wheelHandler, { once: true });

      }

    });
    plumbins.bind("mouseout", (c) => {
      showDeleteIcon.value = false;
    });

    plumbins.batch(() => {
      props.leftData.forEach((item, index) => {
        initNode(item.id, "source");
      });
      props.rightData.forEach((item, index) => {
        initNode(item.id, "target");
      });
    });
  });
  window.addEventListener("resize", repaintPlumb);
  //禁用连接的拖拽和删除
  if(props.disabled){
    plumbins.importDefaults({
      ConnectionsDetachable: false,
      ReattachConnections: false
    });
  }
}

function initNode(id, type) {
  // 初始化点使其可以连接
  const ins = plumbins;
  const elements = document.getElementById(id);
  if (type === "source") {
    ins.makeSource(elements, {
      // 锚点
      anchor: [1, 0.5, 0, 0],
      allowLoopback: false,
      maxConnections: 1, //一对一就把maxConnections设置为1，一对多就设置为-1
      paintStyle: {
        stroke: '#33B5D4',
        fill: '#FFF',
        radius: 4,
        strokeWidth: 2,
      },
      hoverPaintStyle: {
        stroke: '#33B5D4',
        fill: '#33B5D4',
        cursor: 'pointer',
      },
      //   连线样式
      connectorStyle: {
        strokeWidth: 2,
        stroke: '#33B5D4',
        joinstyle: 'round',
        outlineStroke: 'transparent',
        outlineWidth: 2,
      },
      connectorHoverStyle: {
        strokeWidth: 3,
        stroke: '#33B5D4',
      },
    });
  } else {
    ins.makeTarget(elements, {
      anchor: [0, 0.5, 1, 0], // 锚点
      allowLoopback: false,
      maxConnections: 1, //一对一就把maxConnections设置为1，一对多就设置为-1
      paintStyle: {
        stroke: '#33B5D4',
        fill: '#FFF',
        radius: 4,
        strokeWidth: 2,
      },
      hoverPaintStyle: {
        stroke: '#33B5D4',
        fill: '#33B5D4',
      }
    });
  }
}

function repaintPlumb() {
  plumbins.repaintEverything();
}

function disassociate() {
  let activities = plumbins.getConnections();
  activities.forEach((activeitem, index) => {
    plumbins.deleteConnection(activeitem)
  })
  getConnection()
}

function sameLine() {
  let activities = plumbins.getConnections();
  activities.forEach((activeitem, index) => {
    plumbins.deleteConnection(activeitem)
  })
  props.leftData.forEach((item, index) => {
    let obj = {};
    obj.source = item.id;
    if (props.rightData.length > index) {
      obj.target = props.rightData[index].id;
      plumbins.connect(obj);
    }
  });
  getConnection()
}

function sameName()  {
  let activities = plumbins.getConnections();
  activities.forEach((activeitem, index) => {
    plumbins.deleteConnection(activeitem)
  })
  props.leftData.forEach((item, index) => {
    let obj = {};
    obj.source = item.id;
    let target = props.rightData.filter(ritem => ritem.label.toLowerCase() === item.label.toLowerCase());
    if (target.length > 0) {
      obj.target = target[0].id;
      plumbins.connect(obj);
    }
  });
  getConnection()
}

// 保存连线关系
function getConnection()  {
  let connections = plumbins.getConnections();
  let readColumn = []
  let writerColumn = []
  if(!!props.leftData)
  {
    let sortData = props.leftData.map(item=>item.label)
    connections.sort((a, b) => {
      return sortData.indexOf(a.sourceId.replace('S' + props.taskCode, '')) - sortData.indexOf(b.sourceId.replace('S' + props.taskCode, ''));
    })
  }
  for (let i in connections) {
    readColumn.push(connections[i].sourceId.replace('S' + props.taskCode, ''))
    writerColumn.push(connections[i].targetId.replace('T' + props.taskCode, ''))
  }
  leftList.value  = readColumn
  rightList.value  = writerColumn
}

defineExpose({save, disassociate, sameName, sameLine, init, repaintPlumb})

onMounted( () => {
  let isFirstChange = true;
  watch(
      () => props.rightList,
      (newRightList, oldRightList) => {
        setTimeout(()=>{
          if (isFirstChange && container.value && newRightList.length) {
            init();
            props.leftList.forEach((item, index) => {
              let obj = {};
              obj.source = 'S' + props.taskCode + item;
              obj.target = 'T' + props.taskCode + newRightList[index];
              console.log(obj)
              plumbins.connect(obj);
            });
            isFirstChange = false;
          }
        },100)
      }
  );
})

</script>

<template>
  <div>
    <div ref="container" class="content" :id="`${props.taskCode}-plumbContent`">
      <n-table :single-line="false" size="small" style="width: 500px">
        <thead>
        <tr>
          <th>来源表字段</th>
          <th>字段类型</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(item, index) in props.leftData"
            :key="index"
            :title="item.label"
            class="table-row"
        >
          <td>
            {{ item.label }}
          </td>
          <td :id="item.id" class="data-cell">
            {{ item.type }}
          </td>
        </tr>
        </tbody>
      </n-table>
      <div class="spacer"></div>
      <n-table :single-line="false" size="small" style="width: 500px">
        <thead>
        <tr>
          <th>来源表字段</th>
          <th>字段类型</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(item, index) in props.rightData"
            :key="index"
            :title="item.label"
            class="table-row"
        >
          <td :id="item.id" class="data-cell">
            {{ item.label }}
          </td>
          <td >
            {{ item.type }}
          </td>
        </tr>
        </tbody>
      </n-table>
    </div>
    <div v-if="showDeleteIcon" class="delete-icon" :style="deleteIconStyle">
      <n-icon color="#33B5D4" size="16"><CancelSharp/></n-icon>
    </div>
  </div>
</template>

<style scoped>
.content {
  display: flex;
  justify-content: space-between;
  user-select: none;
  padding: 1vw;
  position: relative;
  overflow: scroll;

}

th, td {
  text-align: center;
}

thead, th {
  background-color: #f1f1f1;
}

.spacer {
  width: 300px;
  height: 100px; /* 与.box相同的高度 */
  float: left; /* 与.box对齐 */
  background-color: transparent; /* 透明背景 */
}

.table-row:hover {
  td {
    background-color: #eefbff !important; /* 你可以设置你想要的背景色 */
  }
}

.data-cell:hover {
  cursor: crosshair;
}

.delete-icon {
  background-color: #FFFFFF;
  pointer-events: none;
  position: fixed;
  cursor: pointer;
  width: 16px; /* 设定一个明确的宽度 */
  height: 16px; /* 设定一个明确的高度 */
  line-height: 16px; /* 垂直居中文字 */
  text-align: center; /* 水平居中文字 */
  top: 10px; /* 设定距离顶部的位置 */
  right: 10px; /* 设定距离右侧的位置 */
  transform: translate(50%, -50%); /* 根据元素的右上角定位，并向下和向左移动其宽度和高度的50%，以使其居中 */
  z-index: 1000; /* 确保图标在其他元素之上 */
}
</style>
