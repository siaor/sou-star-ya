<template>

  <div class="ya-mod ya-mod-mode" :id="id" @mouseenter="doOpenMiniPop" @touchstart="doOpenMiniPop"
       @mouseleave="doCloseMiniPop"
       @touchleave="doCloseMiniPop"
       title="双击打开[模式设置]">

    <img class="ya-mod-mode-logo-mini" :src="actModeRef.logo" alt="logo">
    <div class="ya-mod-mode-logo" @mousedown="openApp">
      <img :src="conf.logo" alt="logo">
    </div>
    <div class="ya-mod-mode-name">
      {{ conf.name }}
    </div>

    <div class="ya-mod-mode-box" v-show="isShowMiniPopRef" title="点击切换模式">
      <div class="ya-mod-mode-list">
        <div class="ya-mod-mode-item" v-for="(item, index) in modeList" :key="index" @click="doSwitch(item,$event)">
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
  <div class="ya-mod-mode-setting" v-show="isShowPopRef" title="">
    <div class="ya-mod-mode-setting-content">
      <div class="ya-mod-mode-setting-content-title">
        <div class="ya-mod-mode-setting-menu"></div>
        <span>模式设置</span>
        <div class="ya-mod-mode-setting-menu ya-mod-mode-setting-menu-right">
          <div class="ya-mod-mode-setting-close"><img src="/img/icon/close.svg" alt="close" @click="doClosePop">
          </div>
        </div>
      </div>

      <div class="ya-mod-mode-setting-content-list">
        <div class="ya-mod-mode-setting-content-item" v-for="(item, index) in modeList" :key="index"
             @click="doSwitchEdit(item,$event)">
          <div class="ya-mod-mode-setting-content-mode">
            <div class="ya-mod-mode-logo" @mousedown="openApp">
              <img :src="item.logo" alt="logo">
            </div>
            <div class="ya-mod-mode-name">
              {{ item.name }}
            </div>
          </div>
          <div class="ya-mod-mode-setting-content-mode-fun">
            <button @click="doDeleteMode(item.url,$event)">删除</button>
            <button @click="doClearMode(item.url)">重置</button>
            <button @click="doSwitch(item,$event)">应用</button>
            <button @click="doExport(item.url)">导出</button>
          </div>
        </div>
      </div>

      <div class="ya-mod-mode-setting-content-edit" v-show="isShowEditRef">
        名称：<input type="text" v-model="editModeRef.name" placeholder="请填写名称">
        图标：<input type="text" v-model="editModeRef.logo" placeholder="请填写图标地址">
        地址：<input type="text" v-model="editModeRef.url" placeholder="请填写模式存放地址">
        背景：<input type="text" v-model="editModeRef.bg" placeholder="请填写模式背景地址">
        <button @click="doSaveMode">保存</button>
      </div>

      <div class="ya-mod-mode-setting-content-footer">
        <button @click="doCreateMode()">新建模式</button>
        <button @click="doClearMode()">全部重置</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineProps, onMounted, ref} from 'vue';
import {ModeModConf} from "@/dom/def/mod/ModeModConf";
import {SysEvent} from "@/dom/def/base/SysEvent";
import {Sys} from "@/dom/def/base/Sys";
import {ModCtr} from "@/ctr/ModCtr";
import {DownloadUtil} from "@/res/util/DownloadUtil";
import {Mode} from "@/dom/def/Mode";
import {ModeCtr} from "@/ctr/ModeCtr";

//从父组件接收的 props
const props = defineProps<{
  id: string;
  mod: string;
  conf: ModeModConf;
  def: any;
}>();
//系统事件
const emit = defineEmits(['sysEv']);

/*>>>>>>> 【组件自定义处理】 <<<<<<<*/
/*const logoRef = ref(props.conf.logo);
const nameRef = ref(props.conf.name);*/
const isShowMiniPopRef = ref(false);
const isShowPopRef = ref(false);

const actModeRef = ref<Mode>(new Mode());

const modeList = ref<Mode[]>([]);

const modeSettingKey = 'mode-setting-show';

/*双击打开*/
let clickTimeout = 0;
const openApp = (event: MouseEvent) => {
  //event.stopPropagation();
  //event.preventDefault();
  if (clickTimeout === 1) {
    //触发双击
    doOpenPop();
    return;
  }

  clickTimeout = 1;
  setTimeout(function () {
    clickTimeout = 0;
  }, 300);

};

