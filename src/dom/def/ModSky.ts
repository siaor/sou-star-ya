import AppMod from "@/view/mod/AppMod.vue";
import GroupMod from "@/view/mod/GroupMod.vue";
import SearchMod from "@/view/mod/SearchMod.vue";
import ThemeMod from "@/view/mod/ThemeMod.vue";

/**
 * 模组星空
 *
 * @description 记录所有可用模组
 * @author Siaor
 * @date 2024-12-11 08:19:02
 * */
export const AllMod = {
    AppMod,
    GroupMod,
    SearchMod,
    ThemeMod
}

export const SysMod = {
    ThemeMod: {
        "mod": "ThemeMod",
        "conf": {
            "x": 0,
            "y": 0,
            "name": "主题",
            "logo": "/img/theme.svg",
            "list": [
                {
                    "name": "主题Ya",
                    "logo": "/img/star.svg",
                    "url": "/conf-ya/ya.json"
                },
                {
                    "name": "游戏",
                    "url": "/conf-ya/game.json",
                    "logo": "/img/game.svg"
                },
                {
                    "name": "学习",
                    "url": "/conf-ya/study.json",
                    "logo": "/img/study.svg"
                }
            ]
        }
    }
}