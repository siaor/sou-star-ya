import {ModConfVim} from "@/dom/vim/ModConfVim";
import {ModConfAct} from "@/res/act/ModConfAct";
import {ActResult} from "@/dom/def/base/ActResult";
import {BaseCtr} from "@/ctr/BaseCtr";
import {Sys} from "@/dom/def/base/Sys";
import {Mod} from "@/dom/def/Mod";
import {SysMod} from "@/dom/def/ModSky";

//模块配置实例
const modConfInst: ModConfVim = new ModConfAct();

/**
 * 模块配置调控
 *
 * @author Siaor
 * @date 2024-12-09 12:00:00
 * */
export class ModCtr extends BaseCtr {
    static load(url: string): Promise<ActResult> {
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

            //数据处理
            const modIdPre: string = this.buildModIdPre(url);
            const modList: Mod[] = confAR.data;

            //附加系统默认模块
            //模式模组，未配置时自动附加
            if (!modList.some(item => item.mod === 'ModeMod')) {
                modList.push(SysMod.ModeMod);
            }

            let modIndex = 1;
            for (let mod of modList) {
                mod.id = modIdPre + modIndex;
                mod.def = undefined;
                modIndex++;
            }

            //缓存当前配置信息
            localStorage.setItem(Sys.SYS_MOD_CONF_PATH, url);
            //存到数据库
            await super.db.put(Sys.SYS_MOD_CONF_PATH, modList);

            resolve(ActResult.ok(modList));
        });
    }

    static get(modId: string): Promise<ActResult> {
        return super.db.get(modId);
    }

    static cache(mod: Mod): Promise<ActResult> {
        return super.db.put(mod.id ?? '', mod);
    }

    static add(url: string, mod: Mod): Promise<ActResult> {
        return new Promise(async (resolve) => {
            const confAR: ActResult = await super.db.get(Sys.SYS_MOD_CONF_PATH);
            if (!confAR.success) {
                resolve(confAR);
                return;
            }
            const modIdPre = this.buildModIdPre(url);
            const list = confAR.data as Mod[];
            const modIndex = list.length + 1;
            mod.id = modIdPre + modIndex;
            super.db.put(mod.id, mod);
            list.push(mod);
            resolve(super.db.put(Sys.SYS_MOD_CONF_PATH, list));
        });
    }

    static async updatePosition(modId: string, x: number, y: number) {
        const confAR = await super.db.get(modId);
        if (confAR.success) {
            const modConf: Mod = confAR.data;
            modConf.conf.x = x;
            modConf.conf.y = y;
            await super.db.put(modId, modConf);
        }
    }

    static buildModIdPre(url: string): string {
        return url.substring(url.lastIndexOf('/') + 1).split('.')[0] + '-';
    }
}