//切换模式
function doSwitch(mode: Mode, event: MouseEvent) {
  event.stopPropagation();
  //event.preventDefault();
  actModeRef.value = mode;
  emit('sysEv', new SysEvent(Sys.SYS_EVENT_RELOAD_MODE, mode));
  emit('sysEv', new SysEvent(Sys.SYS_EVENT_RELOAD_BG, mode));
}

//切换模式的编辑信息
const isShowEditRef = ref(false);
const editModeRef = ref<Mode>(new Mode());

function doSwitchEdit(mode: Mode, event: MouseEvent) {
  isShowEditRef.value = true;
  editModeRef.value = mode;
}

//显示迷你弹窗
function doOpenMiniPop() {
  isShowMiniPopRef.value = true;
}

//关闭迷你弹窗
function doCloseMiniPop() {
  isShowMiniPopRef.value = false;
  isShowEditRef.value = false;
}

//打开模式设置弹窗
function doOpenPop() {
  localStorage.setItem(modeSettingKey, 'true');
  isShowPopRef.value = true;
}

//关闭模式设置弹窗
function doClosePop() {
  localStorage.setItem(modeSettingKey, 'false');
  isShowPopRef.value = false;
  isShowEditRef.value = false;
}

//重置模式
async function doClearMode(url?: string) {
  let actUrl;
  if (url) {
    actUrl = url;
    const modeName = ModCtr.buildModeName(url);
    localStorage.removeItem(ModeCtr.buildModeKey(modeName));
  } else {
    actUrl = localStorage.getItem(Sys.SYS_MODE);
    localStorage.clear();
  }

  //重刷模式列表
  await ModeCtr.clear();
  await loadMode();

  emit('sysEv', new SysEvent(Sys.SYS_EVENT_RELOAD_MODE, {url: actUrl}));
}

//导出模式
async function doExport(url: string) {
  const modeName = ModCtr.buildModeName(url);

  //获取模式内容
  const modeAR = await ModeCtr.exportMode(url);
  if (!modeAR.success) {
    alert(modeAR.msg);
    return;
  }

  let content = JSON.stringify(modeAR.data, null, 2);

  DownloadUtil.exportFile(modeName + '.json', content);
}

//保存模式
async function doSaveMode() {
  const actUrl = actModeRef.value.url;
  for (let mode of modeList.value) {
    if (mode.url !== actUrl) {
      continue;
    }
    mode.name = actModeRef.value.name;
    mode.logo = actModeRef.value.name;
    mode.bg = actModeRef.value.name;
  }

  //todo:模式名称改变，数据库健的变动，不允许修改？？
  //更新数据库
  const modeAR = await ModeCtr.saveList(modeList.value);
  if (!modeAR.success) {
    alert(modeAR.msg);
  }
}

//新建模式
async function doCreateMode() {
  const modeIndex = modeList.value.length + 1;
  const modeName = `ya-${modeIndex}`;

  const newMode = new Mode();
  newMode.name = `自定义-${modeIndex}`;
  newMode.logo = './img/mode/ya.svg';
  newMode.url = `./mode/${modeName}.json`;
  newMode.bg = '';
  modeList.value.push(newMode);

  //添加缓存信息
  localStorage.setItem(ModeCtr.buildModeKey(modeName), newMode.url);
  //更新数据库
  const modeAR = await ModeCtr.createMode(modeName, modeList.value);
  if (!modeAR.success) {
    alert(modeAR.msg);
  }
}

//删除模式
async function doDeleteMode(modeUrl: string, event: MouseEvent) {
  event.stopPropagation();
  modeList.value = modeList.value.filter(item => item.url !== modeUrl);

  //删除了当前模式，切换到第一个
  if(actModeRef.value.url === modeUrl) {
    const actMode = modeList.value[0];
    if(actMode){
      actModeRef.value = actMode;
      emit('sysEv', new SysEvent(Sys.SYS_EVENT_RELOAD_MODE, actMode));
      emit('sysEv', new SysEvent(Sys.SYS_EVENT_RELOAD_BG, actMode));
    }
  }

  //移除缓存
  localStorage.removeItem(ModeCtr.buildModeKey(ModeCtr.buildModeName(modeUrl)));
  //更新数据库
  const modeAR = await ModeCtr.saveList(modeList.value);
  if (!modeAR.success) {
    alert(modeAR.msg);
  }
}

/*>>>>>>> 【组件通用处理】 <<<<<<<*/
//页面加载完成后
onMounted(() => {
  init();
});

//初始化
async function init() {
  //模式设置窗口
  if (localStorage.getItem(modeSettingKey) === 'true') {
    isShowPopRef.value = true;
  }

  //调用系统事件：添加模组拖拽事件
  if (props.conf.isDrag) {
    const sysEvAddDrag: SysEvent = new SysEvent(Sys.SYS_EVENT_ADD_DRAG, {
      id: props.id,
      x: props.conf.x,
      y: props.conf.y
    });
    emit('sysEv', sysEvAddDrag);
  }

  await loadMode();
}

