<template>
  <div class="ya-desktop">
    <component v-for="(mod, index) in modListRef" :key="index" :is="mod.def" :id="mod.id" v-bind="mod" @sysEv="sysEv"/>
  </div>

  <StarBg></StarBg>
</template>

<script setup lang="ts">
import './index.css'
import {DefineComponent, onMounted, shallowRef} from "vue";
import StarBg from '@/view/bg/StarBg.vue'
import {Mod} from "@/dom/def/Mod";
import {ModCtr} from "@/ctr/ModCtr";
import {ActCode} from "@/dom/def/base/ActCode";
import {SysEvent} from "@/dom/def/base/SysEvent";
import {Sys} from "@/dom/def/base/Sys";
import {AllModDef} from "@/dom/def/ModSky";
import {addMoveEv} from "@/res/util/DragUtil";

//模组列表
let modList: Mod[];
const modListRef = shallowRef<Mod[]>([]);

/**
 * 加载模式
 *
 * @description 根据模式文件url加载模式
 * @author Siaor
 * @date 2024-12-12 03:41:49
 * */
async function loadMode(url: string) {
  const modAR = await ModCtr.load(url);
  if (!modAR.success) {
    alert(ActCode.MOD_CONF_NOT_FOUND.msg);
    return;
  }

  //清空历史模组
  modList = [];
  modList.push(...modAR.data);

  //模组定义
  for (let mod of modList) {
    const modDef = AllModDef[mod.mod as keyof typeof AllModDef] as DefineComponent<{}, {}, any>;
    if (!modDef) continue;
    mod.def = modDef;
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
    case Sys.SYS_EVENT_LOAD_MODE:
      loadMode(e.data.url);
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
  loadMode(localStorage.getItem(Sys.SYS_MOD_CONF_PATH) ?? '/mode/ya.json');
});
</script>

<style scoped>

</style>
