<template>
  <div class="ya-mod ya-mod-search" :id="id" :style="{top:conf.y+'px',left:conf.x+'px'}">
    <div class="ya-mod-search-bar">
      <select id="searchEngine" v-model="conf.engine">
        <option v-for="(engine, index) in engineListRef" :key="index" :value="engine">
          {{ engine }}
        </option>
      </select>
      <input type="text" id="searchInput" placeholder="   欢迎使用搜星鸦..." @keyup.enter="doSearch()"
             v-model="searchContentRef">
      <button @click="doSearch($event)">🔍搜索</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineProps, onBeforeMount, onMounted, ref} from 'vue';
import {SearchModConf} from "@/dom/def/mod/SearchModConf";
import {SysEvent} from "@/dom/def/base/SysEvent";
import {Sys} from "@/dom/def/base/Sys";

//从父组件接收的 props
const props = defineProps<{
  id: string;
  mod: string;
  conf: SearchModConf;
}>();
//系统事件
const emit = defineEmits(['sysEv']);

/**>>>>>>> 【组件自定义处理】 <<<<<<<*/
const searchEngineMap: {
  [key: string]: string;
} = {
  "百度": "https://www.baidu.com/s?wd=",
  "中国搜索": "https://www.chinaso.com/newssearch/all/allResults?q=",
  "夸克": "https://www.quark.cn/s?q=",
  "头条": "https://so.toutiao.com/search?dvpf=pc&keyword=",
  "搜狗": "https://www.sogou.com/web?query=",
  "360": "https://www.so.com/s?q=",
  "谷歌": "https://www.google.com/search?q=",
  "必应": "https://www.bing.com/search?q=",
  "即刻网盘": "https://www.jiikii.com/s?query="
};

const engineListRef = ref<string[]>(Object.keys(searchEngineMap));
const searchContentRef = ref<string>();

function doSearch(event?: MouseEvent) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const searchEngineUrl = searchEngineMap[props.conf.engine];
  if (searchEngineUrl && searchContentRef.value) {
    window.open(searchEngineUrl + encodeURIComponent(searchContentRef.value), '_blank');
  }
}

/**>>>>>>> 【组件通用处理】 <<<<<<<*/
onBeforeMount(() => {
  //默认居中
  if (props.conf.x === 0 && props.conf.y === 0) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    //按屏幕比例换算居中位置
    //props.conf.x = (w - (0.33*w + 233*(1-w/10000)))/2;
    props.conf.x = 0.34665 * w - 116.5;
    props.conf.y = 0.000442 * h * h;
  }
});

//页面加载完成后
onMounted(() => {
  init();
});

//初始化
async function init() {
  //调用系统事件：添加模组拖拽事件
  if (props.conf.isDrag) {
    emit('sysEv', new SysEvent(Sys.SYS_EVENT_ADD_DRAG, {id: props.id, x: props.conf.x, y: props.conf.y}));
  }
}
</script>

<style scoped>
.ya-mod-search {
  width: 44%;
  height: 70px;

  display: flex;
  align-items: center;
}

.ya-mod-search:hover {
  background-color: rgb(255, 255, 255, 0);
}

.ya-mod-search-bar {
  width: 98%;
  height: 77%;
  border-radius: 50px;
  background-color: rgb(255, 255, 255, 0.42);
}

.ya-mod-search-bar:hover {
  background-color: rgb(255, 255, 255, 0.28);
}

/*搜索引擎选择框*/
.ya-mod-search-bar select {
  width: 15%;
  height: 100%;
  border-radius: 50px 14px 14px 50px;
  cursor: pointer;
  background-color: rgb(0, 0, 0, 0);
  border: none;
  text-align: center;
  color: white;
}

.ya-mod-search-bar select:hover {
  background-color: rgb(0, 0, 0, 0.3);
}

.ya-mod-search-bar select option {
  color: white;
  background-color: rgb(0, 0, 0, 0.4);
}

/*搜索输入框*/
.ya-mod-search-bar input {
  width: 70%;
  height: 77%;
  line-height: 70%;
  background-color: rgb(0, 0, 0, 0);
  border: none;
  outline: none;
  padding: 0;
  color: white;
}

.ya-mod-search-bar input::placeholder {
  color: white;
}

/*搜索按钮*/
.ya-mod-search-bar button {
  width: 15%;
  height: 100%;
  border-radius: 14px 50px 50px 14px;
  cursor: pointer;
  background-color: rgb(0, 0, 0, 0.3);
  border: none;
  float: right;
  overflow: hidden;
  white-space: nowrap;
  color: white;
  padding: 0;
}

.ya-mod-search-bar button:hover {
  background-color: rgb(0, 0, 0, 0.7);
}

/* >>>>>>>【响应式样式】<<<<<<< */
/* 小屏幕：手机 */
@media (max-width: 768px) {
  .ya-mod-search {
    width: 86%;
  }

  .ya-mod-search-bar select {
    width: 18%;
  }

  .ya-mod-search-bar input {
    width: 64%;
  }

  .ya-mod-search-bar button {
    width: 18%;
  }
}


/* 中屏幕：平板 */
@media (min-width: 769px) and (max-width: 992px) {
  .ya-mod-search {
    width: 72%;
  }
}


/* 中屏幕：笔记本 */
@media (min-width: 993px) and (max-width: 1399px) {
  .ya-mod-search {
    width: 58%;
  }

}

</style>