<template>
  <div class="ya-desktop">
    <component v-for="(mod, index) in modListRef" :key="index" :is="mod.def" v-bind="mod" @sysEv="sysEv"/>
    <FastMenu @sysEv="sysEv"></FastMenu>
  </div>
  <SysBg v-bind="actMode"></SysBg>
</template>

<script setup lang="ts">
import './index.css'
import {DefineComponent, onMounted, shallowRef} from "vue";
import SysBg from '@/view/bg/SysBg.vue'
import {Mod} from "@/dom/def/Mod";
import {ModCtr} from "@/ctr/ModCtr";
import {ActCode} from "@/dom/def/base/ActCode";
import {SysEvent} from "@/dom/def/base/SysEvent";
import {Sys} from "@/dom/def/base/Sys";
import {AllMod} from "@/dom/def/ModSky";
import {addMoveEv} from "@/res/util/DragUtil";
import {ActResult} from "@/dom/def/base/ActResult";
import {Mode} from "@/dom/def/Mode";
import FastMenu from "@/view/sys/FastMenu.vue";

//模组列表
const modListRef = shallowRef<Mod[]>([]);

const actMode = shallowRef<Mode>(new Mode());

/**
 * 加载模式
 *
 * @description 根据模式文件url加载模式
 * @author Siaor
 * @date 2024-12-12 03:41:49
 * */
async function loadMode(url: string) {
  const listAR = await ModCtr.list(url);
  if (!listAR.success) {
    alert(ActCode.MOD_CONF_NOT_FOUND.msg);
    return;
  }

  const modList: Mod[] = [];

  //模组定义
  const modIdList: string[] = listAR.data;
  let modAR: ActResult;
  let mod: Mod;
  for (let modId of modIdList) {
    //从缓存获取模组信息
    modAR = await ModCtr.get(modId);
    if (!modAR.success) continue;

    mod = modAR.data;

    //模组定义
    const modDef = AllMod.def[mod.mod as keyof typeof AllMod.def] as DefineComponent<{}, {}, any>;
    if (!modDef) continue;
    mod.def = modDef;

    modList.push(mod);
  }

  //渲染模组
  modListRef.value = [];
  setTimeout(function () {
    modListRef.value = modList;
  }, 100);

}

/**
 * 公开的系统事件
 *
 * @author Siaor
 * @date 2024-12-10 04:37:12
 * */
function sysEv(e: SysEvent) {
  switch (e.name) {
    case Sys.SYS_EVENT_RELOAD_MODE:
      loadMode(e.data.url);
      break;
    case Sys.SYS_EVENT_RELOAD_BG:
      actMode.value = e.data;
      break;
    case Sys.SYS_EVENT_CACHE_MOD:
      ModCtr.cache(e.data);
      break
    case Sys.SYS_EVENT_ADD_DRAG:
      addMoveEv(e.data.id, e.data.x, e.data.y);
      break
    default:
      break;
  }
}


//页面加载完成后
onMounted(() => {
  loadMode(localStorage.getItem(Sys.SYS_MODE) ?? './mode/ya.json');
});
</script>

<style scoped>

</style>
