<script setup >

import jsPlumb from 'jsplumb'
import {onMounted, ref, nextTick} from 'vue';
import {useMessage} from "naive-ui";

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
  dsType: {
    required: true
  },
  dtType: {
    required: true
  },
  dataSource: {
    required: true
  },
  dataTarget: {
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

const message = useMessage()
const emit = defineEmits(['save-jsplumb'])
const leftList = ref([])
const rightList = ref([])

function save() {
  emit('save-jsplumb', leftList.value, rightList.value);
}

function init()  {
  console.log('init')
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
        }],
      ]
    });
    // 双击删除连线
    plumbins.bind("dblclick", (connection, originalEvent) => {
      plumbins.deleteConnection(connection);
      getConnection()
    });
    plumbins.bind("connection", (conn, originEvent) => {
      // 数据存入
      getConnection()
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
}

function initNode(id, type) {
  console.log("initNode")
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
        stroke: '#00cdea',
        fill: '#FFF',
        radius: 4,
        strokeWidth: 2,
      },
      hoverPaintStyle: {
        stroke: '#00cdea',
        fill: '#00cdea',
      },
      //   连线样式
      connectorStyle: {
        strokeWidth: 2,
        stroke: '#b4bdc5',
        joinstyle: 'round',
        outlineStroke: 'transparent',
        outlineWidth: 2,
      },
      connectorHoverStyle: {
        // strokeWidth: 2,
        stroke: '#216477',
      },
    });
  } else {
    ins.makeTarget(elements, {
      anchor: [0, 0.5, 1, 0], // 锚点
      allowLoopback: false,
      maxConnections: 1, //一对一就把maxConnections设置为1，一对多就设置为-1
      paintStyle: {
        stroke: '#00cdea',
        fill: '#FFF',
        radius: 4,
        strokeWidth: 2,
      },
      hoverPaintStyle: {
        stroke: '#00cdea',
        fill: '#00cdea',
      }
    });
  }
}

function repaintPlumb() {
  plumbins.repaintEverything();
}

function disassociate() {
  console.log('disassociate')
  let activities = plumbins.getConnections();
  activities.forEach((activeitem, index) => {
    plumbins.deleteConnection(activeitem)
  })
  getConnection()
}

function sameLine() {
  console.log('sameLine')
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
  console.log('sameName')
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
  console.log('getConnection')
  let connections = plumbins.getConnections();
  let readColumn = []
  let writerColumn = []
  if(!!props.leftData)
  {
    let sortData = props.leftData.map(item=>item.label)
    connections.sort((a, b) => {
      return sortData.indexOf(a.sourceId.replace('S' + props.dsType + props.dataSource, '')) - sortData.indexOf(b.sourceId.replace('S' + props.dsType + props.dataSource, ''));
    })
  }
  for (var i in connections) {
    readColumn.push(connections[i].sourceId.replace('S' + props.dsType + props.dataSource, ''))
    writerColumn.push(connections[i].targetId.replace('T' + props.dtType + props.dataTarget, ''))
  }
  leftList.value  = readColumn
  rightList.value  = writerColumn
}

defineExpose({save, disassociate, sameName, sameLine, init})

/*watch(() => props.rightList, () => {
  if (container.value) {
    init()
  }
}, { deep: true });*/

onMounted( () => {
  nextTick(()=>{
    if( props.rightList.length && container.value){
      console.log('onMounted')
      init();
      props.leftList.forEach((item, index) => {
        let obj = {};
        obj.source = 'S' + props.dsType + props.dataSource + item;
        obj.target = 'T' + props.dtType + props.dataTarget + props.rightList[index]
        console.log(obj)
        plumbins.connect(obj);
      })
    }
  })

})

</script>

<template>
  <div>
    <div ref="container" class="content" :id="`${props.taskCode}-plumbContent`">
      <div class="cols">
        <div class="top">来源表字段</div>
        <ul class="bottom">
          <li
              v-for="(item, index) in props.leftData"
              :key="index"
              :title="item.label"
          >
            {{ item.label }}
          </li>
        </ul>
      </div>
      <div class="cols">
        <div class="top">字段类型</div>
        <ul class="bottom sourcePoint" id="leftBottom">
          <li
              v-for="(item, index) in props.leftData"
              :key="index"
              :id="item.id"
              name="source"
          >
            {{ item.type }}
          </li>
        </ul>
      </div>
      <div class="cols"></div>
      <div class="cols"></div>
      <div class="cols">
        <div class="top">写入表字段</div>
        <ul class="bottom" id="rightBottom">
          <li
              v-for="(item, index) in props.rightData"
              :key="index"
              :id="item.id"
              name="target"
              :title="item.label"
          >
            {{ item.label }}
          </li>
        </ul>
      </div>
      <div class="cols">
        <div class="top">字段类型</div>
        <ul class="bottom">
          <li
              v-for="(item, index) in props.rightData"
              :key="index"
          >
            {{ item.type }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content {
  display: flex;
  justify-content: space-around;
  user-select: none;
  padding: 1vw;
  position: relative;
  overflow: scroll;

  .cols {
    color: #000000;
    width: 25%;
    text-align: center;

    .top {
      border: none;
      font-size: 0.8vw;
      font-weight: 600;
      color: #000000;
    }

    .bottom {
      padding-right: 2vw;
      margin-top: 0.5vw;

    }
  }
}

.sourcePoint {
  cursor:crosshair;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.table-wrapper {
  width: 353px;
  margin: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  border-collapse: collapse; /* 类似表格的边框合并效果 */
  width: 100%; /* 设置宽度，可按需调整 */
}

/* 为列表项添加边框 */
ul li {
  border: 1px solid #666666; /* 设置边框样式、宽度和颜色 */
  padding: 5px; /* 设置内边距，使内容不会紧贴着边框 */
}

/* 可选：如果需要，为第一个和最后一个列表项添加特殊的边框样式 */
ul li:first-child {
  border-top-left-radius: 5px; /* 左上角圆角 */
  border-top-right-radius: 5px; /* 右上角圆角 */
}

ul li:last-child {
  border-bottom-left-radius: 5px; /* 左下角圆角 */
  border-bottom-right-radius: 5px; /* 右下角圆角 */
}
</style>
