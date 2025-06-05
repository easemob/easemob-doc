<template>
  <div class="image-marker-container">
    <ElDialog
      v-model="isVisible"
      title="图片标记"
      width="1000px"
      :show-close="false"
      @close="handleCancel"
    >
      <div v-loading="loading" class="dialog-content">
        <div ref="editImgContainerRef" class="edit-img-container">
          <canvas
            ref="editImgRef"
            class="edit-img"
            :width="canvasWidth"
            :height="canvasHeight"
            v-show="imageLoaded"
            @mousedown="onMouseDown"
            @mousemove="onMouseMove"
            @mouseup="onMouseUp"
            @mouseleave="onMouseUp"
          ></canvas>
          <div v-if="!imageLoaded && !loadError" class="loading-text">图片加载中...</div>
          <div v-if="loadError" class="error-text">图片加载失败，请重试</div>
        </div>
      </div>
      <div class="marker-toolbar">
        <div
          class="mark-icon-wrapper"
          :class="{ active: markerMode === 'rect' }"
          @click="setMarkerMode('rect')"
        >
          <ImageIcon type="rect-marker" />
          <div class="label-text">标记</div>
        </div>
        <div
          class="mark-arrow-icon-wrapper"
          :class="{ active: markerMode === 'arrow' }"
          @click="setMarkerMode('arrow')"
        >
          <ImageIcon type="arrow-marker" />
        </div>
        <div
          class="tool-icon step-icon prev-step"
          :class="{ disabled: !canUndo }"
          @click="undo"
          title="上一步"
        >
          <ImageIcon type="prev-step" />
        </div>
        <div
          class="tool-icon step-icon next-step"
          :class="{ disabled: !canRedo }"
          @click="redo"
          title="下一步"
        >
          <ImageIcon type="next-step" />
        </div>
        <div
          class="tool-icon cancel-icon"
          @click="handleCancel"
        >
          <ImageIcon type="close" />
        </div>
        <div
          class="tool-icon confirm-icon"
          @click="handleOk"
        >
          <ImageIcon type="ok" />
        </div>
      </div>
    </ElDialog>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue'
import { ElDialog } from 'element-plus'
import ImageIcon from './ImageIcon.vue'

const props = defineProps({
  image: String,
  visible: Boolean
})
const emit = defineEmits(['update:visible', 'save'])

const isVisible = ref(props.visible)
const loading = ref(false)
const imageLoaded = ref(false)
const loadError = ref(false)
const markerMode = ref('rect')
const editImgRef = ref(null)
const editImgContainerRef = ref(null)
const canvasWidth = ref(800)
const canvasHeight = ref(600)
const imageObj = ref(null)
const markers = ref([])
const drawing = ref(false)
const start = ref({ x: 0, y: 0 })
const end = ref({ x: 0, y: 0 })
const undoStack = ref([])
const redoStack = ref([])

const selectedMarkerIndex = ref(-1)
const dragOffset = ref({ x: 0, y: 0 })

const canUndo = computed(() => undoStack.value.length > 0)
const canRedo = computed(() => redoStack.value.length > 0)


if (props.visible && props.image) {
  nextTick(() => {
    loadImageAndInit()
  })
}

watch(() => props.visible, (val) => {
  isVisible.value = val
  if (val) {
    loading.value = true
    imageLoaded.value = false
    loadError.value = false
    markers.value = []
    nextTick(() => {
      loadImageAndInit()
    })
  }
})

watch(isVisible, (val) => {
  emit('update:visible', val)
})

const loadImageAndInit = async () => {
  try {
    imageLoaded.value = false
    await nextTick()
    let containerWidth = editImgContainerRef.value ? editImgContainerRef.value.clientWidth : 800
    if (!containerWidth || containerWidth < 10) {
      console.warn('[ImgMarker] 容器宽度异常，已强制为800px')
      containerWidth = 800
    }
    // 只限制容器最大高度，不缩放canvas，保证图片清晰
    const MAX_CONTAINER_HEIGHT = 550
    if (editImgContainerRef.value) {
      editImgContainerRef.value.style.maxHeight = MAX_CONTAINER_HEIGHT + 'px'
      editImgContainerRef.value.style.overflow = 'auto'
    }
    const img = await loadImage(props.image)
    imageObj.value = img
    const imgWidth = img.naturalWidth || img.width
    const imgHeight = img.naturalHeight || img.height
    const aspectRatio = imgWidth / imgHeight
    canvasWidth.value = containerWidth
    canvasHeight.value = Math.floor(containerWidth / aspectRatio)
    await nextTick()
    if (editImgRef.value) {
      editImgRef.value.width = canvasWidth.value
      editImgRef.value.height = canvasHeight.value
      const ctx = editImgRef.value.getContext('2d')
      ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
      if (canvasWidth.value > 0 && canvasHeight.value > 0 && imgWidth > 0 && imgHeight > 0) {
        ctx.drawImage(img, 0, 0, canvasWidth.value, canvasHeight.value)
        imageLoaded.value = true
        loading.value = false
      } else {
        throw new Error('图片或容器尺寸异常')
      }
    } else {
      console.error('[ImgMarker] editImgRef.value 不存在')
    }
  } catch (e) {
    loading.value = false
    loadError.value = true
    console.error('[ImgMarker] 图片加载异常', e)
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('图片加载失败'))
    img.src = src
  })
}

