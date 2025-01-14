<template>
  <div class="ya-mod ya-mod-note" :id="id">

    <div class="ya-mod-note-title" @mousedown="openApp" @contextmenu.prevent="openModMenu($event)"
         title="双击收起/展开">{{ conf.title }}
    </div>

    <div class="ya-mod-note-content" v-show="isShowRef" @mousedown="switchEdit" title="双击编辑/保存">
      <div v-show="!isEditRef" v-html="props.conf.content"></div>
      <div class="ya-mod-note-edit" v-show="isEditRef">
        <input type="text" v-model="props.conf.title" placeholder="标题">
        <textarea v-model="props.conf.content"></textarea>
        <input type="text" v-model="props.conf.bg" placeholder="颜色">
        <div class="ya-mod-note-resize" @mousedown="resizeStart" @mouseup="resizeStop"></div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import {onBeforeMount, onMounted, ref} from 'vue';
import {SysEvent} from "@/dom/def/base/SysEvent";
import {Sys} from "@/dom/def/base/Sys";
import {NoteModConf} from "@/dom/def/mod/NoteModConf";
import {ModCtr} from "@/ctr/ModCtr";
import {Mod} from "@/dom/def/Mod";
import {isMobileDevice} from "@/ctr/SysCtr";

//从父组件接收的 props
const props = defineProps<{
  id: string;
  mod: string;
  conf: NoteModConf;
}>();
//系统事件
const emit = defineEmits(['sysEv']);

/*>>>>>>> 【组件自定义处理】 <<<<<<<*/
const isShowRef = ref(props.conf.isShow);
const isEditRef = ref(false);

let modDom: HTMLElement | null;

/*双击打开*/
let clickTimeout = 0;
const openApp = (event: MouseEvent) => {
  event.preventDefault();
  if (clickTimeout === 1) {
    //触发双击
    isShowRef.value = !isShowRef.value;
    showContent();
    return;
  }

  clickTimeout = 1;
  setTimeout(function () {
    clickTimeout = 0;
  }, 300);

};

//切换到编辑模式、保存编辑内容
async function switchEdit(event: MouseEvent) {
  event.stopPropagation();
  if (clickTimeout === 1) {
    //触发双击
    const isEdit = isEditRef.value;
    //保存
    if (isEdit) {
      const modAR = await ModCtr.get(props.id);
      if (modAR.success) {
        const mod: Mod = modAR.data;
        mod.conf.title = props.conf.title;
        mod.conf.content = props.conf.content;
        mod.conf.bg = props.conf.bg;
        ModCtr.update(mod);

        if(modDom){
          modDom.style.background = props.conf.bg;
        }
      }
    }
    isEditRef.value = !isEdit;
    return;
  }

  clickTimeout = 1;
  setTimeout(function () {
    clickTimeout = 0;
  }, 300);

}

//展开、显示内容
async function showContent() {
  if (!modDom) {
    return;
  }
  const isShow = isShowRef.value;
  let height = 42;
  let width = 140;
  if (isShow) {
    height = props.conf.height;
    width = props.conf.width;
  }
  modDom.style.height = `${height}px`;
  modDom.style.width = `${width}px`;

  //更新模组信息
  const modAR = await ModCtr.get(props.id);
  if (modAR.success) {
    const mod: Mod = modAR.data;
    mod.conf.isShow = isShow;
    ModCtr.update(mod);
  }
}

//调整窗口大小
let startX = 0, startY = 0,newX = 0,newY=0;
let isResize = false;

function resizeStart(e: MouseEvent) {
  e.stopPropagation();
  e.preventDefault();
  startX = e.clientX;
  startY = e.clientY;
  isResize = true;
  window.addEventListener('mousemove', resize);
  window.addEventListener('mouseup', resizeStop);
}

function resize(e: MouseEvent) {
  e.stopPropagation();
  e.preventDefault();
  if (!isResize) {
    return;
  }
  if (!modDom) {
    return;
  }
  newX = props.conf.width + e.clientX - startX;
  newY = props.conf.height + e.clientY - startY;

  modDom.style.width = `${newX}px`;
  modDom.style.height = `${newY}px`;
}

