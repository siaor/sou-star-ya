import {ActResult} from "@/dom/def/base/ActResult";
import {BaseCtr} from "@/ctr/BaseCtr";
import {Sys} from "@/dom/def/base/Sys";
import {ModeAct} from "@/res/act/ModeAct";
import {ModeVim} from "@/dom/vim/ModeVim";

//模块配置实例
const modeInst: ModeVim = new ModeAct();

/**
 * 模式配置调控
 *
 * @author Siaor
 * @date 2024-12-15 08:41:30
 * */
export class ModeCtr extends BaseCtr {
    static list(): Promise<ActResult> {
        return new Promise(async (resolve) => {
            //从缓存获取模式列表
            const cacheListAR = await super.db.get(Sys.SYS_MODE);
            if (cacheListAR.success) {
                resolve(cacheListAR);
                return;
            }

            //从系统配置获取模式列表
            const listAR = await modeInst.get();
            if (!listAR.success) {
                resolve(listAR);
                return;
            }

            //缓存
            await super.db.put(Sys.SYS_MODE, listAR.data);

            resolve(listAR);
        });
    }
}