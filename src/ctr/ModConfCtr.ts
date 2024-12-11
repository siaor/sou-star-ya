import {ModConfVim} from "@/dom/vim/ModConfVim";
import {ModConfAct} from "@/res/act/ModConfAct";
import {ActResult} from "@/dom/def/base/ActResult";
import {BaseCtr} from "@/ctr/BaseCtr";
import {Sys} from "@/dom/def/base/Sys";

//模块配置实例
const modConfInst: ModConfVim = new ModConfAct();

/**
 * 模块配置调控
 *
 * @author Siaor
 * @date 2024-12-09 12:00:00
 * */
export class ModConfCtr extends BaseCtr {
    static get(url: string): Promise<ActResult> {
        return new Promise(async (resolve) => {
            const confPath = localStorage.getItem(Sys.SYS_MOD_CONF_PATH);
            //和缓存一致时，从数据库获取模组配置
            if (confPath && confPath === url) {
                resolve(super.db.get(Sys.SYS_MOD_CONF_PATH));
                return;
            }
            //从链接获取模组配置
            const confAR = await modConfInst.get(url);
            if (!confAR.success) {
                resolve(confAR);
                return;
            }

            //缓存当前配置信息
            localStorage.setItem(Sys.SYS_MOD_CONF_PATH,url);
            //存到数据库
            await super.db.put(Sys.SYS_MOD_CONF_PATH, confAR.data);

            resolve(confAR);
        });
    }
}