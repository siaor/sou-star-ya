<template>
  <div class="ya-mod ya-mod-app" :id="id" :style="{top:conf.y+'px',left:conf.x+'px'}" title="双击打开">
    <div class="ya-mod-app-logo" :id="id+'-mod'" @mousedown="openApp" @contextmenu.prevent="openModMenu($event)">
      <img :src="conf.logo" alt="logo">
    </div>
    <div class="ya-mod-app-name">
      {{ conf.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineProps, onMounted} from 'vue';
import {AppModConf} from "@/dom/def/mod/AppModConf";
import {SysEvent} from "@/dom/def/base/SysEvent";
import {Sys} from "@/dom/def/base/Sys";

//从父组件接收的 props
const props = defineProps<{
  id: string;
  mod: string;
  conf: AppModConf;
}>();
//系统事件
const emit = defineEmits(['sysEv']);

/*>>>>>>> 【组件自定义处理】 <<<<<<<*/
/*双击打开*/
let clickTimeout = 0;
const openApp = (event: MouseEvent) => {
  event.preventDefault();
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

function openModMenu(event: MouseEvent | TouchEvent) {
  event.preventDefault();
  event.stopPropagation();
  let x, y;
  if (event instanceof MouseEvent) {
    x = event.clientX;
    y = event.clientY;
  } else {
    const touch = event.changedTouches[0];
    x = touch.pageX;
    y = touch.pageY;
  }
  emit('sysEv', new SysEvent(Sys.SYS_EVENT_OPEN_MOD_MENU, {id: props.id, x: x, y: y}));
}

/*>>>>>>> 【组件通用处理】 <<<<<<<*/
//页面加载完成后
onMounted(() => {
  init();
});

//初始化
function init() {
  if (props.conf.isDrag) {
    //调用系统事件：添加模组拖拽事件
    const sysEvAddDrag: SysEvent = new SysEvent(Sys.SYS_EVENT_ADD_DRAG, {
      id: props.id,
      x: props.conf.x,
      y: props.conf.y
    });
    emit('sysEv', sysEvAddDrag);
  }
}
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
  width: 77%;
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