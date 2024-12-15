<template>
  <div class="ya-bg-img">
    <img :src="bg" alt="bg">
  </div>
</template>

<script setup lang="ts">
import {onMounted} from "vue";

//从父组件接收的 props
const props = defineProps<{
  name: string;
  logo: string;
  url: string;
  bg: string;
}>();

//页面加载完毕
onMounted(() => {
});
</script>

<style scoped>
.ya-bg-img {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.ya-bg-img img {
  width: 100%;
  min-height: 100%;
  overflow: hidden;
}

/* >>>>>>>【响应式样式】<<<<<<< */
/* 小屏幕：手机 */
@media (max-width: 768px) {
  .ya-bg-img img {
    width: auto;
    height: 100%;
    margin-left: -100%;
  }
}


/* 中屏幕：平板 */
@media (min-width: 769px) and (max-width: 992px) {

}


/* 中屏幕：笔记本 */
@media (min-width: 993px) and (max-width: 1399px) {

}
</style>