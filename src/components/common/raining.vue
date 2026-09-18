<template>
  <div class="lightning-storm" :style="backgroundStyle">
    <!-- 白屏闪光效果 -->
    <div class="white-flash" :style="flashStyle"></div>

    <!-- 闪电容器 -->
    <div class="lightning-container" ref="lightningContainer" v-if="shouldShowLightning"></div>

    <!-- 雨滴：改为 canvas 实现 -->
    <canvas ref="rainCanvas" class="rain-canvas" />
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  rainfall: {
    type: Number,
    default: 0,
    validator: value => value >= 0
  }
})

// Refs
const lightningContainer = ref(null)
const rainCanvas = ref(null)
let ctx = null
let animationFrameId = null
let lightningTimeout = null

// 控制闪光
const flashOpacity = ref(0)
const isMainFlash = ref(true)

const flashStyle = computed(() => ({
  opacity: flashOpacity.value,
  transition: `opacity ${flashDuration.value}ms ease-out`
}))
const flashDuration = computed(() => isMainFlash.value ? 100 : 400)

// 是否需要闪电
const shouldShowLightning = computed(() => props.rainfall >= 25)

// 雨量等级（新增 0 级）
const rainIntensity = computed(() => {
  if (props.rainfall === 0) return 0  // 新增无雨状态
  if (props.rainfall < 10) return 1
  if (props.rainfall < 25) return 2
  return 3
})

// 背景透明度跟随雨量（0 级时完全透明）
const backgroundStyle = computed(() => ({
  backgroundColor: `rgba(0, 0, 0, ${rainIntensity.value * 0.2})`
}))

// 配置参数
const config = computed(() => ({
  rainAmount: rainIntensity.value > 0 ? rainIntensity.value * 1000 : 0,
  rainSpeed: {
    min: 0.3 + rainIntensity.value * 0.1,
    max: 1.0 - rainIntensity.value * 0.1
  },
  ...(shouldShowLightning.value ? {
    lightningSize: 2,
    lightningCount: 2,
    lightningFrequency: 3000,
    maxLightningDepth: 2
  } : {})
}))

// ========== Canvas 雨滴逻辑 ==========
const drops = ref([])

const resizeCanvas = () => {
  const canvas = rainCanvas.value
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

const generateDrops = () => {
  const canvas = rainCanvas.value
  if (!canvas) return

  // 完全清空现有雨滴
  drops.value = []

  // 只在有雨时生成新雨滴
  if (rainIntensity.value > 0) {
    const count = config.value.rainAmount / 5
    drops.value = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: 10 + Math.random() * 20,
      speed: config.value.rainSpeed.min * 15 + Math.random() * 10
    }))
  }
}

const animateRain = () => {
  const canvas = rainCanvas.value
  if (!ctx || !canvas) return

  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 只在有雨时绘制
  if (rainIntensity.value > 0 && drops.value.length > 0) {
    ctx.strokeStyle = 'rgba(173, 216, 230, 0.4)'
    ctx.lineWidth = 1
    ctx.beginPath()

    for (const drop of drops.value) {
      ctx.moveTo(drop.x, drop.y)
      ctx.lineTo(drop.x, drop.y + drop.length)
      drop.y += drop.speed
      if (drop.y > canvas.height) {
        drop.y = -drop.length
        drop.x = Math.random() * canvas.width
      }
    }

    ctx.stroke()
  }

  animationFrameId = requestAnimationFrame(animateRain)
}

// ========== 闪电逻辑 ==========
const triggerFlash = (intensity = 0.8) => {
  isMainFlash.value = true
  flashOpacity.value = intensity
  setTimeout(() => {
    isMainFlash.value = false
    flashOpacity.value = intensity * 0.3
  }, 50)
  setTimeout(() => {
    flashOpacity.value = 0
  }, 400)
}

const createLightningPath = (x, y, depth = 0) => {
  let path = `M ${x},${y}`
  const steps = 10 + Math.floor(Math.random() * 10)
  let currX = x
  let currY = y

  for (let i = 0; i < steps; i++) {
    const dx = (Math.random() - 0.5) * 30
    const dy = 60 + Math.random() * 30
    currX += dx
    currY += dy
    path += ` L ${currX},${currY}`

    if (Math.random() < 0.3 && depth < config.value.maxLightningDepth) {
      setTimeout(() => {
        addLightning(createLightningPath(currX, currY, depth + 1))
      }, 0)
    }
  }

  return path
}

const addLightning = (pathData) => {
  if (!lightningContainer.value) return
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svg.setAttribute("width", window.innerWidth)
  svg.setAttribute("height", window.innerHeight)

  const opacity = 0.5 + Math.random() * 0.5
  const visibleTime = 80 + Math.random() * 100

  svg.innerHTML = `
    <path d="${pathData}"
          stroke="white"
          stroke-width="${config.value.lightningSize}"
          fill="none"
          style="opacity: 0; filter: drop-shadow(0 0 10px white); transition: opacity 50ms ease-out;" />
  `
  lightningContainer.value.appendChild(svg)
  const path = svg.querySelector('path')
  setTimeout(() => path.style.opacity = opacity, 10)
  setTimeout(() => path.style.opacity = 0, 10 + visibleTime)
  setTimeout(() => svg.remove(), 500)
}

const startLightning = () => {
  if (!shouldShowLightning.value) {
    if (lightningTimeout) {
      clearTimeout(lightningTimeout)
      lightningTimeout = null
    }
    return
  }

  triggerFlash(0.5)
  for (let i = 0; i < config.value.lightningCount; i++) {
    const x = Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1
    addLightning(createLightningPath(x, 0))
  }
  lightningTimeout = setTimeout(
    startLightning,
    config.value.lightningFrequency + Math.random() * 1000
  )
}

// ========== 生命周期 ==========
const initWeatherEffects = () => {
  // 重置所有效果
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }

  if (lightningTimeout) {
    clearTimeout(lightningTimeout)
    lightningTimeout = null
  }

  // 清空闪电容器
  if (lightningContainer.value) {
    lightningContainer.value.innerHTML = ''
  }

  // 重新初始化
  resizeCanvas()
  generateDrops()
  animateRain()
  startLightning()
}

onMounted(() => {
  ctx = rainCanvas.value.getContext('2d')
  initWeatherEffects()
  window.addEventListener('resize', initWeatherEffects)
})

watch(() => props.rainfall, () => {
  // 使用 nextTick 确保 DOM 更新完成
  nextTick(() => {
    initWeatherEffects()
  })
})

onBeforeUnmount(() => {
  if (lightningTimeout) clearTimeout(lightningTimeout)
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  window.removeEventListener('resize', initWeatherEffects)
})
</script>

<style lang="scss" scoped>
.lightning-storm {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;

  .white-flash {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(#fff, 0.6);
    pointer-events: none;
    z-index: 20;
    opacity: 0;
  }

  .lightning-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 15;
    pointer-events: none;

    svg {
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  .rain-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    pointer-events: none;
  }
}
</style>