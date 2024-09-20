<template>
  <div class="line-chart">
    <svg :viewBox="`0 0 ${viewBoxWidth} ${viewBoxHeight}`" preserveAspectRatio="none">
      <!-- Draw baseline -->
      <line :x1="startX" :y1="middleY" :x2="viewBoxWidth - startX" :y2="middleY" stroke="#E6E6E6" stroke-width="6" stroke-linecap="round"></line>

      <!-- Draw points and lines -->
      <g v-for="(point, index) in points" :key="index">
        <!-- Draw point -->
        <circle
            :cx="point.x"
            :cy="middleY"
            r="6"
            :class="['point', point.isOdd ? 'odd' : 'even']"
        ></circle>

        <!-- Draw line to indicator card -->
        <line
            :x1="point.x"
            :y1="point.isOdd ? middleY - 8 : middleY + 8"
            :x2="point.x"
            :y2="point.isOdd ? middleY - offset : middleY + offset"
            stroke="#9BCBDA"
            stroke-width="1"
            stroke-dasharray="3 3"
        ></line>

        <circle
            :cx="point.x"
            :cy="point.isOdd ? middleY - offset - 1: middleY + offset + 1"
            r="3"
            :class="['end-point']"
        ></circle>

        <!-- Draw indicator card background -->
        <defs>
          <!-- 定义线性渐变 -->
          <linearGradient id="gradientFromE9F4FBToWhite" x1="100%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E7F5FA" />
            <stop offset="100%" stop-color="white" />
          </linearGradient>
        </defs>
        <rect
            :x="point.x - cardWidth / 2"
            :y="point.isOdd ? middleY - offset - cardHeight - 10 : middleY + offset + 10"
            :width="cardWidth"
            :height="cardHeight"
            class="indicator-card"
            fill="url(#gradientFromE9F4FBToWhite)"
        ></rect>

        <!-- Draw indicator card text -->
        <text
            :x="point.x"
            :y="point.isOdd ? middleY - offset - (cardHeight / 2 + 18) : middleY + offset + (cardHeight / 2 + 3)"
            text-anchor="middle"
            alignment-baseline="middle"
            class="card-text"
        >
          {{ point.label }}
        </text>
        <text
            :x="point.x"
            :y="point.isOdd ? middleY - offset - (cardHeight / 2 + 1) : middleY + offset + (cardHeight / 2 + 19)"
            text-anchor="middle"
            alignment-baseline="middle"
            class="card-text2"
        >
          {{ point.value }}
        </text>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
});

// 定义响应式数据
const startX = ref(20);
const viewBoxWidth = ref(800);
const viewBoxHeight = ref(200);
const middleY = ref(100);
const offset = ref(50);
const cardWidth = ref(80);
const cardHeight = ref(38);

// 计算属性点数组
const points = computed(() => {
  const totalPoints = props.items.length;
  const padding = 40; // 额外的首尾点填充
  const gap = (viewBoxWidth.value - 2 * (startX.value + padding)) / (totalPoints - 1);
  return Array.from({ length: totalPoints }, (_, i) => ({
    x: startX.value + padding + i * gap,
    isOdd: i % 2 === 0, // 注意：通常偶数索引认为是偶数点，这里可能是一个逻辑错误
    label: props.items[i].labelName,
    value: props.items[i].tagValue
  }));
});

</script>

<style scoped>
.line-chart {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 90%;
}

svg {
  width: 90%;
  height: 100%;
}

.point {
  fill: white;
  stroke: #cdf3ff;
  stroke-width: 4;
}

.end-point {
  fill: #9BCBDA;
}

.point.odd {
  fill: #0099cb;
}

.point.even {
  fill: #0099cb;
}

.indicator-card {
  filter: drop-shadow(1px 1px 1px rgba(207, 207, 207, 0.3));
  transition: filter 0.3s ease;
}

.indicator-card:hover {
  /* 鼠标悬停时的阴影效果 */
  filter: drop-shadow(2px 2px 4px rgba(78, 75, 75, 0.5));
}

.card-text {
  font-size: 10px;
  font-family: "Microsoft YaHei", Arial, sans-serif;
  fill: black;
}

.card-text2 {
  font-size: 9px;
  fill: gray;
}
</style>