const setMarkerMode = (mode) => {
  markerMode.value = mode
}

const RESIZE_HANDLE_SIZE = 12 // 拖动圆点的判定范围
const resizeInfo = ref({ index: -1, type: '' }) // {index:点索引,type:'corner'|'mid'}

function getRectHandles(x1, y1, x2, y2) {
  return [
    // 四个顶点
    { x: x1, y: y1, type: 'corner', idx: 0 },
    { x: x2, y: y1, type: 'corner', idx: 1 },
    { x: x1, y: y2, type: 'corner', idx: 2 },
    { x: x2, y: y2, type: 'corner', idx: 3 },
    // 四条边中点
    { x: (x1 + x2) / 2, y: y1, type: 'mid', idx: 4 },
    { x: (x1 + x2) / 2, y: y2, type: 'mid', idx: 5 },
    { x: x1, y: (y1 + y2) / 2, type: 'mid', idx: 6 },
    { x: x2, y: (y1 + y2) / 2, type: 'mid', idx: 7 }
  ]
}

function getHandleAt(x, y, m) {
  const handles = getRectHandles(m.startX, m.startY, m.endX, m.endY)
  for (const h of handles) {
    if (Math.abs(x - h.x) < RESIZE_HANDLE_SIZE && Math.abs(y - h.y) < RESIZE_HANDLE_SIZE) {
      return h
    }
  }
  return null
}

function onMouseDown(e) {
  if (!imageLoaded.value) return
  const rect = editImgRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  // 仅在 markerMode 为 rect 时允许移动/缩放已有矩形
  if (markerMode.value === 'rect') {
    for (let i = markers.value.length - 1; i >= 0; i--) {
      const m = markers.value[i]
      if (m.type === 'rect') {
        const handle = getHandleAt(x, y, m)
        if (handle) {
          selectedMarkerIndex.value = i
          resizeInfo.value = { index: handle.idx, type: handle.type }
          drawing.value = false
          // 不记录pushUndo
          return
        }
        if (isInRect(x, y, m)) {
          selectedMarkerIndex.value = i
          dragOffset.value = { x: x - m.startX, y: y - m.startY }
          drawing.value = false
          resizeInfo.value = { index: -1, type: '' }
          // 不记录pushUndo
          return
        }
      }
    }
  }

  // 检查是否点中已有标记
  for (let i = markers.value.length - 1; i >= 0; i--) {
    const m = markers.value[i]
    if (m.type === 'arrow' && isNearLine(x, y, m.startX, m.startY, m.endX, m.endY)) {
      selectedMarkerIndex.value = i
      dragOffset.value = { x: x - m.startX, y: y - m.startY }
      drawing.value = false
      resizeInfo.value = { index: -1, type: '' }
      // 不记录pushUndo
      return
    }
    if (m.type === 'text' && isInText(x, y, m)) {
      selectedMarkerIndex.value = i
      dragOffset.value = { x: x - m.x, y: y - m.y }
      drawing.value = false
      resizeInfo.value = { index: -1, type: '' }
      // 不记录pushUndo
      return
    }
  }

  // 新建标记
  drawing.value = true
  selectedMarkerIndex.value = -1
  resizeInfo.value = { index: -1, type: '' }
  start.value = { x, y }
  end.value = { ...start.value }
  // 只有新建时记录undo
  pushUndo()
}

