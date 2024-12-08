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
import {DefineComponent, onMounted, reactive, ref} from "vue";
import StarBg from '@/view/bg/StarBg.vue'
import {Mod, AllMod} from "@/dom/def/Mod";
import {ModConf} from "@/dom/def/ModConf";
import {addMoveEvDelay} from "@/res/util/DragUtil";

//用户组件配置列表
const modConfList: ModConf[] = [
  {
    "mod": "SearchMod",
    "conf": {"x": 0, "y": 0, "engine": "百度"}
  },
  {
    "mod": "GroupMod",
    "conf": {
      "x": 128,
      "y": 28,
      "name": "AI工具",
      "logo": "/img/ai_logo.svg",
      "list": [
        {
          "mod": "AppMod",
          "conf": {
            "x": 0,
            "y": 0,
            "name": "通义千问",
            "url": "https://tongyi.aliyun.com",
            "logo": "https://img.alicdn.com/imgextra/i1/O1CN01asLYeX1WhbsyEZn5u_!!6000000002820-55-tps-56-56.svg"
          }
        },
        {
          "mod": "AppMod",
          "conf": {
            "x": 0,
            "y": 0,
            "name": "可灵AI",
            "url": "https://kling.kuaishou.com",
            "logo": "https://s2-111386.kwimgs.com/bs2/mmu-aiplatform-temp/kling/images/kling-icon.png"
          }
        },
        {
          "mod": "AppMod",
          "conf": {
            "x": 0,
            "y": 0,
            "name": "智谱清言",
            "url": "https://chatglm.cn",
            "logo": "https://chatglm.cn/favicon.ico"
          }
        },
        {
          "mod": "AppMod",
          "conf": {
            "x": 0,
            "y": 0,
            "name": "文心一言",
            "url": "https://yiyan.baidu.com",
            "logo": "https://ebui-cdn.cdn.bcebos.com/yiyan-logo.png"
          }
        },
        {
          "mod": "AppMod",
          "conf": {
            "x": 0,
            "y": 0,
            "name": "及梦AI",
            "url": "https://jimeng.jianying.com",
            "logo": "https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/public/favicon.ico"
          }
        },
        {
          "mod": "AppMod",
          "conf": {
            "x": 0,
            "y": 0,
            "name": "海螺AI",
            "url": "https://hailuoai.com/",
            "logo": "https://hailuoai.com/favicon.ico"
          }
        },
      ]
    }
  },
  {
    "mod": "GroupMod",
    "conf": {
      "x": 28,
      "y": 28,
      "name": "我的收藏",
      "logo": "/img/app_group.svg",
      "list":[
        {
          "mod": "AppMod",
          "conf": {
            "x": 0,
            "y": 0,
            "name": "青书",
            "url": "https://qingbook.siaor.com",
            "logo": "https://siaor.neocities.org/qingbook/favicon.svg"
          }
        },
      ]
    }
  },
  {
    "mod": "AppMod",
    "conf": {
      "x": 600,
      "y": 500,
      "name": "青书",
      "url": "https://qingbook.siaor.com",
      "logo": "https://siaor.neocities.org/qingbook/favicon.svg"
    }
  },
  {
    "mod": "AppMod",
    "conf": {
      "x": 700,
      "y": 500,
      "name": "搜星鸦",
      "url": "https://qingbook.siaor.com",
      "logo": "https://siaor.neocities.org/logo.svg"
    }
  },
  {
    "mod": "AppMod",
    "conf": {
      "x": 800,
      "y": 500,
      "name": "NodeJS",
      "url": "https://nodejs.org",
      "logo": "https://nodejs.org/favicon.ico"
    }
  },
  {
    "mod": "AppMod",
    "conf": {
      "x": 900,
      "y": 500,
      "name": "VSCode",
      "url": "https://code.visualstudio.com",
      "logo": "https://code.visualstudio.com/favicon.ico"
    }
  },
  {
    "mod": "AppMod",
    "conf": {
      "x": 1000,
      "y": 500,
      "name": "Neocities",
      "url": "https://neocities.org",
      "logo": "https://neocities.org/favicon.ico"
    }
  },
  {
    "mod": "AppMod",
    "conf": {
      "x": 1100,
      "y": 500,
      "name": "Git",
      "url": "https://git-scm.com",
      "logo": "https://git-scm.com/favicon.ico"
    }
  },
  {
    "mod": "AppMod",
    "conf": {
      "x": 1200,
      "y": 500,
      "name": "OpenJDK",
      "url": "https://openjdk.org",
      "logo": "https://openjdk.org/images/nanoduke.ico"
    }
  },
];

//组件列表
const modList = reactive<Mod[]>([]);

//加载组件
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
onMounted(() => {
  /*根据用户配置加载组件*/
  let modId = 1;
  for (let modConf of modConfList) {
    modConf.id = 'mod-' + modId;
    loadMod(modConf);
    addMoveEvDelay(modConf.id, modConf.conf.x, modConf.conf.y);
    modId++;
  }
});
</script>

<style scoped>

</style>
