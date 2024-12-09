import {ModConfVim} from "@/dom/vim/ModConfVim";
import {ModConfAct} from "@/res/act/ModConfAct";
import {ActResult} from "@/dom/def/base/ActResult";

//模块配置实例
const modConfInst: ModConfVim = new ModConfAct();

/**
 * 模块配置调控
 *
 * @author Siaor
 * */
export class ModConfCtr {

    static get(url: string): Promise<ActResult> {
        //todo:从数据库获取
        return modConfInst.get(url);
    }
}