import {ModConf} from "@/dom/def/ModConf";

/**
 * 应用模组配置
 *
 * @description 参考使用文档
 * @author Siaor
 * @date 2024-12-06 12:00:00
 * */
export class AppModConf extends ModConf{
    x:number = 0;
    y:number = 0;
    isDrag:boolean = true;
    name:string = '';
    url:string = '';
    logo:string = '';
}