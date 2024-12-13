import AppMod from "@/view/mod/AppMod.vue";
import GroupMod from "@/view/mod/GroupMod.vue";
import SearchMod from "@/view/mod/SearchMod.vue";
import ModeMod from "@/view/mod/ModeMod.vue";

/**
 * 模组星空
 *
 * @description 记录所有可用模组
 * @author Siaor
 * @date 2024-12-11 08:19:02
 * */
export const AllModDef = {
    AppMod,
    GroupMod,
    SearchMod,
    ModeMod
}

export const SysMod = {
    ModeMod: {
        "mod": "ModeMod",
        "conf": {
            "name": "主题",
            "logo": "/img/theme.svg",
            "list": [
                {
                    "name": "主题Ya",
                    "logo": "/img/star.svg",
                    "url": "/mode/ya.json"
                },
                {
                    "name": "游戏",
                    "logo": "/img/game.svg",
                    "url": "/mode/game.json"
                },
                {
                    "name": "学习",
                    "logo": "/img/study.svg",
                    "url": "/mode/study.json"
                }
            ]
        }
    }
}
