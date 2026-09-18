<template>
  <div class="datetime">
    {{ formattedDate }}
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const now = ref(new Date())
let timer: number

// 更新时间
const updateTime = () => {
  now.value = new Date()
}

// 星期中文名
const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

// 格式化输出
const formattedDate = computed(() => {
  const date = now.value
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const week = weekDays[date.getDay()]
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}年${month}月${day}日 ${week} ${hours}:${minutes}:${seconds}`
})

// 启动和销毁定时器
onMounted(() => {
  updateTime()
  timer = window.setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped lang="scss">
.datetime {
  color: #eee;
  font-family: "YouSheBiaoTiHei";
  text-shadow: 1px 1px 2px #b1b1b1;
}
</style>
