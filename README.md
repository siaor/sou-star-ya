<br/>
<br/>
<h1 align="center">
    SouStarYa 🔍搜星鸦⭐
</h1>
<h4 align="center">
    🌏人 人 都 在 用 的 浏 览 器 首 页🏠

    🐦智慧之鸦

    ✨点亮喜爱，让每一次点击都成为珍藏！

    🏘️安得广厦千万间，大庇天下寒士俱欢颜！

    ❤️点赞鸦！⭐收藏鸦！💬评论鸦！🌟给个小星星鸦！

</h4> 


<div align="center">

[预 览](https://siaor.neocities.org) | 
[官 网](http://www.siaor.com) | 
[Q Q](https://qm.qq.com/cgi-bin/qm/qr?k=FE1-Pxzl-Ajo06_1asI4sE03C9YcUy20) | 
[微 信](https://siaor.com/system/res/logo/wechat.jpg)

[![License](https://img.shields.io/badge/License-MIT-brightgreen?style=flat-square&logo=)](https://gitee.com/siaor/sou-star-ya)
[![GitHub](https://img.shields.io/github/stars/siaor/sou-star-ya.svg?style=social)](https://github.com/siaor/sou-star-ya)
[![Gitee](https://gitee.com/siaor/sou-star-ya/badge/star.svg?theme=gvp)](https://gitee.com/siaor/sou-star-ya)
[![GitCode](https://gitcode.com/siaor/sou-star-ya/star/badge.svg)](https://gitcode.com/siaor/sou-star-ya/overview)
[![Siaor](https://img.shields.io/badge/SIAOR-Join%20us-42b883?style=flat-square&logo=homeassistantcommunitystore&logoColor=ffffff)](https://www.siaor.com)

🔍搜索有界，探索无限
⭐星海无垠，珍藏有所
🐦鸦鸣山林，智启未来

![SouStarYa](https://siaor.neocities.org/favicon.ico)

 </div>

# 1 背景
众弟子在鸮课堂学习时，经常需要进行搜索各种资料，比如各种官方网站、工具、教程、博客等，为了方便众弟子查阅，便把这些常用的资料整理到搜星鸦，方便大家学习使用。

# 2 概述
搜星鸦是一个基于浏览器的网站，简洁、轻量，用户可以在线使用，无需下载。

众弟子可以自行部署，相关教程视频请前往各个视频平台查看（[传送门](https://www.douyin.com/user/self?from_tab_name=main&modal_id=7444119428817538358&showTab=like)），目前已发布的平台如下：抖音、快手、B站、优酷、微视、小红书。


在线预览：[传送门](https://siaor.neocities.org)

![预览ya](https://siaor.neocities.org/siaor/ya.jpg)

# 3 架构

![SiaorDom](https://siaor.neocities.org/siaor/SiaorDom.png)

# 4 功能目标

## 4.1 搜索
* 聚合多个搜索引擎，方便使用

## 4.2 收藏
* 可以收藏网站
* 可以分享收藏，导入导出收藏

## 4.3 扩展功能
* 工具组件
    * 番茄时间
    * 日历
    * 时钟
    * 音乐播放器
    * 视频播放器
    * 图片浏览器

# 5 如何使用
通过鸮课堂视频学习：[传送门](https://www.douyin.com/user/self?from_tab_name=main&modal_id=7444119428817538358&showTab=like)

**前置条件**：安装NodeJS、Git、pnpm

然后按照以下步骤进行：

## 5.1 拉取项目代码
``` bash
#命令行运行以下代码
git clone https://gitee.com/siaor/sou-star-ya.git


```
## 5.2 安装项目依赖
``` bash
#命令行进入项目目录
cd D:\project\sou-star-ya

#安装项目依赖
pnpm install
```

## 5.3 启动项目
``` bash
#命令行进入项目目录
cd D:\project\sou-star-ya

#启动项目
pnpm dev
```

## 5.4 打包项目
``` bash
#命令行进入项目目录
cd D:\project\sou-star-ya

#打包项目，dist目录为打包后的静态资源，会自动生成
pnpm build
```

## 5.5 部署项目
无需服务器，免费部署方案：[【AI助力打造永恒网站】](https://www.douyin.com/user/self?from_tab_name=main&modal_id=7440414043036257574&showTab=like)
将dist目录下的文件上传即可

# 6 模组配置
打包完成后，模组配置位于~/dist/conf-ya目录中
默认配置：ya.json

## 6.1 搜索模组

* 模组名称
```
"mod": "SearchMod"
```


* 模组配置
```
"conf": {"x": 0, "y": 0, "engine": "百度"}
```



| 属性 |  含义  | 类型  | 默认值 |  说明 |
|:--:|:----:|:---:|:---:|:--:|
| x  | 横坐标  | 数字  |  0  | 单位px |
| y  | 纵坐标  | 数字  |  0  | 单位px |
| engine | 搜索引擎 | 字符串 | 百度  |    |
注：坐标原点为页面左上角，全0为使用默认


* 示例
```
[
  {
    "mod": "SearchMod",
    "conf": {"x": 0, "y": 0, "engine": "百度"}
  }
]
```

## 6.2 应用模组
* 模组名称
```
"mod": "AppMod"
```

* 模组配置
```
"conf": {
      "x": 0,
      "y": 0,
      "name": "搜星鸦",
      "url": "https://ya.siaor.com",
      "logo": "https://siaor.neocities.org/favicon.ico"
    }
```


|  属性  |  含义  | 类型  | 默认值 |  说明 |
|:----:|:----:|:---:|:---:|:--:|
|  x   | 横坐标  | 数字  |  0  | 单位px |
|  y   | 纵坐标  | 数字  |  0  | 单位px |
| name | 应用名称 | 字符串 |   |    |
| url  | 跳转链接 | 字符串 |   |    |
| logo | 应用图标 | 字符串 |   |    |
注：坐标原点为页面左上角，全0为使用默认


* 示例
```
[
  {
    "mod": "AppMod",
    "conf": {
      "x": 0,
      "y": 0,
      "name": "搜星鸦",
      "url": "https://ya.siaor.com",
      "logo": "https://siaor.neocities.org/favicon.ico"
    }
  }
]
```

## 6.3 应用分组模组
* 模组名称
```
"mod": "GroupMod"
```

* 模组配置
```
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
        }
      ]
    }
```


|  属性  |   含义   | 类型  | 默认值 |  说明 |
|:----:|:------:|:---:|:---:|:--:|
|  x   |  横坐标   | 数字  |  0  | 单位px |
|  y   |  纵坐标   | 数字  |  0  | 单位px |
| name |  分组名称  | 字符串 |   |    |
| logo |  应用图标  | 字符串 |   |    |
| list | 应用模组数组 | 数组  |   |    |
注：坐标原点为页面左上角，全0为使用默认


* 示例
```
[
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
        }
      ]
    }
  }
]
```

# 7 留言板  
欢迎众弟子提出建议，一起交流学习。