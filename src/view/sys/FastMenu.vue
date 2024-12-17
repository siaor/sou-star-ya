<template>
  <div class="ya-fast-menu" @contextmenu.prevent="doShowMenu($event)" @touchstart="doShowMenuForMobile($event)"
       @click="doCloseMenu($event)">
    <div class="ya-fast-menu-content" v-show="isShowRef" :style="{top:menuYRef+'px',left:menuXRef+'px'}"
         @click="doNothing($event)">
      <div class="ya-fast-menu-title">
        <div class="ya-fast-menu-title-left"></div>
        <span>快捷菜单</span>
        <div class="ya-fast-menu-title-right" @click="doFullScreen">
          <img :src="isFullScreenRef ? '/img/icon/fullscreen-exit.svg': '/img/icon/fullscreen.svg'" alt="ya"
               :title="isFullScreenRef ? '退出全屏':'全屏显示'"/>
        </div>
      </div>
      <div class="ya-fast-menu-list">
        <div class="ya-fast-menu-item" @click="doRefresh">
          <div class="ya-fast-menu-item-left">
            <img src="/img/icon/refresh.svg" alt="ya"/>
          </div>
          <span>刷新</span>
          <div class="ya-fast-menu-item-right"></div>
        </div>

        <div class="ya-fast-menu-item" @click="doTidy">
          <div class="ya-fast-menu-item-left">
            <img src="/img/icon/tidy.svg" alt="ya"/>
          </div>
          <span>整理图标</span>
          <div class="ya-fast-menu-item-right"></div>
        </div>

        <div class="ya-fast-menu-item" @click="doReset">
          <div class="ya-fast-menu-item-left">
            <img src="/img/icon/reset.svg" alt="ya"/>
          </div>
          <span>重置</span>
          <div class="ya-fast-menu-item-right"></div>
        </div>

        <div class="ya-fast-menu-item ya-fast-menu-item-create" @click="doRefresh">
          <div class="ya-fast-menu-item-left">
            <img src="/img/icon/add.svg" alt="ya"/>
          </div>
          <span>新建</span>
          <div class="ya-fast-menu-item-right">
            <img src="/img/icon/right.svg" alt="ya"/>
            <div class="ya-fast-sub-menu ya-fast-sub-menu-create">
              <div class="ya-fast-sub-menu-content">
                <div class="ya-fast-sub-menu-item">应用</div>
                <div class="ya-fast-sub-menu-item">应用分组</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {SysCtr} from "@/ctr/SysCtr";
import {ModCtr} from "@/ctr/ModCtr";
import {Mod} from "@/dom/def/Mod";
import {Sys} from "@/dom/def/base/Sys";
import {ActResult} from "@/dom/def/base/ActResult";
import {ModeCtr} from "@/ctr/ModeCtr";

//系统事件
const emit = defineEmits(['sysEv']);

const isShowRef = ref(false);
const menuXRef = ref(0);
const menuYRef = ref(0);

//阻止事件冒泡
function doNothing(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();
}

//手机端双击显示快捷菜单
let clickTimeout = 0;

function doShowMenuForMobile(event: TouchEvent) {
  if (clickTimeout === 1) {
    //双击触发
    doShowMenu(event);
    return;
  }

  clickTimeout = 1;
  setTimeout(function () {
    clickTimeout = 0;
  }, 300);
}

//显示快捷菜单
function doShowMenu(event: MouseEvent | TouchEvent) {
  event.preventDefault();
  event.stopPropagation();
  if (event instanceof MouseEvent) {
    menuXRef.value = event.clientX;
    menuYRef.value = event.clientY;
  } else {
    const touch = event.changedTouches[0];
    menuXRef.value = touch.pageX;
    menuYRef.value = touch.pageY;
  }

  isShowRef.value = true;
}

//关闭快捷菜单
function doCloseMenu(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();
  isShowRef.value = false;
}

//刷新
function doRefresh() {
  window.location.reload();
}

//全屏
const isFullScreenRef = ref(false);
function doFullScreen() {
  const isFullScreen = isFullScreenRef.value;
  if (isFullScreen) {
    SysCtr.exitFullScreen();
  } else {
    SysCtr.fullScreen();
  }
  isFullScreenRef.value = !isFullScreen;
}

