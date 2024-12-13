<template>
  <div class="ya-mod ya-mod-search" :id="id">
    <div class="ya-mod-search-bar">
      <select id="searchEngine">
        <option value="https://www.baidu.com/s?wd=">百度</option>
        <option value="https://www.sogou.com/web?query=">搜狗</option>
        <option value="https://www.google.com/search?q=">谷歌</option>
        <option value="https://www.bing.com/search?q=">必应</option>
        <option value="https://duckduckgo.com/?q=">鸭鸭Go</option>
      </select>
      <input type="text" id="searchInput" placeholder="   欢迎使用搜星鸦...">
      <button @click="doSearch">🔍搜索</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineProps, onMounted, ref} from 'vue';
import {SearchModConf} from "@/dom/def/mod/SearchModConf";
import {ModCtr} from "@/ctr/ModCtr";
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
//模组配置
const modConf = ref<SearchModConf>(new SearchModConf());

/*>>>>>>> 【组件自定义处理】 <<<<<<<*/
function doSearch() {
  const queryDom = document.getElementById('searchInput') as HTMLInputElement;
  const searchEngineDom = document.getElementById('searchEngine') as HTMLInputElement;
  const query = queryDom.value;
  const searchEngine = searchEngineDom.value;
  if (query) {
    window.open(searchEngine + encodeURIComponent(query), '_blank');
  }
}

/*>>>>>>> 【组件通用处理】 <<<<<<<*/
//页面加载完成后
onMounted(() => {
  init();
});

//初始化
async function init() {
  //从缓存获取配置
  const modAR = await ModCtr.get(props.id);
  if (modAR.success) {
    //有缓存：转化配置
    Object.assign(modConf.value, modAR.data.conf);
  } else {
    //无缓存：从参数获取配置，并缓存数据
    Object.assign(modConf.value, props.conf);

    //调用系统事件：缓存模组信息
    const sysEvCacheMod: SysEvent = new SysEvent(Sys.SYS_EVENT_CACHE_MOD, {
      id: props.id,
      mod: props.mod,
      conf: JSON.parse(JSON.stringify(modConf.value))
    });
    emit('sysEv', sysEvCacheMod);
  }

  if (modConf.value.isDrag) {
    //调用系统事件：添加模组拖拽事件
    const sysEvAddDrag: SysEvent = new SysEvent(Sys.SYS_EVENT_ADD_DRAG, {
      id: props.id,
      x: modConf.value.x,
      y: modConf.value.y
    });
    emit('sysEv', sysEvAddDrag);
  }
}
</script>

<style scoped>
.ya-mod-search {
  width: 44%;
  height: 70px;
  top: 42%;
  left: 28%;

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
  background-color: rgb(255, 255, 255, 0.1);
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
  background-color: rgb(0, 0, 0, 0.7);
}

.ya-mod-search-bar select option {
  background-color: rgb(0, 0, 0, 0.7);
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
    top: 35%;
    left: 7%;
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
    top: 35%;
    left: 14%;
  }
}


/* 中屏幕：笔记本 */
@media (min-width: 993px) and (max-width: 1399px) {
  .ya-mod-search {
    width: 58%;
    top: 35%;
    left: 21%;
  }

}

</style>