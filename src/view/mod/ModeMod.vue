<template>
  <div class="ya-mod ya-mod-mode" :id="id" @mouseenter="doOpen" @mouseleave="doClose"
       @touchleave="doClose" title="双击打开[模式设置]">
    <img class="ya-mod-mode-logo-mini" :src="logoRef" alt="logo">
    <div class="ya-mod-mode-logo" @mousedown="openApp">
      <img :src="conf.logo" alt="logo">
    </div>

    <div class="ya-mod-mode-name">
      {{ conf.name }}
    </div>
    <div class="ya-mod-mode-box" v-show="isShow" title="点击切换模式">
      <div class="ya-mod-mode-list">
        <div class="ya-mod-mode-item" v-for="(item, index) in conf.list" :key="index" @click="doSwitch(item,$event)">
          <div class="ya-mod-mode-logo">
            <img :src="item.logo" alt="logo">
          </div>
          <div class="ya-mod-mode-name">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineProps, onMounted, ref} from 'vue';
import {ModeModConf} from "@/dom/def/mod/ModeModConf";
import {SysEvent} from "@/dom/def/base/SysEvent";
import {Sys} from "@/dom/def/base/Sys";
import {AppModConf} from "@/dom/def/mod/AppModConf";

//从父组件接收的 props
const props = defineProps<{
  id: string;
  mod: string;
  conf: ModeModConf;
}>();
//系统事件
const emit = defineEmits(['sysEv']);

/*>>>>>>> 【组件自定义处理】 <<<<<<<*/
const logoRef = ref(props.conf.logo);
const nameRef = ref(props.conf.name);
const isShow = ref(false);


/*双击打开*/
let clickTimeout = 0;
const openApp = (event: MouseEvent) => {
  //event.stopPropagation();
  //event.preventDefault();
  if (clickTimeout === 1) {
    //触发双击
    localStorage.removeItem(Sys.SYS_MODE);
    return;
  }

  clickTimeout = 1;
  setTimeout(function () {
    clickTimeout = 0;
  }, 300);

};

function doSwitch(actConf: AppModConf, event: MouseEvent) {
  //event.stopPropagation();
  //event.preventDefault();
  logoRef.value = actConf.logo
  nameRef.value = actConf.name
  const sysEv: SysEvent = new SysEvent(Sys.SYS_EVENT_LOAD_MODE, {url: actConf.url});
  emit('sysEv', sysEv);
}

function doOpen() {
  isShow.value = true;
}

function doClose() {
  isShow.value = false;
}

/*>>>>>>> 【组件通用处理】 <<<<<<<*/
//页面加载完成后
onMounted(() => {
  init();
});

//初始化
async function init() {
  //调用系统事件：添加模组拖拽事件
  if (props.conf.isDrag) {
    const sysEvAddDrag: SysEvent = new SysEvent(Sys.SYS_EVENT_ADD_DRAG, {
      id: props.id,
      x: props.conf.x,
      y: props.conf.y
    });
    emit('sysEv', sysEvAddDrag);
  }

  //从缓存获取当前模式
  const sysModeUrl = localStorage.getItem(Sys.SYS_MODE);
  if (sysModeUrl) {
    const actMode = props.conf.list.find(item => item.url === sysModeUrl);
    if (actMode) {
      logoRef.value = actMode.logo
      nameRef.value = actMode.name
    }
  }
}
</script>

<style scoped>
.ya-mod-mode {
  height: 21px;
  width: 21px;
  display: flex;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  top: 28px;
  right: 28px;
}

.ya-mod-mode:hover {
  height: 77px;
  width: 77px;
}

.ya-mod-mode-logo {
  height: 70%;
  width: 70%;
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ya-mod-mode-logo:hover {
  background-color: rgb(255, 255, 255, 0.1);
}

.ya-mod-mode-logo img {
  height: 77%;
  width: 77%;
}

.ya-mod-mode-logo-mini {
  height: 21px;
  width: 21px;
  position: absolute;
  right: 0;
  top: 0;
}

.ya-mod-mode-name {
  width: 100%;
  height: 30%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
  text-align: center;
  color: white;
}

.ya-mod-mode-name:hover {
  overflow: visible;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.ya-mod-mode-box {
  position: fixed;
  margin-top: 77px;
  width: 77px;
  height: 154px;
}

.ya-mod-mode-list {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  position: absolute;
  bottom: 0;
  border-radius: 7px;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: rgb(255, 255, 255, 0.3);
}

.ya-mod-mode-list::-webkit-scrollbar {
  height: 7px;
  width: 21px;
  background: rgb(255, 216, 83, 0.3);
}

.ya-mod-mode-item {
  width: 77px;
  height: 77px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
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