function onMouseMove(e) {
  const rect = editImgRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  // 拖动矩形resize圆点
  if (
    markerMode.value === 'rect' &&
    selectedMarkerIndex.value !== -1 &&
    resizeInfo.value.index !== -1 &&
    e.buttons
  ) {
    const m = markers.value[selectedMarkerIndex.value]
    // 不记录pushUndo
    // 角点
    if (resizeInfo.value.type === 'corner') {
      switch (resizeInfo.value.index) {
        case 0: m.startX = x; m.startY = y; break
        case 1: m.endX = x; m.startY = y; break
        case 2: m.startX = x; m.endY = y; break
        case 3: m.endX = x; m.endY = y; break
      }
    }
    // 边中点
    if (resizeInfo.value.type === 'mid') {
      switch (resizeInfo.value.index) {
        case 4: // 顶边中点
          m.startY = y
          break
        case 5: // 底边中点
          m.endY = y
          break
        case 6: // 左边中点
          m.startX = x
          break
        case 7: // 右边中点
          m.endX = x
          break
      }
    }
    drawAll()
    return
  }

  // 仅在 markerMode 为 rect 时允许拖动已有矩形
  if (
    markerMode.value === 'rect' &&
    selectedMarkerIndex.value !== -1 &&
    !drawing.value &&
    resizeInfo.value.index === -1 &&
    e.buttons
  ) {
    const m = markers.value[selectedMarkerIndex.value]
    // 不记录pushUndo
    if (m.type === 'rect') {
      const w = m.endX - m.startX
      const h = m.endY - m.startY
      m.startX = x - dragOffset.value.x
      m.startY = y - dragOffset.value.y
      m.endX = m.startX + w
      m.endY = m.startY + h
      drawAll()
      return
    }
  }

  // 新建标记
  if (!drawing.value || !imageLoaded.value) return
  end.value = { x, y }
  drawAll()
  drawCurrent()
}

function onMouseUp() {
  if (
    (selectedMarkerIndex.value !== -1 && !drawing.value) ||
    (resizeInfo.value.index !== -1)
  ) {
    selectedMarkerIndex.value = -1
    resizeInfo.value = { index: -1, type: '' }
    drawAll()
    return
  }
  if (!drawing.value || !imageLoaded.value) return
  drawing.value = false
  if (
    Math.abs(end.value.x - start.value.x) > 5 &&
    Math.abs(end.value.y - start.value.y) > 5
  ) {
    // pushUndo 已在 onMouseDown 新建时调用，这里不再调用
    markers.value.push({
      type: markerMode.value,
      startX: start.value.x,
      startY: start.value.y,
      endX: end.value.x,
      endY: end.value.y
    })
  }
  drawAll()
}

function isInRect(x, y, m) {
  const minX = Math.min(m.startX, m.endX)
  const maxX = Math.max(m.startX, m.endX)
  const minY = Math.min(m.startY, m.endY)
  const maxY = Math.max(m.startY, m.endY)
  return x >= minX && x <= maxX && y >= minY && y <= maxY
}

function isNearLine(x, y, x1, y1, x2, y2) {
  // 距离线段小于8像素
  const A = x - x1
  const B = y - y1
  const C = x2 - x1
  const D = y2 - y1
  const dot = A * C + B * D
  const len_sq = C * C + D * D
  let param = -1
  if (len_sq !== 0) param = dot / len_sq
  let xx, yy
  if (param < 0) {
    xx = x1
    yy = y1
  } else if (param > 1) {
    xx = x2
    yy = y2
  } else {
    xx = x1 + param * C
    yy = y1 + param * D
  }
  const dx = x - xx
  const dy = y - yy
  return dx * dx + dy * dy < 64
}

function isInText(x, y, m) {
  // 简单判断：点在文字左上角80x30区域
  return x >= m.x && x <= m.x + 80 && y >= m.y - 20 && y <= m.y + 10
}

function drawAll() {
  if (!editImgRef.value || !imageObj.value) return
  const ctx = editImgRef.value.getContext('2d')
  ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
  ctx.drawImage(imageObj.value, 0, 0, canvasWidth.value, canvasHeight.value)
  markers.value.forEach(m => {
    if (m.type === 'rect') {
      drawRect(ctx, m.startX, m.startY, m.endX, m.endY)
    } else if (m.type === 'arrow') {
      drawArrow(ctx, m.startX, m.startY, m.endX, m.endY)
    }
  })
}

function drawCurrent() {
  if (!drawing.value) return
  const ctx = editImgRef.value.getContext('2d')
  if (markerMode.value === 'rect') {
    drawRect(ctx, start.value.x, start.value.y, end.value.x, end.value.y)
  } else if (markerMode.value === 'arrow') {
    drawArrow(ctx, start.value.x, start.value.y, end.value.x, end.value.y)
  }
}

