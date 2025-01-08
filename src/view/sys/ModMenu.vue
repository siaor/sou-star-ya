<template>
  <div class="ya-mod-menu-content" v-show="isShowRef" :style="{top:menuYRef+'px',left:menuXRef+'px'}"
       @click="doNothing($event)">

    <div class="ya-mod-menu-title">
      <div class="ya-mod-menu-title-left"></div>
      <span>模组菜单</span>
      <div class="ya-mod-menu-title-right" @click="doFullScreen">
        <img v-if="isFullScreenRef" src="/img/icon/fullscreen-exit.svg" alt="ya" title="退出全屏"/>
        <img v-else src="/img/icon/fullscreen.svg" alt="ya" title="全屏显示"/>
      </div>
    </div>

    <div class="ya-mod-menu-list">

      <div class="ya-mod-menu-item" @click="doOpen($event)">
        <div class="ya-mod-menu-item-left">
          <img src="/img/icon/refresh.svg" alt="ya"/>
        </div>
        <span>打开</span>
        <div class="ya-mod-menu-item-right"></div>
      </div>

      <div class="ya-mod-menu-item" @click="doEditMod">
        <div class="ya-mod-menu-item-left">
          <img src="/img/icon/tidy.svg" alt="ya"/>
        </div>
        <span>编辑</span>
        <div class="ya-mod-menu-item-right"></div>
      </div>

      <div class="ya-mod-menu-item" @click="doDelete">
        <div class="ya-mod-menu-item-left">
          <img src="/img/icon/reset.svg" alt="ya"/>
        </div>
        <span>删除</span>
        <div class="ya-mod-menu-item-right"></div>
      </div>


    </div>
  </div>
  <EditMod ref="editModRef"></EditMod>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {SysCtr} from "@/ctr/SysCtr";
import {ModCtr} from "@/ctr/ModCtr";
import EditMod from "@/view/sys/EditMod.vue";
import {SysEvent} from "@/dom/def/base/SysEvent";
import {Sys} from "@/dom/def/base/Sys";

defineExpose({
  openPop,
  closePop
});
//系统事件
const emit = defineEmits(['sysEv']);

const isShowRef = ref(false);
const menuXRef = ref(0);
const menuYRef = ref(0);

const modIdRef = ref('');

//阻止事件冒泡
function doNothing(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();
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

//打开菜单弹窗
function openPop(modId: string, x: number, y: number) {
  modIdRef.value = modId;
  menuXRef.value = x;
  menuYRef.value = y;
  isShowRef.value = true;
}

//关闭菜单弹窗
function closePop() {
  isShowRef.value = false;
}

//打开应用
function doOpen(event: MouseEvent) {
  event.stopPropagation();
  const modDom = document.getElementById(modIdRef.value + '-mod');
  if (modDom) {
    const rect = modDom.getBoundingClientRect();
    const mousedownEv = new MouseEvent('mousedown', {
      'view': window,
      'bubbles': true,
      'cancelable': true,
      'clientX': rect.x,
      'clientY': rect.y
    });
    const mouseleaveEv = new MouseEvent('mouseleave', {
      'view': window,
      'bubbles': true,
      'cancelable': true,
      'clientX': rect.x,
      'clientY': rect.y
    });

    modDom.dispatchEvent(mousedownEv);
    setTimeout(function () {
      modDom.dispatchEvent(mousedownEv);
      modDom.dispatchEvent(mouseleaveEv);
    }, 100);
  }
  emit('sysEv', new SysEvent(Sys.SYS_EVENT_CLOSE_MOD_MENU, {}));
}

//删除模组
async function doDelete() {
  const addAR = await ModCtr.delete(modIdRef.value);
  if (!addAR.success) {
    alert(addAR.msg);
    return;
  }
  window.location.reload();
}

//编辑模组
const editModRef = ref<InstanceType<typeof EditMod>>();

function doEditMod() {
  isShowRef.value = false;
  editModRef.value?.openPop(modIdRef.value);
}

//页面加载完成后
onMounted(() => {

});
</script>

<style scoped>
.ya-mod-menu {
  position: fixed;
  width: 100%;
  height: 100%;
  /*background-color: rgb(0, 0, 0, 0.3);*/
  z-index: -1;
}

.ya-mod-menu-content {
  position: absolute;
  width: 200px;
  height: 335px;
  border-radius: 14px;
  background-color: rgb(0, 0, 0, 0.6);
  cursor: pointer;
  text-align: center;
  z-index: 999;
}

.ya-mod-menu-title {
  width: 100%;
  height: 35px;
  background-color: rgb(0, 0, 0, 0.6);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 14px 14px 0 0;
  color: white;
}

.ya-mod-menu-title-left {
  width: 21px;
  height: 21px;
  margin-left: 7px;
  border-radius: 50%;
}

.ya-mod-menu-title-right {
  width: 21px;
  height: 21px;
  margin-right: 7px;
  border-radius: 50%;
  background-color: rgb(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.ya-mod-menu-title-right:hover {
  background-color: rgb(255, 255, 255, 0.1);
}

.ya-mod-menu-title-right img {
  width: 14px;
  height: 14px;
}

.ya-mod-menu-list {
  width: 100%;
  height: 290px;
  overflow-y: auto;
  overflow-x: hidden;
}

.ya-mod-menu-item {
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

.ya-mod-menu-item img {
  width: 50%;
  height: 50%;
}

.ya-mod-menu-item:hover {
  background-color: rgb(255, 255, 255, 0.3);
}

.ya-mod-menu-item-left {
  width: 35px;
  height: 35px;
  margin: 0 7px 0 7px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ya-mod-menu-item-right {
  width: 35px;
  height: 35px;
  margin: 0 7px 0 7px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ya-fast-sub-menu {
  position: relative;
}

.ya-fast-sub-menu-content {
  position: fixed;
  width: 140px;
  height: 200px;
  margin: -25px 0 0 16px;
  z-index: 998;
  display: none;
}

.ya-fast-sub-menu-list {
  width: 133px;
  height: 100%;
  border-radius: 0 14px 14px 7px;
  margin-left: 7px;
  background-color: rgb(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ya-mod-menu-item-create:hover .ya-fast-sub-menu-create {
  display: block;
}

.ya-fast-sub-menu-item {
  width: 89%;
  height: 35px;
  white-space: nowrap;
  background-color: rgb(255, 255, 255, 0.1);
  border-radius: 2px 7px 2px 7px;
  margin-top: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.ya-fast-sub-menu-item:hover {
  display: flex;
  background-color: rgb(255, 255, 255, 0.3);
}

</style>