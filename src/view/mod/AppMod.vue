<template>
  <div class="ya-mod ya-mod-app" :style="{top:conf.y+'px',left:conf.x+'px'}" title="双击打开">
    <div class="ya-mod-app-logo" @mousedown="openApp">
      <img :src="conf.logo" alt="logo">
    </div>
    <div class="ya-mod-app-name">
      {{ conf.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineProps} from 'vue';
import {AppModConf} from "@/dom/def/mod/AppModConf";

//从父组件接收的 props
const props = defineProps<{
  conf: AppModConf;
}>();

/*双击打开*/
let clickTimeout = 0;
const openApp = (event: MouseEvent) => {
  if (clickTimeout === 1) {
    //触发双击
    window.open(props.conf.url, '_blank');
    return;
  }

  clickTimeout = 1;
  setTimeout(function () {
    clickTimeout = 0;
  }, 300);

};
</script>

<style scoped>
.ya-mod-app {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.ya-mod-app-logo {
  height: 70%;
  width: 70%;
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ya-mod-app-logo:hover {
  background-color: rgb(255, 255, 255, 0.1);
}

.ya-mod-app-logo img {
  height: 77%;
}

.ya-mod-app-name {
  width: 100%;
  height: 30%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
  text-align: center;
  color: white;
}

.ya-mod-app-name:hover {
  overflow: visible;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* >>>>>>>【响应式样式】<<<<<<< */
/* 小屏幕：手机 */
@media (max-width: 768px) {

}


/* 中屏幕：平板 */
@media (min-width: 769px) and (max-width: 992px) {

}


/* 中屏幕：笔记本 */
@media (min-width: 993px) and (max-width: 1399px) {

}
</style>