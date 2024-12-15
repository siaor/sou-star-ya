<template>
  <div class="star" ref="starsRef"/>
  <div class="meteor" ref="meteorRef" v-for="(item, index) in meteors" :key="index"/>
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";

/** 背景*/
/*【随机星星】*/
//星星个数
const starts = 333;
//星空
const starsRef = ref<HTMLDivElement | null>(null);
//渲染星星
function loadStar(){
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
}

/*【随机流星】*/
//流星个数
const meteors = 7;
//流星元素数组
const meteorRef = ref<HTMLDivElement[]>([]);
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

//页面加载完毕
onMounted(() => {
  //渲染星星
  loadStar();
  //渲染流星
  setInterval(start, 1500);

  //窗口变化重新渲染星星
  window.addEventListener('resize', function (){
    loadStar();
  });
});
</script>

<style scoped>
/* 星星 */
.star {
  width: 1px;
  height: 1px;
  background: transparent;
}

/* 流星 */
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
</style>
<style>
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