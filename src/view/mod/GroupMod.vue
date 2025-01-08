<template>
  <div class="ya-mod ya-mod-group" :id="id" :style="{top:conf.y+'px',left:conf.x+'px'}" title="双击打开">
    <div class="ya-mod-group-logo" :id="id+'-mod'" @mousedown="doOpen" @contextmenu.prevent="openModMenu($event)">
      <img :src="conf.logo" alt="logo">
    </div>
    <div class="ya-mod-group-name">
      {{ conf.name }}
    </div>
  </div>
  <transition name="shrink">
    <div class="ya-mod-group-pop" v-show="isShow">
      <div class="ya-mod-group-pop-content">
        <div class="ya-mod-group-pop-header">
          <div class="ya-mod-group-pop-header-menu-left"></div>
          <span>{{ conf.name }}</span>
          <div class="ya-mod-group-pop-header-menu-right">
            <img src="/img/icon/close.svg" alt="close" @click="doClose">
          </div>
        </div>

        <div class="ya-mod-group-pop-list" @click="closeModMenu">
          <div class="ya-mod-group-add" title="添加子模组" @click="doAddMod($event)">
            <img src="/img/icon/add.svg" alt="logo">
          </div>
          <component v-for="(mod, index) in modListRef" :key="index" :is="mod.def" v-bind="mod" @sysEv="sysEv"/>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import {DefineComponent, onMounted, ref, shallowRef} from 'vue';
import {GroupModConf} from "@/dom/def/mod/GroupModConf";
import {Mod} from "@/dom/def/Mod";
import {AllMod} from "@/dom/def/ModSky";
import {SysEvent} from "@/dom/def/base/SysEvent";
import {Sys} from "@/dom/def/base/Sys";
import {isMobileDevice} from "@/ctr/SysCtr";
import {ModCtr} from "@/ctr/ModCtr";
import {ActResult} from "@/dom/def/base/ActResult";
import {AppModConf} from "@/dom/def/mod/AppModConf";

//从父组件接收的 props
const props = defineProps<{
  id: string;
  mod: string;
  conf: GroupModConf;
  def: any;
}>();
//系统事件
const emit = defineEmits(['sysEv']);

/*>>>>>>> 【组件自定义处理】 <<<<<<<*/
const groupPopKey = 'group-pop-show';

const isShow = ref(false);
//组件列表
const modListRef = shallowRef<Mod[]>([]);
let modList: Mod[] = [];

/*双击打开*/
let clickTimeout = 0;
const doOpen = (event: Event) => {
  event.preventDefault();
  //触发双击
  if (clickTimeout === 1) {
    event.stopPropagation();
    loadList();
    //SysCtr.fullScreen();
    isShow.value = true;
    localStorage.setItem(groupPopKey, props.id);
    return;
  }

  clickTimeout = 1;
  setTimeout(function () {
    clickTimeout = 0;
  }, 300);

};

async function loadList() {
  //清空列表
  modList = [];

  //从数据库获取列表
  const groupId = props.id;
  const groupKey = `${groupId}-group`;
  const groupAR = await ModCtr.getGroupModIdList(groupKey);
  if (!groupAR.success) {
    alert(groupAR.msg);
    return;
  }
  const modIdList: string[] = groupAR.data;

  let gap = isMobileDevice ? 0 : 23;
  let gapRate = isMobileDevice ? 0.97 : 0.77;

  const maxCount = Math.floor((window.innerWidth * gapRate - gap) / 100);
  let modAR: ActResult;
  let mod: Mod;
  let modIndex = 1;
  for (let modId of modIdList) {

    //从缓存获取模组信息
    modAR = await ModCtr.get(modId);
    if (!modAR.success) continue;

    mod = modAR.data;

    mod.conf.x = ((modIndex % maxCount) * 100) + gap;
    mod.conf.y = (Math.floor(modIndex / maxCount) * 100) + 28;

    const modDef = AllMod.def[mod.mod as keyof typeof AllMod.def] as DefineComponent<{}, {}, any>;
    if (!modDef) return;

    mod.def = modDef;
    modList.push(mod);

    modIndex++;
  }
  modListRef.value = modList;
}

function doClose() {
  //todo:关闭动画效果
  isShow.value = false;
  localStorage.removeItem(groupPopKey);
}

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

