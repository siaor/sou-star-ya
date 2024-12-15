import {ModeVim} from "@/dom/vim/ModeVim";
import {ActResult} from "@/dom/def/base/ActResult";
import {HttpUtil} from "@/res/util/HttpUtil";
import {Sys} from "@/dom/def/base/Sys";

/**
 * 模组定义实现
 *
 * @description
 * @author Siaor
 * @date 2024-12-15 08:51:53
 * */
export class ModeAct implements ModeVim {
    get(): Promise<ActResult> {
        return HttpUtil.get(Sys.SYS_MODE_PATH, {cache: "reload"});
    }
}