<template>
  <div id="bg" ref="container" class="wave start-bg">
    <div class="star" ref="starsRef" />
    <div class="meteor" ref="meteorRef" v-for="(item, index) in meteors" :key="index" />
  </div>

  <div class="container">
    <div class="search-bar">
      <select id="searchEngine">
        <option value="https://www.baidu.com/s?wd=">百度</option>
        <option value="https://www.google.com/search?q=">谷歌</option>
        <option value="https://www.bing.com/search?q=">必应</option>
        <option value="https://duckduckgo.com/?q=">鸭鸭Go</option>
      </select>
      <input type="text" id="searchInput" placeholder="搜索...">
      <button @click="doSearch">搜索</button>
    </div>
  </div>

  <div class="container favorites">
    <div class="favorite-item">
      <a href="https://www.siaor.com" target="_blank">
        <img src="https://siaor.neocities.org//logo.svg" alt="鸮尔·SIAOR">
      </a>
      <a href="https://www.siaor.com" target="_blank"><span>鸮尔·SIAOR</span></a>
    </div>
    <div class="favorite-item">
      <a href="https://nodejs.org/" target="_blank">
        <img src="https://nodejs.org/favicon.ico" alt="NodeJS">
      </a>
      <a href="https://nodejs.org/" target="_blank">
        <span>NodeJS</span>
      </a>
    </div>
    <div class="favorite-item">
      <a href="https://www.github.com" target="_blank">
        <img src="https://github.com/favicon.ico" alt="GitHub">
      </a>
      <a href="https://www.github.com" target="_blank">
        <span>GitHub</span>
      </a>
    </div>
    <!-- 可以继续添加更多收藏项 -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";



/** 背景*/
const starts = 333; // 页面中全体星星个数
const starsRef = ref<HTMLDivElement | null>(null);

//流星个数
const meteors = 7;
//流星元素数组
const meteorRef = ref<HTMLDivElement[]>([]);

//随机流星划过
const start = () => {
  meteorRef.value.forEach((item: HTMLDivElement) => {
    let v = Math.floor(Math.random() * 90);
    let h = Math.floor(Math.random() * 250 + 50);
    let time = Math.floor(Math.random() * 7 + 2);
    item.style.top = `${h}px`;
    item.style.left = `${v}%`;
    item.style.animation = `meteorAnim ${time}s linear  infinite`;
  });
};

onMounted(() => {
  if (starsRef.value) {
    let shadow = "";
    for (let i = 0; i < starts; i++) {
      let x = Math.floor(Math.random() * window.innerWidth);
      let y = Math.floor(Math.random() * window.innerHeight);
      //x 偏移量 | y 偏移量 | 阴影模糊半径 | 阴影扩散半径 | 阴影颜色
      shadow = `${x}px ${y}px 0.4px 0.4px rgba(255, 255, 255, 1), ${shadow}`;
    }
    shadow = shadow.substring(0, shadow.length - 2);
    starsRef.value.style.boxShadow = shadow;
  }
  //流星
  setInterval(start, 1500);
});

function doSearch() {
  const query = document.getElementById('searchInput').value;
  const searchEngine = document.getElementById('searchEngine').value;
  if (query) {
    window.open(searchEngine + encodeURIComponent(query), '_blank');
  }
}
</script>

<style scoped>
/* 重置默认样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f9f9f9;
}

body {
  padding: 20px;
}

/* 常用元素样式 */
h1, h2, h3, h4, h5, h6 {
  margin-bottom: 10px;
}

p {
  margin-bottom: 15px;
}

a {
  color: #007BFF;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* 容器样式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: rgb(0,0,0,0.3);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 50px;
  margin-bottom: 20px;
}

.title-container h1 {
  animation: fadeInDown 1s ease-in-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 搜索框和按钮样式 */
.container .search-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}


.container input {
  /*width: calc(100% - 260px);*/
  width: 700px;
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  background-color: rgb(0,0,0,0.3);
  border-radius: 4px;
  transition: border-color 0.3s;
  color: rgb(255,255,255,1);
}

.container input[type="text"]:focus {
  border-color: #007BFF;
  outline: none;
}

.container select {
  width: 70px;
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
  color: rgb(255,255,255,0.7);
  background-color: rgb(0,0,0,0.3);
  cursor: pointer;
}

.container select:focus {
  border-color: #007BFF;
  outline: none;
}

.container button {
  min-width: 100px;
  padding: 10px 20px;
  border: none;
  background-color: rgba(116, 115, 115, 0.7);
  color: rgb(255,255,255,0.7);
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.container button:hover {
  background-color: rgba(116, 115, 115, 0.3);
}

/* 收藏区域样式 */
.favorites {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center; /* 居中对齐收藏项 */
}

.favorite-item {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.favorite-item:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

.favorite-item img {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  margin-bottom: 5px; /* 在图标和文字之间增加间距 */
}

.favorite-item a {
  display: block;
  margin-top: 5px;
  font-size: 14px;
  color: #333;
}

.favorite-item a:hover {
  color: #007BFF;
}

* {
  margin: 0;
  padding: 0;
}

html,
body {
  width: 100%;
  height: 100%;
}

body {
  background: linear-gradient(to bottom, #000 0%, #5788fe 100%);

}

:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}

.translation {
  ::v-deep(.el-dropdown-menu__item) {
    padding: 5px 40px;
  }

  .check-zh {
    position: absolute;
    left: 20px;
  }

  .check-en {
    position: absolute;
    left: 20px;
  }
}
</style>
<style>
.wave {
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  bottom: 0;
  z-index: -1;
}
.start-bg{
  background-image: radial-gradient(ellipse at top , #050b12 0%,  #181b25 100%);
}

.star {
  width: 1px;
  height: 1px;
  background: transparent;
}

.meteor {
  position: absolute;
  width: 300px;
  height: 1px;
  top: 200%;
  transform: rotate(-45deg);
  background-image: linear-gradient(to right, #fff, rgba(255, 255, 255, 0));
}

.meteor::before {
  content: "";
  position: absolute;
  width: 4px;
  height: 5px;
  border-radius: 50%;
  margin-top: -2px;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 15px 3px #fff;
}

@keyframes meteorAnim {
  0% {
    opacity: 1;
    margin-top: -300px;
    margin-right: -300px;
  }

  12% {
    opacity: 0;
  }

  15% {
    margin-top: 300px;
    margin-left: -600px;
    opacity: 0;
  }

  100% {
    opacity: 0;
  }
}
</style>