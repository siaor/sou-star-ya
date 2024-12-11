import {ModConfVim} from "@/dom/vim/ModConfVim";
import {ActResult} from "@/dom/def/base/ActResult";
import {HttpUtil} from "@/res/util/HttpUtil";

/**
 * 模组配置定义实现
 *
 * @author Siaor
 * @date 2024-12-06 12:00:00
 * */
export class ModConfAct implements ModConfVim{
    get(path: string): Promise<ActResult>{
        return HttpUtil.get(path, {cache: "reload"});
    }
}