async function doAddMod(event: MouseEvent) {
  event.stopPropagation();


  //从数据库获取列表
  const groupId = props.id;
  const groupKey = `${groupId}-group`;
  const groupAR = await ModCtr.getGroupModIdList(groupKey);
  if (!groupAR.success) {
    alert(groupAR.msg);
    return;
  }
  const modIdList: string[] = groupAR.data;

  //获取分组模组信息
  const groupModAR = await ModCtr.get(groupId);
  if (!groupModAR.success) {
    alert(groupModAR.msg);
    return;
  }
  const groupMod: Mod = groupModAR.data;
  const groupModList: Mod[] = groupMod.conf.list;

  const modId = `${props.id}-${modIdList.length + 1}`;
  modIdList.push(modId);

  //新建模组
  const mod = new Mod();
  mod.id = modId;
  mod.mod = "AppMod";

  const conf = new AppModConf();
  conf.isDrag = false;
  mod.conf = conf;

  //更新列表
  ModCtr.groupAddModList(groupKey, modIdList);
  //插入模组
  ModCtr.cache(mod);
  //更新分组模组的模组列表
  groupModList.push(mod);
  ModCtr.cache(groupMod);

  window.location.reload();
}

function closeModMenu() {
  emit('sysEv', new SysEvent(Sys.SYS_EVENT_CLOSE_MOD_MENU, {}));
}


function sysEv(e: SysEvent) {
  emit('sysEv', e);
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

  //缓存分组中的模组
  const groupId = props.id;
  const groupKey = `${groupId}-group`;
  const groupIdCache = localStorage.getItem(groupKey);
  if (!groupIdCache) {
    const groupList = [];

    let groupIndex = 1;
    for (let mod of props.conf.list) {
      mod.id = `${groupId}-${groupIndex}`;
      //缓存
      ModCtr.cache(mod);
      groupList.push(mod.id);
      groupIndex++;
    }
    localStorage.setItem(groupKey, groupId);
    //缓存列表
    ModCtr.groupAddModList(groupKey, groupList);
  }

  //上次窗口状态
  const groupPopId = localStorage.getItem(groupPopKey);
  if (groupPopId && groupPopId === groupId) {
    loadList();
    isShow.value = true;
    localStorage.setItem(groupPopKey, props.id);
  }
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

.ya-mod-group-pop {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgb(0, 0, 0, 0.9);
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;

}

.ya-mod-group-pop-content {
  width: 77%;
  height: 77%;
  background-color: rgb(255, 255, 255, 0.1);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ya-mod-group-pop-header {
  width: 100%;
  height: 42px;
  border-radius: 14px 14px 0 0;
  font-size: 21px;
  color: white;
  text-shadow: -1px -1px 0 #000,
  1px -1px 0 #000,
  -1px 1px 0 #000,
  1px 1px 0 #000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  background-color: rgb(255, 255, 255, 0.1);
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.5);
  letter-spacing: 3px;
}

.ya-mod-group-pop-header:hover {
  background-color: rgb(255, 255, 255, 0.2);
}

.ya-mod-group-pop-header-menu-left {
  width: 42px;
  height: 35px;
}

.ya-mod-group-pop-header-menu-right {
  width: 42px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ya-mod-group-pop-header-menu-right img {
  width: 77%;
  height: 77%;
  cursor: pointer;
}


.ya-mod-group-pop-list {
  width: 100%;
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
}

.ya-mod-group-add {
  width: 55px;
  height: 55px;
  left: 35px;
  top: 35px;
  border-radius: 14px;
  position: absolute;
  background-color: rgb(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.ya-mod-group-add:hover {
  background-color: rgb(255, 255, 255, 0.2);
}

.ya-mod-group-add img {
  width: 66%;
  height: 66%;
}

/* >>>>>>>【响应式样式】<<<<<<< */
/* 小屏幕：手机 */
@media (max-width: 768px) {
  .ya-mod-group-pop-content {
    width: 94%;
    height: 90%;
  }

  .ya-mod-group-add {
    left: 12px;
  }
}


/* 中屏幕：平板 */
@media (min-width: 769px) and (max-width: 992px) {

}


/* 中屏幕：笔记本 */
@media (min-width: 993px) and (max-width: 1399px) {

}
</style>