async function loadMode() {
  //获取模式列表
  const modeListAR = await ModeCtr.list();
  if (modeListAR.success) {
    modeList.value = modeListAR.data;
  }

  //从缓存获取当前模式
  const sysModeUrl = localStorage.getItem(Sys.SYS_MODE);
  if (sysModeUrl) {
    const actMode = modeList.value.find(item => item.url === sysModeUrl);
    if (actMode) {
      actModeRef.value = actMode;
      editModeRef.value = actMode;
      emit('sysEv', new SysEvent(Sys.SYS_EVENT_RELOAD_BG, actMode));
    }
  }
}
</script>

<style scoped>
.ya-mod-mode {
  height: 1px;
  width: 1px;
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

.ya-mod-mode-setting {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0, 0.7);
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ya-mod-mode-setting-menu {
  width: 28%;
  height: 100%;
}

.ya-mod-mode-setting-menu-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.ya-mod-mode-setting-close {
  width: 35px;
  height: 35px;
  margin-right: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ya-mod-mode-setting-close img {
  width: 77%;
  height: 77%;
  cursor: pointer;
}

.ya-mod-mode-setting-content {
  width: 77%;
  height: 77%;
  background-color: rgb(255, 255, 255, 0.1);
  border-radius: 14px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.ya-mod-mode-setting-content-title {
  width: 100%;
  height: 42px;
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
}

.ya-mod-mode-setting-content-list {
  width: 99%;
  flex: 1;
}

.ya-mod-mode-setting-content-item {
  width: 100%;
  height: 81px;
  border: 1px solid rgb(255, 255, 255, 0.1);
  border-radius: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.ya-mod-mode-setting-content-item:hover {
  background-color: rgb(255, 255, 255, 0.1);
}

.ya-mod-mode-setting-content-mode-fun {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  overflow-x: auto;
}

.ya-mod-mode-setting-content-mode-fun button {
  width: 77px;
  height: 35px;
  margin: 14px;
  border-radius: 7px;
  background-color: rgb(255, 255, 255, 0.1);
  cursor: pointer;
  white-space: nowrap;
  color: white;
  text-shadow: -1px -1px 0 #000,
  1px -1px 0 #000,
  -1px 1px 0 #000,
  1px 1px 0 #000;
}

.ya-mod-mode-setting-content-mode-fun button:hover {
  background-color: rgb(255, 255, 255, 0.3);
}

.ya-mod-mode-setting-content-mode {
  height: 77px;
  width: 77px;
  margin: 4px;
  display: flex;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
}

.ya-mod-mode-setting-content-edit {
  width: 100%;
  height: 56px;
  /*border: 1px solid rgb(255, 255, 255, 0.1);*/
  display: flex;
  align-items: center;
  justify-content: center;
}

.ya-mod-mode-setting-content-edit input {
  width: 18%;
  height: 66%;
  background-color: rgb(0, 0, 0, 0.2);
  border: none;
  border-radius: 7px;
  letter-spacing: 1px;
  padding: 1px 1px 1px 7px;
  margin-right: 7px;
  font-size: 16px;
}

.ya-mod-mode-setting-content-edit button {
  width: 77px;
  height: 66%;
  cursor: pointer;
}

.ya-mod-mode-setting-content-footer {
  width: 100%;
  height: 56px;
  background-color: rgb(255, 255, 255, 0.1);
  border-radius: 0 0 14px 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ya-mod-mode-setting-content-footer button {
  width: 30%;
  height: 42px;
  margin: 0 7px 0 7px;
  background-color: rgb(255, 255, 255, 0.1);
  border-radius: 14px;
  cursor: pointer;
  color: white;
  text-shadow: -1px -1px 0 #000,
  1px -1px 0 #000,
  -1px 1px 0 #000,
  1px 1px 0 #000;
}

.ya-mod-mode-setting-content-footer button:hover {
  background-color: rgb(255, 255, 255, 0.2);
}

/* >>>>>>>【响应式样式】<<<<<<< */
/* 小屏幕：手机 */
@media (max-width: 768px) {
  .ya-mod-mode-setting-content-mode-fun {
    justify-content: flex-start;
  }
}


/* 中屏幕：平板 */
@media (min-width: 769px) and (max-width: 992px) {

}


/* 中屏幕：笔记本 */
@media (min-width: 993px) and (max-width: 1399px) {

}
</style>