//整理图标
async function doTidy() {
  //从缓存获取当前模组列表
  const modeUrl = localStorage.getItem(Sys.SYS_MODE);
  if (!modeUrl) return;

  const listAR = await ModCtr.list(modeUrl);
  if (!listAR.success) return;

  const modIdList: string[] = listAR.data;

  //整理
  let x, y;
  let modAR: ActResult;
  let mod: Mod;
  const maxCount = Math.floor(window.innerWidth / 100);
  let appModIndex = 1, GroupModIndex = 1;
  for (let modId of modIdList) {
    //从缓存获取模组信息
    modAR = await ModCtr.get(modId);
    if (!modAR.success) continue;

    mod = modAR.data;

    //整理规则
    switch (mod.mod) {
      case "AppMod":
        x = ((appModIndex % maxCount - 1) * 100) + 28;
        y = (Math.floor(appModIndex / maxCount) * 100) + 28;
        appModIndex++;
        break;
      case "GroupMod":
        x = ((GroupModIndex % maxCount - 1) * 100) + 28;
        y = (Math.floor(GroupModIndex / maxCount) * 100) + 28;
        GroupModIndex++;
        break;
      default:
        x = 0;
        y = 0;
        break;
    }

    //更新坐标信息
    ModCtr.updatePosition(modId, x, y);
  }

  //重新渲染
  doRefresh();
}

//重置
function doReset() {
  const modeUrl = localStorage.getItem(Sys.SYS_MODE);
  if (!modeUrl) return;

  const modeName = ModeCtr.buildModeName(modeUrl);
  const modeKey = ModeCtr.buildModeKey(modeName);
  localStorage.removeItem(modeKey);

  //重新渲染
  doRefresh();
}

//新建
const isShowCreateMenuRef = ref(false);
function doShowCreateMenu() {
  isShowCreateMenuRef.value = true;
}
function doHideCreateMenu() {
  isShowCreateMenuRef.value = false;
}

function doCreate() {

}

//页面加载完成后
onMounted(() => {

});
</script>

<style scoped>
.ya-fast-menu {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0, 0.3);
  z-index: -1;
}

.ya-fast-menu-content {
  position: absolute;
  width: 200px;
  height: 335px;
  border-radius: 14px;
  background-color: rgb(0, 0, 0, 0.6);
  cursor: pointer;
  /*display: flex;
  flex-direction: column;*/
  /*justify-content: center;*/
  /*align-items: center;*/
  text-align: center;
  z-index: 999;
}

.ya-fast-menu-title {
  width: 100%;
  height: 35px;
  background-color: rgb(0, 0, 0, 0.6);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 14px 14px 0 0;
  color: white;
}

.ya-fast-menu-title-left {
  width: 21px;
  height: 21px;
  margin-left: 7px;
  border-radius: 50%;
}

.ya-fast-menu-title-right {
  width: 21px;
  height: 21px;
  margin-right: 7px;
  border-radius: 50%;
  background-color: rgb(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.ya-fast-menu-title-right:hover {
  background-color: rgb(255, 255, 255, 0.1);
}

.ya-fast-menu-title-right img {
  width: 14px;
  height: 14px;
}

.ya-fast-menu-list {
  width: 100%;
  height: 290px;
  overflow-y: auto;
  overflow-x: hidden;
  /*display: flex;*/
  /*justify-content: flex-start;
  justify-items: flex-start;*/
  /*flex-direction: column;*/
  /*align-items: center;*/
}

.ya-fast-menu-item {
  width: 92%;
  height: 35px;
  white-space: nowrap;
  background-color: rgb(255, 255, 255, 0.1);
  border-radius: 7px;
  margin-left: 4%;
  margin-top: 7px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.ya-fast-menu-item img {
  width: 50%;
  height: 50%;
}

.ya-fast-menu-item:hover {
  background-color: rgb(255, 255, 255, 0.3);
}

.ya-fast-menu-item-left {
  width: 35px;
  height: 35px;
  margin: 0 7px 0 7px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ya-fast-menu-item-right {
  width: 35px;
  height: 35px;
  margin: 0 7px 0 7px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ya-fast-sub-menu {
  position: relative;
  display: none;
}
.ya-fast-sub-menu-content{
  position: fixed;
  width: 140px;
  height: 200px;
  margin: -25px 0 0 16px;
  border-radius: 0 14px 14px 14px;
  background-color: rgb(0, 0, 0, 0.4);
  /*border: 1px solid red;*/
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 998;
}

.ya-fast-menu-item-create:hover .ya-fast-sub-menu-create{
  display: block;
}

.ya-fast-sub-menu-item{
  width: 89%;
  height: 35px;
  white-space: nowrap;
  background-color: rgb(255, 255, 255, 0.1);
  border-radius: 0 7px 0 0;
  margin-top: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.ya-fast-sub-menu-item:hover{
  display: block;
  background-color: rgb(255, 255, 255, 0.3);
}
</style>