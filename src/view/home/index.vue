<template>
  <div class="ya-desktop">
    <template v-for="(mod, index) in modList" :key="index">
      <component :id="mod.id" :is="mod.type" v-bind="mod.props" @sysEv="sysEv"/>
    </template>
  </div>

  <StarBg></StarBg>
</template>

<script setup lang="ts">
import './index.css'
import {DefineComponent, onMounted, reactive} from "vue";
import StarBg from '@/view/bg/StarBg.vue'
import {Mod} from "@/dom/def/Mod";
import {ModConf} from "@/dom/def/ModConf";
import {AllMod, SysMod} from "@/dom/def/ModSky";
import {addMoveEvDelay} from "@/res/util/DragUtil";
import {ModConfCtr} from "@/ctr/ModConfCtr";
import {ActCode} from "@/dom/def/base/ActCode";
import {SysEvent} from "@/dom/def/base/SysEvent";
import {Sys} from "@/dom/def/base/Sys";
import {ActResult} from "@/dom/def/base/ActResult";

//模组配置列表
const modConfList: ModConf[] = [];

//模组列表
const modList = reactive<Mod[]>([]);

//添加模组到页面
function addMod(modConf: ModConf) {
  const componentType = AllMod[modConf.mod as keyof typeof AllMod] as DefineComponent<{}, {}, any>;
  if (componentType) {
    // 这里可以根据需要设置组件的属性
    const props: Record<string, any> = modConf;
    modList.push({id: modConf.id, type: componentType, props});
  } else {
    console.error(`Component with name "${modConf.mod}" not found.`);
  }
}

//重新加载模组
async function reLoadMod(url: string) {
  const modConfAR = await ModConfCtr.load(url);
  if (modConfAR.success) {
    modList.length = 0;
    modConfList.length = 0;
    modConfList.push(...modConfAR.data);

    //附加系统默认模块
    if (!modConfList.some(item => item.mod === 'ThemeMod')) {
      modConfList.push(SysMod.ThemeMod);
      await ModConfCtr.add(url,SysMod.ThemeMod);
    }

    //渲染模组
    let modId:string;
    let mcAR:ActResult;
    let mc:ModConf;
    for (let modConf of modConfList) {
      modId = modConf.id ?? '';
      mcAR = await ModConfCtr.get(modId);
      if(!mcAR.success) continue;

      mc = mcAR.data;
      addMod(mc);
      addMoveEvDelay(modId, mc.conf.x, mc.conf.y);
    }

  } else {
    alert(ActCode.MOD_CONF_NOT_FOUND.msg);
  }
}

/**
 * 公开的系统事件
 *
 * @author Siaor
 * @date 2024-12-10 04:37:12
 * */
function sysEv(e: SysEvent) {
  switch (e.name) {
    case Sys.SYS_EVENT_RELOAD_MOD:
      reLoadMod(e.data.url);
      break;
    default:
      break;
  }
}

//页面加载完成后
onMounted(() => {
  let confYa = localStorage.getItem(Sys.SYS_MOD_CONF_PATH);
  if (!confYa) {
    confYa = '/conf-ya/ya.json';
  }
  reLoadMod(confYa);
});
</script>

<style scoped>

</style>
