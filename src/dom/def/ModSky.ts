import AppMod from "@/view/mod/AppMod.vue";
import GroupMod from "@/view/mod/GroupMod.vue";
import SearchMod from "@/view/mod/SearchMod.vue";
import ModeMod from "@/view/mod/ModeMod.vue";
import {AppModConf} from "@/dom/def/mod/AppModConf";
import {GroupModConf} from "@/dom/def/mod/GroupModConf";
import {SearchModConf} from "@/dom/def/mod/SearchModConf";
import {ModeModConf} from "@/dom/def/mod/ModeModConf";

/**
 * 模组星空
 *
 * @description 记录所有可用模组
 * @author Siaor
 * @date 2024-12-11 08:19:02
 * */
export const AllMod = {
    def: {
        AppMod,
        GroupMod,
        SearchMod,
        ModeMod
    },
    conf: {
        AppModConf,
        GroupModConf,
        SearchModConf,
        ModeModConf
    }
}

export const SysMod = {
    ModeMod: {
        "mod": "ModeMod",
        "conf": {
            "name": "模式",
            "logo": "/img/mode/mode.svg",
            "isDrag": false
        }
    }
}
