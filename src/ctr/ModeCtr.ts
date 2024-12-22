import {ActResult} from "@/dom/def/base/ActResult";
import {BaseCtr} from "@/ctr/BaseCtr";
import {Sys} from "@/dom/def/base/Sys";
import {ModeAct} from "@/res/act/ModeAct";
import {ModeVim} from "@/dom/vim/ModeVim";
import {ModConfVim} from "@/dom/vim/ModConfVim";
import {ModConfAct} from "@/res/act/ModConfAct";
import {Mode} from "@/dom/def/Mode";
import {SysMod} from "@/dom/def/ModSky";

//模块实例
const modeInst: ModeVim = new ModeAct();
//模块配置实例
const modConfInst: ModConfVim = new ModConfAct();

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
            const cacheListAR = await super.db.get(Sys.SYS_MODE_LIST);
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
            await super.db.put(Sys.SYS_MODE_LIST, listAR.data);

            resolve(listAR);
        });
    }

    static exportMode(url: string): Promise<ActResult> {
        return new Promise(async (resolve) => {
            const modeName: string = super.buildModeName(url);
            const modeKey = super.buildModeKey(modeName);

            //从缓存获取
            const modListAR = await super.db.get(modeKey);
            if (modListAR.success) {
                const modIdList: string[] = modListAR.data;
                const modList = [];
                let modAR;
                for (let modId of modIdList) {
                    modAR = await super.db.get(modId);

                    if (!modAR.success) continue;

                    modList.push(modAR.data);
                }
                resolve(ActResult.ok(modList));
                return;
            }

            resolve(await modConfInst.get(url));
        });
    }

    static clear(): Promise<ActResult> {
        return super.db.delete(Sys.SYS_MODE_LIST);
    }

    static saveList(list: Mode[]): Promise<ActResult> {
        return super.db.put(Sys.SYS_MODE_LIST, JSON.parse(JSON.stringify(list)));
    }

    static createMode(modeName: string, list: Mode[]): Promise<ActResult> {
        return new Promise(async (resolve) => {
            //创建默认模组列表
            const modIdList = [`${modeName}-1`, `${modeName}-2`];
            await super.db.put(this.buildModeKey(modeName), modIdList);
            await super.db.put(`${modeName}-1`, SysMod.ModeMod);
            await super.db.put(`${modeName}-2`, SysMod.SearchMod);
            //更新列表信息
            await super.db.put(Sys.SYS_MODE_LIST, JSON.parse(JSON.stringify(list)));

            resolve(ActResult.ok());
        });
    }
}