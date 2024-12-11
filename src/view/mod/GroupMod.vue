<template>
  <div class="ya-mod ya-mod-group" :id="id" :style="{top:conf.y+'px',left:conf.x+'px'}" title="双击打开">
    <div class="ya-mod-group-logo" @mousedown="doOpen" @touchstart="doOpen">
      <img :src="conf.logo" alt="logo">
    </div>
    <div class="ya-mod-group-name">
      {{ conf.name }}
    </div>
  </div>
  <transition name="shrink">
    <div class="ya-mod-group-content" v-show="isShow">
      <template v-for="(mod, index) in modList" :key="index">
        <component :id="mod.id" :is="mod.type" v-bind="mod.props"/>
      </template>
      <div class="ya-mod-group-close">
        <img src="/img/app_close.svg" alt="close" @click="doClose" @touchstart="doClose"/>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import {DefineComponent, defineProps, reactive, ref} from 'vue';
import {GroupModConf} from "@/dom/def/mod/GroupModConf";
import {Mod} from "@/dom/def/Mod";
import {ModConf} from "@/dom/def/ModConf";
import {AllMod} from "@/dom/def/ModSky";

//从父组件接收的 props
const props = defineProps<{
  id: string;
  conf: GroupModConf;
}>();

const isShow = ref(false);
//组件列表
const modList = reactive<Mod[]>([]);

//加载组件
function loadMod(modConf: ModConf) {
  const componentType = AllMod[modConf.mod as keyof typeof AllMod] as DefineComponent<{}, {}, any>;
  if (componentType) {
    // 这里可以根据需要设置组件的属性
    const props: Record<string, any> = modConf;
    modList.push({id: modConf.id, type: componentType, props});
  } else {
    console.error(`Component with name "${modConf.mod}" not found.`);
  }
}

/*双击打开*/
let clickTimeout = 0;
const doOpen = (event: Event) => {
  event.preventDefault();
  if (clickTimeout === 1) {
    //触发双击
    let parent = props.id + '-';
    let modId = 1;
    const maxCount = Math.floor(window.innerWidth / 100) + 1;
    for (let modConf of props.conf.list) {
      modConf.id = parent + modId;
      modConf.conf.x = ((modId % maxCount - 1) * 100) + 28;
      modConf.conf.y = (Math.floor(modId / maxCount) * 100) + 28;
      loadMod(modConf);
      modId++;
    }
    isShow.value = true;
    return;
  }

  clickTimeout = 1;
  setTimeout(function () {
    clickTimeout = 0;
  }, 300);

};


function doClose() {
  //todo:关闭动画效果
  isShow.value = false;
}
</script>

<style scoped>
.ya-mod-group {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.ya-mod-group-logo {
  height: 70%;
  width: 70%;
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ya-mod-group-logo:hover {
  background-color: rgb(255, 255, 255, 0.1);
}

.ya-mod-group-logo img {
  height: 77%;
}

.ya-mod-group-name {
  width: 100%;
  height: 30%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
  text-align: center;
  color: white;
}

.ya-mod-group-name:hover {
  overflow: visible;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.ya-mod-group-content {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgb(0, 0, 0, 0.9);
  z-index: 99;
  /*transition: height 0.5s ease, opacity 0.5s ease;*/
}

.ya-mod-group-close {
  width: 100%;
  height: 70px;

  position: fixed;
  bottom: 0;
  /*background-color: rgb(255, 255, 255, 0.1);*/
  display: flex;
  justify-content: center;
  align-items: center;
}

.ya-mod-group-close img {
  height: 70%;
}

.ya-mod-group-close img:hover {
  cursor: pointer;
  background-color: rgb(255, 255, 255, 0.1);
  border-radius: 50%;
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