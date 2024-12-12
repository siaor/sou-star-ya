<template>
  <div class="ya-mod ya-mod-theme" title="双击打开/关闭" @mouseenter="doOpen" @mouseleave="doClose" @touchleave="doClose">
    <img class="ya-mod-theme-logo-mini" :src="logoRef" alt="logo">
    <div class="ya-mod-theme-logo" @mousedown="openApp">
      <img :src="conf.logo" alt="logo">
    </div>

    <div class="ya-mod-theme-name">
      {{ conf.name }}
    </div>
    <div class="ya-mod-theme-box" v-show="isShow" title="选择主题">
      <div class="ya-mod-theme-list" >
        <div class="ya-mod-theme-item" v-for="(item, index) in conf.list" :key="index" @click="doSwitch(item,$event)">
          <div class="ya-mod-theme-logo">
            <img :src="item.logo" alt="logo">
          </div>
          <div class="ya-mod-theme-name">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineProps, ref} from 'vue';
import {ThemeModConf} from "@/dom/def/mod/ThemeModConf";
import {SysEvent} from "@/dom/def/base/SysEvent";
import {Sys} from "@/dom/def/base/Sys";
import {AppModConf} from "@/dom/def/mod/AppModConf";

//从父组件接收的 props
const props = defineProps<{
  conf: ThemeModConf;
}>();

const logoRef = ref(props.conf.logo);
const nameRef = ref(props.conf.name);
const isShow = ref(false);
const emit = defineEmits(['sysEv']);

//从缓存获取当前主题
const confYa = localStorage.getItem(Sys.SYS_MOD_CONF_PATH);
if (confYa) {
  const actConf = props.conf.list.find(item => item.url === confYa);
  if (actConf) {
    logoRef.value = actConf.logo
    nameRef.value = actConf.name
  }
}

/*双击打开*/
let clickTimeout = 0;
const openApp = (event: MouseEvent) => {
  //event.stopPropagation();
  //event.preventDefault();
  if (clickTimeout === 1) {
    //触发双击
    isShow.value = !isShow.value;
    return;
  }

  clickTimeout = 1;
  setTimeout(function () {
    clickTimeout = 0;
  }, 300);

};

function doSwitch(actConf:AppModConf,event: MouseEvent) {
  //event.stopPropagation();
  //event.preventDefault();
  logoRef.value = actConf.logo
  nameRef.value = actConf.name
  const sysEv: SysEvent = new SysEvent(Sys.SYS_EVENT_RELOAD_MOD, {url: actConf.url});
  emit('sysEv', sysEv);
}

function doOpen(){
  isShow.value = true;
}

function doClose(){
  isShow.value = false;
}
</script>

<style scoped>
.ya-mod-theme {
  height: 21px;
  width: 21px;
  display: flex;
  align-items: center;
  flex-direction: column;
  top: 28px;
  right: 28px;
}
.ya-mod-theme:hover{
  height: 77px;
  width: 77px;
}

.ya-mod-theme-logo {
  height: 70%;
  width: 70%;
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ya-mod-theme-logo:hover {
  background-color: rgb(255, 255, 255, 0.1);
}

.ya-mod-theme-logo img {
  height: 77%;
  width: 77%;
}
.ya-mod-theme-logo-mini{
  height: 21px;
  width: 21px;
  position: absolute;
  right: 0;
  top: 0;
}

.ya-mod-theme-name {
  width: 100%;
  height: 30%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
  text-align: center;
  color: white;
}

.ya-mod-theme-name:hover {
  overflow: visible;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.ya-mod-theme-box {
  position: fixed;
  margin-top: 77px;
  width: 77px;
  height: 154px;
}
.ya-mod-theme-list{
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
.ya-mod-theme-list::-webkit-scrollbar {
  height: 7px;
  width: 21px;
  background: rgb(255, 216, 83,0.3);
}

.ya-mod-theme-item{
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