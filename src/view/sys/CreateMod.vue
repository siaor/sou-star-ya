<template>
  <div class="ya-fast-menu-pop" v-show="isShowPopRef">
    <div class="ya-fast-menu-pop-win">
      <div class="ya-fast-menu-pop-header">
        <div class="ya-fast-menu-pop-header-left"></div>
        <span>{{ popTitleRef }}</span>
        <div class="ya-fast-menu-pop-header-right" @click="closePop">
          <img src="/img/icon/close.svg" alt="close">
        </div>
      </div>
      <div class="ya-fast-menu-pop-content">
        <div class="ya-fast-menu-pop-content-left">
          <div class="ya-fast-menu-pop-content-title">
            配置
          </div>
          <div class="ya-fast-menu-pop-content-item">
            <div class="ya-fast-menu-pop-content-item-conf">
              <label>X坐标</label>
              <input type="number" v-model="xRef" @change="afterChange" placeholder="坐标原点为左上角">
            </div>
            <div class="ya-fast-menu-pop-content-item-conf">
              <label>Y坐标</label>
              <input type="number" v-model="yRef" @change="afterChange" placeholder="坐标原点为左上角">
            </div>
            <div class="ya-fast-menu-pop-content-item-conf">
              <label>是否可拖拽</label>
              <div class="ya-fast-menu-pop-content-item-conf-box">
                是<input type="radio" v-model="isDragRef" value="true" @change="afterChange">
                否<input type="radio" v-model="isDragRef" value="false" @change="afterChange">
              </div>
            </div>
            <div class="ya-fast-menu-pop-content-item-conf">
              <label>图标地址</label>
              <input type="text" v-model="logoRef" @change="afterChange" placeholder="请填写链接">
            </div>
            <div class="ya-fast-menu-pop-content-item-conf" v-show="urlRef!==''">
              <label>跳转地址</label>
              <input type="text" v-model="urlRef" @change="afterChange" placeholder="请填写链接">
            </div>
            <div class="ya-fast-menu-pop-content-item-conf">
              <label>名称</label>
              <input type="text" v-model="nameRef" @change="afterChange" placeholder="请填写名称">
            </div>
          </div>
        </div>
        <div class="ya-fast-menu-pop-content-right">
          <div class="ya-fast-menu-pop-content-title">
            预览
          </div>
          <div class="ya-fast-menu-pop-content-item">
            <textarea readonly v-model="modJsonRef"></textarea>
            <div class="ya-fast-menu-pop-content-item-pre">
              <div class="ya-mod ya-mod-app" title="双击打开">
                <div class="ya-mod-app-logo">
                  <img :src="logoRef" alt="logo">
                </div>
                <div class="ya-mod-app-name">
                  {{ nameRef }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ya-fast-menu-pop-footer">
        <div class="ya-fast-menu-pop-footer-item" @click="closePop">
          取消
        </div>
        <div class="ya-fast-menu-pop-footer-item" @click="doCreateMod">
          确定
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {ActCode} from "@/dom/def/base/ActCode";
import {Mod} from "@/dom/def/Mod";
import {AppModConf} from "@/dom/def/mod/AppModConf";
import {GroupModConf} from "@/dom/def/mod/GroupModConf";
import {Sys} from "@/dom/def/base/Sys";
import {ModCtr} from "@/ctr/ModCtr";

//向父组件提供方法
defineExpose({
  openPop
});

const isShowPopRef = ref(false);
const popTitleRef = ref('');

//模组信息
const modRef = ref<Mod>(new Mod());
const modJsonRef = ref('');
const xRef = ref(0);
const yRef = ref(0);
const isDragRef = ref('');
const logoRef = ref('');
const urlRef = ref('');
const nameRef = ref('');


function closePop() {
  isShowPopRef.value = false;
}

//新建应用
function openPop(mod: string, x: number, y: number) {
  switch (mod) {
    case "AppMod":
      popTitleRef.value = "新建[应用模组]";
      const appModConf = new AppModConf();
      appModConf.x = x;
      appModConf.y = y;
      modRef.value.conf = appModConf;

      logoRef.value = appModConf.logo;
      urlRef.value = appModConf.url;
      nameRef.value = appModConf.name;
      isDragRef.value = String(appModConf.isDrag);
      break;
    case "GroupMod":
      popTitleRef.value = "新建[应用分组模组]";
      const groupModConf = new GroupModConf();
      groupModConf.x = x;
      groupModConf.y = y;
      modRef.value.conf = groupModConf;

      logoRef.value = groupModConf.logo;
      urlRef.value = '';
      nameRef.value = groupModConf.name;
      isDragRef.value = String(groupModConf.isDrag);
      break;
    default:
      alert(ActCode.ERROR.msg);
      return;
  }
  isShowPopRef.value = true;
  modRef.value.mod = mod;
  xRef.value = x;
  yRef.value = y;
  afterChange();
}

function afterChange() {
  const mod = modRef.value.mod;
  switch (mod) {
    case "AppMod":
      const appModConf = new AppModConf();
      appModConf.x = xRef.value;
      appModConf.y = yRef.value;
      appModConf.isDrag = isDragRef.value === 'true';
      appModConf.logo = logoRef.value;
      appModConf.url = urlRef.value;
      appModConf.name = nameRef.value;
      modRef.value.conf = appModConf;
      break;
    case "GroupMod":
      const groupModConf = new GroupModConf();
      groupModConf.x = xRef.value;
      groupModConf.y = yRef.value;
      groupModConf.isDrag = isDragRef.value === 'true';
      groupModConf.logo = logoRef.value;
      groupModConf.name = nameRef.value;
      modRef.value.conf = groupModConf;
      break;
    default:
      return;
  }
  modJsonRef.value = JSON.stringify(modRef.value, null, 2);
}

async function doCreateMod() {
  //从缓存获取当前模组列表
  const modeId = localStorage.getItem(Sys.SYS_MODE);
  if (!modeId) return;

  const addAR = await ModCtr.add(modeId, modRef.value);
  if (!addAR.success) {
    alert(addAR.msg);
    return;
  }
  window.location.reload();
}
</script>

<style scoped>
.ya-fast-menu-pop {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  /*display: none;*/
}

.ya-fast-menu-pop-win {
  width: 77%;
  height: 77%;
  background-color: rgb(255, 255, 255, 0.1);
  border-radius: 14px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.ya-fast-menu-pop-header {
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

.ya-fast-menu-pop-header:hover {
  background-color: rgb(255, 255, 255, 0.2);
}

.ya-fast-menu-pop-header-left {
  width: 42px;
  height: 35px;
}

.ya-fast-menu-pop-header-right {
  width: 42px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ya-fast-menu-pop-header-right img {
  width: 77%;
  height: 77%;
  cursor: pointer;
}

.ya-fast-menu-pop-content {
  width: 100%;
  flex: 1;
  display: flex;

}

.ya-fast-menu-pop-content-left {
  width: 50%;
  height: 100%;
  background-color: rgb(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
}

.ya-fast-menu-pop-content-right {
  width: 50%;
  height: 100%;
  background-color: rgb(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
}

.ya-fast-menu-pop-content-right textarea {
  width: 96%;
  height: 66%;
  resize: none;
  border: none;
  border-radius: 7px;
  padding: 7px;
  background: rgb(0, 0, 0, 0.3);
  color: white;
  font-size: 16px;
  letter-spacing: 1px;
}

.ya-fast-menu-pop-content-item-pre {
  width: 98%;
  height: 30%;
  border-radius: 7px;
  background: rgb(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}

.ya-fast-menu-pop-content-title {
  width: 100%;
  height: 42px;
  text-align: center;
  margin: 7px 0 7px 0;
  background-color: rgb(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.ya-fast-menu-pop-content-item {
  width: 100%;
  flex: 1;
  /*border: 1px solid red;*/
  display: flex;
  flex-direction: column;
  /*justify-content: center;*/
  align-items: center;
}

.ya-fast-menu-pop-content-item-conf {
  width: 100%;
  height: 42px;
  display: flex;
  align-items: center;
  border: 1px solid rgb(255, 255, 255, 0.1);
}

.ya-fast-menu-pop-content-item-conf label {
  width: 21%;
  height: 42px;
  line-height: 42px;
  text-align: center;
  letter-spacing: 7px;
}

.ya-fast-menu-pop-content-item-conf input {
  width: 77%;
  height: 77%;
  background-color: rgb(0, 0, 0, 0.2);
  border: none;
  border-radius: 7px;
  letter-spacing: 1px;
  padding-left: 7px;
  font-size: 16px;
}

.ya-fast-menu-pop-content-item-conf-box {
  width: 77%;
  height: 77%;
  background-color: rgb(0, 0, 0, 0.2);
  border-radius: 7px;
  display: flex;
  align-items: center;
  padding: 1px 1px 1px 7px;
}

.ya-fast-menu-pop-content-item-conf input[type="radio"] {
  width: 10%;
  height: 42%;
  padding: 0;
  margin: 0;
  cursor: pointer;
}

.ya-fast-menu-pop-footer {
  width: 100%;
  height: 56px;
  background-color: rgb(255, 255, 255, 0.1);
  border-radius: 0 0 14px 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ya-fast-menu-pop-footer-item {
  width: 50%;
  height: 100%;
  border-radius: 0 0 14px 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  /*background-color: rgb(255, 255, 255, 0.2);*/
  /*border: 1px solid rgb(0,0,0,0.3);*/
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.5);
}

.ya-fast-menu-pop-footer-item:hover {
  background-color: rgb(255, 255, 255, 0.2);
}
</style>
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
</style>