import {ModConfVim} from "@/dom/vim/ModConfVim";
import {ModConfAct} from "@/res/act/ModConfAct";
import {ActResult} from "@/dom/def/base/ActResult";
import {BaseCtr} from "@/ctr/BaseCtr";
import {Sys} from "@/dom/def/base/Sys";
import {Mod} from "@/dom/def/Mod";
import {AllMod, SysMod} from "@/dom/def/ModSky";
import {ModConf} from "@/dom/def/ModConf";
import {Mode} from "@/dom/def/Mode";

//模块配置实例
const modConfInst: ModConfVim = new ModConfAct();

/**
 * 模块配置调控
 *
 * @author Siaor
 * @date 2024-12-09 12:00:00
 * */
export class ModCtr extends BaseCtr {

    static list(mode: Mode): Promise<ActResult> {
        return new Promise(async (resolve) => {
            //模式名称
            const modeId: string = mode.id;
            const modeKey = super.buildModeKey(modeId);

            //从缓存获取
            const modeUrl = localStorage.getItem(modeKey);
            if (modeUrl) {
                localStorage.setItem(Sys.SYS_MODE, modeId);
                resolve(super.db.get(modeKey));
                return;
            }

            //从链接获取模组配置
            const confAR = await modConfInst.get(mode.url);
            if (!confAR.success) {
                resolve(confAR);
                return;
            }

            //数据处理
            const modList: Mod[] = confAR.data;
            const modIdList: string[] = [];

            //附加系统默认模块
            //模式模组，未配置时自动附加
            if (!modList.some(item => item.mod === 'ModeMod')) {
                modList.push(SysMod.ModeMod);
            }

            let modIndex = 1;
            let modId;
            for (let mod of modList) {
                modId = modeId + '-' + modIndex;

                mod.id = modId;
                mod.conf = JSON.parse(JSON.stringify(this.buildModConf(mod)));

                //缓存
                await super.db.put(mod.id, mod);

                modIdList.push(modId);

                modIndex++;
            }

            //缓存当前配置信息
            localStorage.setItem(Sys.SYS_MODE, modeId);
            localStorage.setItem(modeKey, modeId);
            //存到数据库
            await super.db.put(modeKey, modIdList);

            resolve(ActResult.ok(modIdList));
        });
    }

    static get(modId: string): Promise<ActResult> {
        return super.db.get(modId);
    }

    static cache(mod: Mod): Promise<ActResult> {
        return super.db.put(mod.id ?? '', mod);
    }

    static add(modeId: string, mod: Mod): Promise<ActResult> {
        return new Promise(async (resolve) => {
            //模式名称
            const modeKey = super.buildModeKey(modeId);

            //模组列表
            const modListAR: ActResult = await super.db.get(modeKey);
            if (!modListAR.success) {
                resolve(modListAR)
                return;
            }

            const modList: string[] = modListAR.data;

            const modId = `${modeId}-${modList.length + 1}`;
            modList.push(modId);

            mod.id = modId;

            //将模组信息添加到数据库
            await super.db.put(modeKey, modList);
            await super.db.put(modId, JSON.parse(JSON.stringify(mod)));
            resolve(ActResult.ok());
        });
    }

    static getGroupModIdList(groupKey: string): Promise<ActResult> {
        return super.db.get(groupKey);
    }

    static groupAddModList(groupKey: string, modList: string[]): Promise<ActResult> {
        return super.db.put(groupKey, modList);
    }

    static update(mod: Mod): Promise<ActResult> {
        return super.db.put(mod.id ?? '', JSON.parse(JSON.stringify(mod)));
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

    static delete(modId: string): Promise<ActResult> {
        return super.db.delete(modId);
    }

    static buildModConf(mod: Mod): ModConf {
        const clazz = AllMod.conf[(mod.mod + 'Conf') as keyof typeof AllMod.conf];
        const modConf: ModConf = new clazz();
        Object.assign(modConf, mod.conf);
        return modConf;
    }
}