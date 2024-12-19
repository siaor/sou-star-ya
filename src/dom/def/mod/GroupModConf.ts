import {ModConf} from "@/dom/def/ModConf";
import {Mod} from "@/dom/def/Mod";

/**
 * 分组模组配置
 *
 * @description 参考使用文档
 * @author Siaor
 * @date 2024-12-06 12:00:00
 * */
export class GroupModConf extends ModConf {
    name:string= '分组';
    logo:string= './img/app_group.svg';
    list: Mod[] = [];
}