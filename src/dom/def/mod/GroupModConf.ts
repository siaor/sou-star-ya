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
    x:number = 0;
    y:number = 0;
    isDrag:boolean = true;
    name:string= '';
    logo:string= '';
    list: Mod[] = [];
}