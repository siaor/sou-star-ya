<template>
  <div class="ya-desktop">
    <template v-for="(mod, index) in modList" :key="index">
      <component :id="mod.id" :is="mod.type" v-bind="mod.props"/>
    </template>
  </div>

  <StarBg></StarBg>
</template>

<script setup lang="ts">
import './index.css'
import {DefineComponent, onMounted, reactive} from "vue";
import StarBg from '@/view/bg/StarBg.vue'
import {Mod, AllMod} from "@/dom/def/Mod";
import {ModConf} from "@/dom/def/ModConf";
import {addMoveEvDelay} from "@/res/util/DragUtil";
import {ModConfCtr} from "@/ctr/ModConfCtr";
import {ActCode} from "@/dom/def/base/ActCode";

//模组配置列表
const modConfList: ModConf[] = [];

//模组列表
const modList = reactive<Mod[]>([]);

//加载模组配置
function loadModConf(){
  let modId = 1;
  for (let modConf of modConfList) {
    modConf.id = 'mod-' + modId;
    loadMod(modConf);
    addMoveEvDelay(modConf.id, modConf.conf.x, modConf.conf.y);
    modId++;
  }
}

//加载模组
function loadMod(modConf: ModConf) {
  const componentType = AllMod[modConf.mod as keyof typeof AllMod] as DefineComponent<{}, {}, any>;
  if (componentType) {
    // 这里可以根据需要设置组件的属性
    const props: Record<string, any> = modConf;
    modList.push({id: modConf.id, type: componentType, props});
  } else {
    console.error(`Component with name "${modConf.mod}" not found.`);
  }
}

//页面加载完成后
onMounted(async () => {
  //todo:自由切换配置
  //获取模组配置
  const modConfAR = await ModConfCtr.get('/conf-ya/ya.json');
  if (modConfAR.success) {
    modConfList.push(...modConfAR.data);
    loadModConf();
  }else {
    alert(ActCode.MOD_CONF_NOT_FOUND.msg);
  }
});
</script>

<style scoped>

</style>
