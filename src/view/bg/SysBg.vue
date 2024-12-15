<template>
  <div class="ya-bg">
    <ImgBg v-bind="props" v-if="bg"></ImgBg>
    <StarBg v-else></StarBg>
  </div>
</template>

<script setup lang="ts">
import {onMounted} from "vue";
import ImgBg from "@/view/bg/ImgBg.vue";
import StarBg from "@/view/bg/StarBg.vue";

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
/* 星空背景 */
.ya-bg {
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  bottom: 0;
  z-index: -1;
  background-image: radial-gradient(ellipse at top, #050b12 0%, #181b25 100%);
}
</style>