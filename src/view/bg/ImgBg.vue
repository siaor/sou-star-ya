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
  min-width: 100%;
  min-height: 100%;
  overflow: hidden;
}
</style>