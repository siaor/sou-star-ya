<template>
  <div class="ya-mod ya-mod-search" :style="{top:conf.y+'px',left:conf.x+'px'}" @mousedown="startMove" @mousemove="runMove" @mouseup="stopMove">
    <div class="ya-mod-search-bar">
      <select id="searchEngine">
        <option value="https://www.baidu.com/s?wd=">百度</option>
        <option value="https://www.sogou.com/web?query=">搜狗</option>
        <option value="https://www.google.com/search?q=">谷歌</option>
        <option value="https://www.bing.com/search?q=">必应</option>
        <option value="https://duckduckgo.com/?q=">鸭鸭Go</option>
      </select>
      <input type="text" id="searchInput" placeholder="   欢迎使用搜星鸦...">
      <button @click="doSearch">🔍搜索</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import {SearchModConf} from "@/dom/def/mod/SearchModConf";

//从父组件接收的 props
const props = defineProps<{
  conf: SearchModConf;
}>();

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

function doSearch() {
  const queryDom = document.getElementById('searchInput') as HTMLInputElement;
  const searchEngineDom = document.getElementById('searchEngine') as HTMLInputElement;
  const query = queryDom.value;
  const searchEngine = searchEngineDom.value;
  if (query) {
    window.open(searchEngine + encodeURIComponent(query), '_blank');
  }
}
</script>

<style scoped>
.ya-mod-search {
  width: 700px;
  height: 70px;
  top: 50%;
  left: 30%;

  display: flex;
  align-items: center;
}
.ya-mod-search:hover{
  background-color: rgb(255, 255, 255, 0);
}

.ya-mod-search-bar{
  width: 98%;
  height: 77%;
  border-radius: 50px;
  background-color: rgb(255, 255, 255, 0.1);
}

/*搜索引擎选择框*/
.ya-mod-search-bar select{
  width: 14%;
  height: 100%;
  border-radius: 50px 14px 14px 50px;
  cursor: pointer;
  background-color: rgb(0,0,0,0);
  border: none;
  text-align: center;
}
.ya-mod-search-bar select:hover{
  background-color: rgb(0,0,0,0.7);
}

/*搜索输入框*/
.ya-mod-search-bar input{
  width: 70%;
  height: 77%;
  line-height: 70%;
  background-color: rgb(0,0,0,0);
  border: none;
  outline: none;
}

/*搜索按钮*/
.ya-mod-search-bar button{
  width: 14%;
  height: 100%;
  border-radius: 14px 50px 50px 14px;
  cursor: pointer;
  background-color: rgb(0,0,0,0.3);
  border: none;
  float: right;
}
.ya-mod-search-bar button:hover{
  background-color: rgb(0,0,0,0.7);
}
</style>