async function resizeStop(e: MouseEvent) {
  e.stopPropagation();
  e.preventDefault();
  isResize = false;
  window.removeEventListener('mousemove', resize);
  window.removeEventListener('mouseup', resizeStop);
  //更新模组信息
  const modAR = await ModCtr.get(props.id);
  if (modAR.success) {
    props.conf.width = newX;
    props.conf.height = newY;

    const mod: Mod = modAR.data;
    mod.conf.width = newX;
    mod.conf.height = newY;
    ModCtr.update(mod);
  }
}

//打开模组菜单
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
  emit('sysEv', new SysEvent(Sys.SYS_EVENT_OPEN_MOD_MENU, {id: props.id, x: x, y: y,menu:[false,false,true]}));
}

/*>>>>>>> 【组件通用处理】 <<<<<<<*/
onBeforeMount(() => {
  //默认位置处理
  if (props.conf.x === 0 && props.conf.y === 0) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const maxCount = Math.floor(w / 100);
    const modIndex: number = parseInt(localStorage.getItem('modIndex') ?? '1', 10);

    props.conf.x = ((modIndex % maxCount - 1) * 142) + 28;
    props.conf.y = (Math.floor(modIndex / maxCount) * 100) + 28;

    localStorage.setItem('modIndex', String(modIndex + 1));
  }
});

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
  modDom = document.getElementById(props.id);
  buildMod();
}

function buildMod() {
  if (!modDom) {
    return;
  }
  if(isMobileDevice){
    isShowRef.value = false;
  }
  const isShow = isShowRef.value;
  let height = 42;
  let width = 140;
  if (isShow) {
    height = props.conf.height;
    width = props.conf.width;
  }
  modDom.style.height = `${height}px`;
  modDom.style.width = `${width}px`;
  modDom.style.left = `${props.conf.x}px`;
  modDom.style.top = `${props.conf.y}px`;
  modDom.style.background = props.conf.bg;
}
</script>

<style scoped>
.ya-mod-note {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.ya-mod-note-title {
  width: 100%;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  box-shadow: 0 0 3px 0 rgb(0, 0, 0, 0.5);
  border-bottom: 1px solid rgb(255, 255, 255, 0.1);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: white;
  text-shadow: -1px -1px 0 #000,
  1px -1px 0 #000,
  -1px 1px 0 #000,
  1px 1px 0 #000;
}

.ya-mod-note-content {
  width: 94%;
  flex: 1;
  padding: 7px;
  overflow-x: hidden;
  overflow-y: auto;
  word-wrap: break-word;
  white-space: normal;
  overflow-wrap: break-word;
  color: white;
  text-shadow: -1px -1px 0 #000,
  1px -1px 0 #000,
  -1px 1px 0 #000,
  1px 1px 0 #000;
  cursor: text;
}

.ya-mod-note-edit {
  width: 100%;
  height: 100%;
}

.ya-mod-note-edit input {
  width: 96%;
  height: 35px;
  border: none;
  border-radius: 7px 7px 0 0;
  padding: 0 7px 0 7px;
  background: rgb(0, 0, 0, 0.3);
  color: white;
  font-size: 16px;
  letter-spacing: 1px;
  text-align: center;
  border-bottom: 1px solid rgb(255, 255, 255, 0.1);
}

.ya-mod-note-content textarea {
  width: 96%;
  height: 77%;
  resize: none;
  border: none;
  border-radius: 0 0 7px 7px;
  padding: 7px;
  background: rgb(0, 0, 0, 0.3);
  color: white;
  font-size: 16px;
  letter-spacing: 1px;
}

.ya-mod-note-resize {
  position: absolute;
  width: 0;
  height: 0;
  right: 0;
  bottom: 0;
  cursor: nw-resize;
  border-style: solid;
  border-width:7px 7px 0 0;
  border-color: transparent gray transparent transparent;
}
.ya-mod-note-resize:hover{
  background: rgb(255, 255, 255, 0.3);
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