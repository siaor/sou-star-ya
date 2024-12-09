import {ModConfVim} from "@/dom/vim/ModConfVim";
import {ActResult} from "@/dom/def/base/ActResult";
import {HttpUtil} from "@/res/util/HttpUtil";

export class ModConfAct implements ModConfVim{
    get(path: string): Promise<ActResult>{
        return HttpUtil.get(path, {cache: "reload"});
    }
}