function drawRect(ctx, x1, y1, x2, y2) {
  ctx.save()
  ctx.beginPath()
  ctx.strokeStyle = '#FFD600' // 黄色
  ctx.lineWidth = 4 // 更粗
  ctx.rect(x1, y1, x2 - x1, y2 - y1)
  ctx.stroke()

  // 顶点和中点编辑提示
  ctx.fillStyle = '#FFD600'
  const points = getRectHandles(x1, y1, x2, y2)
  points.forEach((pt, idx) => {
    ctx.beginPath()
    // 顶点小点（5），中点更小（4）
    ctx.arc(pt.x, pt.y, pt.type === 'corner' ? 5 : 4, 0, Math.PI * 2)
    ctx.fill()
    // 顶点加白色描边更明显
    if (pt.type === 'corner') {
      ctx.save()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    }
  })
  ctx.restore()
}

function drawArrow(ctx, x1, y1, x2, y2) {
  ctx.save()
  ctx.beginPath()
  ctx.strokeStyle = '#FFD600' // 黄色
  ctx.lineWidth = 4 // 更粗
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  // 箭头头部
  const headlen = 15
  const angle = Math.atan2(y2 - y1, x2 - x1)
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(
    x2 - headlen * Math.cos(angle - Math.PI / 6),
    y2 - headlen * Math.sin(angle - Math.PI / 6)
  )
  ctx.lineTo(
    x2 - headlen * Math.cos(angle + Math.PI / 6),
    y2 - headlen * Math.sin(angle + Math.PI / 6)
  )
  ctx.lineTo(x2, y2)
  ctx.lineTo(
    x2 - headlen * Math.cos(angle - Math.PI / 6),
    y2 - headlen * Math.sin(angle - Math.PI / 6)
  )
  ctx.stroke()
  ctx.restore()
}

const handleOk = () => {
  if (!editImgRef.value || !imageLoaded.value) return
  // 截图导出时使用更高质量
  const dataUrl = editImgRef.value.toDataURL('image/png', 1.0)
  emit('save', dataUrl)
  isVisible.value = false
}

const handleCancel = () => {
  isVisible.value = false
}

const undo = () => {
  if (!canUndo.value) return
  redoStack.value.push(JSON.stringify(markers.value))
  const prev = undoStack.value.pop()
  if (prev) {
    markers.value = JSON.parse(prev)
    drawAll()
  }
}

const redo = () => {
  if (!canRedo.value) return
  undoStack.value.push(JSON.stringify(markers.value))
  const next = redoStack.value.pop()
  if (next) {
    markers.value = JSON.parse(next)
    drawAll()
  }
}

// 保存当前状态到undo栈
function pushUndo() {
  undoStack.value.push(JSON.stringify(markers.value))
  // 清空redo栈
  redoStack.value = []
}
</script>

<style lang="scss" scoped>
.custom-component-img-marker,
.image-marker-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  /* 其它样式合并到这里 */
}

.dialog-content {
  min-height: 300px;
}

.edit-img-container {
  width: 100%;
  max-height: 40vh;
  overflow: auto;
  overscroll-behavior: contain;
  background: #f0f0f0;
  position: relative;
  min-height: 300px;
}
.edit-img {
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: 100%;
  background-color: #fff;
  display: block;
}
.loading-text, .error-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  color: #333;
}
.error-text {
  color: #ff4d4f;
}
.marker-toolbar {
  position: absolute;
  left: 50%;
  bottom: -50px;
  transform: translateX(-50%);
  height: 42px;
  padding: 0 8px;
  border-radius: 4px;
  background-color: white;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 100;
}
.mark-icon-wrapper {
  border-radius: 4px;
  height: 32px;
  padding-left: 6px;
  padding-right: 8px;
  color: #333;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  &:hover {
    background-color: #e6f7ff;
    color: #1890ff;
    .mark-icon {
      fill: #1890ff;
    }
  }
  &.active {
    background-color: #e6f7ff !important;
    color: #1890ff !important;
    .mark-icon {
      fill: #1890ff !important;
    }
  }
  .mark-icon {
    fill: #333;
    transition: all 0.3s;
  }
  .label-text {
    margin-left: 2px;
  }
}
.mark-arrow-icon-wrapper {
  border-radius: 4px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #e6f7ff;
    .mark-arrow-icon {
      fill: #1890ff;
    }
  }
  &.active {
    background-color: #e6f7ff !important;
    .mark-arrow-icon {
      fill: #1890ff !important;
    }
  }
  .mark-arrow-icon {
    fill: #333;
    transition: all 0.3s;
  }
}
.tool-icon {
  border-radius: 4px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #e6f7ff;
  }
}
.step-icon {
  width: 28px;
  height: 28px;
  margin-left: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: #f7f7f7;
  cursor: pointer;
  transition: background 0.2s;
  &.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}
.prev-step svg, .next-step svg {
  display: block;
}
.cancel-icon, .confirm-icon {
  margin-left: 8px;
}
</style>
