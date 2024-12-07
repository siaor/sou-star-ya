<template>
  <div class="ya-mod ya-mod-app" :style="{top:conf.y+'px',left:conf.x+'px'}" @mousedown="startMove" @mousemove="runMove" @mouseup="stopMove" @mouseleave="stopMove">
    <div class="ya-mod-app-logo" @mousedown="openApp">
      <img :src="conf.logo" alt="logo">
    </div>
    <div class="ya-mod-app-name">
      {{conf.name}}
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import {AppModConf} from "@/dom/def/mod/AppModConf";

//从父组件接收的 props
const props = defineProps<{
  conf: AppModConf;
}>();

console.log(props.conf);

/*拖动事件*/
let isDragging = false;
let startX = 0;
let startY = 0;
const startMove = (event: MouseEvent) => {
  event.stopPropagation();
  startX = event.clientX - props.conf.x;
  startY = event.clientY - props.conf.y;
  isDragging = true;
};

const runMove = (event: MouseEvent) => {
  event.stopPropagation();
  if(!isDragging) {
    return;
  }
  props.conf.x = event.clientX - startX;
  props.conf.y = event.clientY - startY;
};

const stopMove = (event: MouseEvent) => {
  event.stopPropagation();
  isDragging = false;
  //todo:校验超出边框

  //todo:校验重叠
};

/*点击事件*/
const openApp = (event: MouseEvent) => {
  event.stopPropagation();
  window.open(props.conf.url,'_blank');
};
</script>

<style scoped>
.ya-mod-app{
  display: flex;
  align-items: center;
  flex-direction: column;
}
.ya-mod-app-logo{
  height: 70%;
  width: 70%;
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.ya-mod-app-logo:hover{
  background-color: rgb(255, 255, 255, 0.1);
}
.ya-mod-app-logo img{
  height: 77%;
}
.ya-mod-app-name{
  width: 100%;
  height: 30%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
}

.ya-mod-app-name:hover{
  overflow: visible;
  white-space: normal;
  height: 100%;
}
</style>