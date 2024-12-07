<template>
  <div class="ya-desktop">
    <template v-for="(mod, index) in modList" :key="index">
      <component :modIdx="index" :is="mod.type" v-bind="mod.props"/>
    </template>
  </div>

  <StarBg></StarBg>
</template>

<script setup lang="ts">
import './index.css'
import {onMounted, reactive} from "vue";
import StarBg from '@/view/bg/StarBg.vue'
import {Mod, AllMod} from "@/dom/def/Mod";
import {ModConf} from "@/dom/def/ModConf";

//用户组件配置列表
const modConfList: ModConf[] = [
  {
    "mod": "SearchMod",
    "conf": {"x": 600, "y": 400,"engine": "百度"}
  },
  {
    "mod": "AppMod",
    "conf": {"x": 600, "y": 500,"name": "青书", "url": "https://qingbook.siaor.com", "logo": "https://siaor.neocities.org/qingbook/favicon.svg"}
  },
  {
    "mod": "AppMod",
    "conf": {"x": 700, "y": 500,"name": "搜星鸦", "url": "https://qingbook.siaor.com", "logo": "https://siaor.neocities.org/logo.svg"}
  },
  {
    "mod": "AppMod",
    "conf": {"x": 800, "y": 500,"name": "NodeJS", "url": "https://nodejs.org", "logo": "https://nodejs.org/favicon.ico"}
  },
  {
    "mod": "AppMod",
    "conf": {"x": 900, "y": 500,"name": "VSCode", "url": "https://code.visualstudio.com", "logo": "https://code.visualstudio.com/favicon.ico"}
  },
  {
    "mod": "AppMod",
    "conf": {"x": 1000, "y": 500,"name": "Neocities", "url": "https://neocities.org", "logo": "https://neocities.org/favicon.ico"}
  },
  {
    "mod": "AppMod",
    "conf": {"x": 1100, "y": 500,"name": "Git", "url": "https://git-scm.com", "logo": "https://git-scm.com/favicon.ico"}
  },
  {
    "mod": "AppMod",
    "conf": {"x": 1200, "y": 500,"name": "OpenJDK", "url": "https://openjdk.org", "logo": "https://openjdk.org/images/nanoduke.ico"}
  },
];

//组件列表
const modList = reactive<Mod[]>([]);

//加载组件
function loadMod(modConf:ModConf) {
  const componentType = AllMod[modConf.mod as keyof typeof AllMod];
  if (componentType) {
    // 这里可以根据需要设置组件的属性
    const props: Record<string, any> = modConf;
    modList.push({type: componentType, props});
  } else {
    console.error(`Component with name "${modConf.mod}" not found.`);
  }
}

//移除组件
function unloadMod(index: number) {
  modList.splice(index, 1);
}

//页面加载完成后
onMounted(() => {
  /*根据用户配置加载组件*/
  for (let modConf of modConfList) {
    loadMod(modConf);
  }
});


</script>

<style scoped>

</style>
